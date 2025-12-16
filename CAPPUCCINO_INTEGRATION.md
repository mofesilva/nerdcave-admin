# Integração Cappuccino Cloud Database

Este projeto foi integrado com o Cappuccino Cloud Database para gerenciar todos os dados de forma persistente e escalável.

## 📦 Estrutura de Dados

O app usa 3 collections no Cappuccino:

### 1. **links** - Links principais da página
```typescript
{
  id: string;
  title: string;
  description: string;
  url: string;
  gradient: string;
  isActive: boolean;
  order: number;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. **social_links** - Links de redes sociais
```typescript
{
  id: string;
  platform: string; // Twitter, YouTube, GitHub, Instagram, Twitch, Discord
  url: string;
  isActive: boolean;
  order: number;
}
```

### 3. **profile** - Informações do perfil
```typescript
{
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  followers: number;
  videos: number;
  views: number;
  updatedAt: Date;
}
```

## 🚀 Setup

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Edite o arquivo `.env.local` com suas credenciais do Cappuccino:

```env
CAPPUCCINO_API_URL="https://api.cappuccino.app"
CAPPUCCINO_API_KEY="seu-tenant-secret-aqui"

NEXT_PUBLIC_CAPPUCCINO_API_URL=$CAPPUCCINO_API_URL
NEXT_PUBLIC_CAPPUCCINO_API_KEY=$CAPPUCCINO_API_KEY
```

### 3. Inicializar dados no Cappuccino

Você pode usar o console do Cappuccino ou criar um script para popular as collections iniciais:

**Exemplo de dados iniciais para `links`:**
```json
[
  {
    "title": "🎮 Gaming Content",
    "description": "Check out my latest gaming videos and streams",
    "url": "https://youtube.com/@nerdcave",
    "gradient": "from-red-500 to-pink-500",
    "isActive": true,
    "order": 1,
    "clicks": 1250
  }
]
```

### 4. Rodar o projeto
```bash
npm run dev
```

## 🏗️ Arquitetura

### Server Components
- `app/page.tsx` - Página principal (busca dados do servidor)
- `components/ProfileSection.tsx` - Seção de perfil (busca do servidor)
- `components/SocialLinks.tsx` - Links sociais (busca do servidor)

### Client Components
- `app/AppProviders.tsx` - Provider do Cappuccino para hidratação
- `app/layout.tsx` - Layout raiz com hydration do estado de auth

### Data Layer
- `lib/data/store.ts` - Camada de acesso aos dados (usa Collections API)
- `lib/cappuccino/server-client.ts` - Cliente do Cappuccino para o servidor

## 🔑 Funcionalidades Cappuccino Implementadas

✅ **Collections API** - Todas as operações CRUD usando `client.collections`
✅ **Server-Side Rendering** - Dados buscados no servidor com Next.js 13+
✅ **Authentication Ready** - Estrutura preparada para login/logout
✅ **Hydration** - Estado de autenticação hidratado do servidor para o cliente
✅ **TypeScript** - Totalmente tipado com interfaces TypeScript

## 📖 Uso da API

### Buscar todos os links
```typescript
const links = await dataStore.getLinks();
```

### Criar novo link
```typescript
const newLink = await dataStore.createLink({
  title: "Novo Link",
  description: "Descrição",
  url: "https://example.com",
  gradient: "from-blue-500 to-purple-500",
  isActive: true,
  order: 7,
  clicks: 0
});
```

### Atualizar link
```typescript
await dataStore.updateLink('link-id', {
  clicks: 100,
  isActive: false
});
```

### Deletar link
```typescript
await dataStore.deleteLink('link-id');
```

## 🔒 Segurança

- API Keys são mantidas no servidor (variáveis de ambiente)
- Cookies HttpOnly para tokens de autenticação
- Collections podem ter regras de acesso configuradas no Cappuccino Console

## 📝 Próximos Passos

- [ ] Implementar painel de administração para gerenciar links
- [ ] Adicionar autenticação de usuário
- [ ] Implementar analytics com tracking de cliques
- [ ] Adicionar upload de avatar para o perfil
- [ ] Criar API Routes para operações do admin

## 🆘 Suporte

Documentação do Cappuccino SDK: [Link para docs]
Issues: [GitHub Issues]
