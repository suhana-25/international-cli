'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  Loader2,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Building2,
  Users,
  Award
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ContactInfo {
  companyName: string
  address: string
  phone: string
  email: string
  website: string
  facebook: string
  instagram: string
  twitter: string
  linkedin: string
  youtube: string
}

export default function ContactPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/contact')
        if (response.ok) {
          const data = await response.json()
          setContactInfo(data)
        }
      } catch (error) {
        console.error('Failed to fetch contact info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContactInfo()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      }

      const response = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Message Sent Successfully!",
          description: result.message || "Thank you for your inquiry. We'll get back to you within 24 hours.",
        })
        e.currentTarget.reset()
      } else {
        throw new Error(result.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-12 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading contact information...</p>
        </div>
      </div>
    )
  }

  if (!contactInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex justify-center items-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">Unable to load contact information.</p>
        </div>
      </div>
    )
  }

  // Check if any social media links exist
  const hasSocialMedia = contactInfo.facebook || contactInfo.instagram || contactInfo.twitter || contactInfo.linkedin || contactInfo.youtube

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Get in Touch
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Contact Us
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed mb-8">
            We're here to help with any questions about our products, orders, or collaboration opportunities. 
            Reach out to us and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Enter your full name"
                        className="border-slate-300 dark:border-slate-600 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        className="border-slate-300 dark:border-slate-600 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-700 dark:text-slate-300 font-medium">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="What is this regarding?"
                      className="border-slate-300 dark:border-slate-600 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-700 dark:text-slate-300 font-medium">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Tell us about your inquiry..."
                      rows={6}
                      className="border-slate-300 dark:border-slate-600 focus:border-blue-500"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Company Info */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                    <Building2 className="w-7 h-7 text-blue-600" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {contactInfo.companyName && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{contactInfo.companyName}</p>
                      </div>
                    </div>
                  )}
                  
                  {contactInfo.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Address</p>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{contactInfo.address}</p>
                      </div>
                    </div>
                  )}
                  
                  {contactInfo.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Website</p>
                        <a 
                          href={contactInfo.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {contactInfo.website}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Methods */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                    <Users className="w-7 h-7 text-purple-600" />
                    Get in Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {contactInfo.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Email</p>
                        <a 
                          href={`mailto:${contactInfo.email}`} 
                          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {contactInfo.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Phone</p>
                        <a 
                          href={`tel:${contactInfo.phone}`} 
                          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                          {contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                    <Clock className="w-7 h-7 text-green-600" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3 text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between items-center">
                      <span>Monday - Friday</span>
                      <span className="font-semibold text-slate-900 dark:text-white">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Saturday</span>
                      <span className="font-semibold text-slate-900 dark:text-white">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sunday</span>
                      <span className="font-semibold text-red-600">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              {hasSocialMedia && (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                      <Award className="w-7 h-7 text-orange-600" />
                      Follow Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                      {contactInfo.facebook && (
                        <Button variant="outline" className="justify-start border-orange-300 hover:bg-orange-50" asChild>
                          <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Facebook className="w-4 h-4 text-blue-600" />
                            Facebook
                          </a>
                        </Button>
                      )}
                      {contactInfo.instagram && (
                        <Button variant="outline" className="justify-start border-orange-300 hover:bg-orange-50" asChild>
                          <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Instagram className="w-4 h-4 text-pink-600" />
                            Instagram
                          </a>
                        </Button>
                      )}
                      {contactInfo.twitter && (
                        <Button variant="outline" className="justify-start border-orange-300 hover:bg-orange-50" asChild>
                          <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Twitter className="w-4 h-4 text-blue-400" />
                            Twitter
                          </a>
                        </Button>
                      )}
                      {contactInfo.linkedin && (
                        <Button variant="outline" className="justify-start border-orange-300 hover:bg-orange-50" asChild>
                          <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4 text-blue-700" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {contactInfo.youtube && (
                        <Button variant="outline" className="justify-start border-orange-300 hover:bg-orange-50" asChild>
                          <a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Youtube className="w-4 h-4 text-red-600" />
                            YouTube
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Have a question or want to place an order? We're here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
              <a href="/catalog">Explore Products</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold">
              <a href="tel:+911234567890">Call Now</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 
