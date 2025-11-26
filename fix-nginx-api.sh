#!/bin/bash

# Script to fix Nginx API proxy configuration on EC2
echo "Fixing Nginx API proxy configuration..."

# Backup current config
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Add API proxy configuration
sudo tee -a /etc/nginx/sites-available/default > /dev/null <<'EOF'

    # Proxy API requests to backend server on port 3001
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # CORS headers
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;

        # Handle preflight
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain; charset=utf-8';
            add_header Content-Length 0;
            return 204;
        }
    }
EOF

# Remove the last closing brace and re-add it after our location block
sudo sed -i '$ d' /etc/nginx/sites-available/default
echo "}" | sudo tee -a /etc/nginx/sites-available/default

# Test configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# If test passes, reload nginx
if [ $? -eq 0 ]; then
    echo "Reloading Nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx configuration updated successfully!"

    # Test the API endpoint
    echo "Testing API endpoint..."
    curl -X POST http://localhost/api/realtime/client_secret -H "Content-Type: application/json" -d "{}"
else
    echo "❌ Nginx configuration test failed. Restoring backup..."
    sudo mv /etc/nginx/sites-available/default.backup /etc/nginx/sites-available/default
    sudo nginx -t
    sudo systemctl reload nginx
fi