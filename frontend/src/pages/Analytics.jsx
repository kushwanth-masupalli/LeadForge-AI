import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  TrendingUp,
  Building,
  Users,
  Activity,
  Calendar,
  MapPin,
  Star
} from 'lucide-react'

const Analytics = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [timeRange, setTimeRange] = useState('7days')
  const [analyticsData, setAnalyticsData] = useState({
    totalSearches: 45,
    totalLeads: 234,
    savedLeads: 67,
    averageScore: 76,
    topCities: [
      { city: 'New York', count: 45 },
      { city: 'San Francisco', count: 32 },
      { city: 'Chicago', count: 28 }
    ],
    topNiches: [
      { niche: 'restaurants', count: 67 },
      { niche: 'technology', count: 45 },
      { niche: 'retail', count: 38 }
    ],
    searchTrend: [
      { date: '2024-01-08', searches: 8 },
      { date: '2024-01-09', searches: 12 },
      { date: '2024-01-10', searches: 15 },
      { date: '2024-01-11', searches: 10 },
      { date: '2024-01-12', searches: 18 },
      { date: '2024-01-13', searches: 14 },
      { date: '2024-01-14', searches: 20 }
    ]
  })

  // Mock data - in real app this would come from API
  useEffect(() => {
    // Simulate data loading
    const mockData = {
      totalSearches: 45,
      totalLeads: 234,
      savedLeads: 67,
      averageScore: 76,
      topCities: [
        { city: 'New York', count: 45 },
        { city: 'San Francisco', count: 32 },
        { city: 'Chicago', count: 28 }
      ],
      topNiches: [
        { niche: 'restaurants', count: 67 },
        { niche: 'technology', count: 45 },
        { niche: 'retail', count: 38 }
      ],
      searchTrend: [
        { date: '2024-01-08', searches: 8 },
        { date: '2024-01-09', searches: 12 },
        { date: '2024-01-10', searches: 15 },
        { date: '2024-01-11', searches: 10 },
        { date: '2024-01-12', searches: 18 },
        { date: '2024-01-13', searches: 14 },
        { date: '2024-01-14', searches: 20 }
      ]
    }
    setAnalyticsData(mockData)
  }, [timeRange])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  LeadForge AI
                </h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50"
                  >
                    Home
                  </Link>
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/search"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50"
                  >
                    Search
                  </Link>
                  <Link
                    to="/analytics"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-purple-600/20 text-purple-300"
                  >
                    Analytics
                  </Link>
                </div>
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50"
              >
                Dashboard
              </Link>
              <Link
                to="/search"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50"
              >
                Search
              </Link>
              <Link
                to="/analytics"
                className="block px-3 py-2 rounded-md text-base font-medium bg-purple-600/20 text-purple-300"
              >
                Analytics
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
              <p className="text-gray-300">Track your lead generation performance and insights.</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input bg-white/10 border-white/20"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Search className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">Total Searches</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalSearches}</p>
                <p className="text-xs text-green-400">↑ 12% vs last week</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Building className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">Total Leads</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalLeads}</p>
                <p className="text-xs text-green-400">↑ 8% vs last week</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">Saved Leads</p>
                <p className="text-2xl font-bold text-white">{analyticsData.savedLeads}</p>
                <p className="text-xs text-green-400">↑ 15% vs last week</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="flex items-center">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">Avg. Score</p>
                <p className="text-2xl font-bold text-white">{analyticsData.averageScore}%</p>
                <p className="text-xs text-green-400">↑ 3% vs last week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Search Trend Chart */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Search Trend</h3>
            <div className="space-y-4">
              {analyticsData.searchTrend.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-300">{item.date}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-700 rounded-full h-2 mr-3">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(item.searches / 25) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-white">{item.searches}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Niches Chart */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Top Niches</h3>
            <div className="space-y-4">
              {analyticsData.topNiches.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">{item.niche}</span>
                    <span className="text-sm font-medium text-white">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(item.count / 80) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Cities and Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Cities */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Top Cities</h3>
            <div className="space-y-4">
              {analyticsData.topCities.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-purple-400 mr-3" />
                    <span className="text-sm text-gray-300">{item.city}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-white mr-2">{item.count}</span>
                    <div className="flex space-x-1">
                      {[...Array(Math.min(5, Math.ceil(item.count / 10))).keys()].map((i) => (
                        <div key={i} className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-purple-600/20 rounded-full">
                  <Search className="h-3 w-3 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-white">New search for restaurants in New York</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-blue-600/20 rounded-full">
                  <Star className="h-3 w-3 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-white">Saved lead: Tech Solutions Inc</p>
                  <p className="text-xs text-gray-400">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-green-600/20 rounded-full">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-white">Analysis complete for 5 leads</p>
                  <p className="text-xs text-gray-400">6 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-yellow-600/20 rounded-full">
                  <Users className="h-3 w-3 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-white">Outreach generated for 3 leads</p>
                  <p className="text-xs text-gray-400">8 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Analytics