"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Save, Upload } from "lucide-react";

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
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">Manage your profile information and social links</p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Picture</h2>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-5xl">
                  🤓
                </div>
                <div>
                  <button
                    type="button"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload New Photo
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    rows={4}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Followers
                  </label>
                  <input
                    type="number"
                    value={formData.followers}
                    onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Videos
                  </label>
                  <input
                    type="number"
                    value={formData.videos}
                    onChange={(e) => setFormData({ ...formData, videos: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Views
                  </label>
                  <input
                    type="number"
                    value={formData.views}
                    onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Social Media Links</h2>
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-32">
                      <input
                        type="checkbox"
                        checked={social.isActive}
                        onChange={(e) => handleSocialLinkChange(index, 'isActive', e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{social.platform}</span>
                    </div>
                    <input
                      type="url"
                      value={social.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder={`https://${social.platform.toLowerCase()}.com/...`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div>
                {isSaved && (
                  <p className="text-green-600 font-medium">✓ Changes saved successfully!</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
