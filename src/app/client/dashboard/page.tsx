"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Camera, Eye, Lock, ArrowLeft, CreditCard, Download, Heart, Music, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import type { Album } from '@/types'

// Mock data - em produção viria da API
const MOCK_CLIENT_ALBUMS: Album[] = [
  // Álbuns do João Silva
  {
    id: 1,
    code: 'WEDDING2024',
    title: 'Casamento João & Maria',
    clientName: 'João Silva',
    clientEmail: 'joao@email.com',
    totalPhotos: 150,
    previewPhotos: 10,
    isPaid: true,
    createdAt: '2024-09-15',
    price: 599.99,
    photos: [],
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
  {
    id: 2,
    code: 'FAMILY2024',
    title: 'Ensaio Família Silva',
    clientName: 'João Silva',
    clientEmail: 'joao@email.com',
    totalPhotos: 80,
    previewPhotos: 8,
    isPaid: false,
    createdAt: '2024-10-01',
    price: 299.99,
    photos: []
  },
  {
    id: 6,
    code: 'ANNIVERSARY2024',
    title: 'Bodas de Prata João & Maria',
    clientName: 'João Silva',
    clientEmail: 'joao@email.com',
    totalPhotos: 60,
    previewPhotos: 6,
    isPaid: true,
    createdAt: '2024-08-20',
    price: 399.99,
    photos: []
  },
  // Álbuns da Ana Costa
  {
    id: 3,
    code: 'MATERNITY2024',
    title: 'Ensaio Gestante Ana',
    clientName: 'Ana Costa',
    clientEmail: 'ana@email.com',
    totalPhotos: 45,
    previewPhotos: 5,
    isPaid: true,
    createdAt: '2024-09-20',
    price: 399.99,
    photos: [],
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
  {
    id: 7,
    code: 'NEWBORN2024',
    title: 'Newborn Lucas',
    clientName: 'Ana Costa',
    clientEmail: 'ana@email.com',
    totalPhotos: 35,
    previewPhotos: 4,
    isPaid: false,
    createdAt: '2024-10-15',
    price: 349.99,
    photos: []
  },
  // Álbuns da Maria Santos
  {
    id: 4,
    code: 'BIRTHDAY2024',
    title: 'Aniversário 15 anos Sofia',
    clientName: 'Maria Santos',
    clientEmail: 'maria@email.com',
    totalPhotos: 90,
    previewPhotos: 9,
    isPaid: true,
    createdAt: '2024-09-10',
    price: 449.99,
    photos: [],
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
  },
  // Álbuns do Carlos Oliveira  
  {
    id: 5,
    code: 'CORPORATE2024',
    title: 'Evento Corporativo TechCorp',
    clientName: 'Carlos Oliveira',
    clientEmail: 'carlos@email.com',
    totalPhotos: 120,
    previewPhotos: 12,
    isPaid: true,
    createdAt: '2024-09-25',
    price: 799.99,
    photos: []
  }
]

export default function ClientDashboard() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [clientName, setClientName] = useState('')
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Pegar nome do cliente da URL ou simular busca
    const urlParams = new URLSearchParams(window.location.search)
    const client = urlParams.get('client') || 'Cliente'
    setClientName(client)
    
    // Simular carregamento dos álbuns do cliente
    setTimeout(() => {
      // Filtrar álbuns por nome do cliente (em produção seria por ID/sessão)
      const clientAlbums = MOCK_CLIENT_ALBUMS.filter(album => 
        album.clientName.toLowerCase().includes(client.toLowerCase())
      )
      setAlbums(clientAlbums)
      setLoading(false)
    }, 1000)
  }, [])

  const handlePayment = (albumId: number) => {
    toast({
      title: "Redirecionando para pagamento",
      description: "Você será redirecionado para completar o pagamento.",
    })
    
    // Simular pagamento
    setTimeout(() => {
      setAlbums(prev => prev.map(album => 
        album.id === albumId ? { ...album, isPaid: true } : album
      ))
      toast({
        title: "Pagamento aprovado!",
        description: "Álbum liberado para acesso completo.",
      })
    }, 2000)
  }

  const handleDownload = (albumCode: string) => {
    toast({
      title: "Download iniciado",
      description: `Download de todas as fotos do álbum ${albumCode} iniciado.`,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Camera className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando seus álbuns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Camera className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Meus Álbuns</h1>
              <p className="text-sm text-gray-600">Bem-vindo, {clientName}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/client">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Camera className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{albums.length}</p>
                  <p className="text-gray-600">Total de Álbuns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Eye className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{albums.filter(a => a.isPaid).length}</p>
                  <p className="text-gray-600">Álbuns Liberados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{albums.filter(a => !a.isPaid).length}</p>
                  <p className="text-gray-600">Pagamentos Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Download className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{albums.reduce((total, album) => total + album.totalPhotos, 0)}</p>
                  <p className="text-gray-600">Total de Fotos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Albums Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Card key={album.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{album.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      <span>Código: {album.code}</span>
                      {album.customization && (
                        <div className="flex space-x-1">
                          <Palette className="h-3 w-3 text-purple-500" />
                          {album.customization.music.enabled && (
                            <Music className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={album.isPaid ? "default" : "secondary"}>
                    {album.isPaid ? "Liberado" : "Pendente"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Album Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span>{album.totalPhotos} fotos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Camera className="h-4 w-4 text-gray-500" />
                    <span>{album.previewPhotos} preview</span>
                  </div>
                </div>

                {/* Price and Date */}
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{formatPrice(album.price)}</span>
                  <span>{formatDate(album.createdAt)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link href={`/client/album/${album.code}`} className="flex-1">
                    <Button className="w-full" variant={album.isPaid ? "default" : "outline"}>
                      {album.isPaid ? "Ver Álbum" : "Preview"}
                    </Button>
                  </Link>
                  
                  {!album.isPaid ? (
                    <Button 
                      onClick={() => handlePayment(album.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleDownload(album.code)}
                      variant="outline"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Payment Notice */}
                {!album.isPaid && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Lock className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div className="text-xs text-orange-800">
                        <p className="font-medium">Pagamento Pendente</p>
                        <p>Complete o pagamento para acessar todas as fotos</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customization Preview */}
                {album.customization && album.isPaid && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Heart className="h-4 w-4 text-purple-500 mt-0.5" />
                      <div className="text-xs text-purple-800">
                        <p className="font-medium">Experiência Personalizada</p>
                        <p>Este álbum tem tema e música customizados</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {albums.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum álbum encontrado</h3>
            <p className="text-gray-600 mb-6">
              Você ainda não possui álbuns. Entre em contato com seu fotógrafo.
            </p>
            <Link href="/client">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Login
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}