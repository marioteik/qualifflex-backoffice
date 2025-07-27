#!/bin/bash
# Qualiflex Integrated Nginx Setup Script (WordPress + API + Backoffice)
# This script replaces individual configurations to avoid conflicts

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo -e "${GREEN}🚀 Setting up Integrated Nginx for Qualiflex (WordPress + API + Backoffice)...${NC}"

# Create nginx configuration directory if it doesn't exist
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

# Disable existing individual configurations to avoid conflicts
print_status "Disabling individual configurations to avoid conflicts..."
sudo rm -f /etc/nginx/sites-enabled/qualiflex-api
sudo rm -f /etc/nginx/sites-enabled/qualiflex-backoffice

# Copy integrated nginx configuration
print_status "Setting up Integrated Nginx configuration..."
NGINX_CONFIG="/etc/nginx/sites-available/qualiflex-integrated"

# Create the nginx configuration
sudo tee "$NGINX_CONFIG" > /dev/null << 'EOF'
# Integrated Nginx configuration for Qualiflex (WordPress + API + Backoffice)
# This file should be placed in /etc/nginx/sites-available/ on your EC2 server
# It handles: / = WordPress, /api = Node.js API, /backoffice = React App

# Increase server names hash bucket size for long domain names
server_names_hash_bucket_size 128;

# Upstream definition for the Node.js API application
upstream qualiflex_api {
    server 127.0.0.1:3100;
    keepalive 32;
}

# Main server block for EC2 domain (handles WordPress + API + Backoffice)
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
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # API routes - proxy to Node.js application
    location /api {
        # Remove /api prefix when forwarding to Node.js app
        rewrite ^/api/(.*) /$1 break;
        
        # Proxy to Node.js application
        proxy_pass http://qualiflex_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
    
    # Redirect /backoffice (without slash) to /backoffice/
    location = /backoffice {
        return 301 /backoffice/;
    }
    
    # Backoffice static files
    location /backoffice/ {
        alias /home/__USERNAME__/apps/qualiflex-backoffice/current/dist/;
        index index.html;
        
        # Try to serve the file, then directory, then fallback to index.html for SPA
        try_files $uri $uri/ /backoffice/index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            
            # CORS headers for assets
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
        }
        
        # Security headers for HTML files
        location ~* \.html$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
    
    # Health check endpoint for API
    location /health {
        proxy_pass http://qualiflex_api/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        access_log off;
    }
    
    # WordPress at root (to be configured when WordPress is installed)
    location / {
        # Placeholder for WordPress configuration
        # When WordPress is installed, this should proxy to WordPress or serve WordPress files
        # For now, serve a simple message or 404
        try_files $uri $uri/ =404;
        
        # Temporary: Return information about available services
        location = / {
            return 200 "Available services:\n/api - Qualiflex API\n/backoffice - Qualiflex Backoffice\n/ - WordPress (coming soon)";
            add_header Content-Type text/plain;
        }
    }
    
    # Logging
    access_log /var/log/nginx/qualiflex-integrated-access.log;
    error_log /var/log/nginx/qualiflex-integrated-error.log;
}

# Server block for API custom domain
server {
    listen 80;
    server_name api.qualiflex.com.br;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # For API custom domain, proxy all requests directly to the app
    location / {
        proxy_pass http://qualiflex_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
    
    # Logging
    access_log /var/log/nginx/qualiflex-api-custom-access.log;
    error_log /var/log/nginx/qualiflex-api-custom-error.log;
}

# Server block for Backoffice custom domain
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
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Document root for backoffice
    root /home/__USERNAME__/apps/qualiflex-backoffice/current/dist;
    index index.html;
    
    # Handle all routes for SPA
    location / {
        # Try to serve request as file, then as directory, then fallback to index.html
        try_files $uri $uri/ /index.html;
        
        # Security headers for HTML files
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires -1;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # CORS headers for fonts and assets
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
    
    # Logging
    access_log /var/log/nginx/qualiflex-backoffice-custom-access.log;
    error_log /var/log/nginx/qualiflex-backoffice-custom-error.log;
}
EOF

# Replace username placeholder with actual username
print_status "Configuring paths for user: $USER"
sudo sed -i "s|__USERNAME__|$USER|g" "$NGINX_CONFIG"

# Fix permissions for nginx to access the backoffice files
print_status "Setting up proper permissions for nginx access..."
if [ -d "/home/$USER/apps/qualiflex-backoffice/current/dist" ]; then
    # Make home directory accessible to nginx (needed for path traversal)
    sudo chmod 755 /home/$USER
    # Make apps directory accessible
    sudo chmod 755 /home/$USER/apps
    # Make qualiflex-backoffice directory accessible
    sudo chmod 755 /home/$USER/apps/qualiflex-backoffice
    # Make current directory accessible
    sudo chmod 755 /home/$USER/apps/qualiflex-backoffice/current
    # Make dist directory accessible and set proper permissions
    sudo chmod 755 /home/$USER/apps/qualiflex-backoffice/current/dist
    # Ensure all files are readable
    sudo find /home/$USER/apps/qualiflex-backoffice/current/dist -type f -exec chmod 644 {} \;
    # Ensure all directories are accessible
    sudo find /home/$USER/apps/qualiflex-backoffice/current/dist -type d -exec chmod 755 {} \;
    print_success "Permissions set correctly for nginx access"
else
    print_warning "Backoffice dist directory not found, permissions will be set during deployment"
fi

# Enable the integrated configuration
print_status "Enabling Qualiflex Integrated configuration..."
sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/qualiflex-integrated

# Test nginx configuration
print_status "Testing Nginx configuration..."
if sudo nginx -t; then
    print_success "Nginx configuration test passed!"
else
    print_error "Nginx configuration test failed"
    exit 1
fi

# Start and enable Nginx
print_status "Starting and enabling Nginx..."
sudo systemctl enable nginx || true
sudo systemctl start nginx || true

# Reload nginx configuration
print_status "Reloading Nginx configuration..."
if sudo systemctl reload nginx; then
    print_success "Nginx configuration reloaded successfully!"
else
    print_error "Failed to reload Nginx configuration"
    exit 1
fi

print_success "✅ Integrated Nginx setup completed successfully!"
echo
echo -e "${GREEN}🌐 Your services are now available at:${NC}"
echo -e "  ${BLUE}•${NC} Root: http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com/ (WordPress placeholder)"
echo -e "  ${BLUE}•${NC} API: http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com/api"
echo -e "  ${BLUE}•${NC} Backoffice: http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com/backoffice"
echo -e "  ${BLUE}•${NC} Health Check: http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com/health"
echo
echo -e "${YELLOW}📝 Custom domains (after DNS setup):${NC}"
echo -e "  ${BLUE}•${NC} API: http://api.qualiflex.com.br"
echo -e "  ${BLUE}•${NC} Backoffice: http://backoffice.qualiflex.com.br"
echo
print_warning "Note: When you install WordPress, update the root location block in $NGINX_CONFIG" 