"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Eye, X, ZoomIn } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Photo {
  id: string
  name: string
  url: string
  originalName?: string
  size?: number
  uploadedAt?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
  albumId: string
  canDownload?: boolean
}

export function PhotoGallery({ photos, albumId, canDownload = true }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const { toast } = useToast()

  const downloadPhoto = async (photo: Photo) => {
    if (!canDownload) return

    setDownloading(photo.id)

    try {
      const response = await fetch(`/api/download?path=${encodeURIComponent(photo.url)}&name=${encodeURIComponent(photo.originalName || photo.name)}`)
      
      if (!response.ok) {
        throw new Error('Erro no download')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = photo.originalName || photo.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)

      toast({
        title: "Download concluído!",
        description: `${photo.name} foi baixada com sucesso.`,
      })
    } catch (error) {
      console.error('Erro no download:', error)
      toast({
        title: "Erro",
        description: "Erro ao baixar a foto. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setDownloading(null)
    }
  }

  const downloadAllPhotos = async () => {
    if (!canDownload || photos.length === 0) return

    toast({
      title: "Preparando downloads...",
      description: "O download de todas as fotos será iniciado em breve.",
    })

    // Download sequencial para evitar sobrecarga
    for (const photo of photos) {
      await downloadPhoto(photo)
      // Pequena pausa entre downloads
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma foto encontrada neste álbum.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho com contadores e ações */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {photos.length} foto(s) no álbum
        </div>
        {canDownload && photos.length > 1 && (
          <Button
            onClick={downloadAllPhotos}
            variant="outline"
            size="sm"
            disabled={downloading !== null}
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar Todas
          </Button>
        )}
      </div>

      {/* Grid de fotos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group">
            <CardContent className="p-0 relative">
              <div className="aspect-square bg-muted">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              {/* Overlay com ações */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {canDownload && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadPhoto(photo)}
                      disabled={downloading === photo.id}
                    >
                      {downloading === photo.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Nome da foto */}
              <div className="p-2">
                <p className="text-xs text-muted-foreground truncate">
                  {photo.name}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de visualização */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-medium">{selectedPhoto.name}</p>
              {selectedPhoto.uploadedAt && (
                <p className="text-white/70 text-sm">
                  Enviada em: {new Date(selectedPhoto.uploadedAt).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>

            {canDownload && (
              <Button
                className="absolute top-4 right-4"
                onClick={() => downloadPhoto(selectedPhoto)}
                disabled={downloading === selectedPhoto.id}
              >
                {downloading === selectedPhoto.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}