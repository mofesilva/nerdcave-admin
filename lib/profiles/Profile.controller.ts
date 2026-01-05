import * as ProfileService from './Profile.service';
import type { Profile } from './Profile.model';

interface ProfileControllerProps {
    updates?: Partial<Profile>;
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getProfile(): Promise<Profile | null> {
    return ProfileService.getProfile();
}

export async function updateProfile({ updates }: ProfileControllerProps): Promise<Profile | null> {
    if (!updates) return null;
    return ProfileService.updateProfile({ updates });
}
