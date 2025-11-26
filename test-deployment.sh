#!/bin/bash

echo "🧪 Testing Enterprise Architecture App Deployment"
echo "================================================="
echo ""

DOMAIN="enterprise.sae-g.com"
LOCAL_PORT="5175"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test functions
test_dns() {
    echo -e "${BLUE}🔍 Testing DNS Resolution...${NC}"
    if nslookup $DOMAIN > /dev/null 2>&1; then
        echo -e "${GREEN}✅ DNS Resolution: SUCCESS${NC}"
        echo "   Domain: $DOMAIN resolves to CloudFront"
    else
        echo -e "${RED}❌ DNS Resolution: FAILED${NC}"
        echo "   Domain: $DOMAIN does not resolve"
    fi
    echo ""
}

test_local_vite() {
    echo -e "${BLUE}🔍 Testing Local Vite Server...${NC}"
    if curl -s http://localhost:$LOCAL_PORT > /dev/null; then
        echo -e "${GREEN}✅ Vite Server: RUNNING${NC}"
        echo "   Port: $LOCAL_PORT is responding"
    else
        echo -e "${RED}❌ Vite Server: NOT RUNNING${NC}"
        echo "   Port: $LOCAL_PORT is not responding"
        echo "   Run: npm run dev"
    fi
    echo ""
}

test_nginx_config() {
    echo -e "${BLUE}🔍 Testing Nginx Configuration...${NC}"
    if sudo nginx -t > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Nginx Config: VALID${NC}"
    else
        echo -e "${RED}❌ Nginx Config: INVALID${NC}"
        echo "   Run: sudo nginx -t for details"
    fi
    echo ""
}

test_nginx_service() {
    echo -e "${BLUE}🔍 Testing Nginx Service...${NC}"
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Nginx Service: RUNNING${NC}"
    else
        echo -e "${RED}❌ Nginx Service: NOT RUNNING${NC}"
        echo "   Run: sudo systemctl start nginx"
    fi
    echo ""
}

test_local_proxy() {
    echo -e "${BLUE}🔍 Testing Local Nginx Proxy...${NC}"
    response=$(curl -s -H "Host: $DOMAIN" http://localhost -w "%{http_code}" -o /dev/null)
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Nginx Proxy: SUCCESS${NC}"
        echo "   Local proxy is forwarding requests to Vite"
    else
        echo -e "${RED}❌ Nginx Proxy: FAILED (HTTP $response)${NC}"
        echo "   Check nginx logs: sudo tail -f /var/log/nginx/enterprise.error.log"
    fi
    echo ""
}

test_https_connection() {
    echo -e "${BLUE}🔍 Testing HTTPS Connection...${NC}"
    if curl -s -I https://$DOMAIN > /dev/null 2>&1; then
        echo -e "${GREEN}✅ HTTPS Connection: SUCCESS${NC}"
        echo "   SSL certificate is working"
        
        # Get SSL certificate info
        cert_info=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -subject -dates 2>/dev/null)
        if [ ! -z "$cert_info" ]; then
            echo "   Certificate Details:"
            echo "   $cert_info" | sed 's/^/   /'
        fi
    else
        echo -e "${RED}❌ HTTPS Connection: FAILED${NC}"
        echo "   SSL certificate or CloudFront issue"
    fi
    echo ""
}

