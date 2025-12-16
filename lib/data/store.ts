import { Link, Profile, Analytics } from '@/types';
import {
  LinksController,
  ProfileController,
  AnalyticsController
} from '@/lib/controllers';

/**
 * Data Store - Service layer that delegates to Controllers
 * This maintains backward compatibility while using MVC architecture
 */
export const dataStore = {
  // Links
  getLinks: async (): Promise<Link[]> => {
    const models = await LinksController.getAll();
    return models.map((model) => model.toJSON());
  },

  getLink: async (id: string): Promise<Link | undefined> => {
    const model = await LinksController.getById(id);
    return model?.toJSON();
  },

  createLink: async (link: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>): Promise<Link> => {
    const model = await LinksController.create(link);
    return model.toJSON();
  },

  updateLink: async (id: string, updates: Partial<Link>): Promise<Link | undefined> => {
    const model = await LinksController.update(id, updates);
    return model?.toJSON();
  },

  deleteLink: async (id: string): Promise<boolean> => {
    return LinksController.delete(id);
  },

  // Profile
  getProfile: async (): Promise<Profile> => {
    const model = await ProfileController.get();
    return model.toJSON();
  },

  updateProfile: async (updates: Partial<Profile>): Promise<Profile> => {
    const model = await ProfileController.update(updates);
    return model.toJSON();
  },

  // Analytics
  getAnalytics: async (): Promise<Analytics> => {
    return AnalyticsController.get();
  },
};
