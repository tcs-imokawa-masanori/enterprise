#!/bin/bash

# EC2 Deployment Script for Enterprise Architecture App
# Run this on your EC2 instance

echo "==================================="
echo "EC2 Deployment Setup"
echo "==================================="

# 1. Navigate to project directory (adjust path as needed)
cd /home/ubuntu/enterprise-app || exit

# 2. Pull latest code (if using git)
# git pull origin main

# 3. Install dependencies
echo "Installing dependencies..."
npm install

# 4. Create .env file if not exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
# Enterprise Architecture Chat Configuration
OPENAI_API_KEY=your-openai-api-key-here
VITE_OPENAI_API_KEY=your-openai-api-key-here
VITE_CHAT_MODEL=gpt-4
VITE_MAX_TOKENS=2000
VITE_TEMPERATURE=0.7
VITE_DATA_SOURCE=local
VITE_ENABLE_REALTIME=true
VITE_CACHE_DURATION=3600000
VITE_SEARCH_FUZZY_THRESHOLD=0.6
VITE_MAX_SEARCH_RESULTS=50
VITE_ENABLE_CROSS_INDUSTRY_SEARCH=true
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ENDPOINT=http://localhost:3001/analytics
VITE_ENABLE_CHAT=true
VITE_ENABLE_DATASET_COMPARISON=true
VITE_ENABLE_REPORT_GENERATION=true
VITE_ENABLE_ARCHITECTURE_INSIGHTS=true
EOF
fi

# 5. Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# 6. Stop existing processes
echo "Stopping existing processes..."
pm2 stop all || true

# 7. Start frontend server (Vite)
echo "Starting frontend server on port 5175..."
pm2 start npm --name "frontend" -- run dev

# 8. Start backend server
echo "Starting backend server on port 3001..."
pm2 start npm --name "backend" -- run server

# 9. Save PM2 configuration
pm2 save

# 10. Setup PM2 to start on boot
pm2 startup systemd -u ubuntu --hp /home/ubuntu
# Note: This will output a command to run with sudo

# 11. Update Nginx configuration
echo "Updating Nginx configuration..."
sudo cp nginx-enterprise.conf /etc/nginx/sites-available/enterprise.sae-g.com
sudo nginx -t && sudo systemctl reload nginx

# 12. Check status
echo ""
echo "==================================="
echo "Deployment Status"
echo "==================================="
pm2 status
echo ""
echo "Testing endpoints..."
curl -I http://localhost:5175
echo ""
curl -I http://localhost:3001/health
echo ""
echo "==================================="
echo "Deployment Complete!"
echo "==================================="
echo "Frontend: http://localhost:5175"
echo "Backend: http://localhost:3001"
echo "External: https://enterprise.sae-g.com"
echo ""
echo "To monitor logs:"
echo "  pm2 logs frontend"
echo "  pm2 logs backend"
echo ""
echo "To restart services:"
echo "  pm2 restart all"