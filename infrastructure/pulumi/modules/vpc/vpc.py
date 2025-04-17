import pulumi
from pulumi import ResourceOptions
from pulumi_aws import ec2

class Vpc:
    def __init__(self, name, project_name, environment, vpc_cidr, opts=None):
        self.name = name
        self.project_name = project_name
        self.environment = environment
        self.vpc_cidr = vpc_cidr
        self.opts = opts or ResourceOptions()

        # Create VPC
        self.vpc = ec2.Vpc(
            f"{name}-vpc",
            cidr_block=vpc_cidr,
            enable_dns_hostnames=True,
            enable_dns_support=True,
            tags={
                "Name": f"{project_name}-{environment}-vpc",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create public subnets
        self.public_subnets = []
        for i in range(2):
            subnet = ec2.Subnet(
                f"{name}-public-subnet-{i}",
                vpc_id=self.vpc.id,
                cidr_block=f"10.0.{i}.0/24",
                availability_zone=f"us-east-1{chr(97 + i)}",
                map_public_ip_on_launch=True,
                tags={
                    "Name": f"{project_name}-{environment}-public-subnet-{i}",
                    "Project": project_name,
                    "Environment": environment,
                    "ManagedBy": "Pulumi"
                },
                opts=self.opts
            )
            self.public_subnets.append(subnet)

        # Create private subnets
        self.private_subnets = []
        for i in range(2):
            subnet = ec2.Subnet(
                f"{name}-private-subnet-{i}",
                vpc_id=self.vpc.id,
                cidr_block=f"10.0.{i + 2}.0/24",
                availability_zone=f"us-east-1{chr(97 + i)}",
                tags={
                    "Name": f"{project_name}-{environment}-private-subnet-{i}",
                    "Project": project_name,
                    "Environment": environment,
                    "ManagedBy": "Pulumi"
                },
                opts=self.opts
            )
            self.private_subnets.append(subnet)

        # Create Internet Gateway
        self.igw = ec2.InternetGateway(
            f"{name}-igw",
            vpc_id=self.vpc.id,
            tags={
                "Name": f"{project_name}-{environment}-igw",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create NAT Gateway
        self.nat_eip = ec2.Eip(
            f"{name}-nat-eip",
            vpc=True,
            tags={
                "Name": f"{project_name}-{environment}-nat-eip",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        self.nat_gateway = ec2.NatGateway(
            f"{name}-nat-gateway",
            allocation_id=self.nat_eip.id,
            subnet_id=self.public_subnets[0].id,
            tags={
                "Name": f"{project_name}-{environment}-nat-gateway",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Create route tables
        self.public_route_table = ec2.RouteTable(
            f"{name}-public-rt",
            vpc_id=self.vpc.id,
            routes=[
                {
                    "cidr_block": "0.0.0.0/0",
                    "gateway_id": self.igw.id
                }
            ],
            tags={
                "Name": f"{project_name}-{environment}-public-rt",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        self.private_route_table = ec2.RouteTable(
            f"{name}-private-rt",
            vpc_id=self.vpc.id,
            routes=[
                {
                    "cidr_block": "0.0.0.0/0",
                    "nat_gateway_id": self.nat_gateway.id
                }
            ],
            tags={
                "Name": f"{project_name}-{environment}-private-rt",
                "Project": project_name,
                "Environment": environment,
                "ManagedBy": "Pulumi"
            },
            opts=self.opts
        )

        # Associate route tables with subnets
        for i, subnet in enumerate(self.public_subnets):
            ec2.RouteTableAssociation(
                f"{name}-public-rt-assoc-{i}",
                subnet_id=subnet.id,
                route_table_id=self.public_route_table.id,
                opts=self.opts
            )

        for i, subnet in enumerate(self.private_subnets):
            ec2.RouteTableAssociation(
                f"{name}-private-rt-assoc-{i}",
                subnet_id=subnet.id,
                route_table_id=self.private_route_table.id,
                opts=self.opts
            )

    @property
    def vpc_id(self):
        return self.vpc.id

    @property
    def public_subnet_ids(self):
        return [subnet.id for subnet in self.public_subnets]

    @property
    def private_subnet_ids(self):
        return [subnet.id for subnet in self.private_subnets] 