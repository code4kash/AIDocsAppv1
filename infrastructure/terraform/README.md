# AIDocs Assistant Infrastructure

This directory contains the Terraform configuration for the AIDocs Assistant infrastructure.

## Architecture

The infrastructure consists of the following components:

- **VPC**: Virtual Private Cloud with public and private subnets
- **EKS**: Managed Kubernetes cluster for running containerized applications
- **RDS**: PostgreSQL database for data storage
- **Security**: Security groups, IAM roles, and WAF rules
- **Monitoring**: CloudWatch dashboards and alarms

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform 1.0.0 or later
- kubectl for Kubernetes management

## Deployment

1. Initialize Terraform:
   ```bash
   terraform init
   ```

2. Review the planned changes:
   ```bash
   terraform plan
   ```

3. Apply the changes:
   ```bash
   terraform apply
   ```

## Configuration

The infrastructure can be configured through the following variables:

- `aws_region`: AWS region to deploy resources (default: us-east-1)
- `environment`: Environment name (default: prod)
- `project_name`: Name of the project (default: aidocs-assistant)
- `vpc_cidr`: CIDR block for the VPC (default: 10.0.0.0/16)
- `db_name`: Name of the database (default: aidocs_assistant)
- `db_username`: Username for the database (default: aidocs_admin)
- `db_password`: Password for the database
- `alert_email`: Email address for receiving alerts

## Security

- All resources are encrypted at rest
- Network access is restricted to specific CIDR blocks
- IAM roles follow the principle of least privilege
- WAF rules protect against common web attacks

## Monitoring

- CloudWatch dashboards for EKS and RDS metrics
- Alarms for CPU utilization and error logs
- Email notifications for critical events

## Disaster Recovery

- RDS automated backups with 7-day retention
- Multi-AZ deployment for high availability
- Final snapshot before resource deletion

## Maintenance

- Regular security updates through AWS managed services
- Automated backups and monitoring
- Infrastructure as Code for consistent deployments

## Troubleshooting

Common issues and solutions:

1. **EKS Cluster Issues**:
   - Check CloudWatch logs for error messages
   - Verify IAM roles and permissions
   - Ensure sufficient capacity in node groups

2. **RDS Issues**:
   - Monitor CPU and storage metrics
   - Check security group rules
   - Review backup status

3. **Network Issues**:
   - Verify VPC configuration
   - Check security group rules
   - Ensure proper routing tables

## Support

For support, please contact the infrastructure team or create an issue in the repository.
