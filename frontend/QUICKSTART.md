# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Backend API running on port 8080
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Access Application
Open browser: `http://localhost:3000`

## First Time Setup

### 1. Register Initial Admin (Backend)
Use Postman or curl:
```bash
POST http://localhost:8080/api/auth/register/initial
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123",
  "fullName": "System Administrator",
  "email": "admin@medlan.com",
  "phoneNumber": "1234567890",
  "role": "ADMIN"
}
```

### 2. Login to Frontend
- Navigate to `http://localhost:3000`
- Username: `admin`
- Password: `admin123`

### 3. Setup Master Data
1. **Create Branch** (Settings → Branches)
2. **Create Categories** (Products → Categories)
3. **Create Suppliers** (Suppliers)
4. **Create Products** (Products)
5. **Create Customers** (Customers)

### 4. Start Using
1. **Create Purchase Order** (Purchase Orders)
2. **Receive Stock via GRN** (GRN)
3. **Make Sales** (POS)

## Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home (redirects to login/dashboard) |
| `/auth/login` | Login page |
| `/dashboard` | Dashboard overview |
| `/dashboard/pos` | Point of Sale |
| `/dashboard/products` | Product management |
| `/dashboard/inventory` | Inventory tracking |
| `/dashboard/customers` | Customer management |
| `/dashboard/suppliers` | Supplier management |
| `/dashboard/sales` | Sales history |
| `/dashboard/purchase-orders` | Purchase orders |
| `/dashboard/grn` | Goods receipt |
| `/dashboard/reports` | Reports |
| `/dashboard/settings` | Settings |
| `/dashboard/stock-transfer` | Stock transfer |

## Common Tasks

### Add a Product
1. Go to Products
2. Click "Add Product"
3. Fill in details
4. Save

### Make a Sale
1. Go to POS
2. Search product
3. Add to cart
4. Select customer (optional)
5. Choose payment method
6. Complete sale

### Receive Stock
1. Go to GRN
2. Click "Receive Stock"
3. Select supplier
4. Add items with batch details
5. Create GRN
6. Approve to update inventory

## Troubleshooting

### API Connection Issues
- Check backend is running on port 8080
- Verify `.env.local` has correct API URL
- Check browser console for errors

### Login Issues
- Ensure initial admin is registered
- Check credentials
- Clear browser cache/localStorage

### Build Issues
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Development Tips

### Hot Reload
- Changes auto-reload in dev mode
- No need to restart server

### TypeScript
- All types defined in `src/types/index.ts`
- Use TypeScript for type safety

### API Services
- All API calls in `src/lib/services.ts`
- Reuse service functions

### Components
- UI components in `src/components/ui/`
- Reusable across pages

## Support

For issues or questions, refer to:
- `IMPLEMENTATION.md` - Full documentation
- `API_GUIDE.md` - Backend API reference
- Backend logs for API errors

---

**Happy coding! 🎉**
