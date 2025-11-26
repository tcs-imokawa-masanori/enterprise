#!/bin/bash

echo "🚀 Setting up Nginx for Enterprise Architecture App..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update

# Install Nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "📥 Installing Nginx..."
    sudo apt install -y nginx
else
    echo "✅ Nginx already installed"
fi

# Stop Nginx service temporarily
echo "⏸️ Stopping Nginx service..."
sudo systemctl stop nginx

# Backup existing default configuration
if [ -f /etc/nginx/sites-available/default ]; then
    echo "💾 Backing up existing default configuration..."
    sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
fi

# Copy our configuration
echo "📝 Installing Enterprise Architecture configuration..."
sudo cp nginx-enterprise.conf /etc/nginx/sites-available/enterprise.sae-g.com

# Remove default site if it exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "🗑️ Removing default site..."
    sudo rm /etc/nginx/sites-enabled/default
fi

# Enable our site
echo "🔗 Enabling Enterprise Architecture site..."
sudo ln -sf /etc/nginx/sites-available/enterprise.sae-g.com /etc/nginx/sites-enabled/

# Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    
    # Start Nginx service
    echo "▶️ Starting Nginx service..."
    sudo systemctl start nginx
    sudo systemctl enable nginx
    
    # Check status
    echo "📊 Nginx status:"
    sudo systemctl status nginx --no-pager
    
    echo ""
    echo "🎉 Nginx setup complete!"
    echo ""
    echo "📋 Configuration Summary:"
    echo "  - Server: enterprise.sae-g.com"
    echo "  - Proxy Target: http://localhost:5175"
    echo "  - WebSocket Support: ✅ Enabled for Vite HMR"
    echo "  - CORS Headers: ✅ Configured for development"
    echo "  - Gzip Compression: ✅ Enabled"
    echo "  - Security Headers: ✅ Added"
    echo ""
    echo "🔧 Next Steps:"
    echo "  1. Ensure your Vite dev server is running on port 5175"
    echo "  2. Test locally: curl -H 'Host: enterprise.sae-g.com' http://localhost"
    echo "  3. Your CloudFront should now route to this Nginx proxy"
    echo ""
    echo "📝 Log Files:"
    echo "  - Access: /var/log/nginx/enterprise.access.log"
    echo "  - Error: /var/log/nginx/enterprise.error.log"
    echo ""
    echo "🚨 Troubleshooting Commands:"
    echo "  - Check config: sudo nginx -t"
    echo "  - Reload config: sudo systemctl reload nginx"
    echo "  - View logs: sudo tail -f /var/log/nginx/enterprise.error.log"
    
else
    echo "❌ Nginx configuration test failed!"
    echo "Please check the configuration and try again."
    exit 1
fi
