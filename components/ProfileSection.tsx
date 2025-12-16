"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { ProfileController } from "@/lib/controllers";
import type { Profile } from "@/types";

export default function ProfileSection() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileModel = await ProfileController.get();
        if (profileModel) {
          setProfile(profileModel.toJSON());
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
      {profile.avatarUrl ? (
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="w-32 h-32 rounded-full mb-4 object-cover"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4">
          <User className="w-16 h-16 text-muted-foreground" />
        </div>
      )}
      <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
      {profile.bio && (
        <p className="text-muted-foreground max-w-md">{profile.bio}</p>
      )}
    </div>
  );
}
