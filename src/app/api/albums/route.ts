import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar álbuns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const photographerId = searchParams.get('photographerId')
    const clientId = searchParams.get('clientId')
    const code = searchParams.get('code')

    if (code) {
      // Buscar álbum específico por código
      const album = await prisma.album.findUnique({
        where: { code },
        include: {
          client: true,
          photos: {
            orderBy: { order: 'asc' }
          }
        }
      })

      if (!album) {
        return NextResponse.json({ error: 'Álbum não encontrado' }, { status: 404 })
      }

      return NextResponse.json({ album })
    }

    let where: any = {}
    
    if (photographerId) {
      where.photographerId = photographerId
    }
    
    if (clientId) {
      where.clientId = clientId
    }

    const albums = await prisma.album.findMany({
      where,
      include: {
        client: true,
        photos: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            photos: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ albums })

  } catch (error) {
    console.error('Erro ao buscar álbuns:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar novo álbum
export async function POST(request: NextRequest) {
  try {
    const { 
      code, 
      title, 
      description, 
      password, 
      clientId, 
      photographerId,
      previewCount = 5,
      price = 299.99 
    } = await request.json()

    if (!code || !title || !password || !clientId || !photographerId) {
      return NextResponse.json({ 
        error: 'Código, título, senha, cliente e fotógrafo são obrigatórios' 
      }, { status: 400 })
    }

    // Verificar se já existe álbum com este código
    const existingAlbum = await prisma.album.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (existingAlbum) {
      return NextResponse.json({ 
        error: 'Já existe um álbum com este código' 
      }, { status: 400 })
    }

    // Verificar se cliente existe
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      return NextResponse.json({ 
        error: 'Cliente não encontrado' 
      }, { status: 404 })
    }

    const album = await prisma.album.create({
      data: {
        code: code.toUpperCase(),
        title,
        description,
        password,
        clientId,
        photographerId,
        previewCount: parseInt(previewCount),
        price: parseFloat(price)
      },
      include: {
        client: true,
        photos: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      album,
      message: 'Álbum criado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao criar álbum:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT - Atualizar álbum
export async function PUT(request: NextRequest) {
  try {
    const { 
      id,
      title, 
      description, 
      password, 
      previewCount,
      price,
      isPaid,
      status
    } = await request.json()

    if (!id) {
      return NextResponse.json({ 
        error: 'ID do álbum é obrigatório' 
      }, { status: 400 })
    }

    const updateData: any = {}
    
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (password !== undefined) updateData.password = password
    if (previewCount !== undefined) updateData.previewCount = parseInt(previewCount)
    if (price !== undefined) updateData.price = parseFloat(price)
    if (isPaid !== undefined) updateData.isPaid = isPaid
    if (status !== undefined) updateData.status = status

    const album = await prisma.album.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        photos: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      album,
      message: 'Álbum atualizado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao atualizar álbum:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}