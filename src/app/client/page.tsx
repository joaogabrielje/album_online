"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Camera, Eye, Lock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { PhotoGallery } from '@/components/photo-gallery'

// Mock data for demonstration
const DEMO_ALBUMS = {
  'DEMO2024': {
    password: '123456',
    clientName: 'João Silva',
    albumTitle: 'Casamento João & Maria',
    isPaid: true,
    photos: [
      { id: 1, url: '/api/placeholder/800/600', preview: true },
      { id: 2, url: '/api/placeholder/800/600', preview: true },
      { id: 3, url: '/api/placeholder/800/600', preview: true },
      { id: 4, url: '/api/placeholder/800/600', preview: false },
      { id: 5, url: '/api/placeholder/800/600', preview: false },
    ]
  },
  'FAMILY2024': {
    password: 'familia123',
    clientName: 'Ana Costa',
    albumTitle: 'Ensaio Família Costa',
    isPaid: false,
    photos: [
      { id: 1, url: '/api/placeholder/800/600', preview: true },
      { id: 2, url: '/api/placeholder/800/600', preview: true },
      { id: 3, url: '/api/placeholder/800/600', preview: true },
      { id: 4, url: '/api/placeholder/800/600', preview: false },
      { id: 5, url: '/api/placeholder/800/600', preview: false },
    ]
  }
}

export default function ClientPage() {
  const [albumCode, setAlbumCode] = useState('')
  const [password, setPassword] = useState('')
  const [currentAlbum, setCurrentAlbum] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const album = DEMO_ALBUMS[albumCode.toUpperCase() as keyof typeof DEMO_ALBUMS]
    
    if (album && album.password === password) {
      setCurrentAlbum({ 
        ...album, 
        code: albumCode.toUpperCase(),
        totalPhotos: album.photos.length,
        previewPhotos: album.photos.filter(p => p.preview).length
      })
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo ao álbum: ${album.albumTitle}`,
      })
    } else {
      toast({
        title: "Erro no login",
        description: "Código do álbum ou senha incorretos.",
        variant: "destructive",
      })
    }
    
    setIsLoading(false)
  }

  const handlePayment = () => {
    toast({
      title: "Pagamento simulado",
      description: "Em um sistema real, isso redirecionaria para o gateway de pagamento.",
    })
    // Simulate payment success
    setTimeout(() => {
      setCurrentAlbum((prev: any) => ({ ...prev, isPaid: true }))
      toast({
        title: "Pagamento aprovado!",
        description: "Agora você tem acesso a todas as fotos do álbum.",
      })
    }, 2000)
  }

  const handleDownload = (photoId?: number) => {
    const message = photoId 
      ? `Download da foto ${photoId} iniciado (simulado)`
      : "Download de todas as fotos iniciado (simulado)"
    
    toast({
      title: "Download iniciado",
      description: message,
    })
  }

  const logout = () => {
    setCurrentAlbum(null)
    setAlbumCode('')
    setPassword('')
  }

  if (currentAlbum) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentAlbum.albumTitle}</h1>
                <p className="text-sm text-gray-600">Olá, {currentAlbum.clientName}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={logout}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Album Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Camera className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{currentAlbum.totalPhotos}</p>
                    <p className="text-gray-600">Total de Fotos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Eye className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{currentAlbum.previewPhotos}</p>
                    <p className="text-gray-600">Preview Disponível</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Lock className={`h-8 w-8 ${currentAlbum.isPaid ? 'text-green-600' : 'text-orange-500'}`} />
                  <div>
                    <p className="text-2xl font-bold">{currentAlbum.isPaid ? 'Liberado' : 'Pendente'}</p>
                    <p className="text-gray-600">Status do Pagamento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Notice */}
          {!currentAlbum.isPaid && (
            <Card className="mb-8 border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Lock className="h-6 w-6 text-orange-500 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900 mb-2">Pagamento Pendente</h3>
                    <p className="text-orange-800 mb-4">
                      Você está visualizando {currentAlbum.previewPhotos} fotos de preview. 
                      Após o pagamento, todas as {currentAlbum.totalPhotos} fotos estarão disponíveis 
                      para download em alta resolução.
                    </p>
                    <Button onClick={handlePayment} className="bg-orange-600 hover:bg-orange-700">
                      Efetuar Pagamento (Simulado)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Notice */}
          {currentAlbum.isPaid && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mt-1">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-2">Álbum Liberado!</h3>
                    <p className="text-green-800 mb-4">
                      Todas as fotos estão disponíveis para visualização e download em alta resolução.
                    </p>
                    <Button onClick={() => handleDownload()} className="bg-green-600 hover:bg-green-700">
                      Baixar Todas as Fotos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Photo Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Galeria de Fotos</CardTitle>
              <CardDescription>
                {currentAlbum.isPaid 
                  ? 'Clique nas fotos para ampliá-las'
                  : `Visualizando ${currentAlbum.previewPhotos} de ${currentAlbum.totalPhotos} fotos`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentAlbum.photos.length > 0 ? (
                <PhotoGallery 
                  photos={currentAlbum.isPaid ? currentAlbum.photos : currentAlbum.photos.filter((p: any) => p.preview)}
                  albumId={albumCode}
                  canDownload={currentAlbum.isPaid}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma foto disponível neste álbum ainda.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              PhotoStudio
            </h1>
          </Link>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Eye className="h-6 w-6 text-purple-600" />
              <span>Área do Cliente</span>
            </CardTitle>
            <CardDescription>
              Acesse seu álbum de fotos com segurança
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="albumCode">Código do Álbum</Label>
                <Input
                  id="albumCode"
                  type="text"
                  placeholder="Ex: DEMO2024"
                  value={albumCode}
                  onChange={(e) => setAlbumCode(e.target.value)}
                  required
                  className="uppercase"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha de Acesso</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Acessar Álbum'}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Contas de Demonstração:</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-medium text-green-900">Álbum Pago (Completo)</p>
                  <p><strong>Código:</strong> DEMO2024</p>
                  <p><strong>Senha:</strong> 123456</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="font-medium text-orange-900">Álbum Preview</p>
                  <p><strong>Código:</strong> FAMILY2024</p>
                  <p><strong>Senha:</strong> familia123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}