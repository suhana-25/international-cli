import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Refund Policy - ${APP_NAME}`,
}

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="h1-bold">Refund Policy</h1>
          <p className="text-muted-foreground mt-2">
            Simple and clear information about our refund policy
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="h3-bold text-red-800 mb-4">Important Notice</h2>
            <p className="text-red-700">
              We do not offer refunds for any products. All sales are final.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="h2-bold">Our Policy</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="h3-bold">No Refunds</h3>
                <p className="text-muted-foreground">
                  Once you buy something from us, we cannot give your money back. 
                  This is because we make handmade products and cannot resell them.
                </p>
              </div>

              <div>
                <h3 className="h3-bold">Why No Refunds?</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Our products are handmade and unique</li>
                  <li>We cannot resell products that have been used</li>
                  <li>Shipping costs are expensive and non-refundable</li>
                  <li>We want to keep our prices low for everyone</li>
                </ul>
              </div>

              <div>
                <h3 className="h3-bold">What We Do Instead</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>We check every product before shipping</li>
                  <li>We take clear photos so you know what you're buying</li>
                  <li>We answer all your questions before you buy</li>
                  <li>We help you choose the right product</li>
                </ul>
              </div>

              <div>
                <h3 className="h3-bold">Before You Buy</h3>
                <p className="text-muted-foreground">
                  Please look at all the photos carefully. Read the product description. 
                  Ask us any questions you have. We want you to be happy with your purchase.
                </p>
              </div>

              <div>
                <h3 className="h3-bold">Contact Us</h3>
                <p className="text-muted-foreground">
                  If you have any questions about our policy, please contact us. 
                  We are here to help you make the right choice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
