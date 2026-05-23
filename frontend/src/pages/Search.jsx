import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Building,
  MapPin,
  Star,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react'

const Search = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  // Mock search results - in real app this would come from API
  const mockResults = [
    {
      id: 1,
      company_name: "Cafe XYZ",
      website: "https://cafexyz.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY",
      city: "New York",
      niche: "restaurant",
      score: 85,
      https: true,
      mobile_friendly: true,
      has_seo_tags: true,
      social_links: ["https://instagram.com/cafexyz", "https://facebook.com/cafexyz"],
      weaknesses: [],
      is_saved: false
    },
    {
      id: 2,
      company_name: "Tech Solutions Inc",
      website: "https://techsolutions.com",
      phone: "+1 (555) 987-6543",
      address: "456 Tech Ave, San Francisco, CA",
      city: "San Francisco",
      niche: "technology",
      score: 72,
      https: true,
      mobile_friendly: false,
      has_seo_tags: true,
      social_links: ["https://linkedin.com/techsolutions"],
      weaknesses: ["Not mobile responsive"],
      is_saved: true
    },
    {
      id: 3,
      company_name: "Local Pizza",
      website: "http://localpizza.net",
      phone: "+1 (555) 456-7890",
      address: "789 Pizza Lane, Chicago, IL",
      city: "Chicago",
      niche: "restaurant",
      score: 45,
      https: false,
      mobile_friendly: true,
      has_seo_tags: false,
      social_links: [],
      weaknesses: ["No HTTPS", "Missing SEO tags", "No social links"],
      is_saved: false
    }
  ]

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockResults)
      setLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

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
                    className="px-3 py-2 rounded-md text-sm font-medium bg-purple-600/20 text-purple-300"
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
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50"
              >
                Dashboard
              </Link>
              <Link
                to="/search"
                className="block px-3 py-2 rounded-md text-base font-medium bg-purple-600/20 text-purple-300"
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
          <h1 className="text-3xl font-bold text-white mb-2">Search Leads</h1>
          <p className="text-gray-300">Find and analyze businesses in your target area.</p>
        </div>

        {/* Search Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                Search for businesses (e.g., "restaurants", "plumbers", "dentists")
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter business niche..."
                className="input w-full"
              />
            </div>
            <div className="md:w-48">
              <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                placeholder="City name"
                className="input w-full"
              />
            </div>
            <div className="md:w-32 flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Found {searchResults.length} businesses
            </h2>
            
            <div className="space-y-4">
              {searchResults.map((lead) => (
                <div key={lead.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{lead.company_name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBg(lead.score)} ${getScoreColor(lead.score)}`}>
                            {lead.score}/100
                          </span>
                          <button className="p-1 hover:bg-gray-700/50 rounded">
                            <Star className={`h-4 w-4 ${lead.is_saved ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-300">
                          <MapPin className="h-4 w-4 mr-2" />
                          {lead.address}, {lead.city}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Phone className="h-4 w-4 mr-2" />
                          {lead.phone}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Building className="h-4 w-4 mr-2" />
                          {lead.niche}
                        </div>
                        {lead.website && (
                          <a 
                            href={lead.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-purple-400 hover:text-purple-300"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit Website
                          </a>
                        )}
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {lead.https && (
                          <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
                            HTTPS ✓
                          </span>
                        )}
                        {lead.mobile_friendly && (
                          <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">
                            Mobile ✓
                          </span>
                        )}
                        {lead.has_seo_tags && (
                          <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs">
                            SEO ✓
                          </span>
                        )}
                        {lead.social_links.length > 0 && (
                          <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-xs">
                            Social Links
                          </span>
                        )}
                      </div>
                      
                      {lead.weaknesses.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-400 mb-1">Areas for improvement:</p>
                          <div className="flex flex-wrap gap-1">
                            {lead.weaknesses.map((weakness, index) => (
                              <span key={index} className="px-2 py-1 bg-red-600/20 text-red-400 rounded-full text-xs">
                                {weakness}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-4">
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm">
                          Generate Outreach
                        </button>
                        <button className="w-full px-4 py-2 bg-gray-700/30 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && searchResults.length === 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-12 text-center border border-white/10">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No search results yet</h3>
            <p className="text-gray-300 mb-6">Enter a business niche and city above to find leads.</p>
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <div className="bg-white/5 rounded-lg p-4">
                <Building className="h-6 w-6 text-purple-400 mb-2" />
                <p className="text-sm text-gray-300">Find real businesses with accurate contact information</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <BarChart3 className="h-6 w-6 text-blue-400 mb-2" />
                <p className="text-sm text-gray-300">Analyze websites for SEO and performance</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <Mail className="h-6 w-6 text-green-400 mb-2" />
                <p className="text-sm text-gray-300">Generate personalized outreach messages</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Search