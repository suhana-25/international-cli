import { APP_NAME } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Payment Policy - ${APP_NAME}`,
  description: 'Learn about our payment methods, security, terms, and refund policy for crystal carvings and handicrafts.',
}

export default function PaymentPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-foreground mb-4 tracking-tight">
              Payment Policy
            </h1>
            <p className="text-xl text-muted-foreground font-inter">
              Secure, Transparent, and Customer-Friendly Payment Solutions
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            
            {/* 1. Accepted Payment Methods */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                Accepted Payment Methods
              </h2>
              <ul className="space-y-4 text-muted-foreground font-inter">
                <li className="flex items-start">
                  <span className="text-primary mr-3 mt-1">•</span>
                  <div>
                    <strong className="text-blue-600">PayPal (safe & fast)</strong>
                    <div className="mt-1 text-sm text-muted-foreground">Our only accepted payment method - secure and reliable</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* 2. Currency */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                Currency
              </h2>
              <ul className="space-y-3 text-muted-foreground font-inter">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  All prices are in <strong className="text-green-600">USD ($)</strong>.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Your bank/payment provider will handle currency conversion if paying in another currency.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Any currency conversion fee will be the buyer's responsibility.
                </li>
              </ul>
            </div>

            {/* 3. Payment Terms */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                Payment Terms
              </h2>
              <ul className="space-y-3 text-muted-foreground font-inter">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <strong className="text-red-600">100% advance payment</strong> is required for all orders.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Orders will be processed only after payment is confirmed.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Bank transfer payments may take 3–5 business days to reflect.
                </li>
              </ul>
            </div>

            {/* 4. Payment Security */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                Payment Security
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <strong className="text-green-800">SSL Secured Transactions</strong>
                  </div>
                  <ul className="space-y-2 text-green-700 font-inter">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">•</span>
                      All transactions are processed through SSL secured gateways.
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">•</span>
                      We do not store your card or bank details.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. Payment Confirmation */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                Payment Confirmation
              </h2>
              <p className="text-muted-foreground font-inter">
                Once payment is received, you will get a confirmation via <strong>Email or WhatsApp</strong> 
                with your invoice.
              </p>
            </div>

            {/* 6. Failed/Delayed Payments */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                Failed/Delayed Payments
              </h2>
              <ul className="space-y-3 text-muted-foreground font-inter">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  If your payment fails, the order will not be processed.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  In case of repeated payment failures, please contact your bank or payment provider.
                </li>
              </ul>
            </div>

            {/* 7. Refund Policy for International Payments */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-red-800 mb-6 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                Refund Policy for International Payments
              </h2>
              <div className="bg-red-100 border border-red-300 rounded-lg p-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Important Notice</h3>
                    <p className="text-red-700 font-inter font-medium">
                      Please note that <strong>once the payment is received it will not be refunded</strong>. 
                      You can only purchase the product of that price Only.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Payment Methods Visual */}
          <div className="mt-12 bg-white border border-border rounded-lg p-8 shadow-sm">
            <h3 className="text-xl font-poppins font-bold text-foreground mb-6 text-center">
              We Accept Only PayPal
            </h3>
            <div className="flex justify-center">
              {/* PayPal Only */}
              <div className="flex flex-col items-center p-6 border-2 border-blue-200 rounded-lg bg-blue-50 shadow-md">
                <div className="w-20 h-12 bg-blue-500 rounded text-white flex items-center justify-center font-bold text-lg mb-3">
                  PayPal
                </div>
                <span className="text-sm text-blue-600 font-medium">Safe & Fast Payment</span>
                <span className="text-xs text-muted-foreground mt-1">Secure International Payments</span>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12 p-8 bg-white border border-border rounded-lg shadow-sm">
            <h3 className="text-xl font-poppins font-bold text-foreground mb-4">
              Have Payment Questions?
            </h3>
            <p className="text-muted-foreground font-inter mb-6">
              Our team is here to help with any payment or policy inquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Support
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
