output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "eks_cluster_id" {
  description = "ID of the EKS cluster"
  value       = module.eks.cluster_id
}

output "eks_cluster_endpoint" {
  description = "Endpoint of the EKS cluster"
  value       = module.eks.cluster_endpoint
}

output "rds_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = module.rds.db_endpoint
}

output "eks_node_security_group_id" {
  description = "ID of the EKS node security group"
  value       = module.security.eks_node_security_group_id
}

output "eks_node_iam_role_arn" {
  description = "ARN of the EKS node IAM role"
  value       = module.security.eks_node_iam_role_arn
}

output "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch log group"
  value       = module.security.cloudwatch_log_group_name
}

output "waf_web_acl_id" {
  description = "ID of the WAF web ACL"
  value       = module.security.waf_web_acl_id
}
