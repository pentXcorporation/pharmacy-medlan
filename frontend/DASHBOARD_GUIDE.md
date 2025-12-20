# Modern Pharmacy Dashboard

## Overview
A clean, modern, and developer-friendly dashboard implementation using Next.js 16, shadcn/ui, and Recharts.

## Features

### Dashboard Components
- **Stat Cards**: Total Customers, Total Medicine, Out of Stock, Expired Medicine
- **Income Expense Chart**: Pie chart showing income vs expense ratio
- **Best Sales Chart**: Bar chart displaying top-selling medicines
- **Monthly Progress Report**: Bar chart showing daily sales progress
- **Today's Report**: Summary table of daily transactions

### Design Principles
- **Clean UI**: Minimalist design with clear visual hierarchy
- **Responsive**: Mobile-first approach with responsive grid layouts
- **Accessible**: WCAG compliant with keyboard navigation support
- **Developer-Friendly**: Modular components with TypeScript support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   └── dashboard/
│       └── page.tsx              # Main dashboard page
├── components/
│   ├── dashboard/
│   │   ├── income-expense-chart.tsx
│   │   ├── best-sales-chart.tsx
│   │   ├── monthly-progress-chart.tsx
│   │   └── today-report.tsx
│   ├── layout/
│   │   └── dashboard-layout.tsx  # Main layout with sidebar
│   └── ui/                       # shadcn components
├── hooks/
│   └── useDashboardData.ts       # Dashboard data fetching hook
├── lib/
│   ├── api.ts                    # Axios instance
│   ├── services.ts               # API service functions
│   └── utils.ts                  # Utility functions
└── types/
    └── index.ts                  # TypeScript types
```

## API Integration

### Dashboard Service
```typescript
dashboardService.getSummary(branchId: number)
```

Returns:
```typescript
{
  totalSales: number;
  salesCount: number;
  lowStockCount: number;
  expiringItemsCount: number;
  todaySales: number;
  monthSales: number;
}
```

### Backend Endpoints Required

1. **GET /api/dashboard/summary?branchId={id}**
   - Returns dashboard statistics

2. **GET /api/sales/monthly?branchId={id}&month={YYYY-MM}**
   - Returns daily sales data for charts

3. **GET /api/products/best-sellers?branchId={id}&limit=12**
   - Returns top-selling products

4. **GET /api/products/count?branchId={id}**
   - Returns total medicine count

## Component Usage

### Dashboard Page
```tsx
import DashboardLayout from '@/components/layout/dashboard-layout';
import { IncomeExpenseChart } from '@/components/dashboard/income-expense-chart';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <IncomeExpenseChart />
    </DashboardLayout>
  );
}
```

### Custom Hook
```tsx
import { useDashboardData } from '@/hooks/useDashboardData';

const { data, loading, error } = useDashboardData(branchId);
```

## Styling Guide

### Color Palette
- **Primary**: Green (#22c55e)
- **Sidebar**: Dark Gray (#1f2937)
- **Background**: Light Gray (#f9fafb)
- **Cards**: White (#ffffff)

### Component Colors
- Cyan: Total Customers (#06b6d4)
- Green: Total Medicine (#16a34a)
- Red: Out of Stock (#ef4444)
- Orange: Expired Medicine (#f97316)

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## Customization

### Adding New Stat Cards
Edit `src/app/dashboard/page.tsx`:
```tsx
const cards = [
  {
    title: 'NEW METRIC',
    value: stats?.newMetric || 0,
    icon: IconComponent,
    bg: 'bg-blue-500',
    link: '/dashboard/route'
  }
];
```

### Modifying Charts
Each chart component is self-contained in `src/components/dashboard/`:
- Update data structure
- Modify colors via `fill` prop
- Adjust dimensions via `ResponsiveContainer`

### Theming
Colors are defined in `tailwind.config.js` and can be customized:
```js
theme: {
  extend: {
    colors: {
      primary: '#your-color'
    }
  }
}
```

## Best Practices

1. **Data Fetching**: Use React hooks for data fetching
2. **Error Handling**: Implement proper error boundaries
3. **Loading States**: Show loading indicators during data fetch
4. **Type Safety**: Use TypeScript interfaces for all data
5. **Accessibility**: Maintain ARIA labels and keyboard navigation
6. **Performance**: Lazy load charts and optimize re-renders

## API Integration Checklist

- [ ] Configure API base URL in `.env.local`
- [ ] Implement authentication token handling
- [ ] Add error handling for API calls
- [ ] Implement data caching strategy
- [ ] Add loading states for all async operations
- [ ] Handle API rate limiting
- [ ] Implement retry logic for failed requests

## Future Enhancements

- [ ] Real-time data updates via WebSocket
- [ ] Export dashboard data to PDF/Excel
- [ ] Customizable dashboard widgets
- [ ] Date range filters for charts
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced analytics and insights

## Support

For issues or questions:
1. Check the API documentation
2. Review component props and types
3. Consult the shadcn/ui documentation
4. Check Recharts documentation for chart customization
