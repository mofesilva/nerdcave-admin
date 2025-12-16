import { getProfileCollection } from '@/lib/collections/profile.collection';
import { ProfileModel } from '@/lib/models/Profile.model';
import type { Profile } from '@/types';

export class ProfileController {
    private static collection = getProfileCollection();

    static async get(): Promise<ProfileModel> {
        try {
            const result = await this.collection.find();

            if (!result.error && result.documents && result.documents.length > 0) {
                return ProfileModel.fromDocument(result.documents[0]);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }

        return ProfileModel.getDefault();
    }

    static async update(updates: Partial<Profile>): Promise<ProfileModel> {
        const result = await this.collection.find();

        if (result.error || !result.documents || result.documents.length === 0) {
            throw new Error('Profile not found');
        }

        const profileId = (result.documents[0] as any)._id;
        await this.collection.updateOne(profileId, {
            ...updates,
            updatedAt: new Date()
        } as any);

        return this.get();
    }

    static async incrementFollowers(count: number = 1): Promise<ProfileModel> {
        const profile = await this.get();
        return this.update({ followers: profile.followers + count });
    }

    static async incrementVideos(count: number = 1): Promise<ProfileModel> {
        const profile = await this.get();
        return this.update({ videos: profile.videos + count });
    }

    static async incrementViews(count: number = 1): Promise<ProfileModel> {
        const profile = await this.get();
        return this.update({ views: profile.views + count });
    }
}
