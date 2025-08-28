'use client'

import { useUserPersistence } from '@/hooks/use-user-persistence'

export default function UserPersistenceProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // This component just initializes the user persistence hook
  useUserPersistence()

  return <>{children}</>
}
