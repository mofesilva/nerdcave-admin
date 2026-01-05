"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import * as ProfileController from "@/lib/profiles/Profile.controller";
import type { Profile } from "@/lib/profiles/Profile.model";

export default function ProfileSection() {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const profileData = await ProfileController.getProfile();
                if (profileData) {
                    setProfile(profileData);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        }
        loadProfile();
    }, []);

    if (!profile) {
        return (
            <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4">
                    <User className="w-16 h-16 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-center">
            {profile?.avatarUrl ? (
                <div className="w-32 h-32 rounded-full mb-4 relative overflow-hidden">
                    <Image
                        src={profile.avatarUrl}
                        alt={profile.name}
                        fill
                        className="object-cover"
                    />
                </div>
            ) : (
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-foreground">{profile.name ? profile.name.charAt(0) : 'U'}</span>
                </div>
            )}
            <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
            {profile.bio && (
                <p className="text-muted-foreground max-w-md">{profile.bio}</p>
            )}
        </div>
    );
}
