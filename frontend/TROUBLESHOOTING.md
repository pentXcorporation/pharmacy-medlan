# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. Cannot Connect to Backend

**Symptoms:**
- Login fails with network error
- API calls timeout
- "Network Error" in console

**Solutions:**
```bash
# Check if backend is running
curl http://localhost:8080/actuator/health

# Verify .env file
cat .env
# Should show: VITE_API_URL=http://localhost:8080

# Check CORS configuration in backend
# Ensure backend allows http://localhost:5173
```

---

### 2. Login Fails

**Symptoms:**
- "Invalid credentials" error
- 401 Unauthorized

**Solutions:**
1. Ensure initial admin user is created in backend
2. Check username/password (default: admin/admin123)
3. Verify backend database connection
4. Check backend logs for authentication errors

```bash
# Test login via curl
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

### 3. White Screen / App Won't Load

**Symptoms:**
- Blank page
- Console errors about modules

**Solutions:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear browser cache
# Chrome: Ctrl+Shift+Delete

# Check for JavaScript errors in console
# F12 -> Console tab
```

---

### 4. Branch Not Selected Error

**Symptoms:**
- "Please select a branch" message
- Inventory/POS not working

**Solutions:**
1. Go to Branches page
2. Click "Select" button on a branch
3. Branch selection persists in localStorage
4. Refresh page to verify

---

### 5. Products Not Showing in POS

**Symptoms:**
- Search returns no results
- Products exist but don't appear

**Solutions:**
1. Ensure products are marked as active
2. Check if products have stock in selected branch
3. Verify product search API is working
4. Check browser console for errors

---

### 6. Styling Issues / Tailwind Not Working

**Symptoms:**
- No styles applied
- Components look broken

**Solutions:**
```bash
# Rebuild Tailwind
npm run build

# Check if PostCSS is configured
cat postcss.config.js

# Verify Tailwind config
cat tailwind.config.js

# Restart dev server
npm run dev
```

---

### 7. React Query Errors

**Symptoms:**
- "Query failed" errors
- Data not loading

**Solutions:**
1. Check network tab for failed requests
2. Verify API endpoints are correct
3. Check if token is expired (logout and login again)
4. Clear React Query cache (refresh page)

---

### 8. Token Expired

**Symptoms:**
- Automatic logout
- 401 errors after some time

**Solutions:**
- This is normal behavior (24-hour token expiry)
- Simply login again
- Token refresh can be implemented if needed

---

### 9. Build Fails

**Symptoms:**
- `npm run build` errors
- TypeScript/ESLint errors

**Solutions:**
```bash
# Fix ESLint errors
npm run lint

# Check for syntax errors
# Review error messages carefully

# Update dependencies
npm update

# Clear cache and rebuild
rm -rf dist
npm run build
```

---

### 10. Slow Performance

**Symptoms:**
- Laggy UI
- Slow page loads

**Solutions:**
1. Check network tab for slow API calls
2. Reduce page size in pagination
3. Clear browser cache
4. Check React DevTools for unnecessary re-renders
5. Verify backend performance

---

## Debug Mode

### Enable React Query DevTools

Add to `App.jsx`:
```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Inside QueryClientProvider
<ReactQueryDevtools initialIsOpen={false} />
```

### Check API Calls

```javascript
// In browser console
localStorage.getItem('token')  // Check token
localStorage.getItem('user')   // Check user data
localStorage.getItem('selectedBranch')  // Check branch
```

### Network Debugging

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Check request/response for each API call

---

## Environment Issues

### Development vs Production

```bash
# Development
npm run dev
# Uses .env file

# Production
npm run build
# Uses .env.production file
```

### Port Conflicts

```bash
# If port 5173 is in use
# Vite will automatically use next available port
# Or specify in vite.config.js:

export default {
  server: {
    port: 3000
  }
}
```

---

## Database Issues

If backend has database issues:

1. Check PostgreSQL is running
2. Verify database exists: `medlan_pharmacy`
3. Check backend application.properties
4. Run backend migrations if needed

---

## Browser Compatibility

Tested on:
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Edge 120+
- ✅ Safari 17+

If issues on older browsers:
- Update browser to latest version
- Check console for polyfill errors

---

## Getting Help

1. **Check Console**: F12 -> Console tab
2. **Check Network**: F12 -> Network tab
3. **Check Backend Logs**: Spring Boot console
4. **Review Documentation**: README.md, QUICKSTART.md
5. **Check API Guide**: backend/API_TESTING_GUIDE.md

---

## Reset Everything

If all else fails:

```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json dist
npm install
npm run dev

# Clear browser data
# Chrome: Settings -> Privacy -> Clear browsing data
# Select: Cookies, Cache, Local Storage

# Backend
# Restart Spring Boot application
# Check database connection
```

---

## Logs to Check

### Frontend
- Browser Console (F12)
- Network tab for API calls
- React DevTools for component issues

### Backend
- Spring Boot console output
- Application logs
- Database logs

---

## Performance Monitoring

```javascript
// Add to App.jsx for performance tracking
if (import.meta.env.DEV) {
  console.log('Performance:', performance.now())
}
```

---

## Still Having Issues?

1. Verify all prerequisites are met
2. Check that backend is running and accessible
3. Ensure database is properly configured
4. Review error messages carefully
5. Check API_TESTING_GUIDE.md for backend testing

---

**Most issues are related to backend connectivity or missing initial setup. Always check backend first!**
