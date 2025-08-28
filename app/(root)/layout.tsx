import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'
import FloatingContactButton from '@/components/shared/floating-contact-button'
import ModernChatWidget from '@/components/shared/chat/modern-chat-widget'
import React from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isSignedIn={false} session={null} />
      <main className="flex-1 w-full">
        {children}
      </main>
                  <Footer />
            <FloatingContactButton />
            <ModernChatWidget />
    </div>
  )
}
