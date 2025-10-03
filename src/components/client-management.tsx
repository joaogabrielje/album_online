"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, User, Mail, Phone, Calendar, Camera } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: string
  albums: Album[]
  _count: {
    albums: number
  }
}

interface Album {
  id: string
  code: string
  title: string
  isPaid: boolean
  createdAt: string
  _count: {
    photos: number
  }
}

interface ClientManagementProps {
  photographerId: string
}

export function ClientManagement({ photographerId }: ClientManagementProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    loadClients()
  }, [photographerId])

  const loadClients = async () => {
    try {
      const response = await fetch(`/api/clients?photographerId=${photographerId}`)
      const data = await response.json()
      
      if (response.ok) {
        setClients(data.clients)
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao carregar clientes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newClient,
          photographerId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setClients([data.client, ...clients])
        setNewClient({ name: '', email: '', phone: '' })
        setShowAddForm(false)
        toast({
          title: "Sucesso!",
          description: data.message,
        })
      } else {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error)
      toast({
        title: "Erro",
        description: "Erro ao adicionar cliente",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando clientes...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Clientes</h2>
          <p className="text-muted-foreground">
            {clients.length} cliente(s) cadastrado(s)
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Formulário de Adicionar Cliente */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Cliente</CardTitle>
            <CardDescription>
              Cadastre um novo cliente para criar álbuns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome Completo *</Label>
                  <Input
                    id="clientName"
                    type="text"
                    placeholder="Ex: João Silva"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="cliente@email.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefone</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Adicionar Cliente</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Clientes */}
      {clients.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum cliente cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Adicione seu primeiro cliente para começar a criar álbuns
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Cliente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </span>
                          {client.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {client.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Cliente desde {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="flex gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <span>{client._count.albums} álbum(s)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">
                          {client.albums.filter(a => a.isPaid).length} pago(s)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-yellow-600">
                          {client.albums.filter(a => !a.isPaid).length} pendente(s)
                        </span>
                      </div>
                    </div>

                    {/* Álbuns do Cliente */}
                    {client.albums.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Álbuns:</h4>
                        <div className="flex flex-wrap gap-2">
                          {client.albums.map((album) => (
                            <Badge 
                              key={album.id} 
                              variant={album.isPaid ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {album.code} - {album.title}
                              {album._count && ` (${album._count.photos} fotos)`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                    <Button size="sm" variant="outline">
                      Ver Álbuns
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}