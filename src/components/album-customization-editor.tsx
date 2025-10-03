"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, Music, Image, Type, Layout, Eye, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { AlbumCustomization } from '@/types'

interface AlbumCustomizationEditorProps {
  albumId: number
  albumTitle: string
  currentCustomization?: AlbumCustomization
  onSave: (customization: AlbumCustomization) => void
}

const DEFAULT_CUSTOMIZATION: AlbumCustomization = {
  theme: {
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    backgroundColor: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    textColor: '#1e293b'
  },
  banner: {
    title: '',
    subtitle: ''
  },
  music: {
    enabled: false,
    autoplay: false,
    volume: 0.3
  },
  layout: 'grid',
  showWatermark: true
}

export default function AlbumCustomizationEditor({ 
  albumId, 
  albumTitle, 
  currentCustomization = DEFAULT_CUSTOMIZATION,
  onSave 
}: AlbumCustomizationEditorProps) {
  const [customization, setCustomization] = useState<AlbumCustomization>(currentCustomization)
  const [previewMode, setPreviewMode] = useState(false)
  const { toast } = useToast()

  const handleThemeChange = (field: string, value: string) => {
    setCustomization(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [field]: value
      }
    }))
  }

  const handleBannerChange = (field: string, value: string) => {
    setCustomization(prev => ({
      ...prev,
      banner: {
        ...prev.banner,
        [field]: value
      }
    }))
  }

  const handleMusicChange = (field: string, value: any) => {
    setCustomization(prev => ({
      ...prev,
      music: {
        ...prev.music,
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    onSave(customization)
    toast({
      title: "Personalização salva!",
      description: "As configurações do álbum foram atualizadas com sucesso.",
    })
  }

  const presetThemes = [
    {
      name: 'Romântico',
      theme: {
        primaryColor: '#ff6b6b',
        secondaryColor: '#ff8cc8',
        backgroundColor: 'linear-gradient(135deg, #fff5f5 0%, #fef7ff 100%)',
        textColor: '#2d3748'
      }
    },
    {
      name: 'Elegante',
      theme: {
        primaryColor: '#2d3748',
        secondaryColor: '#4a5568',
        backgroundColor: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        textColor: '#1a202c'
      }
    },
    {
      name: 'Natureza',
      theme: {
        primaryColor: '#48bb78',
        secondaryColor: '#68d391',
        backgroundColor: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
        textColor: '#1a202c'
      }
    },
    {
      name: 'Oceano',
      theme: {
        primaryColor: '#4299e1',
        secondaryColor: '#63b3ed',
        backgroundColor: 'linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%)',
        textColor: '#1a202c'
      }
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Personalização do Álbum</h2>
          <p className="text-gray-600">{albumTitle}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Editor' : 'Preview'}
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {previewMode ? (
        <AlbumPreview customization={customization} albumTitle={albumTitle} />
      ) : (
        <Tabs defaultValue="theme" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="theme" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Cores</span>
            </TabsTrigger>
            <TabsTrigger value="banner" className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>Banner</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center space-x-2">
              <Music className="h-4 w-4" />
              <span>Música</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <span>Conteúdo</span>
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center space-x-2">
              <Layout className="h-4 w-4" />
              <span>Layout</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tema de Cores</CardTitle>
                <CardDescription>
                  Defina as cores principais que serão usadas no álbum personalizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Temas Predefinidos */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Temas Predefinidos</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {presetThemes.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setCustomization(prev => ({ ...prev, theme: preset.theme }))}
                        className="p-3 border rounded-lg hover:shadow-md transition-shadow text-left"
                      >
                        <div className="flex space-x-2 mb-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: preset.theme.primaryColor }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: preset.theme.secondaryColor }}
                          />
                        </div>
                        <p className="text-sm font-medium">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cores Personalizadas */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Cor Principal</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={customization.theme.primaryColor}
                        onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        type="text"
                        value={customization.theme.primaryColor}
                        onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                        placeholder="#6366f1"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={customization.theme.secondaryColor}
                        onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        type="text"
                        value={customization.theme.secondaryColor}
                        onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                        placeholder="#8b5cf6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textColor">Cor do Texto</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="textColor"
                        type="color"
                        value={customization.theme.textColor}
                        onChange={(e) => handleThemeChange('textColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        type="text"
                        value={customization.theme.textColor}
                        onChange={(e) => handleThemeChange('textColor', e.target.value)}
                        placeholder="#1e293b"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Fundo (CSS Gradient)</Label>
                    <Textarea
                      id="backgroundColor"
                      value={customization.theme.backgroundColor}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleThemeChange('backgroundColor', e.target.value)}
                      placeholder="linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banner" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Banner Personalizado</CardTitle>
                <CardDescription>
                  Configure o banner que aparecerá no topo do álbum
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bannerTitle">Título do Banner</Label>
                  <Input
                    id="bannerTitle"
                    value={customization.banner.title || ''}
                    onChange={(e) => handleBannerChange('title', e.target.value)}
                    placeholder="Ex: João & Maria"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bannerSubtitle">Subtítulo</Label>
                  <Input
                    id="bannerSubtitle"
                    value={customization.banner.subtitle || ''}
                    onChange={(e) => handleBannerChange('subtitle', e.target.value)}
                    placeholder="Ex: Uma história de amor eterna ❤️"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bannerImage">URL da Imagem de Fundo</Label>
                  <Input
                    id="bannerImage"
                    value={customization.banner.imageUrl || ''}
                    onChange={(e) => handleBannerChange('imageUrl', e.target.value)}
                    placeholder="https://exemplo.com/banner.jpg"
                  />
                  <p className="text-xs text-gray-500">
                    Deixe em branco para usar apenas o gradiente das cores do tema
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="music" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Música de Fundo</CardTitle>
                <CardDescription>
                  Configure a música que tocará durante a visualização do álbum
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={customization.music.enabled}
                    onCheckedChange={(enabled: boolean) => handleMusicChange('enabled', enabled)}
                  />
                  <Label>Habilitar música de fundo</Label>
                </div>

                {customization.music.enabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="musicUrl">URL da Música</Label>
                      <Input
                        id="musicUrl"
                        value={customization.music.url || ''}
                        onChange={(e) => handleMusicChange('url', e.target.value)}
                        placeholder="https://exemplo.com/musica.mp3"
                      />
                      <p className="text-xs text-gray-500">
                        Formatos suportados: MP3, WAV, OGG
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={customization.music.autoplay}
                        onCheckedChange={(autoplay: boolean) => handleMusicChange('autoplay', autoplay)}
                      />
                      <Label>Reproduzir automaticamente</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="volume">Volume ({Math.round(customization.music.volume * 100)}%)</Label>
                      <Input
                        id="volume"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={customization.music.volume}
                        onChange={(e) => handleMusicChange('volume', parseFloat(e.target.value))}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo Personalizado</CardTitle>
                <CardDescription>
                  Adicione uma frase inspiradora e outras personalizações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quote">Frase Inspiradora</Label>
                  <Textarea
                    id="quote"
                    value={customization.inspirationalQuote || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomization(prev => ({ ...prev, inspirationalQuote: e.target.value }))}
                    placeholder="Ex: O amor é a ponte entre duas almas que se encontraram para sempre."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={customization.showWatermark}
                    onCheckedChange={(checked: boolean) => setCustomization(prev => ({ ...prev, showWatermark: checked }))}
                  />
                  <Label>Mostrar marca d'água nas fotos</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Layout da Galeria</CardTitle>
                <CardDescription>
                  Escolha como as fotos serão exibidas no álbum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Estilo de Layout</Label>
                  <Select 
                    value={customization.layout} 
                    onValueChange={(value: 'grid' | 'masonry' | 'carousel') => 
                      setCustomization(prev => ({ ...prev, layout: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grade Uniforme</SelectItem>
                      <SelectItem value="masonry">Mosaico (Masonry)</SelectItem>
                      <SelectItem value="carousel">Carrossel Horizontal</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Cada layout oferece uma experiência visual diferente para as fotos
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// Componente de Preview
function AlbumPreview({ customization, albumTitle }: { customization: AlbumCustomization, albumTitle: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview do Álbum</CardTitle>
        <CardDescription>
          Veja como o álbum ficará para o cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className="rounded-lg overflow-hidden shadow-lg"
          style={{ 
            background: customization.theme.backgroundColor,
            color: customization.theme.textColor,
            minHeight: '400px'
          }}
        >
          {/* Banner Preview */}
          <div 
            className="relative h-32 flex items-center justify-center"
            style={{
              background: customization.banner.imageUrl 
                ? `url(${customization.banner.imageUrl}) center/cover`
                : `linear-gradient(45deg, ${customization.theme.primaryColor}20, ${customization.theme.secondaryColor}20)`
            }}
          >
            <div className="text-center">
              {customization.banner.title && (
                <h2 
                  className="text-2xl font-bold"
                  style={{ color: customization.theme.textColor }}
                >
                  {customization.banner.title}
                </h2>
              )}
              {customization.banner.subtitle && (
                <p 
                  className="text-sm mt-1"
                  style={{ color: customization.theme.textColor }}
                >
                  {customization.banner.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Quote Preview */}
          {customization.inspirationalQuote && (
            <div className="p-6 text-center">
              <blockquote 
                className="italic"
                style={{ color: customization.theme.textColor }}
              >
                "{customization.inspirationalQuote}"
              </blockquote>
            </div>
          )}

          {/* Layout Preview */}
          <div className="p-6">
            <h3 
              className="font-semibold mb-4"
              style={{ color: customization.theme.textColor }}
            >
              Galeria de Fotos ({customization.layout})
            </h3>
            <div className={`
              ${customization.layout === 'grid' ? 'grid grid-cols-3 gap-2' : ''}
              ${customization.layout === 'masonry' ? 'columns-3 gap-2' : ''}
              ${customization.layout === 'carousel' ? 'flex space-x-2 overflow-hidden' : ''}
            `}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i}
                  className={`
                    bg-gray-200 rounded relative
                    ${customization.layout === 'grid' ? 'aspect-square' : ''}
                    ${customization.layout === 'masonry' ? `h-${20 + (i % 3) * 10} break-inside-avoid mb-2` : ''}
                    ${customization.layout === 'carousel' ? 'w-20 h-20 flex-shrink-0' : ''}
                  `}
                >
                  {customization.showWatermark && (
                    <div className="absolute bottom-1 right-1 text-xs bg-black/50 text-white px-1 rounded">
                      ©
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Music Indicator */}
          {customization.music.enabled && (
            <div className="px-6 pb-6">
              <div 
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: `${customization.theme.primaryColor}20`,
                  color: customization.theme.primaryColor 
                }}
              >
                <Music className="h-3 w-3" />
                <span>Música de fundo {customization.music.autoplay ? '(autoplay)' : ''}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}