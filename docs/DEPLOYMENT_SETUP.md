# Qualiflex Full Stack Deployment Guide

This guide explains how to deploy both the **Qualiflex API** and **Qualiflex Backoffice** applications to your EC2 server with nginx configuration.

## 🎯 Overview

After completing this setup, you'll have:

- **API** accessible at:

  - `http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com/api/*`
  - `http://api.qualiflex.com.br/*`

- **Backoffice** accessible at:
  - `http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com/backoffice/`
  - `http://backoffice.qualiflex.com.br/`

## 🚀 Deployment Methods

### Option 1: GitHub Actions (Recommended)

Both applications have GitHub Actions workflows that automatically build and deploy to your EC2 server.

#### For API (qualiflex-api):

1. Your existing workflow `.github/workflows/deploy.yml` handles API deployment
2. Push changes to trigger automatic deployment

#### For Backoffice (qualiflex-backoffice):

1. New workflow `.github/workflows/deploy.yml` handles frontend deployment
2. Builds the React/Vite application and deploys static files

#### Required GitHub Secrets

Make sure these secrets are configured in **both repositories**:

| Secret Name    | Description                  | Example                                     |
| -------------- | ---------------------------- | ------------------------------------------- |
| `EC2_HOST`     | Your EC2 public IP or domain | `54.207.116.215` or `ec2-54-207-116-215...` |
| `EC2_USERNAME` | SSH username                 | `ubuntu` or `ec2-user`                      |
| `EC2_SSH_KEY`  | Private SSH key content      | Contents of your `.pem` file                |
| `EC2_PORT`     | SSH port (optional)          | `22` (default)                              |

### Option 2: Manual Deployment

#### Deploy API:

```bash
# Clone and build API
git clone https://github.com/your-username/qualiflex-api.git
cd qualiflex-api
npm ci && npm run build

# Copy to server and setup PM2 (follow existing API deployment docs)
```

#### Deploy Backoffice:

```bash
# Clone and build Backoffice
git clone https://github.com/your-username/qualiflex-backoffice.git
cd qualiflex-backoffice
npm ci && npm run build

# Copy dist/ folder to server
scp -r dist/ ubuntu@your-ec2-ip:/home/ubuntu/apps/qualiflex-backoffice/current/
```

## 🌐 Nginx Configuration Options

You have two nginx configuration options:

### Option A: Integrated Configuration (Recommended)

Use `qualiflex-integrated.conf` to handle both API and Backoffice in a single configuration file.

**Advantages:**

- No conflicts between configurations
- Cleaner setup
- Better performance

**Disadvantages:**

- Both applications on same server block

### Option B: Separate Configurations

Use individual configuration files:

- `qualiflex-api.conf` (from API repository)
- `backoffice.conf` (from Backoffice repository)

**Advantages:**

- Independent configurations
- Easier to manage separately

**Disadvantages:**

- Potential conflicts if not configured properly
- More complex setup

## 🔧 Setup Instructions

### Step 1: Choose Your Configuration

**For Integrated Setup (Recommended):**

```bash
# On your EC2 server
sudo cp /home/ubuntu/apps/qualiflex-backoffice/current/nginx-config/qualiflex-integrated.conf /etc/nginx/sites-available/

# Remove any existing individual configurations
sudo rm -f /etc/nginx/sites-enabled/qualiflex-api
sudo rm -f /etc/nginx/sites-enabled/qualiflex-backoffice

# Enable integrated configuration
sudo ln -sf /etc/nginx/sites-available/qualiflex-integrated.conf /etc/nginx/sites-enabled/
```

**For Separate Setup:**

```bash
# On your EC2 server
sudo cp /home/ubuntu/apps/qualiflex-api/current/nginx-config/qualiflex-api.conf /etc/nginx/sites-available/
sudo cp /home/ubuntu/apps/qualiflex-backoffice/current/nginx-config/backoffice.conf /etc/nginx/sites-available/

# Enable both configurations
sudo ln -sf /etc/nginx/sites-available/qualiflex-api.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/backoffice.conf /etc/nginx/sites-enabled/
```

