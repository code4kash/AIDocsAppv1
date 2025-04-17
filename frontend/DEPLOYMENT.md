# Deployment Guide

This guide provides step-by-step instructions for deploying the AI Docs Assistant frontend on either Vercel or AWS.

## Prerequisites

- Node.js 20.x
- npm 9.x or later
- Git
- AWS CLI (for AWS deployment)
- Vercel CLI (for Vercel deployment)

## Environment Variables

Create a `.env.production` file with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.aidocsassistant.com
NEXT_PUBLIC_APP_NAME=AI Docs Assistant
NEXT_PUBLIC_APP_DESCRIPTION=An AI-powered document assistant
```

## Option 1: Deploying to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# Set deployment platform
export DEPLOY_PLATFORM=vercel

# Build and deploy
npm run build
vercel --prod
```

### Step 4: Configure Environment Variables
1. Go to your project settings in the Vercel dashboard
2. Navigate to the "Environment Variables" section
3. Add all variables from `.env.production`

### Step 5: Configure Custom Domain (Optional)
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Option 2: Deploying to AWS

### Step 1: Install AWS CLI
```bash
# macOS
brew install awscli

# Linux
sudo apt install awscli

# Windows
# Download from https://aws.amazon.com/cli/
```

### Step 2: Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, region, and output format
```

### Step 3: Create S3 Bucket
```bash
# Create bucket
aws s3 mb s3://aidocs-assistant-frontend

# Enable static website hosting
aws s3 website s3://aidocs-assistant-frontend --index-document index.html --error-document 404.html

# Configure bucket policy
aws s3api put-bucket-policy --bucket aidocs-assistant-frontend --policy file://bucket-policy.json
```

### Step 4: Create CloudFront Distribution
1. Go to CloudFront in AWS Console
2. Create a new distribution
3. Set origin domain to your S3 bucket
4. Configure SSL certificate
5. Set default root object to index.html
6. Note the distribution ID

### Step 5: Build and Deploy
```bash
# Set deployment platform
export DEPLOY_PLATFORM=aws

# Install dependencies
npm install

# Build the application
npm run build

# Deploy to S3
aws s3 sync .next/static s3://aidocs-assistant-frontend/_next/static
aws s3 sync public s3://aidocs-assistant-frontend/public
aws s3 cp .next/server/pages s3://aidocs-assistant-frontend/ --recursive

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Step 6: Configure Custom Domain (Optional)
1. Go to Route 53 in AWS Console
2. Create a new hosted zone for your domain
3. Create an A record pointing to your CloudFront distribution
4. Update your domain's nameservers

## CI/CD Pipeline

The project includes a GitHub Actions workflow that supports both deployment platforms. To use it:

1. Add the following secrets to your GitHub repository:
   ```bash
   # For Vercel
   VERCEL_TOKEN
   VERCEL_ORG_ID
   VERCEL_PROJECT_ID

   # For AWS
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   AWS_REGION
   S3_BUCKET_NAME
   CLOUDFRONT_DISTRIBUTION_ID
   ```

2. Set the `DEPLOY_PLATFORM` environment variable in your workflow:
   ```yaml
   env:
     DEPLOY_PLATFORM: vercel  # or 'aws'
   ```

## Monitoring and Maintenance

### Vercel
- Use Vercel Analytics for performance monitoring
- Set up error tracking in the Vercel dashboard
- Configure automatic deployments from your main branch

### AWS
- Set up CloudWatch alarms for S3 and CloudFront
- Configure CloudWatch Logs for application logs
- Set up AWS Budgets to monitor costs

## Troubleshooting

### Common Issues

#### Vercel
- **Build Fails**: Check the build logs in Vercel dashboard
- **Environment Variables**: Ensure all required variables are set
- **Custom Domain**: Verify DNS settings and SSL certificate

#### AWS
- **S3 Upload Fails**: Check IAM permissions and bucket policy
- **CloudFront Not Updating**: Create a new invalidation
- **SSL Issues**: Verify certificate configuration in CloudFront

## Rollback Procedures

### Vercel
1. Go to the Deployments tab
2. Find the previous successful deployment
3. Click "Revert to"

### AWS
```bash
# List previous versions
aws s3api list-object-versions --bucket aidocs-assistant-frontend

# Restore previous version
aws s3api restore-object --bucket aidocs-assistant-frontend --key "path/to/file" --version-id "version-id"
``` 