# Qualiflex Backoffice

## Development

```bash
npm install
npm run dev
```

## Building for Different Environments

### For EC2 Sub-path Deployment (`/backoffice`)

```bash
VITE_BASE_PATH="/backoffice/" npm run build
```

This is used for: `http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com/backoffice`

### For Custom Domain Deployment (`/`)

```bash
VITE_BASE_PATH="/" npm run build
```

This would be used for: `http://backoffice.qualiflex.com.br` (root path)

## Deployment

The GitHub Actions workflow automatically builds with the correct base path for the EC2 sub-path deployment.

## Troubleshooting

### Asset Loading Issues (404s, MIME type errors)

If you see errors like:

- `Failed to load resource: 404 (Not Found)` for CSS/JS files
- `MIME type ('text/html') is not a supported stylesheet MIME type`

This indicates the base path is incorrectly configured. Make sure:

1. `VITE_BASE_PATH` environment variable matches your deployment path
2. Nginx configuration serves files from the correct location
3. The build was created with the right base path
