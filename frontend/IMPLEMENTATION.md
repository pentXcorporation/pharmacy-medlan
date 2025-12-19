# 🏥 MedLan Pharmacy Management System - Frontend

A modern, clean, and developer-friendly pharmacy management system built with Next.js 14, TypeScript, shadcn/ui, and Axios.

## 🚀 Features Implemented

### ✅ Core Modules

1. **Authentication**
   - Login with JWT token management
   - Auto token refresh
   - Protected routes

2. **Dashboard**
   - Real-time statistics
   - Sales overview
   - Low stock alerts
   - Expiring items tracking

3. **POS (Point of Sale)**
   - Product search
   - Cart management
   - Multiple payment methods
   - Customer selection
   - Real-time calculations

4. **Product Management**
   - CRUD operations
   - Search functionality
   - Category management
   - Dosage forms
   - Drug schedules
   - Pricing management

5. **Inventory Management**
   - Stock levels tracking
   - Low stock alerts
   - Expiring batches
   - Batch-wise inventory

6. **Customer Management**
   - Customer profiles
   - Credit limit tracking
   - Search functionality

7. **Supplier Management**
   - Supplier profiles
   - Payment terms
   - Credit limits
   - Contact management

8. **Purchase Orders**
   - Create purchase orders
   - Multi-item orders
   - Approval workflow
   - Supplier selection

9. **GRN (Goods Receipt Note)**
   - Receive stock
   - Batch tracking
   - Expiry date management
   - Approval workflow

10. **Sales History**
    - View all sales
    - Sale details
    - Payment tracking

11. **Reports** (Placeholder)
    - Sales reports
    - Inventory reports
    - Profit analysis

12. **Settings** (Placeholder)
    - Branch management
    - User management
    - System settings

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── login/          # Login page
│   ├── dashboard/
│   │   ├── pos/            # Point of Sale
│   │   ├── products/       # Product management
│   │   ├── inventory/      # Inventory tracking
│   │   ├── customers/      # Customer management
│   │   ├── suppliers/      # Supplier management
│   │   ├── sales/          # Sales history
│   │   ├── purchase-orders/# Purchase orders
│   │   ├── grn/            # Goods receipt
│   │   ├── reports/        # Reports
│   │   ├── settings/       # Settings
│   │   └── stock-transfer/ # Stock transfer
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── auth/               # Auth components
│   ├── layout/             # Layout components
│   └── ui/                 # shadcn components
├── lib/
│   ├── api.ts              # Axios instance
│   ├── services.ts         # API services
│   └── utils.ts            # Utilities
└── types/
    └── index.ts            # TypeScript types
```

## 🎨 Design Philosophy

### Modern & Clean
- Minimalist interface
- Consistent spacing
- Professional color scheme
- Responsive design

### Developer-Friendly
- Type-safe with TypeScript
- Reusable components
- Clean code structure
- Comprehensive API services

### User Experience
- Intuitive navigation
- Fast interactions
- Real-time feedback
- Toast notifications

## 🔧 API Integration

All API endpoints from the backend are integrated through service layers:

```typescript
// Example: Product Service
productService.getAll(page, size)
productService.search(query)
productService.create(data)
productService.update(id, data)
productService.delete(id)
```

### Services Available:
- `authService` - Authentication
- `branchService` - Branch management
- `categoryService` - Categories
- `productService` - Products
- `supplierService` - Suppliers
- `customerService` - Customers
- `inventoryService` - Inventory
- `saleService` - Sales
- `purchaseOrderService` - Purchase orders
- `grnService` - Goods receipt
- `dashboardService` - Dashboard stats
- `userService` - User management

## 🚦 Getting Started

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Access Application**
```
http://localhost:3000
```

## 🔐 Default Credentials

```
Username: admin
Password: admin123
```

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar
- Touch-friendly buttons
- Optimized tables

## 🎯 Key Features

### POS System
- Quick product search
- Real-time cart updates
- Multiple payment methods
- Customer selection
- Automatic calculations

### Inventory Management
- Real-time stock levels
- Low stock alerts
- Expiring items tracking
- Batch-wise management

### Purchase Management
- Create purchase orders
- Receive goods (GRN)
- Approval workflows
- Supplier tracking

### Sales Management
- Complete sales history
- Detailed sale views
- Payment tracking
- Customer history

## 🔄 State Management

- Local state with React hooks
- LocalStorage for auth tokens
- Real-time data fetching
- Optimistic UI updates

## 🎨 UI Components Used

- Button
- Input
- Label
- Card
- Table
- Dialog
- Select
- Badge
- Tabs
- Sonner (Toast)

## 📊 Data Flow

1. User interacts with UI
2. Component calls service function
3. Service makes API request via Axios
4. Response handled with toast notifications
5. UI updates with new data

## 🔒 Security

- JWT token authentication
- Auto token refresh
- Protected routes
- Secure API calls
- Token stored in localStorage

## 🚀 Performance

- Code splitting
- Lazy loading
- Optimized images
- Minimal re-renders
- Efficient API calls

## 📝 Code Quality

- TypeScript for type safety
- ESLint configuration
- Consistent formatting
- Reusable components
- Clean architecture

## 🎯 Future Enhancements

- [ ] Advanced reporting
- [ ] Print invoices
- [ ] Barcode scanning
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export data
- [ ] Advanced filters
- [ ] Bulk operations

## 🤝 Contributing

This is a clean, maintainable codebase designed for easy extension and modification.

## 📄 License

Private project for MedLan Pharmacy

---

**Built with ❤️ using modern web technologies**
