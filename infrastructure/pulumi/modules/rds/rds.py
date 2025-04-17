import pulumi
from pulumi import ResourceOptions
from pulumi_aws import rds, ec2, iam, kms, cloudwatch

class Rds:
    def __init__(self, name, project_name, environment, vpc_id, subnet_ids, allowed_security_groups, db_name, db_username, db_password, opts=None):
        self.name = name
        self.project_name = project_name
        self.environment = environment
        self.vpc_id = vpc_id
        self.subnet_ids = subnet_ids
        self.allowed_security_groups = allowed_security_groups
        self.db_name = db_name
        self.db_username = db_username
        self.db_password = db_password
        self.opts = opts or ResourceOptions()

        # Create DB subnet group
        self.db_subnet_group = rds.SubnetGroup(
            f"{name}-subnet-group",
            name=f"{project_name}-{environment}",
            subnet_ids=subnet_ids,
            tags={
                "Name": f"{project_name}-{environment}-db-subnet-group",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create RDS security group
        self.security_group = ec2.SecurityGroup(
            f"{name}-sg",
            vpc_id=vpc_id,
            description="Security group for RDS",
            ingress=[
                {
                    "protocol": "tcp",
                    "from_port": 5432,
                    "to_port": 5432,
                    "security_groups": allowed_security_groups
                }
            ],
            tags={
                "Name": f"{project_name}-{environment}-rds-sg",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create KMS key for RDS encryption
        self.kms_key = kms.Key(
            f"{name}-kms-key",
            description="KMS key for RDS encryption",
            deletion_window_in_days=7,
            enable_key_rotation=True,
            tags={
                "Name": f"{project_name}-{environment}-rds-kms",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create RDS monitoring role
        self.monitoring_role = iam.Role(
            f"{name}-monitoring-role",
            assume_role_policy={
                "Version": "2012-10-17",
                "Statement": [{
                    "Action": "sts:AssumeRole",
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "monitoring.rds.amazonaws.com"
                    }
                }]
            },
            tags={
                "Name": f"{project_name}-{environment}-rds-monitoring-role",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Attach RDS monitoring policy
        iam.RolePolicyAttachment(
            f"{name}-monitoring-policy",
            role=self.monitoring_role.name,
            policy_arn="arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole",
            opts=self.opts
        )

        # Create RDS instance
        self.db_instance = rds.Instance(
            f"{name}-instance",
            identifier=f"{project_name}-{environment}",
            engine="postgres",
            engine_version="14.7",
            instance_class="db.t3.medium",
            allocated_storage=20,
            storage_type="gp3",
            storage_encrypted=True,
            kms_key_id=self.kms_key.arn,
            db_name=db_name,
            username=db_username,
            password=db_password,
            port=5432,
            vpc_security_group_ids=[self.security_group.id],
            db_subnet_group_name=self.db_subnet_group.name,
            backup_retention_period=7,
            backup_window="03:00-04:00",
            maintenance_window="Mon:04:00-Mon:05:00",
            multi_az=True,
            skip_final_snapshot=False,
            final_snapshot_identifier=f"{project_name}-{environment}-final-snapshot",
            performance_insights_enabled=True,
            performance_insights_retention_period=7,
            monitoring_interval=60,
            monitoring_role_arn=self.monitoring_role.arn,
            tags={
                "Name": f"{project_name}-{environment}-rds",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create CloudWatch log group
        self.cloudwatch_log_group = cloudwatch.LogGroup(
            f"{name}-logs",
            name=f"/aws/rds/instance/{project_name}-{environment}",
            retention_in_days=30,
            tags={
                "Name": f"{project_name}-{environment}-rds-logs",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

    @property
    def db_endpoint(self):
        return self.db_instance.endpoint

    @property
    def db_instance_id(self):
        return self.db_instance.id

    @property
    def db_security_group_id(self):
        return self.security_group.id

    @property
    def kms_key_arn(self):
        return self.kms_key.arn

    @property
    def monitoring_role_arn(self):
        return self.monitoring_role.arn 