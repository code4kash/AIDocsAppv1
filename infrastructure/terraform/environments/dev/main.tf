module "vpc" {
  source = "../../modules/vpc"

  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  project_name       = var.project_name
  tags               = var.tags
}

module "eks" {
  source = "../../modules/eks"

  cluster_name        = var.eks_cluster_name
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  project_name        = var.project_name
  tags                = var.tags
}

module "rds" {
  source = "../../modules/rds"

  project_name            = var.project_name
  vpc_id                  = module.vpc.vpc_id
  private_subnet_ids      = module.vpc.private_subnet_ids
  allowed_security_groups = [module.eks.cluster_security_group_id]
  instance_class          = var.rds_instance_class
  allocated_storage       = var.rds_allocated_storage
  engine_version          = var.rds_engine_version
  db_name                 = var.db_name
  db_username             = var.db_username
  db_password             = var.db_password
  tags                    = var.tags
}

module "s3" {
  source = "../../modules/s3"

  project_name = var.project_name
  environment  = var.environment
  tags         = var.tags
}

module "cognito" {
  source = "../../modules/cognito"

  user_pool_name = var.cognito_user_pool_name
  project_name   = var.project_name
  environment    = var.environment
  tags           = var.tags
}

module "secrets_manager" {
  source = "../../modules/secrets-manager"

  project_name           = var.project_name
  db_username           = var.db_username
  db_password           = var.db_password
  db_endpoint           = module.rds.db_instance_endpoint
  db_name               = var.db_name
  cognito_user_pool_id  = module.cognito.user_pool_id
  cognito_client_id     = module.cognito.user_pool_client_id
  cognito_client_secret = module.cognito.user_pool_client_secret
  cognito_domain        = module.cognito.user_pool_domain
  eks_node_role_name    = module.eks.node_role_name
  tags                  = var.tags
} 