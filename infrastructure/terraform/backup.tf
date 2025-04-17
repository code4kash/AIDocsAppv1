resource "aws_backup_vault" "aidocs_backup_vault" {
  name = "aidocs-backup-vault"
  tags = var.tags
}

resource "aws_backup_plan" "aidocs_backup_plan" {
  name = "aidocs-backup-plan"

  rule {
    rule_name         = "daily_backup"
    target_vault_name = aws_backup_vault.aidocs_backup_vault.name
    schedule          = "cron(0 5 ? * * *)" # Daily at 5 AM UTC

    lifecycle {
      delete_after = 30 # Keep backups for 30 days
    }
  }

  rule {
    rule_name         = "weekly_backup"
    target_vault_name = aws_backup_vault.aidocs_backup_vault.name
    schedule          = "cron(0 5 ? * SUN *)" # Weekly on Sunday at 5 AM UTC

    lifecycle {
      delete_after = 90 # Keep weekly backups for 90 days
    }
  }

  tags = var.tags
}

resource "aws_backup_selection" "aidocs_backup_selection" {
  name         = "aidocs-backup-selection"
  plan_id      = aws_backup_plan.aidocs_backup_plan.id
  iam_role_arn = aws_iam_role.backup_role.arn

  resources = [
    aws_db_instance.postgres.arn
  ]
}

resource "aws_iam_role" "backup_role" {
  name = "aidocs-backup-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "backup_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
  role       = aws_iam_role.backup_role.name
}

resource "aws_iam_role_policy_attachment" "restore_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForRestores"
  role       = aws_iam_role.backup_role.name
} 