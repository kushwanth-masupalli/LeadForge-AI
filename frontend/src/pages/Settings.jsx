import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Save,
  Key,
  Database,
  Bell,
  Shield,
  CheckCircle
} from 'lucide-react'

const Settings = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState({
    aiProvider: 'gemini',
    notifications: true,
    autoSave: true,
    darkMode: true
  })
  const [aiConfig, setAiConfig] = useState({
    geminiApiKey: '',
    openRouterApiKey: '',
    openRouterModel: 'meta-llama/llama-3-8b-instruct:free'
  })
  const [databaseConfig, setDatabaseConfig] = useState({
    mongodbUri: '',
    dbName: 'leadforge'
  })
  const [saveStatus, setSaveStatus] = useState(null)

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    setSaveStatus('success')
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const handleTestConnection = () => {
    // In a real app, this would test the database connection
    setSaveStatus('testing')
    setTimeout(() => setSaveStatus('success'), 2000)
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
                    to="/analytics"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50"
                  >
                    Analytics
                  </Link>
                  <Link
                    to="/settings"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-purple-600/20 text-purple-300"
                  >
                    Settings
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
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50"
              >
                Analytics
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium bg-purple-600/20 text-purple-300"
              >
                Settings
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-300">Configure your LeadForge AI application settings.</p>
        </div>

        {/* Save Status */}
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            saveStatus === 'success' ? 'bg-green-600/20 text-green-400' : 
            saveStatus === 'testing' ? 'bg-blue-600/20 text-blue-400' : 
            'bg-red-600/20 text-red-400'
          }`}>
            {saveStatus === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : null}
            {saveStatus === 'testing' ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : null}
            {saveStatus === 'success' ? 'Settings saved successfully!' : 
             saveStatus === 'testing' ? 'Testing connection...' : 'Error saving settings'}
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* General Settings */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              General Settings
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  AI Provider
                </label>
                <select
                  value={settings.aiProvider}
                  onChange={(e) => setSettings({...settings, aiProvider: e.target.value})}
                  className="input w-full"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openrouter">OpenRouter</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Choose which AI provider to use for generating outreach messages
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Email Notifications</label>
                    <p className="text-xs text-gray-400">Receive email notifications for important events</p>
                  </div>
                  <button
                    onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.notifications ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Auto Save Leads</label>
                    <p className="text-xs text-gray-400">Automatically save leads after analysis</p>
                  </div>
                  <button
                    onClick={() => setSettings({...settings, autoSave: !settings.autoSave})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.autoSave ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Dark Mode</label>
                    <p className="text-xs text-gray-400">Use dark theme for the application</p>
                  </div>
                  <button
                    onClick={() => setSettings({...settings, darkMode: !settings.darkMode})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.darkMode ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Key className="h-5 w-5 mr-2" />
              AI Configuration
            </h2>
            
            <div className="space-y-6">
              {settings.aiProvider === 'gemini' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={aiConfig.geminiApiKey}
                    onChange={(e) => setAiConfig({...aiConfig, geminiApiKey: e.target.value})}
                    placeholder="Enter your Gemini API key"
                    className="input w-full"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Get your API key from <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Google AI Studio</a>
                  </p>
                </div>
              )}
              
              {settings.aiProvider === 'openrouter' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      OpenRouter API Key
                    </label>
                    <input
                      type="password"
                      value={aiConfig.openRouterApiKey}
                      onChange={(e) => setAiConfig({...aiConfig, openRouterApiKey: e.target.value})}
                      placeholder="Enter your OpenRouter API key"
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Model
                    </label>
                    <select
                      value={aiConfig.openRouterModel}
                      onChange={(e) => setAiConfig({...aiConfig, openRouterModel: e.target.value})}
                      className="input w-full"
                    >
                      <option value="meta-llama/llama-3-8b-instruct:free">Llama 3 8B (Free)</option>
                      <option value="mistralai/mistral-7b-instruct:free">Mistral 7B (Free)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Paid)</option>
                      <option value="gpt-4">GPT-4 (Paid)</option>
                    </select>
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    Get your API key from <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">OpenRouter</a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Database Configuration */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Database Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  MongoDB URI
                </label>
                <input
                  type="password"
                  value={databaseConfig.mongodbUri}
                  onChange={(e) => setDatabaseConfig({...databaseConfig, mongodbUri: e.target.value})}
                  placeholder="mongodb+srv://..."
                  className="input w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Database Name
                </label>
                <input
                  type="text"
                  value={databaseConfig.dbName}
                  onChange={(e) => setDatabaseConfig({...databaseConfig, dbName: e.target.value})}
                  className="input w-full"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleTestConnection}
                  disabled={!databaseConfig.mongodbUri}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Test Connection
                </button>
                
                <button
                  onClick={() => {
                    // Copy example to clipboard
                    navigator.clipboard.writeText('mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/leadforge?retryWrites=true&w=majority')
                  }}
                  className="btn-outline"
                >
                  Copy Example
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings