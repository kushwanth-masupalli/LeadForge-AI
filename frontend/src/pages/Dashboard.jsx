import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Building, 
  Users, 
  TrendingUp,
  Activity,
  Star,
  Clock
} from 'lucide-react'

const Dashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [stats, setStats] = useState({
    totalLeads: 0,
    savedLeads: 0,
    averageScore: 0,
    recentActivity: []
  })

  // Mock data - in real app this would come from API
  useEffect(() => {
    setStats({
      totalLeads: 147,
      savedLeads: 23,
      averageScore: 72,
      recentActivity: [
        { id: 1, action: 'New search', details: 'Restaurants in New York', time: '2 hours ago' },
        { id: 2, action: 'Lead saved', details: 'Cafe XYZ', time: '4 hours ago' },
        { id: 3, action: 'Analysis complete', details: '5 leads analyzed', time: '6 hours ago' },
      ]
    })
  }, [])

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
                    className="px-3 py-2 rounded-md text-sm font-medium bg-purple-600/20 text-purple-300"
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
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50"
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
                className="block px-3 py-2 rounded-md text-base font-medium bg-purple-600/20 text-purple-300"
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
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50"
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
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300">Welcome back! Here's your lead generation overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Building className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">Total Leads</p>
                <p className="text-2xl font-bold text-white">{stats.totalLeads}</p>
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
                <p className="text-2xl font-bold text-white">{stats.savedLeads}</p>
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
                <p className="text-2xl font-bold text-white">{stats.averageScore}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">Active</p>
                <p className="text-2xl font-bold text-white">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/search"
                className="flex items-center justify-between p-3 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition-colors"
              >
                <div className="flex items-center">
                  <Search className="h-5 w-5 text-purple-400 mr-3" />
                  <span>New Search</span>
                </div>
              </Link>
              <Link
                to="/saved"
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-3" />
                  <span>Saved Leads</span>
                </div>
              </Link>
              <Link
                to="/analytics"
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-400 mr-3" />
                  <span>Analytics</span>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <Clock className="h-4 w-4 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-gray-300 text-sm">{activity.details}</p>
                    <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Leads Preview */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Recent Leads</h3>
            <Link
              to="/search"
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-300 border-b border-white/10">
                  <th className="pb-3">Company</th>
                  <th className="pb-3">City</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-white">Cafe XYZ</td>
                  <td className="py-3 text-gray-300">New York</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">85%</span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">Analyzed</span>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-white">Tech Solutions Inc</td>
                  <td className="py-3 text-gray-300">San Francisco</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm">72%</span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded-full text-sm">Pending</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-white">Local Pizza</td>
                  <td className="py-3 text-gray-300">Chicago</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">45%</span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded-full text-sm">New</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard