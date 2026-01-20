# Sistema de Temas - Documentação Completa

## Visão Geral

O sistema de temas do NerdCave CMS permite que o usuário personalize as cores do painel administrativo, com suporte a **dois temas independentes**: Light (Claro) e Dark (Escuro).

### Conceitos Fundamentais

| Conceito | Descrição |
|----------|-----------|
| **Tema Ativo** | O tema atualmente sendo exibido no sistema (light ou dark). Controlado pelo **Toggle no Header**. |
| **Tema Sendo Editado** | O tema que o usuário está customizando na página `/admin/theme`. Controlado pelo **SegmentedControl**. |
| **Isolamento Total** | Light e Dark são 100% independentes. Editar um NUNCA afeta o outro. |

---

## Arquitetura (MVC 5 Camadas)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              UI LAYER                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  ThemeToggle.tsx          → Troca tema ativo (light ↔ dark)                 │
│  app/admin/theme/page.tsx → Edita configurações de cores                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                           CONTEXT LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  SettingsContext.tsx      → Estado global + API de temas                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                          CONTROLLER LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Settings.controller.ts   → Fachada para Services                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                           SERVICE LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Settings.service.ts      → Lógica de negócio + chamadas SDK                │
├─────────────────────────────────────────────────────────────────────────────┤
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  Settings.collection.ts   → Factory de Collection                           │
│  Settings.mapper.ts       → snake_case → camelCase                          │
│  Settings.model.ts        → Tipos + Defaults                                │
│  Settings.types.ts        → ThemeMode, ThemeMedia                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Arquivos Envolvidos

### 1. Tipos e Modelos

#### `lib/settings/Settings.types.ts`
```typescript
export type ThemeMode = 'light' | 'dark';
export type ThemeMedia = Record<string, Media | undefined>;
```

#### `lib/settings/Settings.model.ts`
Define o tipo `AdminThemeSetting` com todas as cores customizáveis:
- `backgroundColor`, `foregroundColor` (cores de layout)
- `accentColor`, `accentTextColor` (cor de destaque/botões)
- `sidebarBackgroundColor`, `sidebarForegroundColor`, etc.
- `cardBackgroundColor`, `cardForegroundColor`, `cardBorderColor`
- `themeMedia` (logos, favicon)

Também define os defaults:
- `DEFAULT_ADMIN_THEME_LIGHT`
- `DEFAULT_ADMIN_THEME_DARK`

---

### 2. Camada de Dados

#### `lib/settings/Settings.collection.ts`
```typescript
export function getSettingsCollection() {
    return createCollection<AdminThemeSetting>('settings');
}
```

#### `lib/settings/Settings.mapper.ts`
Converte documentos do MongoDB (snake_case) para objetos TypeScript (camelCase).

---

### 3. Camada de Negócio

#### `lib/settings/Settings.service.ts`

| Função | Descrição |
|--------|-----------|
| `getThemeSettingByMode({ themeMode })` | Busca tema por modo (light/dark) |
| `getOrCreateThemeSettingByMode({ themeMode })` | Busca ou cria tema se não existir |
| `getAllAdminThemeSettings()` | Retorna `{ light, dark }` |
| `updateThemeSetting({ id, updates })` | Atualiza tema no banco |
| `resetThemeSetting({ themeMode })` | Deleta e recria com defaults |

---

### 4. Camada Controller

#### `lib/settings/Settings.controller.ts`
Fachada que repassa para Service. Mesmos métodos do Service.

---

### 5. Contexto React

#### `lib/contexts/SettingsContext.tsx`

**Estado:**
```typescript
settings: AdminThemeSetting | null  // Tema ativo atualmente
activeThemeMode: ThemeMode          // 'light' ou 'dark'
accentColor: string                 // Cor de destaque
sidebarLogo, loginLogo, favicon     // Medias
```

**LocalStorage (Isolado):**
```
nerdcave_admin_theme_light  → JSON do tema light
nerdcave_admin_theme_dark   → JSON do tema dark
nerdcave_admin_theme_mode   → 'light' ou 'dark' (qual está ativo)
theme                       → 'light' ou 'dark' (para ThemeProvider legado)
```

**Funções Públicas:**

