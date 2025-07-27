# Qualiflex Server Configuration

This repository contains nginx configurations and deployment scripts for the complete Qualiflex application stack.

## 🏗️ Architecture Overview

The Qualiflex platform consists of three applications:

1. **Main Website** (`qualiflex.com.br`) - WordPress CMS
2. **Backoffice** (`backoffice.qualiflex.com.br`) - React application 
3. **API** (`api.qualiflex.com.br`) - Node.js REST API

All applications are served through nginx as a reverse proxy with SSL/HTTPS support.

## 📁 Project Structure

```
qualiflex-server/
├── nginx-config/
│   ├── qualiflex-main.conf      # WordPress configuration
│   ├── qualiflex-backoffice.conf # React app configuration
│   └── qualiflex-api.conf       # Node.js API configuration
├── scripts/
│   └── setup-nginx.sh           # Automated setup script
├── .github/workflows/
│   └── deploy-nginx.yml         # GitHub Actions deployment
├── docs/
│   └── README.md               # This documentation
└── README.md                   # Project overview
```

## 🚀 Quick Start

### Option 1: Automated Deployment (GitHub Actions)

1. **Fork this repository** to your GitHub account

2. **Configure repository secrets** in your GitHub repo settings:
   ```
   EC2_HOST=your-ec2-ip-address
   EC2_USERNAME=ubuntu
   EC2_SSH_KEY=your-private-ssh-key
   EC2_PORT=22
   GITHUB_TOKEN=your-github-token
   ```

3. **Run the deployment workflow**:
   - Go to Actions tab in your GitHub repository
   - Select "Deploy Nginx Configurations"
   - Click "Run workflow"
   - Choose options:
     - Target environment: production
     - Force reload: false
     - Install SSL: true (if domains are configured)

### Option 2: Manual Setup

1. **SSH into your server**:
   ```bash
   ssh ubuntu@your-ec2-server
   ```

