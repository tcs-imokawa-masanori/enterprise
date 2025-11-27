#!/bin/bash
# Remote Azure Setup Script
# This runs on the Azure server after files are uploaded

set -e

APP_DIR="/home/azureuser/projects/enterprise"
BACKEND_PORT=3005

echo "Setting up Enterprise App on Azure server..."
cd $APP_DIR

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install root dependencies
echo "Installing root dependencies..."
npm install --production

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install --production
cd ..

# Create .env file if it doesn't exist
if [ ! -f server/.env ]; then
    echo "Creating server/.env file..."
    cat > server/.env << 'EOF'
# Enterprise Architecture Application Configuration
OPENAI_API_KEY=your-openai-api-key-here
PORT=3005
NODE_ENV=production
CORS_ORIGIN=https://enterprise.sae-g.com,http://enterprise.sae-g.com
EOF
    echo "⚠️  Created server/.env - Please update with your OpenAI API key!"
fi

# Stop existing PM2 process
echo "Stopping existing enterprise-backend process..."
~/.nvm/versions/node/*/bin/pm2 delete enterprise-backend 2>/dev/null || echo "No existing process found"

# Start backend with PM2
echo "Starting enterprise-backend with PM2 on port $BACKEND_PORT..."
cd server
~/.nvm/versions/node/*/bin/pm2 start realtime-token.js \
  --name enterprise-backend \
  --env production \
  --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
  --merge-logs \
  --output /home/azureuser/.pm2/logs/enterprise-backend-out.log \
  --error /home/azureuser/.pm2/logs/enterprise-backend-error.log

cd ..

# Save PM2 configuration
~/.nvm/versions/node/*/bin/pm2 save

echo ""
echo "✅ Application setup complete!"
echo ""
echo "PM2 Status:"
~/.nvm/versions/node/*/bin/pm2 list | grep -E "enterprise|status"
echo ""
echo "Backend running on port $BACKEND_PORT"
echo "Frontend files deployed to: $APP_DIR/dist"

