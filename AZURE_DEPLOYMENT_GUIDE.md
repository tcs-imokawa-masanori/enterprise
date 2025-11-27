# Azure Deployment Guide - Enterprise Architecture App

## Overview

This guide explains how to deploy the Enterprise Architecture Application to your Azure server at `20.222.180.9` (llmimokawa).

## Infrastructure

- **Azure Server**: Ubuntu 20.04 LTS
- **Domain**: enterprise.sae-g.com
- **Web Server**: Nginx with SSL (Let's Encrypt)
- **Process Manager**: PM2
- **Backend Port**: 3005
- **Frontend**: Static files served by Nginx

## Prerequisites

1. ✅ SSH access to Azure server (PEM key at `C:\Users\Imokawa\Documents\pem\llm.pem`)
2. ✅ Domain name configured (enterprise.sae-g.com)
3. ✅ Node.js and npm installed locally
4. ✅ OpenAI API key for backend services

## Quick Deployment (Windows)

### Option 1: Automated Deployment

```batch
deploy-to-azure.bat
```

This script will:
1. Build the frontend locally
2. Upload files to Azure server
3. Install dependencies
4. Configure PM2 for backend
5. Set up nginx configuration

### Option 2: Manual Deployment

Follow the steps in the "Manual Deployment Steps" section below.

## Current Running Applications on Azure

Your Azure server currently runs:
- `bolt-diy` (PM2 ID: 0)
- `solution-architect` (PM2 ID: 1)
- `ollama-proxy` (PM2 ID: 2)
- `support-hub-backend` (PM2 ID: 3)

The enterprise app will be added as:
- `enterprise-backend` (PM2, new)

## Port Allocation

| Application | Port | Type |
|------------|------|------|
| solution-architect | Various | Node.js |
| support-hub-backend | 3002 | Node.js |
| bolt-diy | 5174 | Node.js/Remix |
| **enterprise-backend** | **3005** | **Node.js (New)** |
| **enterprise-frontend** | **Nginx** | **Static (New)** |

## Manual Deployment Steps

### Step 1: Build Frontend Locally

```bash
cd "C:\Users\Imokawa\Documents\Enetperise Architecture assets\project"
npm install
npm run build
```

This creates the `dist/` folder with production-ready static files.

### Step 2: Transfer Files to Azure

```bash
# Create directory on Azure
ssh -i "C:\Users\Imokawa\Documents\pem\llm.pem" azureuser@20.222.180.9 "mkdir -p /home/azureuser/projects/enterprise/dist /home/azureuser/projects/enterprise/server"

# Upload frontend build
scp -i "C:\Users\Imokawa\Documents\pem\llm.pem" -r dist/* azureuser@20.222.180.9:/home/azureuser/projects/enterprise/dist/

# Upload backend
scp -i "C:\Users\Imokawa\Documents\pem\llm.pem" -r server/* azureuser@20.222.180.9:/home/azureuser/projects/enterprise/server/
scp -i "C:\Users\Imokawa\Documents\pem\llm.pem" server.js package.json package-lock.json azureuser@20.222.180.9:/home/azureuser/projects/enterprise/
```

### Step 3: Setup Backend on Azure

SSH into the server:

```bash
ssh -i "C:\Users\Imokawa\Documents\pem\llm.pem" azureuser@20.222.180.9
```

Then run:

```bash
cd /home/azureuser/projects/enterprise

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install dependencies
npm install --production
cd server
npm install --production
cd ..

# Create .env file
nano server/.env
```

Add this content to `server/.env`:

```env
# Enterprise Architecture Application
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3005
NODE_ENV=production
CORS_ORIGIN=https://enterprise.sae-g.com,http://enterprise.sae-g.com
```

Save and exit (Ctrl+X, Y, Enter).

### Step 4: Start Backend with PM2

```bash
cd /home/azureuser/projects/enterprise/server

# Stop existing process if any
pm2 delete enterprise-backend 2>/dev/null || true

# Start the backend
pm2 start realtime-token.js --name enterprise-backend --env production

# Save PM2 configuration
pm2 save

# Check status
pm2 list
pm2 logs enterprise-backend --lines 20
```

### Step 5: Configure Nginx

Create nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/enterprise
```

Add this configuration:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name enterprise.sae-g.com;
    
    # Serve frontend
    root /home/azureuser/projects/enterprise/dist;
    index index.html;
    
    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3005/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Realtime API (WebSocket)
    location /realtime/ {
        proxy_pass http://localhost:3005/realtime/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # Extended timeouts for WebSocket
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

Enable the site and reload nginx:

```bash
# Enable site
sudo ln -sf /etc/nginx/sites-available/enterprise /etc/nginx/sites-enabled/enterprise

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 6: Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
sudo certbot certonly --nginx -d enterprise.sae-g.com
```

Then update the nginx config to add SSL:

```nginx
# Add this server block after obtaining SSL certificate
server {
    listen 443 ssl http2;
    server_name enterprise.sae-g.com;

    ssl_certificate /etc/letsencrypt/live/enterprise.sae-g.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/enterprise.sae-g.com/privkey.pem;
    
    # Rest of configuration same as HTTP version...
}
```

## DNS Configuration

Configure your DNS provider to point `enterprise.sae-g.com` to your Azure server IP:

```
Type: A
Name: enterprise
Value: 20.222.180.9
TTL: 3600
```

## Verification

After deployment, verify the application:

1. **Backend Health Check**:
   ```bash
   curl http://20.222.180.9:3005/health
   # or
   curl http://enterprise.sae-g.com/api/health
   ```

2. **Frontend**:
   ```
   http://enterprise.sae-g.com
   ```

3. **PM2 Status**:
   ```bash
   ssh -i "C:\Users\Imokawa\Documents\pem\llm.pem" azureuser@20.222.180.9
   pm2 list
   pm2 logs enterprise-backend
   ```

## Monitoring and Maintenance

### View Logs

```bash
# PM2 logs
pm2 logs enterprise-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart Application

```bash
pm2 restart enterprise-backend
```

### Update Application

To update the application, simply re-run the deployment script:

```batch
deploy-to-azure.bat
```

## Troubleshooting

### Backend not starting

```bash
cd /home/azureuser/projects/enterprise
pm2 logs enterprise-backend --err --lines 50
```

### Port already in use

```bash
# Check what's using port 3005
sudo lsof -i :3005

# Or change the port in server/.env and restart
```

### Nginx errors

```bash
# Test nginx configuration
sudo nginx -t

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate issues

```bash
# Renew certificates
sudo certbot renew

# Test certificate auto-renewal
sudo certbot renew --dry-run
```

## Architecture Comparison: Azure vs AWS

| Aspect | Azure (Chosen) | AWS S3 + CloudFront |
|--------|----------------|---------------------|
| Setup Complexity | Medium | High |
| Cost | Server running 24/7 | Pay per request |
| Scalability | Manual scaling | Auto-scaling |
| Your Permissions | ✅ Full access | ❌ Limited CloudFront access |
| Consistency | ✅ All apps on Azure | Mixed infrastructure |
| Backend Location | Same server | Separate EC2 |
| SSL Setup | Let's Encrypt (Free) | ACM (Free) |
| Deployment Speed | Fast (familiar) | Slower (new setup) |

**Decision: Azure** - Given your existing Azure infrastructure and AWS permission limitations, deploying to Azure provides the fastest, most consistent solution.

## Support

For issues or questions:
1. Check PM2 logs: `pm2 logs enterprise-backend`
2. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify backend health: `curl http://localhost:3005/health`

