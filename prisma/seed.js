const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar fotógrafo padrão
  const photographer = await prisma.user.upsert({
    where: { email: 'fotografo@demo.com' },
    update: {},
    create: {
      email: 'fotografo@demo.com',
      name: 'João Fotógrafo',
      password: await bcrypt.hash('admin123', 10),
      phone: '(11) 99999-9999',
    },
  })

  console.log('✓ Fotógrafo criado:', photographer.email)

  // Criar clientes de exemplo
  const client1 = await prisma.client.upsert({
    where: { email: 'joao.silva@email.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 98888-8888',
      photographerId: photographer.id,
    },
  })

  const client2 = await prisma.client.upsert({
    where: { email: 'ana.costa@email.com' },
    update: {},
    create: {
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      phone: '(11) 97777-7777',
      photographerId: photographer.id,
    },
  })

  console.log('✓ Clientes criados:', client1.name, client2.name)

  // Criar álbuns de exemplo
  const album1 = await prisma.album.upsert({
    where: { code: 'DEMO2024' },
    update: {},
    create: {
      code: 'DEMO2024',
      title: 'Casamento João & Maria',
      description: 'Álbum do casamento realizado em 15 de janeiro de 2024',
      password: '123456',
      previewCount: 5,
      price: 299.99,
      isPaid: true,
      clientId: client1.id,
      photographerId: photographer.id,
    },
  })

  const album2 = await prisma.album.upsert({
    where: { code: 'FAMILY2024' },
    update: {},
    create: {
      code: 'FAMILY2024',
      title: 'Ensaio Família Costa',
      description: 'Ensaio familiar realizado em estúdio',
      password: 'familia123',
      previewCount: 3,
      price: 199.99,
      isPaid: false,
      clientId: client2.id,
      photographerId: photographer.id,
    },
  })

  const album3 = await prisma.album.upsert({
    where: { code: 'WEDDING2024' },
    update: {},
    create: {
      code: 'WEDDING2024',
      title: 'Casamento Carlos & Lucia',
      description: 'Cerimônia e festa de casamento',
      password: 'casamento2024',
      previewCount: 8,
      price: 399.99,
      isPaid: true,
      clientId: client1.id, // João Silva tem 2 álbuns
      photographerId: photographer.id,
    },
  })

  console.log('✓ Álbuns criados:', album1.code, album2.code, album3.code)

  // Criar fotos de exemplo (placeholder)
  const samplePhotos = [
    { albumId: album1.id, filename: 'casamento_001.jpg', isPreview: true, order: 1 },
    { albumId: album1.id, filename: 'casamento_002.jpg', isPreview: true, order: 2 },
    { albumId: album1.id, filename: 'casamento_003.jpg', isPreview: true, order: 3 },
    { albumId: album1.id, filename: 'casamento_004.jpg', isPreview: true, order: 4 },
    { albumId: album1.id, filename: 'casamento_005.jpg', isPreview: true, order: 5 },
    { albumId: album1.id, filename: 'casamento_006.jpg', isPreview: false, order: 6 },
    
    { albumId: album2.id, filename: 'familia_001.jpg', isPreview: true, order: 1 },
    { albumId: album2.id, filename: 'familia_002.jpg', isPreview: true, order: 2 },
    { albumId: album2.id, filename: 'familia_003.jpg', isPreview: true, order: 3 },
    { albumId: album2.id, filename: 'familia_004.jpg', isPreview: false, order: 4 },
  ]

  for (const photoData of samplePhotos) {
    await prisma.photo.create({
      data: {
        filename: photoData.filename,
        cloudinaryId: `placeholder_${photoData.filename}`,
        url: `/api/placeholder/800/600?text=${encodeURIComponent(photoData.filename)}`,
        thumbnailUrl: `/api/placeholder/300/300?text=${encodeURIComponent(photoData.filename)}`,
        size: 1024 * 1024, // 1MB placeholder
        width: 800,
        height: 600,
        format: 'jpg',
        isPreview: photoData.isPreview,
        order: photoData.order,
        albumId: photoData.albumId,
      },
    })
  }

  console.log('✓ Fotos de exemplo criadas')

  console.log('🎉 Seed concluído com sucesso!')
  console.log('')
  console.log('📋 Dados de acesso:')
  console.log('🔐 Fotógrafo: fotografo@demo.com / admin123')
  console.log('🏷️  Álbuns: DEMO2024/123456, FAMILY2024/familia123, WEDDING2024/casamento2024')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })