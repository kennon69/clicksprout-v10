'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/contexts/SettingsContext'
import { 
  Settings, 
  User, 
  Key, 
  Palette, 
  Bell, 
  Shield, 
  Download,
  Upload,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Image,
  X,
  Check
} from 'lucide-react'

export default function SettingsPage() {
  const { 
    settings, 
    updateSettings, 
    updateNestedSettings, 
    saveSettings, 
    resetSettings, 
    exportSettings, 
    importSettings,
    uploadLogo,
    uploadFavicon,
    resetLogo,
    resetFavicon,
    hasUnsavedChanges,
    isLoading
  } = useSettings()
  
  const [activeTab, setActiveTab] = useState<string>('profile')
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await saveSettings()
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      await uploadLogo(file)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload logo')
    } finally {
      setUploadingLogo(false)
      if (logoInputRef.current) {
        logoInputRef.current.value = ''
      }
    }
  }

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingFavicon(true)
    try {
      await uploadFavicon(file)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload favicon')
    } finally {
      setUploadingFavicon(false)
      if (faviconInputRef.current) {
        faviconInputRef.current.value = ''
      }
    }
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string)
        importSettings(importedSettings)
      } catch (error) {
        console.error('Failed to import settings:', error)
        alert('Invalid settings file')
      }
    }
    reader.readAsText(file)
    
    if (importInputRef.current) {
      importInputRef.current.value = ''
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'branding', name: 'Branding', icon: Image },
    { id: 'apiKeys', name: 'API Keys', icon: Key },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Settings className="w-8 h-8 mr-3 text-blue-600" />
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your ClickSprout preferences and configuration
              </p>
            </div>
            
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-3">
                <span className="text-orange-600 dark:text-orange-400 text-sm">
                  You have unsaved changes
                </span>
                <Button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportSettings}
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Settings
                </Button>
                
                <div>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportSettings}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => importInputRef.current?.click()}
                    className="w-full justify-start"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Settings
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSettings}
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => updateSettings('profile', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.profile.timezone}
                        onChange={(e) => updateSettings('profile', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.profile.language}
                        onChange={(e) => updateSettings('profile', 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="pt">Portuguese</option>
                        <option value="ja">Japanese</option>
                        <option value="ko">Korean</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'branding' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Branding & Logo</h2>
                  
                  <div className="space-y-8">
                    {/* Logo Section */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Custom Logo</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Upload your custom logo to replace the default ClickSprout logo in the sidebar and header.
                      </p>
                      
                      <div className="flex items-start space-x-6">
                        {/* Logo Preview */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                            {settings.branding?.useCustomLogo && settings.branding?.customLogo ? (
                              <img 
                                src={settings.branding.customLogo} 
                                alt="Custom Logo"
                                className="w-20 h-20 object-contain"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">C</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Logo Controls */}
                        <div className="flex-1">
                          <div className="space-y-3">
                            <div>
                              <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                              />
                              <Button
                                onClick={() => logoInputRef.current?.click()}
                                disabled={uploadingLogo}
                                className="flex items-center"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                              </Button>
                            </div>
                            
                            {settings.branding?.useCustomLogo && (
                              <Button
                                variant="outline"
                                onClick={resetLogo}
                                className="flex items-center text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove Logo
                              </Button>
                            )}
                          </div>
                          
                          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            <p><strong>Requirements:</strong></p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li>Supported formats: PNG, JPG, GIF, SVG</li>
                              <li>Maximum file size: 2MB</li>
                              <li>Recommended size: 32x32px to 256x256px</li>
                              <li>Square aspect ratio preferred</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Favicon Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Custom Favicon</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Upload a custom favicon to replace the default browser tab icon.
                      </p>
                      
                      <div className="flex items-start space-x-6">
                        {/* Favicon Preview */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                            {settings.branding?.useCustomFavicon && settings.branding?.customFavicon ? (
                              <img 
                                src={settings.branding.customFavicon} 
                                alt="Custom Favicon"
                                className="w-12 h-12 object-contain"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">C</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Favicon Controls */}
                        <div className="flex-1">
                          <div className="space-y-3">
                            <div>
                              <input
                                ref={faviconInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFaviconUpload}
                                className="hidden"
                              />
                              <Button
                                onClick={() => faviconInputRef.current?.click()}
                                disabled={uploadingFavicon}
                                className="flex items-center"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                              </Button>
                            </div>
                            
                            {settings.branding?.useCustomFavicon && (
                              <Button
                                variant="outline"
                                onClick={resetFavicon}
                                className="flex items-center text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove Favicon
                              </Button>
                            )}
                          </div>
                          
                          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            <p><strong>Requirements:</strong></p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li>Supported formats: PNG, ICO preferred</li>
                              <li>Maximum file size: 1MB</li>
                              <li>Recommended size: 16x16px or 32x32px</li>
                              <li>Square aspect ratio required</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'apiKeys' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">API Keys</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        OpenAI API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKeys.openai ? 'text' : 'password'}
                          value={settings.apiKeys.openai}
                          onChange={(e) => updateSettings('apiKeys', 'openai', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="sk-..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKeys(prev => ({ ...prev, openai: !prev.openai }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showApiKeys.openai ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Supabase URL
                      </label>
                      <input
                        type="url"
                        value={settings.apiKeys.supabase.url}
                        onChange={(e) => updateNestedSettings('apiKeys', 'supabase', 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://your-project.supabase.co"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Supabase Anon Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKeys.supabase ? 'text' : 'password'}
                          value={settings.apiKeys.supabase.anonKey}
                          onChange={(e) => updateNestedSettings('apiKeys', 'supabase', 'anonKey', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="eyJ..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKeys(prev => ({ ...prev, supabase: !prev.supabase }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showApiKeys.supabase ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Anthropic API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKeys.anthropic ? 'text' : 'password'}
                          value={settings.apiKeys.anthropic}
                          onChange={(e) => updateSettings('apiKeys', 'anthropic', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="sk-ant-..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKeys(prev => ({ ...prev, anthropic: !prev.anthropic }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showApiKeys.anthropic ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SERP API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKeys.serp ? 'text' : 'password'}
                          value={settings.apiKeys.serp}
                          onChange={(e) => updateSettings('apiKeys', 'serp', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter SERP API key"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKeys(prev => ({ ...prev, serp: !prev.serp }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showApiKeys.serp ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Theme
                      </label>
                      <select
                        value={settings.appearance.theme}
                        onChange={(e) => updateSettings('appearance', 'theme', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Color Scheme
                      </label>
                      <div className="grid grid-cols-5 gap-3">
                        {(['blue', 'purple', 'green', 'orange', 'pink'] as const).map((color) => (
                          <button
                            key={color}
                            onClick={() => updateSettings('appearance', 'colorScheme', color)}
                            className={`h-12 rounded-lg border-2 transition-all ${
                              settings.appearance.colorScheme === color
                                ? 'border-gray-900 dark:border-white scale-105'
                                : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                            }`}
                            style={{
                              background: {
                                blue: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                purple: 'linear-gradient(135deg, #8b5cf6, #5b21b6)',
                                green: 'linear-gradient(135deg, #10b981, #059669)',
                                orange: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                pink: 'linear-gradient(135deg, #ec4899, #be185d)'
                              }[color]
                            }}
                          >
                            {settings.appearance.colorScheme === color && (
                              <Check className="w-5 h-5 text-white mx-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Font Size
                      </label>
                      <select
                        value={settings.appearance.fontSize}
                        onChange={(e) => updateSettings('appearance', 'fontSize', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.appearance.animations}
                          onChange={(e) => updateSettings('appearance', 'animations', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Enable animations and transitions
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.email}
                          onChange={(e) => updateSettings('notifications', 'email', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Email notifications
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.push}
                          onChange={(e) => updateSettings('notifications', 'push', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Push notifications
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.marketingEmails}
                          onChange={(e) => updateSettings('notifications', 'marketingEmails', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Marketing emails
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.productUpdates}
                          onChange={(e) => updateSettings('notifications', 'productUpdates', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Product updates
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.weeklyReports}
                          onChange={(e) => updateSettings('notifications', 'weeklyReports', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Weekly reports
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy & Security</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.privacy.analyticsTracking}
                          onChange={(e) => updateSettings('privacy', 'analyticsTracking', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Analytics tracking
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Data Retention Period
                      </label>
                      <select
                        value={settings.privacy.dataRetention}
                        onChange={(e) => updateSettings('privacy', 'dataRetention', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                        <option value="forever">Forever</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.privacy.shareUsageData}
                          onChange={(e) => updateSettings('privacy', 'shareUsageData', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Share usage data for improvements
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.privacy.twoFactorAuth}
                          onChange={(e) => updateSettings('privacy', 'twoFactorAuth', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Two-factor authentication
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
