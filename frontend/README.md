# MedLan Pharmacy Management System - Frontend

Modern, production-ready React frontend for pharmacy management.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Navigation
- **React Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client
- **React Hook Form + Zod** - Form validation
- **Sonner** - Toast notifications

## Features

- 🔐 Authentication & Authorization
- 📊 Dashboard with real-time metrics
- 🛒 Point of Sale (POS) system
- 📦 Inventory management
- 💊 Product management
- 👥 Customer & Supplier management
- 📋 Purchase Orders & GRN
- 📈 Reports & Analytics
- 🏢 Multi-branch support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
# .env file already created with default values
VITE_API_URL=http://localhost:8080
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Default Login

After backend initial setup:
- Username: `admin`
- Password: `admin123`

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Card, etc.)
│   └── Layout.jsx   # Main layout with sidebar
├── pages/           # Page components
├── services/        # API service layer
├── store/           # Zustand state management
├── lib/             # Utilities and helpers
└── App.jsx          # Main app component
```

## Key Pages

- `/` - Dashboard
- `/pos` - Point of Sale
- `/products` - Product management
- `/inventory` - Stock levels
- `/customers` - Customer management
- `/suppliers` - Supplier management
- `/branches` - Branch management

## Design Principles

- **Clean Code** - Minimal, readable, maintainable
- **Performance** - Optimized rendering and data fetching
- **User Experience** - Intuitive, responsive design
- **Type Safety** - Proper validation and error handling
- **Scalability** - Modular architecture

## API Integration

All API calls are centralized in `src/services/api.js` with proper error handling and authentication.

## State Management

- **Zustand** for global state (auth, selected branch)
- **React Query** for server state (caching, refetching)
- **Local state** for component-specific data

## Styling

Tailwind CSS with custom theme variables for consistent design. All colors and spacing follow the design system defined in `tailwind.config.js`.
