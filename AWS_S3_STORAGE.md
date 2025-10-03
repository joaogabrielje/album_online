# Integração AWS S3 - Alternativa Econômica

## 🏗️ Configuração AWS S3 + CloudFront

### 1. Dependências
```bash
npm install aws-sdk @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Configuração
```env
# .env.local
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=photographer-albums
AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain.com
```

### 3. API Route S3
```typescript
// src/app/api/upload-s3/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const files: File[] = data.getAll('photos') as File[]
    const albumId = data.get('albumId') as string

    const uploadedPhotos = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const fileKey = `albums/${albumId}/${uuidv4()}-${file.name}`
      
      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
          originalName: file.name,
          albumId: albumId,
          uploadedAt: new Date().toISOString(),
        }
      })

      await s3Client.send(uploadCommand)

      const photoUrl = `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/${fileKey}`
      
      uploadedPhotos.push({
        id: uuidv4(),
        name: file.name,
        url: photoUrl,
        originalName: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString()
      })
    }

    return NextResponse.json({ 
      success: true, 
      photos: uploadedPhotos 
    })

  } catch (error) {
    console.error('Erro no upload S3:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
```

## 💰 Comparação de Custos Reais

### **Cenário: Fotógrafo com 500GB de fotos/mês**

| Solução | Setup | Armazenamento | Transferência | CDN | Total/Mês |
|---------|-------|---------------|---------------|-----|-----------|
| **Local** | $200 (servidor) | $0 | $50 (banda) | $0 | ~$250 |
| **AWS S3** | $0 | $11.50 | $45 | $10 | ~$66.50 |
| **Cloudinary** | $0 | $249 | Incluído | Incluído | $249 |
| **Google Cloud** | $0 | $10 | $40 | $8 | ~$58 |

### **Recomendações por Volume:**

#### **🏠 Pequeno (< 50GB/mês)**
- **Solução:** Cloudinary Free + Local backup
- **Custo:** $0-10/mês
- **Ideal para:** Fotógrafos iniciantes

#### **🏢 Médio (50-200GB/mês)** 
- **Solução:** AWS S3 + CloudFront
- **Custo:** $30-80/mês
- **Ideal para:** Fotógrafos estabelecidos

#### **🏭 Grande (200GB+/mês)**
- **Solução:** AWS S3 + Custom CDN
- **Custo:** $80-200/mês
- **Ideal para:** Estúdios fotográficos

## 🔧 Implementação Progressiva

### **Fase 1: Atual (Local)**
✅ Funciona para desenvolvimento
✅ Sem custos de cloud
❌ Não escala para produção

### **Fase 2: Híbrido (Local + Cloud)**
```typescript
// Upload primeiro local, depois sync para cloud
const uploadToCloud = async (localPath: string) => {
  // Background job para upload na cloud
  await uploadToS3(localPath)
  await deleteLocal(localPath) // Limpa espaço local
}
```

### **Fase 3: Full Cloud**
- Todo upload direto na cloud
- CDN para entrega global
- Backup automático

Quer que implemente alguma dessas soluções específicas?