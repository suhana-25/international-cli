import { APP_NAME } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Shipping | Delivery - ${APP_NAME}`,
  description: 'Learn about our shipping methods, delivery times, and policies for crystal carvings and handicrafts.',
}

export default function ShippingDeliveryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-foreground mb-4 tracking-tight">
              Shipping | Delivery
            </h1>
            <p className="text-xl text-muted-foreground font-inter italic">
              From Our Hands to Yours – A Journey of Care
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-white border border-border rounded-lg p-8 mb-8 shadow-sm">
            <p className="text-muted-foreground font-inter text-lg leading-relaxed mb-6">
              Welcome to the Shipping & Delivery section of Nitesh Handicraft. We believe in complete 
              transparency with our valued customers, ensuring every term and condition is clear – so 
              your experience with us remains smooth, trustworthy, and worry-free.
            </p>
            <p className="text-muted-foreground font-inter text-lg leading-relaxed">
              Every crystal carving is crafted with care and shipped with the same love it was made with. 
              Whether it's a majestic skull, a serene Buddha, or a mystical dragon, and more carvings 
              and other things we ensure your art piece reaches you safely and on time.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            
            {/* 1. Shipping Methods & Delivery Time */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                Shipping Methods & Delivery Time
              </h2>
              <ul className="space-y-3 text-muted-foreground font-inter">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  We Worldwide shipping via UPS / DHL / FedEx with full tracking.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <strong>USA & Europe:</strong> 3–10 business days
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <strong>Australia & Canada:</strong> 5–12 business days
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <strong>Other countries:</strong> 5–15 business days
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <strong>Note:</strong> Customs clearance can affect delivery time.
                </li>
              </ul>
            </div>

            {/* 2. Processing Time */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                Processing Time
              </h2>
              <div className="text-muted-foreground font-inter space-y-4">
                <p>
                  Your orders are shipped within Next business days after payment confirmation. 
                  Made-to-order or custom carvings may take extra time (it Depends how much time it 
                  takes to make the Carvings).
                </p>
                <p>
                  Each product is carefully inspected and securely packed to protect it during transit.
                </p>
              </div>
            </div>

            {/* 3. Shipping Charges */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                Shipping Charges
              </h2>
              <div className="text-muted-foreground font-inter space-y-4">
                <p>
                  Calculated at checkout based on product weight & destination. Free shipping offers will be 
                  clearly mentioned on the product page or at checkout.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">
                    For tailored shipping rates based on your order weight and location, simply reach out to us. 
                    Our team is available for prompt, personalized assistance via live chat.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Import Duties & Taxes */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                Import Duties & Taxes
              </h2>
              <ul className="space-y-3 text-muted-foreground font-inter">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Import/customs duties, VAT, or local taxes are not included in the product price or shipping cost.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  These charges must be paid by the customer directly to the courier or customs 
                  authority at the time of delivery.
                </li>
              </ul>
            </div>

            {/* 5. Delivery Conditions */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                Delivery Conditions
              </h2>
              <ul className="space-y-3 text-muted-foreground font-inter">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Please provide the correct & complete shipping address content Details and Google Location.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  We are not responsible for delays due to customs, courier issues, or natural events.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  If a package is returned due to incorrect address or non-collection, reshipping costs 
                  will be charged to the buyer.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Customs duties & taxes are not included and must be paid by the buyer.
                </li>
              </ul>
            </div>

            {/* 6. Tracking & Order Updates */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                Tracking & Order Updates
              </h2>
              <p className="text-muted-foreground font-inter">
                Once your order is shipped, we will share your tracking number via Email or WhatsApp. 
                You can track it directly on the courier's official website.
              </p>
            </div>

            {/* 7. Damaged or Lost Packages */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                Damaged or Lost Packages
              </h2>
              <div className="text-muted-foreground font-inter space-y-4">
                <p>
                  If your package arrives damaged, contact us within 24 hours with photos and order details.
                </p>
                <p>
                  For lost shipments, we will investigate with the courier before a replacement or refund is issued.
                </p>
              </div>
            </div>

            {/* 8. Weather / Political Delay */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</span>
                Weather / Political Delay
              </h2>
              <p className="text-muted-foreground font-inter">
                Severe weather conditions, strikes, or unexpected political situations may cause delivery 
                delays. We are not responsible for such delays.
              </p>
            </div>

            {/* 9. Customs Inspection */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">9</span>
                Customs Inspection
              </h2>
              <p className="text-muted-foreground font-inter">
                International shipments may be opened by customs for inspection. We are not responsible 
                for any damage caused during such inspections.
              </p>
            </div>

            {/* 10. Refused Delivery */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">10</span>
                Refused Delivery
              </h2>
              <p className="text-muted-foreground font-inter">
                If the customer refuses to accept delivery, the return shipping cost, any customs 
                duties/taxes, and any damage incurred to the product during return transit will be 
                deducted from the refund amount.
              </p>
            </div>

            {/* 11. Delivery Attempt Limit */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">11</span>
                Delivery Attempt Limit
              </h2>
              <p className="text-muted-foreground font-inter">
                Courier companies have a limited number of delivery attempts. If the customer is 
                unavailable for all attempts, the package may be returned, and re-shipping charges will apply.
              </p>
            </div>

            {/* 12. Our Promise */}
            <div className="bg-gradient-to-r from-primary/10 to-purple-100 border border-primary/20 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">12</span>
                Our Promise
              </h2>
              <p className="text-foreground font-inter text-lg leading-relaxed">
                Every crystal carving is a work of art, crafted with love & shipped with care. We ensure it 
                reaches you safely, beautifully, and ready to inspire.
              </p>
            </div>

          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12 p-8 bg-white border border-border rounded-lg shadow-sm">
            <h3 className="text-xl font-poppins font-bold text-foreground mb-4">
              Have Questions About Shipping?
            </h3>
            <p className="text-muted-foreground font-inter mb-6">
              Our team is here to help with any shipping or delivery inquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </a>
              <a 
                href="/chat" 
                className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Live Chat
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

