#!/bin/bash

# Quick status check for Enterprise Architecture App
echo "🚀 Enterprise Architecture App - Quick Status"
echo "=============================================="

DOMAIN="enterprise.sae-g.com"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Vite server
echo -n "Vite Server (5175): "
if curl -s http://localhost:5175 > /dev/null; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${RED}❌ Not running${NC}"
fi

# Check Nginx
echo -n "Nginx Service: "
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${RED}❌ Not running${NC}"
fi

# Check domain
echo -n "Domain Access: "
if curl -s -I https://$DOMAIN > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Accessible${NC}"
else
    echo -e "${RED}❌ Not accessible${NC}"
fi

# Show current connections
echo ""
echo "Current Connections:"
echo "Port 80: $(netstat -an | grep :80 | grep ESTABLISHED | wc -l) active"
echo "Port 5175: $(netstat -an | grep :5175 | grep ESTABLISHED | wc -l) active"

# Show last access
if [ -f /var/log/nginx/enterprise.access.log ]; then
    echo ""
    echo "Last Access:"
    sudo tail -1 /var/log/nginx/enterprise.access.log
fi

echo ""
echo "🌐 Your app: https://$DOMAIN"
echo "📊 Local dev: http://localhost:5175"
