import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    // Configurar timeout maior para arquivos grandes
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

    const uploadedPhotos = []
    let totalSize = 0

    // Log do progresso para arquivos grandes
    console.log(`Iniciando upload de ${files.length} arquivo(s) para álbum ${albumId}`)

    for (const [index, file] of files.entries()) {
      console.log(`Processando arquivo ${index + 1}/${files.length}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
      totalSize += file.size
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Gerar nome único para o arquivo
      const fileExtension = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExtension}`
      
      // Caminho do arquivo
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'albums', albumId)
      
      // Criar diretório se não existir
      const fs = require('fs')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      const filePath = join(uploadDir, fileName)
      
      // Salvar arquivo
      await writeFile(filePath, buffer)
      
      // URL pública da foto
      const photoUrl = `/uploads/albums/${albumId}/${fileName}`
      
      uploadedPhotos.push({
        id: uuidv4(),
        name: file.name,
        url: photoUrl,
        originalName: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString()
      })
    }

    console.log(`Upload concluído: ${uploadedPhotos.length} arquivo(s), ${(totalSize / 1024 / 1024).toFixed(2)}MB total`)

    return NextResponse.json({ 
      success: true, 
      photos: uploadedPhotos,
      message: `${uploadedPhotos.length} foto(s) enviada(s) com sucesso! Total: ${(totalSize / 1024 / 1024).toFixed(2)}MB`,
      totalSize: totalSize
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}