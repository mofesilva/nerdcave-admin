// Profile.service.ts - Gateway para o Cappuccino SDK
// Por enquanto retorna dados mock, pode ser conectado ao SDK depois

import { type Profile, defaultProfile } from './Profile.model';

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getProfile(): Promise<Profile | null> {
    // TODO: Conectar ao Cappuccino SDK quando houver coleção de profiles
    // Por enquanto retorna o perfil padrão
    return defaultProfile;
}

export async function updateProfile({ updates }: { updates: Partial<Profile> }): Promise<Profile | null> {
    // TODO: Implementar quando houver coleção de profiles
    console.log('updateProfile not implemented', updates);
    return null;
}
