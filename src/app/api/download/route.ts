import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const photoPath = searchParams.get('path')
    const fileName = searchParams.get('name')

    if (!photoPath) {
      return NextResponse.json({ error: 'Caminho da foto é obrigatório' }, { status: 400 })
    }

    // Construir caminho completo
    const fullPath = join(process.cwd(), 'public', photoPath)
    
    // Ler arquivo
    const fileBuffer = await readFile(fullPath)
    
    // Determinar tipo de conteúdo baseado na extensão
    const extension = photoPath.split('.').pop()?.toLowerCase()
    const contentType = getContentType(extension || '')
    
    // Retornar arquivo com headers apropriados para download
    return new NextResponse(fileBuffer as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName || 'photo'}"`,
        'Cache-Control': 'public, max-age=31536000',
      },
    })

  } catch (error) {
    console.error('Erro no download:', error)
    return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 })
  }
}

function getContentType(extension: string): string {
  const types: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff',
  }
  
  return types[extension] || 'application/octet-stream'
}