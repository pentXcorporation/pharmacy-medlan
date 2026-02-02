# 🏥 PHARMACY MANAGEMENT SYSTEM - COMPLETE SYSTEM ARCHITECTURE

**Version:** 1.0.0  
**Date:** February 1, 2026  
**Status:** Production Ready  
**Architecture:** Multi-Branch Multi-Tenant System

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Database Architecture](#database-architecture)
3. [Branch Isolation Strategy](#branch-isolation-strategy)
4. [Backend API Structure](#backend-api-structure)
5. [Frontend Architecture](#frontend-architecture)
6. [Security & Access Control](#security--access-control)
7. [Data Flow Diagrams](#data-flow-diagrams)
8. [Critical Implementation Notes](#critical-implementation-notes)
9. [Migration Guide](#migration-guide)
10. [Testing Checklist](#testing-checklist)

---

## 1. SYSTEM OVERVIEW

### 1.1 Technology Stack

**Backend:**
- Java 17 / Spring Boot 3.4.1
- Spring Data JPA / Hibernate
- Spring Security with JWT
- PostgreSQL Database
- Maven Build System

**Frontend:**
- React 18.3.1
- Vite Build Tool
- TanStack Query (React Query)
- Zustand State Management
- Tailwind CSS + shadcn/ui Components
- Axios for HTTP requests

### 1.2 Core Features

1. **Multi-Branch Management**
   - Branch-isolated data for inventory, sales, and finances
   - Cross-branch stock transfers
   - Centralized master data (products, suppliers, customers)

2. **Inventory Management**
   - Batch-wise inventory tracking
   - Expiry date management
   - Low stock & expiry alerts
   - Stock transfers between branches
   - Purchase orders & GRNs (Goods Receipt Notes)

3. **Point of Sale (POS)**
   - Fast barcode scanning
   - Prescription management
   - Multiple payment methods
   - Sale returns processing
   - Credit sales management

4. **Financial Management**
   - Daily cash register operations
   - Cash book tracking
   - Bank reconciliation
   - Cheque management
   - Supplier payment tracking

5. **Supplier Management**
   - Purchase order management
   - Goods receipt notes (GRN)
   - Return goods receipt notes (RGRN)
   - Payment tracking

6. **Payroll & Attendance**
   - Employee attendance tracking
   - Payroll processing
   - Branch-wise staff management

7. **Reporting & Analytics**
   - Sales reports (daily, monthly, product-wise)
   - Inventory reports (stock levels, expiry, valuation)
   - Financial reports (P&L, cash flow, receivables)
   - Super admin dashboard (all branches overview)

---

## 2. DATABASE ARCHITECTURE

### 2.1 Database Schema Summary

**Total Tables:** 60  
**Tables with Branch Isolation:** 19 (+ 13 to be migrated)  
**Master Data Tables:** 19  
**Child/Detail Tables:** 22

### 2.2 Table Categories

#### 2.2.1 **USER & AUTHENTICATION** (4 tables)
- `users` - Global user master
- `branch_staff` - User-to-branch assignments (✅ Has `branch_id`)
- `user_sessions` - Session tracking
- `employee_authorizations` - Authorization requests (⚠️ Needs `branch_id`)

#### 2.2.2 **ORGANIZATION** (1 table)
- `branches` - Branch master table

#### 2.2.3 **PRODUCT MANAGEMENT** (8 tables)
- `products` - Product catalog (global)
- `categories`, `sub_categories` - Product categories (global)
- `units` - Units of measure (global)
- `tax_categories` - Tax rates (global)
- `branch_inventory` - Branch stock levels (✅ Has `branch_id`)
- `inventory_batches` - Batch inventory (✅ Has `branch_id`)
- `product_pricing` - Pricing history (global)

#### 2.2.4 **SUPPLIER MANAGEMENT** (7 tables)
- `suppliers` - Supplier master (global)
- `purchase_orders` - POs (✅ Has `branch_id`)
- `purchase_order_items` - PO line items
- `goods_receipts` - GR (✅ Has `branch_id`)
- `goods_receipt_items` - GR line items
- `supplier_payments` - Payments (⚠️ Needs `branch_id`)
- `supplier_payment_details` - Payment details

#### 2.2.5 **INVENTORY MANAGEMENT** (11 tables)
- `grns` - Goods Receipt Notes (✅ Has `branch_id`)
- `grn_lines` - GRN line items
- `rgrns` - Return GRNs (✅ Has `branch_id`)
- `rgrn_lines` - RGRN line items
- `stock_transfers` - Inter-branch transfers (✅ Has `from_branch_id` & `to_branch_id`)
- `stock_transfer_items` - Transfer line items
- `inventory_transactions` - Inventory movements (✅ Has `branch_id`)
- `product_bin_cards` - Inventory ledger (✅ Has `branch_id`)
- `grn_temp` - Temporary GRN data (⚠️ Needs `branch_id`)
- `expiry_data` - Legacy expiry tracking (⚠️ Needs `branch_id`)

#### 2.2.6 **POINT OF SALE** (13 tables)
- `customers` - Customer master (global)
- `customer_prescriptions` - Prescriptions (global)
- `sales` - Sales transactions (✅ Has `branch_id`)
- `sale_items` - Sale line items
- `invoices` - Invoices (✅ Has `branch_id`)
- `invoice_data` - Legacy invoice lines
- `payments` - Payment collections (⚠️ Needs `branch_id`)
- `sale_returns` - Sale returns (✅ Has `branch_id`)
- `sale_return_items` - Return line items
- `customer_data` - Customer transactions (⚠️ Needs `branch_id`)
- `invoice_returns` - Legacy returns (⚠️ Needs `branch_id`)
- `return_invoice_data` - Legacy return data (⚠️ Needs `branch_id`)
- `patient_numbers` - Daily patient counter (⚠️ Needs `branch_id`)

#### 2.2.7 **FINANCE** (7 tables)
- `cash_registers` - Daily cash register (✅ Has `branch_id`)
- `cash_register_transactions` - Register transactions
- `cash_book` - Cash book entries (✅ Has `branch_id`)
- `banks` - Bank accounts (global)
- `bank_data` - Bank transactions (⚠️ Needs `branch_id`)
- `incoming_cheques` - Cheque management (⚠️ Needs `branch_id`)
- `transaction_types` - Transaction types (global)

#### 2.2.8 **PAYROLL** (3 tables)
- `employees` - Employee master (legacy)
- `attendance` - Attendance records (⚠️ Needs `branch_id`)
- `employee_payments` - Payroll payments (⚠️ Needs `branch_id`)

#### 2.2.9 **REPORTING** (3 tables)
- `low_stock_alerts` - Low stock alerts (✅ Has `branch_id`)
- `expiry_alerts` - Expiry alerts (✅ Has `branch_id`)
- `daily_sales_summaries` - Sales summaries (✅ Has `branch_id`)

#### 2.2.10 **SYSTEM** (3 tables)
- `notifications` - User notifications (global)
- `audit_logs` - Audit trail (global, could be per-branch)
- `sync_logs` - Sync operations (✅ Has `branch_id`)
- `system_config` - System configuration (global)

### 2.3 Entity Relationship Diagram

```
┌─────────────┐
│  branches   │ (Master Table)
└──────┬──────┘
       │
       ├─────────────────────────────────────────────┐
       │                                             │
       ▼                                             ▼
┌─────────────────┐                          ┌──────────────────┐
│  branch_staff   │                          │ branch_inventory │
│  (branch_id)    │◄──┐                      │   (branch_id)    │
└─────────────────┘   │                      └──────────────────┘
                      │                               │
                      │                               │
                ┌─────┴──────┐                        │
                │   users    │                        │
                └─────┬──────┘                        │
                      │                               │
       ┌──────────────┼───────────────┐               │
       │              │               │               │
       ▼              ▼               ▼               ▼
┌─────────────┐ ┌──────────┐   ┌──────────┐   ┌──────────────────┐
│    sales    │ │ invoices │   │   grns   │   │ inventory_batches│
│(branch_id)  │ │(branch_id)│   │(branch_id)│   │   (branch_id)    │
└─────────────┘ └──────────┘   └──────────┘   └──────────────────┘
       │              │               │
       │              │               │
       ▼              ▼               ▼
┌─────────────┐ ┌──────────────┐ ┌──────────┐
│ sale_items  │ │invoice_data  │ │grn_lines │
└─────────────┘ └──────────────┘ └──────────┘
```

---

## 3. BRANCH ISOLATION STRATEGY

### 3.1 Branch Isolation Principles

**Rule 1: Transactional Data is Branch-Isolated**
All business transactions (sales, purchases, inventory movements) must be associated with a specific branch using `branch_id` foreign key.

**Rule 2: Master Data is Global**
Master data (products, suppliers, customers, categories) is shared across all branches and does NOT have `branch_id`.

**Rule 3: Child Tables Inherit Branch Context**
Detail/line item tables (sale_items, grn_lines) don't need `branch_id` as they inherit it from their parent transaction.

**Rule 4: User Operations Filter by Branch**
All API endpoints for transactional data MUST accept `branchId` parameter and filter results accordingly.

### 3.2 Tables with Branch Isolation (19 + 13 pending)

**✅ Currently Implemented:**
1. `branch_staff`
2. `branch_inventory`
3. `inventory_batches`
4. `purchase_orders`
5. `goods_receipts`
6. `grns`
7. `rgrns`
8. `stock_transfers` (both `from_branch_id` and `to_branch_id`)
9. `inventory_transactions`
10. `product_bin_cards`
11. `sales`
12. `invoices`
13. `sale_returns`
14. `cash_registers`
15. `cash_book`
16. `low_stock_alerts`
17. `expiry_alerts`
18. `daily_sales_summaries`
19. `sync_logs`

**⚠️ Pending Migration (13 tables):**
1. `employee_authorizations` - Authorization requests should be branch-specific
2. `supplier_payments` - Payments made from which branch?
3. `payments` - Payment collections per branch
4. `grn_temp` - Temporary GRN data should be branch-specific
5. `expiry_data` - Legacy expiry tracking needs branch context
6. `customer_data` - Customer transaction history per branch
7. `invoice_returns` - Which branch processed the return?
8. `return_invoice_data` - Return data needs branch context
9. `patient_numbers` - Patient numbering should be branch-specific
10. `bank_data` - Bank transactions per branch
11. `incoming_cheques` - Cheques received at which branch?
12. `attendance` - Employee attendance at which branch?
13. `employee_payments` - Payments made at which branch?

**Migration Script:** `backend/branch_isolation_migration.sql`

### 3.3 Tables Without Branch Isolation (Correct)

These tables should NOT have `branch_id`:
- `users` - Global user directory
- `branches` - Branch master itself
- `products`, `categories`, `sub_categories`, `units` - Product catalog
- `suppliers`, `customers` - Business entity masters
- `employees` - Employee master (branch assignment via `branch_staff`)
- `banks`, `transaction_types` - Configuration data
- `user_sessions` - Session management
- `notifications` - User notifications
- `system_config` - System settings
- All child/detail tables (`*_items`, `*_lines`) - Inherit from parent

---

## 4. BACKEND API STRUCTURE

### 4.1 API Base URL

**Development:** `http://localhost:8080/api`  
**Production:** `https://medlan-project.serveminecraft.net/api`

### 4.2 Authentication

**Type:** JWT (JSON Web Token)  
**Header:** `Authorization: Bearer <token>`  
**Login Endpoint:** `POST /auth/login`

### 4.3 Role-Based Access Control

**Roles:**
- `SUPER_ADMIN` - Full system access, all branches
- `ADMIN` - Branch administration
- `MANAGER` - Branch management, reporting
- `PHARMACIST` - Dispensing, inventory management
- `CASHIER` - POS operations
- `ACCOUNTANT` - Financial management
- `STOCK_CLERK` - Inventory operations

### 4.4 API Endpoint Categories

#### 4.4.1 **Authentication & User Management**
```
POST   /auth/login                    - User login
POST   /auth/register                 - Register new user (ADMIN only)
POST   /auth/refresh                  - Refresh JWT token
POST   /auth/change-password          - Change password
POST   /auth/logout                   - Logout
GET    /auth/me                       - Get current user

GET    /users                         - List users
POST   /users                         - Create user
GET    /users/{id}                    - Get user by ID
PUT    /users/{id}                    - Update user
DELETE /users/{id}                    - Delete user
GET    /users/branch/{branchId}       - Users by branch ✅
```

#### 4.4.2 **Branch Management**
```
GET    /branches                      - List all branches
GET    /branches/all                  - All branches (no pagination)
GET    /branches/active               - Active branches only
GET    /branches/{id}                 - Get branch by ID
GET    /branches/code/{code}          - Get branch by code
POST   /branches                      - Create branch (ADMIN)
PUT    /branches/{id}                 - Update branch (ADMIN)
DELETE /branches/{id}                 - Delete branch (ADMIN)
```

#### 4.4.3 **Product Management**
```
GET    /products                      - List products (paginated)
POST   /products                      - Create product
GET    /products/{id}                 - Get product by ID
GET    /products/code/{code}          - Get product by code
PUT    /products/{id}                 - Update product
DELETE /products/{id}                 - Delete product
GET    /products/search               - Search products
GET    /products/low-stock            - Low stock products ⚠️ (no branch filter)

GET    /categories                    - List categories
GET    /units                         - List units
```

#### 4.4.4 **Inventory Management**
```
GET    /inventory/branch/{branchId}                       - Inventory by branch ✅
GET    /inventory/product/{productId}/branch/{branchId}   - Product inventory ✅
GET    /inventory/branch/{branchId}/low-stock             - Low stock ✅
GET    /inventory/branch/{branchId}/out-of-stock          - Out of stock ✅
GET    /inventory/branch/{branchId}/batches               - All batches ✅
GET    /inventory/branch/{branchId}/expiring              - Expiring batches ✅
GET    /inventory/branch/{branchId}/expired               - Expired batches ✅

GET    /inventory-transactions/branch/{branchId}          - Transactions ✅
POST   /inventory-transactions                            - Create transaction
```

#### 4.4.5 **Purchase Orders & GRN**
```
GET    /purchase-orders                      - List POs
GET    /purchase-orders/branch/{branchId}    - POs by branch ✅
POST   /purchase-orders                      - Create PO
GET    /purchase-orders/{id}                 - Get PO
PUT    /purchase-orders/{id}                 - Update PO
POST   /purchase-orders/{id}/approve         - Approve PO

GET    /grns                                 - List GRNs
GET    /grns/branch/{branchId}               - GRNs by branch ✅
POST   /grns                                 - Create GRN
GET    /grns/{id}                            - Get GRN
PUT    /grns/{id}                            - Update GRN
POST   /grns/{id}/approve                    - Approve GRN

GET    /rgrns                                - List RGRNs
GET    /rgrns/branch/{branchId}              - RGRNs by branch ✅
POST   /rgrns                                - Create RGRN
```

#### 4.4.6 **Stock Transfers**
```
GET    /stock-transfers                            - List transfers
GET    /stock-transfers/from-branch/{branchId}     - From branch ✅
GET    /stock-transfers/to-branch/{branchId}       - To branch ✅
GET    /stock-transfers/branch/{branchId}          - All involving branch ✅
POST   /stock-transfers                            - Create transfer
POST   /stock-transfers/{id}/approve               - Approve transfer
POST   /stock-transfers/{id}/receive               - Receive transfer
```

#### 4.4.7 **Point of Sale**
```
GET    /sales                                  - List sales
GET    /sales/branch/{branchId}                - Sales by branch ✅
GET    /sales/branch/{branchId}/date-range     - Sales by branch & date ✅
POST   /sales                                  - Create sale
GET    /sales/{id}                             - Get sale
POST   /sales/{id}/cancel                      - Cancel sale

GET    /invoices                               - List invoices
GET    /invoices/branch/{branchId}             - Invoices by branch ✅
POST   /invoices                               - Create invoice
GET    /invoices/{id}                          - Get invoice
POST   /invoices/{id}/payment                  - Record payment

GET    /sale-returns                           - List returns
GET    /sale-returns/branch/{branchId}         - Returns by branch ✅
POST   /sale-returns                           - Create return
```

#### 4.4.8 **Financial Management**
```
POST   /cash-register/open                         - Open register
GET    /cash-register/current/{branchId}           - Current register ✅
GET    /cash-register/branch/{branchId}            - Registers by branch ✅
POST   /cash-register/{id}/close                   - Close register
POST   /cash-register/{id}/cash-in                 - Cash in
POST   /cash-register/{id}/cash-out                - Cash out

GET    /cashbook                                   - Cash book entries
GET    /cashbook/branch/{branchId}                 - By branch ✅
GET    /cashbook/branch/{branchId}/date-range      - By branch & date ✅
POST   /cashbook                                   - Create entry

GET    /cheques                                    - List cheques ⚠️ (no branch filter)
POST   /cheques                                    - Create cheque
POST   /cheques/{id}/deposit                       - Deposit cheque
POST   /cheques/{id}/clear                         - Clear cheque
POST   /cheques/{id}/bounce                        - Bounce cheque
```

#### 4.4.9 **Reporting**
```
All reporting endpoints require branchId parameter ✅

GET    /reports/sales/total?branchId={id}&from={date}&to={date}
GET    /reports/sales/summary?branchId={id}&from={date}&to={date}
GET    /reports/sales/daily?branchId={id}&date={date}
GET    /reports/sales/top-products?branchId={id}&from={date}&to={date}

GET    /reports/inventory/valuation?branchId={id}
GET    /reports/inventory/stock-levels?branchId={id}
GET    /reports/inventory/expiring?branchId={id}&days={days}

GET    /reports/financial/revenue?branchId={id}&from={date}&to={date}
GET    /reports/financial/profit-loss?branchId={id}&from={date}&to={date}
GET    /reports/financial/cash-flow?branchId={id}&from={date}&to={date}

GET    /reports/alerts/low-stock?branchId={id}
GET    /reports/alerts/expiry?branchId={id}
```

#### 4.4.10 **Super Admin Dashboard**
```
GET    /dashboard/super-admin                     - Complete dashboard
GET    /dashboard/super-admin/system-health       - System health
GET    /dashboard/super-admin/branch-analytics    - All branches data
GET    /dashboard/super-admin/financial-summary   - Financial overview
```

### 4.5 API Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "timestamp": "2026-02-01T10:30:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": { /* additional error info */ },
  "timestamp": "2026-02-01T10:30:00Z"
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": {
    "content": [ /* array of items */ ],
    "totalElements": 100,
    "totalPages": 10,
    "size": 10,
    "number": 0,
    "first": true,
    "last": false
  }
}
```

---

## 5. FRONTEND ARCHITECTURE

### 5.1 Project Structure

```
frontend/
├── src/
│   ├── assets/           - Static assets (images, fonts)
│   ├── components/       - Reusable UI components
│   │   ├── ui/          - shadcn/ui components
│   │   ├── layout/      - Layout components
│   │   └── common/      - Common components
│   ├── config/          - Configuration files
│   ├── constants/       - Constants and enums
│   ├── features/        - Feature-specific components
│   ├── hooks/           - Custom React hooks
│   ├── lib/             - Utility libraries
│   ├── pages/           - Page components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── pos/
│   │   ├── finance/
│   │   ├── suppliers/
│   │   └── reports/
│   ├── routes/          - Routing configuration
│   ├── services/        - API service layer
│   ├── store/           - Zustand state management
│   └── utils/           - Utility functions
├── public/              - Public assets
└── package.json         - Dependencies
```

### 5.2 State Management

**Branch Context:**
```javascript
// Store current branch in global state
const useBranchStore = create((set) => ({
  currentBranch: null,
  setCurrentBranch: (branch) => set({ currentBranch: branch })
}));
```

**Usage in Components:**
```javascript
const { currentBranch } = useBranchStore();

// All API calls include branchId
const { data: inventory } = useQuery({
  queryKey: ['inventory', currentBranch?.id],
  queryFn: () => inventoryService.getByBranch(currentBranch.id),
  enabled: !!currentBranch
});
```

### 5.3 API Service Layer

**Structure:**
```javascript
// services/inventoryService.js
export const inventoryService = {
  getByBranch: (branchId, params) => 
    api.get(`/inventory/branch/${branchId}`, { params }),
    
  getLowStock: (branchId) => 
    api.get(`/inventory/branch/${branchId}/low-stock`),
    
  getExpiring: (branchId, days) => 
    api.get(`/inventory/branch/${branchId}/expiring`, { params: { days } })
};
```

**API Client Configuration:**
```javascript
// config/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 5.4 Critical Frontend Rules

**Rule 1: Always Include Branch Context**
Every transaction, query, or operation MUST include the current branch ID.

**Rule 2: Validate Branch Selection**
Never allow operations without a selected branch. Disable forms/buttons until branch is selected.

**Rule 3: Branch Switching**
When user switches branches, invalidate all React Query cache for the previous branch.

```javascript
const handleBranchChange = (newBranch) => {
  setCurrentBranch(newBranch);
  queryClient.invalidateQueries(); // Clear all cached data
};
```

**Rule 4: Error Handling**
Always handle branch-related errors (e.g., unauthorized branch access).

---

## 6. SECURITY & ACCESS CONTROL

### 6.1 Authentication Flow

1. User submits login credentials to `/auth/login`
2. Backend validates credentials
3. Backend generates JWT token with user details and roles
4. Frontend stores token in localStorage/sessionStorage
5. All subsequent requests include token in Authorization header
6. Backend validates token on each request

### 6.2 JWT Token Structure

```json
{
  "sub": "username",
  "userId": 123,
  "roles": ["ADMIN", "MANAGER"],
  "branchIds": [1, 2, 3],
  "primaryBranchId": 1,
  "iat": 1706780000,
  "exp": 1706866400
}
```

### 6.3 Branch-Level Authorization

**Backend Validation:**
```java
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
@GetMapping("/branch/{branchId}")
public ResponseEntity<?> getByBranch(@PathVariable Long branchId) {
    // Verify user has access to this branch
    if (!userService.hasAccessToBranch(currentUser, branchId)) {
        throw new UnauthorizedException("No access to this branch");
    }
    // ... rest of logic
}
```

**Frontend Protection:**
```javascript
// Check if user has access to branch
const hasAccess = (branchId) => {
  const user = authStore.getState().user;
  return user.branchIds.includes(branchId) || user.role === 'SUPER_ADMIN';
};

// Conditional rendering
{hasAccess(branch.id) && (
  <Button onClick={() => viewBranchData(branch.id)}>
    View Data
  </Button>
)}
```

### 6.4 CORS Configuration

**Backend Configuration:**
```java
// SecurityConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOriginPatterns(List.of(
        "http://localhost:*",
        "https://*.netlify.app",
        "https://medlan-project.serveminecraft.net"
    ));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    config.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

**Important:** Do NOT use `@CrossOrigin(origins = "*")` on controllers when `allowCredentials = true`.

---

## 7. DATA FLOW DIAGRAMS

### 7.1 Purchase Order to Inventory Flow

```
┌──────────────┐
│   Supplier   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐    Creates    ┌───────────────────┐
│ Purchase Order   │───────────────>│ PO Items          │
│ (branch_id)      │                │ (product_id,      │
└────────┬─────────┘                │  quantity, price) │
         │                          └───────────────────┘
         │ Approved
         ▼
┌──────────────────┐    Receives   ┌───────────────────┐
│ Goods Receipt    │───────────────>│ GR Items          │
│ Note (GRN)       │                │ (batch, expiry)   │
│ (branch_id)      │                └───────────────────┘
└────────┬─────────┘
         │ Creates
         ▼
┌──────────────────────┐    Updates    ┌──────────────────┐
│ Inventory Batches    │───────────────>│ Branch Inventory │
│ (branch_id,          │                │ (branch_id,      │
│  batch_number,       │                │  product_id,     │
│  expiry_date,        │                │  quantity)       │
│  quantity_available) │                └──────────────────┘
└──────────────────────┘
```

### 7.2 Sale Transaction Flow

```
┌─────────────┐
│  Customer   │
└──────┬──────┘
       │
       ▼
┌──────────────────┐    Creates    ┌───────────────────┐
│  Sale            │───────────────>│ Sale Items        │
│  (branch_id,     │                │ (product_id,      │
│   customer_id)   │                │  batch_id,        │
└────────┬─────────┘                │  quantity, price) │
         │                          └────────┬──────────┘
         │ Generates                         │
         ▼                                   │ Reduces
┌──────────────────┐                ┌───────▼───────────┐
│  Invoice         │                │ Inventory Batches │
│  (branch_id,     │                │ (quantity_        │
│   total_amount)  │                │  available)       │
└────────┬─────────┘                └───────────────────┘
         │ Records                           │ Updates
         ▼                                   ▼
┌──────────────────┐                ┌───────────────────┐
│  Payment         │                │ Branch Inventory  │
│  (amount,        │                │ (quantity_on_hand)│
│   method)        │                └───────────────────┘
└────────┬─────────┘
         │ Adds to
         ▼
┌──────────────────┐
│  Cash Register   │
│  (branch_id,     │
│   cash_in_total) │
└──────────────────┘
```

### 7.3 Stock Transfer Flow

```
┌──────────────────┐                ┌──────────────────┐
│  Branch A        │    Request     │  Branch B        │
│  (Source)        │───────────────>│  (Destination)   │
└────────┬─────────┘                └────────┬─────────┘
         │                                   │
         │ Creates                           │
         ▼                                   │
┌──────────────────────┐                    │
│  Stock Transfer      │                    │
│  (from_branch_id=A,  │                    │
│   to_branch_id=B,    │                    │
│   status=PENDING)    │                    │
└────────┬─────────────┘                    │
         │                                   │
         │ Manager Approves                 │
         ▼                                   │
┌──────────────────────┐                    │
│  Status=APPROVED     │                    │
└────────┬─────────────┘                    │
         │                                   │
         │ Dispatch                          │
         ▼                                   │
┌──────────────────────┐    Notify          │
│  Reduce Inventory    │───────────────────>│
│  at Branch A         │                     │
│  Status=IN_TRANSIT   │                     │
└──────────────────────┘                     │
                                             │ Receive
                                             ▼
                                   ┌──────────────────────┐
                                   │  Increase Inventory  │
                                   │  at Branch B         │
                                   │  Status=COMPLETED    │
                                   └──────────────────────┘
```

---

## 8. CRITICAL IMPLEMENTATION NOTES

### 8.1 Branch Isolation Enforcement

**❌ WRONG - No branch filter:**
```java
@GetMapping("/sales")
public List<Sale> getAllSales() {
    return saleRepository.findAll(); // Returns ALL branches' data!
}
```

**✅ CORRECT - With branch filter:**
```java
@GetMapping("/sales/branch/{branchId}")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public List<Sale> getSalesByBranch(@PathVariable Long branchId) {
    // Verify user has access to this branch
    validateBranchAccess(branchId);
    return saleRepository.findByBranchId(branchId);
}
```

### 8.2 Frontend Branch Context

**❌ WRONG - No branch context:**
```javascript
const { data } = useQuery({
  queryKey: ['sales'],
  queryFn: () => api.get('/sales') // Missing branch!
});
```

**✅ CORRECT - With branch context:**
```javascript
const { currentBranch } = useBranchStore();

const { data } = useQuery({
  queryKey: ['sales', currentBranch?.id],
  queryFn: () => api.get(`/sales/branch/${currentBranch.id}`),
  enabled: !!currentBranch // Only run if branch is selected
});
```

### 8.3 Database Queries

**❌ WRONG - No branch filter:**
```java
@Query("SELECT s FROM Sale s WHERE s.saleDate BETWEEN :from AND :to")
List<Sale> findByDateRange(LocalDate from, LocalDate to);
```

**✅ CORRECT - With branch filter:**
```java
@Query("SELECT s FROM Sale s WHERE s.branch.id = :branchId AND s.saleDate BETWEEN :from AND :to")
List<Sale> findByBranchAndDateRange(Long branchId, LocalDate from, LocalDate to);
```

### 8.4 Service Layer Validation

**Always validate branch access:**
```java
@Service
public class SaleService {
    
    @Autowired
    private BranchStaffRepository branchStaffRepository;
    
    public Sale createSale(Long branchId, SaleRequest request) {
        // 1. Validate user has access to branch
        User currentUser = getCurrentUser();
        if (!hasAccessToBranch(currentUser, branchId)) {
            throw new UnauthorizedException("No access to branch " + branchId);
        }
        
        // 2. Validate branch exists and is active
        Branch branch = branchRepository.findById(branchId)
            .orElseThrow(() -> new NotFoundException("Branch not found"));
        if (!branch.getIsActive()) {
            throw new BusinessException("Branch is not active");
        }
        
        // 3. Create sale with branch context
        Sale sale = new Sale();
        sale.setBranch(branch);
        sale.setBranchId(branchId);
        // ... rest of logic
        
        return saleRepository.save(sale);
    }
    
    private boolean hasAccessToBranch(User user, Long branchId) {
        if (user.getRole() == Role.SUPER_ADMIN) {
            return true; // Super admin has access to all branches
        }
        return branchStaffRepository.existsByUserIdAndBranchIdAndIsActiveTrue(
            user.getId(), branchId
        );
    }
}
```

### 8.5 Transaction Management

**Use @Transactional for multi-step operations:**
```java
@Transactional
public Sale processCompleteSale(Long branchId, SaleRequest request) {
    // 1. Create sale
    Sale sale = createSale(branchId, request);
    
    // 2. Reduce inventory
    for (SaleItem item : request.getItems()) {
        inventoryService.reduceStock(
            branchId, 
            item.getProductId(), 
            item.getBatchId(), 
            item.getQuantity()
        );
    }
    
    // 3. Record payment
    if (request.getPayment() != null) {
        paymentService.recordPayment(sale, request.getPayment());
    }
    
    // 4. Update cash register
    cashRegisterService.addSale(branchId, sale.getTotalAmount());
    
    return sale;
}
```

---

## 9. MIGRATION GUIDE

### 9.1 Database Migration Steps

**Step 1: Backup Database**
```bash
pg_dump -h localhost -U postgres pharmacy_db > backup_$(date +%Y%m%d).sql
```

**Step 2: Run Migration Script**
```bash
psql -h localhost -U postgres -d pharmacy_db -f backend/branch_isolation_migration.sql
```

**Step 3: Verify Migration**
```sql
-- Check for NULL branch_ids (should return 0 for all tables)
SELECT 'employee_authorizations' as table_name, COUNT(*) as null_count 
FROM employee_authorizations WHERE branch_id IS NULL
UNION ALL
SELECT 'supplier_payments', COUNT(*) FROM supplier_payments WHERE branch_id IS NULL
UNION ALL
SELECT 'payments', COUNT(*) FROM payments WHERE branch_id IS NULL;
-- ... etc for all 13 tables
```

**Step 4: Update Backend Entities**

Add `branch_id` field to entity classes:
```java
@Entity
@Table(name = "employee_authorizations")
public class EmployeeAuthorization {
    // ... existing fields
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
    
    @Column(name = "branch_id", insertable = false, updatable = false)
    private Long branchId;
    
    // ... getters and setters
}
```

**Step 5: Update Repositories**

Add branch filtering methods:
```java
public interface EmployeeAuthorizationRepository extends JpaRepository<EmployeeAuthorization, Long> {
    List<EmployeeAuthorization> findByBranchId(Long branchId);
    
    List<EmployeeAuthorization> findByBranchIdAndStatus(Long branchId, AuthorizationStatus status);
    
    @Query("SELECT ea FROM EmployeeAuthorization ea WHERE ea.branchId = :branchId AND ea.requestedAt BETWEEN :from AND :to")
    List<EmployeeAuthorization> findByBranchAndDateRange(Long branchId, LocalDateTime from, LocalDateTime to);
}
```

**Step 6: Update Services**

Add branch filtering to service methods:
```java
@Service
public class EmployeeAuthorizationService {
    
    public List<EmployeeAuthorization> getByBranch(Long branchId) {
        validateBranchAccess(branchId);
        return repository.findByBranchId(branchId);
    }
    
    public EmployeeAuthorization create(Long branchId, AuthorizationRequest request) {
        validateBranchAccess(branchId);
        
        EmployeeAuthorization auth = new EmployeeAuthorization();
        auth.setBranchId(branchId);
        // ... rest of logic
        
        return repository.save(auth);
    }
}
```

**Step 7: Update Controllers**

Add branch parameters to endpoints:
```java
@RestController
@RequestMapping("/api/employee-authorizations")
public class EmployeeAuthorizationController {
    
    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> getByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(service.getByBranch(branchId));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> create(
        @RequestParam Long branchId,
        @RequestBody AuthorizationRequest request
    ) {
        return ResponseEntity.ok(service.create(branchId, request));
    }
}
```

**Step 8: Update Frontend**

Update API service calls:
```javascript
// services/authorizationService.js
export const authorizationService = {
  getByBranch: (branchId) => 
    api.get(`/employee-authorizations/branch/${branchId}`),
    
  create: (branchId, data) => 
    api.post(`/employee-authorizations?branchId=${branchId}`, data),
    
  getByStatus: (branchId, status) => 
    api.get(`/employee-authorizations/branch/${branchId}/status/${status}`)
};
```

Update components to use branch context:
```javascript
const AuthorizationsPage = () => {
  const { currentBranch } = useBranchStore();
  
  const { data: authorizations } = useQuery({
    queryKey: ['authorizations', currentBranch?.id],
    queryFn: () => authorizationService.getByBranch(currentBranch.id),
    enabled: !!currentBranch
  });
  
  // ... rest of component
};
```

### 9.2 Testing After Migration

**Test Checklist:**
1. ✅ Verify all branch-filtered endpoints return correct data
2. ✅ Test unauthorized branch access (should be denied)
3. ✅ Verify super admin can access all branches
4. ✅ Test branch switching in frontend
5. ✅ Verify data integrity (no orphaned records)
6. ✅ Test all CRUD operations with branch context
7. ✅ Verify reports filter by branch correctly
8. ✅ Test cross-branch operations (stock transfers)

---

## 10. TESTING CHECKLIST

### 10.1 Backend Testing

**Unit Tests:**
```java
@Test
void testGetSalesByBranch_Success() {
    Long branchId = 1L;
    when(saleRepository.findByBranchId(branchId))
        .thenReturn(Arrays.asList(sale1, sale2));
    
    List<Sale> sales = saleService.getByBranch(branchId);
    
    assertEquals(2, sales.size());
    verify(saleRepository).findByBranchId(branchId);
}

@Test
void testGetSalesByBranch_UnauthorizedBranch() {
    Long branchId = 999L;
    
    assertThrows(UnauthorizedException.class, () -> {
        saleService.getByBranch(branchId);
    });
}
```

**Integration Tests:**
```java
@SpringBootTest
@AutoConfigureMockMvc
class SaleControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetSalesByBranch() throws Exception {
        mockMvc.perform(get("/api/sales/branch/1")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].branchId").value(1));
    }
}
```

### 10.2 Frontend Testing

**Component Tests:**
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

test('renders sales data for selected branch', async () => {
  const queryClient = new QueryClient();
  const mockBranch = { id: 1, name: 'Main Branch' };
  
  useBranchStore.setState({ currentBranch: mockBranch });
  
  render(
    <QueryClientProvider client={queryClient}>
      <SalesPage />
    </QueryClientProvider>
  );
  
  await waitFor(() => {
    expect(screen.getByText('Main Branch')).toBeInTheDocument();
    expect(screen.getByText(/Total Sales/i)).toBeInTheDocument();
  });
});
```

### 10.3 Manual Testing Scenarios

**Scenario 1: Branch Isolation**
1. Login as branch A user
2. View sales - should only see branch A sales
3. Try to access branch B endpoint directly - should be denied
4. Login as super admin - should see all branches

**Scenario 2: Stock Transfer**
1. Create stock transfer from branch A to branch B
2. Verify inventory reduced at branch A
3. Approve transfer
4. Receive at branch B
5. Verify inventory increased at branch B

**Scenario 3: Multi-Branch Reporting**
1. Login as super admin
2. View system-wide sales report
3. Filter by specific branch
4. Verify numbers match branch-specific report

---

## 11. PRODUCTION DEPLOYMENT

### 11.1 Pre-Deployment Checklist

**Database:**
- [ ] Run backup
- [ ] Run migration script in test environment
- [ ] Verify migration success
- [ ] Test rollback procedure

**Backend:**
- [ ] Update all 13 entities with `branch_id`
- [ ] Update repositories with branch filtering
- [ ] Update services with branch validation
- [ ] Update controllers with branch parameters
- [ ] Remove any `@CrossOrigin(origins = "*")` annotations
- [ ] Run all unit tests
- [ ] Run integration tests
- [ ] Test authorization and access control

**Frontend:**
- [ ] Update all API service calls
- [ ] Add branch context to all components
- [ ] Test branch switching
- [ ] Test unauthorized access handling
- [ ] Run E2E tests

**Security:**
- [ ] Review CORS configuration
- [ ] Review JWT token expiration
- [ ] Review rate limiting
- [ ] Review SQL injection prevention
- [ ] Review XSS prevention

### 11.2 Deployment Steps

**1. Backend Deployment:**
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/medlan-0.0.1-SNAPSHOT.jar
```

**2. Frontend Deployment:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to hosting (Netlify/Vercel)
```

**3. Database Migration:**
```bash
# In production database
psql -h <prod-host> -U <prod-user> -d pharmacy_db \
  -f backend/branch_isolation_migration.sql
```

### 11.3 Post-Deployment Validation

**Health Checks:**
```bash
# Backend health
curl https://api.yoursite.com/actuator/health

# Test authentication
curl -X POST https://api.yoursite.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test branch-filtered endpoint
curl https://api.yoursite.com/api/sales/branch/1 \
  -H "Authorization: Bearer <token>"
```

**Smoke Tests:**
1. Login as different roles
2. Create a sale
3. View inventory
4. Generate a report
5. Switch branches
6. Create stock transfer

---

## 12. MAINTENANCE & MONITORING

### 12.1 Log Monitoring

**Application Logs:**
```bash
# Backend logs
tail -f logs/spring-boot-application.log

# Look for branch-related errors
grep "branch" logs/spring-boot-application.log | grep ERROR
```

**Database Logs:**
```sql
-- Slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 12.2 Performance Monitoring

**Key Metrics:**
- Response time for branch-filtered queries
- Database connection pool usage
- Cache hit rates
- Failed authorization attempts

**Optimization:**
```sql
-- Create indexes for branch filtering
CREATE INDEX idx_sales_branch_date ON sales(branch_id, sale_date);
CREATE INDEX idx_inventory_branch_product ON branch_inventory(branch_id, product_id);
```

### 12.3 Backup Strategy

**Daily Backups:**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U postgres pharmacy_db | gzip > backup_$DATE.sql.gz

# Keep last 30 days
find /backups -name "backup_*.sql.gz" -mtime +30 -delete
```

---

## 13. SUPPORT & TROUBLESHOOTING

### 13.1 Common Issues

**Issue 1: CORS Error**
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Verify backend CORS configuration allows frontend origin.

**Issue 2: Unauthorized Branch Access**
```
Error 403: No access to this branch
```
**Solution:** Verify user is assigned to the branch via `branch_staff` table.

**Issue 3: Missing Branch Data**
```
Query returns empty result
```
**Solution:** Verify `branchId` parameter is being sent and entity has `branch_id` column.

### 13.2 Debug Queries

```sql
-- Check user's branch assignments
SELECT u.username, b.branch_name, bs.is_primary_branch
FROM branch_staff bs
JOIN users u ON bs.user_id = u.id
JOIN branches b ON bs.branch_id = b.id
WHERE u.username = 'john.doe' AND bs.is_active = TRUE;

-- Check branch inventory levels
SELECT b.branch_name, p.product_name, bi.quantity_on_hand
FROM branch_inventory bi
JOIN branches b ON bi.branch_id = b.id
JOIN products p ON bi.product_id = p.id
WHERE b.id = 1
ORDER BY bi.quantity_on_hand;

-- Check for data without branch_id (after migration)
SELECT table_name, COUNT(*) as records_without_branch
FROM (
    SELECT 'sales' as table_name, COUNT(*) FROM sales WHERE branch_id IS NULL
    UNION ALL
    SELECT 'invoices', COUNT(*) FROM invoices WHERE branch_id IS NULL
    -- ... add all branch-isolated tables
) subquery
WHERE records_without_branch > 0;
```

---

## 14. FUTURE ENHANCEMENTS

### 14.1 Planned Features
1. **Mobile App** - React Native app for inventory management
2. **Advanced Analytics** - Machine learning for demand forecasting
3. **Supplier Portal** - Self-service portal for suppliers
4. **E-Prescription Integration** - Integration with doctor prescription systems
5. **Loyalty Program** - Customer loyalty and rewards system

### 14.2 Technical Improvements
1. **Caching** - Redis cache for frequently accessed data
2. **Message Queue** - RabbitMQ for async operations
3. **Microservices** - Split monolith into microservices
4. **GraphQL** - GraphQL API alongside REST
5. **Real-time Updates** - WebSocket for real-time inventory updates

---

## 15. APPENDIX

### 15.1 Glossary

- **GRN:** Goods Receipt Note - Document recording receipt of goods from supplier
- **RGRN:** Return Goods Receipt Note - Document for returning goods to supplier
- **PO:** Purchase Order - Order placed with supplier
- **SKU:** Stock Keeping Unit - Unique product identifier
- **Branch Isolation:** Ensuring data from one branch is not accessible to users of other branches
- **JWT:** JSON Web Token - Token-based authentication mechanism

### 15.2 References

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- React Documentation: https://react.dev
- PostgreSQL Documentation: https://www.postgresql.org/docs
- JWT.io: https://jwt.io

---

**Document Version:** 1.0.0  
**Last Updated:** February 1, 2026  
**Maintained By:** Development Team  
**Contact:** support@pharmacy-system.com

---

*This document serves as the single source of truth for the Pharmacy Management System architecture. All developers must follow the guidelines and patterns documented here to ensure system consistency and data integrity.*
