# 📸 PhotoStudio - Sistema Profissional de Álbuns de Fotos

Um sistema moderno e robusto desenvolvido com **Next.js 14**, **React**, **TypeScript** e **Tailwind CSS** para fotógrafos profissionais gerenciarem seus álbuns e oferecerem uma experiência premium aos seus clientes.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)

## 🚀 Características Principais

### 🎯 **Arquitetura Moderna**
- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para styling responsivo
- **Zustand** para gerenciamento de estado
- **Radix UI** para componentes acessíveis
- **Framer Motion** para animações suaves

### 👤 **Área do Cliente**
- ✅ Login seguro com código + senha
- ✅ Visualização de fotos preview gratuitas
- ✅ Sistema de pagamento integrado (simulado)
- ✅ Download de fotos em alta qualidade
- ✅ Interface responsiva e intuitiva
- ✅ Estatísticas do álbum em tempo real

### 📷 **Área do Fotógrafo**
- ✅ Painel administrativo completo
- ✅ Criação e gerenciamento de álbuns
- ✅ Controle de acesso e permissões
- ✅ Dashboard com métricas de negócio
- ✅ Gestão de clientes e pagamentos
- ✅ Interface profissional e moderna

## 🛠️ Stack Tecnológica

```json
{
  "frontend": {
    "framework": "Next.js 14",
    "language": "TypeScript",
    "styling": "Tailwind CSS",
    "components": "Radix UI",
    "icons": "Lucide React",
    "notifications": "Sonner Toast"
  },
  "backend": {
    "database": "Prisma ORM + SQLite",
    "storage": "Cloudinary",
    "api": "Next.js API Routes",
    "uploads": "Next-Cloudinary"
  },
  "features": {
    "authentication": "Custom Auth System",
    "file_handling": "Drag & Drop + Progress",
    "image_processing": "Cloudinary Transformations",
    "responsive": "Mobile First Design"
  },
  "development": {
    "linting": "ESLint + Prettier", 
    "validation": "Zod Schemas",
    "typescript": "Strict Mode",
    "database": "Prisma Studio"
  }
}
```

## 🎨 Design System

### Cores Principais
```css
/* Gradientes */
.gradient-primary { @apply bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800; }
.gradient-secondary { @apply bg-gradient-to-r from-blue-600 via-purple-600 to-violet-700; }

/* Efeitos */
.glass-effect { @apply backdrop-blur-lg bg-white/10 border border-white/20; }
```

### Componentes UI
- **Button** - 5 variantes, 4 tamanhos
- **Card** - Layout flexível com header/content/footer
- **Input** - Validação integrada com estados
- **Badge** - Indicadores de status
- **Toast** - Notificações não-intrusivas

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm/yarn/pnpm

### 1. Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd photo-album-system

# Instale as dependências
npm install
```

### 2. Configuração do Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure suas variáveis de ambiente no arquivo .env
```

