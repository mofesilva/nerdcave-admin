# Nerdcave Blog - Plano de Pivot

## Visão Geral

Transformar o Nerdcave Link Tree em uma plataforma completa de blog + galeria de fotos, mantendo a funcionalidade de links existente e o design atual.

---

## Estrutura do Projeto

```
nerdcave-link-tree/
├── app/
│   ├── admin/
│   │   ├── articles/          # CRUD de artigos
│   │   │   ├── page.tsx       # Lista de artigos
│   │   │   ├── new/page.tsx   # Criar artigo
│   │   │   └── [id]/page.tsx  # Editar artigo
│   │   ├── gallery/           # Gestão de galeria
│   │   │   ├── page.tsx       # Lista de álbuns
│   │   │   ├── new/page.tsx   # Criar álbum
│   │   │   └── [id]/page.tsx  # Editar álbum + fotos
│   │   ├── categories/        # Categorias (artigos + galeria)
│   │   │   └── page.tsx
│   │   ├── tags/              # Tags
│   │   │   └── page.tsx
│   │   ├── media/             # Biblioteca de mídia central
│   │   │   └── page.tsx
│   │   ├── links/             # ✅ Já existe
│   │   ├── profile/           # ✅ Já existe
│   │   └── analytics/         # ✅ Já existe (expandir)
│   ├── blog/                  # Frontend público do blog
│   │   ├── page.tsx           # Lista de posts
│   │   └── [slug]/page.tsx    # Post individual
│   ├── gallery/               # Frontend público da galeria
│   │   ├── page.tsx           # Lista de álbuns
│   │   └── [slug]/page.tsx    # Álbum individual
│   └── page.tsx               # Home (links + destaques)
├── types/
│   ├── Article.ts
│   ├── Album.ts
│   ├── Photo.ts
│   ├── Category.ts
│   ├── Tag.ts
│   └── Media.ts
├── lib/
│   ├── models/
│   │   ├── Article.model.ts
│   │   ├── Album.model.ts
│   │   ├── Photo.model.ts
│   │   ├── Category.model.ts
│   │   ├── Tag.model.ts
│   │   └── Media.model.ts
│   ├── controllers/
│   │   ├── Articles.controller.ts
│   │   ├── Albums.controller.ts
│   │   ├── Photos.controller.ts
│   │   ├── Categories.controller.ts
│   │   ├── Tags.controller.ts
│   │   └── Media.controller.ts
│   └── collections/
│       ├── articles.collection.ts
│       ├── albums.collection.ts
│       ├── photos.collection.ts
│       ├── categories.collection.ts
│       ├── tags.collection.ts
│       └── media.collection.ts
```

---

## Fase 1: Fundação (Types, Models, Collections)

### 1.1 Interfaces (types/)

#### Article.ts
```typescript
interface Article {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;           // Resumo curto
    content: string;           // Markdown/HTML
    coverImage?: string;       // URL da imagem de capa
    categoryId: string;
    tags: string[];            // Array de tag IDs
    authorId: string;
    status: 'draft' | 'published' | 'scheduled';
    publishedAt?: Date;
    scheduledAt?: Date;
    views: number;
    readingTime: number;       // Minutos estimados
    isFeatured: boolean;
    seoTitle?: string;
    seoDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}
```

#### Album.ts
```typescript
interface Album {
    _id: string;
    title: string;
    slug: string;
    description: string;
    coverPhotoId?: string;
    categoryId: string;
    tags: string[];
    status: 'draft' | 'published';
    photoCount: number;
    views: number;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}
```

#### Photo.ts
```typescript
interface Photo {
    _id: string;
    albumId: string;
    title: string;
    description?: string;
    url: string;               // URL do Cappuccino Media Storage
    thumbnailUrl: string;
    width: number;
    height: number;
    size: number;              // bytes
    mimeType: string;
    order: number;
    exifData?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
```

#### Category.ts
```typescript
interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    type: 'article' | 'album' | 'both';
    color?: string;
    icon?: string;
    parentId?: string;         // Para subcategorias
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
```

#### Tag.ts
```typescript
interface Tag {
    _id: string;
    name: string;
    slug: string;
    usageCount: number;
    createdAt: Date;
}
```

#### Media.ts
```typescript
interface Media {
    _id: string;
    filename: string;
    originalName: string;
    url: string;
    thumbnailUrl?: string;
    mimeType: string;
    size: number;
    width?: number;
    height?: number;
    alt?: string;
    caption?: string;
    folder?: string;
    usedIn: {
        type: 'article' | 'album' | 'profile';
        id: string;
    }[];
    uploadedAt: Date;
}
```

### 1.2 Tarefas da Fase 1

- [ ] Criar `types/Article.ts`
- [ ] Criar `types/Album.ts`
- [ ] Criar `types/Photo.ts`
- [ ] Criar `types/Category.ts`
- [ ] Criar `types/Tag.ts`
- [ ] Criar `types/Media.ts`
- [ ] Atualizar `types/index.ts` com re-exports
- [ ] Criar models correspondentes
- [ ] Criar collections correspondentes
- [ ] Criar controllers correspondentes

---

## Fase 2: Backoffice - Categories & Tags

### 2.1 Página de Categorias
- Lista com drag-and-drop para reordenar
- CRUD completo
- Filtro por tipo (article/album/both)
- Cores e ícones personalizáveis

