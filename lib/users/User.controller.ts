import type { DBUser, DBUserCreatePayload, DBUserCredentials } from '@cappuccino/web-sdk';
import * as UserService from './User.service';
import type { UserInformations } from '@/types';

interface UserControllerProps {
    id?: string;
    credentials?: DBUserCredentials;
    data?: DBUserCreatePayload;
    updates?: Partial<DBUser>;
    informations?: UserInformations;
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function signIn({ credentials }: UserControllerProps): Promise<DBUser | null> {
    return UserService.signIn({ credentials });
}

export async function signInOtp({ credentials }: UserControllerProps): Promise<DBUser | null> {
    return UserService.signInOtp({ credentials });
}

export async function signOut({ id }: UserControllerProps): Promise<boolean> {
    return UserService.signOut({ id });
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<DBUser[]> {
    return UserService.getAllUsers();
}

export async function getUserById({ id }: UserControllerProps): Promise<DBUser | null> {
    return UserService.getUserById({ id });
}

export async function createUser({ data }: UserControllerProps): Promise<DBUser> {
    return UserService.createUser({ data });
}

export async function updateUser({ id, updates }: UserControllerProps): Promise<DBUser | null> {
    return UserService.updateUser({ id, updates });
}

export async function deleteUser({ id }: UserControllerProps): Promise<boolean> {
    return UserService.deleteUser({ id });
}

// ─── INFORMATIONS ────────────────────────────────────────────────────────────

export async function updateUserInformations({ id, informations }: UserControllerProps): Promise<DBUser | null> {
    return UserService.updateUserInformations({ id, informations });
}

export async function setAnalyticsConsent({ id }: UserControllerProps, granted: boolean): Promise<DBUser | null> {
    return UserService.setAnalyticsConsent({ id }, granted);
}