#### Configuração do Cloudinary
1. Acesse [Cloudinary](https://cloudinary.com) e crie uma conta gratuita
2. No dashboard, copie suas credenciais
3. Edite o arquivo `.env`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"  
CLOUDINARY_API_SECRET="seu-api-secret"
```

### 3. Configuração do Banco de Dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev --name init

# Popular com dados de exemplo
node prisma/seed.js
```

### 4. Desenvolvimento
```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Visualizar banco de dados
npx prisma studio
```

## 🔐 Demonstração e Testes

### Credenciais de Teste

#### **Cliente - Álbum Completo (Pago)**
```
Código: DEMO2024
Senha: 123456
Funcionalidades: Todas as fotos disponíveis, download liberado
```

#### **Cliente - Álbum Preview**
```
Código: FAMILY2024
Senha: familia123
Funcionalidades: Apenas fotos preview, simulação de pagamento
```

#### **Fotógrafo - Painel Admin**
```
Email: fotografo@demo.com
Senha: admin123
Funcionalidades: Criação de álbuns, dashboard, gestão de clientes
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── client/            # Páginas da área do cliente
│   ├── photographer/      # Páginas da área do fotógrafo
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (Button, Card, etc.)
│   └── theme-provider.tsx # Provider de temas
├── hooks/                # Custom hooks
│   └── use-toast.ts      # Hook para notificações
├── lib/                  # Utilitários e configurações
│   └── utils.ts          # Funções auxiliares
└── types/                # Definições de tipos TypeScript
```

## 🎯 Funcionalidades Implementadas

### ✅ **Core Features**
- [x] Sistema de autenticação dual (Cliente/Fotógrafo)
- [x] Interface responsiva completa
- [x] Gerenciamento de álbuns
- [x] Sistema de preview de fotos
- [x] Dashboard administrativo
- [x] Notificações em tempo real
- [x] Validação de formulários
- [x] Tema escuro/claro
- [x] Componentes acessíveis

### 🚧 **Em Desenvolvimento**
- [ ] Upload de fotos (drag & drop)
- [ ] Integração com Stripe/PagSeguro
- [ ] Sistema de email automatizado
- [ ] API REST completa
- [ ] Banco de dados (Prisma + PostgreSQL)
- [ ] Autenticação JWT
- [ ] PWA Support
- [ ] Testes automatizados

## 📊 Performance e SEO

### Métricas Alvo
- **Core Web Vitals**: 90+ score
- **Lighthouse Performance**: 95+
- **SEO Score**: 100
- **Accessibility**: 95+

### Otimizações Implementadas
- ✅ Image optimization automática (Next.js)
- ✅ Code splitting por rotas
- ✅ Lazy loading de componentes
- ✅ CSS optimization com Tailwind
- ✅ Font optimization (Google Fonts)
- ✅ Metadata dinâmica para SEO

## 🔧 Personalização

### Configuração de Marca
```typescript
// src/lib/config.ts
export const BRAND_CONFIG = {
  name: 'PhotoStudio',
  tagline: 'Seus Momentos Especiais',
  colors: {
    primary: '#8b5cf6',
    secondary: '#3b82f6'
  }
}
```

### Customização de Temas
```css
/* src/app/globals.css */
:root {
  --primary: 262 83% 58%;          /* Purple-600 */
  --secondary: 210 40% 96%;        /* Slate-50 */
  --accent: 210 40% 96%;           /* Blue-500 */
}
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Deploy automático via Git
npm i -g vercel
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Netlify
```bash
# Build settings
Build command: npm run build
Publish directory: .next
```

## 🔍 Monitoramento

### Analytics
- Google Analytics 4
- Vercel Analytics
- Custom event tracking

### Error Tracking
- Sentry integration
- Error boundaries
- Performance monitoring

## 🤝 Contribuição

### Workflow
1. Fork do projeto
2. Criar feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit das mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Code Standards
- ESLint + Prettier configurado
- Conventional Commits
- TypeScript strict mode
- Testes obrigatórios para features

## 📋 Roadmap

### **Q1 2024**
- [ ] Autenticação real (NextAuth.js)
- [ ] Banco de dados (Prisma + PostgreSQL)
- [ ] Upload de fotos com compressão
- [ ] Sistema de pagamento real

### **Q2 2024**
- [ ] App móvel (React Native)
- [ ] API pública
- [ ] Sistema de backup
- [ ] Analytics avançado

### **Q3 2024**
- [ ] AI para organização de fotos
- [ ] Integração com redes sociais
- [ ] Sistema de reviews
- [ ] Multi-tenancy

## 📞 Suporte

### Documentação
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com)

### Contato
- **Email**: suporte@photostudio.com
- **Discord**: [Link do servidor]
- **Issues**: [GitHub Issues]

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <strong>Desenvolvido com ❤️ para fotógrafos profissionais</strong>
  <br />
  <br />
  <img src="https://img.shields.io/badge/Made%20with-Next.js-black" alt="Made with Next.js" />
  <img src="https://img.shields.io/badge/Styled%20with-Tailwind-cyan" alt="Styled with Tailwind" />
  <img src="https://img.shields.io/badge/Built%20with-TypeScript-blue" alt="Built with TypeScript" />
</div>