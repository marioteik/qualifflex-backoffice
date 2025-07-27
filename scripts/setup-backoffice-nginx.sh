#!/bin/bash

# Qualiflex Backoffice Nginx Setup Script
# This script sets up nginx to serve the React frontend at the specified domains

set -e  # Exit on any error

echo "🚀 Setting up Nginx for Qualiflex Backoffice..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create nginx configuration directory if it doesn't exist
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

# Copy nginx configuration
print_status "Setting up Nginx configuration for Backoffice..."
NGINX_CONFIG="/etc/nginx/sites-available/qualiflex-backoffice"

# Create the nginx configuration
sudo tee "$NGINX_CONFIG" > /dev/null << 'EOF'
# Nginx configuration for Qualiflex Backoffice

# Server block for EC2 domain with /backoffice path
server {
    listen 80;
    server_name ec2-54-207-116-215.sa-east-1.compute.amazonaws.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'" always;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json text/html;
    
    # Backoffice static files
    location /backoffice {
        alias /home/__USERNAME__/apps/qualiflex-backoffice/current/dist;
        
        # Try to serve request as file, then as directory, then fallback to index.html for SPA
        try_files $uri $uri/ /backoffice/index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Security headers for HTML files
        location ~* \.html$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
    
    # Handle API routes (if they exist on the same server)
    location /api {
        rewrite ^/api/(.*) /$1 break;
        
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }
    
    # Default location for root requests
    location / {
        return 301 /backoffice/;
    }
    
    access_log /var/log/nginx/qualiflex-backoffice-access.log;
    error_log /var/log/nginx/qualiflex-backoffice-error.log;
}

# Server block for custom domain
server {
    listen 80;
    server_name backoffice.qualiflex.com.br;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'" always;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json text/html;
    
    # Document root for backoffice
    root /home/__USERNAME__/apps/qualiflex-backoffice/current/dist;
    index index.html;
    
    # Handle all routes for SPA
    location / {
        try_files $uri $uri/ /index.html;
        
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires -1;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
    }
    
    # Handle preflight requests
    location ~* \.(woff|woff2|ttf|eot)$ {
        add_header Access-Control-Allow-Origin "*";
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    access_log /var/log/nginx/qualiflex-backoffice-custom-access.log;
    error_log /var/log/nginx/qualiflex-backoffice-custom-error.log;
}
EOF

# Replace username placeholder with actual username
print_status "Configuring paths for user: $USER"
sudo sed -i "s|__USERNAME__|$USER|g" "$NGINX_CONFIG"

# Enable the qualiflex-backoffice configuration
print_status "Enabling Qualiflex Backoffice configuration..."
sudo ln -sf /etc/nginx/sites-available/qualiflex-backoffice /etc/nginx/sites-enabled/

# Test nginx configuration
print_status "Testing Nginx configuration..."
if sudo nginx -t; then
    print_status "Nginx configuration is valid"
else
    print_error "Nginx configuration test failed"
    exit 1
fi

# Reload nginx
print_status "Reloading Nginx..."
sudo systemctl reload nginx

# Check if nginx is running
if sudo systemctl is-active --quiet nginx; then
    print_status "Nginx is running successfully"
else
    print_error "Nginx is not running"
    sudo systemctl status nginx
    exit 1
fi

print_status "✅ Backoffice Nginx setup complete!"
echo
echo "📋 Next steps:"
echo "1. Your backoffice should be accessible at:"
echo "   http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com/backoffice/"
echo "   http://backoffice.qualiflex.com.br/ (after DNS is configured)"
echo
echo "2. Set up DNS for backoffice.qualiflex.com.br to point to your EC2 IP"
echo
echo "3. Set up SSL certificates (recommended):"
echo "   sudo apt install certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d backoffice.qualiflex.com.br"
echo
print_status "Nginx logs location:"
echo "  - Access: /var/log/nginx/qualiflex-backoffice-access.log"
echo "  - Error: /var/log/nginx/qualiflex-backoffice-error.log"
echo "  - Custom domain: /var/log/nginx/qualiflex-backoffice-custom-access.log" 