import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todos os clientes do fotógrafo
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const photographerId = searchParams.get('photographerId')

    if (!photographerId) {
      return NextResponse.json({ error: 'ID do fotógrafo é obrigatório' }, { status: 400 })
    }

    const clients = await prisma.client.findMany({
      where: {
        photographerId
      },
      include: {
        albums: {
          include: {
            photos: true,
            _count: {
              select: {
                photos: true
              }
            }
          }
        },
        _count: {
          select: {
            albums: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ clients })

  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar novo cliente
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, photographerId } = await request.json()

    if (!name || !email || !photographerId) {
      return NextResponse.json({ 
        error: 'Nome, email e ID do fotógrafo são obrigatórios' 
      }, { status: 400 })
    }

    // Verificar se já existe cliente com este email para este fotógrafo
    const existingClient = await prisma.client.findFirst({
      where: {
        email,
        photographerId
      }
    })

    if (existingClient) {
      return NextResponse.json({ 
        error: 'Já existe um cliente com este email' 
      }, { status: 400 })
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        photographerId
      },
      include: {
        albums: true,
        _count: {
          select: {
            albums: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      client,
      message: 'Cliente criado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}