2. **Download and run the setup script**:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/your-username/qualiflex-server/main/scripts/setup-nginx.sh -o setup-nginx.sh
   chmod +x setup-nginx.sh
   ./setup-nginx.sh --ssl
   ```

### Option 3: Manual Configuration

1. **Clone this repository on your server**:
   ```bash
   git clone https://github.com/your-username/qualiflex-server.git
   cd qualiflex-server
   ```

2. **Copy nginx configurations**:
   ```bash
   sudo cp nginx-config/*.conf /etc/nginx/sites-available/
   sudo ln -sf /etc/nginx/sites-available/qualiflex-* /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   ```

3. **Test and reload nginx**:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 🔧 Configuration Details

### Domain Mapping

| Domain | Application | Port | Directory |
|--------|-------------|------|-----------|
| `qualiflex.com.br` | WordPress | 80/443 | `/var/www/html/qualiflex` |
| `www.qualiflex.com.br` | Redirect to main | - | - |
| `backoffice.qualiflex.com.br` | React App | 80/443 | `/var/www/html/backoffice/build` |
| `api.qualiflex.com.br` | Node.js API | 3100 | Proxied to localhost:3100 |
| `ec2-*.amazonaws.com/api` | Node.js API | 3100 | Proxied to localhost:3100 |

### Security Features

- 🛡️ Security headers (XSS protection, CSRF, etc.)
- 🗜️ Gzip compression for better performance
- 🚫 Protection against common exploits
- 📝 Comprehensive logging
- ⚡ Optimized caching for static assets

### SSL/HTTPS Support

- 🔒 Let's Encrypt SSL certificates
- 🔄 Automatic certificate renewal
- 🔗 HTTP to HTTPS redirects
- 📱 Modern TLS protocols only

## 📋 Prerequisites

### Server Requirements

- Ubuntu 18.04+ (recommended: Ubuntu 20.04 or 22.04)
- At least 1GB RAM
- 10GB+ available disk space
- Root or sudo access

### Software Dependencies

The setup script will automatically install:

- **nginx** - Web server and reverse proxy
- **PHP 8.1-FPM** - For WordPress support
- **certbot** - For SSL certificate management
- **curl** - For downloading configurations

### DNS Configuration

Before running with SSL, ensure your domains point to your server:

```bash
# Check DNS resolution
nslookup qualiflex.com.br
nslookup api.qualiflex.com.br
nslookup backoffice.qualiflex.com.br
```

## 🔐 SSL Certificate Setup

### Automatic SSL Installation

Run the deployment with SSL option:

```bash
# Via GitHub Actions
Set "Install SSL" to true when running the workflow

# Via setup script
./setup-nginx.sh --ssl

# Manual certbot
sudo certbot --nginx -d qualiflex.com.br -d www.qualiflex.com.br -d api.qualiflex.com.br -d backoffice.qualiflex.com.br
```

### SSL Certificate Renewal

Certificates automatically renew via cron. Test renewal:

```bash
sudo certbot renew --dry-run
```

## 📁 Application Deployment

### WordPress (Main Website)

1. **Upload WordPress files**:
   ```bash
   # Extract WordPress to the correct directory
   sudo wget https://wordpress.org/latest.tar.gz
   sudo tar xzf latest.tar.gz
   sudo cp -R wordpress/* /var/www/html/qualiflex/
   sudo chown -R www-data:www-data /var/www/html/qualiflex
   sudo chmod -R 755 /var/www/html/qualiflex
   ```

2. **Database setup**:
   ```bash
   # Install MySQL
   sudo apt install mysql-server
   
   # Create WordPress database
   sudo mysql -e "CREATE DATABASE qualiflex_wp;"
   sudo mysql -e "CREATE USER 'wp_user'@'localhost' IDENTIFIED BY 'secure_password';"
   sudo mysql -e "GRANT ALL PRIVILEGES ON qualiflex_wp.* TO 'wp_user'@'localhost';"
   ```

3. **Configure WordPress**:
   - Visit `http://qualiflex.com.br/wp-admin/install.php`
   - Follow the WordPress installation wizard

### React Backoffice

1. **Build your React application**:
   ```bash
   # On your development machine
   npm run build
   ```

2. **Upload build files**:
   ```bash
   # Copy build files to server
   scp -r build/* ubuntu@your-server:/var/www/html/backoffice/build/
   
   # Or upload via SFTP, rsync, etc.
   ```

3. **Set correct permissions**:
   ```bash
   sudo chown -R www-data:www-data /var/www/html/backoffice
   sudo chmod -R 755 /var/www/html/backoffice
   ```

### Node.js API

1. **Deploy your API application**:
   ```bash
   # Example using PM2
   cd /home/ubuntu/apps/qualiflex-api
   npm install
   npm run build  # if using TypeScript
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

2. **Ensure API runs on port 3100**:
   ```javascript
   // In your API application
   const PORT = process.env.PORT || 3100;
   app.listen(PORT, () => {
     console.log(`API running on port ${PORT}`);
   });
   ```

## 🔍 Monitoring and Troubleshooting

### Check Service Status

```bash
# Nginx status
sudo systemctl status nginx

# PHP-FPM status
sudo systemctl status php8.1-fpm

# Check if API is running
curl http://localhost:3100/health

# Test nginx configuration
sudo nginx -t
```

### View Logs

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/qualiflex-*-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/qualiflex-*-error.log

# PHP-FPM logs
sudo tail -f /var/log/php8.1-fpm.log

# System logs
sudo journalctl -u nginx -f
```

### Common Issues

#### 502 Bad Gateway
```bash
# Check if your applications are running
sudo systemctl status nginx
sudo systemctl status php8.1-fpm
curl http://localhost:3100/  # Check API

# Restart services
sudo systemctl restart nginx
sudo systemctl restart php8.1-fpm
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test SSL configuration
openssl s_client -connect qualiflex.com.br:443
```

#### Permission Issues
```bash
# Fix file permissions
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

## 🔄 Updates and Maintenance

### Updating Nginx Configurations

1. **Via GitHub Actions**: Push changes to the repository and the workflow will automatically deploy

2. **Via Script**: Re-run the setup script:
   ```bash
   ./setup-nginx.sh --force
   ```

3. **Manual Update**:
   ```bash
   sudo cp nginx-config/qualiflex-main.conf /etc/nginx/sites-available/qualiflex-main
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Backup Strategy

```bash
# Backup nginx configurations
sudo cp -r /etc/nginx/sites-available /backup/nginx-$(date +%Y%m%d)

# Backup application files
sudo tar czf /backup/qualiflex-apps-$(date +%Y%m%d).tar.gz /var/www/html/

# Backup database (WordPress)
mysqldump -u wp_user -p qualiflex_wp > /backup/wordpress-$(date +%Y%m%d).sql
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section above
2. Review nginx and application logs
3. Create an issue in this repository
4. Contact the development team

---

**Note**: Remember to replace placeholder values (like repository URLs, IP addresses, and email addresses) with your actual values before deployment.
