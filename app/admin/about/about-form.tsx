'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Save, Eye } from 'lucide-react'

interface AboutInfo {
  id?: string
  title: string
  subtitle: string
  mainContent: string
  mission: string
  vision: string
  values: string
  companyHistory: string
  teamInfo: string
}

export default function AboutForm() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>({
    title: '',
    subtitle: '',
    mainContent: '',
    mission: '',
    vision: '',
    values: '',
    companyHistory: '',
    teamInfo: '',
  })
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const response = await fetch('/api/admin/about')
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setAboutInfo(data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch about info:', error)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchAboutInfo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutInfo)
      })

      if (response.ok) {
        toast({ 
          title: 'Success', 
          description: 'About us content saved successfully.' 
        })
      } else {
        const error = await response.json()
        toast({ 
          title: 'Error', 
          description: error.message || 'Failed to save about us content.', 
          variant: 'destructive' 
        })
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to save about us content.', 
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof AboutInfo, value: string) => {
    setAboutInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Preview About Us Content</h2>
          <Button onClick={() => setPreviewMode(false)} variant="outline">
            Edit
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{aboutInfo.title}</h1>
                <p className="text-xl text-muted-foreground">{aboutInfo.subtitle}</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">About Us</h2>
                <p className="text-muted-foreground whitespace-pre-line">{aboutInfo.mainContent}</p>
              </div>

              {aboutInfo.mission && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground">{aboutInfo.mission}</p>
                </div>
              )}

              {aboutInfo.vision && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground">{aboutInfo.vision}</p>
                </div>
              )}

              {aboutInfo.values && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                  <p className="text-muted-foreground">{aboutInfo.values}</p>
                </div>
              )}

              {aboutInfo.companyHistory && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Company History</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{aboutInfo.companyHistory}</p>
                </div>
              )}

              {aboutInfo.teamInfo && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
                  <p className="text-muted-foreground">{aboutInfo.teamInfo}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Edit About Us Content</h2>
        <Button onClick={() => setPreviewMode(true)} variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Us Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={aboutInfo.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="About Nitesh Handicraft"
                  required
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={aboutInfo.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="Crafting Excellence Since 1995"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mainContent">Main Content *</Label>
              <Textarea
                id="mainContent"
                value={aboutInfo.mainContent}
                onChange={(e) => handleInputChange('mainContent', e.target.value)}
                placeholder="Tell your company's story..."
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  value={aboutInfo.mission}
                  onChange={(e) => handleInputChange('mission', e.target.value)}
                  placeholder="Our mission is..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="vision">Vision Statement</Label>
                <Textarea
                  id="vision"
                  value={aboutInfo.vision}
                  onChange={(e) => handleInputChange('vision', e.target.value)}
                  placeholder="Our vision is..."
                  rows={4}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="values">Company Values</Label>
              <Textarea
                id="values"
                value={aboutInfo.values}
                onChange={(e) => handleInputChange('values', e.target.value)}
                placeholder="Describe your company values..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="companyHistory">Company History</Label>
              <Textarea
                id="companyHistory"
                value={aboutInfo.companyHistory}
                onChange={(e) => handleInputChange('companyHistory', e.target.value)}
                placeholder="Share your company's journey..."
                rows={5}
              />
            </div>

            <div>
              <Label htmlFor="teamInfo">Team Information</Label>
              <Textarea
                id="teamInfo"
                value={aboutInfo.teamInfo}
                onChange={(e) => handleInputChange('teamInfo', e.target.value)}
                placeholder="Describe your team..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save About Us Content
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 
