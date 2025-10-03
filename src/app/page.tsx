import Link from 'next/link';
import { Camera, Shield, Download, Eye, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              PhotoStudio
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#sobre" className="text-gray-600 hover:text-purple-600 transition-colors">
              Sobre
            </Link>
            <Link href="#servicos" className="text-gray-600 hover:text-purple-600 transition-colors">
              Serviços
            </Link>
            <Link href="#portfolio" className="text-gray-600 hover:text-purple-600 transition-colors">
              Portfólio
            </Link>
            <Link href="#contato" className="text-gray-600 hover:text-purple-600 transition-colors">
              Contato
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/client">
              <Button variant="outline" className="hidden sm:flex">
                <Eye className="h-4 w-4 mr-2" />
                Área do Cliente
              </Button>
            </Link>
            <Link href="/photographer">
              <Button className="gradient-primary">
                <Camera className="h-4 w-4 mr-2" />
                Fotógrafo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              ✨ Sistema Profissional de Álbuns
            </Badge>
            <h2 className="text-5xl md:text-7xl font-bold font-heading mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
              Seus Momentos
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Especiais
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Plataforma profissional para fotógrafos organizarem e compartilharem álbuns com segurança, 
              oferecendo acesso controlado e experiência premium para seus clientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/client">
                <Button size="lg" className="gradient-primary px-8 py-4 text-base">
                  <Eye className="h-5 w-5 mr-2" />
                  Acessar Meu Álbum
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="px-8 py-4 text-base">
                  Ver Demonstração
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="sobre" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Por que escolher o PhotoStudio?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tecnologia avançada para uma experiência excepcional
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-purple-50 to-blue-50">
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">Segurança Total</h4>
              <p className="text-gray-600">
                Acesso protegido por senha com criptografia avançada. Seus álbuns ficam seguros e privados.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <Download className="h-12 w-12 text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">Download Premium</h4>
              <p className="text-gray-600">
                Download de fotos em alta qualidade após confirmação do pagamento. Qualidade profissional garantida.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
              <Eye className="h-12 w-12 text-indigo-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">Preview Inteligente</h4>
              <p className="text-gray-600">
                Visualização prévia gratuita para clientes conhecerem o trabalho antes da compra.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-purple-100">Álbuns Criados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-purple-100">Fotos Entregues</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-purple-100">Satisfação</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-purple-100">Suporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Experimente Agora
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Teste o sistema com nossas contas de demonstração
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 border-2 border-purple-200 hover:border-purple-300 transition-colors">
              <div className="flex items-center mb-4">
                <Eye className="h-8 w-8 text-purple-600 mr-3" />
                <h4 className="text-2xl font-semibold">Área do Cliente</h4>
              </div>
              <p className="text-gray-600 mb-6">
                Teste como um cliente visualizando e baixando fotos do seu álbum
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Código:</span>
                  <code className="bg-purple-100 text-purple-800 px-2 py-1 rounded">DEMO2024</code>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Senha:</span>
                  <code className="bg-purple-100 text-purple-800 px-2 py-1 rounded">123456</code>
                </div>
              </div>
              <Link href="/client" className="block">
                <Button className="w-full gradient-primary">
                  Testar Área do Cliente
                </Button>
              </Link>
            </Card>
            
            <Card className="p-8 border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <div className="flex items-center mb-4">
                <Camera className="h-8 w-8 text-blue-600 mr-3" />
                <h4 className="text-2xl font-semibold">Área do Fotógrafo</h4>
              </div>
              <p className="text-gray-600 mb-6">
                Experimente o painel administrativo para gerenciar álbuns e clientes
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Email:</span>
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">fotografo@demo.com</code>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Senha:</span>
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded">admin123</code>
                </div>
              </div>
              <Link href="/photographer" className="block">
                <Button className="w-full gradient-secondary">
                  Testar Área do Fotógrafo
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="h-6 w-6 text-purple-400" />
                <h5 className="text-xl font-bold">PhotoStudio</h5>
              </div>
              <p className="text-gray-400">
                Plataforma profissional para fotógrafos e seus clientes.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-3">Produto</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Recursos</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Preços</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integração</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-3">Suporte</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Documentação</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-3">Empresa</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Sobre</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Carreiras</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PhotoStudio. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}