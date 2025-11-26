# 🚀 AWS Deployment Guide for Enterprise Architecture App

## Prerequisites ✅

1. **AWS CLI installed and configured**
   ```powershell
   aws configure
   # Enter your AWS Access Key, Secret Key, Region (us-east-1), and output format (json)
   ```

2. **SSL Certificate in AWS Certificate Manager**
   - ✅ You already have this configured
   - Must be in `us-east-1` region for CloudFront
   - Note down the Certificate ARN

3. **Route 53 Hosted Zone**
   - For domain `sae-g.com`
   - Note down the Hosted Zone ID

## 🎯 Quick Deployment Steps

### Step 1: Update Configuration

1. **Edit `deploy-to-aws.ps1`** and update these values:
   ```powershell
   $CERTIFICATE_ARN = "arn:aws:acm:us-east-1:123456789012:certificate/your-cert-id"
   $HOSTED_ZONE_ID = "Z1D633PJN98FT9"  # Your Route 53 hosted zone ID
   ```

2. **Get your Certificate ARN**:
   ```powershell
   aws acm list-certificates --region us-east-1
   ```

3. **Get your Hosted Zone ID**:
   ```powershell
   aws route53 list-hosted-zones
   ```

### Step 2: Deploy to S3

```powershell
# Make script executable and run
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy-to-aws.ps1
```

### Step 3: Create CloudFront Distribution

1. **Update `cloudfront-setup.json`** with your Certificate ARN:
   ```json
   "ACMCertificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/your-cert-id"
   ```

2. **Create CloudFront distribution**:
   ```powershell
   aws cloudfront create-distribution --distribution-config file://cloudfront-setup.json
   ```

3. **Note the CloudFront Domain Name** from the output (e.g., `d123456789.cloudfront.net`)

### Step 4: Configure DNS (Route 53)

```powershell
# Create A record pointing to CloudFront
aws route53 change-resource-record-sets --hosted-zone-id YOUR_HOSTED_ZONE_ID --change-batch '{
  "Changes": [{
    "Action": "CREATE",
    "ResourceRecordSet": {
      "Name": "enterprise.sae-g.com",
      "Type": "A",
      "AliasTarget": {
        "DNSName": "YOUR_CLOUDFRONT_DOMAIN.cloudfront.net",
        "EvaluateTargetHealth": false,
        "HostedZoneId": "Z2FDTNDATAQYW2"
      }
    }
  }]
}'
```

## 🔧 Alternative: AWS Console Setup

If you prefer using the AWS Console:

### 1. S3 Setup
- **Create bucket**: `enterprise-sae-g-com`
- **Enable static website hosting**
- **Upload `dist` folder contents**
- **Set bucket policy for public read access**

### 2. CloudFront Setup
- **Create distribution**
- **Origin**: Your S3 website endpoint
- **Alternate Domain Names**: `enterprise.sae-g.com`
- **SSL Certificate**: Select your ACM certificate
- **Error Pages**: 404 → `/index.html` (for SPA routing)

### 3. Route 53 Setup
- **Create A record**
- **Name**: `enterprise`
- **Type**: A - IPv4 address
- **Alias**: Yes → CloudFront distribution

## 🛡️ Security & Best Practices

### Content Security Policy
Add to your `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.openai.com wss://api.openai.com;">
```

### CORS Configuration
If you have a backend API, configure CORS:
```json
{
  "CORSRules": [{
    "AllowedOrigins": ["https://enterprise.sae-g.com"],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }]
}
```

## 🔄 Future Deployments

Create a simple update script:
```powershell
# update-app.ps1
npm run build
aws s3 sync .\dist s3://enterprise-sae-g-com --delete --cache-control "max-age=31536000" --exclude "*.html"
aws s3 sync .\dist s3://enterprise-sae-g-com --delete --cache-control "max-age=0" --include "*.html"
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🎯 Backend API (Optional)

For your Node.js voice chat server:

### Option 1: AWS Lambda + API Gateway
```powershell
# Install Serverless Framework
npm install -g serverless
serverless create --template aws-nodejs --path enterprise-api
```

### Option 2: EC2 + Application Load Balancer
- Deploy Node.js app to EC2
- Use ALB with your SSL certificate
- Create subdomain: `api.enterprise.sae-g.com`

## 📊 Monitoring & Costs

### CloudWatch Monitoring
- **S3**: Request metrics, data transfer
- **CloudFront**: Cache hit ratio, origin requests
- **Route 53**: DNS query volume

### Expected Costs (Monthly)
- **S3**: ~$1-5 (depending on traffic)
- **CloudFront**: ~$1-10 (first 1TB free tier)
- **Route 53**: ~$0.50 per hosted zone + $0.40 per million queries
- **Certificate Manager**: Free for AWS resources

## 🚨 Troubleshooting

### Common Issues:

1. **Certificate not found**: Ensure it's in `us-east-1` region
2. **403 Forbidden**: Check S3 bucket policy and CloudFront origin settings
3. **404 on refresh**: Ensure CloudFront error page redirects to `/index.html`
4. **DNS not resolving**: Wait 24-48 hours for DNS propagation

### Verification Commands:
```powershell
# Test DNS resolution
nslookup enterprise.sae-g.com

# Test SSL certificate
curl -I https://enterprise.sae-g.com

# Check CloudFront status
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

## 📞 Support

If you encounter issues:
1. Check AWS CloudTrail for API call errors
2. Review CloudFront and S3 access logs
3. Use AWS Support (if you have a support plan)

---

**🎉 Once deployed, your Enterprise Architecture app will be available at:**
**https://enterprise.sae-g.com**

The deployment includes:
- ✅ HTTPS with your SSL certificate
- ✅ Global CDN via CloudFront
- ✅ SPA routing support
- ✅ Optimized caching
- ✅ Cost-effective hosting
