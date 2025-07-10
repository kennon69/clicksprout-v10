'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

interface ProductLink {
  id: string
  title: string
  url: string
  description: string
  image?: string
  hashtags: string[]
  price?: string
}

interface ABTestVariant {
  id: string
  name: string
  title: string
  description: string
  hashtags: string[]
  image?: string
  allocatedTraffic: number // percentage
}

interface MarketResearch {
  targetAudience: string
  competitorAnalysis: string[]
  trending_hashtags: string[]
  optimalPostingTimes: string[]
  estimatedReach: number
  competitiveAdvantage: string
}

interface PerformanceForecast {
  estimatedViews: { min: number; max: number }
  estimatedClicks: { min: number; max: number }
  estimatedConversions: { min: number; max: number }
  estimatedROI: { min: number; max: number }
  confidence: number // percentage
  factors: string[]
}

interface Campaign {
  id: string
  name: string
  links: ProductLink[]
  platforms: string[]
  scheduledTime?: string
  posted: boolean
  createdAt: string
  budget?: number
  abTestEnabled: boolean
  abVariants?: ABTestVariant[]
  marketResearch?: MarketResearch
  performanceForecast?: PerformanceForecast
  optimizationEnabled: boolean
  stats?: {
    views: number
    clicks: number
    shares: number
    conversions: number
  }
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newCampaignName, setNewCampaignName] = useState('')
  const [selectedLinks, setSelectedLinks] = useState<ProductLink[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [scheduledTime, setScheduledTime] = useState('')
  const [budget, setBudget] = useState<number>(100)
  const [abTestEnabled, setAbTestEnabled] = useState(false)
  const [abVariants, setAbVariants] = useState<ABTestVariant[]>([])
  const [optimizationEnabled, setOptimizationEnabled] = useState(true)
  const [showForecast, setShowForecast] = useState(false)
  const [showMarketResearch, setShowMarketResearch] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoadingResearch, setIsLoadingResearch] = useState(false)
  const router = useRouter()

  const platforms = [
    { id: 'pinterest', name: 'Pinterest', icon: '📌', color: 'bg-red-500' },
    { id: 'reddit', name: 'Reddit', icon: '👽', color: 'bg-orange-500' },
    { id: 'medium', name: 'Medium', icon: '📝', color: 'bg-green-500' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-blue-500' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' }
  ]

  useEffect(() => {
    // Load existing campaigns
    const savedCampaigns = localStorage.getItem('campaigns')
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns))
    }

    // Load any scraped content that can be added to campaigns
    const savedContent = localStorage.getItem('finalContent')
    if (savedContent) {
      const content = JSON.parse(savedContent)
      const productLink: ProductLink = {
        id: Date.now().toString(),
        title: content.title,
        url: content.url,
        description: content.description,
        image: content.selectedImages?.[0],
        hashtags: content.hashtags || [],
        price: content.price
      }
      setSelectedLinks([productLink])
    }
  }, [])

  const generateCampaignId = () => {
    return 'camp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  const generateMarketResearch = async (productLink: ProductLink): Promise<MarketResearch> => {
    setIsLoadingResearch(true)
    // Simulate AI market research generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const research = {
      targetAudience: `Tech-savvy millennials and Gen-Z interested in ${productLink.title}`,
      competitorAnalysis: [
        'Competitor A: Strong social media presence',
        'Competitor B: Lower pricing strategy',
        'Competitor C: Premium positioning'
      ],
      trending_hashtags: ['#trending2025', '#techdeals', '#innovation', '#mustthave'],
      optimalPostingTimes: ['2:00 PM - 4:00 PM', '7:00 PM - 9:00 PM'],
      estimatedReach: Math.floor(Math.random() * 50000) + 10000,
      competitiveAdvantage: 'Unique features and superior user experience'
    }
    
    setIsLoadingResearch(false)
    return research
  }

  const generatePerformanceForecast = (
    budget: number,
    platforms: string[],
    hasABTest: boolean
  ): PerformanceForecast => {
    const baseFactor = budget / 100
    const platformFactor = platforms.length * 1.2
    const abTestFactor = hasABTest ? 1.3 : 1
    
    const multiplier = baseFactor * platformFactor * abTestFactor
    
    return {
      estimatedViews: {
        min: Math.floor(multiplier * 500),
        max: Math.floor(multiplier * 1500)
      },
      estimatedClicks: {
        min: Math.floor(multiplier * 25),
        max: Math.floor(multiplier * 75)
      },
      estimatedConversions: {
        min: Math.floor(multiplier * 3),
        max: Math.floor(multiplier * 12)
      },
      estimatedROI: {
        min: Math.floor(multiplier * 150),
        max: Math.floor(multiplier * 400)
      },
      confidence: Math.min(95, 60 + (platforms.length * 5) + (hasABTest ? 15 : 0)),
      factors: [
        'Historical performance data',
        'Platform algorithms analysis',
        'Audience targeting quality',
        hasABTest ? 'A/B testing optimization' : '',
        'Market trend analysis'
      ].filter(Boolean)
    }
  }

  const createCampaign = async () => {
    if (!newCampaignName.trim() || selectedLinks.length === 0 || selectedPlatforms.length === 0) {
      alert('Please fill in all required fields')
      return
    }

    // Generate market research if enabled
    let marketResearch: MarketResearch | undefined
    if (showMarketResearch && selectedLinks.length > 0) {
      marketResearch = await generateMarketResearch(selectedLinks[0])
    }

    // Generate performance forecast
    const performanceForecast = generatePerformanceForecast(
      budget,
      selectedPlatforms,
      abTestEnabled
    )

    const newCampaign: Campaign = {
      id: generateCampaignId(),
      name: newCampaignName,
      links: selectedLinks,
      platforms: selectedPlatforms,
      scheduledTime: scheduledTime || undefined,
      posted: !scheduledTime,
      createdAt: new Date().toISOString(),
      budget,
      abTestEnabled,
      abVariants: abTestEnabled ? abVariants : undefined,
      marketResearch,
      performanceForecast,
      optimizationEnabled,
      stats: {
        views: Math.floor(Math.random() * 1000),
        clicks: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
        conversions: Math.floor(Math.random() * 10)
      }
    }

    const updatedCampaigns = [...campaigns, newCampaign]
    setCampaigns(updatedCampaigns)
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns))

    // Reset form
    setNewCampaignName('')
    setSelectedLinks([])
    setSelectedPlatforms([])
    setScheduledTime('')
    setBudget(100)
    setAbTestEnabled(false)
    setAbVariants([])
    setCurrentStep(1)
    setIsCreating(false)

    alert('🚀 Advanced campaign created successfully with AI insights!')
  }

  const deleteCampaign = (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      const updatedCampaigns = campaigns.filter(c => c.id !== campaignId)
      setCampaigns(updatedCampaigns)
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns))
    }
  }

  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformId))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId])
    }
  }

  const addNewProduct = () => {
    router.push('/submit')
  }

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{campaign.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{campaign.posted ? '🟢 Active' : '🟡 Scheduled'}</span>
            {campaign.budget && <span>💰 ${campaign.budget}</span>}
            {campaign.abTestEnabled && <span>🧪 A/B Testing</span>}
            {campaign.optimizationEnabled && <span>🚀 AI Optimized</span>}
          </div>
        </div>
        <button
          onClick={() => deleteCampaign(campaign.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          🗑️
        </button>
      </div>

      {/* Campaign Stats */}
      {campaign.stats && (
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{campaign.stats.views.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Views</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{campaign.stats.clicks}</div>
            <div className="text-xs text-gray-500">Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{campaign.stats.shares}</div>
            <div className="text-xs text-gray-500">Shares</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{campaign.stats.conversions}</div>
            <div className="text-xs text-gray-500">Sales</div>
          </div>
        </div>
      )}

      {/* Performance Forecast */}
      {campaign.performanceForecast && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">🔮 AI Forecast</h4>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            Expected ROI: {campaign.performanceForecast.estimatedROI.min}% - {campaign.performanceForecast.estimatedROI.max}%
            <span className="ml-2">({campaign.performanceForecast.confidence}% confidence)</span>
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Products:</span>
          <span className="font-medium text-gray-900 dark:text-white">{campaign.links.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Platforms:</span>
          <span className="font-medium text-gray-900 dark:text-white">{campaign.platforms.length}</span>
        </div>
        {campaign.scheduledTime && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Scheduled:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date(campaign.scheduledTime).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Platform Icons */}
      <div className="flex items-center space-x-2">
        {campaign.platforms.slice(0, 4).map((platformId) => {
          const platform = platforms.find(p => p.id === platformId)
          return platform ? (
            <div key={platformId} className={`w-8 h-8 ${platform.color} rounded-full flex items-center justify-center text-white text-sm`}>
              {platform.icon}
            </div>
          ) : null
        })}
        {campaign.platforms.length > 4 && (
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
            +{campaign.platforms.length - 4}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🚀 AI-Powered Campaigns</h1>
              <p className="text-gray-600 dark:text-gray-300">Create intelligent campaigns with performance forecasting, A/B testing, and market research</p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create AI Campaign
            </button>
          </div>

          {/* Enhanced Campaign Creation Modal */}
          {isCreating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🤖 AI Campaign Builder</h2>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                {/* Step Indicator */}
                <div className="mb-8">
                  <div className="flex items-center">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep >= step 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                        }`}>
                          {step}
                        </div>
                        {step < 4 && (
                          <div className={`w-16 h-1 mx-2 ${
                            currentStep > step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className={currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}>Basic Info</span>
                    <span className={currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}>AI Features</span>
                    <span className={currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}>Optimization</span>
                    <span className={currentStep >= 4 ? 'text-blue-600' : 'text-gray-500'}>Review</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Step 1: Basic Campaign Info */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Campaign Name
                        </label>
                        <input
                          type="text"
                          value={newCampaignName}
                          onChange={(e) => setNewCampaignName(e.target.value)}
                          placeholder="e.g., Summer Product Launch"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Campaign Budget ($)
                        </label>
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          min="10"
                          max="10000"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <p className="text-sm text-gray-500 mt-1">Recommended: $100-$500 for optimal reach</p>
                      </div>

                      {/* Product Links */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Product Links ({selectedLinks.length})
                          </label>
                          <button
                            onClick={addNewProduct}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            + Add Product
                          </button>
                        </div>
                        
                        {selectedLinks.length === 0 ? (
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No products added yet</p>
                            <button
                              onClick={addNewProduct}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                            >
                              Scrape First Product
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {selectedLinks.map((link) => (
                              <div key={link.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex items-center space-x-4">
                                {link.image && (
                                  <img src={link.image} alt={link.title} className="w-16 h-16 object-cover rounded-lg" />
                                )}
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white">{link.title}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{link.description}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    {link.hashtags.slice(0, 3).map((tag, i) => (
                                      <span key={i} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                {link.price && (
                                  <div className="text-lg font-bold text-green-600">{link.price}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Platform Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                          Select Platforms ({selectedPlatforms.length})
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {platforms.map((platform) => (
                            <button
                              key={platform.id}
                              onClick={() => togglePlatform(platform.id)}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                selectedPlatforms.includes(platform.id)
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                                  {platform.icon}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{platform.name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: AI Features */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🤖 AI-Powered Features</h3>
                      
                      {/* A/B Testing */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">🧪 A/B Testing</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Test multiple content variations to maximize performance</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={abTestEnabled}
                              onChange={(e) => setAbTestEnabled(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        {abTestEnabled && (
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              AI will automatically create and test 2-3 variations of your content to find the best performing version.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Variant A (Control)</h5>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Original content</div>
                                <div className="mt-2 text-lg font-semibold text-blue-600">50% traffic</div>
                              </div>
                              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Variant B (AI-Optimized)</h5>
                                <div className="text-sm text-gray-600 dark:text-gray-300">AI-enhanced copy & hashtags</div>
                                <div className="mt-2 text-lg font-semibold text-purple-600">50% traffic</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Market Research */}
                      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">📊 AI Market Research</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Get instant competitor analysis and audience insights</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showMarketResearch}
                              onChange={(e) => setShowMarketResearch(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                        
                        {showMarketResearch && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">📊 Competitor Analysis</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Analyze top competitors' strategies</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">🎯 Target Audience</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Identify optimal audience segments</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">📈 Trending Hashtags</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Discover viral hashtag opportunities</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">⏰ Optimal Timing</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Best times to post for engagement</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Optimization Settings */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">⚡ Campaign Optimization</h3>
                      
                      {/* Real-time Optimization */}
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">🚀 Real-time Optimization</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">AI continuously adjusts your campaign for maximum performance</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={optimizationEnabled}
                              onChange={(e) => setOptimizationEnabled(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                          </label>
                        </div>
                        
                        {optimizationEnabled && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                              <div className="text-2xl mb-2">🎯</div>
                              <h5 className="font-medium text-gray-900 dark:text-white mb-1">Smart Targeting</h5>
                              <p className="text-xs text-gray-600 dark:text-gray-300">Auto-adjust audience based on performance</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                              <div className="text-2xl mb-2">💰</div>
                              <h5 className="font-medium text-gray-900 dark:text-white mb-1">Budget Allocation</h5>
                              <p className="text-xs text-gray-600 dark:text-gray-300">Optimize spend across platforms</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                              <div className="text-2xl mb-2">📊</div>
                              <h5 className="font-medium text-gray-900 dark:text-white mb-1">Performance Tuning</h5>
                              <p className="text-xs text-gray-600 dark:text-gray-300">Real-time content adjustments</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Scheduling */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Schedule Campaign (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <p className="text-sm text-gray-500 mt-1">Leave empty to start immediately</p>
                      </div>

                      {/* Performance Forecast */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">🔮 Performance Forecast</h4>
                          <button
                            onClick={() => setShowForecast(!showForecast)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            {showForecast ? 'Hide' : 'Show'} Forecast
                          </button>
                        </div>
                        
                        {showForecast && (
                          <div>
                            {(() => {
                              const forecast = generatePerformanceForecast(budget, selectedPlatforms, abTestEnabled)
                              return (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                                    <h5 className="font-medium text-gray-900 dark:text-white mb-1">Views</h5>
                                    <p className="text-lg font-bold text-blue-600">{forecast.estimatedViews.min.toLocaleString()} - {forecast.estimatedViews.max.toLocaleString()}</p>
                                  </div>
                                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                                    <h5 className="font-medium text-gray-900 dark:text-white mb-1">Clicks</h5>
                                    <p className="text-lg font-bold text-green-600">{forecast.estimatedClicks.min} - {forecast.estimatedClicks.max}</p>
                                  </div>
                                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                                    <h5 className="font-medium text-gray-900 dark:text-white mb-1">Conversions</h5>
                                    <p className="text-lg font-bold text-purple-600">{forecast.estimatedConversions.min} - {forecast.estimatedConversions.max}</p>
                                  </div>
                                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                                    <h5 className="font-medium text-gray-900 dark:text-white mb-1">ROI</h5>
                                    <p className="text-lg font-bold text-orange-600">{forecast.estimatedROI.min}% - {forecast.estimatedROI.max}%</p>
                                  </div>
                                </div>
                              )
                            })()}
                            <div className="mt-4 text-center">
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                Confidence Level: <span className="font-semibold text-blue-600">{generatePerformanceForecast(budget, selectedPlatforms, abTestEnabled).confidence}%</span>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review & Launch */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🎯 Review & Launch Campaign</h3>
                      
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Campaign Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Info</h5>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              <li><strong>Name:</strong> {newCampaignName}</li>
                              <li><strong>Budget:</strong> ${budget}</li>
                              <li><strong>Products:</strong> {selectedLinks.length}</li>
                              <li><strong>Platforms:</strong> {selectedPlatforms.length}</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Features</h5>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              <li><strong>A/B Testing:</strong> {abTestEnabled ? '✅ Enabled' : '❌ Disabled'}</li>
                              <li><strong>Market Research:</strong> {showMarketResearch ? '✅ Enabled' : '❌ Disabled'}</li>
                              <li><strong>Real-time Optimization:</strong> {optimizationEnabled ? '✅ Enabled' : '❌ Disabled'}</li>
                              <li><strong>Schedule:</strong> {scheduledTime || 'Start immediately'}</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">🚀 Ready to Launch!</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Your AI-powered campaign is configured and ready to start driving results. 
                          {showMarketResearch && ' Market research will be generated automatically.'}
                          {abTestEnabled && ' A/B testing will optimize your content performance.'}
                          {optimizationEnabled && ' Real-time optimization will maximize your ROI.'}
                        </p>
                      </div>

                      {isLoadingResearch && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                          <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="text-blue-700 dark:text-blue-300">Generating AI market research...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div>
                      {currentStep > 1 && (
                        <button
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Previous
                        </button>
                      )}
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setIsCreating(false)}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      
                      {currentStep < 4 ? (
                        <button
                          onClick={() => setCurrentStep(currentStep + 1)}
                          disabled={
                            (currentStep === 1 && (!newCampaignName.trim() || selectedLinks.length === 0 || selectedPlatforms.length === 0))
                          }
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          onClick={createCampaign}
                          disabled={isLoadingResearch}
                          className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium"
                        >
                          {isLoadingResearch ? 'Generating...' : 'Launch Campaign 🚀'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Grid */}
          {campaigns.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No AI campaigns yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Create your first AI-powered campaign to start promoting products intelligently</p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Create AI Campaign
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
