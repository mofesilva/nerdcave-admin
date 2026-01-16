"use client";

import { useState } from "react";
import { Save, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/_components/Button";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: 'Nerdcave',
    title: 'Gaming • Tech • Content Creator',
    bio: 'Welcome to my corner of the internet! 🚀 I create content about gaming, technology, and everything in between. Join me on this adventure!',
    followers: '100000',
    videos: '500',
    views: '1000000',
  });

  const [socialLinks, setSocialLinks] = useState([
    { platform: 'Twitter', url: 'https://twitter.com/nerdcave', isActive: true },
    { platform: 'YouTube', url: 'https://youtube.com/@nerdcave', isActive: true },
    { platform: 'GitHub', url: 'https://github.com/nerdcave', isActive: true },
    { platform: 'Instagram', url: 'https://instagram.com/nerdcave', isActive: true },
    { platform: 'Twitch', url: 'https://twitch.tv/nerdcave', isActive: true },
    { platform: 'Discord', url: 'https://discord.gg/nerdcave', isActive: true },
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save to API
    console.log('Saving profile:', formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSocialLinkChange = (index: number, field: string, value: string | boolean) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Profile Picture</h2>
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full shadow-xl shadow-primary/20 ring-4 ring-background">
              </div>
              <div>
                <Button
                  type="button"
                  icon={Upload}
                >
                  Upload New Photo
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50 resize-none"
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Followers
                </label>
                <input
                  type="number"
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Videos
                </label>
                <input
                  type="number"
                  value={formData.videos}
                  onChange={(e) => setFormData({ ...formData, videos: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Views
                </label>
                <input
                  type="number"
                  value={formData.views}
                  onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                  required
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Social Media Links</h2>
            <div className="space-y-4">
              {socialLinks.map((social, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="flex items-center gap-3 w-40">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={social.isActive}
                        onChange={(e) => handleSocialLinkChange(index, 'isActive', e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-background transition-all checked:border-primary checked:bg-primary hover:border-primary/50 focus:ring-2 focus:ring-primary/20"
                      />
                      <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{social.platform}</span>
                  </div>
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                    placeholder={`https://${social.platform.toLowerCase()}.com/...`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="sticky bottom-6 z-10">
            <div className="flex items-center justify-between bg-card/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-border/50">
              <div>
                {isSaved && (
                  <p className="text-emerald-500 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                    <Check className="w-4 h-4" />
                    Changes saved successfully!
                  </p>
                )}
              </div>
              <Button
                type="submit"
                icon={Save}
                size="lg"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

