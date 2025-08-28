'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function ProfileNameDisplay() {
  const { data: session } = useSession()
  const [displayName, setDisplayName] = useState(session?.user?.name || 'User')

  useEffect(() => {
    if (session?.user?.name) {
      setDisplayName(session?.user.name)
    }
  }, [session?.user?.name])

  return (
    <span className="truncate text-xs sm:text-sm hidden sm:inline font-manrope font-medium">
      {displayName}
    </span>
  )
}







