variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "aidocs-assistant"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
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

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "aidocs_assistant"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "aidocs_assistant"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "cognito_user_pool_name" {
  description = "Cognito user pool name"
  type        = string
  default     = "aidocs-assistant-users"
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Environment = "dev"
    Project     = "aidocs-assistant"
    ManagedBy   = "terraform"
  }
} 