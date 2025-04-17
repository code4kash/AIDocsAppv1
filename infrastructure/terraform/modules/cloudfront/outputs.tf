output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.id
}

output "cloudfront_origin_access_identity_iam_arn" {
  description = "IAM ARN of the CloudFront origin access identity"
  value       = aws_cloudfront_origin_access_identity.main.iam_arn
} 