import { Profile } from '@/types';

export class ProfileModel {
    _id: string;
    name: string;
    title: string;
    bio: string;
    followers: number;
    videos: number;
    views: number;
    updatedAt: Date;

    constructor(data: Profile) {
        this._id = data._id;
        this.name = data.name;
        this.title = data.title;
        this.bio = data.bio;
        this.followers = data.followers;
        this.videos = data.videos;
        this.views = data.views;
        this.updatedAt = data.updatedAt;
    }

    static fromDocument(doc: any): ProfileModel {
        return new ProfileModel({
            _id: doc._id || '1',
            name: doc.name,
            title: doc.title,
            bio: doc.bio,
            followers: doc.followers ?? 0,
            videos: doc.videos ?? 0,
            views: doc.views ?? 0,
            updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
        });
    }

    static getDefault(): ProfileModel {
        return new ProfileModel({
            _id: '1',
            name: 'Nerdcave',
            title: 'Gaming • Tech • Content Creator',
            bio: 'Welcome to my corner of the internet! I create content about gaming, technology, and everything in between. Join me on this adventure!',
            followers: 100000,
            videos: 500,
            views: 1000000,
            updatedAt: new Date(),
        });
    }

    toJSON(): Profile {
        return {
            _id: this._id,
            name: this.name,
            title: this.title,
            bio: this.bio,
            followers: this.followers,
            videos: this.videos,
            views: this.views,
            updatedAt: this.updatedAt,
        };
    }
}
