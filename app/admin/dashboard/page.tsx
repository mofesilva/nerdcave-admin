// NOTE: In production, add authentication middleware or use NextAuth.js
// to protect all admin routes. Example:
// export const metadata = { middleware: ['auth'] }
// Or check auth status: const session = await getServerSession()

import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import { dataStore } from "@/lib/data/store";
import { MousePointerClick, Users, Eye, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const analytics = await dataStore.getAnalytics();
  const links = await dataStore.getLinks();
  const activeLinks = links.filter(link => link.isActive).length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Clicks"
            value={analytics.totalClicks.toLocaleString()}
            change="+12.5% from last week"
            icon={<MousePointerClick className="w-6 h-6" />}
            trend="up"
          />
          <StatCard
            title="Unique Visitors"
            value={analytics.uniqueVisitors.toLocaleString()}
            change="+8.2% from last week"
            icon={<Users className="w-6 h-6" />}
            trend="up"
          />
          <StatCard
            title="Active Links"
            value={activeLinks}
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <StatCard
            title="Total Views"
            value="1M+"
            change="+15.3% from last week"
            icon={<Eye className="w-6 h-6" />}
            trend="up"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Links */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Links</h3>
            <div className="space-y-4">
              {analytics.topLinks.map((link, index) => (
                <div key={link.linkId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{link.title}</p>
                      <p className="text-sm text-gray-500">{link.clicks} clicks</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ 
                          width: `${(link.clicks / analytics.topLinks[0].clicks) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Traffic by Device</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Mobile</span>
                  <span className="text-sm font-bold text-gray-900">{analytics.deviceStats.mobile}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${analytics.deviceStats.mobile}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Desktop</span>
                  <span className="text-sm font-bold text-gray-900">{analytics.deviceStats.desktop}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${analytics.deviceStats.desktop}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Tablet</span>
                  <span className="text-sm font-bold text-gray-900">{analytics.deviceStats.tablet}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${analytics.deviceStats.tablet}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Click Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Click Trends (Last 7 Days)</h3>
          <div className="h-64 flex items-end justify-between gap-4">
            {analytics.clicksByDate.map((day, index) => {
              const maxClicks = Math.max(...analytics.clicksByDate.map(d => d.clicks));
              const height = (day.clicks / maxClicks) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-purple-600 rounded-t-lg hover:bg-purple-700 transition-colors cursor-pointer" 
                       style={{ height: `${height}%` }}
                       title={`${day.clicks} clicks`}
                  />
                  <div className="text-xs text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs font-bold text-gray-900">{day.clicks}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
          <p className="text-purple-100 mb-4">Manage your link tree efficiently</p>
          <div className="flex gap-4">
            <a 
              href="/admin/links" 
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Add New Link
            </a>
            <a 
              href="/admin/profile" 
              className="bg-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-800 transition-colors"
            >
              Edit Profile
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
