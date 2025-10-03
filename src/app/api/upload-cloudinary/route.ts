import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary, generateThumbnailUrl } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000) // 10 minutos
    
    const data = await request.formData()
    const files: File[] = data.getAll('photos') as File[]
    const albumId = data.get('albumId') as string

    clearTimeout(timeoutId)

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Nenhuma foto foi enviada' }, { status: 400 })
    }

    if (!albumId) {
      return NextResponse.json({ error: 'ID do álbum é obrigatório' }, { status: 400 })
    }

    // Verificar se álbum existe
    const album = await prisma.album.findUnique({
      where: { id: albumId }
    })

    if (!album) {
      return NextResponse.json({ error: 'Álbum não encontrado' }, { status: 404 })
    }

    const uploadedPhotos = []
    let totalSize = 0

    console.log(`Iniciando upload de ${files.length} arquivo(s) para álbum ${album.code}`)

    for (const [index, file] of files.entries()) {
      console.log(`Processando arquivo ${index + 1}/${files.length}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
      totalSize += file.size

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Gerar nome único para o arquivo
      const fileId = uuidv4()
      const fileExtension = file.name.split('.').pop() || 'jpg'
      const fileName = `${fileId}.${fileExtension}`
      
      try {
        // Upload para Cloudinary
        const cloudinaryResult = await uploadToCloudinary(
          buffer,
          `albums/${album.code}`,
          fileName.replace('.', '_')
        )

        // Gerar URL do thumbnail
        const thumbnailUrl = generateThumbnailUrl(cloudinaryResult.public_id)

        // Salvar no banco de dados
        const photo = await prisma.photo.create({
          data: {
            filename: file.name,
            cloudinaryId: cloudinaryResult.public_id,
            url: cloudinaryResult.secure_url,
            thumbnailUrl,
            size: file.size,
            width: cloudinaryResult.width,
            height: cloudinaryResult.height,
            format: cloudinaryResult.format,
            albumId: albumId,
            order: index + 1,
            isPreview: index < album.previewCount // Primeiras fotos são preview
          }
        })

        uploadedPhotos.push({
          id: photo.id,
          name: file.name,
          url: photo.url,
          thumbnailUrl: photo.thumbnailUrl,
          originalName: file.name,
          size: file.size,
          width: photo.width,
          height: photo.height,
          isPreview: photo.isPreview,
          uploadedAt: photo.uploadedAt.toISOString()
        })

        console.log(`✓ Upload concluído: ${file.name}`)

      } catch (uploadError) {
        console.error(`Erro no upload de ${file.name}:`, uploadError)
        // Continua com os próximos arquivos mesmo se um falhar
      }
    }

    console.log(`Upload concluído: ${uploadedPhotos.length}/${files.length} arquivo(s), ${(totalSize / 1024 / 1024).toFixed(2)}MB total`)

    return NextResponse.json({ 
      success: true, 
      photos: uploadedPhotos,
      message: `${uploadedPhotos.length} foto(s) enviada(s) com sucesso! Total: ${(totalSize / 1024 / 1024).toFixed(2)}MB`,
      totalSize: totalSize,
      albumCode: album.code
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}