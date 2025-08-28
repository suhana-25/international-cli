import { APP_NAME } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Global Stores - ${APP_NAME}`,
  description: 'Find Nitesh Handicraft crystal carvings and art statues available worldwide.',
}

const countries = [
  { name: 'United States', code: 'US', available: true },
  { name: 'France', code: 'FR', available: true },
  { name: 'Germany', code: 'DE', available: true },
  { name: 'Austria', code: 'AT', available: true },
  { name: 'Australia', code: 'AU', available: true },
  { name: 'Greenland', code: 'GL', available: true },
  { name: 'Denmark', code: 'DK', available: true },
  { name: 'United Kingdom', code: 'GB', available: true },
  { name: 'Spain', code: 'ES', available: true },
  { name: 'Italy', code: 'IT', available: true },
  { name: 'Mexico', code: 'MX', available: true },
  { name: 'Canada', code: 'CA', available: true },
  { name: 'Switzerland', code: 'CH', available: true },
  { name: 'Netherlands', code: 'NL', available: true },
]

export default function StoresPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-foreground mb-4 tracking-tight">
              Global Stores
            </h1>
            <p className="text-xl text-muted-foreground font-inter">
              Worldwide Shipping of Handcrafted Crystal Carvings
            </p>
          </div>

          {/* World Map SVG */}
          <div className="bg-white border border-border rounded-lg p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 text-center">
              We Ship to These Countries
            </h2>
            
            <div className="w-full overflow-x-auto">
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-auto max-w-4xl mx-auto"
                style={{ minHeight: '400px' }}
              >
                {/* Background */}
                <rect width="1000" height="500" fill="#f0f9ff" />
                
                {/* World Map Simplified - Major continents */}
                {/* North America */}
                <path d="M50 100 L200 80 L220 120 L180 180 L120 200 L80 160 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                <text x="135" y="140" className="text-xs font-medium" fill="#6b7280">North America</text>
                
                {/* South America */}
                <path d="M180 220 L220 200 L240 280 L200 350 L160 320 L170 260 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                <text x="190" y="280" className="text-xs font-medium" fill="#6b7280">South America</text>
                
                {/* Europe */}
                <path d="M400 80 L500 70 L520 100 L480 140 L420 130 L410 100 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                <text x="450" y="105" className="text-xs font-medium" fill="#6b7280">Europe</text>
                
                {/* Africa */}
                <path d="M420 150 L520 140 L540 200 L520 280 L460 300 L440 220 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                <text x="470" y="220" className="text-xs font-medium" fill="#6b7280">Africa</text>
                
                {/* Asia */}
                <path d="M540 80 L720 70 L750 120 L720 180 L650 200 L600 160 L520 140 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                <text x="630" y="130" className="text-xs font-medium" fill="#6b7280">Asia</text>
                
                {/* Australia */}
                <path d="M700 280 L780 270 L790 300 L760 320 L720 310 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                <text x="735" y="295" className="text-xs font-medium" fill="#6b7280">Australia</text>
                
                {/* Greenland */}
                <path d="M300 20 L350 15 L360 40 L340 60 L310 55 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                <text x="320" y="40" className="text-xs font-medium" fill="#6b7280">Greenland</text>

                {/* Country Markers - Available Countries in Green */}
                {/* United States */}
                <circle cx="120" cy="120" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="130" y="115" className="text-xs font-bold" fill="#16a34a">US</text>
                
                {/* Canada */}
                <circle cx="140" cy="90" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="150" y="85" className="text-xs font-bold" fill="#16a34a">CA</text>
                
                {/* Mexico */}
                <circle cx="110" cy="160" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="120" y="155" className="text-xs font-bold" fill="#16a34a">MX</text>
                
                {/* United Kingdom */}
                <circle cx="430" cy="90" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="440" y="85" className="text-xs font-bold" fill="#16a34a">UK</text>
                
                {/* France */}
                <circle cx="450" cy="100" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="460" y="95" className="text-xs font-bold" fill="#16a34a">FR</text>
                
                {/* Germany */}
                <circle cx="470" cy="95" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="480" y="90" className="text-xs font-bold" fill="#16a34a">DE</text>
                
                {/* Spain */}
                <circle cx="440" cy="115" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="450" y="110" className="text-xs font-bold" fill="#16a34a">ES</text>
                
                {/* Italy */}
                <circle cx="475" cy="110" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="485" y="105" className="text-xs font-bold" fill="#16a34a">IT</text>
                
                {/* Switzerland */}
                <circle cx="465" cy="105" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="475" y="100" className="text-xs font-bold" fill="#16a34a">CH</text>
                
                {/* Austria */}
                <circle cx="480" cy="100" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="490" y="95" className="text-xs font-bold" fill="#16a34a">AT</text>
                
                {/* Netherlands */}
                <circle cx="455" cy="85" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="465" y="80" className="text-xs font-bold" fill="#16a34a">NL</text>
                
                {/* Denmark */}
                <circle cx="465" cy="80" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="475" y="75" className="text-xs font-bold" fill="#16a34a">DK</text>
                
                {/* Australia */}
                <circle cx="750" cy="295" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="760" y="290" className="text-xs font-bold" fill="#16a34a">AU</text>
                
                {/* Greenland */}
                <circle cx="330" cy="35" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="340" y="30" className="text-xs font-bold" fill="#16a34a">GL</text>

                {/* Legend */}
                <g>
                  <rect x="20" y="420" width="200" height="60" fill="rgba(255,255,255,0.9)" stroke="#d1d5db" rx="8" />
                  <circle cx="35" cy="440" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                  <text x="50" y="445" className="text-sm font-medium" fill="#16a34a">Available Countries</text>
                  <text x="30" y="465" className="text-xs" fill="#6b7280">We ship handcrafted items worldwide</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Countries List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {countries.map((country) => (
              <div key={country.code} className="bg-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-poppins font-semibold text-foreground">
                    {country.name}
                  </h3>
                  {country.available && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-green-600 font-medium">Available</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground font-inter text-sm">
                  Premium crystal carvings and handicrafts delivered to your doorstep with secure international shipping.
                </p>
              </div>
            ))}
          </div>

          {/* Shipping Information */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 text-center">
              Worldwide Shipping Information
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-poppins font-semibold text-foreground mb-2">
                  Secure Packaging
                </h3>
                <p className="text-muted-foreground font-inter text-sm">
                  Every crystal carving is carefully packed to ensure safe delivery.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-poppins font-semibold text-foreground mb-2">
                  Tracked Delivery
                </h3>
                <p className="text-muted-foreground font-inter text-sm">
                  Full tracking information provided via UPS, DHL, or FedEx.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-poppins font-semibold text-foreground mb-2">
                  Quality Guarantee
                </h3>
                <p className="text-muted-foreground font-inter text-sm">
                  Each handcrafted piece is inspected before shipping.
                </p>
              </div>
            </div>
          </div>

          {/* Contact for More Countries */}
          <div className="text-center mt-12 p-8 bg-white border border-border rounded-lg shadow-sm">
            <h3 className="text-xl font-poppins font-bold text-foreground mb-4">
              Don't See Your Country?
            </h3>
            <p className="text-muted-foreground font-inter mb-6">
              We're constantly expanding our shipping reach. Contact us to check if we can deliver to your location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </a>
              <a 
                href="https://wa.me/917014750651" 
                className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
              >
                WhatsApp: +91 7014750651
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
