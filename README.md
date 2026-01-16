# Nerdcave CMS 🚀

Headless CMS / Backoffice para gerenciamento de conteúdo do Nerdcave Studio.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- 📝 **Posts/Artigos**: Criar, editar, publicar artigos com rich text editor
- 📸 **Álbuns/Galeria**: Gerenciar galerias de fotos
- 🏷️ **Categorias & Tags**: Organizar conteúdo
- 📁 **Media Library**: Upload e gerenciamento de imagens
- 🔗 **Links**: Gerenciar links do linktree
- 👤 **Perfil**: Configurações de perfil
- 📊 **Analytics**: Dashboard com métricas
- ⚙️ **Settings**: Configurações do site (cores, SEO, etc)

## 📁 Estrutura

```
nerdcave-link-tree/
├── app/
│   ├── admin/            # Backoffice/CMS
│   │   ├── posts/        # Gerenciamento de artigos
│   │   ├── albums/       # Gerenciamento de álbuns
│   │   ├── categories/   # Gerenciamento de categorias
│   │   ├── tags/         # Gerenciamento de tags
│   │   ├── media/        # Biblioteca de mídia
│   │   ├── links/        # Gerenciamento de links
│   │   ├── profile/      # Perfil do usuário
│   │   ├── analytics/    # Dashboard de analytics
│   │   └── settings/     # Configurações
│   ├── api/              # API routes
│   └── login/            # Página de login
├── lib/
│   ├── cappuccino/       # Cliente Cappuccino (BaaS)
│   ├── articles/         # Módulo de artigos
│   ├── albums/           # Módulo de álbuns
│   ├── categories/       # Módulo de categorias
│   ├── tags/             # Módulo de tags
│   ├── medias/           # Módulo de mídias
│   ├── links/            # Módulo de links
│   ├── profiles/         # Módulo de perfis
│   ├── settings/         # Módulo de configurações
│   └── contexts/         # Contexts React
└── components/           # Componentes compartilhados
```

## 🚀 Configuração

### Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/mofesilva/nerdcave-link-tree.git
cd nerdcave-link-tree
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais:
- `NEXT_PUBLIC_CAPPUCCINO_API_URL`: URL do backend Cappuccino
- `NEXT_PUBLIC_CAPPUCCINO_API_KEY`: API Key do tenant

4. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) - será redirecionado para /admin

## 🛠️ Tecnologias

- **[Next.js 16](https://nextjs.org/)** - React framework
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Estilos utilitários
- **[Cappuccino SDK](https://github.com/cappuccino)** - Backend as a Service
- **[TipTap](https://tiptap.dev/)** - Rich text editor
- **[Lucide React](https://lucide.dev/)** - Ícones

## 🔗 Projetos Relacionados

- **nerdcave-site**: Site público que consome os dados deste CMS
- **cappuccino-js-sdk**: SDK JavaScript para o backend Cappuccino

## 📝 Arquitetura

Este projeto segue uma arquitetura em camadas:

```
Model (tipos)
    ↓
Collection (acesso ao banco via Cappuccino SDK)
    ↓
Mapper (conversão de dados)
    ↓
Service (lógica de negócios)
    ↓
Controller (interface de acesso)
    ↓
UI (componentes React)
```

Isso permite que a lógica de negócios seja facilmente reutilizada em outros projetos que consumam o mesmo backend Cappuccino.
