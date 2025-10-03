"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Camera, Eye, Lock, ArrowLeft, Download, Play, Pause, VolumeX, Volume2, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { PhotoGallery } from '@/components/photo-gallery'
import type { Album, Photo, AlbumCustomization } from '@/types'

// Mock data para demonstração - diferentes álbuns com suas personalizações
const MOCK_ALBUMS_DATA: { [key: string]: Album } = {
  'WEDDING2024': {
    id: 1,
    code: 'WEDDING2024',
    title: 'Casamento João & Maria',
    clientName: 'João Silva',
    clientEmail: 'joao@email.com',
    totalPhotos: 24,
    previewPhotos: 10,
    isPaid: true,
    createdAt: '2024-09-15',
    price: 599.99,
    photos: [
      { id: 1, url: '/api/placeholder/800/600', preview: true, title: 'Cerimônia' },
      { id: 2, url: '/api/placeholder/600/800', preview: true, title: 'Votos' },
      { id: 3, url: '/api/placeholder/800/1000', preview: true, title: 'Aliança' },
      { id: 4, url: '/api/placeholder/900/600', preview: true, title: 'Festa' },
      { id: 5, url: '/api/placeholder/700/900', preview: true, title: 'Dança' },
      { id: 6, url: '/api/placeholder/800/700', preview: true, title: 'Brinde' },
      { id: 7, url: '/api/placeholder/600/900', preview: true, title: 'Família' },
      { id: 8, url: '/api/placeholder/1000/800', preview: true, title: 'Noivos' },
      { id: 9, url: '/api/placeholder/800/800', preview: false, title: 'Decoração' },
      { id: 10, url: '/api/placeholder/900/700', preview: false, title: 'Mesa' },
      { id: 11, url: '/api/placeholder/700/800', preview: false, title: 'Convidados' },
      { id: 12, url: '/api/placeholder/800/900', preview: false, title: 'Buquê' },
      { id: 13, url: '/api/placeholder/600/700', preview: false, title: 'Bolo' },
      { id: 14, url: '/api/placeholder/1100/800', preview: false, title: 'Primeira Dança' },
      { id: 15, url: '/api/placeholder/800/600', preview: false, title: 'Abraço' },
      { id: 16, url: '/api/placeholder/700/1000', preview: false, title: 'Sorriso' },
      { id: 17, url: '/api/placeholder/900/800', preview: false, title: 'Momento' },
      { id: 18, url: '/api/placeholder/800/1100', preview: false, title: 'Alegria' },
      { id: 19, url: '/api/placeholder/600/800', preview: false, title: 'Emoção' },
      { id: 20, url: '/api/placeholder/1000/700', preview: false, title: 'União' },
      { id: 21, url: '/api/placeholder/800/900', preview: false, title: 'Felicidade' },
      { id: 22, url: '/api/placeholder/700/800', preview: false, title: 'Amor' },
      { id: 23, url: '/api/placeholder/900/1000', preview: false, title: 'Eternidade' },
      { id: 24, url: '/api/placeholder/800/700', preview: false, title: 'Final' },
    ],
    customization: {
      theme: {
        primaryColor: '#ff6b6b',
        secondaryColor: '#4ecdc4',
        backgroundColor: 'linear-gradient(135deg, #fff5f5 0%, #fef7ff 100%)',
        textColor: '#2d3748'
      },
      banner: {
        imageUrl: '/api/placeholder/1200/400',
        title: 'João & Maria',
        subtitle: 'Uma história de amor eterna ❤️'
      },
      music: {
        enabled: true,
        url: '/audio/wedding-song.mp3',
        autoplay: false,
        volume: 0.3
      },
      inspirationalQuote: 'O amor é a ponte entre duas almas que se encontraram para sempre.',
      layout: 'masonry',
      showWatermark: true
    }
  },
  'MATERNITY2024': {
    id: 2,
    code: 'MATERNITY2024', 
    title: 'Ensaio Gestante Ana',
    clientName: 'Ana Costa',
    clientEmail: 'ana@email.com',
    totalPhotos: 18,
    previewPhotos: 6,
    isPaid: true,
    createdAt: '2024-09-20',
    price: 399.99,
    photos: [
      { id: 1, url: '/api/placeholder/700/900', preview: true, title: 'Perfil' },
      { id: 2, url: '/api/placeholder/800/1000', preview: true, title: 'Natureza' },
      { id: 3, url: '/api/placeholder/600/800', preview: true, title: 'Ternura' },
      { id: 4, url: '/api/placeholder/900/700', preview: true, title: 'Expectativa' },
      { id: 5, url: '/api/placeholder/800/800', preview: true, title: 'Casal' },
      { id: 6, url: '/api/placeholder/700/1000', preview: true, title: 'Barriga' },
      { id: 7, url: '/api/placeholder/800/900', preview: false, title: 'Luz' },
      { id: 8, url: '/api/placeholder/600/700', preview: false, title: 'Conexão' },
      { id: 9, url: '/api/placeholder/1000/800', preview: false, title: 'Preparação' },
      { id: 10, url: '/api/placeholder/700/800', preview: false, title: 'Sonhos' },
      { id: 11, url: '/api/placeholder/800/1100', preview: false, title: 'Família' },
      { id: 12, url: '/api/placeholder/900/800', preview: false, title: 'Vida' },
      { id: 13, url: '/api/placeholder/800/700', preview: false, title: 'Crescimento' },
      { id: 14, url: '/api/placeholder/600/900', preview: false, title: 'Esperança' },
      { id: 15, url: '/api/placeholder/1100/800', preview: false, title: 'Futuro' },
      { id: 16, url: '/api/placeholder/800/1000', preview: false, title: 'Milagre' },
      { id: 17, url: '/api/placeholder/700/800', preview: false, title: 'Chegada' },
      { id: 18, url: '/api/placeholder/900/900', preview: false, title: 'Amor Infinito' },
    ],
    customization: {
      theme: {
        primaryColor: '#ff9ff3',
        secondaryColor: '#54a0ff',
        backgroundColor: 'linear-gradient(135deg, #fef7ff 0%, #f0f9ff 100%)',
        textColor: '#2d3748'
      },
      banner: {
        title: 'Esperando Você',
        subtitle: 'Momentos únicos de uma nova vida chegando 🤱'
      },
      music: {
        enabled: true,
        autoplay: false,
        volume: 0.2
      },
      inspirationalQuote: 'A vida é o milagre mais bonito que existe.',
      layout: 'grid',
      showWatermark: false
    }
  },
  'BIRTHDAY2024': {
    id: 3,
    code: 'BIRTHDAY2024',
    title: 'Aniversário 15 anos Sofia',
    clientName: 'Maria Santos',
    clientEmail: 'maria@email.com',
    totalPhotos: 20,
    previewPhotos: 8,
    isPaid: true,
    createdAt: '2024-09-10',
    price: 449.99,
    photos: [
      { id: 1, url: '/api/placeholder/800/800', preview: true, title: 'Aniversariante' },
      { id: 2, url: '/api/placeholder/700/900', preview: true, title: 'Sorriso' },
      { id: 3, url: '/api/placeholder/900/700', preview: true, title: 'Vestido' },
      { id: 4, url: '/api/placeholder/600/800', preview: true, title: 'Decoração' },
      { id: 5, url: '/api/placeholder/1000/800', preview: true, title: 'Mesa' },
      { id: 6, url: '/api/placeholder/800/1000', preview: true, title: 'Bolo' },
      { id: 7, url: '/api/placeholder/700/800', preview: true, title: 'Amigos' },
      { id: 8, url: '/api/placeholder/800/900', preview: true, title: 'Família' },
      { id: 9, url: '/api/placeholder/900/800', preview: false, title: 'Festa' },
      { id: 10, url: '/api/placeholder/800/700', preview: false, title: 'Dança' },
      { id: 11, url: '/api/placeholder/600/900', preview: false, title: 'Alegria' },
      { id: 12, url: '/api/placeholder/1100/800', preview: false, title: 'Celebração' },
      { id: 13, url: '/api/placeholder/800/800', preview: false, title: 'Diversão' },
      { id: 14, url: '/api/placeholder/700/1000', preview: false, title: 'Juventude' },
      { id: 15, url: '/api/placeholder/900/700', preview: false, title: 'Momento Especial' },
      { id: 16, url: '/api/placeholder/800/900', preview: false, title: 'Quinze Anos' },
      { id: 17, url: '/api/placeholder/600/800', preview: false, title: 'Sonhos' },
      { id: 18, url: '/api/placeholder/1000/900', preview: false, title: 'Futuro' },
      { id: 19, url: '/api/placeholder/800/1100', preview: false, title: 'Beleza' },
      { id: 20, url: '/api/placeholder/700/800', preview: false, title: 'Inesquecível' },
    ],
    customization: {
      theme: {
        primaryColor: '#10b981',
        secondaryColor: '#34d399',
        backgroundColor: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
        textColor: '#065f46'
      },
      banner: {
        title: 'Sofia 15 Anos! 🎂',
        subtitle: 'Uma festa mágica e inesquecível'
      },
      music: {
        enabled: true,
        autoplay: true,
        volume: 0.2
      },
      inspirationalQuote: 'A juventude é o tempo de semear sonhos! ✨',
      layout: 'carousel',
      showWatermark: true
    }
  }
}

