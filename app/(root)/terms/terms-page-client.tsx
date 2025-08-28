'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, AlertTriangle, Shield, Truck, CreditCard, Package, Globe } from 'lucide-react'

export default function TermsPageClient() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 px-4 py-2 bg-blue-100 text-blue-800 border-0">
            <FileText className="w-4 h-4 mr-2" />
            Legal Document
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Terms & Conditions
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Terms & Conditions for All Customers (Nitesh Handicraft – All Orders)
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4" />
              <span>Effective Date: {currentDate}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: {currentDate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="border-0 shadow-lg bg-white mb-8">
            <CardContent className="p-8">
              <p className="text-lg text-slate-700 leading-relaxed">
                These Terms and Conditions ("Terms") govern all orders placed with Nitesh Handicraft. 
                By purchasing our products, you agree to comply with the following rules, policies, 
                and conditions. Please read carefully before placing an order.
              </p>
            </CardContent>
          </Card>

          {/* Terms Sections */}
          <div className="space-y-6">
            {/* Product Authenticity */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Shield className="w-6 h-6 text-green-600" />
                  1. Product Authenticity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  We guarantee that all products are hand-carved from 100% natural stones. No 
                  synthetic or machine-made items are sold. Slight variations in shape, size, and 
                  color are natural and proof of authenticity.
                </p>
              </CardContent>
            </Card>

            {/* Handmade Nature */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Package className="w-6 h-6 text-blue-600" />
                  2. Handmade Nature
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  Every product is individually hand-carved, so minor differences from the displayed 
                  images are expected. This is not considered a defect.
                </p>
              </CardContent>
            </Card>

            {/* Prices & Currency */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Globe className="w-6 h-6 text-purple-600" />
                  3. Prices & Currency
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  All prices are quoted in USD (United States Dollar) unless otherwise mentioned. 
                  Currency conversion rates may vary and are the responsibility of the buyer.
                </p>
              </CardContent>
            </Card>

            {/* Payment Policy */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  4. Payment Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  Full payment must be made in advance before processing your order. We accept 
                  PayPal, Bank Transfer, etc. Orders without confirmed payment will not be processed.
                </p>
              </CardContent>
            </Card>

            {/* Processing Time */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  5. Processing Time
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  For ready products, dispatch is within Next working days after payment 
                  confirmation. For custom orders, product may take 2–6 weeks, depending on complexity.
                </p>
              </CardContent>
            </Card>

            {/* Packaging Standards */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Package className="w-6 h-6 text-orange-600" />
                  6. Packaging Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  We ensure safe, secure, and protective packaging for all parcels. However, minor 
                  cosmetic damage to the outer packaging caused during transit will not be grounds 
                  for a return or refund.
                </p>
              </CardContent>
            </Card>

            {/* Shipping Methods */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Truck className="w-6 h-6 text-blue-600" />
                  7. Shipping Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  International orders are shipped via trusted couriers (e.g., DHL, FedEx, UPS). 
                  Shipping method depends on destination, parcel size, and buyer preference.
                </p>
              </CardContent>
            </Card>

            {/* Shipping Charges */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Truck className="w-6 h-6 text-purple-600" />
                  8. Shipping Charges
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  Shipping costs are calculated based on weight, dimensions, and destination. Any 
                  additional customs, import duties, or taxes are the buyer's responsibility. 
                  (For better and accurate shipping information please contact us before ordering)
                </p>
              </CardContent>
            </Card>

            {/* Customs & Import Duties */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Globe className="w-6 h-6 text-red-600" />
                  9. Customs & Import Duties
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  We are not responsible for custom delays, inspections, or import restrictions in 
                  your country. Buyers must ensure the ordered items are allowed in their country.
                </p>
              </CardContent>
            </Card>

            {/* Customs Documentation */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <FileText className="w-6 h-6 text-green-600" />
                  10. Customs Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  All parcels include necessary export documents (Invoice, AWB, HSN Code, 
                  Certificate of Origin if required). Any special documentation requests must be 
                  communicated before dispatch.
                </p>
              </CardContent>
            </Card>

            {/* Customs Clearance Delays */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  11. Customs Clearance Delays
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  Any delays due to customs clearance are beyond our control and are not grounds 
                  for cancellation, refund, or compensation.
                </p>
              </CardContent>
            </Card>

            {/* Delivery Time Estimates */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  12. Delivery Time Estimates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  Delivery time varies from 3–12 working days depending on location and customs 
                  processing. This is only an estimate, not a guarantee.
                </p>
              </CardContent>
            </Card>

            {/* Risk During Transit */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Truck className="w-6 h-6 text-red-600" />
                  13. Risk During Transit
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  Once the parcel is handed over to the courier, all transit risks pass to the buyer. We 
                  will assist in tracking but are not liable for loss or damage caused by courier or customs.
                </p>
              </CardContent>
            </Card>

            {/* Insurance Option */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Shield className="w-6 h-6 text-green-600" />
                  14. Insurance Option
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  Buyers may request shipping insurance for an extra fee. Without insurance, lost or 
                  damaged parcels will not be compensated.
                </p>
              </CardContent>
            </Card>

            {/* Damaged Parcels */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Package className="w-6 h-6 text-red-600" />
                  15. Damaged Parcels
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  If a parcel is damaged during transit and insurance was taken, we will assist with a 
                  claim. If insurance was not taken, we are not responsible for any compensation.
                </p>
              </CardContent>
            </Card>

            {/* No Return Policy */}
            <Card className="border-0 shadow-lg bg-red-50 border-l-4 border-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-800">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  16. No Return Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-red-700 leading-relaxed font-medium">
                  All sales are final. No returns, exchanges, or cancellations are accepted once the 
                  order is placed and shipped.
                </p>
              </CardContent>
            </Card>

            {/* No Refunds on Delivered Goods */}
            <Card className="border-0 shadow-lg bg-red-50 border-l-4 border-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-800">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  17. No Refunds on Delivered Goods
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-red-700 leading-relaxed font-medium">
                  No refunds will be issued after a product has been successfully delivered to the 
                  buyer's address.
                </p>
              </CardContent>
            </Card>

            {/* Refused Deliveries */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Truck className="w-6 h-6 text-orange-600" />
                  18. Refused Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  If the buyer refuses delivery or fails to collect the parcel, no refund will be issued. 
                  Any return shipping charges will be the buyer's responsibility.
                </p>
              </CardContent>
            </Card>

            {/* Wrong Shipping Information */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  19. Wrong Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  Buyers must provide accurate and complete shipping details. We are not 
                  responsible for parcels lost due to incorrect addresses.
                </p>
              </CardContent>
            </Card>

            {/* Change of Address */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Truck className="w-6 h-6 text-blue-600" />
                  20. Change of Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  Address changes after dispatch are not possible. If the buyer provides a new 
                  address after dispatch, additional courier charges will apply (if allowed by courier).
                </p>
              </CardContent>
            </Card>

            {/* Parcel Return Charges */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Truck className="w-6 h-6 text-red-600" />
                  21. Parcel Return Charges
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  If a parcel is returned due to wrong address, customs refusal, or non-payment of 
                  import duties, return shipping costs and any damage during return transit will be 
                  deducted from any possible refund (if applicable).
                </p>
              </CardContent>
            </Card>

            {/* No Reshipping of Returned Parcels */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Truck className="w-6 h-6 text-red-600" />
                  22. No Reshipping of Returned Parcels
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  If the parcel is returned, it will not be reshipped without the buyer paying full 
                  shipping charges again.
                </p>
              </CardContent>
            </Card>

            {/* No Responsibility for Delays */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  23. No Responsibility for Delays
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  We are not liable for delays caused by natural disasters, political issues, strikes, 
                  pandemic restrictions, or courier operational delays.
                </p>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Package className="w-6 h-6 text-blue-600" />
                  24. Product Images
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  All product images on our website/social media are actual photographs. However, 
                  due to natural stone variations and lighting effects, the actual product may look 
                  slightly different.
                </p>
              </CardContent>
            </Card>

            {/* Custom Orders */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Package className="w-6 h-6 text-purple-600" />
                  25. Custom Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  Custom designs cannot be canceled once production has started. Any advance 
                  payment for custom orders is non-refundable.
                </p>
              </CardContent>
            </Card>

            {/* Weight Variations */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Package className="w-6 h-6 text-green-600" />
                  26. Weight Variations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  Minor weight differences (±10 grams for small items, ±50 grams for large items) are 
                  natural due to hand-carving and will not be considered a defect.
                </p>
              </CardContent>
            </Card>

            {/* Product Use */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Shield className="w-6 h-6 text-blue-600" />
                  27. Product Use
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  Our products are sold as decorative or spiritual items. Any healing properties 
                  mentioned are based on traditional beliefs and are not medical claims.
                </p>
              </CardContent>
            </Card>

            {/* No Legal Responsibility for Use */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Shield className="w-6 h-6 text-red-600" />
                  28. No Legal Responsibility for Use
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  We are not responsible for any misuse, damage, or injury caused by the product 
                  after delivery.
                </p>
              </CardContent>
            </Card>

            {/* Communication */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <FileText className="w-6 h-6 text-green-600" />
                  29. Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  All communication will be done in English via email, WhatsApp, or other agreed 
                  platforms. Buyers must check their emails/messages regularly for updates.
                </p>
              </CardContent>
            </Card>

            {/* Legal Jurisdiction */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Globe className="w-6 h-6 text-purple-600" />
                  30. Legal Jurisdiction
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-slate-700 leading-relaxed">
                  All disputes are subject to the jurisdiction of Jaipur Rajasthan India courts only, 
                  and Indian law will apply.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <Card className="border-0 shadow-lg bg-red-50 border-l-4 border-red-500 mt-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Important Notice</h3>
                  <p className="text-red-700 leading-relaxed">
                    By placing an order with Nitesh Handicraft, you acknowledge that you have read, 
                    understood, and agree to be bound by these Terms & Conditions. These terms are 
                    legally binding and constitute a contract between you and Nitesh Handicraft.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
