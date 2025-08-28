import { APP_NAME } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Privacy Policy - ${APP_NAME}`,
  description: 'Learn how Nitesh Handicraft protects your privacy and handles your personal data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-foreground mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground font-inter">
              Your Privacy is Our Priority
            </p>
            <p className="text-sm text-muted-foreground font-inter mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            
            {/* 1. Introduction */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                Introduction
              </h2>
              <p className="text-muted-foreground font-inter leading-relaxed">
                Nitesh Handicraft ("we," "our," or "us") values your privacy and is committed to 
                protecting your personal data. This Privacy Policy describes how we collect, use, 
                and safeguard your information when you visit or make a purchase from our website.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                Information We Collect
              </h2>
              <p className="text-muted-foreground font-inter mb-4">
                We may collect the following types of information from you:
              </p>
              <ul className="space-y-3 text-muted-foreground font-inter">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <div>
                    <strong>Personal Information:</strong> Name, email address, phone number, billing and shipping address.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <div>
                    <strong>Payment Information:</strong> Only processed through secure third-party payment gateways (we do not store your card details).
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <div>
                    <strong>Order Information:</strong> Product details, transaction history, and communication records.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <div>
                    <strong>Technical Information:</strong> IP address, browser type, device type, and cookies for website functionality.
                  </div>
                </li>
              </ul>
            </div>

            {/* 3. How We Use Your Information */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground font-inter mb-4">
                Your data is used for:
              </p>
              <ul className="space-y-3 text-muted-foreground font-inter">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Processing and fulfilling orders.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Providing customer support.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Sending updates about your orders and promotions (only if you opt-in).
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Improving website performance and user experience.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Preventing fraudulent transactions and ensuring secure payments.
                </li>
              </ul>
            </div>

            {/* 4. Data Security */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                Data Security
              </h2>
              <p className="text-muted-foreground font-inter mb-4">
                We take strict measures to safeguard your personal information, including:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <strong className="text-green-800">SSL Encryption</strong>
                  </div>
                  <p className="text-green-700 text-sm">All data transmitted between your browser and our website is secured.</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                    </svg>
                    <strong className="text-blue-800">Secure Payment Gateways</strong>
                  </div>
                  <p className="text-blue-700 text-sm">Payments are processed via trusted and certified processors (e.g., PayPal).</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong className="text-purple-800">Firewall & Malware Protection</strong>
                  </div>
                  <p className="text-purple-700 text-sm">Our servers are regularly scanned to prevent unauthorized access.</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <strong className="text-orange-800">Data Access Restriction</strong>
                  </div>
                  <p className="text-orange-700 text-sm">Only authorized personnel can access your data for operational purposes.</p>
                </div>
              </div>
            </div>

            {/* 5. Sharing of Information */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                Sharing of Information
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-medium mb-2">We do not sell, rent, or trade your personal data to third parties.</p>
              </div>
              <p className="text-muted-foreground font-inter mb-4">
                We may share your information only with:
              </p>
              <ul className="space-y-3 text-muted-foreground font-inter">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Shipping and courier companies for delivering your order.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Payment processors to handle secure transactions.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Legal authorities if required by law for fraud prevention or investigation.
                </li>
              </ul>
            </div>

            {/* 6. Cookies Policy */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                Cookies Policy
              </h2>
              <p className="text-muted-foreground font-inter mb-4">
                Our website uses cookies to:
              </p>
              <ul className="space-y-3 text-muted-foreground font-inter mb-4">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Remember your preferences.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Improve website speed and personalization.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Track anonymous usage data for better services.
                </li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  You can disable cookies in your browser settings, but this may affect some website functionalities.
                </p>
              </div>
            </div>

            {/* 7. International Data Transfers */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                International Data Transfers
              </h2>
              <p className="text-muted-foreground font-inter">
                As we operate internationally, your data may be transferred and stored outside your 
                country of residence. We ensure that all transfers comply with applicable data 
                protection laws.
              </p>
            </div>

            {/* 8. Your Rights */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</span>
                Your Rights
              </h2>
              <p className="text-muted-foreground font-inter mb-4">
                You have the right to:
              </p>
              <ul className="space-y-3 text-muted-foreground font-inter">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Request a copy of the personal data we hold about you.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Request corrections if your information is inaccurate.
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Request deletion of your personal data (subject to legal obligations).
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  Opt-out from promotional communications at any time.
                </li>
              </ul>
            </div>

            {/* 9. Children's Privacy */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">9</span>
                Children's Privacy
              </h2>
              <p className="text-muted-foreground font-inter">
                Our website and services are not directed to individuals under the age of 16. We do 
                not knowingly collect personal data from minors.
              </p>
            </div>

            {/* 10. Changes to This Policy */}
            <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">10</span>
                Changes to This Policy
              </h2>
              <p className="text-muted-foreground font-inter">
                We may update this Privacy Policy from time to time. Changes will be posted on 
                this page with the updated date.
              </p>
            </div>

            {/* 11. Contact Us */}
            <div className="bg-gradient-to-r from-primary/10 to-purple-100 border border-primary/20 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">11</span>
                Contact Us
              </h2>
              <p className="text-foreground font-inter mb-6">
                If you have any questions about this Privacy Policy or our practices, you can contact us:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 border border-border">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <strong className="text-foreground">Email</strong>
                  </div>
                  <a href="mailto:niteshhandicrafts@gmail.com" className="text-primary hover:underline text-sm">
                    niteshhandicrafts@gmail.com
                  </a>
                </div>
                <div className="bg-white rounded-lg p-4 border border-border">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    <strong className="text-foreground">WhatsApp</strong>
                  </div>
                  <a href="https://wa.me/917014750651" className="text-green-600 hover:underline text-sm">
                    +91 7014750651
                  </a>
                </div>
                <div className="bg-white rounded-lg p-4 border border-border">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <strong className="text-foreground">Location</strong>
                  </div>
                  <span className="text-muted-foreground text-sm">Rajasthan, India</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Notice */}
          <div className="text-center mt-12 p-6 bg-white border border-border rounded-lg shadow-sm">
            <p className="text-muted-foreground font-inter text-sm">
              By using our website, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
