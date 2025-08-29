#!/bin/bash
echo "Starting static build..."

# Set memory limit
export NODE_OPTIONS="--max-old-space-size=64"

# Create output directory
mkdir -p out

# Copy public files to out directory
if [ -d "public" ] && [ "$(ls -A public)" ]; then
    echo "Copying public files to out directory..."
    cp -r public/* out/
    echo "Copy completed successfully!"
else
    echo "Public directory is empty or missing, creating basic files..."
    # Create basic index.html if public is empty
    cat > out/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nitesh Handicraft</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; text-align: center; }
        .hero { text-align: center; padding: 40px 0; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 40px 0; }
        .feature { padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center; }
        .cta { text-align: center; margin: 40px 0; }
        .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>Welcome to Nitesh Handicraft</h1>
            <p>Discover beautiful handcrafted products made with love and tradition</p>
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>Handcrafted Products</h3>
                <p>Unique items created by skilled artisans</p>
            </div>
            <div class="feature">
                <h3>Traditional Designs</h3>
                <p>Authentic cultural heritage in every piece</p>
            </div>
            <div class="feature">
                <h3>Quality Materials</h3>
                <p>Premium materials for lasting beauty</p>
            </div>
        </div>
        
        <div class="cta">
            <a href="#" class="btn">Explore Products</a>
        </div>
    </div>
</body>
</html>
EOF
    echo "Basic index.html created in out directory!"
fi

echo "Build completed successfully!"
ls -la out/
