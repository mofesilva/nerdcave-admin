import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import { dataStore } from "@/lib/data/store";
import { MousePointerClick, Users, TrendingUp, Globe } from "lucide-react";

export default async function AnalyticsPage() {
  const analytics = await dataStore.getAnalytics();
  const links = await dataStore.getLinks();

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Clicks"
            value={analytics.totalClicks.toLocaleString()}
            change="+12.5% vs last period"
            icon={<MousePointerClick className="w-6 h-6" />}
            trend="up"
          />
          <StatCard
            title="Unique Visitors"
            value={analytics.uniqueVisitors.toLocaleString()}
            change="+8.2% vs last period"
            icon={<Users className="w-6 h-6" />}
            trend="up"
          />
          <StatCard
            title="Avg. Click Rate"
            value="67.5%"
            change="+3.1% vs last period"
            icon={<TrendingUp className="w-6 h-6" />}
            trend="up"
          />
          <StatCard
            title="Countries"
            value="42"
            change="+5 new countries"
            icon={<Globe className="w-6 h-6" />}
            trend="up"
          />
        </div>

        {/* Click Trends Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Click Trends</h2>
              <p className="text-sm text-gray-600">Daily click activity over the last 7 days</p>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          
          <div className="h-80 flex items-end justify-between gap-4">
            {analytics.clicksByDate.map((day, index) => {
              const maxClicks = Math.max(...analytics.clicksByDate.map(d => d.clicks));
              const height = (day.clicks / maxClicks) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative group w-full">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg hover:from-purple-700 hover:to-purple-500 transition-all cursor-pointer" 
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.clicks} clicks
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-sm font-bold text-gray-900">{day.clicks}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance by Link */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Performance by Link</h2>
          <div className="space-y-4">
            {links.map((link) => {
              const totalClicks = analytics.totalClicks;
              const percentage = ((link.clicks / totalClicks) * 100).toFixed(1);
              return (
                <div key={link.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{link.title}</p>
                      <p className="text-sm text-gray-500">{link.url}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{link.clicks.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{percentage}%</p>
                    </div>
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${link.gradient}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device & Location Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Device Breakdown</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Mobile</p>
                      <p className="text-sm text-gray-500">iOS & Android</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{analytics.deviceStats.mobile}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${analytics.deviceStats.mobile}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">💻</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Desktop</p>
                      <p className="text-sm text-gray-500">Windows, Mac, Linux</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{analytics.deviceStats.desktop}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: `${analytics.deviceStats.desktop}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📲</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Tablet</p>
                      <p className="text-sm text-gray-500">iPad & Android tablets</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{analytics.deviceStats.tablet}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full"
                    style={{ width: `${analytics.deviceStats.tablet}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Top Countries</h2>
            <div className="space-y-4">
              {[
                { country: 'United States', flag: '🇺🇸', visitors: 3542, percentage: 28 },
                { country: 'United Kingdom', flag: '🇬🇧', visitors: 2134, percentage: 17 },
                { country: 'Canada', flag: '🇨🇦', visitors: 1876, percentage: 15 },
                { country: 'Germany', flag: '🇩🇪', visitors: 1543, percentage: 12 },
                { country: 'Brazil', flag: '🇧🇷', visitors: 1234, percentage: 10 },
                { country: 'Others', flag: '🌍', visitors: 2271, percentage: 18 },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-2xl">{item.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{item.country}</span>
                      <span className="text-sm text-gray-600">{item.visitors.toLocaleString()} visitors</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">Export Analytics Data</h3>
              <p className="text-purple-100">Download your analytics data in CSV or PDF format</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                Export as CSV
              </button>
              <button className="bg-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-800 transition-colors">
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
