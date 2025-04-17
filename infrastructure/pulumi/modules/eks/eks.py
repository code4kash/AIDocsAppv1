import pulumi
from pulumi import ResourceOptions
from pulumi_aws import eks, ec2, iam, kms, cloudwatch

class Eks:
    def __init__(self, name, project_name, environment, vpc_id, subnet_ids, eks_node_iam_role_arn, opts=None):
        self.name = name
        self.project_name = project_name
        self.environment = environment
        self.vpc_id = vpc_id
        self.subnet_ids = subnet_ids
        self.eks_node_iam_role_arn = eks_node_iam_role_arn
        self.opts = opts or ResourceOptions()

        # Create EKS cluster security group
        self.cluster_security_group = ec2.SecurityGroup(
            f"{name}-cluster-sg",
            vpc_id=vpc_id,
            description="Security group for EKS cluster",
            egress=[
                {
                    "protocol": "-1",
                    "from_port": 0,
                    "to_port": 0,
                    "cidr_blocks": ["0.0.0.0/0"]
                }
            ],
            tags={
                "Name": f"{project_name}-{environment}-eks-cluster-sg",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create EKS cluster IAM role
        self.cluster_role = iam.Role(
            f"{name}-cluster-role",
            assume_role_policy={
                "Version": "2012-10-17",
                "Statement": [{
                    "Action": "sts:AssumeRole",
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "eks.amazonaws.com"
                    }
                }]
            },
            tags={
                "Name": f"{project_name}-{environment}-eks-cluster-role",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Attach EKS cluster policy
        iam.RolePolicyAttachment(
            f"{name}-cluster-policy",
            role=self.cluster_role.name,
            policy_arn="arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
            opts=self.opts
        )

        # Create KMS key for EKS encryption
        self.kms_key = kms.Key(
            f"{name}-kms-key",
            description="KMS key for EKS cluster encryption",
            deletion_window_in_days=7,
            enable_key_rotation=True,
            tags={
                "Name": f"{project_name}-{environment}-eks-kms",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create EKS cluster
        self.cluster = eks.Cluster(
            f"{name}-cluster",
            name=f"{project_name}-{environment}",
            role_arn=self.cluster_role.arn,
            version="1.28",
            vpc_config={
                "subnet_ids": subnet_ids,
                "security_group_ids": [self.cluster_security_group.id],
                "endpoint_private_access": True,
                "endpoint_public_access": True
            },
            enabled_cluster_log_types=[
                "api",
                "audit",
                "authenticator",
                "controllerManager",
                "scheduler"
            ],
            encryption_config={
                "provider": {
                    "key_arn": self.kms_key.arn
                },
                "resources": ["secrets"]
            },
            tags={
                "Name": f"{project_name}-{environment}-eks-cluster",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create EKS node group
        self.node_group = eks.NodeGroup(
            f"{name}-node-group",
            cluster_name=self.cluster.name,
            node_group_name=f"{project_name}-{environment}-ng",
            node_role_arn=eks_node_iam_role_arn,
            subnet_ids=subnet_ids,
            scaling_config={
                "desired_size": 3,
                "max_size": 6,
                "min_size": 3
            },
            instance_types=["t3.medium"],
            update_config={
                "max_unavailable": 1
            },
            tags={
                "Name": f"{project_name}-{environment}-eks-node-group",
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
                "Name": f"{project_name}-{environment}-eks-logs",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

    @property
    def cluster_id(self):
        return self.cluster.id

    @property
    def cluster_name(self):
        return self.cluster.name

    @property
    def cluster_endpoint(self):
        return self.cluster.endpoint

    @property
    def cluster_certificate_authority_data(self):
        return self.cluster.certificate_authority.data

    @property
    def cluster_security_group_id(self):
        return self.cluster_security_group.id 