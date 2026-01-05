export type Profile = {
    _id: string;
    name: string;
    title: string;
    bio: string;
    avatarUrl?: string;
    followers: number;
    videos: number;
    views: number;
};

export const defaultProfile: Profile = {
    _id: '1',
    name: 'Nerdcave',
    title: 'Gaming • Tech • Content Creator',
    bio: 'Welcome to my corner of the internet! I create content about gaming, technology, and everything in between. Join me on this adventure!',
    followers: 100000,
    videos: 500,
    views: 1000000,
};
