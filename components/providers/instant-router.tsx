'use client'

import React from 'react'

interface InstantRouterProps {
  children: React.ReactNode
}

export function InstantRouterProvider({ children }: InstantRouterProps) {
  return <>{children}</>
}
