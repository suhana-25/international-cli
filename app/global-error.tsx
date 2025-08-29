'use client'

export default function GlobalError() {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <h1 className="text-6xl font-bold text-destructive mb-4">500</h1>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Global Error</h2>
                <p className="text-muted-foreground mb-8">
                  A critical error occurred. Please refresh the page or contact support.
                </p>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => window.location.reload()} 
                  className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
