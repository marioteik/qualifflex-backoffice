# Qualiflex Backoffice

## Development

### Setup Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_DOMAIN=http://localhost:3100
VITE_BASE_PATH=/
```

### Start Development Server

```bash
npm install
npm run dev
```

## Building for Different Environments

### For EC2 Sub-path Deployment (`/backoffice`)

```bash
VITE_BASE_PATH="/backoffice/" VITE_API_DOMAIN="http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com" npm run build
```

This is used for: `http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com/backoffice`

- **Vite**: Sets `base: "/backoffice/"` for asset paths
- **React Router**: Sets `basename: "/backoffice"` for client-side routing
- **API Client**: Points to `http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com` for API calls

### For Custom Domain Deployment (`/`)

```bash
VITE_BASE_PATH="/" VITE_API_DOMAIN="http://api.qualiflex.com.br" npm run build
```

This would be used for: `http://backoffice.qualiflex.com.br` (root path)

- **Vite**: Sets `base: "/"` for asset paths
- **React Router**: Sets `basename: ""` for client-side routing
- **API Client**: Points to `http://api.qualiflex.com.br` for API calls

## Deployment

### GitHub Actions Variables

Configure these variables in your repository settings under `Settings > Secrets and variables > Actions > Variables`:

| Variable          | Description                  | Example Value                                               |
| ----------------- | ---------------------------- | ----------------------------------------------------------- |
| `VITE_BASE_PATH`  | Base path for asset loading  | `/backoffice/`                                              |
| `VITE_API_DOMAIN` | API domain for backend calls | `http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com` |

### Setting Up GitHub Actions Variables

1. Go to your repository on GitHub
2. Navigate to `Settings > Secrets and variables > Actions`
3. Click on the `Variables` tab
4. Click `New repository variable`
5. Add the following variables:

**For EC2 Sub-path Deployment:**

```
VITE_BASE_PATH = /backoffice/
VITE_API_DOMAIN = http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com
```

**For Custom Domain Deployment:**

```
VITE_BASE_PATH = /
VITE_API_DOMAIN = http://api.qualiflex.com.br
```

The GitHub Actions workflow automatically creates a `.env` file from these variables during deployment.

**Default Values:** If variables are not set, the workflow uses these defaults:

- `VITE_BASE_PATH`: `/backoffice/`
- `VITE_API_DOMAIN`: `http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com`

### Verifying Variables Are Set

You can verify your variables are configured correctly by:

1. **Check Repository Variables**: Go to `Settings > Secrets and variables > Actions > Variables`
2. **Check GitHub Actions Logs**: Look for the "Create environment file" step output
3. **Variable Names**: Ensure variable names are **exactly** as shown (case-sensitive)

**Common Issues:**

- ❌ Variable name typos (e.g., `VITE_BASE_PATH` vs `VITE_BASEPATH`)
- ❌ Variables set as Secrets instead of Variables
- ❌ Variables set in different repository
- ❌ Incorrect variable values (missing trailing slash, wrong protocol)

## Troubleshooting

### Asset Loading Issues (404s, MIME type errors)

If you see errors like:

- `Failed to load resource: 404 (Not Found)` for CSS/JS files
- `MIME type ('text/html') is not a supported stylesheet MIME type`

This indicates the base path is incorrectly configured. **Debug steps:**

1. **Check GitHub Actions Logs**:

   - Look for "Create environment file" step
   - Verify VITE_BASE_PATH value is displayed correctly
   - Check "Build application" step shows correct asset paths in index.html

2. **Verify GitHub Variables**:

   - Ensure `VITE_BASE_PATH` is set to `/backoffice/` (with trailing slash)
   - Variable must be in **Variables** tab, not Secrets
   - Check variable name is exactly `VITE_BASE_PATH` (case-sensitive)

3. **Check Built Assets**:

   - Assets should be referenced as `/backoffice/assets/...` in index.html
   - If showing `/assets/...` the base path wasn't applied

4. **Nginx Configuration**:
   - Verify nginx serves files from correct location
   - Check permissions are set correctly

### React Router Issues (404s on page refresh, wrong URLs)

If you see:

- 404 errors when refreshing pages
- Routes not working correctly
- Links going to wrong URLs

This indicates React Router's basename is not properly configured:

1. Ensure `VITE_BASE_PATH` is set correctly during build
2. Check that React Router's `basename` matches your deployment path
3. For `/backoffice` deployment: basename should be `/backoffice` (no trailing slash)
4. For root deployment: basename should be `""` (empty string)

### API Connection Issues (calls to localhost:3100 or wrong domain)

If you see API requests going to:

- `http://127.0.0.1:3100` or `http://localhost:3100` in production
- Wrong API domain

This indicates `VITE_API_DOMAIN` is not properly configured:

1. **Check GitHub Actions Variables**: Ensure `VITE_API_DOMAIN` is set in repository variables
2. **Verify Build Process**: Check the workflow creates the `.env` file correctly
3. **For EC2 deployment**: `VITE_API_DOMAIN="http://ec2-54-207-116-215.sa-east-1.compute.amazonaws.com"`
4. **For custom domain**: `VITE_API_DOMAIN="http://api.qualiflex.com.br"`
5. **For local development**: Create `.env.local` with `VITE_API_DOMAIN="http://localhost:3100"`
