import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Star,
  Building,
  TrendingUp,
  Activity
} from 'lucide-react'

const SavedLeads = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Mock saved leads data
  const savedLeads = [
    {
      id: 1,
      company_name: "Tech Solutions Inc",
      website: "https://techsolutions.com",
      phone: "+1 (555) 987-6543",
      address: "456 Tech Ave, San Francisco, CA",
      city: "San Francisco",
      niche: "technology",
      score: 72,
      saved_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      company_name: "Digital Marketing Pro",
      website: "https://digitalmarketingpro.com",
      phone: "+1 (555) 234-5678",
      address: "789 Marketing Blvd, Los Angeles, CA",
      city: "Los Angeles",
      niche: "marketing",
      score: 88,
      saved_at: "2024-01-14T15:45:00Z"
    },
    {
      id: 3,
      company_name: "Web Design Studio",
      website: "https://webdesignstudio.com",
      phone: "+1 (555) 345-6789",
      address: "321 Design St, Austin, TX",
      city: "Austin",
      niche: "design",
      score: 91,
      saved_at: "2024-01-13T09:20:00Z"
    }
  ]

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-600/20'
    if (score >= 60) return 'bg-yellow-600/20'
    return 'bg-red-600/20'
  }

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
                    to="/saved"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-purple-600/20 text-purple-300"
                  >
                    Saved Leads
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
                to="/saved"
                className="block px-3 py-2 rounded-md text-base font-medium bg-purple-600/20 text-purple-300"
              >
                Saved Leads
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
          <h1 className="text-3xl font-bold text-white mb-2">Saved Leads</h1>
          <p className="text-gray-300">Your bookmarked and high-priority leads.</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Star className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">Total Saved</p>
                <p className="text-2xl font-bold text-white">{savedLeads.length}</p>
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
                <p className="text-2xl font-bold text-white">84%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Building className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">Cities</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Leads List */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Your Saved Leads</h2>
          </div>
          
          <div className="divide-y divide-white/5">
            {savedLeads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{lead.company_name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBg(lead.score)} ${getScoreColor(lead.score)}`}>
                          {lead.score}/100
                        </span>
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-300">
                        <Building className="h-4 w-4 mr-2" />
                        {lead.niche}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Activity className="h-4 w-4 mr-2" />
                        {lead.city}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
                        Website: {lead.website}
                      </span>
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">
                        Phone: {lead.phone}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-4 flex space-x-2">
                    <button className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm">
                      Generate Outreach
                    </button>
                    <button className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State (if no saved leads) */}
        {savedLeads.length === 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-12 text-center border border-white/10">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No saved leads yet</h3>
            <p className="text-gray-300 mb-6">Save leads from your search results to see them here.</p>
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Search className="mr-2 h-4 w-4" />
              Start Searching
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

export default SavedLeads