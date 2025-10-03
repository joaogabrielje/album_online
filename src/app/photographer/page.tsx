"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Camera, Plus, Eye, Users, Settings, ArrowLeft, Lock, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { PhotoUpload } from '@/components/photo-upload'
import { PhotoGallery } from '@/components/photo-gallery'
import AlbumCustomizationEditor from '@/components/album-customization-editor'
import { useToast } from '@/hooks/use-toast'
import type { AlbumCustomization } from '@/types'

// Mock data for demonstration
const PHOTOGRAPHER_CREDENTIALS = {
  email: 'fotografo@demo.com',
  password: 'admin123'
}

const MOCK_ALBUMS = [
  {
    id: 1,
    code: 'DEMO2024',
    title: 'Casamento João & Maria',
    clientName: 'João Silva',
    clientEmail: 'joao@email.com',
    totalPhotos: 45,
    previewPhotos: 5,
    isPaid: true,
    createdAt: '2024-01-15',
    price: 299.99,
    photos: [] as any[]
  },
  {
    id: 2,
    code: 'FAMILY2024',
    title: 'Ensaio Família Costa',
    clientName: 'Ana Costa',
    clientEmail: 'ana@email.com',
    totalPhotos: 30,
    previewPhotos: 3,
    isPaid: false,
    createdAt: '2024-01-20',
    price: 199.99,
    photos: [] as any[]
  },
  {
    id: 3,
    code: 'WEDDING2024',
    title: 'Casamento Carlos & Lucia',
    clientName: 'Carlos Silva',
    clientEmail: 'carlos@email.com',
    totalPhotos: 60,
    previewPhotos: 8,
    isPaid: true,
    createdAt: '2024-01-25',
    price: 399.99,
    photos: [] as any[]
  }
]

export default function PhotographerPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [albums, setAlbums] = useState(MOCK_ALBUMS)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Info, 2: Upload
  const [newAlbumId, setNewAlbumId] = useState<string | null>(null)
  const [showCustomization, setShowCustomization] = useState(false)
  const [selectedAlbumForCustomization, setSelectedAlbumForCustomization] = useState<any>(null)
  const [newAlbum, setNewAlbum] = useState({
    code: '',
    title: '',
    clientName: '',
    clientEmail: '',
    password: '',
    previewPhotos: 5,
    price: 299.99
  })
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (email === PHOTOGRAPHER_CREDENTIALS.email && password === PHOTOGRAPHER_CREDENTIALS.password) {
      setIsAuthenticated(true)
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao painel do fotógrafo.",
      })
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      })
    }
    
    setIsLoading(false)
  }

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newAlbum.code || !newAlbum.title || !newAlbum.clientName || !newAlbum.password) {
      toast({
        title: "Erro ao criar álbum",
        description: "Preencha todos os campos obrigatórios (incluindo a senha).",
        variant: "destructive",
      })
      return
    }

    const albumExists = albums.some(album => album.code === newAlbum.code.toUpperCase())
    if (albumExists) {
      toast({
        title: "Erro ao criar álbum",
        description: "Já existe um álbum com este código.",
        variant: "destructive",
      })
      return
    }

    const albumId = `album-${Date.now()}`
    const album = {
      id: albums.length + 1,
      ...newAlbum,
      code: newAlbum.code.toUpperCase(),
      totalPhotos: 0,
      isPaid: false,
      createdAt: new Date().toISOString().split('T')[0],
      photos: [] as any[]
    }

    setAlbums([...albums, album])
    setNewAlbumId(albumId)
    setCurrentStep(2)
    
    toast({
      title: "Álbum criado!",
      description: `Agora você pode enviar as fotos para o álbum ${album.code}.`,
    })
  }

  const handlePhotosUploaded = (photos: any[]) => {
    if (!newAlbumId) return

    setAlbums(prevAlbums => 
      prevAlbums.map(album => 
        album.code === newAlbum.code.toUpperCase()
          ? { ...album, photos: [...(album.photos || []), ...photos], totalPhotos: (album.totalPhotos || 0) + photos.length }
          : album
      )
    )

    toast({
      title: "Fotos enviadas!",
      description: `${photos.length} foto(s) adicionada(s) ao álbum.`,
    })
  }

  const finishAlbumCreation = () => {
    setNewAlbum({
      code: '',
      title: '',
      clientName: '',
      clientEmail: '',
      password: '',
      previewPhotos: 5,
      price: 299.99
    })
    setShowCreateForm(false)
    setCurrentStep(1)
    setNewAlbumId(null)
    
    toast({
      title: "Álbum finalizado!",
      description: "O álbum foi criado com sucesso e está pronto para ser compartilhado.",
    })
  }

  const logout = () => {
    setIsAuthenticated(false)
    setEmail('')
    setPassword('')
  }

  const getTotalRevenue = () => {
    return albums.filter(album => album.isPaid).reduce((total, album) => total + album.price, 0)
  }

  const getPaidCount = () => {
    return albums.filter(album => album.isPaid).length
  }

  const getPendingCount = () => {
    return albums.filter(album => !album.isPaid).length
  }

  const handleCustomizeAlbum = (album: any) => {
    setSelectedAlbumForCustomization(album)
    setShowCustomization(true)
  }

  const handleSaveCustomization = (customization: AlbumCustomization) => {
    if (!selectedAlbumForCustomization) return
    
    setAlbums(prevAlbums =>
      prevAlbums.map(album =>
        album.id === selectedAlbumForCustomization.id
          ? { ...album, customization }
          : album
      )
    )
    
    setShowCustomization(false)
    setSelectedAlbumForCustomization(null)
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel do Fotógrafo</h1>
                <p className="text-sm text-gray-600">Gerencie seus álbuns e clientes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Álbum
              </Button>
              <Button variant="outline" onClick={logout}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Customization Editor */}
          {showCustomization && selectedAlbumForCustomization && (
            <div className="mb-8">
              <AlbumCustomizationEditor
                albumId={selectedAlbumForCustomization.id}
                albumTitle={selectedAlbumForCustomization.title}
                currentCustomization={selectedAlbumForCustomization.customization}
                onSave={handleSaveCustomization}
              />
              <div className="mt-4 flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCustomization(false)
                    setSelectedAlbumForCustomization(null)
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar aos Álbuns
                </Button>
              </div>
            </div>
          )}

          {!showCustomization && (
            <>
              {/* Stats Cards */}
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
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{getPaidCount()}</p>
                    <p className="text-gray-600">Álbuns Pagos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{getPendingCount()}</p>
                    <p className="text-gray-600">Pendentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">R$</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">R$ {getTotalRevenue().toFixed(2)}</p>
                    <p className="text-gray-600">Receita Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create Album Form */}
          {showCreateForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 ? 'Criar Novo Álbum' : 'Enviar Fotos do Álbum'}
                  <span className="ml-2 text-sm text-muted-foreground">
                    (Etapa {currentStep} de 2)
                  </span>
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 
                    ? 'Preencha as informações para criar um novo álbum para seu cliente'
                    : `Envie as fotos para o álbum "${newAlbum.title}"`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 1 ? (
                  <form onSubmit={handleCreateAlbum} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="albumCode">Código do Álbum *</Label>
                        <Input
                          id="albumCode"
                          type="text"
                          placeholder="Ex: CASAMENTO2024"
                          value={newAlbum.code}
                          onChange={(e) => setNewAlbum({...newAlbum, code: e.target.value})}
                          className="uppercase"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="albumTitle">Título do Álbum *</Label>
                        <Input
                          id="albumTitle"
                          type="text"
                          placeholder="Ex: Casamento João & Maria"
                          value={newAlbum.title}
                          onChange={(e) => setNewAlbum({...newAlbum, title: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName">Nome do Cliente *</Label>
                        <Input
                          id="clientName"
                          type="text"
                          placeholder="Nome completo"
                          value={newAlbum.clientName}
                          onChange={(e) => setNewAlbum({...newAlbum, clientName: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="clientEmail">Email do Cliente</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          placeholder="cliente@email.com"
                          value={newAlbum.clientEmail}
                          onChange={(e) => setNewAlbum({...newAlbum, clientEmail: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="albumPassword">Senha do Álbum *</Label>
                        <Input
                          id="albumPassword"
                          type="text"
                          placeholder="Ex: familia123"
                          value={newAlbum.password}
                          onChange={(e) => setNewAlbum({...newAlbum, password: e.target.value})}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Esta senha será usada pelos clientes para acessar o álbum
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="previewPhotos">Fotos Preview</Label>
                        <Input
                          id="previewPhotos"
                          type="number"
                          min="1"
                          max="20"
                          value={newAlbum.previewPhotos}
                          onChange={(e) => setNewAlbum({...newAlbum, previewPhotos: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="previewPhotos">Fotos Preview</Label>
                        <Input
                          id="previewPhotos"
                          type="number"
                          min="1"
                          max="20"
                          value={newAlbum.previewPhotos}
                          onChange={(e) => setNewAlbum({...newAlbum, previewPhotos: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price">Preço (R$)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={newAlbum.price}
                          onChange={(e) => setNewAlbum({...newAlbum, price: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">Próximo: Enviar Fotos</Button>
                      <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Upload de fotos */}
                    {newAlbumId && (
                      <PhotoUpload 
                        albumId={newAlbumId} 
                        onPhotosUploaded={handlePhotosUploaded}
                      />
                    )}

                    {/* Galeria de fotos já enviadas */}
                    {(() => {
                      const album = albums.find(a => a.code === newAlbum.code.toUpperCase())
                      const hasPhotos = album?.photos && album.photos.length > 0
                      
                      if (!hasPhotos) return null
                      
                      return (
                        <div>
                          <h4 className="font-medium mb-4">Fotos Enviadas</h4>
                          <PhotoGallery 
                            photos={album.photos || []}
                            albumId={newAlbumId || ''}
                            canDownload={false}
                          />
                        </div>
                      )
                    })()}

                    <div className="flex gap-2">
                      <Button onClick={finishAlbumCreation}>Finalizar Álbum</Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep(1)}
                      >
                        Voltar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Albums List */}
          <Card>
            <CardHeader>
              <CardTitle>Álbuns Existentes</CardTitle>
              <CardDescription>
                Gerencie todos os seus álbuns de fotos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {albums.map((album) => (
                  <div key={album.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{album.title}</h3>
                          <Badge variant={album.isPaid ? "default" : "secondary"}>
                            {album.isPaid ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Pago</>
                            ) : (
                              <><Clock className="h-3 w-3 mr-1" /> Pendente</>
                            )}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Cliente:</strong> {album.clientName}</p>
                            <p><strong>Email:</strong> {album.clientEmail}</p>
                            <p><strong>Código:</strong> {album.code}</p>
                          </div>
                          <div>
                            <p><strong>Total de Fotos:</strong> {album.totalPhotos}</p>
                            <p><strong>Preview:</strong> {album.previewPhotos} fotos</p>
                            <p><strong>Criado em:</strong> {new Date(album.createdAt).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>

                        {album.isPaid && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              Receita: R$ {album.price.toFixed(2)}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCustomizeAlbum(album)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Personalizar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {albums.length === 0 && (
                  <div className="text-center py-12">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum álbum criado ainda.</p>
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      className="mt-4 bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Álbum
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
            </>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex flex-col">
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
              <Camera className="h-6 w-6 text-purple-600" />
              <span>Área do Fotógrafo</span>
            </CardTitle>
            <CardDescription>
              Acesse o painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
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
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Credenciais de Demonstração:</h4>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p><strong>Email:</strong> fotografo@demo.com</p>
                <p><strong>Senha:</strong> admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}