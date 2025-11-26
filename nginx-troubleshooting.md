# 🔧 Nginx Troubleshooting Guide for Enterprise Architecture App

## 🚀 Quick Setup Commands

```bash
# Make setup script executable
chmod +x setup-nginx.sh

# Run the setup script
sudo ./setup-nginx.sh
```

## 🔍 Testing Your Setup

### 1. Test Nginx Configuration
```bash
# Test configuration syntax
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx
```

### 2. Test Local Proxy
```bash
# Test with curl (simulate CloudFront request)
curl -H "Host: enterprise.sae-g.com" http://localhost

# Test with specific headers
curl -H "Host: enterprise.sae-g.com" -H "X-Forwarded-Proto: https" http://localhost

# Check if Vite server is running
curl http://localhost:5175
```

### 3. Test WebSocket Connection
```bash
# Test WebSocket endpoint for Vite HMR
curl -H "Host: enterprise.sae-g.com" -H "Upgrade: websocket" -H "Connection: Upgrade" http://localhost/ws
```

## 🚨 Common Issues & Solutions

### Issue 1: Nginx Won't Start
```bash
# Check for syntax errors
sudo nginx -t

# Check what's using port 80
sudo netstat -tlnp | grep :80

# Check Nginx status
sudo systemctl status nginx
```

### Issue 2: 502 Bad Gateway
**Cause**: Vite server not running or wrong port

**Solution**:
```bash
# Check if Vite is running on port 5175
ps aux | grep vite
netstat -tlnp | grep :5175

# Start Vite server if not running
cd /path/to/your/project
npm run dev
```

### Issue 3: WebSocket Connection Failed
**Cause**: WebSocket proxy not configured properly

**Solution**: Check the `/ws` location block in nginx config:
```nginx
location /ws {
    proxy_pass http://localhost:5175;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

### Issue 4: CORS Errors
**Cause**: Missing or incorrect CORS headers

**Solution**: Verify CORS headers in nginx config:
```nginx
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
```

### Issue 5: CloudFront Can't Connect
**Cause**: Security group or firewall blocking port 80

**Solution**:
```bash
# Check if port 80 is open
sudo ufw status
sudo iptables -L

# Open port 80 if using ufw
sudo ufw allow 80

# For AWS Security Group, ensure port 80 is open to CloudFront IP ranges
```

## 📊 Monitoring & Logs

### View Real-time Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/enterprise.access.log

# Error logs
sudo tail -f /var/log/nginx/enterprise.error.log

# Both logs simultaneously
sudo tail -f /var/log/nginx/enterprise.*.log
```

### Log Analysis
```bash
# Count requests by status code
sudo awk '{print $9}' /var/log/nginx/enterprise.access.log | sort | uniq -c

# Find 4xx and 5xx errors
sudo grep " [45][0-9][0-9] " /var/log/nginx/enterprise.access.log

# Monitor real-time connections
sudo netstat -an | grep :80 | wc -l
```

## 🔧 Advanced Configuration

### Performance Tuning
```nginx
# Add to http block in /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

# Add to server block
client_max_body_size 50M;
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```

### SSL Termination at Nginx (Alternative)
If you want to handle SSL at Nginx instead of CloudFront:

```nginx
server {
    listen 443 ssl http2;
    server_name enterprise.sae-g.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Rest of configuration...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name enterprise.sae-g.com;
    return 301 https://$server_name$request_uri;
}
```

## 🎯 CloudFront Integration

### CloudFront Origin Settings
Based on your screenshots, ensure these settings:

**Origin Domain**: `ec2-3-114-118-229.ap-northeast-1.compute.amazonaws.com`
**Protocol**: HTTP Only (since CloudFront handles HTTPS)
**HTTP Port**: 80
**Origin Path**: Leave empty

### CloudFront Behavior Settings
- **Viewer Protocol Policy**: Redirect HTTP to HTTPS
- **Allowed HTTP Methods**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
- **Compress Objects Automatically**: Yes

## 🔄 Deployment Workflow

### Development Mode (Current Setup)
```bash
# 1. Start Vite dev server
npm run dev  # Runs on port 5175

# 2. Nginx proxies to Vite
# CloudFront → Nginx (port 80) → Vite (port 5175)
```

### Production Mode (Future)
```bash
# 1. Build static files
npm run build

# 2. Serve static files directly with Nginx
# CloudFront → Nginx (serves static files from /dist)
```

## 🚨 Emergency Commands

### Quick Restart Everything
```bash
# Restart all services
sudo systemctl restart nginx
cd /path/to/project && npm run dev
```

### Reset to Default Nginx
```bash
# Remove our configuration
sudo rm /etc/nginx/sites-enabled/enterprise.sae-g.com
sudo rm /etc/nginx/sites-available/enterprise.sae-g.com

# Restore default
sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Check All Services
```bash
# System status
sudo systemctl status nginx
ps aux | grep vite
netstat -tlnp | grep -E ':(80|5175)'

# Disk space
df -h

# Memory usage
free -h
```

## 📞 Health Check Endpoints

Test these URLs to verify everything is working:

```bash
# Health check (should return "healthy")
curl -H "Host: enterprise.sae-g.com" http://localhost/health

# Main app (should return HTML)
curl -H "Host: enterprise.sae-g.com" http://localhost/

# Static asset (should return JS/CSS)
curl -H "Host: enterprise.sae-g.com" http://localhost/assets/index.js
```

---

## 🎉 Success Indicators

✅ **Nginx Config Valid**: `sudo nginx -t` returns no errors
✅ **Nginx Running**: `sudo systemctl status nginx` shows active
✅ **Vite Server Running**: Port 5175 is listening
✅ **Proxy Working**: Curl returns your app's HTML
✅ **CloudFront Connected**: Your domain loads the app

Your Enterprise Architecture application should now be accessible via `https://enterprise.sae-g.com`! 🚀
