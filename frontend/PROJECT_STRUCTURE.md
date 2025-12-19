# Pharmacy POS System - Project Structure

## Overview
A clean, developer-friendly pharmacy management and point-of-sale system built with Next.js 16, TypeScript, and shadcn/ui.

## Directory Structure

```
src/
├── app/                      # Next.js App Router
│   ├── auth/
│   │   └── login/           # Login page
│   ├── dashboard/           # Main dashboard
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home (redirects to login)
│   └── globals.css          # Global styles
│
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   └── auth/                # Authentication components
│       └── login-form.tsx
│
├── lib/
│   └── utils.ts             # Utility functions
│
└── types/
    └── index.ts             # TypeScript type definitions
```

## Key Features

### Authentication
- Clean login page with form validation
- Type-safe credentials handling
- Ready for backend integration

### UI Components (shadcn/ui)
- Button - Multiple variants (default, outline, ghost, etc.)
- Card - Container components with header, content, footer
- Input - Form input with proper styling
- Label - Accessible form labels

### Type System
- User roles: admin, pharmacist, cashier
- Product management types
- Sales and transaction types

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Next Steps

### Immediate Tasks
1. Implement authentication API integration
2. Create protected route middleware
3. Build dashboard layout with navigation

### Feature Development
1. **Product Management**
   - Add/Edit/Delete products
   - Barcode scanning
   - Inventory tracking

2. **POS Interface**
   - Shopping cart
   - Payment processing
   - Receipt generation

3. **Reports & Analytics**
   - Sales reports
   - Inventory reports
   - User activity logs

4. **User Management**
   - Role-based access control
   - User CRUD operations

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React Server Components pattern
- Keep components small and focused
- Use "use client" directive only when needed

### File Naming
- Components: PascalCase (LoginForm.tsx)
- Utilities: camelCase (utils.ts)
- Types: PascalCase interfaces

### Component Structure
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Component definition
// 4. Export
```