| Função | Descrição |
|--------|-----------|
| `applyThemeSettings(data, mode)` | Salva no localStorage do `mode`. Aplica CSS **SOMENTE** se `mode === activeThemeMode`. |
| `setActiveThemeModeAndApply(mode)` | Troca o tema ativo. Muda classe `dark` no HTML + carrega e aplica cores do novo modo. |
| `refreshSettings()` | Recarrega tema ativo do banco. |

---

### 6. Componentes de UI

#### `app/admin/_components/ThemeToggle.tsx`
Toggle no header que troca entre light/dark.

```typescript
const toggle = () => setActiveThemeModeAndApply(isDark ? 'light' : 'dark');
```

**Importante:** Este componente usa `useSettings()` do SettingsContext, NÃO o ThemeProvider.

#### `app/admin/theme/page.tsx`
Página de customização de temas.

**Estados Locais:**
```typescript
selectedMode: ThemeMode              // Qual tema está sendo EDITADO
lightTheme: AdminThemeSetting | null // Dados do tema light
darkTheme: AdminThemeSetting | null  // Dados do tema dark
```

**Importante:** `selectedMode` é **independente** de `activeThemeMode`. Você pode editar o tema dark enquanto o tema light está ativo.

---

## Fluxos de Operação

### Fluxo 1: Trocar Tema Ativo (Toggle no Header)

```
┌─────────────────┐
│  ThemeToggle    │
│  (click)        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│  setActiveThemeModeAndApply(mode)               │
│  SettingsContext.tsx                            │
├─────────────────────────────────────────────────┤
│  1. Muda classe 'dark' no HTML                  │
│     → document.documentElement.classList        │
│                                                 │
│  2. Atualiza state: setActiveThemeMode(mode)    │
│                                                 │
│  3. Salva no localStorage:                      │
│     → nerdcave_admin_theme_mode = mode          │
│     → theme = mode                              │
│                                                 │
│  4. Carrega cores do cache:                     │
│     → loadThemeFromLocalStorage(mode)           │
│                                                 │
│  5. Aplica CSS:                                 │
│     → applyAllCssVariables(data)                │
│     → Define --background, --foreground, etc.   │
└─────────────────────────────────────────────────┘
```

### Fluxo 2: Salvar Customização de Tema

```
┌─────────────────┐
│  Botão Salvar   │
│  page.tsx       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│  handleSave()                                   │
│  page.tsx                                       │
├─────────────────────────────────────────────────┤
│  1. Salva no banco:                             │
│     → SettingsController.updateThemeSetting()   │
│                                                 │
│  2. Chama applyThemeSettings(data, selectedMode)│
└────────┬────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│  applyThemeSettings(data, mode)                 │
│  SettingsContext.tsx                            │
├─────────────────────────────────────────────────┤
│  1. Salva no localStorage do modo:              │
│     → saveThemeToLocalStorage(data, mode)       │
│                                                 │
│  2. VERIFICA: mode === activeThemeMode?         │
│     ├─ SIM → Aplica CSS imediatamente           │
│     └─ NÃO → Não faz nada (só salva no cache)   │
└─────────────────────────────────────────────────┘
```

### Fluxo 3: Inicialização do App

```
┌─────────────────────────────────────────────────┐
│  SettingsProvider monta                         │
├─────────────────────────────────────────────────┤
│  1. Detecta modo atual:                         │
│     → Verifica classe 'dark' no HTML            │
│     → setActiveThemeMode(mode)                  │
│                                                 │
│  2. Carrega cache do localStorage:              │
│     → loadThemeFromLocalStorage(mode)           │
│     → Aplica CSS imediatamente (sem flash)      │
│                                                 │
│  3. Após auth, sincroniza com banco:            │
│     → fetchThemeByMode(mode)                    │
│     → Atualiza cache se houver diferença        │
└─────────────────────────────────────────────────┘
```

---

## Banco de Dados

**Coleção:** `settings`  
**Documentos:** 2 registros de tema (um light, um dark)

```javascript
// Tema Dark
{
  _id: "696bc34f...",
  type: "theme",
  domain: "admin",
  theme_mode: "dark",         // snake_case no banco
  background_color: "#070707",
  foreground_color: "#f8f9fa",
  accent_color: "#0067ff",
  // ... outras cores
}

// Tema Light
{
  _id: "696bd1cb...",
  type: "theme",
  domain: "admin",
  theme_mode: "light",
  background_color: "#f8f9fa",
  foreground_color: "#212529",
  accent_color: "#0067ff",
  // ... outras cores
}
```

