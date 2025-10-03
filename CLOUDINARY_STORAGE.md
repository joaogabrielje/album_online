# Integração com Cloudinary para Armazenamento Profissional de Fotos

## 🚀 Implementação Recomendada para Produção

### 1. Instalação das Dependências
```bash
npm install cloudinary next-cloudinary
```

### 2. Configuração do Ambiente
```env
# .env.local
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 3. API Route para Upload no Cloudinary

```typescript
// src/app/api/upload-cloudinary/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
      
      // Upload para Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: `albums/${albumId}`, // Organiza por álbum
            public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`,
            transformation: [
              { quality: 'auto', fetch_format: 'auto' }, // Otimização automática
              { width: 2048, height: 2048, crop: 'limit' } // Limita resolução máxima
            ]
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      })

      uploadedPhotos.push({
        id: result.public_id,
        name: file.name,
        url: result.secure_url,
        thumbnail: result.secure_url.replace('/upload/', '/upload/w_300,h_300,c_fill/'),
        originalName: file.name,
        size: result.bytes,
        uploadedAt: new Date().toISOString()
      })
    }

    return NextResponse.json({ 
      success: true, 
      photos: uploadedPhotos 
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
```

### 4. Componente de Upload Otimizado

```typescript
// src/components/cloudinary-upload.tsx
"use client"

import { CldUploadWidget } from 'next-cloudinary'
import { useState } from 'react'

interface CloudinaryUploadProps {
  albumId: string
  onPhotosUploaded: (photos: any[]) => void
}

export function CloudinaryUpload({ albumId, onPhotosUploaded }: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false)

  return (
    <CldUploadWidget
      uploadPreset="your_upload_preset" // Configure no Cloudinary Dashboard
      options={{
        multiple: true,
        maxFiles: 50,
        folder: `albums/${albumId}`,
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp", "tiff", "raw"],
        transformation: {
          quality: "auto",
          fetch_format: "auto"
        }
      }}
      onSuccess={(result) => {
        const photos = Array.isArray(result.info) ? result.info : [result.info]
        onPhotosUploaded(photos)
      }}
    >
      {({ open }) => (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <button
            onClick={() => open()}
            disabled={uploading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {uploading ? 'Enviando...' : 'Selecionar Fotos Profissionais'}
          </button>
          <p className="mt-2 text-sm text-gray-600">
            Suporte a RAW, TIFF, JPG - Sem limite de tamanho
          </p>
        </div>
      )}
    </CldUploadWidget>
  )
}
```

## 📊 Comparação de Soluções de Armazenamento

| Solução | Prós | Contras | Custo/Mês | Melhor Para |
|---------|------|---------|-----------|-------------|
| **Local** | Controle total, sem custos cloud | Backup manual, sem CDN, escalabilidade limitada | $0 + servidor | Desenvolvimento/testes |
| **AWS S3** | Escalável, CDN, backup automático | Complexidade inicial, curva de aprendizado | ~$50-200 | Grandes volumes |
| **Cloudinary** | Especializado em imagens, API simples, otimização automática | Mais caro por GB | ~$100-300 | Fotógrafos profissionais |
| **Google Drive API** | Familiar, integração com Google Photos | Limitações de API, não é para produção | ~$10-50 | Pequenos projetos |

## 🏆 Recomendação Final

### **Para Fotógrafos Profissionais: Cloudinary**

**Vantagens específicas:**
- ✅ **Sem limite de tamanho** (até 100MB por arquivo no plano pago)
- ✅ **Suporte a RAW** (Canon .cr2, Nikon .nef, etc.)
- ✅ **Otimização automática** (WebP, compressão inteligente)
- ✅ **CDN global** (fotos carregam rápido no mundo todo)
- ✅ **Transformações on-demand** (redimensionar sem reprocessar)
- ✅ **Backup automático** com redundância
- ✅ **API simples** de integrar

**Custos estimados:**
- Até 25GB: **Gratuito**
- 25GB-200GB: **$89/mês**
- Acima de 200GB: **$249/mês**

### **Implementação Híbrida Recomendada:**

1. **Upload inicial:** Local (para velocidade)
2. **Processamento:** Cloudinary (otimização)
3. **Entrega:** CDN do Cloudinary (performance)
4. **Backup:** AWS S3 Glacier (custo baixo)

Esta abordagem oferece:
- ⚡ Upload rápido para o fotógrafo
- 🖼️ Otimização automática de imagens
- 🌍 Entrega global rápida
- 💾 Backup seguro e barato
- 📱 Responsividade automática

Quer que eu implemente a integração com Cloudinary no projeto?