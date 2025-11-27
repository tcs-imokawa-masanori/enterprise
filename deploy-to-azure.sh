#!/bin/bash

# Azure Deployment Script for Enterprise Architecture App
# Run this script from your local machine

set -e

AZURE_HOST="20.222.180.9"
AZURE_USER="azureuser"
PEM_KEY="C:/Users/Imokawa/Documents/pem/llm.pem"
APP_NAME="enterprise"
DOMAIN="enterprise.sae-g.com"
REMOTE_DIR="/home/azureuser/projects/$APP_NAME"
BACKEND_PORT="3005"  # Using 3005 to avoid conflicts with other apps
FRONTEND_PORT="5180" # Using 5180 to avoid conflicts

echo "=========================================="
echo "Enterprise App - Azure Deployment"
echo "=========================================="
echo "Domain: $DOMAIN"
echo "Backend Port: $BACKEND_PORT"
echo "Frontend Port: $FRONTEND_PORT"
echo "=========================================="

# Step 1: Build frontend locally
echo ""
echo "[1/6] Building frontend locally..."
npm install
npm run build

# Step 2: Create remote directory
echo ""
echo "[2/6] Creating remote directory..."
ssh -i "$PEM_KEY" $AZURE_USER@$AZURE_HOST "mkdir -p $REMOTE_DIR/dist $REMOTE_DIR/server"

# Step 3: Upload files
echo ""
echo "[3/6] Uploading application files..."
scp -i "$PEM_KEY" -r dist/* $AZURE_USER@$AZURE_HOST:$REMOTE_DIR/dist/
scp -i "$PEM_KEY" -r server/* $AZURE_USER@$AZURE_HOST:$REMOTE_DIR/server/
scp -i "$PEM_KEY" server.js package*.json $AZURE_USER@$AZURE_HOST:$REMOTE_DIR/

# Step 4: Setup backend
echo ""
echo "[4/6] Setting up backend on Azure..."
ssh -i "$PEM_KEY" $AZURE_USER@$AZURE_HOST << 'ENDSSH'
cd /home/azureuser/projects/enterprise

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install dependencies
echo "Installing backend dependencies..."
npm install
cd server
npm install
cd ..

# Create .env file
if [ ! -f server/.env ]; then
    echo "Creating server/.env file..."
    cat > server/.env << 'EOF'
# Enterprise Architecture Chat Configuration
OPENAI_API_KEY=your-openai-api-key-here
PORT=3005
NODE_ENV=production
EOF
    echo "⚠️  WARNING: Please update server/.env with your actual OpenAI API key"
fi

# Stop existing PM2 processes for this app
echo "Stopping existing enterprise app processes..."
~/.nvm/versions/node/*/bin/pm2 delete enterprise-backend 2>/dev/null || true

# Start backend with PM2
echo "Starting backend with PM2..."
~/.nvm/versions/node/*/bin/pm2 start server/realtime-token.js --name enterprise-backend --env production

# Save PM2 configuration
~/.nvm/versions/node/*/bin/pm2 save

echo "Backend started successfully!"
ENDSSH

# Step 5: Create nginx configuration
echo ""
echo "[5/6] Creating nginx configuration..."
cat > /tmp/nginx-enterprise.conf << 'EOF'
# Nginx configuration for enterprise.sae-g.com

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name enterprise.sae-g.com;
    return 301 https://$host$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name enterprise.sae-g.com;

    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/enterprise.sae-g.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/enterprise.sae-g.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/enterprise.sae-g.com/chain.pem;

    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Serve frontend (static files)
    root /home/azureuser/projects/enterprise/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Frontend - serve static files
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:3005/;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header Access-Control-Allow-Headers 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;
        
        # Timeouts
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }

    # Realtime API (OpenAI Realtime)
    location /realtime/ {
        proxy_pass http://localhost:3005/realtime/;
        proxy_http_version 1.1;
        
        # WebSocket support (required for realtime)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        
        # Proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Extended timeouts for WebSocket
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3005/health;
        access_log off;
    }
}
EOF

# Upload nginx config
scp -i "$PEM_KEY" /tmp/nginx-enterprise.conf $AZURE_USER@$AZURE_HOST:/tmp/

# Step 6: Install nginx config and setup SSL
echo ""
echo "[6/6] Installing nginx configuration..."
ssh -i "$PEM_KEY" $AZURE_USER@$AZURE_HOST << 'ENDSSH'
# Install nginx config
sudo cp /tmp/nginx-enterprise.conf /etc/nginx/sites-available/enterprise

# Enable site
sudo ln -sf /etc/nginx/sites-available/enterprise /etc/nginx/sites-enabled/enterprise

# Test nginx configuration
echo "Testing nginx configuration..."
sudo nginx -t

# Check if SSL certificate exists
if [ ! -f /etc/letsencrypt/live/enterprise.sae-g.com/fullchain.pem ]; then
    echo ""
    echo "⚠️  WARNING: SSL certificate not found!"
    echo "You need to obtain an SSL certificate. Run this on the Azure server:"
    echo ""
    echo "sudo certbot certonly --nginx -d enterprise.sae-g.com"
    echo ""
    echo "For now, creating a temporary HTTP-only configuration..."
    
    # Create temporary HTTP-only config
    cat > /tmp/nginx-enterprise-http.conf << 'HTTPEOF'
server {
    listen 80;
    server_name enterprise.sae-g.com;
    
    root /home/azureuser/projects/enterprise/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3005/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /realtime/ {
        proxy_pass http://localhost:3005/realtime/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
HTTPEOF
    
    sudo cp /tmp/nginx-enterprise-http.conf /etc/nginx/sites-available/enterprise
    sudo ln -sf /etc/nginx/sites-available/enterprise /etc/nginx/sites-enabled/enterprise
fi

# Reload nginx
echo "Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "=========================================="
echo "PM2 Status:"
~/.nvm/versions/node/*/bin/pm2 list
echo ""
echo "Nginx Status:"
sudo systemctl status nginx --no-pager | head -10
echo "=========================================="
ENDSSH

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Application URLs:"
echo "  Frontend: http://enterprise.sae-g.com"
echo "  Backend:  http://enterprise.sae-g.com/api"
echo ""
echo "Next Steps:"
echo "1. Update DNS record for enterprise.sae-g.com -> $AZURE_HOST"
echo "2. Add OpenAI API key to: $REMOTE_DIR/server/.env"
echo "3. Obtain SSL certificate:"
echo "   ssh -i \"$PEM_KEY\" $AZURE_USER@$AZURE_HOST"
echo "   sudo certbot certonly --nginx -d enterprise.sae-g.com"
echo "4. After SSL is set up, re-run nginx config deployment"
echo ""
echo "To monitor the application:"
echo "  ssh -i \"$PEM_KEY\" $AZURE_USER@$AZURE_HOST"
echo "  ~/.nvm/versions/node/*/bin/pm2 logs enterprise-backend"
echo "=========================================="