interface CustomAlbumViewerProps {
  albumCode: string
}

export default function CustomAlbumViewer() {
  const params = useParams()
  const router = useRouter()
  const albumCode = params?.albumCode as string
  
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showQuote, setShowQuote] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Simular carregamento do álbum
    setTimeout(() => {
      const albumData = MOCK_ALBUMS_DATA[albumCode]
      if (albumData) {
        setAlbum(albumData)
      }
      setLoading(false)
    }, 1000)
  }, [albumCode])

  useEffect(() => {
    // Configurar áudio quando o álbum carregar
    if (album?.customization?.music.enabled && audioRef.current) {
      audioRef.current.volume = album.customization.music.volume
      if (album.customization.music.autoplay) {
        setTimeout(() => {
          handlePlayPause()
        }, 2000) // Delay para melhor UX
      }
    }
  }, [album])

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          toast({
            title: "Erro no áudio",
            description: "Não foi possível reproduzir a música. Clique novamente para tentar.",
            variant: "destructive"
          })
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleDownload = (photoId?: number) => {
    const message = photoId 
      ? `Download da foto ${photoId} iniciado`
      : "Download de todas as fotos iniciado"
    
    toast({
      title: "Download iniciado",
      description: message,
    })
  }

  const handleShare = () => {
    const shareData = {
      title: album?.title || 'Álbum de Fotos',
      text: `Confira este álbum incrível: ${album?.title}`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copiado!",
        description: "O link do álbum foi copiado para a área de transferência.",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #fef7ff 100%)' }}>
        <div className="text-center">
          <Camera className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando seu álbum personalizado...</p>
        </div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Camera className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Álbum não encontrado</h2>
          <p className="text-gray-600 mb-6">
            O álbum solicitado não foi encontrado ou você não tem acesso a ele.
          </p>
          <Link href="/client/dashboard">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Meus Álbuns
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const customization = album.customization!
  const dynamicStyles = {
    '--primary-color': customization.theme.primaryColor,
    '--secondary-color': customization.theme.secondaryColor,
    '--text-color': customization.theme.textColor,
  } as React.CSSProperties

  return (
    <div 
      className="min-h-screen album-viewer"
      style={{ 
        background: customization.theme.backgroundColor,
        color: customization.theme.textColor,
        ...dynamicStyles
      }}
    >
      {/* Audio Element */}
      {customization.music.enabled && customization.music.url && (
        <audio
          ref={audioRef}
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            toast({
              title: "Erro no áudio",
              description: "Não foi possível carregar a música de fundo.",
              variant: "destructive"
            })
          }}
        >
          <source src={customization.music.url} type="audio/mpeg" />
        </audio>
      )}

      {/* Floating Music Controls */}
      {customization.music.enabled && (
        <div className="fixed top-4 right-4 z-50 flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePlayPause}
            className="bg-white/80 backdrop-blur-sm border-white/20"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleMute}
            className="bg-white/80 backdrop-blur-sm border-white/20"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Header minimalista */}
      <header className="absolute top-4 left-4 right-4 z-40 flex justify-between items-center">
        <Link href="/client/dashboard">
          <Button 
            size="sm"
            className="bg-white/20 backdrop-blur-sm border-white/20 hover:bg-white/30 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        
        <Button
          size="sm"
          onClick={handleShare}
          className="bg-white/20 backdrop-blur-sm border-white/20 hover:bg-white/30 text-white"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      </header>

      {/* Banner Personalizado Imersivo */}
      {customization.banner && (
        <section className="relative h-screen overflow-hidden flex items-center justify-center">
          {customization.banner.imageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: `url(${customization.banner.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ) : (
            <div 
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(135deg, ${customization.theme.primaryColor}40, ${customization.theme.secondaryColor}40)` 
              }}
            />
          )}
          
          <div className="relative z-10 text-center px-4 max-w-4xl">
            {customization.banner.title && (
              <h1 
                className="text-7xl md:text-9xl font-bold mb-6 drop-shadow-2xl animate-fade-in"
                style={{ 
                  color: customization.banner.imageUrl ? 'white' : customization.theme.textColor,
                  fontFamily: 'serif'
                }}
              >
                {customization.banner.title}
              </h1>
            )}
            {customization.banner.subtitle && (
              <p 
                className="text-2xl md:text-3xl drop-shadow-lg animate-fade-in-delay"
                style={{ 
                  color: customization.banner.imageUrl ? 'white' : customization.theme.textColor,
                  opacity: 0.9
                }}
              >
                {customization.banner.subtitle}
              </p>
            )}
            
            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div 
                className="w-1 h-16 rounded-full opacity-60"
                style={{ backgroundColor: customization.banner.imageUrl ? 'white' : customization.theme.primaryColor }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Frase Inspiradora */}
      {customization.inspirationalQuote && showQuote && (
        <section className="py-12 px-4">
          <div className="container mx-auto text-center">
            <Card className="max-w-2xl mx-auto bg-white/20 backdrop-blur-sm border-white/20">
              <CardContent className="p-8 relative">
                <button
                  onClick={() => setShowQuote(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
                <Heart 
                  className="h-8 w-8 mx-auto mb-4" 
                  style={{ color: customization.theme.primaryColor }}
                />
                <blockquote 
                  className="text-xl italic font-medium leading-relaxed"
                  style={{ color: customization.theme.textColor }}
                >
                  "{customization.inspirationalQuote}"
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </section>
      )}



      {/* Galeria de Fotos Imersiva */}
      <main className="py-16">
        {album.photos.length > 0 ? (
          <div 
            className={`
              container mx-auto px-4
              ${customization.layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : ''}
              ${customization.layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6' : ''}
              ${customization.layout === 'carousel' ? 'flex space-x-6 overflow-x-auto pb-6 px-6' : ''}
            `}
          >
            {(album.isPaid ? album.photos : album.photos.filter(p => p.preview)).map((photo, index) => (
              <div 
                key={photo.id} 
                className={`
                  relative group cursor-pointer
                  ${customization.layout === 'masonry' ? 'break-inside-avoid mb-6' : ''}
                  ${customization.layout === 'carousel' ? 'flex-shrink-0 w-80 h-96' : ''}
                `}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <img
                    src={photo.url}
                    alt={photo.title || `Foto ${photo.id}`}
                    className={`
                      w-full h-auto object-cover
                      group-hover:scale-110 transition-transform duration-700 ease-out
                      ${customization.layout === 'carousel' ? 'h-full object-cover' : ''}
                    `}
                    loading="lazy"
                  />
                  
                  {/* Overlay sutil */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(45deg, ${customization.theme.primaryColor}20, ${customization.theme.secondaryColor}20)`
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex space-x-3">
                        <Button
                          size="lg"
                          onClick={() => handleDownload(Number(photo.id))}
                          className="bg-white/90 hover:bg-white text-black border-none shadow-lg"
                        >
                          <Download className="h-5 w-5 mr-2" />
                          Download
                        </Button>
                        <Button
                          size="lg"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Watermark elegante */}
                  {customization.showWatermark && (
                    <div 
                      className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${customization.theme.primaryColor}80`,
                        color: 'white',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      PhotoStudio Pro
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="container mx-auto px-4 text-center py-16">
            <p className="text-xl opacity-60">Carregando fotos...</p>
          </div>
        )}
      </main>

      {/* Footer minimalista */}
      <footer className="py-16 text-center">
        <div className="container mx-auto px-4">
          <p 
            className="text-lg font-light opacity-70"
            style={{ color: customization.theme.textColor }}
          >
            Álbum criado com ❤️ para {album.clientName}
          </p>
          <p 
            className="text-sm mt-2 opacity-50"
            style={{ color: customization.theme.textColor }}
          >
            © 2024 PhotoStudio Pro
          </p>
        </div>
      </footer>
    </div>
  )
}