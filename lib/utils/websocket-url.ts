/**
 * Get the correct WebSocket URL based on the environment
 * @returns WebSocket URL string
 */
export function getWebSocketUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side, return localhost
    return 'http://localhost:3000'
  }
  
  if (process.env.NODE_ENV === 'production') {
    // Production: use current domain with WebSocket protocol
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}`
  }
  
  // Development: use localhost
  return 'http://localhost:3000'
}
