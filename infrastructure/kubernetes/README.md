# Kubernetes Manifests

This directory contains Kubernetes manifests for the AI Docs Assistant application.

## Directory Structure

```
kubernetes/
├── base/                    # Base manifests that can be used across all environments
│   ├── secrets/            # Secret-related manifests
│   │   ├── csi-driver.yaml
│   │   └── secrets-provider-class.yaml
│   ├── namespaces/         # Namespace definitions
│   ├── rbac/              # Role-based access control
│   └── storage/           # Storage class definitions
├── overlays/               # Environment-specific overlays
│   ├── dev/               # Development environment
│   │   ├── kustomization.yaml
│   │   ├── patches/       # Patches for dev environment
│   │   └── resources/     # Dev-specific resources
│   └── prod/              # Production environment
│       ├── kustomization.yaml
│       ├── patches/       # Patches for prod environment
│       └── resources/     # Prod-specific resources
└── components/            # Reusable components
    ├── backend/          # Backend service components
    ├── frontend/         # Frontend service components
    └── monitoring/       # Monitoring components
```

## Usage

### Development Environment

```bash
# Apply development configuration
kubectl apply -k overlays/dev
```

### Production Environment

```bash
# Apply production configuration
kubectl apply -k overlays/prod
```

## Components

### Secrets Management
- AWS Secrets Manager CSI Driver
- SecretProviderClass for database and Cognito credentials

### Namespaces
- Default namespace configuration
- Resource quotas and limits

### RBAC
- Service accounts
- Roles and role bindings
- Pod security policies

### Storage
- Storage classes
- Persistent volume claims

### Monitoring
- Prometheus configuration
- Grafana dashboards
- Alert rules