### 2.2 Página de Tags
- Lista com busca
- Criar/editar/deletar
- Mostrar contagem de uso
- Sugestão de merge para tags similares

### 2.3 Tarefas da Fase 2

- [ ] `app/admin/categories/page.tsx`
- [ ] `app/admin/tags/page.tsx`
- [ ] Componentes de modal para CRUD
- [ ] Atualizar sidebar do admin

---

## Fase 3: Backoffice - Media Library

### 3.1 Biblioteca de Mídia Central
- Upload de imagens (integração Cappuccino Media Storage)
- Grid de visualização com thumbnails
- Busca e filtros (por tipo, data, pasta)
- Seleção múltipla para deletar
- Organização por pastas
- Preview com detalhes (dimensões, tamanho, uso)

### 3.2 Tarefas da Fase 3

- [ ] `app/admin/media/page.tsx`
- [ ] Componente `MediaPicker` (reutilizável)
- [ ] Componente `MediaUploader`
- [ ] Integração com Cappuccino Media Storage
- [ ] Crop/resize básico

---

## Fase 4: Backoffice - Articles

### 4.1 Lista de Artigos
- Tabela com ordenação e filtros
- Status (draft/published/scheduled)
- Ações rápidas (publicar, despublicar, deletar)
- Busca por título/conteúdo

### 4.2 Editor de Artigos
- Editor rich text (TipTap ou similar)
- Preview lado a lado
- Inserir imagens da Media Library
- Seleção de categoria e tags
- Configurações SEO
- Agendamento de publicação
- Auto-save

### 4.3 Funcionalidades do Editor
- Headings (H1-H6)
- Bold, Italic, Underline, Strikethrough
- Links
- Listas (ordenadas e não-ordenadas)
- Blockquotes
- Code blocks com syntax highlighting
- Imagens com caption
- Embeds (YouTube, Twitter, etc.)
- Tabelas
- Separadores

### 4.4 Tarefas da Fase 4

- [ ] `app/admin/articles/page.tsx` - Lista
- [ ] `app/admin/articles/new/page.tsx` - Criar
- [ ] `app/admin/articles/[id]/page.tsx` - Editar
- [ ] Componente `ArticleEditor`
- [ ] Componente `ArticlePreview`
- [ ] Componente `ArticleSidebar` (meta, SEO, publicação)
- [ ] Integrar TipTap ou similar
- [ ] Sistema de auto-save

---

## Fase 5: Backoffice - Gallery

### 5.1 Lista de Álbuns
- Grid de álbuns com cover
- Status e contagem de fotos
- Filtro por categoria

### 5.2 Editor de Álbum
- Informações básicas (título, descrição, categoria)
- Upload múltiplo de fotos
- Drag-and-drop para reordenar
- Edição de metadados por foto
- Seleção de cover
- Preview do álbum

### 5.3 Tarefas da Fase 5

- [ ] `app/admin/gallery/page.tsx` - Lista
- [ ] `app/admin/gallery/new/page.tsx` - Criar
- [ ] `app/admin/gallery/[id]/page.tsx` - Editar
- [ ] Componente `PhotoGrid`
- [ ] Componente `PhotoUploader` (múltiplo)
- [ ] Componente `PhotoEditor` (metadados)
- [ ] Drag-and-drop para reordenar

---

## Fase 6: Frontend Público

### 6.1 Blog
- Lista de posts com paginação
- Filtro por categoria/tag
- Post individual com:
  - Imagem de capa
  - Título e meta
  - Conteúdo renderizado
  - Tempo de leitura
  - Posts relacionados
  - Compartilhamento social

### 6.2 Galeria
- Grid de álbuns
- Álbum individual com:
  - Lightbox para fotos
  - Navegação entre fotos
  - Download individual
  - Slideshow

### 6.3 Home
- Hero com destaque
- Posts recentes
- Álbuns recentes
- Links (já existe)

### 6.4 Tarefas da Fase 6

- [ ] `app/blog/page.tsx`
- [ ] `app/blog/[slug]/page.tsx`
- [ ] `app/gallery/page.tsx`
- [ ] `app/gallery/[slug]/page.tsx`
- [ ] Atualizar `app/page.tsx`
- [ ] Componente `Lightbox`
- [ ] SEO e meta tags dinâmicas

---

## Fase 7: Melhorias

### 7.1 Analytics Expandido
- Views por artigo
- Views por álbum
- Tempo médio de leitura
- Posts mais populares
- Origem do tráfego

### 7.2 Outras Melhorias
- Busca global
- Comentários (opcional)
- Newsletter (opcional)
- RSS Feed
- Sitemap automático

---

## Tecnologias Adicionais

| Funcionalidade | Tecnologia |
|----------------|------------|
| Editor Rich Text | TipTap (recomendado) ou EditorJS |
| Lightbox | yet-another-react-lightbox |
| Drag and Drop | @dnd-kit/core |
| Markdown | react-markdown + rehype |
| Syntax Highlight | shiki ou prism |
| Image Optimization | next/image + sharp |

---

## Ordem de Execução

```
Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5 → Fase 6 → Fase 7
         ↓
    (Fundação)     (Backoffice)              (Frontend) (Polish)
```

**Começamos pela Fase 1?**

---

## Notas

- Manter todo o design atual (cores, componentes, layout)
- Usar Cappuccino para tudo (DB, Auth, Media Storage)
- Seguir padrão MVC: Interface (types) → Model (class) → Controller
- Código modular e bem separado
