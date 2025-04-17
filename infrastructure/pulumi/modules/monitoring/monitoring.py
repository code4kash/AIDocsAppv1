import pulumi
from pulumi import ResourceOptions
from pulumi_aws import cloudwatch, sns

class Monitoring:
    def __init__(self, name, project_name, environment, aws_region, alert_email, opts=None):
        self.name = name
        self.project_name = project_name
        self.environment = environment
        self.aws_region = aws_region
        self.alert_email = alert_email
        self.opts = opts or ResourceOptions()

        # Create CloudWatch dashboard
        self.dashboard = cloudwatch.Dashboard(
            f"{name}-dashboard",
            dashboard_name=f"{project_name}-{environment}-dashboard",
            dashboard_body=pulumi.Output.all(
                project_name=project_name,
                environment=environment
            ).apply(lambda args: f"""{{
                "widgets": [
                    {{
                        "type": "metric",
                        "x": 0,
                        "y": 0,
                        "width": 12,
                        "height": 6,
                        "properties": {{
                            "metrics": [
                                ["AWS/EKS", "CPUUtilization", "ClusterName", "{args['project_name']}-{args['environment']}"],
                                ["AWS/EKS", "MemoryUtilization", "ClusterName", "{args['project_name']}-{args['environment']}"]
                            ],
                            "period": 300,
                            "stat": "Average",
                            "region": "{aws_region}",
                            "title": "EKS Cluster Metrics"
                        }}
                    }},
                    {{
                        "type": "metric",
                        "x": 12,
                        "y": 0,
                        "width": 12,
                        "height": 6,
                        "properties": {{
                            "metrics": [
                                ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", "{args['project_name']}-{args['environment']}"],
                                ["AWS/RDS", "FreeStorageSpace", "DBInstanceIdentifier", "{args['project_name']}-{args['environment']}"]
                            ],
                            "period": 300,
                            "stat": "Average",
                            "region": "{aws_region}",
                            "title": "RDS Metrics"
                        }}
                    }}
                ]
            }}"""),
            opts=self.opts
        )

        # Create SNS topic for alerts
        self.sns_topic = sns.Topic(
            f"{name}-alerts",
            name=f"{project_name}-{environment}-alerts",
            tags={
                "Name": f"{project_name}-{environment}-alerts",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Subscribe to SNS topic
        self.sns_subscription = sns.TopicSubscription(
            f"{name}-email-subscription",
            topic=self.sns_topic.arn,
            protocol="email",
            endpoint=alert_email,
            opts=self.opts
        )

        # Create EKS CPU alarm
        self.eks_cpu_alarm = cloudwatch.MetricAlarm(
            f"{name}-eks-cpu",
            alarm_name=f"{project_name}-{environment}-eks-cpu",
            comparison_operator="GreaterThanThreshold",
            evaluation_periods=2,
            metric_name="CPUUtilization",
            namespace="AWS/EKS",
            period=300,
            statistic="Average",
            threshold=80,
            alarm_description="EKS cluster CPU utilization is high",
            alarm_actions=[self.sns_topic.arn],
            dimensions={
                "ClusterName": f"{project_name}-{environment}"
            },
            tags={
                "Name": f"{project_name}-{environment}-eks-cpu-alarm",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create RDS CPU alarm
        self.rds_cpu_alarm = cloudwatch.MetricAlarm(
            f"{name}-rds-cpu",
            alarm_name=f"{project_name}-{environment}-rds-cpu",
            comparison_operator="GreaterThanThreshold",
            evaluation_periods=2,
            metric_name="CPUUtilization",
            namespace="AWS/RDS",
            period=300,
            statistic="Average",
            threshold=80,
            alarm_description="RDS instance CPU utilization is high",
            alarm_actions=[self.sns_topic.arn],
            dimensions={
                "DBInstanceIdentifier": f"{project_name}-{environment}"
            },
            tags={
                "Name": f"{project_name}-{environment}-rds-cpu-alarm",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create error logs metric filter
        self.error_logs_filter = cloudwatch.LogMetricFilter(
            f"{name}-error-logs",
            name=f"{project_name}-{environment}-error-logs",
            pattern="ERROR",
            log_group_name=f"/aws/eks/{project_name}-{environment}/cluster",
            metric_transformation={
                "name": "ErrorCount",
                "namespace": "Custom",
                "value": "1"
            },
            opts=self.opts
        )

        # Create error logs alarm
        self.error_logs_alarm = cloudwatch.MetricAlarm(
            f"{name}-error-logs",
            alarm_name=f"{project_name}-{environment}-error-logs",
            comparison_operator="GreaterThanThreshold",
            evaluation_periods=1,
            metric_name="ErrorCount",
            namespace="Custom",
            period=300,
            statistic="Sum",
            threshold=0,
            alarm_description="Error logs detected in EKS cluster",
            alarm_actions=[self.sns_topic.arn],
            tags={
                "Name": f"{project_name}-{environment}-error-logs-alarm",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

    @property
    def dashboard_name(self):
        return self.dashboard.dashboard_name

    @property
    def sns_topic_arn(self):
        return self.sns_topic.arn

    @property
    def eks_cpu_alarm_arn(self):
        return self.eks_cpu_alarm.arn

    @property
    def rds_cpu_alarm_arn(self):
        return self.rds_cpu_alarm.arn

    @property
    def error_logs_alarm_arn(self):
        return self.error_logs_alarm.arn 