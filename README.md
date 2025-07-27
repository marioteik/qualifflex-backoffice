# Qualiflex Backoffice & API 🚀

A modern full-stack application for managing qualiflex operations with automated deployment to AWS EC2.

## 🏗️ Project Structure

```
qualiflex/
├── qualiflex-backoffice/          # React + TypeScript frontend
│   ├── src/                       # Frontend source code
│   ├── public/                    # Static assets
│   └── dist/                      # Built frontend
│
├── qualiflex-api/                 # Node.js backend API
│   ├── src/                       # API source code
│   ├── schedules/                 # Background jobs
│   ├── dist/                      # Built API
│   ├── .github/workflows/         # CI/CD pipelines
│   └── docs/                      # 📚 Deployment documentation
│
└── README.md                      # This file
```

## 🚀 Quick Start

### Frontend (React + Vite + TypeScript)

```bash
cd qualiflex-backoffice
npm install
npm run dev          # Start development server
npm run build        # Build for production
```

### Backend API (Node.js + Hono)

```bash
cd qualiflex-api
npm install
npm run dev          # Start development server
npm run build        # Build for production
```

## 🔧 Technology Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling

### Backend

- **Node.js** - Runtime
- **Hono** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database
- **PM2** - Process manager

### Infrastructure

- **AWS EC2** - Server hosting
- **GitHub Actions** - CI/CD
- **Supabase** - Database & Auth

## 📚 Documentation

### 🚀 Deployment & DevOps

**📁 [Complete Deployment Documentation](./qualiflex-api/docs/README.md)**

**Quick Links:**

- **[⚡ Quick Start Guide](./qualiflex-api/docs/README_DEPLOYMENT.md)** - Get deployment running in 15 minutes
- **[📋 Deployment Checklist](./qualiflex-api/docs/DEPLOYMENT_CHECKLIST.md)** - Step-by-step setup
- **[🔐 GitHub Secrets Setup](./qualiflex-api/docs/GITHUB_SECRETS_SETUP.md)** - Environment variables
- **[🔧 SSH Troubleshooting](./qualiflex-api/docs/SSH_TROUBLESHOOTING.md)** - Fix connection issues

### 🛠️ Development Guides

- **[Frontend Development](#frontend-development)** - React + Vite setup
- **[Backend Development](#backend-development)** - API development
- **[Database Setup](#database-setup)** - Drizzle ORM configuration

## 🚀 Deployment

This project features **fully automated deployment** to AWS EC2:

### ✅ What's Automated

- 🔄 **Build & Test** - Automatically builds on every push
- 🚀 **Deploy to EC2** - Zero-downtime deployment via SSH
- 🔐 **Environment Variables** - Secure management via GitHub secrets
- 📊 **Process Management** - PM2 handles app lifecycle
- 🔍 **Health Checks** - Verifies successful deployment
- ↩️ **Auto Rollback** - Reverts on deployment failure

### 🎯 Deploy Now

1. **Set up GitHub secrets** - [Follow this guide](./qualiflex-api/docs/GITHUB_SECRETS_SETUP.md)
2. **Push to main branch** - Deployment starts automatically
3. **Monitor progress** - Check GitHub Actions tab

## 🔧 Development

### Frontend Development

This frontend uses React + TypeScript + Vite with modern tooling:

```bash
cd qualiflex-backoffice
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Key Features:**

- ⚡ **Hot Module Replacement** - Instant updates during development
- 📦 **Optimized Builds** - Vite handles bundling and optimization
- 🎯 **TypeScript** - Full type safety
- 🎨 **Tailwind CSS** - Utility-first styling

### Backend Development

The API uses modern Node.js with TypeScript:

```bash
cd qualiflex-api
npm run dev          # Start dev server with auto-reload
npm run build        # Build TypeScript to JavaScript (includes sync-shipments)
npm run db:gen       # Generate database migrations
npm run db:run       # Run database migrations

# Background jobs
npm run seed-shipments        # Run sync-shipments (development)
npm run seed-shipments:build  # Run sync-shipments (built version)
```

**Key Features:**

- 🚀 **Hono Framework** - Fast, lightweight web framework
- 📊 **Drizzle ORM** - Type-safe database operations
- 🔐 **Supabase Integration** - Authentication and database
- ⏰ **Background Jobs** - Compiled scheduled tasks with PM2
- 📝 **API Documentation** - Auto-generated Swagger docs
- 🔍 **Health Monitoring** - Built-in health check endpoint
- 🔧 **Production Ready** - Optimized builds with zero TypeScript runtime dependencies

### API Endpoints

**Health Check:**
```bash
# Check API health and status
curl http://localhost:3100/health

# Response includes:
# - Server status
# - Uptime
# - Memory usage  
# - Environment info
```

**Core API Routes:**
- `GET /` - Welcome message
- `GET /health` - Health check endpoint
- `POST /api/auth/*` - Authentication routes
- `GET /api/users/*` - User management
- `GET /api/shipments/*` - Shipment tracking
- `GET /api/orders/*` - Order management
- And more... (see API documentation)

### Database Setup

Using Drizzle ORM with PostgreSQL (Supabase):

```bash
# Generate migrations after schema changes
npm run db:gen

# Apply migrations to database
npm run db:run

# Seed database with sample data
npm run db:seed
```

## 🔍 Monitoring & Debugging

### Production Monitoring

```bash
# SSH into EC2 server
ssh ubuntu@YOUR_EC2_IP

# Check application status
pm2 status

# Test API health
curl http://localhost:3100/health

# View logs
pm2 logs qualiflex-api
pm2 logs shipments-sync

# Real-time monitoring
pm2 monit
```

**Health Endpoint Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-26T21:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production",
  "port": 3100,
  "memory": {
    "used": "45 MB",
    "total": "128 MB"
  }
}
```

### Development Debugging

- **Frontend**: Browser DevTools + React DevTools
- **Backend**: Node.js debugging + VS Code integration
- **Database**: Drizzle Studio for database inspection

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📝 License

This project is proprietary software for Qualiflex operations.

## 🆘 Support

- **📚 [Full Deployment Documentation](./qualiflex-api/docs/README.md)**
- **🔧 [Troubleshooting Guides](./qualiflex-api/docs/SSH_TROUBLESHOOTING.md)**
- **💬 Issues**: Create a GitHub issue for bug reports
- **🚀 Deployments**: Check GitHub Actions for deployment status

---

**🎉 Ready to deploy?** Start with the [Quick Deployment Guide](./qualiflex-api/docs/README_DEPLOYMENT.md)!