test_app_loading() {
    echo -e "${BLUE}🔍 Testing App Loading...${NC}"
    response=$(curl -s https://$DOMAIN)
    if echo "$response" | grep -q "Enterprise Architecture" || echo "$response" | grep -q "<div id=\"root\""; then
        echo -e "${GREEN}✅ App Loading: SUCCESS${NC}"
        echo "   React app is loading properly"
    else
        echo -e "${YELLOW}⚠️  App Loading: PARTIAL${NC}"
        echo "   App might be loading but content check failed"
        echo "   Manual check recommended: https://$DOMAIN"
    fi
    echo ""
}

test_api_endpoints() {
    echo -e "${BLUE}🔍 Testing API Endpoints...${NC}"
    
    # Test health endpoint
    health_response=$(curl -s https://$DOMAIN/health -w "%{http_code}" -o /dev/null)
    if [ "$health_response" = "200" ]; then
        echo -e "${GREEN}✅ Health Endpoint: SUCCESS${NC}"
    else
        echo -e "${YELLOW}⚠️  Health Endpoint: Not configured${NC}"
    fi
    
    # Test static assets
    assets_response=$(curl -s -I https://$DOMAIN/assets/ -w "%{http_code}" -o /dev/null)
    if [ "$assets_response" = "200" ] || [ "$assets_response" = "404" ]; then
        echo -e "${GREEN}✅ Static Assets: Routing works${NC}"
    else
        echo -e "${RED}❌ Static Assets: Issues detected${NC}"
    fi
    echo ""
}

test_performance() {
    echo -e "${BLUE}🔍 Testing Performance...${NC}"
    
    # Test response time
    response_time=$(curl -s -w "%{time_total}" -o /dev/null https://$DOMAIN)
    echo "   Response Time: ${response_time}s"
    
    # Test compression
    if curl -s -H "Accept-Encoding: gzip" -I https://$DOMAIN | grep -q "gzip"; then
        echo -e "${GREEN}✅ Compression: Enabled${NC}"
    else
        echo -e "${YELLOW}⚠️  Compression: Not detected${NC}"
    fi
    echo ""
}

show_system_info() {
    echo -e "${BLUE}📊 System Information${NC}"
    echo "===================="
    echo "Server: $(hostname)"
    echo "OS: $(lsb_release -d | cut -f2-)"
    echo "Nginx Version: $(nginx -v 2>&1 | cut -d' ' -f3)"
    echo "Node.js Version: $(node -v 2>/dev/null || echo 'Not installed')"
    echo "Current Time: $(date)"
    echo ""
    
    echo -e "${BLUE}🔌 Port Status${NC}"
    echo "=============="
    echo "Port 80 (Nginx): $(netstat -tlnp | grep :80 | wc -l) connections"
    echo "Port $LOCAL_PORT (Vite): $(netstat -tlnp | grep :$LOCAL_PORT | wc -l) connections"
    echo ""
    
    echo -e "${BLUE}💾 Resource Usage${NC}"
    echo "================="
    echo "Memory: $(free -h | grep Mem | awk '{print $3 "/" $2}')"
    echo "Disk: $(df -h / | tail -1 | awk '{print $3 "/" $2 " (" $5 " used)"}')"
    echo ""
}

show_logs() {
    echo -e "${BLUE}📝 Recent Logs${NC}"
    echo "=============="
    
    if [ -f /var/log/nginx/enterprise.error.log ]; then
        echo "Nginx Error Log (last 5 lines):"
        sudo tail -5 /var/log/nginx/enterprise.error.log | sed 's/^/   /'
    fi
    
    if [ -f /var/log/nginx/enterprise.access.log ]; then
        echo ""
        echo "Nginx Access Log (last 5 lines):"
        sudo tail -5 /var/log/nginx/enterprise.access.log | sed 's/^/   /'
    fi
    echo ""
}

# Main execution
echo "🚀 Starting comprehensive deployment test..."
echo ""

# Run all tests
test_dns
test_local_vite
test_nginx_config
test_nginx_service
test_local_proxy
test_https_connection
test_app_loading
test_api_endpoints
test_performance

# Show system information
show_system_info

# Show recent logs
show_logs

# Final summary
echo -e "${BLUE}📋 Test Summary${NC}"
echo "==============="
echo "✅ = Working correctly"
echo "⚠️  = Working but needs attention"
echo "❌ = Not working, needs fixing"
echo ""
echo -e "${GREEN}🎉 If all tests show ✅, your app is live at:${NC}"
echo -e "${GREEN}   https://$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}💡 Troubleshooting:${NC}"
echo "   - Check logs: sudo tail -f /var/log/nginx/enterprise.error.log"
echo "   - Restart services: sudo systemctl restart nginx"
echo "   - Test nginx config: sudo nginx -t"
echo "   - Restart Vite: npm run dev"
echo ""
echo "Test completed at: $(date)"