**Nota:** O banco usa `snake_case`. O mapper converte para `camelCase` no TypeScript.

---

## Variáveis CSS Aplicadas

| Campo do Model | Variável CSS |
|----------------|--------------|
| `accentColor` | `--primary`, `--ring` |
| `accentTextColor` | `--primary-foreground` |
| `backgroundColor` | `--background` |
| `foregroundColor` | `--foreground` |
| `mutedColor` | `--muted` |
| `mutedTextColor` | `--muted-foreground` |
| `sidebarBackgroundColor` | `--sidebar-background` |
| `sidebarForegroundColor` | `--sidebar-foreground` |
| `sidebarActiveColor` | `--sidebar-primary` |
| `sidebarHoverColor` | `--sidebar-accent` |
| `cardBackgroundColor` | `--card` |
| `cardForegroundColor` | `--card-foreground` |
| `cardBorderColor` | `--border` |

---

## Regras de Isolamento

### ✅ Comportamento Correto

| Situação | Resultado |
|----------|-----------|
| Editando **Dark** com **Dark ativo** | Salva no banco + localStorage dark + aplica CSS |
| Editando **Light** com **Dark ativo** | Salva no banco + localStorage light + **NÃO** aplica CSS |
| Trocar para **Light** depois | Carrega do localStorage light + aplica CSS |

### ❌ Nunca Deve Acontecer

- Editar um tema e o outro ser afetado
- Salvar light e as cores do dark mudarem
- Toggle não funcionar após salvar

---

## Checklist de Manutenção

### Adicionando Nova Cor ao Tema

1. **Settings.model.ts** - Adicionar ao tipo `AdminThemeSetting` + defaults
2. **Settings.mapper.ts** - Mapear snake_case → camelCase
3. **SettingsContext.tsx** - Adicionar em `applyAllCssVariables()`
4. **page.tsx** - Adicionar `<ColorRow>` na UI
5. **globals.css** - Adicionar variável CSS se necessário

### Debugando Problemas

1. **Cores não aplicam:**
   - Verificar se `applyAllCssVariables()` está sendo chamado
   - Verificar se a variável CSS existe no `globals.css`
   - Verificar console do browser por erros

2. **Temas se sobrescrevem:**
   - Verificar se `selectedMode` está correto no `handleSave()`
   - Verificar localStorage: deve haver keys separadas para light/dark

3. **Toggle não funciona:**
   - Verificar se `setActiveThemeModeAndApply()` está sendo chamado
   - Verificar se a classe `dark` está mudando no HTML
   - Verificar se ThemeToggle usa `useSettings()` e NÃO `useTheme()`

---

## Exemplo de Debug (Console do Browser)

```javascript
// Ver tema ativo
localStorage.getItem('nerdcave_admin_theme_mode')

// Ver tema light salvo
JSON.parse(localStorage.getItem('nerdcave_admin_theme_light'))

// Ver tema dark salvo
JSON.parse(localStorage.getItem('nerdcave_admin_theme_dark'))

// Ver se está no modo dark
document.documentElement.classList.contains('dark')

// Ver variáveis CSS aplicadas
getComputedStyle(document.documentElement).getPropertyValue('--background')
getComputedStyle(document.documentElement).getPropertyValue('--sidebar-background')
```

---

## Diagrama de Arquivos

```
lib/
└── settings/
    ├── Settings.types.ts      ← ThemeMode = 'light' | 'dark'
    ├── Settings.model.ts      ← AdminThemeSetting + defaults
    ├── Settings.collection.ts ← getSettingsCollection()
    ├── Settings.mapper.ts     ← adminThemeSettingFromDocument()
    ├── Settings.service.ts    ← getOrCreateThemeSettingByMode(), updateThemeSetting()
    └── Settings.controller.ts ← Fachada para Service

lib/contexts/
└── SettingsContext.tsx        ← Estado global + applyThemeSettings()

app/admin/
├── _components/
│   └── ThemeToggle.tsx        ← Toggle light/dark no header
└── theme/
    ├── page.tsx               ← Página de customização
    └── _components/
        ├── ColorRow.tsx       ← Linha de cor com picker
        ├── ThemePreview.tsx   ← Preview do tema
        └── LogosSection.tsx   ← Upload de logos
```
