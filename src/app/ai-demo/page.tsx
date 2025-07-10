'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import SmartEditor from '@/components/SmartEditor'
import AIContentAssistant from '@/components/AIContentAssistant'
import { Button } from '@/components/ui/button'
import { 
  Bot, 
  Sparkles, 
  Zap, 
  Brain, 
  Wand2, 
  Target,
  TrendingUp,
  BarChart3,
  Rocket,
  Star,
  ArrowRight,
  Play,
  Lightbulb
} from 'lucide-react'

export default function AIDemoPage() {
  const [demoContent, setDemoContent] = useState({
    headline: 'This Revolutionary Product Will Change Your Life',
    description: 'Discover the amazing innovation that everyone is talking about. Limited time offer - get yours before it sells out!',
    hashtags: ['#viral', '#innovation', '#musthave', '#trending', '#revolutionary'],
    platform: 'pinterest'
  })

  const [isAIVisible, setIsAIVisible] = useState(false)

  const handleSuggestionApply = (suggestion: any) => {
    console.log('Applied suggestion:', suggestion)
    // Handle suggestion application
  }

  const handleOptimize = (content: string) => {
    console.log('Optimized content:', content)
    // Handle optimization
  }

  const demoFeatures = [
    {
      icon: Brain,
      title: 'AI Content Generation',
      description: 'Generate viral headlines, descriptions, and hashtags instantly',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Viral Score Analysis',
      description: 'Get real-time scoring on your content\'s viral potential',
      color: 'from-green-500 to-blue-600'
    },
    {
      icon: Wand2,
      title: 'Smart Optimization',
      description: 'AI automatically improves your content for maximum engagement',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Target,
      title: 'Platform Targeting',
      description: 'Optimize content specifically for each social media platform',
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              AI Copilot
              <span className="block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Integration Demo
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the power of AI-driven content creation, optimization, and viral scoring 
              built directly into ClickSprout.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {demoFeatures.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Demo Sections */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Content Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Content Preview
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Platform:</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 capitalize">
                    {demoContent.platform}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {demoContent.headline}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {demoContent.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {demoContent.hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      AI Viral Score
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      87%
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: '87%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Features */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                AI Features
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Real-time Suggestions
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get instant AI-powered suggestions as you type
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Viral Analytics
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Advanced scoring based on engagement patterns
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-3 mb-2">
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Smart Optimization
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatic content enhancement for maximum impact
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setIsAIVisible(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
              >
                <Bot className="w-5 h-5 mr-2" />
                Open AI Assistant
              </Button>
              
              <Button
                onClick={() => window.location.href = '/editor'}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 text-lg font-semibold"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Try Smart Editor
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Experience the future of content creation with AI-powered assistance
            </p>
          </div>
        </div>
      </div>

      {/* AI Assistant Demo */}
      <AIContentAssistant
        currentContent={demoContent}
        onSuggestionApply={handleSuggestionApply}
        onContentOptimize={handleOptimize}
        isVisible={isAIVisible}
        onToggle={() => setIsAIVisible(!isAIVisible)}
      />
    </DashboardLayout>
  )
}
