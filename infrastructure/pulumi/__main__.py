import pulumi
from pulumi_aws import Provider
from pulumi_aws.config import region
from modules.vpc import Vpc
from modules.security import Security
from modules.eks import Eks
from modules.rds import Rds
from modules.monitoring import Monitoring

# Configuration
config = pulumi.Config()
project_name = config.require("projectName")
environment = config.require("environment")
vpc_cidr = config.require("vpcCidr")
allowed_cidr_blocks = config.require_object("allowedCidrBlocks")
db_name = config.require("dbName")
db_username = config.require("dbUsername")
db_password = config.require_secret("dbPassword")
alert_email = config.require("alertEmail")

# AWS Provider
aws_provider = Provider("aws", region=region)

# VPC
vpc = Vpc(
    "vpc",
    project_name=project_name,
    environment=environment,
    vpc_cidr=vpc_cidr,
    opts=pulumi.ResourceOptions(provider=aws_provider)
)

# Security
security = Security(
    "security",
    project_name=project_name,
    environment=environment,
    vpc_id=vpc.vpc_id,
    allowed_cidr_blocks=allowed_cidr_blocks,
    opts=pulumi.ResourceOptions(provider=aws_provider)
)

# EKS
eks = Eks(
    "eks",
    project_name=project_name,
    environment=environment,
    vpc_id=vpc.vpc_id,
    subnet_ids=vpc.private_subnet_ids,
    eks_node_iam_role_arn=security.eks_node_iam_role_arn,
    opts=pulumi.ResourceOptions(provider=aws_provider)
)

# RDS
rds = Rds(
    "rds",
    project_name=project_name,
    environment=environment,
    vpc_id=vpc.vpc_id,
    subnet_ids=vpc.private_subnet_ids,
    allowed_security_groups=[eks.cluster_security_group_id],
    db_name=db_name,
    db_username=db_username,
    db_password=db_password,
    opts=pulumi.ResourceOptions(provider=aws_provider)
)

# Monitoring
monitoring = Monitoring(
    "monitoring",
    project_name=project_name,
    environment=environment,
    aws_region=region,
    alert_email=alert_email,
    opts=pulumi.ResourceOptions(provider=aws_provider)
)

# Exports
pulumi.export("vpc_id", vpc.vpc_id)
pulumi.export("eks_cluster_id", eks.cluster_id)
pulumi.export("eks_cluster_endpoint", eks.cluster_endpoint)
pulumi.export("rds_endpoint", rds.db_endpoint)
pulumi.export("eks_node_security_group_id", security.eks_node_security_group_id)
pulumi.export("eks_node_iam_role_arn", security.eks_node_iam_role_arn)
pulumi.export("cloudwatch_log_group_name", security.cloudwatch_log_group_name)
pulumi.export("waf_web_acl_id", security.waf_web_acl_id)
