'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Users, 
  Award, 
  Globe, 
  Heart, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

interface AboutInfo {
  title: string
  subtitle: string
  mainContent: string
  mission: string
  vision: string
  values: string
  companyHistory: string
  teamInfo: string
}

export default function AboutPageClient() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const response = await fetch('/api/about')
        if (response.ok) {
          const data = await response.json()
          setAboutInfo(data)
        }
      } catch (error) {
        console.error('Failed to fetch about info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAboutInfo()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!aboutInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Unable to load content.</p>
        </div>
      </div>
    )
  }

  // Parse values into array
  const valuesArray = aboutInfo.values ? aboutInfo.values.split(', ') : []

  return (
    <div className="min-h-screen">
      {/* Full Screen Hero Header - Professional Design */}
      <section className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>
        
        {/* Content Container - Perfectly Centered */}
        <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
          {/* Logo/Badge Section - Professional Badge */}
          <div className="flex justify-center mb-12">
            <Badge className="px-8 py-4 bg-blue-600/20 text-blue-300 border border-blue-500/30 backdrop-blur-sm rounded-full text-lg font-medium">
              <Building2 className="w-6 h-6 mr-3" />
              Established 1995
            </Badge>
          </div>
          
          {/* Main Title - Professional Typography */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight">
              {aboutInfo.title}
            </h1>
          </div>
          
          {/* Subtitle - Professional Description */}
          <div className="mb-16">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-300 max-w-5xl mx-auto leading-relaxed font-light">
              {aboutInfo.subtitle}
            </p>
          </div>
          
          {/* Action Buttons - Professional CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 rounded-xl">
              <a href="/catalog">Explore Products →</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-5 text-lg font-semibold backdrop-blur-sm transition-all duration-300 rounded-xl">
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator - Professional Touch */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-4 bg-white/50 rounded-full mt-3 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Main Content Section - Professional Layout */}
      <section className="w-full py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-24">
            <p className="text-lg md:text-xl lg:text-2xl text-slate-700 leading-relaxed max-w-6xl mx-auto">
              {aboutInfo.mainContent}
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid lg:grid-cols-2 gap-16 mb-24">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-blue-500/20 transition-all duration-500 rounded-2xl overflow-hidden">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-4xl font-bold mb-8 text-slate-900">Our Mission</h3>
                <p className="text-lg text-slate-700 leading-relaxed">{aboutInfo.mission}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-purple-500/20 transition-all duration-500 rounded-2xl overflow-hidden">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl">
                  <Star className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-4xl font-bold mb-8 text-slate-900">Our Vision</h3>
                <p className="text-lg text-slate-700 leading-relaxed">{aboutInfo.vision}</p>
              </CardContent>
            </Card>
          </div>

          {/* Company History */}
          <div className="mb-24">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-slate-900">Our Journey</h2>
              <p className="text-xl md:text-2xl text-slate-600">From humble beginnings to industry leadership</p>
            </div>
            
            <Card className="border-0 shadow-2xl bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-16">
                <div className="prose prose-lg max-w-none text-slate-700">
                  {aboutInfo.companyHistory.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-8 leading-relaxed text-lg md:text-xl">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <div className="mb-24">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-slate-900">Our Core Values</h2>
              <p className="text-xl md:text-2xl text-slate-600">The principles that guide everything we do</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {valuesArray.map((value, index) => (
                <Card key={index} className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 rounded-2xl overflow-hidden">
                  <CardContent className="p-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                      <Award className="w-10 h-10 text-slate-600" />
                    </div>
                    <h4 className="font-bold text-xl text-slate-900">{value}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Info */}
          <div className="mb-24">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-slate-900">Our Team</h2>
              <p className="text-xl md:text-2xl text-slate-600">Meet the passionate people behind our success</p>
            </div>
            
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden">
              <CardContent className="p-16">
                <div className="prose prose-lg max-w-none text-slate-700">
                  {aboutInfo.teamInfo.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-8 leading-relaxed text-lg md:text-xl">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
            <div className="text-center group">
              <div className="text-6xl font-bold text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">25+</div>
              <div className="text-slate-600 font-medium text-lg">Years Experience</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl font-bold text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">1000+</div>
              <div className="text-slate-600 font-medium text-lg">Happy Customers</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl font-bold text-green-600 mb-4 group-hover:scale-110 transition-transform duration-300">500+</div>
              <div className="text-slate-600 font-medium text-lg">Products</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl font-bold text-orange-600 mb-4 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-slate-600 font-medium text-lg">Team Members</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-10 text-slate-900">Join Our Journey</h2>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-5xl mx-auto">
              Discover the beauty of authentic handcrafted products and become part of our mission to preserve cultural heritage through exceptional craftsmanship.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 rounded-xl">
                <a href="/catalog">Explore Our Collection →</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 px-12 py-5 text-lg font-semibold transition-all duration-300 rounded-xl">
                <a href="/contact">Get in Touch</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 
