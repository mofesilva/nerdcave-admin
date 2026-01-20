# Análise de Migração para Expo

> **Data**: Janeiro 2026  
> **Projeto**: Nerdcave Link Tree  
> **Objetivo**: Avaliar viabilidade de publicar o app em Expo/React Native

---

## Resumo Executivo

A arquitetura MVC atual do projeto permite reaproveitar **70-80% do código não-visual** para uma versão mobile. O SDK Cappuccino já possui suporte nativo para Expo, facilitando significativamente a migração.

---

## O que PODE ser reaproveitado

### ✅ Cappuccino SDK (100%)
O SDK já tem suporte completo para Expo:
- `createExpoCappuccinoClient` - Cliente para Expo com AsyncStorage/SecureStore
- `ReactNativeMediaAdapter` - Upload de mídia via `expo-image-picker`
- Exemplo funcional em `examples/expo-app/`

### ✅ Lógica de Negócio - `lib/` (90%)

| Pasta | Status | Observação |
|-------|--------|------------|
| `lib/albums/` | ✅ Reaproveitável | Model, Mapper, Service, Controller |
| `lib/analytics/` | ✅ Reaproveitável | Model, Mapper, Service, Controller |
| `lib/articles/` | ✅ Reaproveitável | Model, Mapper, Service, Controller |
| `lib/categories/` | ✅ Reaproveitável | Model, Mapper, Service, Controller |
| `lib/links/` | ✅ Reaproveitável | Model, Mapper, Service, Controller |
| `lib/medias/` | ✅ Reaproveitável | Model, Mapper, Service, Controller |
| `lib/profiles/` | ✅ Reaproveitável | Model, Mapper, Service, Controller |
| `lib/settings/` | ✅ Reaproveitável | Model, Mapper, Service, Controller |
| `lib/tags/` | ✅ Reaproveitável | Model, Mapper, Service, Controller |
| `lib/users/` | ✅ Reaproveitável | Model, Mapper, Service, Controller |
| `lib/utils.ts` | ✅ Reaproveitável | Funções utilitárias |
| `lib/contexts/` | ⚠️ Adaptação | Trocar localStorage por AsyncStorage |
| `lib/cappuccino/` | ⚠️ Adaptação | Usar `createExpoCappuccinoClient` |

### ✅ Types - `types/` (100%)
Todas as definições TypeScript são agnósticas de plataforma.

---

## O que NÃO pode ser reaproveitado

### ❌ Componentes UI

| Pasta | Motivo |
|-------|--------|
| `_components/` | Usam DOM, Tailwind CSS, APIs web |
| `components/ui/` | Radix UI (incompatível com React Native) |
| `app/` | Next.js App Router específico |

### ❌ Dependências Web

```json
// Incompatíveis com React Native
"@radix-ui/react-*"     // UI primitives para web
"@tiptap/*"              // Editor rich text para DOM
"next-themes"            // Temas Next.js
"tailwindcss"            // CSS (RN usa StyleSheet)
```

### ❌ Funcionalidades Específicas

| Funcionalidade | Solução para Mobile |
|----------------|---------------------|
| TipTap Editor | Usar `react-native-pell-rich-editor` ou similar |
| Tailwind CSS | Usar NativeWind, Tamagui, ou StyleSheet |
| next/image | Usar `expo-image` ou `Image` nativo |
| next/link | Usar `expo-router` Link |

---

## Estratégias de Migração

### Opção 1: Monorepo (Recomendado)

Estrutura proposta:
```
/packages
  /shared           # Código compartilhado
    /lib            # Models, Services, Controllers
    /types          # TypeScript types
  /web              # Next.js app (atual)
  /mobile           # Expo app
```

**Vantagens:**
- Código compartilhado real (não duplicado)
- Alterações em Models/Services refletem em ambas plataformas
- Facilita manutenção a longo prazo

**Ferramentas:**
- Turborepo ou Nx para monorepo
- pnpm workspaces

### Opção 2: Projeto Expo Separado

Estrutura proposta:
```
/nerdcave-mobile
  /app              # Expo Router pages
  /components       # React Native components
  /lib              # Cópia de lib/ adaptada
  /types            # Cópia de types/
```

**Vantagens:**
- Setup mais simples
- Independência total
- Sem overhead de monorepo

**Desvantagens:**
- Código duplicado
- Sincronização manual de alterações

