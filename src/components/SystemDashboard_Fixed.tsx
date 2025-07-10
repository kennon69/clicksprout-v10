'use client'

import React, { useState, useEffect } from 'react'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw,
  Zap,
  TrendingUp,
  Globe,
  Database,
  Settings,
  Play,
  Pause
} from 'lucide-react'

interface SystemHealth {
  engine: {
    status: string
    uptime: number
    version?: string
    maintenanceMode?: boolean
    totalPosts?: number
    successRate?: number
    averageResponseTime?: number
    startTime?: string
  }
  platforms: Array<{
    platform: string
    status: 'healthy' | 'degraded' | 'critical'
    lastChecked: string
    lastSuccessfulPost?: string
    errorCount: number
    authStatus: 'valid' | 'expired' | 'invalid'
    rateLimit?: {
      remaining: number
      resetTime: string
    }
  }>
  retryQueue: number
  scheduledPosts: number
  systemAlerts?: number
  performance?: {
    memoryUsage: NodeJS.MemoryUsage
    uptime: number
    lastUpdated: string
  }
}

export default function SystemDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('/api/posting-engine?action=health')
      const result = await response.json()
      
      if (result.success) {
        setHealth(result.data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch system health:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleEngine = async (start: boolean) => {
    try {
      const response = await fetch('/api/posting-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: start ? 'start' : 'stop' })
      })

      const result = await response.json()
      if (result.success) {
        await fetchSystemHealth()
      }
    } catch (error) {
      console.error('Failed to toggle engine:', error)
    }
  }

  const toggleMaintenanceMode = async () => {
    try {
      const response = await fetch('/api/posting-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'maintenance', 
          enable: !health?.engine.maintenanceMode 
        })
      })

      const result = await response.json()
      if (result.success) {
        await fetchSystemHealth()
      }
    } catch (error) {
      console.error('Failed to toggle maintenance mode:', error)
    }
  }

  const performHealthCheck = async () => {
    try {
      const response = await fetch('/api/posting-engine?action=healthcheck')
      const result = await response.json()
      
      if (result.success) {
        console.log('Health check result:', result.data)
        await fetchSystemHealth()
      }
    } catch (error) {
      console.error('Failed to perform health check:', error)
    }
  }

  useEffect(() => {
    fetchSystemHealth()
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchSystemHealth, 30000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'running':
      case 'healthy':
      case 'valid':
        return 'text-green-600'
      case 'stopped':
      case 'degraded':
      case 'expired':
        return 'text-yellow-600'
      case 'critical':
      case 'invalid':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'running':
      case 'healthy':
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'stopped':
      case 'degraded':
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'critical':
      case 'invalid':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              System Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Intelligent Posting Engine v{health?.engine.version || '2.0'} - Status & Monitoring
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                autoRefresh
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <RefreshCw className={`w-4 h-4 inline mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </button>

            <button
              onClick={fetchSystemHealth}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Refresh Now
            </button>
            
            <button
              onClick={performHealthCheck}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Health Check
            </button>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Engine Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engine Status</p>
                <p className={`text-2xl font-bold ${getStatusColor(health?.engine.status || 'unknown')}`}>
                  {health?.engine.status === 'running' ? 'Running' : 'Stopped'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(health?.engine.status || 'unknown')}
                <button
                  onClick={() => toggleEngine(health?.engine.status !== 'running')}
                  className="p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  title={health?.engine.status === 'running' ? 'Stop Engine' : 'Start Engine'}
                >
                  {health?.engine.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {health?.engine.status === 'running' ? `Uptime: ${formatUptime(health?.engine.uptime || 0)}` : 'Engine is stopped'}
            </p>
          </div>

          {/* Maintenance Mode */}
          {health?.engine.maintenanceMode && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 shadow-sm border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Maintenance Mode</p>
                  <p className="text-lg font-bold text-yellow-600">Active</p>
                </div>
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                All operations are paused
              </p>
            </div>
          )}

          {/* Success Rate */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {health?.engine.successRate?.toFixed(1) || 0}%
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {health?.engine.totalPosts || 0} total posts
            </p>
          </div>

          {/* System Alerts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {health?.systemAlerts || 0}
                </p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Active alerts
            </p>
          </div>

          {/* Queue Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Queue Status</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(health?.retryQueue || 0) + (health?.scheduledPosts || 0)}
                </p>
              </div>
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {health?.retryQueue || 0} retries, {health?.scheduledPosts || 0} scheduled
            </p>
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Platform Health</h2>
            <Globe className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {health?.platforms.map((platform) => (
              <div key={platform.platform} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {platform.platform}
                  </h3>
                  {getStatusIcon(platform.status)}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <span className={`capitalize ${getStatusColor(platform.status)}`}>
                      {platform.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Auth:</span>
                    <span className={getStatusColor(platform.authStatus)}>
                      {platform.authStatus}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Errors:</span>
                    <span className="text-gray-900 dark:text-white">{platform.errorCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        {health?.performance && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {health.engine.averageResponseTime || 0}ms
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response Time</p>
              </div>
              {health.performance.memoryUsage && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(health.performance.memoryUsage.heapUsed / 1024 / 1024)}MB
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Memory Usage</p>
                </div>
              )}
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {formatUptime(health.engine.uptime || 0)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">System Uptime</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
        </div>
      </div>
    </div>
  )
}
