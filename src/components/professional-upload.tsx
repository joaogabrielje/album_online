"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Upload, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Photo {
  id: string
  name: string
  url: string
  file?: File
  preview?: string
  status?: 'pending' | 'uploading' | 'completed' | 'error'
  progress?: number
}

interface ProfessionalUploadProps {
  albumId: string
  onPhotosUploaded: (photos: Photo[]) => void
}

export function ProfessionalUpload({ albumId, onPhotosUploaded }: ProfessionalUploadProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [totalProgress, setTotalProgress] = useState(0)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    if (files.length === 0) return

    // Validar apenas tipos de arquivo (sem limite de tamanho)
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'image/tiff', 'image/tif', 'image/bmp', 'image/raw',
      // RAW formats
      'image/x-canon-cr2', 'image/x-canon-crw', 'image/x-nikon-nef',
      'image/x-sony-arw', 'image/x-adobe-dng'
    ]
    
    const invalidFiles = files.filter(file => !validTypes.some(type => 
      file.type === type || file.name.toLowerCase().includes(type.split('/')[1])
    ))
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Tipos de arquivo não suportados",
        description: `${invalidFiles.length} arquivo(s) não são imagens válidas`,
        variant: "destructive",
      })
    }

    const validFiles = files.filter(file => !invalidFiles.includes(file))
    
    if (validFiles.length === 0) return

    // Criar previews e estados
    const newPhotos = validFiles.map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      name: file.name,
      url: '',
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'pending' as const,
      progress: 0
    }))

    setPhotos(prev => [...prev, ...newPhotos])
    
    // Mostrar informações sobre arquivos grandes
    const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0)
    const largeFiles = validFiles.filter(file => file.size > 50 * 1024 * 1024) // >50MB
    
    if (largeFiles.length > 0) {
      toast({
        title: "Arquivos Profissionais Detectados",
        description: `${largeFiles.length} arquivo(s) RAW/Alta resolução (${(totalSize / 1024 / 1024).toFixed(1)}MB total)`,
      })
    }
  }

  const uploadPhotos = async () => {
    if (photos.filter(p => p.status === 'pending').length === 0) return

    setUploading(true)
    setTotalProgress(0)

    try {
      const pendingPhotos = photos.filter(p => p.status === 'pending')
      const totalFiles = pendingPhotos.length
      let completedFiles = 0

      // Upload um por vez para arquivos muito grandes (>100MB)
      // ou em lote para arquivos menores
      const largeFiles = pendingPhotos.filter(p => p.file!.size > 100 * 1024 * 1024)
      const smallFiles = pendingPhotos.filter(p => p.file!.size <= 100 * 1024 * 1024)

      // Função para atualizar progresso individual
      const updatePhotoProgress = (photoId: string, progress: number, status: Photo['status']) => {
        setPhotos(prev => prev.map(p => 
          p.id === photoId ? { ...p, progress, status } : p
        ))
      }

      // Upload arquivos pequenos em lote
      if (smallFiles.length > 0) {
        const formData = new FormData()
        formData.append('albumId', albumId)
        
        smallFiles.forEach(photo => {
          if (photo.file) {
            formData.append('photos', photo.file)
            updatePhotoProgress(photo.id, 50, 'uploading')
          }
        })

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          smallFiles.forEach(photo => {
            updatePhotoProgress(photo.id, 100, 'completed')
          })
          completedFiles += smallFiles.length
        }
      }

      // Upload arquivos grandes individualmente
      for (const photo of largeFiles) {
        if (!photo.file) continue

        updatePhotoProgress(photo.id, 10, 'uploading')

        const formData = new FormData()
        formData.append('albumId', albumId)
        formData.append('photos', photo.file)

        try {
          updatePhotoProgress(photo.id, 50, 'uploading')
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          const result = await response.json()

          if (result.success) {
            updatePhotoProgress(photo.id, 100, 'completed')
            completedFiles++
          } else {
            updatePhotoProgress(photo.id, 0, 'error')
          }
        } catch (error) {
          console.error(`Erro no upload de ${photo.name}:`, error)
          updatePhotoProgress(photo.id, 0, 'error')
        }

        // Atualizar progresso total
        setTotalProgress((completedFiles / totalFiles) * 100)
      }

      // Notificar componente pai
      const completedPhotos = photos.filter(p => p.status === 'completed')
      if (completedPhotos.length > 0) {
        onPhotosUploaded(completedPhotos)
      }

      toast({
        title: "Upload Concluído!",
        description: `${completedFiles} foto(s) profissional(is) enviada(s) com sucesso!`,
      })

    } catch (error) {
      console.error('Erro no upload:', error)
      toast({
        title: "Erro no Upload",
        description: "Erro ao enviar fotos. Verifique sua conexão e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (photoId: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === photoId)
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview)
      }
      return prev.filter(p => p.id !== photoId)
    })
  }

  const pendingPhotos = photos.filter(p => p.status === 'pending')
  const uploadingPhotos = photos.filter(p => p.status === 'uploading')
  const completedPhotos = photos.filter(p => p.status === 'completed')
  const errorPhotos = photos.filter(p => p.status === 'error')

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Profissional de Fotos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Suporte completo a arquivos RAW, TIFF e alta resolução sem limite de tamanho
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input de arquivo */}
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <input
            type="file"
            multiple
            accept="image/*,.raw,.cr2,.nef,.arw,.dng,.tiff,.tif"
            onChange={handleFileSelect}
            className="hidden"
            id="professional-upload"
            disabled={uploading}
          />
          <label 
            htmlFor="professional-upload" 
            className={`cursor-pointer flex flex-col items-center gap-2 ${
              uploading ? 'text-muted-foreground' : 'text-muted-foreground hover:text-primary'
            } transition-colors`}
          >
            <Upload className="h-12 w-12" />
            <span className="text-lg font-medium">Selecionar Fotos Profissionais</span>
            <span className="text-sm">JPG, PNG, RAW, TIFF, WebP</span>
            <span className="text-xs font-semibold text-green-600">✓ Sem limite de tamanho</span>
          </label>
        </div>

        {/* Progresso geral */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso do Upload</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} />
          </div>
        )}

        {/* Lista de fotos */}
        {photos.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">
                Fotos Selecionadas ({photos.length})
              </h4>
              <div className="flex gap-2 text-xs">
                {pendingPhotos.length > 0 && <span className="text-yellow-600">⏳ {pendingPhotos.length} pendente(s)</span>}
                {uploadingPhotos.length > 0 && <span className="text-blue-600">📤 {uploadingPhotos.length} enviando</span>}
                {completedPhotos.length > 0 && <span className="text-green-600">✅ {completedPhotos.length} concluída(s)</span>}
                {errorPhotos.length > 0 && <span className="text-red-600">❌ {errorPhotos.length} erro(s)</span>}
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {photos.map((photo) => (
                <div key={photo.id} className="flex items-center gap-3 p-2 border rounded">
                  <div className="flex-shrink-0">
                    {photo.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {photo.status === 'uploading' && <Upload className="h-5 w-5 text-blue-600 animate-pulse" />}
                    {photo.status === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
                    {photo.status === 'pending' && <div className="h-5 w-5 rounded-full bg-gray-300" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{photo.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {photo.file ? `${(photo.file.size / 1024 / 1024).toFixed(1)}MB` : ''}
                      {photo.status === 'uploading' && ` • ${photo.progress}%`}
                    </p>
                  </div>

                  {photo.status === 'uploading' && (
                    <div className="flex-shrink-0 w-16">
                      <Progress value={photo.progress} className="h-1" />
                    </div>
                  )}

                  {(photo.status === 'pending' || photo.status === 'error') && !uploading && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removePhoto(photo.id)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-2">
          <Button
            onClick={uploadPhotos}
            disabled={pendingPhotos.length === 0 || uploading}
            className="flex-1"
          >
            {uploading ? 'Enviando Fotos...' : `Enviar ${pendingPhotos.length} Foto(s)`}
          </Button>
          
          {photos.length > 0 && !uploading && (
            <Button
              variant="outline"
              onClick={() => setPhotos([])}
            >
              Limpar Lista
            </Button>
          )}
        </div>

        {/* Informações técnicas */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
          <p><strong>Formatos suportados:</strong> JPEG, PNG, TIFF, WebP, RAW (CR2, NEF, ARW, DNG)</p>
          <p><strong>Tamanho:</strong> Sem limite (otimizado para arquivos até 500MB)</p>
          <p><strong>Upload:</strong> Arquivos grandes são processados individualmente para maior confiabilidade</p>
        </div>
      </CardContent>
    </Card>
  )
}