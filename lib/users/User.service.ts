import { DBUsersModule, type DBUser, type DBUserCreatePayload, type DBUserCredentials } from '@cappuccino/web-sdk';
import { getCappuccinoClient } from '@/lib/cappuccino/client';
import type { UserInformations } from '@/types';

interface UserParametersProps {
    id?: string;
    credentials?: DBUserCredentials;
    data?: DBUserCreatePayload;
    updates?: Partial<DBUser>;
    informations?: UserInformations;
}

function getDBUsersModule() {
    const client = getCappuccinoClient();
    return new DBUsersModule({ apiClient: client.apiClient, authManager: client.authManager });
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function signIn({ credentials }: UserParametersProps): Promise<DBUser | null> {
    const module = getDBUsersModule();
    const result = await module.signIn(credentials!);
    if (result.error || !result.document) return null;
    return result.document as unknown as DBUser;
}

export async function signInOtp({ credentials }: UserParametersProps): Promise<DBUser | null> {
    const module = getDBUsersModule();
    const result = await module.signInOtp(credentials!);
    if (result.error || !result.document) return null;
    return result.document as unknown as DBUser;
}

export async function signOut({ id }: UserParametersProps): Promise<boolean> {
    if (!id) return false;
    const module = getDBUsersModule();
    const result = await module.signOut(id);
    return !result.error;
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<DBUser[]> {
    const module = getDBUsersModule();
    const result = await module.find();
    if (result.error || !result.documents) return [];
    return result.documents;
}

export async function getUserById({ id }: UserParametersProps): Promise<DBUser | null> {
    const module = getDBUsersModule();
    const result = await module.findById(id!);
    if (result.error || !result.document) return null;
    return result.document;
}

export async function createUser({ data }: UserParametersProps): Promise<DBUser> {
    const module = getDBUsersModule();
    const result = await module.create(data!);
    if (result.error || !result.document) {
        throw new Error(result.errorMsg || 'Failed to create user');
    }
    return result.document;
}

export async function updateUser({ id, updates }: UserParametersProps): Promise<DBUser | null> {
    if (!updates) return null;
    const module = getDBUsersModule();
    const result = await module.update(id!, updates);
    if (result.error) return null;
    return getUserById({ id });
}

export async function deleteUser({ id }: UserParametersProps): Promise<boolean> {
    const module = getDBUsersModule();
    const result = await module.delete(id!);
    return !result.error;
}

// ─── INFORMATIONS ────────────────────────────────────────────────────────────

export async function updateUserInformations({ id, informations }: UserParametersProps): Promise<DBUser | null> {
    return updateUser({ id, updates: { informations } as Partial<DBUser> });
}

export async function setAnalyticsConsent({ id }: UserParametersProps, granted: boolean): Promise<DBUser | null> {
    const user = await getUserById({ id });
    if (!user) return null;

    const currentInformations = (user as any).informations as UserInformations | undefined;
    const informations: UserInformations = {
        ...currentInformations,
        analyticsConsent: {
            granted,
            grantedAt: granted ? new Date() : currentInformations?.analyticsConsent?.grantedAt,
            revokedAt: !granted ? new Date() : undefined,
        },
    };

    return updateUserInformations({ id, informations });
}