---

## Stack Recomendada para Mobile

| Categoria | Biblioteca |
|-----------|------------|
| Framework | Expo SDK 52+ |
| Navegação | Expo Router |
| Estilização | NativeWind (Tailwind para RN) |
| Componentes UI | Tamagui ou React Native Paper |
| Formulários | React Hook Form |
| Estado | Context API (já usado) |
| Storage | AsyncStorage + SecureStore |
| Imagens | expo-image |
| Ícones | lucide-react-native |

---

## Adaptações Necessárias

### 1. Contextos (lib/contexts/)

```typescript
// AutoLoginContext - Antes (Web)
localStorage.getItem('token')

// AutoLoginContext - Depois (Expo)
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.getItem('token')
```

### 2. Cliente Cappuccino

```typescript
// Web
import { getCappuccinoClient } from '@/lib/cappuccino/client';

// Expo
import { createExpoCappuccinoClient } from '@cappuccino/web-sdk/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const client = createExpoCappuccinoClient({
    apiUrl: process.env.EXPO_PUBLIC_CAPPUCCINO_API_URL,
    apiKey: process.env.EXPO_PUBLIC_CAPPUCCINO_API_KEY,
    asyncStorage: AsyncStorage,
    secureStore: SecureStore,
});
```

### 3. Upload de Mídia

```typescript
// Expo - usando ReactNativeMediaAdapter
import * as ImagePicker from 'expo-image-picker';
import { ReactNativeMediaAdapter } from '@cappuccino/web-sdk/react-native';

const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
});

if (!result.canceled) {
    const adapter = new ReactNativeMediaAdapter();
    await adapter.upload(result.assets[0]);
}
```

---

## Estimativa de Esforço

| Fase | Tarefa | Tempo Estimado |
|------|--------|----------------|
| 1 | Setup Expo + Expo Router | 1-2 dias |
| 2 | Configurar NativeWind | 1 dia |
| 3 | Adaptar contextos (storage nativo) | 1-2 dias |
| 4 | Criar componentes base (Button, Card, Input, etc.) | 3-4 dias |
| 5 | Tela de Login | 1 dia |
| 6 | Dashboard | 2-3 dias |
| 7 | Listagem de Posts | 2 dias |
| 8 | Editor de Posts (simplificado) | 3-4 dias |
| 9 | Gerenciamento de Links | 2 dias |
| 10 | Galeria de Mídia | 2-3 dias |
| 11 | Perfil e Configurações | 1-2 dias |
| 12 | Testes e ajustes | 2-3 dias |
| **Total** | | **~3-4 semanas** |

---

## Componentes UI a Recriar

### Prioridade Alta
- [ ] Button
- [ ] Card
- [ ] Input
- [ ] Switch
- [ ] Avatar
- [ ] Badge
- [ ] IconContainer

### Prioridade Média
- [ ] Dialog/Modal
- [ ] Dropdown/Select
- [ ] Tabs
- [ ] ScrollArea
- [ ] Separator

### Prioridade Baixa
- [ ] Tooltip
- [ ] Popover
- [ ] Rich Text Editor

---

## Checklist de Validação

### Antes de Começar
- [ ] Decidir entre Monorepo ou Projeto Separado
- [ ] Configurar variáveis de ambiente Expo
- [ ] Testar conexão com API Cappuccino
- [ ] Validar autenticação via SDK

### Durante Desenvolvimento
- [ ] Testar em iOS Simulator
- [ ] Testar em Android Emulator
- [ ] Testar em dispositivo físico
- [ ] Validar upload de mídia
- [ ] Validar persistência de sessão

### Antes de Publicar
- [ ] Configurar EAS Build
- [ ] Gerar builds de produção
- [ ] Testar em TestFlight (iOS)
- [ ] Testar em Google Play Console (Android)

---

## Conclusão

A migração para Expo é **viável e recomendada**. A arquitetura MVC utilizada no projeto facilita o reaproveitamento de código. O maior esforço será na recriação da camada de UI, que é inerente a qualquer migração web → mobile.

**Próximos Passos:**
1. Decidir estratégia (Monorepo vs Projeto Separado)
2. Criar projeto Expo base
3. Configurar NativeWind para manter familiaridade com Tailwind
4. Migrar contextos e adaptar storage
5. Desenvolver componentes UI incrementalmente
