# 🏥 MedLan Pharmacy - Quick Start Guide

## ✅ Installation Complete!

All dependencies installed successfully. Your modern pharmacy management frontend is ready.

## 🚀 Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 📋 First Time Setup

1. **Start Backend Server** (Port 8080)
   - Ensure PostgreSQL is running
   - Start Spring Boot backend

2. **Register Initial Admin**
   - Backend endpoint: `POST /api/auth/register/initial`
   - Or use the backend's initial setup

3. **Login to Frontend**
   - Navigate to `http://localhost:5173/login`
   - Username: `admin`
   - Password: `admin123`

4. **Create Your First Branch**
   - Go to Branches page
   - Click "Add Branch"
   - Fill in branch details
   - Select the branch to activate it

5. **Start Using the System**
   - Add products, categories
   - Register customers and suppliers
   - Create purchase orders
   - Use POS for sales

## 🎯 Key Features

### Dashboard
- Real-time sales metrics
- Low stock alerts
- Expiring products
- Quick actions

### POS (Point of Sale)
- Fast product search
- Cart management
- Multiple payment methods
- Customer selection
- Real-time inventory updates

### Inventory Management
- Stock levels by branch
- Low stock alerts
- Out of stock tracking
- Batch management
- Expiry tracking

### Product Management
- Complete CRUD operations
- Category management
- Pricing and margins
- Stock levels
- Search and filter

### Customer & Supplier Management
- Contact information
- Transaction history
- Credit limits
- Active/Inactive status

### Purchase Orders & GRN
- Create purchase orders
- Approve workflow
- Goods receipt notes
- Automatic inventory updates

## 🎨 Design System

- **Primary Color**: Blue (#3B82F6)
- **Success**: Green
- **Warning**: Orange
- **Danger**: Red
- **Typography**: System fonts
- **Spacing**: Tailwind scale (4px base)

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly buttons
- Optimized tables for small screens

## 🔧 Tech Stack

- React 18.3.1
- React Router 7.1.1
- TanStack Query 5.62.11
- Zustand 5.0.2
- Tailwind CSS 3.4.17
- Vite 6.0.5
- Axios 1.7.9
- Lucide React (Icons)
- Sonner (Toasts)

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Table.jsx
│   │   ├── Badge.jsx
│   │   └── Tabs.jsx
│   └── Layout.jsx       # Main layout with navigation
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── POSPage.jsx
│   ├── ProductsPage.jsx
│   ├── InventoryPage.jsx
│   ├── CustomersPage.jsx
│   ├── SuppliersPage.jsx
│   └── BranchesPage.jsx
├── services/
│   ├── auth.js          # Authentication API
│   └── api.js           # All other APIs
├── store/
│   └── index.js         # Zustand stores
├── lib/
│   ├── api.js           # Axios instance
│   └── utils.js         # Utility functions
└── App.jsx              # Main app with routing
```

## 🔐 Authentication Flow

1. User enters credentials
2. Frontend calls `/api/auth/login`
3. Backend returns JWT token
4. Token stored in localStorage
5. Token added to all API requests via interceptor
6. Auto-redirect to login on 401 errors

## 💾 State Management

### Global State (Zustand)
- User authentication
- Selected branch
- Persisted in localStorage

### Server State (React Query)
- API data caching
- Automatic refetching
- Optimistic updates
- Error handling

## 🎯 Best Practices Implemented

✅ Clean, minimal code
✅ Component reusability
✅ Proper error handling
✅ Loading states
✅ Optimistic UI updates
✅ Responsive design
✅ Accessibility considerations
✅ Performance optimizations
✅ Type-safe API calls
✅ Centralized API layer

## 🚨 Common Issues

### Backend Connection Error
- Check if backend is running on port 8080
- Verify `.env` file has correct API URL
- Check CORS configuration in backend

### Login Failed
- Ensure initial admin user is created
- Check credentials
- Verify backend database connection

### Branch Not Selected
- Go to Branches page
- Click "Select" on a branch
- Branch selection persists in localStorage

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎓 Next Steps

1. Customize theme colors in `tailwind.config.js`
2. Add more pages as needed
3. Implement additional features
4. Configure production environment
5. Set up CI/CD pipeline

## 💡 Pro Tips

- Use React Query DevTools for debugging
- Check browser console for API errors
- Use the search functionality extensively
- Select a branch before using inventory features
- POS page is optimized for quick sales

---

**Built with ❤️ using modern React best practices**
