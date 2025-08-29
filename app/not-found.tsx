export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-4">
            <a href="/" className="inline-block w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
              Go Back Home
            </a>
            
            <a href="/catalog" className="inline-block w-full border border-input bg-background px-4 py-2 rounded-md hover:bg-accent">
              Browse Products
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
