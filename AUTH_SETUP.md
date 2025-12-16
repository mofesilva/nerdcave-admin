# Sistema de Autenticação Cappuccino - Nerdcave Link Tree

## 🔐 Autenticação Implementada

O sistema de autenticação foi completamente integrado com o Cappuccino Cloud Database.

### Arquivos Criados/Modificados

#### Novos Arquivos:
1. **`app/login/page.tsx`** - Página de login com formulário
2. **`app/api/auth/login/route.ts`** - API route para processar login
3. **`app/api/auth/logout/route.ts`** - API route para processar logout
4. **`middleware.ts`** - Middleware para proteger rotas `/admin`
5. **`app/admin/layout.tsx`** - Layout do admin com verificação de autenticação

#### Arquivos Modificados:
1. **`components/admin/AdminLayout.tsx`** - Adicionado botão de logout funcional e exibição do usuário autenticado
2. **`app/admin/dashboard/page.tsx`** - Removido `<AdminLayout>` duplicado

## 🚀 Como Funciona

### 1. Fluxo de Login
```
Usuário acessa /admin → Middleware verifica cookie → Se não autenticado → Redireciona para /login
```

### 2. Processo de Autenticação
1. Usuário preenche email e senha em `/login`
2. Form submete para `/api/auth/login`
3. API usa `authManager.signIn({ login, password })` do Cappuccino
4. Cappuccino define cookies HttpOnly automaticamente
5. Usuário é redirecionado para `/admin/dashboard`

### 3. Proteção de Rotas
- **Middleware** (`middleware.ts`) intercepta todas as requisições para `/admin/*`
- Verifica presença do cookie `cappuccino_access_token`
- Redireciona para `/login` se não autenticado

### 4. Logout
- Botão de logout no sidebar do admin
- Chama `/api/auth/logout`
- `authManager.signOut()` limpa os cookies
- Redireciona para `/login`

## 📋 Configuração Necessária

### 1. Criar Usuário Admin no Cappuccino
Você precisa criar um usuário no Cappuccino Database:

**Via Console Cappuccino:**
- Acesse o console do Cappuccino
- Vá para "Authentication" ou "DB Users"
- Crie um novo usuário com:
  - Email: `admin@nerdcave.com`
  - Senha: (escolha uma senha segura)
  - Role: Admin (se aplicável)

**Via API (alternativa):**
```typescript
// Você pode criar um script de setup
const { authManager } = await getServerClient();
await authManager.signUp({
  email: 'admin@nerdcave.com',
  password: 'sua-senha-segura'
});
```

### 2. Variáveis de Ambiente
Certifique-se de que `.env.local` está configurado:
```env
CAPPUCCINO_API_URL="https://api.cappuccino.app"
CAPPUCCINO_API_KEY="seu-tenant-secret-aqui"
NEXT_PUBLIC_CAPPUCCINO_API_URL=$CAPPUCCINO_API_URL
NEXT_PUBLIC_CAPPUCCINO_API_KEY=$CAPPUCCINO_API_KEY
```

## 🧪 Testando

### 1. Executar o App
```bash
npm run dev
```

### 2. Acessar Login
- Acesse: `http://localhost:3000/admin`
- Será redirecionado para: `http://localhost:3000/login`

### 3. Fazer Login
- Use as credenciais criadas no Cappuccino
- Exemplo:
  - Email: `admin@nerdcave.com`
  - Senha: `sua-senha`

### 4. Verificar Autenticação
- Após login, será redirecionado para `/admin/dashboard`
- Sidebar mostrará seu email
- Botão de logout estará funcional

### 5. Testar Logout
- Clique no ícone de logout no sidebar
- Será redirecionado para `/login`
- Tentar acessar `/admin` novamente redirecionará para login

## 🔒 Segurança

### Implementado:
✅ Cookies HttpOnly (protege contra XSS)
✅ Middleware de proteção de rotas
✅ Verificação server-side no layout do admin
✅ Tokens gerenciados pelo Cappuccino SDK
✅ Logout limpa cookies adequadamente

### Recomendações Adicionais:
- Use HTTPS em produção (`secure: true` nos cookies)
- Configure CORS adequadamente
- Implemente rate limiting no login
- Adicione CSRF protection se necessário
- Configure roles/permissions no Cappuccino

## 📝 Estrutura de Rotas

```
/                          → Página pública (sem auth)
/login                     → Página de login
/admin                     → Redireciona para /admin/dashboard
/admin/dashboard           → Dashboard (protegido)
/admin/links               → Gerenciar links (protegido)
/admin/profile             → Editar perfil (protegido)
/admin/analytics           → Analytics (protegido)
/admin/settings            → Configurações (protegido)
/api/auth/login            → API de login
/api/auth/logout           → API de logout
```

## 🐛 Troubleshooting

**Erro: "Missing CAPPUCCINO_API_URL or CAPPUCCINO_API_KEY"**
- Configure as variáveis de ambiente no `.env.local`

**Login não funciona:**
- Verifique se o usuário existe no Cappuccino
- Verifique as credenciais
- Confira os logs do servidor

**Redirecionamento infinito:**
- Limpe os cookies do navegador
- Verifique se o middleware está configurado corretamente

**Usuário não aparece no sidebar:**
- O hook `useAuth()` precisa do `CappuccinoProvider` no layout
- Verifique se o estado foi hidratado corretamente

## 🎯 Próximos Passos

1. **Criar usuário admin** no Cappuccino Console
2. **Testar login** com as credenciais
3. **Verificar proteção** das rotas admin
4. **Implementar roles** (opcional) para diferentes níveis de acesso
5. **Adicionar "Esqueci minha senha"** (opcional)
6. **Implementar 2FA** (opcional)

---

✨ Sistema de autenticação pronto para uso!
