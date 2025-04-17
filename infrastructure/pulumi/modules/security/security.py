import pulumi
from pulumi import ResourceOptions
from pulumi_aws import ec2, iam, wafv2, cloudwatch

class Security:
    def __init__(self, name, project_name, environment, vpc_id, allowed_cidr_blocks, opts=None):
        self.name = name
        self.project_name = project_name
        self.environment = environment
        self.vpc_id = vpc_id
        self.allowed_cidr_blocks = allowed_cidr_blocks
        self.opts = opts or ResourceOptions()

        # Create EKS node security group
        self.eks_node_security_group = ec2.SecurityGroup(
            f"{name}-eks-node-sg",
            vpc_id=vpc_id,
            description="Security group for EKS nodes",
            ingress=[
                {
                    "protocol": "-1",
                    "from_port": 0,
                    "to_port": 0,
                    "cidr_blocks": allowed_cidr_blocks
                }
            ],
            egress=[
                {
                    "protocol": "-1",
                    "from_port": 0,
                    "to_port": 0,
                    "cidr_blocks": ["0.0.0.0/0"]
                }
            ],
            tags={
                "Name": f"{project_name}-{environment}-eks-node-sg",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create EKS node IAM role
        self.eks_node_role = iam.Role(
            f"{name}-eks-node-role",
            assume_role_policy={
                "Version": "2012-10-17",
                "Statement": [{
                    "Action": "sts:AssumeRole",
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "ec2.amazonaws.com"
                    }
                }]
            },
            tags={
                "Name": f"{project_name}-{environment}-eks-node-role",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Attach EKS node policy
        iam.RolePolicyAttachment(
            f"{name}-eks-node-policy",
            role=self.eks_node_role.name,
            policy_arn="arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
            opts=self.opts
        )

        # Attach EKS CNI policy
        iam.RolePolicyAttachment(
            f"{name}-eks-cni-policy",
            role=self.eks_node_role.name,
            policy_arn="arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
            opts=self.opts
        )

        # Attach EC2 container registry policy
        iam.RolePolicyAttachment(
            f"{name}-ecr-policy",
            role=self.eks_node_role.name,
            policy_arn="arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
            opts=self.opts
        )

        # Create WAF web ACL
        self.waf_web_acl = wafv2.WebAcl(
            f"{name}-waf-acl",
            scope="REGIONAL",
            default_action={
                "allow": {}
            },
            visibility_config={
                "cloudwatch_metrics_enabled": True,
                "metric_name": f"{project_name}-{environment}-waf",
                "sampled_requests_enabled": True
            },
            rules=[
                {
                    "name": "RateLimit",
                    "priority": 1,
                    "action": {
                        "block": {}
                    },
                    "statement": {
                        "rate_based_statement": {
                            "limit": 2000,
                            "aggregate_key_type": "IP"
                        }
                    },
                    "visibility_config": {
                        "cloudwatch_metrics_enabled": True,
                        "metric_name": f"{project_name}-{environment}-rate-limit",
                        "sampled_requests_enabled": True
                    }
                }
            ],
            tags={
                "Name": f"{project_name}-{environment}-waf-acl",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create CloudWatch log group
        self.cloudwatch_log_group = cloudwatch.LogGroup(
            f"{name}-logs",
            name=f"/aws/eks/{project_name}-{environment}/cluster",
            retention_in_days=30,
            tags={
                "Name": f"{project_name}-{environment}-logs",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

    @property
    def eks_node_security_group_id(self):
        return self.eks_node_security_group.id

    @property
    def eks_node_iam_role_arn(self):
        return self.eks_node_role.arn

    @property
    def cloudwatch_log_group_name(self):
        return self.cloudwatch_log_group.name

    @property
    def waf_web_acl_id(self):
        return self.waf_web_acl.id 