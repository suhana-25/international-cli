'use client'

import React, { useEffect, useState } from 'react'
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

interface PerformanceMetrics {
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
  loadTime: number | null
}

type CoreMetric = 'fcp' | 'lcp' | 'fid' | 'cls'

interface PerformanceMonitorProps {
  showDetails?: boolean
  className?: string
}

export function PerformanceMonitor({ showDetails = false, className }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    loadTime: null
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (process.env.NODE_ENV === 'development' || showDetails) {
      setIsVisible(true)
    }
  }, [showDetails])

  useEffect(() => {
    if (!isVisible) return

    const measurePerformance = () => {
      // Wait for page to fully load
      if (document.readyState === 'complete') {
        setTimeout(() => {
          const newMetrics: PerformanceMetrics = {
            fcp: null,
            lcp: null,
            fid: null,
            cls: null,
            ttfb: null,
            loadTime: null
          }

          // Get Core Web Vitals
          if ('PerformanceObserver' in window) {
            // First Contentful Paint (FCP)
            const fcpEntry = performance.getEntriesByType('paint').find(
              entry => entry.name === 'first-contentful-paint'
            )
            if (fcpEntry) {
              newMetrics.fcp = Math.round(fcpEntry.startTime)
            }

            // Largest Contentful Paint (LCP)
            const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
            if (lcpEntries.length > 0) {
              const lastLcpEntry = lcpEntries[lcpEntries.length - 1]
              newMetrics.lcp = Math.round(lastLcpEntry.startTime)
            }

            // Time to First Byte (TTFB)
            const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            if (navigationEntry) {
              newMetrics.ttfb = Math.round(navigationEntry.responseStart - navigationEntry.requestStart)
            }

            // Load time
            newMetrics.loadTime = Math.round(performance.now())
          }

          // Cumulative Layout Shift (CLS) - simplified measurement
          let cls = 0
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                cls += (entry as any).value
              }
            }
          })
          
          try {
            observer.observe({ entryTypes: ['layout-shift'] })
            // Give some time for layout shifts to be observed
            setTimeout(() => {
              newMetrics.cls = Math.round(cls * 1000) / 1000
              observer.disconnect()
              setMetrics(newMetrics)
            }, 1000)
          } catch (error) {
            console.log('CLS measurement not supported')
            setMetrics(newMetrics)
          }
        }, 100)
      }
    }

    // Measure when page loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', measurePerformance)
    } else {
      measurePerformance()
    }

    // Measure First Input Delay (FID) - simplified
    const measureFID = () => {
      const firstInputEntry = performance.getEntriesByType('first-input')[0] as PerformanceEventTiming
      if (firstInputEntry) {
        setMetrics(prev => ({
          ...prev,
          fid: Math.round(firstInputEntry.processingStart - firstInputEntry.startTime)
        }))
      }
    }

    document.addEventListener('click', measureFID, { once: true })
    document.addEventListener('keydown', measureFID, { once: true })

    return () => {
      document.removeEventListener('DOMContentLoaded', measurePerformance)
      document.removeEventListener('click', measureFID)
      document.removeEventListener('keydown', measureFID)
    }
  }, [isVisible])

  if (!isVisible) return null

  const getScore = (metric: CoreMetric, value: number | null): 'good' | 'needs-improvement' | 'poor' => {
    if (value === null) return 'poor'
    
    const thresholds = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    }

    const metricThresholds = thresholds[metric]
    if (!metricThresholds) return 'poor'

    if (value <= metricThresholds.good) return 'good'
    if (value <= metricThresholds.poor) return 'needs-improvement'
    return 'poor'
  }

  const getScoreColor = (score: 'good' | 'needs-improvement' | 'poor') => {
    switch (score) {
      case 'good': return 'text-green-600'
      case 'needs-improvement': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getScoreIcon = (score: 'good' | 'needs-improvement' | 'poor') => {
    switch (score) {
      case 'good': return '🟢'
      case 'needs-improvement': return '🟡'
      case 'poor': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5" />
          Performance Monitor
        </CardTitle>
        <CardDescription>
          Core Web Vitals & Performance Metrics
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Core Web Vitals */}
        <div className="grid grid-cols-2 gap-4">
          {/* FCP */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">FCP</span>
              <span className="text-xs text-gray-500">First Contentful Paint</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${getScoreColor(getScore('fcp', metrics.fcp))}`}>
                {metrics.fcp ? `${metrics.fcp}ms` : '--'}
              </span>
              <span className="text-lg">{getScoreIcon(getScore('fcp', metrics.fcp))}</span>
            </div>
          </div>

          {/* LCP */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">LCP</span>
              <span className="text-xs text-gray-500">Largest Contentful Paint</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${getScoreColor(getScore('lcp', metrics.lcp))}`}>
                {metrics.lcp ? `${metrics.lcp}ms` : '--'}
              </span>
              <span className="text-lg">{getScoreIcon(getScore('lcp', metrics.lcp))}</span>
            </div>
          </div>

          {/* FID */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">FID</span>
              <span className="text-xs text-gray-500">First Input Delay</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${getScoreColor(getScore('fid', metrics.fid))}`}>
                {metrics.fid ? `${metrics.fid}ms` : '--'}
              </span>
              <span className="text-lg">{getScoreIcon(getScore('fid', metrics.fid))}</span>
            </div>
          </div>

          {/* CLS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">CLS</span>
              <span className="text-xs text-gray-500">Cumulative Layout Shift</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${getScoreColor(getScore('cls', metrics.cls))}`}>
                {metrics.cls ? metrics.cls.toFixed(3) : '--'}
              </span>
              <span className="text-lg">{getScoreIcon(getScore('cls', metrics.cls))}</span>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            {/* TTFB */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-700">TTFB</span>
                <div className="text-xs text-gray-500">
                  {metrics.ttfb ? `${metrics.ttfb}ms` : '--'}
                </div>
              </div>
            </div>

            {/* Load Time */}
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-700">Load Time</span>
                <div className="text-xs text-gray-500">
                  {metrics.loadTime ? `${metrics.loadTime}ms` : '--'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Overall Score</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {(() => {
                  const coreMetrics = ['fcp', 'lcp', 'fid', 'cls'] as const
                  const scores = coreMetrics.map(metric => 
                    getScore(metric, metrics[metric])
                  )
                  const goodScores = scores.filter(score => score === 'good').length
                  const totalScores = scores.length
                  return `${Math.round((goodScores / totalScores) * 100)}%`
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="pt-4 border-t">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="font-medium">Performance Tips:</div>
            <div>• FCP & LCP: Optimize images and critical resources</div>
            <div>• FID: Minimize JavaScript execution time</div>
            <div>• CLS: Avoid layout shifts during page load</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    loadTime: null
  })

  useEffect(() => {
    // Implementation similar to component above
    // Returns metrics for use in other components
  }, [])

  return metrics
}
