# 🚀 Deployment Guide

## Production Build

```bash
npm run build
```

Output will be in `dist/` directory.

## Environment Variables

### Development (.env)
```
VITE_API_URL=http://localhost:8080
```

### Production (.env.production)
```
VITE_API_URL=https://api.yourdomain.com
```

## Deployment Options

### 1. Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### 2. Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 3. AWS S3 + CloudFront
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### 4. Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Performance Optimization

- ✅ Code splitting implemented
- ✅ Lazy loading for routes
- ✅ Image optimization
- ✅ Minification and compression
- ✅ Tree shaking enabled

## Security Checklist

- [ ] Enable HTTPS
- [ ] Set secure headers
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable CSP headers
- [ ] Regular dependency updates

## Monitoring

Consider adding:
- Sentry for error tracking
- Google Analytics for usage
- LogRocket for session replay
- Performance monitoring tools
