resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${var.project_name}-db-credentials"
  description = "Database credentials for ${var.project_name}"

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-db-credentials"
    }
  )
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = var.db_username
    password = var.db_password
    host     = var.db_endpoint
    port     = 5432
    database = var.db_name
  })
}

resource "aws_secretsmanager_secret" "cognito_credentials" {
  name        = "${var.project_name}-cognito-credentials"
  description = "Cognito credentials for ${var.project_name}"

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-cognito-credentials"
    }
  )
}

resource "aws_secretsmanager_secret_version" "cognito_credentials" {
  secret_id = aws_secretsmanager_secret.cognito_credentials.id
  secret_string = jsonencode({
    user_pool_id     = var.cognito_user_pool_id
    client_id        = var.cognito_client_id
    client_secret    = var.cognito_client_secret
    domain           = var.cognito_domain
  })
}

resource "aws_secretsmanager_secret" "ai_service_config" {
  name        = "${var.project_name}-ai-service-config"
  description = "AI service configuration for ${var.project_name}"

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-ai-service-config"
    }
  )
}

resource "aws_secretsmanager_secret_version" "ai_service_config" {
  secret_id = aws_secretsmanager_secret.ai_service_config.id
  secret_string = jsonencode({
    provider    = "bedrock"
    model_id    = var.bedrock_model_id
    region      = var.aws_region
  })
}

resource "aws_secretsmanager_secret" "email_credentials" {
  name        = "${var.project_name}-email-credentials"
  description = "Email service credentials for ${var.project_name}"

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-email-credentials"
    }
  )
}

resource "aws_secretsmanager_secret_version" "email_credentials" {
  secret_id = aws_secretsmanager_secret.email_credentials.id
  secret_string = jsonencode({
    smtp_host     = var.smtp_host
    smtp_port     = var.smtp_port
    smtp_username = var.smtp_username
    smtp_password = var.smtp_password
  })
}

# IAM policy for EKS to access Secrets Manager and Bedrock
resource "aws_iam_policy" "secrets_manager_access" {
  name        = "${var.project_name}-secrets-manager-access"
  description = "Policy for EKS to access Secrets Manager and Bedrock"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          aws_secretsmanager_secret.db_credentials.arn,
          aws_secretsmanager_secret.cognito_credentials.arn,
          aws_secretsmanager_secret.ai_service_config.arn,
          aws_secretsmanager_secret.email_credentials.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:ListFoundationModels"
        ]
        Resource = ["*"]
      }
    ]
  })
}

# Attach the policy to the EKS node role
resource "aws_iam_role_policy_attachment" "secrets_manager_access" {
  role       = var.eks_node_role_name
  policy_arn = aws_iam_policy.secrets_manager_access.arn
} 