# OFO Platform - Git Repository Management Guide

## Repository Structure

### Main Repositories
```
OFO-backend-platforms/     → Platforms layer (infrastructure services)
OFO-backend-Services/      → Microservices (business logic)
OFO-Config-Repo/           → Configuration management
OFO-frontend/              → Frontend application
```

### Platform Services (Submodules)
- `OFO-eureka-server`      → Service Discovery
- `OFO-Config-server`      → Centralized Configuration
- `OFO-api-gateway`        → API Gateway

### Microservices (Submodules)
- `OFO-order-service`      → Borrowing Service
- `OFO-restaurant-service` → Inventory Service
- `OFO-user-service`       → User Service

---

## Setup Instructions

### 1. Clone Main Repositories

```bash
cd ~/Documents/Cloud/Cloud_Final_Project_M

# Clone platforms
git clone https://github.com/malithrashmika/OFO-backend-platforms.git bitespeed-platform

# Clone services
git clone https://github.com/malithrashmika/OFO-backend-Services.git bitespeed-services

# Clone config
git clone https://github.com/malithrashmika/OFO-Config-Repo.git bitespeed-config-repo

# Clone frontend
git clone https://github.com/malithrashmika/OFO-frontend.git frontend
```

### 2. Initialize Submodules (Platforms)

```bash
cd bitespeed-platform

# Add eureka-server submodule
git submodule add https://github.com/malithrashmika/OFO-eureka-server.git eureka-server

# Add config-server submodule
git submodule add https://github.com/malithrashmika/OFO-Config-server.git config-server

# Add api-gateway submodule
git submodule add https://github.com/malithrashmika/OFO-api-gateway.git api-gateway
```

### 3. Initialize Submodules (Services)

```bash
cd ../bitespeed-services

# Add borrowing-service (order-service) submodule
git submodule add https://github.com/malithrashmika/OFO-order-service.git borrowing-service

# Add inventory-service (restaurant-service) submodule
git submodule add https://github.com/malithrashmika/OFO-restaurant-service.git inventory-service

# Add user-service submodule
git submodule add https://github.com/malithrashmika/OFO-user-service.git user-service
```

---

## Common Git Operations

### Cloning with Submodules

```bash
# Clone and initialize all submodules
git clone --recurse-submodules https://github.com/malithrashmika/OFO-backend-platforms.git

# If already cloned, initialize submodules
git submodule update --init --recursive
```

### Updating Submodules

```bash
# Update all submodules to latest
git submodule update --remote --recursive

# Update specific submodule
cd <submodule-path>
git pull origin main
cd ..
git add <submodule-path>
git commit -m "Update <submodule-name>"
```

### Pushing Changes

```bash
# From submodule directory
cd <submodule-path>
git add .
git commit -m "Your commit message"
git push origin main

# From parent directory
git add <submodule-path>
git commit -m "Update submodule reference"
git push origin main
```

### Status Check

```bash
# Check all submodules status
git submodule foreach 'echo "=== $(pwd) ===" && git status'

# Check for uncommitted changes
git status
git submodule foreach git status
```

---

## Workflow Best Practices

### 1. **Making Changes in Submodules**
```bash
# Go to submodule directory
cd bitespeed-platform/eureka-server

# Create and switch to feature branch
git checkout -b feature/your-feature

# Make changes, commit, and push
git add .
git commit -m "feat: description"
git push origin feature/your-feature

# Create Pull Request on GitHub
```

### 2. **Updating Parent Repository**
```bash
# After submodule changes are merged
cd ..
git add eureka-server
git commit -m "chore: update eureka-server to latest"
git push origin main
```

### 3. **Syncing All Changes Locally**
```bash
# From root directory
git pull origin main
git submodule update --init --recursive
```

---

## Useful Aliases

Add to `.gitconfig`:

```bash
[alias]
    st-all = "!git status && git submodule foreach 'echo && git status'"
    pull-all = "!git pull && git submodule update --init --recursive"
    push-all = "!git push && git submodule foreach 'git push origin $(git rev-parse --abbrev-ref HEAD)'"
```

---

## Troubleshooting

### Submodule Shows "Not a git repository"
```bash
git submodule deinit -f <submodule-path>
git rm -f <submodule-path>
git submodule add https://github.com/... <submodule-path>
git submodule update --init --recursive
```

### Submodule is Detached HEAD
```bash
cd <submodule-path>
git checkout main
git pull origin main
cd ..
git add <submodule-path>
git commit -m "Fix detached HEAD in submodule"
```

### Merge Conflicts in Submodule References
```bash
# Resolve manually in parent repo
git add <submodule-path>
git commit -m "Resolve submodule conflict"
git push
```

---

## CI/CD Integration

Consider adding GitHub Actions workflows for:
- Building all services
- Running tests
- Publishing artifacts
- Deploying to cloud

---

## Quick Reference

| Task | Command |
|------|---------|
| Clone all recursively | `git clone --recurse-submodules <repo-url>` |
| Initialize submodules | `git submodule update --init --recursive` |
| Update all submodules | `git submodule update --remote --recursive` |
| Check status | `git submodule foreach git status` |
| Commit submodule change | `git add <path> && git commit -m "msg"` |
| Push to submodule | `cd <path> && git push origin <branch>` |

