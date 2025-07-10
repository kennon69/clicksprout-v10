'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Zap, Rocket, TrendingUp, Target, Brain } from 'lucide-react'

export default function Loading() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  const steps = [
    { text: "Initializing AI Engine", icon: Brain },
    { text: "Loading Content Generator", icon: Sparkles },
    { text: "Preparing Viral Templates", icon: Zap },
    { text: "Connecting to Platforms", icon: Target },
    { text: "Optimizing Performance", icon: TrendingUp },
    { text: "Ready to Launch", icon: Rocket }
  ]

  useEffect(() => {
    // Generate random sparkles
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }))
    setSparkles(newSparkles)

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 3
      })
    }, 100)

    // Step animation
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length)
    }, 1000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.3),transparent_50%)]"></div>
        
        {/* Floating Sparkles */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo Animation */}
        <div className="relative mb-8">
          {/* Pulsing Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-2 border-blue-400/30 rounded-full animate-ping"></div>
            <div className="absolute w-32 h-32 border-2 border-purple-400/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Main Logo */}
          <div className="relative w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-bounce">
            <Sparkles className="text-white w-10 h-10" />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ClickSprout
          </span>
        </h1>
        
        <p className="text-gray-300 mb-8 text-lg">
          AI-Powered Viral Content Generator
        </p>

        {/* Current Step */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div
                  key={index}
                  className={`mx-2 p-3 rounded-full transition-all duration-500 ${
                    index === currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-110'
                      : index < currentStep
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
              )
            })}
          </div>
          
          <p className="text-white font-medium text-lg mb-2">
            {steps[currentStep].text}
          </p>
          
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-blue-400 font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Messages */}
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            <span>Preparing your viral content workspace...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span>This will only take a moment</span>
          </div>
        </div>

        {/* Floating Action Hint */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs text-gray-300">
            <Zap className="w-4 h-4 mr-2 text-yellow-400" />
            Get ready to create viral content in seconds!
          </div>
        </div>
      </div>
    </div>
  )
}
