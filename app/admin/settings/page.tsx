"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../ThemeProvider";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Save, Eye, Shield, Bell, Palette, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";

// Grid de cores predefinidas
const COLOR_PRESETS = [
  { name: "Blue", hex: "#0067ff" },
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Orange", hex: "#f97316" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Lime", hex: "#84cc16" },
  { name: "Green", hex: "#22c55e" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Teal", hex: "#14b8a6" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Sky", hex: "#0ea5e9" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Fuchsia", hex: "#d946ef" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('appearance');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [customHex, setCustomHex] = useState('');
  const { theme, setTheme } = useTheme();
  const { primaryColor, updatePrimaryColor, loading: settingsLoading } = useSettings();

  // Sincroniza o input hex com a cor atual
  useEffect(() => {
    setCustomHex(primaryColor);
  }, [primaryColor]);

  const handleColorSelect = async (hex: string) => {
    setIsSaving(true);
    try {
      await updatePrimaryColor(hex);
      setCustomHex(hex);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar cor:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCustomHexChange = (value: string) => {
    // Adiciona # se não tiver
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }
    setCustomHex(value);
  };

  const handleCustomHexApply = async () => {
    // Valida se é um hex válido
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(customHex)) {
      alert('Por favor, insira um código hexadecimal válido (ex: #ff0000)');
      return;
    }
    await handleColorSelect(customHex);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'seo', name: 'SEO & Meta', icon: Eye },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div />
        <Button
          onClick={handleSave}
          icon={Save}
        >
          Save Changes
        </Button>
      </div>

      {isSaved && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4" />
          Settings saved successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="bg-card rounded-xl shadow-sm border border-border/50 backdrop-blur-sm overflow-hidden">
        <div className="border-b border-border/50">
          <div className="flex gap-2 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant="ghost"
                  icon={Icon}
                  className={cn(
                    "rounded-none border-b-2 py-4",
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.name}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="p-8">
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6">Theme Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Background Style
                    </label>
                    <select className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground">
                      <option>Gradient (Purple-Slate)</option>
                      <option>Solid Color</option>
                      <option>Image Background</option>
                    </select>
                  </div>

                  {/* Primary Color Selector */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-4">
                      Primary Color
                    </label>

                    {settingsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Color Grid */}
                        <div className="grid grid-cols-8 gap-3">
                          {COLOR_PRESETS.map((color) => (
                            <button
                              key={color.hex}
                              onClick={() => handleColorSelect(color.hex)}
                              disabled={isSaving}
                              className={cn(
                                "w-10 h-10 rounded-lg transition-all hover:scale-110 relative",
                                primaryColor.toLowerCase() === color.hex.toLowerCase() && "ring-2 ring-offset-2 ring-offset-card ring-foreground"
                              )}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            >
                              {primaryColor.toLowerCase() === color.hex.toLowerCase() && (
                                <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md" />
                              )}
                            </button>
                          ))}
                        </div>

                        {/* Custom Hex Input */}
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                          <div className="flex items-center gap-2 flex-1">
                            <div
                              className="w-10 h-10 rounded-lg border border-border flex-shrink-0"
                              style={{ backgroundColor: customHex }}
                            />
                            <input
                              type="text"
                              value={customHex}
                              onChange={(e) => handleCustomHexChange(e.target.value)}
                              placeholder="#000000"
                              className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground/50 font-mono"
                              maxLength={7}
                            />
                          </div>
                          <Button
                            onClick={handleCustomHexApply}
                            disabled={isSaving || customHex === primaryColor}
                            size="sm"
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aplicar'}
                          </Button>
                        </div>

                        {/* Color Picker Native */}
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-muted-foreground">
                            Ou escolha do seletor de cores:
                          </label>
                          <input
                            type="color"
                            value={customHex}
                            onChange={(e) => handleColorSelect(e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-border"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium text-foreground">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Enable dark mode for the public page</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={theme === 'dark'}
                        onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium text-foreground">Custom CSS</p>
                      <p className="text-sm text-muted-foreground">Add custom CSS to personalize your page</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6">SEO & Meta Tags</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Page Title
                    </label>
                    <input
                      type="text"
                      defaultValue="Nerdcave - Links"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground/50"
                    />
                    <p className="text-sm text-muted-foreground mt-1">This will appear in browser tabs and search results</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Meta Description
                    </label>
                    <textarea
                      defaultValue="Your one-stop destination for all Nerdcave links and content"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground/50 resize-none"
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground mt-1">160 characters or less for optimal display</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Keywords
                    </label>
                    <input
                      type="text"
                      defaultValue="nerdcave, links, social media, tech, gaming"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground/50"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Separate keywords with commas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      OG Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/og-image.jpg"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground/50"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Recommended size: 1200x630px</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium text-foreground">Index Page</p>
                      <p className="text-sm text-muted-foreground">Allow search engines to index your page</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium text-foreground">New Clicks</p>
                      <p className="text-sm text-muted-foreground">Get notified when someone clicks your links</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium text-foreground">Weekly Reports</p>
                      <p className="text-sm text-muted-foreground">Receive weekly analytics summaries</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium text-foreground">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Updates about new features and tips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button>
                      Enable
                    </Button>
                  </div>

                  <div className="bg-muted/50 border border-border/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Active Sessions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Session (Chrome on Mac)</span>
                        <span className="text-emerald-500 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
