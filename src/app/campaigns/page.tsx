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
  const router = useRouter()
  
  // Use ref to track if component is mounted
  const isMountedRef = React.useRef(true)

  const platforms = [
    { 
      id: 'pinterest', 
      name: 'Pinterest', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.690 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.999-5.373 11.999-12C24 5.372 18.626.001 12.001.001z"/>
        </svg>
      ), 
      color: 'bg-red-500' 
    },
    { 
      id: 'reddit', 
      name: 'Reddit', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      ), 
      color: 'bg-orange-500' 
    },
    { 
      id: 'medium', 
      name: 'Medium', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
        </svg>
      ), 
      color: 'bg-green-500' 
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ), 
      color: 'bg-blue-500' 
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ), 
      color: 'bg-blue-600' 
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ), 
      color: 'bg-blue-700' 
    }
  ]

  useEffect(() => {
    // Load existing campaigns and update their stats based on age
    const savedCampaigns = localStorage.getItem('campaigns')
    if (savedCampaigns) {
      const parsedCampaigns = JSON.parse(savedCampaigns)
      const updatedCampaigns = parsedCampaigns.map((campaign: Campaign) => {
        if (campaign.posted && campaign.stats) {
          // Calculate campaign age in days
          const campaignAge = Math.floor((Date.now() - new Date(campaign.createdAt).getTime()) / (1000 * 60 * 60 * 24))
          
          // Recalculate stats based on current age
          const updatedStats = generateRealisticStats(
            campaign.budget || 100,
            campaign.platforms,
            campaign.abTestEnabled,
            campaign.optimizationEnabled,
            campaign.scheduledTime,
            Math.min(campaignAge, 7) // Cap at 7 days for realistic growth
          )
          
          return {
            ...campaign,
            stats: updatedStats
          }
        }
        return campaign
      })
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setCampaigns(updatedCampaigns)
        
        // Save updated campaigns back to localStorage
        if (updatedCampaigns.length > 0) {
          localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns))
        }
      }
    }

    // Load any scraped content that can be added to campaigns
    const savedContent = localStorage.getItem('finalContent')
    if (savedContent && isMountedRef.current) {
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

    // No cleanup needed for initial data loading
  }, [])

  // Simulate realistic stat updates for active campaigns
  useEffect(() => {
    const interval = setInterval(() => {
      // Only update if component is still mounted
      if (!isMountedRef.current) return
      
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => {
          if (campaign.posted && campaign.stats) {
            // Calculate campaign age in hours
            const campaignAgeHours = (Date.now() - new Date(campaign.createdAt).getTime()) / (1000 * 60 * 60)
            
            // Growth rates decrease over time (campaigns slow down after initial burst)
            const ageDecayFactor = Math.max(0.1, 1 - (campaignAgeHours / 168)) // Decay over 7 days
            
            // Deterministic growth based on campaign performance and characteristics
            const platformCount = campaign.platforms.length
            const budgetFactor = (campaign.budget || 100) / 100
            
            // Base growth rates (per 30-second interval)
            const baseViewGrowth = Math.floor(platformCount * budgetFactor * ageDecayFactor * 2)
            const baseClickGrowth = Math.floor(baseViewGrowth * 0.12) // Maintain 12% CTR
            const baseShareGrowth = Math.floor(baseViewGrowth * 0.035) // Maintain 3.5% share rate
            const baseConversionGrowth = Math.floor(baseClickGrowth * 0.08) // Maintain 8% conversion rate
            
            return {
              ...campaign,
              stats: {
                views: campaign.stats.views + Math.max(0, baseViewGrowth),
                clicks: campaign.stats.clicks + Math.max(0, baseClickGrowth),
                shares: campaign.stats.shares + Math.max(0, baseShareGrowth),
                conversions: campaign.stats.conversions + Math.max(0, baseConversionGrowth)
              }
            }
          }
          return campaign
        })
      )
    }, 30000) // Update every 30 seconds

    return () => {
      clearInterval(interval)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const generateCampaignId = () => {
    return 'camp_' + Date.now() + '_' + (Date.now() % 1000000).toString(36)
  }

  const generateMarketResearch = async (productLink: ProductLink): Promise<MarketResearch> => {
    // Simulate AI market research generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate deterministic reach based on product characteristics
    const titleLength = productLink.title.length
    const hasPrice = productLink.price ? 1000 : 0
    const hashtagCount = productLink.hashtags.length * 500
    const baseReach = 15000 + (titleLength * 100) + hasPrice + hashtagCount
    
    return {
      targetAudience: `Tech-savvy millennials and Gen-Z interested in ${productLink.title}`,
      competitorAnalysis: [
        'Competitor A: Strong social media presence',
        'Competitor B: Lower pricing strategy',
        'Competitor C: Premium positioning'
      ],
      trending_hashtags: ['#trending2025', '#techdeals', '#innovation', '#mustthave'],
      optimalPostingTimes: ['2:00 PM - 4:00 PM', '7:00 PM - 9:00 PM'],
      estimatedReach: Math.min(60000, Math.max(10000, baseReach)),
      competitiveAdvantage: 'Unique features and superior user experience'
    }
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

  const createABVariant = (baseLink: ProductLink, variantName: string): ABTestVariant => {
    return {
      id: 'variant_' + Date.now() + '_' + variantName.toLowerCase().replace(/\s+/g, '_'),
      name: variantName,
      title: baseLink.title + ` (${variantName})`,
      description: baseLink.description,
      hashtags: baseLink.hashtags,
      image: baseLink.image,
      allocatedTraffic: 50
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
      stats: generateRealisticStats(
        budget,
        selectedPlatforms,
        abTestEnabled,
        optimizationEnabled,
        scheduledTime,
        0 // New campaign, age = 0
      )
    }

    try {
      // Save to database
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCampaign.name,
          platforms: newCampaign.platforms,
          scheduled_time: newCampaign.scheduledTime,
          posted: newCampaign.posted,
          budget: newCampaign.budget,
          ab_test_enabled: newCampaign.abTestEnabled,
          ab_variants: newCampaign.abVariants,
          market_research: newCampaign.marketResearch,
          performance_forecast: newCampaign.performanceForecast,
          optimization_enabled: newCampaign.optimizationEnabled,
          stats: newCampaign.stats
        }),
      })

      if (response.ok) {
        const savedCampaign = await response.json()
        newCampaign.id = savedCampaign.id
      }

      // Update local state
      const updatedCampaigns = [...campaigns, newCampaign]
      setCampaigns(updatedCampaigns)
      
      // Also save to localStorage for backward compatibility
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns))

      alert('Advanced campaign created successfully with AI insights!')
    } catch (error) {
      console.error('Campaign save error:', error)
      // Fallback to localStorage only
      const updatedCampaigns = [...campaigns, newCampaign]
      setCampaigns(updatedCampaigns)
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns))
      alert('Campaign created locally (database unavailable)')
    }

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

    alert('Advanced campaign created successfully with AI insights!')
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

  const generateRealisticStats = (
    budget: number,
    platforms: string[],
    hasABTest: boolean,
    hasOptimization: boolean,
    scheduledTime?: string,
    campaignAge: number = 0 // days since campaign was created
  ) => {
    // Base metrics influenced by budget (deterministic)
    const budgetMultiplier = Math.log10(budget + 10) / 2 // Logarithmic scaling
    
    // Platform reach factors
    const platformReach = {
      pinterest: 2.1,    // High visual engagement
      reddit: 1.8,       // High engagement but niche
      medium: 1.3,       // Quality audience but smaller reach
      linkedin: 1.5,     // Professional but targeted
      twitter: 2.0,      // Good viral potential
      instagram: 2.2,    // High engagement
      facebook: 1.9      // Large reach
    }
    
    // Calculate total reach multiplier
    const totalReachMultiplier = platforms.reduce((sum, platform) => {
      return sum + (platformReach[platform as keyof typeof platformReach] || 1.0)
    }, 0)
    
    // Time-based factors
    const isScheduled = !!scheduledTime
    const timeMultiplier = isScheduled ? 1.2 : 0.8 // Scheduled posts often perform better
    
    // A/B testing and optimization bonuses
    const abTestMultiplier = hasABTest ? 1.25 : 1.0
    const optimizationMultiplier = hasOptimization ? 1.15 : 1.0
    
    // Age-based growth (campaigns grow over time)
    const ageMultiplier = 1 + (campaignAge * 0.1) // 10% growth per day, max 7 days
    
    // Final multiplier
    const finalMultiplier = budgetMultiplier * totalReachMultiplier * timeMultiplier * abTestMultiplier * optimizationMultiplier * ageMultiplier
    
    // Generate deterministic base numbers based on parameters
    const budgetSeed = Math.floor(budget / 10) % 100
    const platformSeed = platforms.length * 23
    const combinedSeed = (budgetSeed + platformSeed) % 100
    
    // Use campaign characteristics for deterministic variance
    const baseViews = Math.floor(150 + (finalMultiplier * 120) + (combinedSeed * 2))
    const ctrBase = 0.12 // 12% base CTR
    const shareRateBase = 0.035 // 3.5% base share rate  
    const conversionRateBase = 0.08 // 8% base conversion rate
    
    const baseClicks = Math.floor(baseViews * ctrBase)
    const baseShares = Math.floor(baseViews * shareRateBase)
    const baseConversions = Math.floor(baseClicks * conversionRateBase)
    
    return {
      views: Math.max(1, baseViews),
      clicks: Math.max(0, baseClicks),
      shares: Math.max(0, baseShares),
      conversions: Math.max(0, baseConversions)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Campaigns</h1>
              <p className="text-gray-600 dark:text-gray-300">Create and manage your product promotion campaigns</p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create New Campaign
            </button>
          </div>

          {/* Enhanced Campaign Creation Modal */}
          {isCreating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Advanced Campaign</h2>
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
                            {selectedLinks.map((link, index) => (
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Powered Features</h3>
                      
                      {/* A/B Testing */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">A/B Testing</h4>
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
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">AI Market Research</h4>
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campaign Optimization</h3>
                      
                      {/* Real-time Optimization */}
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Real-time Optimization</h4>
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
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Performance Forecast</h4>
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Review & Launch Campaign</h3>
                      
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
                              <li><strong>A/B Testing:</strong> {abTestEnabled ? 'Enabled' : 'Disabled'}</li>
                              <li><strong>Market Research:</strong> {showMarketResearch ? 'Enabled' : 'Disabled'}</li>
                              <li><strong>Real-time Optimization:</strong> {optimizationEnabled ? 'Enabled' : 'Disabled'}</li>
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
                          className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-medium"
                        >
                          Launch Campaign 🚀
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No campaigns yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Create your first campaign to start promoting products</p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Create First Campaign
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  {/* Campaign Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{campaign.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.posted 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {campaign.posted ? 'Posted' : 'Scheduled'}
                      </span>
                      <button
                        onClick={() => deleteCampaign(campaign.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Campaign Stats */}
                  {campaign.stats && (
                    <div className="mb-4">
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{campaign.stats.views.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
                        </div>
                        <div className="text-center bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">{campaign.stats.clicks.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Clicks</p>
                        </div>
                        <div className="text-center bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{campaign.stats.shares.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Shares</p>
                        </div>
                        <div className="text-center bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2">
                          <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{campaign.stats.conversions}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Sales</p>
                        </div>
                      </div>
                      
                      {/* Performance Indicators */}
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>CTR: {((campaign.stats.clicks / campaign.stats.views) * 100).toFixed(1)}%</span>
                        <span>Conv Rate: {((campaign.stats.conversions / campaign.stats.clicks) * 100).toFixed(1)}%</span>
                        <span>Engagement: {(((campaign.stats.clicks + campaign.stats.shares) / campaign.stats.views) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  )}

                  {/* Campaign Info */}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
