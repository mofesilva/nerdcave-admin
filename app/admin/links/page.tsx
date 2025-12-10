"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { Link } from "@/types";

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    gradient: 'from-purple-500 to-pink-500',
    isActive: true,
  });

  useEffect(() => {
    // In a real app, fetch from API
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    // Mock fetch - replace with actual API call
    const mockLinks: Link[] = [
      {
        id: '1',
        title: '🎮 Gaming Content',
        description: 'Check out my latest gaming videos and streams',
        url: 'https://youtube.com/@nerdcave',
        gradient: 'from-red-500 to-pink-500',
        isActive: true,
        order: 1,
        clicks: 1250,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: '💻 Tech Blog',
        description: 'Articles about coding, tech reviews, and tutorials',
        url: 'https://blog.nerdcave.com',
        gradient: 'from-blue-500 to-cyan-500',
        isActive: true,
        order: 2,
        clicks: 890,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: '3',
        title: '🎙️ Podcast',
        description: 'Weekly discussions on gaming and tech',
        url: 'https://podcast.nerdcave.com',
        gradient: 'from-purple-500 to-indigo-500',
        isActive: true,
        order: 3,
        clicks: 645,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
    ];
    setLinks(mockLinks);
  };

  const handleOpenModal = (link?: Link) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        title: link.title,
        description: link.description,
        url: link.url,
        gradient: link.gradient,
        isActive: link.isActive,
      });
    } else {
      setEditingLink(null);
      setFormData({
        title: '',
        description: '',
        url: '',
        gradient: 'from-purple-500 to-pink-500',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save to API
    console.log('Saving link:', formData);
    handleCloseModal();
    fetchLinks();
  };

  const handleToggleActive = (id: string) => {
    // In a real app, call API
    setLinks(links.map(link => 
      link.id === id ? { ...link, isActive: !link.isActive } : link
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      // In a real app, call API
      setLinks(links.filter(link => link.id !== id));
    }
  };

  const gradientOptions = [
    { name: 'Purple-Pink', value: 'from-purple-500 to-pink-500' },
    { name: 'Blue-Cyan', value: 'from-blue-500 to-cyan-500' },
    { name: 'Red-Pink', value: 'from-red-500 to-pink-500' },
    { name: 'Green-Emerald', value: 'from-green-500 to-emerald-500' },
    { name: 'Orange-Yellow', value: 'from-orange-500 to-yellow-500' },
    { name: 'Violet-Purple', value: 'from-violet-500 to-purple-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Links</h1>
            <p className="text-gray-600 mt-1">Add, edit, or remove links from your link tree</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Link
          </button>
        </div>

        {/* Links List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-gray-400 hover:text-gray-600 cursor-move">
                        <GripVertical className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{link.title}</p>
                        <p className="text-sm text-gray-500">{link.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 text-sm"
                      >
                        {link.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{link.clicks}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(link.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          link.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {link.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(link.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title={link.isActive ? 'Hide' : 'Show'}
                        >
                          {link.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleOpenModal(link)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingLink ? 'Edit Link' : 'Add New Link'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="🎮 Gaming Content"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Brief description of your link"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="https://example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gradient Color
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {gradientOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, gradient: option.value })}
                          className={`p-3 rounded-lg border-2 ${
                            formData.gradient === option.value
                              ? 'border-purple-600'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className={`h-8 rounded bg-gradient-to-r ${option.value}`} />
                          <p className="text-xs text-gray-600 mt-1">{option.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                      Active (visible on link tree)
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      {editingLink ? 'Save Changes' : 'Add Link'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
