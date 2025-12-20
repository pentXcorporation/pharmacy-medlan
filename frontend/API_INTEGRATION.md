# API Integration Reference

## Required Backend Endpoints

### 1. Dashboard Summary (✅ Already Integrated)
```
GET /api/dashboard/summary?branchId={id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 50000.00,
    "salesCount": 196,
    "lowStockCount": 38,
    "expiringItemsCount": 59,
    "todaySales": 5000.00,
    "monthSales": 45000.00
  }
}
```

### 2. Monthly Sales Data (Needed for Monthly Progress Chart)
```
GET /api/sales/monthly?branchId={id}&month=2024-12
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "date": "2024-12-01", "amount": 0 },
    { "date": "2024-12-04", "amount": 2000 },
    { "date": "2024-12-08", "amount": 1600 }
  ]
}
```

**Integration:**
```typescript
// In monthly-progress-chart.tsx
const [data, setData] = useState([]);

useEffect(() => {
  const branchId = localStorage.getItem('branchId');
  fetch(`/api/sales/monthly?branchId=${branchId}&month=2024-12`)
    .then(res => res.json())
    .then(result => setData(result.data));
}, []);
```

### 3. Best Sellers (Needed for Best Sales Chart)
```
GET /api/products/best-sellers?branchId={id}&limit=12
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "productName": "NAPA", "totalQuantity": 150 },
    { "productName": "Moov", "totalQuantity": 100 },
    { "productName": "Fexo", "totalQuantity": 120 }
  ]
}
```

**Integration:**
```typescript
// In best-sales-chart.tsx
const [data, setData] = useState([]);

useEffect(() => {
  const branchId = localStorage.getItem('branchId');
  fetch(`/api/products/best-sellers?branchId=${branchId}&limit=12`)
    .then(res => res.json())
    .then(result => {
      const chartData = result.data.map(item => ({
        name: item.productName,
        value: item.totalQuantity
      }));
      setData(chartData);
    });
}, []);
```

### 4. Product Count (Needed for Total Medicine Card)
```
GET /api/products/count?branchId={id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 90,
    "activeProducts": 85
  }
}
```

### 5. Today's Transactions (Needed for Today's Report)
```
GET /api/dashboard/today-report?branchId={id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 5000.00,
    "totalPurchase": 3000.00,
    "cashReceived": 4000.00,
    "bankReceive": 1000.00,
    "totalService": 500.00
  }
}
```

## Quick Integration Steps

### Step 1: Add New Service Methods
Edit `src/lib/services.ts`:

```typescript
export const dashboardService = {
  getSummary: (branchId: number) => 
    api.get<ApiResponse<DashboardStats>>('/api/dashboard/summary', {
      params: { branchId }
    }),
  
  // Add these new methods
  getMonthlySales: (branchId: number, month: string) =>
    api.get<ApiResponse<Array<{date: string; amount: number}>>>('/api/sales/monthly', {
      params: { branchId, month }
    }),
  
  getBestSellers: (branchId: number, limit: number = 12) =>
    api.get<ApiResponse<Array<{productName: string; totalQuantity: number}>>>('/api/products/best-sellers', {
      params: { branchId, limit }
    }),
  
  getTodayReport: (branchId: number) =>
    api.get<ApiResponse<{
      totalSales: number;
      totalPurchase: number;
      cashReceived: number;
      bankReceive: number;
      totalService: number;
    }>>('/api/dashboard/today-report', {
      params: { branchId }
    }),
};

export const productService = {
  // ... existing methods
  
  getCount: (branchId: number) =>
    api.get<ApiResponse<{totalProducts: number; activeProducts: number}>>('/api/products/count', {
      params: { branchId }
    }),
};
```

### Step 2: Update Chart Components

**Example: Monthly Progress Chart**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { dashboardService } from '@/lib/services';

export function MonthlyProgressChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const branchId = Number(localStorage.getItem('branchId') || '1');
    const month = new Date().toISOString().slice(0, 7); // "2024-12"
    
    dashboardService.getMonthlySales(branchId, month)
      .then(res => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Progress Report</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Bar dataKey="amount" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

### Step 3: Update Dashboard Page

```typescript
'use client';

import { useEffect, useState } from 'react';
import { dashboardService, productService } from '@/lib/services';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [todayReport, setTodayReport] = useState(null);

  useEffect(() => {
    const branchId = Number(localStorage.getItem('branchId') || '1');
    
    // Fetch all data
    Promise.all([
      dashboardService.getSummary(branchId),
      productService.getCount(branchId),
      dashboardService.getTodayReport(branchId)
    ]).then(([statsRes, countRes, reportRes]) => {
      setStats(statsRes.data.data);
      setProductCount(countRes.data.data.totalProducts);
      setTodayReport(reportRes.data.data);
    });
  }, []);

  // Use the data in your components
}
```

## Testing Endpoints

### Using curl:
```bash
# Test dashboard summary
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/dashboard/summary?branchId=1

# Test monthly sales
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/sales/monthly?branchId=1&month=2024-12

# Test best sellers
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/products/best-sellers?branchId=1&limit=12
```

### Using Postman:
1. Set Authorization header with Bearer token
2. Add branchId as query parameter
3. Send GET request
4. Verify response structure

## Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=30000
```

## Error Handling

```typescript
try {
  const response = await dashboardService.getSummary(branchId);
  setData(response.data.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
    router.push('/auth/login');
  } else {
    // Show error message
    toast.error('Failed to load dashboard data');
  }
}
```

## Common Issues

### Issue: CORS Error
**Solution:** Configure backend to allow frontend origin
```java
@CrossOrigin(origins = "http://localhost:3000")
```

### Issue: 401 Unauthorized
**Solution:** Check token in localStorage and refresh if expired

### Issue: Data not updating
**Solution:** Add dependency array to useEffect or implement polling

## Performance Tips

1. **Cache API responses** using React Query or SWR
2. **Debounce** frequent API calls
3. **Lazy load** chart components
4. **Implement pagination** for large datasets
5. **Use WebSocket** for real-time updates

## Next Steps

1. ✅ Verify all backend endpoints are working
2. ✅ Test with real data
3. ✅ Add error boundaries
4. ✅ Implement loading states
5. ✅ Add data refresh functionality
6. ✅ Set up monitoring and logging
