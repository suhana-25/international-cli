import type { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'

export const metadata: Metadata = {
  title: `Authentication - ${APP_NAME}`,
  description: 'Secure authentication for users and administrators',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image
              src="/assets/icons/nitesh.jpg"
              width={48}
              height={48}
              alt="Nitesh Handicraft Logo"
              className="mr-3 w-12 h-12 object-cover"
            />
            <span className="text-2xl font-bold">{APP_NAME}</span>
          </div>
          <div className="relative z-20 mt-auto">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Welcome to Nitesh Handicraft
              </h2>
              <p className="text-lg text-gray-300">
                Discover the finest collection of handcrafted art statues, crystal carvings, and unique handicrafts from around the world.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
