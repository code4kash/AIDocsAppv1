# Infrastructure

This directory contains the infrastructure code for the AI Docs Assistant application.

## Directory Structure

```
infrastructure/
├── terraform/                 # Terraform configurations
│   ├── modules/              # Reusable Terraform modules
│   │   ├── vpc/             # VPC module
│   │   ├── eks/             # EKS module
│   │   ├── rds/             # RDS module
│   │   ├── s3/              # S3 module
│   │   └── cognito/         # Cognito module
│   └── environments/        # Environment-specific configurations
│       └── dev/            # Development environment
├── pulumi/                  # Pulumi configurations
└── kubernetes/             # Kubernetes manifests
```

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform installed
- Pulumi installed
- kubectl installed
- AWS IAM user with appropriate permissions

## Usage

### Terraform

1. Navigate to the environment directory:
   ```bash
   cd terraform/environments/dev
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Plan the infrastructure:
   ```bash
   terraform plan
   ```

4. Apply the infrastructure:
   ```bash
   terraform apply
   ```

5. Destroy the infrastructure:
   ```bash
   terraform destroy
   ```

### Pulumi

1. Navigate to the Pulumi directory:
   ```bash
   cd pulumi
   ```

2. Initialize Pulumi:
   ```bash
   pulumi stack init dev
   ```

3. Deploy the infrastructure:
   ```bash
   pulumi up
   ```

4. Destroy the infrastructure:
   ```bash
   pulumi destroy
   ```

## Infrastructure Components

- **VPC**: Virtual Private Cloud with public and private subnets
- **EKS**: Elastic Kubernetes Service cluster
- **RDS**: PostgreSQL database
- **S3**: Object storage for files
- **Cognito**: User authentication and authorization

## Security

- All resources are tagged for cost tracking
- Security groups are configured with minimal access
- Encryption is enabled for all resources
- IAM roles follow the principle of least privilege

## Monitoring

- CloudWatch metrics and alarms
- Prometheus and Grafana for Kubernetes monitoring
- Fluent Bit for log aggregation

## Cost Optimization

- Use of t3.micro instances where possible
- S3 intelligent tiering
- Spot instances for non-critical workloads
- Auto-scaling for EKS nodes

## Maintenance

- Regular backups of RDS
- Automated patching of EKS nodes
- Regular security scanning
- Cost optimization reviews
