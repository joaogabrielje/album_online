"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Photo {
  id: string
  name: string
  url: string
  file?: File
  preview?: string
}

interface PhotoUploadProps {
  albumId: string
  onPhotosUploaded: (photos: Photo[]) => void
}

export function PhotoUpload({ albumId, onPhotosUploaded }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    if (fileArray.length === 0) return

    // Validar tipos de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const invalidFiles = fileArray.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Erro",
        description: "Apenas arquivos de imagem são permitidos (JPG, PNG, GIF, WebP)",
        variant: "destructive",
      })
      return
    }

    // Validar tamanho (removido limite para fotos profissionais)
    // Apenas um aviso para arquivos muito grandes (>100MB)
    const warningSize = 100 * 1024 * 1024
    const largeFiles = fileArray.filter(file => file.size > warningSize)
    
    if (largeFiles.length > 0) {
      toast({
        title: "Arquivos Grandes Detectados",
        description: `${largeFiles.length} arquivo(s) com mais de 100MB. O upload pode demorar mais.`,
      })
    }

    // Criar previews
    const newPhotos = fileArray.map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      name: file.name,
      url: '',
      file,
      preview: URL.createObjectURL(file)
    }))

    setPhotos(prev => [...prev, ...newPhotos])
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) processFiles(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Só remove o isDragging se realmente saiu da área
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFiles(files)
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

  const uploadPhotos = async () => {
    if (photos.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma foto para enviar",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('albumId', albumId)
      
      photos.forEach(photo => {
        if (photo.file) {
          formData.append('photos', photo.file)
        }
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        })
        
        onPhotosUploaded(result.photos)
        setPhotos([])
        
        // Limpar input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        throw new Error(result.error || 'Erro no upload')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      toast({
        title: "Erro",
        description: "Erro ao enviar fotos. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de Fotos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input de arquivo */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging 
              ? 'border-primary bg-primary/10 scale-105' 
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          <label 
            htmlFor="photo-upload" 
            className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ImageIcon className="h-12 w-12" />
            <span className="text-lg font-medium">Clique para selecionar fotos</span>
            <span className="text-sm">ou arraste e solte aqui</span>
            <span className="text-xs">JPG, PNG, GIF, WebP - Sem limite de tamanho</span>
          </label>
        </div>

        {/* Preview das fotos */}
        {photos.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Fotos selecionadas ({photos.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={photo.preview}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {photo.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-2">
          <Button
            onClick={uploadPhotos}
            disabled={photos.length === 0 || uploading}
            className="flex-1"
          >
            {uploading ? 'Enviando...' : `Enviar ${photos.length} foto(s)`}
          </Button>
          
          {photos.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setPhotos([])}
              disabled={uploading}
            >
              Limpar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}