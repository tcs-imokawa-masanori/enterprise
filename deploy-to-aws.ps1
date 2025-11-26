# AWS Deployment Script for Enterprise Architecture App
# Configure these variables for your setup
$DOMAIN_NAME = "enterprise.sae-g.com"
$BUCKET_NAME = "enterprise-sae-g-com"
$CERTIFICATE_ARN = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/YOUR_CERT_ID"
$HOSTED_ZONE_ID = "YOUR_HOSTED_ZONE_ID"

Write-Host "🚀 Deploying Enterprise Architecture App to AWS..." -ForegroundColor Green

# Step 1: Create S3 Bucket for Static Website
Write-Host "📦 Creating S3 bucket..." -ForegroundColor Yellow
aws s3 mb s3://$BUCKET_NAME --region us-east-1

# Step 2: Configure bucket for static website hosting
Write-Host "🌐 Configuring static website hosting..." -ForegroundColor Yellow
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Step 3: Upload built files
Write-Host "📤 Uploading files to S3..." -ForegroundColor Yellow
aws s3 sync .\dist s3://$BUCKET_NAME --delete --cache-control "max-age=31536000" --exclude "*.html"
aws s3 sync .\dist s3://$BUCKET_NAME --delete --cache-control "max-age=0" --include "*.html"

# Step 4: Create bucket policy for public read access
$bucketPolicy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
"@

$bucketPolicy | Out-File -FilePath "bucket-policy.json" -Encoding utf8
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

Write-Host "✅ S3 deployment complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update CERTIFICATE_ARN in this script with your ACM certificate ARN" -ForegroundColor White
Write-Host "2. Update HOSTED_ZONE_ID with your Route 53 hosted zone ID" -ForegroundColor White
Write-Host "3. Run the CloudFront and Route 53 setup (see cloudfront-setup.json)" -ForegroundColor White
Write-Host "4. Your app will be available at: https://$DOMAIN_NAME" -ForegroundColor White

# Clean up
Remove-Item "bucket-policy.json" -Force
