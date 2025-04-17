output "db_credentials_secret_arn" {
  description = "ARN of the database credentials secret"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "cognito_credentials_secret_arn" {
  description = "ARN of the Cognito credentials secret"
  value       = aws_secretsmanager_secret.cognito_credentials.arn
}

output "secrets_manager_policy_arn" {
  description = "ARN of the Secrets Manager access policy"
  value       = aws_iam_policy.secrets_manager_access.arn
} 