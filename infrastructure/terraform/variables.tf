variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment (e.g., dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "aidocs-assistant"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "allowed_cidr_blocks" {
  description = "List of CIDR blocks allowed to access the infrastructure"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "aidocs_assistant"
}

variable "db_username" {
  description = "Username for the database"
  type        = string
  default     = "aidocs_admin"
}

variable "db_password" {
  description = "Password for the database"
  type        = string
  sensitive   = true
}

variable "alert_email" {
  description = "Email address for receiving alerts"
  type        = string
}

variable "eks_cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "aidocs-assistant-eks"
}

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "rds_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "rds_engine_version" {
  description = "RDS PostgreSQL engine version"
  type        = string
  default     = "15.4"
}

variable "cognito_user_pool_name" {
  description = "Cognito user pool name"
  type        = string
  default     = "aidocs-assistant-users"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "AIDocsAssistant"
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}