### Step 2: Test and Reload Nginx

```bash
# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### Step 3: Verify Deployment

```bash
# Test API
curl http://localhost/api/health

# Test Backoffice
curl http://localhost/backoffice/

# Test custom domains (after DNS setup)
curl http://api.qualiflex.com.br/health
curl http://backoffice.qualiflex.com.br/
```

## 🌍 DNS Configuration

To use custom domains, configure DNS records:

### For `api.qualiflex.com.br`:

- **Type**: A
- **Name**: api
- **Value**: `54.207.116.215` (your EC2 IP)
- **TTL**: 300

### For `backoffice.qualiflex.com.br`:

- **Type**: A
- **Name**: backoffice
- **Value**: `54.207.116.215` (your EC2 IP)
- **TTL**: 300

## 🔒 SSL/HTTPS Setup

After DNS configuration, set up SSL certificates:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificates for both domains
sudo certbot --nginx -d api.qualiflex.com.br -d backoffice.qualiflex.com.br

# Verify auto-renewal
sudo certbot renew --dry-run
```

## 📂 File Structure on Server

After deployment, your server structure will be:

```
/home/ubuntu/apps/
├── qualiflex-api/
│   ├── current/           # API application
│   ├── backup/           # Previous API version
│   └── logs/             # PM2 logs
└── qualiflex-backoffice/
    ├── current/
    │   ├── dist/         # Built frontend files
    │   ├── nginx-config/ # Nginx configurations
    │   └── scripts/      # Setup scripts
    └── backup/           # Previous frontend version
```

## 🔍 Troubleshooting

### Common Issues

1. **502 Bad Gateway on API routes:**

   ```bash
   # Check if API is running
   pm2 status
   pm2 restart qualiflex-api
   ```

2. **404 on Backoffice routes:**

   ```bash
   # Check if files exist
   ls -la /home/ubuntu/apps/qualiflex-backoffice/current/dist/

   # Check nginx configuration
   sudo nginx -t
   ```

3. **CSS/JS files not loading:**

   ```bash
   # Check file permissions
   sudo chown -R ubuntu:ubuntu /home/ubuntu/apps/qualiflex-backoffice/current/dist/
   sudo chmod -R 644 /home/ubuntu/apps/qualiflex-backoffice/current/dist/
   ```

4. **Server name conflicts:**
   ```bash
   # Use integrated configuration instead
   sudo rm /etc/nginx/sites-enabled/qualiflex-api
   sudo rm /etc/nginx/sites-enabled/qualiflex-backoffice
   sudo ln -sf /etc/nginx/sites-available/qualiflex-integrated.conf /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

### Logs

Check these log files for debugging:

```bash
# Nginx logs
sudo tail -f /var/log/nginx/qualiflex-integrated-access.log
sudo tail -f /var/log/nginx/qualiflex-integrated-error.log

# API logs (PM2)
pm2 logs qualiflex-api

# Nginx test
sudo nginx -t
```

## 🎯 URL Reference

### Development/Testing URLs:

- **API Health**: `http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com/api/health`
- **Backoffice**: `http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com/backoffice/`

### Production URLs (after DNS):

- **API**: `http://api.qualiflex.com.br/`
- **Backoffice**: `http://backoffice.qualiflex.com.br/`

### HTTPS URLs (after SSL):

- **API**: `https://api.qualiflex.com.br/`
- **Backoffice**: `https://backoffice.qualiflex.com.br/`

---

## 🎉 Quick Start

For immediate deployment:

1. **Deploy both applications** via GitHub Actions
2. **Use integrated nginx config**: Copy `qualiflex-integrated.conf` to `/etc/nginx/sites-available/`
3. **Enable configuration**: `sudo ln -sf /etc/nginx/sites-available/qualiflex-integrated.conf /etc/nginx/sites-enabled/`
4. **Test and reload**: `sudo nginx -t && sudo systemctl reload nginx`
5. **Configure DNS** for custom domains
6. **Setup SSL** with Let's Encrypt

Your full-stack application will be ready to use!
