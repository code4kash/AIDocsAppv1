#!/bin/bash

# Configuration
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="aidocs_assistant"
DB_USER="postgres"
DB_HOST="localhost"
S3_BUCKET="aidocs-assistant-backups"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Database backup
echo "Starting database backup..."
pg_dump -h $DB_HOST -U $DB_USER -F c -b -v -f "$BACKUP_DIR/db_$TIMESTAMP.dump" $DB_NAME

# File backup
echo "Starting file backup..."
tar -czf "$BACKUP_DIR/files_$TIMESTAMP.tar.gz" /app/uploads

# Upload to S3
echo "Uploading backups to S3..."
aws s3 cp "$BACKUP_DIR/db_$TIMESTAMP.dump" "s3://$S3_BUCKET/database/"
aws s3 cp "$BACKUP_DIR/files_$TIMESTAMP.tar.gz" "s3://$S3_BUCKET/files/"

# Clean up old backups
echo "Cleaning up old backups..."
find $BACKUP_DIR -type f -mtime +$RETENTION_DAYS -delete
aws s3 ls "s3://$S3_BUCKET/database/" | awk '{print $4}' | sort -r | tail -n +$((RETENTION_DAYS + 1)) | while read -r file; do
  aws s3 rm "s3://$S3_BUCKET/database/$file"
done
aws s3 ls "s3://$S3_BUCKET/files/" | awk '{print $4}' | sort -r | tail -n +$((RETENTION_DAYS + 1)) | while read -r file; do
  aws s3 rm "s3://$S3_BUCKET/files/$file"
done

echo "Backup completed successfully!" 