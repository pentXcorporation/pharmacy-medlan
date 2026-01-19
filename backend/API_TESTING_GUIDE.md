# 🏥 Pharmacy Management System - Complete API Testing Guide

> **Base URL:** `http://localhost:8080`
> **Swagger UI:** `http://localhost:8080/swagger-ui.html`
> **Last Updated:** January 19, 2026

---

## 📋 Table of Contents

1. [Getting Started](#1-getting-started)
2. [Authentication APIs](#2-authentication-apis)
3. [Branch Management APIs](#3-branch-management-apis)
4. [User Management APIs](#4-user-management-apis)
5. [Category Management APIs](#5-category-management-apis)
6. [Product Management APIs](#6-product-management-apis)
7. [Supplier Management APIs](#7-supplier-management-apis)
8. [Customer Management APIs](#8-customer-management-apis)
9. [Purchase Order APIs](#9-purchase-order-apis)
10. [GRN (Goods Receipt Note) APIs](#10-grn-goods-receipt-note-apis)
11. [RGRN (Return GRN) APIs](#11-rgrn-return-grn-apis)
12. [Inventory Management APIs](#12-inventory-management-apis)
13. [Inventory Maintenance APIs](#13-inventory-maintenance-apis)
14. [Stock Transfer APIs](#14-stock-transfer-apis)
15. [Sales (POS) APIs](#15-sales-pos-apis)
16. [Sale Returns APIs](#16-sale-returns-apis)
17. [Invoice Management APIs](#17-invoice-management-apis)
18. [Dashboard APIs](#18-dashboard-apis)
19. [Reports APIs](#19-reports-apis)
20. [Notification APIs](#20-notification-apis)
21. [Barcode & QR Code APIs](#21-barcode--qr-code-apis)
22. [Barcode Scanning APIs](#22-barcode-scanning-apis)
23. [Testing Workflow](#23-complete-testing-workflow)
24. [Advanced Features](#24-advanced-features)
25. [WebSocket APIs](#25-websocket-apis)
26. [System Enums Reference](#26-system-enums-reference)

---

## 1. Getting Started

### Prerequisites
- Application running on `http://localhost:8080`
- PostgreSQL database `medlan_pharmacy` created
- Postman or any REST client installed
- Java 17 or higher (for backend)
- Node.js 16+ (for frontend)

### System Architecture
The system is built with:
- **Backend**: Spring Boot 3.x with Spring Security, JWT Authentication
- **Database**: PostgreSQL with JPA/Hibernate
- **Frontend**: React with Vite
- **WebSocket**: Real-time notifications and sync
- **Scheduler**: Background tasks for alerts and reports

### Postman Setup

1. **Create Environment Variables:**
   ```
   Variable: base_url           Value: http://localhost:8080
   Variable: token              Value: (will be set after login)
   Variable: refreshToken       Value: (will be set after login)
   Variable: branchId           Value: (will be set after creating branch)
   Variable: productId          Value: (will be set after creating product)
   Variable: supplierId         Value: (will be set after creating supplier)
   Variable: customerId         Value: (will be set after creating customer)
   Variable: poId               Value: (purchase order id)
   Variable: grnId              Value: (GRN id)
   Variable: saleId             Value: (sale id)
   Variable: transferId         Value: (stock transfer id)
   ```

2. **Authorization Header (for protected endpoints):**
   ```
   Key: Authorization
   Value: Bearer {{token}}
   ```

3. **Rate Limiting:**
   - Most APIs have rate limiting enabled
   - Default: 100 requests per minute per user
   - Bulk operations: 10 requests per minute
   - Check response headers for rate limit info

---

## 2. Authentication APIs

### 2.1 Register Initial Admin User (FIRST STEP - No Auth Required)

**⭐ DO THIS FIRST - Creates the first admin user in empty database**

```http
POST {{base_url}}/api/auth/register/initial
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123",
  "fullName": "System Administrator",
  "email": "admin@medlan.com",
  "phoneNumber": "1234567890",
  "role": "ADMIN"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Initial user registered successfully",
  "data": {
    "id": 1,
    "username": "admin",
    "fullName": "System Administrator",
    "email": "admin@medlan.com",
    "role": "ADMIN",
    "active": true
  }
}
```

---

### 2.2 Login

```http
POST {{base_url}}/api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "user": {
      "id": 1,
      "username": "admin",
      "fullName": "System Administrator",
      "role": "ADMIN"
    }
  }
}
```

**📌 Save the `accessToken` to your Postman environment variable `token`**

---

### 2.3 Get Current User

```http
GET {{base_url}}/api/auth/me
Authorization: Bearer {{token}}
```

---

### 2.4 Refresh Token

```http
POST {{base_url}}/api/auth/refresh?refreshToken={{refresh_token}}
```

---

### 2.5 Change Password

```http
POST {{base_url}}/api/auth/change-password
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "admin123",
  "newPassword": "newAdmin123",
  "confirmPassword": "newAdmin123"
}
```

---

### 2.6 Logout

```http
POST {{base_url}}/api/auth/logout
Authorization: Bearer {{token}}
```

---

## 3. Branch Management APIs

### 3.1 Create Branch

```http
POST {{base_url}}/api/branches
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "branchCode": "BR001",
  "branchName": "Main Branch - Colombo",
  "address": "123 Main Street, Colombo 03",
  "city": "Colombo",
  "state": "Western Province",
  "pincode": "00300",
  "phoneNumber": "0112345678",
  "email": "mainbranch@medlan.com",
  "gstinNumber": "GST123456789",
  "drugLicenseNumber": "DL-2024-001",
  "isMainBranch": true
}
```

**📌 Save the returned `id` to Postman environment variable `branchId`**

---

### 3.2 Get All Branches (Paginated)

```http
GET {{base_url}}/api/branches?page=0&size=20
Authorization: Bearer {{token}}
```

---

### 3.3 Get All Branches (List)

```http
GET {{base_url}}/api/branches/all
Authorization: Bearer {{token}}
```

---

### 3.4 Get Active Branches

```http
GET {{base_url}}/api/branches/active
Authorization: Bearer {{token}}
```

---

### 3.5 Get Branch by ID

```http
GET {{base_url}}/api/branches/{{branchId}}
Authorization: Bearer {{token}}
```

---

### 3.6 Get Branch by Code

```http
GET {{base_url}}/api/branches/code/BR001
Authorization: Bearer {{token}}
```

---

### 3.7 Update Branch

```http
PUT {{base_url}}/api/branches/{{branchId}}
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "branchCode": "BR001",
  "branchName": "Main Branch - Colombo (Updated)",
  "address": "123 Main Street, Colombo 03",
  "city": "Colombo",
  "state": "Western Province",
  "pincode": "00300",
  "phoneNumber": "0112345679",
  "email": "mainbranch@medlan.com",
  "isMainBranch": true
}
```

---

### 3.8 Activate/Deactivate Branch

```http
POST {{base_url}}/api/branches/{{branchId}}/activate
Authorization: Bearer {{token}}
```

```http
POST {{base_url}}/api/branches/{{branchId}}/deactivate
Authorization: Bearer {{token}}
```

---

### 3.9 Delete Branch

```http
DELETE {{base_url}}/api/branches/{{branchId}}
Authorization: Bearer {{token}}
```

---

## 4. User Management APIs

### 4.1 Create User

```http
POST {{base_url}}/api/users
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "pharmacist1",
  "password": "pharma123",
  "fullName": "John Pharmacist",
  "email": "john@medlan.com",
  "phoneNumber": "0771234567",
  "role": "PHARMACIST",
  "employeeCode": "EMP001",
  "discountLimit": 10.00,
  "creditTransactionLimit": 5000.00
}
```

**Available Roles:**
- `SUPER_ADMIN` - Full system access
- `ADMIN` - Branch-level admin access
- `BRANCH_MANAGER` - Manage branch operations
- `PHARMACIST` - Dispense medicines and sales
- `CASHIER` - Sales and billing
- `INVENTORY_MANAGER` - Manage stock and inventory
- `ACCOUNTANT` - Financial operations

---

### 4.2 Get All Users (Paginated)

```http
GET {{base_url}}/api/users?page=0&size=20&sortBy=username&sortDir=asc
Authorization: Bearer {{token}}
```

---

### 4.3 Get User by ID

```http
GET {{base_url}}/api/users/1
Authorization: Bearer {{token}}
```

---

### 4.4 Get User by Username

```http
GET {{base_url}}/api/users/username/admin
Authorization: Bearer {{token}}
```

---

### 4.5 Get Users by Role

```http
GET {{base_url}}/api/users/role/PHARMACIST
Authorization: Bearer {{token}}
```

---

### 4.6 Get Active Users

```http
GET {{base_url}}/api/users/active
Authorization: Bearer {{token}}
```

---

### 4.7 Get Users by Branch

```http
GET {{base_url}}/api/users/branch/{{branchId}}
Authorization: Bearer {{token}}
```

---

### 4.8 Update User

```http
PUT {{base_url}}/api/users/1
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Pharmacist Updated",
  "email": "john.updated@medlan.com",
  "phoneNumber": "0771234568",
  "role": "PHARMACIST"
}
```

---

### 4.9 Activate/Deactivate User

```http
PATCH {{base_url}}/api/users/1/activate
Authorization: Bearer {{token}}
```

```http
PATCH {{base_url}}/api/users/1/deactivate
Authorization: Bearer {{token}}
```

---

### 4.10 Reset User Password

```http
PATCH {{base_url}}/api/users/1/reset-password?newPassword=newPassword123
Authorization: Bearer {{token}}
```

---

### 4.11 Delete User

```http
DELETE {{base_url}}/api/users/1
Authorization: Bearer {{token}}
```

---

## 5. Category Management APIs

### 5.1 Create Category

```http
POST {{base_url}}/api/categories?categoryName=Antibiotics&categoryCode=CAT001&description=Antibiotic medicines
Authorization: Bearer {{token}}
```

---

### 5.2 Get All Categories

```http
GET {{base_url}}/api/categories
Authorization: Bearer {{token}}
```

---

### 5.3 Get Active Categories

```http
GET {{base_url}}/api/categories/active
Authorization: Bearer {{token}}
```

---

### 5.4 Get Category by ID

```http
GET {{base_url}}/api/categories/1
Authorization: Bearer {{token}}
```

---

### 5.5 Update Category

```http
PUT {{base_url}}/api/categories/1?categoryName=Antibiotics Updated&description=Updated description
Authorization: Bearer {{token}}
```

---

### 5.6 Delete Category

```http
DELETE {{base_url}}/api/categories/1
Authorization: Bearer {{token}}
```

---

## 6. Product Management APIs

### 6.1 Create Product

```http
POST {{base_url}}/api/products
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "productName": "Paracetamol 500mg",
  "genericName": "Acetaminophen",
  "categoryId": 1,
  "dosageForm": "TABLET",
  "strength": "500mg",
  "drugSchedule": "OTC",
  "manufacturer": "ABC Pharmaceuticals",
  "barcode": "8901234567890",
  "description": "Pain reliever and fever reducer",
  "costPrice": 2.50,
  "sellingPrice": 5.00,
  "mrp": 6.00,
  "profitMargin": 50.00,
  "gstRate": 5.00,
  "reorderLevel": 100,
  "minimumStock": 50,
  "maximumStock": 1000,
  "isPrescriptionRequired": false,
  "isNarcotic": false,
  "isRefrigerated": false
}
```

**Available Dosage Forms:**
- `TABLET`, `CAPSULE`, `SYRUP`, `INJECTION`, `DROPS`, `CREAM`, `OINTMENT`, `GEL`, `POWDER`, `INHALER`, `SUPPOSITORY`, `SUSPENSION`, `SOLUTION`, `LOTION`, `SPRAY`, `PATCH`, `OTHER`

**Available Drug Schedules:**
- `OTC` - Over the counter
- `H` - Schedule H (Prescription required)
- `H1` - Schedule H1 (Special prescription)
- `X` - Schedule X (Narcotic/Dangerous drugs)
- `G` - Schedule G (General)

**📌 Save the returned `id` to Postman environment variable `productId`**

---

### 6.2 Get All Products (Paginated)

```http
GET {{base_url}}/api/products?page=0&size=20&sortBy=productName&sortDir=asc
Authorization: Bearer {{token}}
```

---

### 6.3 Get Product by ID

```http
GET {{base_url}}/api/products/{{productId}}
Authorization: Bearer {{token}}
```

---

### 6.4 Get Product by Code

```http
GET {{base_url}}/api/products/code/PRD001
Authorization: Bearer {{token}}
```

---

### 6.5 Search Products

```http
GET {{base_url}}/api/products/search?query=paracetamol
Authorization: Bearer {{token}}
```

---

### 6.6 Get Low Stock Products

```http
GET {{base_url}}/api/products/low-stock?branchId={{branchId}}
Authorization: Bearer {{token}}
```

---

### 6.7 Update Product

```http
PUT {{base_url}}/api/products/{{productId}}
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "productName": "Paracetamol 500mg (Updated)",
  "sellingPrice": 5.50,
  "mrp": 6.50
}
```

---

### 6.8 Discontinue Product

```http
PATCH {{base_url}}/api/products/{{productId}}/discontinue
Authorization: Bearer {{token}}
```

---

### 6.9 Delete Product

```http
DELETE {{base_url}}/api/products/{{productId}}
Authorization: Bearer {{token}}
```

---

## 7. Supplier Management APIs

### 7.1 Create Supplier

```http
POST {{base_url}}/api/suppliers
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "supplierName": "ABC Pharmaceuticals Ltd",
  "contactPerson": "Mr. Kumar",
  "phoneNumber": "0112345678",
  "email": "sales@abcpharma.com",
  "address": "456 Industrial Zone, Colombo 15",
  "city": "Colombo",
  "state": "Western Province",
  "pincode": "01500",
  "gstinNumber": "GST987654321",
  "panNumber": "PAN123456",
  "drugLicenseNumber": "DL-SUP-001",
  "defaultDiscountPercent": 5.00,
  "paymentTermDays": 30,
  "creditLimit": 100000.00
}
```

**📌 Save the returned `id` to Postman environment variable `supplierId`**

---

### 7.2 Get All Suppliers (Paginated)

```http
GET {{base_url}}/api/suppliers?page=0&size=20&sortBy=supplierName&sortDir=asc
Authorization: Bearer {{token}}
```

---

### 7.3 Get Supplier by ID

```http
GET {{base_url}}/api/suppliers/{{supplierId}}
Authorization: Bearer {{token}}
```

---

### 7.4 Get Supplier by Code

```http
GET {{base_url}}/api/suppliers/code/SUP001
Authorization: Bearer {{token}}
```

---

### 7.5 Search Suppliers

```http
GET {{base_url}}/api/suppliers/search?query=ABC
Authorization: Bearer {{token}}
```

---

### 7.6 Get Active Suppliers

```http
GET {{base_url}}/api/suppliers/active
Authorization: Bearer {{token}}
```

---

### 7.7 Update Supplier

```http
PUT {{base_url}}/api/suppliers/{{supplierId}}
Authorization: Bearer {{token}}
Content-Type: application/json
```

---

### 7.8 Activate/Deactivate Supplier

```http
PATCH {{base_url}}/api/suppliers/{{supplierId}}/activate
Authorization: Bearer {{token}}
```

```http
PATCH {{base_url}}/api/suppliers/{{supplierId}}/deactivate
Authorization: Bearer {{token}}
```

---

### 7.9 Delete Supplier

```http
DELETE {{base_url}}/api/suppliers/{{supplierId}}
Authorization: Bearer {{token}}
```

---

## 8. Customer Management APIs

### 8.1 Create Customer

```http
POST {{base_url}}/api/customers
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerName": "John Doe",
  "phoneNumber": "0771234567",
  "email": "john.doe@email.com",
  "gender": "Male",
  "dateOfBirth": "1985-05-15",
  "address": "789 Customer Street",
  "city": "Colombo",
  "state": "Western Province",
  "pincode": "00500",
  "creditLimit": 10000.00,
  "medicalHistory": "Diabetes Type 2",
  "allergies": "Penicillin",
  "insuranceProvider": "ABC Insurance",
  "insurancePolicyNumber": "INS-123456"
}
```

**📌 Save the returned `id` to Postman environment variable `customerId`**

---

### 8.2 Get All Customers (Paginated)

```http
GET {{base_url}}/api/customers?page=0&size=20&sortBy=customerName&sortDir=asc
Authorization: Bearer {{token}}
```

---

### 8.3 Get Customer by ID

```http
GET {{base_url}}/api/customers/{{customerId}}
Authorization: Bearer {{token}}
```

---

### 8.4 Get Customer by Code

```http
GET {{base_url}}/api/customers/code/CUST001
Authorization: Bearer {{token}}
```

---

### 8.5 Search Customers

```http
GET {{base_url}}/api/customers/search?query=John
Authorization: Bearer {{token}}
```

---

### 8.6 Get Active Customers

```http
GET {{base_url}}/api/customers/active
Authorization: Bearer {{token}}
```

---

### 8.7 Update Customer

```http
PUT {{base_url}}/api/customers/{{customerId}}
Authorization: Bearer {{token}}
Content-Type: application/json
```

---

### 8.8 Activate/Deactivate Customer

```http
PATCH {{base_url}}/api/customers/{{customerId}}/activate
Authorization: Bearer {{token}}
```

---

### 8.9 Delete Customer

```http
DELETE {{base_url}}/api/customers/{{customerId}}
Authorization: Bearer {{token}}
```

---

## 9. Purchase Order APIs

### 9.1 Create Purchase Order

```http
POST {{base_url}}/api/purchase-orders
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "supplierId": 1,
  "branchId": 1,
  "expectedDeliveryDate": "2024-12-25",
  "discountAmount": 50.00,
  "remarks": "Urgent order for stock replenishment",
  "supplierReference": "SUP-REF-001",
  "items": [
    {
      "productId": 1,
      "quantityOrdered": 100,
      "unitPrice": 2.50,
      "discountPercent": 5.00,
      "gstRate": 5.00,
      "remarks": "Standard batch"
    },
    {
      "productId": 2,
      "quantityOrdered": 50,
      "unitPrice": 10.00,
      "discountPercent": 0,
      "gstRate": 12.00
    }
  ]
}
```

---

### 9.2 Get All Purchase Orders (Paginated)

```http
GET {{base_url}}/api/purchase-orders?page=0&size=20&sortBy=createdAt&sortDir=desc
Authorization: Bearer {{token}}
```

---

### 9.3 Get Purchase Order by ID

```http
GET {{base_url}}/api/purchase-orders/1
Authorization: Bearer {{token}}
```

---

### 9.4 Get Purchase Order by PO Number

```http
GET {{base_url}}/api/purchase-orders/number/PO-2024-001
Authorization: Bearer {{token}}
```

---

### 9.5 Get Purchase Orders by Supplier

```http
GET {{base_url}}/api/purchase-orders/supplier/{{supplierId}}
Authorization: Bearer {{token}}
```

---

### 9.6 Get Purchase Orders by Branch

```http
GET {{base_url}}/api/purchase-orders/branch/{{branchId}}
Authorization: Bearer {{token}}
```

---

### 9.7 Get Purchase Orders by Status

```http
GET {{base_url}}/api/purchase-orders/status/DRAFT
Authorization: Bearer {{token}}
```

**Available Status:**
- `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `SENT_TO_SUPPLIER`, `PARTIALLY_RECEIVED`, `FULLY_RECEIVED`, `CANCELLED`

---

### 9.8 Get Purchase Orders by Date Range

```http
GET {{base_url}}/api/purchase-orders/date-range?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

---

### 9.9 Approve Purchase Order

```http
POST {{base_url}}/api/purchase-orders/1/approve
Authorization: Bearer {{token}}
```

---

### 9.10 Reject Purchase Order

```http
POST {{base_url}}/api/purchase-orders/1/reject?reason=Budget constraints
Authorization: Bearer {{token}}
```

---

### 9.11 Update Purchase Order Status

```http
PUT {{base_url}}/api/purchase-orders/1/status?status=SENT_TO_SUPPLIER
Authorization: Bearer {{token}}
```

---

### 9.12 Delete Purchase Order

```http
DELETE {{base_url}}/api/purchase-orders/1
Authorization: Bearer {{token}}
```

---

## 10. GRN (Goods Receipt Note) APIs

### Overview
GRN is the process of receiving goods from suppliers and adding them to inventory. This is crucial for inventory management.

### 10.1 Create GRN (Receive Stock)

```http
POST {{base_url}}/api/grn
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "supplierId": 1,
  "branchId": 1,
  "purchaseOrderId": 1,
  "receivedDate": "2024-12-19",
  "supplierInvoiceNumber": "INV-SUP-001",
  "supplierInvoiceDate": "2024-12-18",
  "remarks": "First batch received",
  "items": [
    {
      "productId": 1,
      "batchNumber": "BATCH-2024-001",
      "quantity": 100,
      "costPrice": 2.50,
      "sellingPrice": 5.00,
      "manufacturingDate": "2024-06-01",
      "expiryDate": "2026-06-01",
      "discountAmount": 0
    },
    {
      "productId": 2,
      "batchNumber": "BATCH-2024-002",
      "quantity": 50,
      "costPrice": 10.00,
      "sellingPrice": 18.00,
      "manufacturingDate": "2024-01-01",
      "expiryDate": "2025-12-31"
    }
  ]
}
```

**⚠️ IMPORTANT: This API adds stock to inventory and creates inventory batches!**

**Response:**
```json
{
  "success": true,
  "message": "GRN created successfully",
  "data": {
    "id": 1,
    "grnNumber": "GRN-2024-001",
    "status": "PENDING",
    "totalAmount": 750.00
  }
}
```

---

### 10.2 Update GRN

```http
PUT {{base_url}}/api/grn/1
Authorization: Bearer {{token}}
Content-Type: application/json
```

---

### 10.3 Get All GRNs (Paginated)

```http
GET {{base_url}}/api/grn?page=0&size=20
Authorization: Bearer {{token}}
```

---

### 10.4 Get GRN by ID

```http
GET {{base_url}}/api/grn/1
Authorization: Bearer {{token}}
```

---

### 10.5 Get GRN by Number

```http
GET {{base_url}}/api/grn/number/GRN-2024-001
Authorization: Bearer {{token}}
```

---

### 10.6 Get GRNs by Branch

```http
GET {{base_url}}/api/grn/branch/{{branchId}}?page=0&size=20
Authorization: Bearer {{token}}
```

---

### 10.7 Get GRNs by Supplier

```http
GET {{base_url}}/api/grn/supplier/{{supplierId}}?page=0&size=20
Authorization: Bearer {{token}}
```

---

### 10.8 Get GRNs by Date Range

```http
GET {{base_url}}/api/grn/date-range?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

---

### 10.9 Get GRNs by Status

```http
GET {{base_url}}/api/grn/status/PENDING?page=0&size=20
Authorization: Bearer {{token}}
```

**Available Status:**
- `PENDING` - Awaiting approval
- `APPROVED` - Approved and inventory updated
- `REJECTED` - Rejected
- `CANCELLED` - Cancelled

---

### 10.10 Approve GRN

```http
POST {{base_url}}/api/grn/1/approve
Authorization: Bearer {{token}}
```

**🔥 This updates inventory and creates batches**

---

### 10.11 Reject GRN

```http
POST {{base_url}}/api/grn/1/reject?reason=Quality issues found
Authorization: Bearer {{token}}
```

---

### 10.12 Cancel GRN

```http
POST {{base_url}}/api/grn/1/cancel?reason=Duplicate entry
Authorization: Bearer {{token}}
```

---

## 11. RGRN (Return GRN) APIs

### Overview
RGRN handles returns to suppliers for damaged, expired, or excess stock.

### 11.1 Create RGRN (Return to Supplier)

```http
POST {{base_url}}/api/rgrns
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "supplierId": 1,
  "branchId": 1,
  "originalGrnId": 1,
  "returnDate": "2024-12-20",
  "returnReason": "DAMAGED",
  "remarks": "Products damaged during transit",
  "items": [
    {
      "productId": 1,
      "inventoryBatchId": 1,
      "quantityReturned": 5,
      "returnAmount": 12.50,
      "remarks": "Packaging damaged"
    }
  ]
}
```

**Return Reasons:**
- `DAMAGED` - Damaged goods
- `EXPIRED` - Expired products
- `QUALITY_ISSUE` - Quality problems
- `EXCESS_STOCK` - Over-ordered
- `WRONG_ITEM` - Wrong product received
- `OTHER` - Other reasons

---

### 11.2 Get All RGRNs (Paginated)

```http
GET {{base_url}}/api/rgrns?page=0&size=20&sortBy=createdAt&sortDir=desc
Authorization: Bearer {{token}}
```

---

### 11.3 Get RGRN by ID

```http
GET {{base_url}}/api/rgrns/1
Authorization: Bearer {{token}}
```

---

### 11.4 Get RGRN by Number

```http
GET {{base_url}}/api/rgrns/number/RGRN-2024-001
Authorization: Bearer {{token}}
```

---

### 11.5 Get RGRNs by Supplier

```http
GET {{base_url}}/api/rgrns/supplier/{{supplierId}}
Authorization: Bearer {{token}}
```

---

### 11.6 Get RGRNs by Branch

```http
GET {{base_url}}/api/rgrns/branch/{{branchId}}
Authorization: Bearer {{token}}
```

---

### 11.7 Get RGRNs by Original GRN

```http
GET {{base_url}}/api/rgrns/grn/1
Authorization: Bearer {{token}}
```

---

### 11.8 Get RGRNs by Refund Status

```http
GET {{base_url}}/api/rgrns/refund-status/PENDING
Authorization: Bearer {{token}}
```

**Refund Status:**
- `PENDING` - Awaiting refund
- `PARTIAL` - Partial refund received
- `COMPLETED` - Full refund received
- `REJECTED` - Refund rejected

---

### 11.9 Get RGRNs by Date Range

```http
GET {{base_url}}/api/rgrns/date-range?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

---

### 11.10 Update RGRN Refund Status

```http
PUT {{base_url}}/api/rgrns/1/refund-status?refundStatus=COMPLETED
Authorization: Bearer {{token}}
```

---

### 11.11 Delete RGRN (Admin Only)

```http
DELETE {{base_url}}/api/rgrns/1
Authorization: Bearer {{token}}
```

---

## 12. Inventory Management APIs

### Overview
Comprehensive inventory tracking with batch management, expiry tracking, and multi-branch support.

### 12.1 Get Low Stock Inventory (All Branches)

```http
GET {{base_url}}/api/inventory/low-stock
Authorization: Bearer {{token}}
```

**Response:** Returns all products across all branches that are below reorder level.

---

### 12.2 Get Out of Stock Inventory (All Branches)

```http
GET {{base_url}}/api/inventory/out-of-stock
Authorization: Bearer {{token}}
```

**Response:** Returns products with zero stock across all branches.

---

### 12.3 Get Inventory by Product and Branch

```http
GET {{base_url}}/api/inventory/product/{{productId}}/branch/{{branchId}}
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productId": 1,
    "productName": "Paracetamol 500mg",
    "branchId": 1,
    "quantityOnHand": 150,
    "quantityAvailable": 150,
    "quantityAllocated": 0,
    "reorderLevel": 100,
    "minimumStock": 50,
    "maximumStock": 1000
  }
}
```

---

### 12.4 Get All Inventory by Branch (Paginated)

```http
GET {{base_url}}/api/inventory/branch/{{branchId}}?page=0&size=20
Authorization: Bearer {{token}}
```

---

### 12.5 Get Low Stock Inventory by Branch

```http
GET {{base_url}}/api/inventory/branch/{{branchId}}/low-stock
Authorization: Bearer {{token}}
```

---

### 12.6 Get Out of Stock Inventory by Branch

```http
GET {{base_url}}/api/inventory/branch/{{branchId}}/out-of-stock
Authorization: Bearer {{token}}
```

---

### 12.7 Get Batches by Product and Branch

```http
GET {{base_url}}/api/inventory/batches/product/{{productId}}/branch/{{branchId}}
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "batchNumber": "BATCH-2024-001",
      "quantityAvailable": 100,
      "costPrice": 2.50,
      "sellingPrice": 5.00,
      "manufacturingDate": "2024-06-01",
      "expiryDate": "2026-06-01",
      "daysToExpiry": 547
    },
    {
      "id": 2,
      "batchNumber": "BATCH-2024-002",
      "quantityAvailable": 50,
      "costPrice": 2.45,
      "sellingPrice": 5.00,
      "manufacturingDate": "2024-07-01",
      "expiryDate": "2026-07-01",
      "daysToExpiry": 577
    }
  ]
}
```

---

### 12.8 Get Expiring Batches

```http
GET {{base_url}}/api/inventory/branch/{{branchId}}/expiring?alertDate=2025-01-31
Authorization: Bearer {{token}}
```

**Use Case:** Find batches expiring before a certain date for alerts and returns.

---

### 12.9 Get Expired Batches

```http
GET {{base_url}}/api/inventory/branch/{{branchId}}/expired
Authorization: Bearer {{token}}
```

**Use Case:** Identify expired stock that needs to be removed or returned.

---

### 12.10 Get Available Quantity for Product

```http
GET {{base_url}}/api/inventory/available-quantity/product/{{productId}}/branch/{{branchId}}
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": 150
}
```

**Use Case:** Quick check for POS before making a sale.

---

### 12.11 Get All Expiring Batches (All Branches)

```http
GET {{base_url}}/api/inventory/expiring?days=90&page=0&size=20
Authorization: Bearer {{token}}
```

**Parameters:**
- `days` - Number of days threshold (default: 90)
- `page` - Page number
- `size` - Page size

---

### 12.12 Get All Expired Batches (All Branches)

```http
GET {{base_url}}/api/inventory/expired?page=0&size=20
Authorization: Bearer {{token}}
```

---

## 13. Inventory Maintenance APIs

### Overview
Administrative tools for fixing and maintaining inventory data integrity. **Use with caution!**

### 13.1 Sync Branch Inventory

```http
POST {{base_url}}/api/inventory/maintenance/sync-branch-inventory
Authorization: Bearer {{token}}
```

**⚠️ CRITICAL:** This rebuilds the entire `branch_inventory` table from `inventory_batches`.

**Use When:**
- Branch inventory shows incorrect values
- After data migration
- When inventory batches exist but branch inventory is empty

**Response:**
```json
{
  "success": true,
  "data": {
    "beforeCount": 0,
    "deletedCount": 0,
    "insertedCount": 245,
    "afterCount": 245,
    "message": "Branch inventory synchronized successfully"
  }
}
```

**What it does:**
1. Deletes all existing branch_inventory records
2. Aggregates data from inventory_batches
3. Creates new branch_inventory records
4. Returns statistics

---

### 13.2 Get Branch Inventory Status

```http
GET {{base_url}}/api/inventory/maintenance/branch-inventory-status
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "branchInventoryRecords": 245,
    "inventoryBatchesWithStock": 312,
    "expectedBranchInventoryRecords": 245,
    "needsSync": false
  }
}
```

**Use Case:** Diagnostic check before syncing.

---

### 13.3 Diagnostic Check for Product/Branch

```http
GET {{base_url}}/api/inventory/maintenance/diagnostic/{{productId}}/{{branchId}}
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productExists": true,
    "branchExists": true,
    "inventoryBatchesCount": 3,
    "branchInventoryExists": true,
    "availableCombinations": [
      {
        "productId": 1,
        "branchId": 1,
        "totalQty": 150
      }
    ]
  }
}
```

**Use Case:** Debug why a specific product isn't showing up in inventory.

---

## 14. Stock Transfer APIs

### Overview
Transfer stock between branches with approval workflow and automatic inventory updates.

### 14.1 Create Stock Transfer

```http
POST {{base_url}}/api/stock-transfers
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "fromBranchId": 1,
  "toBranchId": 2,
  "expectedReceiptDate": "2024-12-20",
  "remarks": "Urgent stock requirement at branch 2",
  "items": [
    {
      "productId": 1,
      "inventoryBatchId": 1,
      "quantityTransferred": 50,
      "remarks": "Transfer from main stock"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Stock transfer created successfully",
  "data": {
    "id": 1,
    "transferNumber": "ST-2024-001",
    "status": "PENDING",
    "fromBranchName": "Main Branch",
    "toBranchName": "Branch 2"
  }
}
```

---

### 14.2 Get All Stock Transfers (Paginated)

```http
GET {{base_url}}/api/stock-transfers?page=0&size=20&sortBy=createdAt&sortDir=desc
Authorization: Bearer {{token}}
```

---

### 14.3 Get Stock Transfer by ID

```http
GET {{base_url}}/api/stock-transfers/1
Authorization: Bearer {{token}}
```

---

### 14.4 Get Stock Transfer by Number

```http
GET {{base_url}}/api/stock-transfers/number/ST-2024-001
Authorization: Bearer {{token}}
```

---

### 14.5 Get Transfers from Branch

```http
GET {{base_url}}/api/stock-transfers/from-branch/{{branchId}}
Authorization: Bearer {{token}}
```

**Use Case:** See all outgoing transfers from a branch.

---

### 14.6 Get Transfers to Branch

```http
GET {{base_url}}/api/stock-transfers/to-branch/{{branchId}}
Authorization: Bearer {{token}}
```

**Use Case:** See all incoming transfers to a branch.

---

### 14.7 Get All Transfers for a Branch (Both Directions)

```http
GET {{base_url}}/api/stock-transfers/branch/{{branchId}}
Authorization: Bearer {{token}}
```

---

### 14.8 Get Transfers by Status

```http
GET {{base_url}}/api/stock-transfers/status/PENDING
Authorization: Bearer {{token}}
```

**Available Status:**
- `PENDING` - Awaiting approval
- `APPROVED` - Approved by manager
- `IN_TRANSIT` - Stock dispatched
- `RECEIVED` - Stock received at destination
- `PARTIALLY_RECEIVED` - Some items received
- `REJECTED` - Transfer rejected
- `CANCELLED` - Transfer cancelled

---

### 14.9 Get Transfers by Date Range

```http
GET {{base_url}}/api/stock-transfers/date-range?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

---

### 14.10 Approve Stock Transfer

```http
POST {{base_url}}/api/stock-transfers/1/approve
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Optional Request Body:**
```json
{
  "approvedBy": 2,
  "approvalRemarks": "Approved for urgent requirement"
}
```

**Effect:** Changes status to APPROVED, ready for dispatch.

---

### 14.11 Receive Stock Transfer

```http
POST {{base_url}}/api/stock-transfers/1/receive?receivedByUserId=3
Authorization: Bearer {{token}}
```

**Effect:** 
- Updates inventory at destination branch
- Reduces inventory at source branch
- Changes status to RECEIVED

---

### 14.12 Reject Stock Transfer

```http
POST {{base_url}}/api/stock-transfers/1/reject?reason=Insufficient stock at source
Authorization: Bearer {{token}}
```

---

### 14.13 Cancel Stock Transfer

```http
POST {{base_url}}/api/stock-transfers/1/cancel?reason=No longer needed
Authorization: Bearer {{token}}
```

---

## 15. Sales (POS) APIs

### Overview
Point of Sale system for billing, payment processing, and customer transactions.

### 15.1 Create Sale (Make a Sale)

```http
POST {{base_url}}/api/sales
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerId": 1,
  "branchId": 1,
  "items": [
    {
      "productId": 1,
      "inventoryBatchId": 1,
      "quantity": 2,
      "discountAmount": 0
    },
    {
      "productId": 2,
      "inventoryBatchId": 2,
      "quantity": 1,
      "discountAmount": 0
    }
  ],
  "discountAmount": 5.00,
  "paymentMethod": "CASH",
  "paidAmount": 50.00,
  "patientName": "John Doe",
  "doctorName": "Dr. Smith",
  "prescriptionNumber": "RX-2024-001",
  "remarks": "Prescription sale"
}
```

**Available Payment Methods:**
- `CASH` - Cash payment
- `CARD` - Debit/Credit Card
- `UPI` - UPI Payment
- `CHEQUE` - Cheque
- `BANK_TRANSFER` - Bank Transfer
- `CREDIT` - Credit Sale (pay later)
- `INSURANCE` - Insurance claim

**Response:**
```json
{
  "success": true,
  "message": "Sale created successfully",
  "data": {
    "id": 1,
    "saleNumber": "SALE-2024-001",
    "totalAmount": 45.00,
    "paidAmount": 50.00,
    "changeAmount": 5.00,
    "status": "COMPLETED",
    "invoiceNumber": "INV-2024-001"
  }
}
```

**Effect:**
- Reduces inventory
- Creates invoice
- Generates receipt
- Updates customer purchase history

---

### 15.2 Get All Sales (Paginated)

```http
GET {{base_url}}/api/sales?page=0&size=20
Authorization: Bearer {{token}}
```

---

### 15.3 Get Sale by ID

```http
GET {{base_url}}/api/sales/1
Authorization: Bearer {{token}}
```

---

### 15.4 Get Sale by Sale Number

```http
GET {{base_url}}/api/sales/number/SALE-2024-001
Authorization: Bearer {{token}}
```

---

### 15.5 Get Sales by Branch

```http
GET {{base_url}}/api/sales/branch/{{branchId}}?page=0&size=20
Authorization: Bearer {{token}}
```

---

### 15.6 Get Sales by Customer

```http
GET {{base_url}}/api/sales/customer/{{customerId}}?page=0&size=20
Authorization: Bearer {{token}}
```

**Use Case:** Customer purchase history.

---

### 15.7 Get Sales by Date Range

```http
GET {{base_url}}/api/sales/date-range?startDate=2024-12-01T00:00:00&endDate=2024-12-31T23:59:59
Authorization: Bearer {{token}}
```

**⚠️ Note:** Use ISO DateTime format with time component.

---

### 15.8 Get Sales by Branch and Date Range

```http
GET {{base_url}}/api/sales/branch/{{branchId}}/date-range?startDate=2024-12-01T00:00:00&endDate=2024-12-31T23:59:59
Authorization: Bearer {{token}}
```

**Use Case:** Daily sales report for a branch.

---

### 15.9 Get Sales by Status

```http
GET {{base_url}}/api/sales/status/COMPLETED?page=0&size=20
Authorization: Bearer {{token}}
```

**Available Status:**
- `PENDING` - Sale initiated but not completed
- `COMPLETED` - Sale completed successfully
- `CANCELLED` - Sale cancelled
- `VOIDED` - Sale voided (admin action)
- `PARTIALLY_RETURNED` - Some items returned
- `FULLY_RETURNED` - All items returned

---

### 15.10 Get Total Sales Amount

```http
GET {{base_url}}/api/sales/branch/{{branchId}}/total?startDate=2024-12-01T00:00:00&endDate=2024-12-31T23:59:59
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": 125750.50
}
```

---

### 15.11 Get Sales Count

```http
GET {{base_url}}/api/sales/branch/{{branchId}}/count?startDate=2024-12-01T00:00:00&endDate=2024-12-31T23:59:59
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": 352
}
```

---

### 15.12 Cancel Sale

```http
POST {{base_url}}/api/sales/1/cancel?reason=Customer requested cancellation
Authorization: Bearer {{token}}
```

**Effect:** Restores inventory, marks sale as cancelled.

---

### 15.13 Void Sale (Admin Only)

```http
POST {{base_url}}/api/sales/1/void?reason=Billing error
Authorization: Bearer {{token}}
```

**Effect:** Voids sale completely, restores inventory. Requires ADMIN role.

---

## 16. Sale Returns APIs

### Overview
Handle customer returns with refund processing and inventory restoration.

### 16.1 Create Sale Return

```http
POST {{base_url}}/api/sale-returns
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "saleId": 1,
  "customerId": 1,
  "branchId": 1,
  "returnDate": "2024-12-20",
  "returnReason": "DEFECTIVE",
  "refundMethod": "CASH",
  "items": [
    {
      "saleItemId": 1,
      "productId": 1,
      "quantityReturned": 1,
      "returnAmount": 5.00,
      "remarks": "Product defective"
    }
  ],
  "remarks": "Full refund provided"
}
```

**Return Reasons:**
- `DEFECTIVE` - Product defective
- `EXPIRED` - Product expired
- `WRONG_ITEM` - Wrong product given
- `CUSTOMER_CHANGED_MIND` - Customer changed mind
- `ADVERSE_REACTION` - Medical adverse reaction
- `OTHER` - Other reasons

---

### 16.2 Get All Sale Returns (Paginated)

```http
GET {{base_url}}/api/sale-returns?page=0&size=20&sortBy=createdAt&sortDir=desc
Authorization: Bearer {{token}}
```

---

### 16.3 Get Sale Return by ID

```http
GET {{base_url}}/api/sale-returns/1
Authorization: Bearer {{token}}
```

---

### 16.4 Get Sale Return by Number

```http
GET {{base_url}}/api/sale-returns/number/SR-2024-001
Authorization: Bearer {{token}}
```

---

### 16.5 Get Sale Returns by Customer

```http
GET {{base_url}}/api/sale-returns/customer/{{customerId}}
Authorization: Bearer {{token}}
```

---

### 16.6 Get Sale Returns by Branch

```http
GET {{base_url}}/api/sale-returns/branch/{{branchId}}
Authorization: Bearer {{token}}
```

---

### 16.7 Get Sale Returns by Date Range

```http
GET {{base_url}}/api/sale-returns/date-range?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

---

### 16.8 Delete Sale Return (Admin Only)

```http
DELETE {{base_url}}/api/sale-returns/1
Authorization: Bearer {{token}}
```

---

## 17. Invoice Management APIs

### Overview
Manage invoices for credit sales and track payment status.

### 17.1 Get Invoice by ID

```http
GET {{base_url}}/api/invoices/1
Authorization: Bearer {{token}}
```

---

### 17.2 Get Invoice by Number

```http
GET {{base_url}}/api/invoices/number/INV-2024-001
Authorization: Bearer {{token}}
```

---

### 17.3 Get All Invoices (Paginated)

```http
GET {{base_url}}/api/invoices?page=0&size=20
Authorization: Bearer {{token}}
```

---

### 17.4 Get Invoices by Branch

```http
GET {{base_url}}/api/invoices/branch/{{branchId}}?page=0&size=20
Authorization: Bearer {{token}}
```

---

### 17.5 Get Invoices by Customer

```http
GET {{base_url}}/api/invoices/customer/{{customerId}}?page=0&size=20
Authorization: Bearer {{token}}
```

---

### 17.6 Get Invoices by Date Range

```http
GET {{base_url}}/api/invoices/date-range?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

---

### 17.7 Get Invoices by Status

```http
GET {{base_url}}/api/invoices/status/PAID?page=0&size=20
Authorization: Bearer {{token}}
```

**Invoice Status:**
- `DRAFT` - Not yet finalized
- `PENDING` - Awaiting payment
- `PAID` - Fully paid
- `PARTIALLY_PAID` - Partial payment received
- `OVERDUE` - Payment overdue
- `CANCELLED` - Invoice cancelled
- `VOIDED` - Invoice voided

---

### 17.8 Get Invoices by Payment Status

```http
GET {{base_url}}/api/invoices/payment-status/PENDING?page=0&size=20
Authorization: Bearer {{token}}
```

**Payment Status:**
- `PENDING` - Awaiting payment
- `PARTIAL` - Partially paid
- `COMPLETED` - Fully paid
- `FAILED` - Payment failed
- `REFUNDED` - Payment refunded
- `CANCELLED` - Payment cancelled

---

### 17.9 Record Payment for Invoice

```http
POST {{base_url}}/api/invoices/1/payment?amount=500.00&paymentReference=PAY-REF-001
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment recorded",
  "data": {
    "invoiceId": 1,
    "amountPaid": 500.00,
    "balanceRemaining": 0.00,
    "paymentStatus": "COMPLETED"
  }
}
```

---

### 17.10 Get Total Outstanding by Customer

```http
GET {{base_url}}/api/invoices/customer/{{customerId}}/outstanding
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": 2500.00
}
```

---

### 17.11 Get Overdue Invoices

```http
GET {{base_url}}/api/invoices/overdue
Authorization: Bearer {{token}}
```

**Use Case:** Collection follow-up list.

---

## 18. Dashboard APIs

### Overview
Real-time business intelligence and analytics for management decisions.

### 18.1 Get Dashboard Summary

```http
GET {{base_url}}/api/dashboard/summary?branchId={{branchId}}
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "todaySummary": {
      "totalSales": 12500.00,
      "salesCount": 45,
      "totalPurchases": 8500.00,
      "purchasesCount": 3,
      "profit": 4000.00,
      "newCustomers": 5
    },
    "monthlySummary": {
      "totalSales": 350000.00,
      "salesCount": 1250,
      "totalPurchases": 220000.00,
      "totalProfit": 130000.00,
      "averageDailySales": 11666.67
    },
    "inventoryAlerts": {
      "lowStockCount": 12,
      "outOfStockCount": 3,
      "expiringCount": 8,
      "expiredCount": 2
    },
    "recentSales": [],
    "topSellingProducts": []
  }
}
```

---

### 18.2 Get Sales Chart Data

```http
GET {{base_url}}/api/dashboard/sales-chart?branchId={{branchId}}&days=7
Authorization: Bearer {{token}}
```

**Parameters:**
- `branchId` - Branch ID
- `days` - Number of days to show (default: 7)

**Use Case:** Generate charts for sales trends.

---

## 19. Reports APIs

### Overview
Comprehensive reporting system for sales, inventory, and financial analysis.

### 📊 Sales Reports

#### 19.1 Get Total Sales

```http
GET {{base_url}}/api/reports/sales/total?branchId={{branchId}}&startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

**Response:** Returns total sales amount as BigDecimal.

---

#### 19.2 Get Sales Count

```http
GET {{base_url}}/api/reports/sales/count?branchId={{branchId}}&startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

---

#### 19.3 Get Sales Details Report

```http
GET {{base_url}}/api/reports/sales/details?branchId={{branchId}}&startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

**Response:** Detailed list of all sales with items.

---

#### 19.4 Get Daily Sales Summary

```http
GET {{base_url}}/api/reports/sales/daily?branchId={{branchId}}&startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "2024-12-01": 12500.00,
  "2024-12-02": 15200.00,
  "2024-12-03": 11800.00
}
```

---

#### 19.5 Get Top Selling Products

```http
GET {{base_url}}/api/reports/sales/top-products?branchId={{branchId}}&startDate=2024-12-01&endDate=2024-12-31&limit=10
Authorization: Bearer {{token}}
```

**Response:**
```json
[
  {
    "productId": 1,
    "productName": "Paracetamol 500mg",
    "quantitySold": 250,
    "totalRevenue": 1250.00,
    "profitMargin": 50.00
  }
]
```

---

#### 19.6 Get Sales by Payment Method

```http
GET {{base_url}}/api/reports/sales/by-payment-method?branchId={{branchId}}&startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

**Response:**
```json
[
  {
    "paymentMethod": "CASH",
    "totalAmount": 75000.00,
    "transactionCount": 320
  },
  {
    "paymentMethod": "CARD",
    "totalAmount": 45000.00,
    "transactionCount": 180
  }
]
```

---

#### 19.7 Compare Sales Periods

```http
GET {{base_url}}/api/reports/sales/comparison?branchId={{branchId}}&startDate1=2024-11-01&endDate1=2024-11-30&startDate2=2024-12-01&endDate2=2024-12-31
Authorization: Bearer {{token}}
```

**Use Case:** Compare current month vs last month performance.

---

### 📦 Inventory Reports

#### 19.8 Get Total Stock Value

```http
GET {{base_url}}/api/reports/inventory/stock-value?branchId={{branchId}}
Authorization: Bearer {{token}}
```

**Response:** Total value of all inventory.

---

#### 19.9 Get Stock Value by Category

```http
GET {{base_url}}/api/reports/inventory/stock-value/by-category?branchId={{branchId}}
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "Antibiotics": 125000.00,
  "Analgesics": 85000.00,
  "Vitamins": 45000.00
}
```

---

#### 19.10 Get Low Stock Report

```http
GET {{base_url}}/api/reports/inventory/low-stock?branchId={{branchId}}
Authorization: Bearer {{token}}
```

**Response:**
```json
[
  {
    "productId": 1,
    "productName": "Paracetamol 500mg",
    "currentStock": 45,
    "reorderLevel": 100,
    "minimumStock": 50,
    "deficit": 55
  }
]
```

---

#### 19.11 Get Expiring Stock Report

```http
GET {{base_url}}/api/reports/inventory/expiring?branchId={{branchId}}&daysToExpiry=30
Authorization: Bearer {{token}}
```

---

#### 19.12 Get Expired Stock Report

```http
GET {{base_url}}/api/reports/inventory/expired?branchId={{branchId}}
Authorization: Bearer {{token}}
```

---

#### 19.13 Get Inventory Summary

```http
GET {{base_url}}/api/reports/inventory/summary?branchId={{branchId}}
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "totalProducts": 450,
  "totalStockValue": 2550000.00,
  "lowStockItems": 12,
  "outOfStockItems": 3,
  "expiringItems": 8,
  "expiredItems": 2,
  "averageStockTurnover": 4.5
}
```

---

#### 19.14 Get Dead Stock Report

```http
GET {{base_url}}/api/reports/inventory/dead-stock?branchId={{branchId}}&daysSinceLastSale=90
Authorization: Bearer {{token}}
```

**Use Case:** Identify slow-moving items for clearance sales.

---

### 💰 Financial Reports

#### 19.15 Get Total Revenue

```http
GET {{base_url}}/api/reports/financial/revenue?branchId={{branchId}}&startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

---

#### 19.16 Get Daily Revenue

```http
GET {{base_url}}/api/reports/financial/daily-revenue?branchId={{branchId}}&startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

---

#### 19.17 Get Profit & Loss Report

```http
GET {{base_url}}/api/reports/financial/profit-loss?branchId={{branchId}}&startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "revenue": 350000.00,
  "costOfGoodsSold": 220000.00,
  "grossProfit": 130000.00,
  "operatingExpenses": 45000.00,
  "netProfit": 85000.00,
  "profitMargin": 24.29
}
```

---

#### 19.18 Get Cash Flow Report

```http
GET {{base_url}}/api/reports/financial/cash-flow?branchId={{branchId}}&startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

---

#### 19.19 Get Total Receivables

```http
GET {{base_url}}/api/reports/financial/receivables?branchId={{branchId}}
Authorization: Bearer {{token}}
```

**Response:** Total amount owed by customers.

---

#### 19.20 Get Ageing Report

```http
GET {{base_url}}/api/reports/financial/ageing?branchId={{branchId}}&type=receivables
Authorization: Bearer {{token}}
```

**Parameters:**
- `type` - "receivables" or "payables"

**Response:**
```json
[
  {
    "ageRange": "0-30 days",
    "amount": 45000.00,
    "count": 25
  },
  {
    "ageRange": "31-60 days",
    "amount": 22000.00,
    "count": 12
  },
  {
    "ageRange": "61-90 days",
    "amount": 8000.00,
    "count": 4
  },
  {
    "ageRange": "90+ days",
    "amount": 3500.00,
    "count": 2
  }
]
```

---

#### 19.21 Get Tax Summary

```http
GET {{base_url}}/api/reports/financial/tax-summary?branchId={{branchId}}&startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "totalSales": 350000.00,
  "taxableSales": 335000.00,
  "gst5Percent": 8375.00,
  "gst12Percent": 15600.00,
  "gst18Percent": 9450.00,
  "totalGstCollected": 33425.00
}
```

---

### 🚨 Alert Reports

#### 19.22 Get All Alerts

```http
GET {{base_url}}/api/reports/alerts?branchId={{branchId}}
Authorization: Bearer {{token}}
```

---

#### 19.23 Get Alert Count

```http
GET {{base_url}}/api/reports/alerts/count?branchId={{branchId}}
Authorization: Bearer {{token}}
```

---

#### 19.24 Get Low Stock Alerts

```http
GET {{base_url}}/api/reports/alerts/low-stock?branchId={{branchId}}
Authorization: Bearer {{token}}
```

---

#### 19.25 Get Expiry Alerts

```http
GET {{base_url}}/api/reports/alerts/expiry?branchId={{branchId}}&daysThreshold=30
Authorization: Bearer {{token}}
```

---

#### 19.26 Get Overdue Invoice Alerts

```http
GET {{base_url}}/api/reports/alerts/overdue-invoices?branchId={{branchId}}
Authorization: Bearer {{token}}
```

---

#### 19.27 Acknowledge Alert

```http
POST {{base_url}}/api/reports/alerts/1/acknowledge
Authorization: Bearer {{token}}
```

---

## 20. Notification APIs

### Overview
Real-time notification system with WebSocket support and multi-channel delivery.

### 20.1 Get All Notifications for Current User

```http
GET {{base_url}}/api/notifications
Authorization: Bearer {{token}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": [
    {
      "id": 1,
      "type": "LOW_STOCK_ALERT",
      "title": "Low Stock Alert",
      "message": "Product XYZ is running low on stock",
      "referenceId": 123,
      "referenceType": "PRODUCT",
      "isRead": false,
      "priority": "HIGH",
      "createdAt": "2024-12-29T10:30:00"
    }
  ],
  "timestamp": "2024-12-29T10:30:00"
}
```

**🔥 Rate Limit:** 100 requests per minute

---

### 20.2 Get Unread Notifications

```http
GET {{base_url}}/api/notifications/unread
Authorization: Bearer {{token}}
```

---

### 20.3 Get Unread Notification Count

```http
GET {{base_url}}/api/notifications/count
Authorization: Bearer {{token}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Unread count retrieved successfully",
  "data": {
    "unreadCount": 5
  },
  "timestamp": "2024-12-29T10:30:00"
}
```

---

### 20.4 Send Notification (Admin/Manager Only)

```http
POST {{base_url}}/api/notifications
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": 2,
  "title": "Important Update",
  "message": "Please check the inventory for expired products",
  "type": "SYSTEM_ALERT",
  "priority": "HIGH",
  "referenceId": null,
  "referenceType": null
}
```

**Notification Types Available:**
- `LOW_STOCK_ALERT` - Low stock warning
- `CRITICAL_STOCK_ALERT` - Critical stock level
- `OUT_OF_STOCK_ALERT` - Out of stock
- `EXPIRY_ALERT` - Product expiry warning
- `EXPIRED_PRODUCT_ALERT` - Product expired
- `NEAR_EXPIRY_ALERT` - Near expiry warning
- `SALE` - Sale notification
- `GRN` - GRN notification
- `STOCK_TRANSFER` - Stock transfer notification
- `PAYMENT_DUE` - Payment due reminder
- `PAYMENT_RECEIVED` - Payment received
- `SYSTEM_ALERT` - System alert
- `USER` - User notification
- `MAINTENANCE` - Maintenance notification

**Priority Levels:**
- `LOW` - Low priority
- `NORMAL` - Normal priority
- `HIGH` - High priority
- `URGENT` - Urgent notification

**🔥 Rate Limit:** 50 requests per minute

---

### 20.5 Send Bulk Notifications (Admin/Manager Only)

```http
POST {{base_url}}/api/notifications/bulk?userIds=1,2,3,4
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "System Maintenance Notice",
  "message": "The system will be under maintenance from 2 AM to 4 AM",
  "type": "MAINTENANCE",
  "priority": "HIGH"
}
```

**🔥 Rate Limit:** 10 requests per minute

---

### 20.6 Send Notification to Branch (Admin/Manager Only)

```http
POST {{base_url}}/api/notifications/branch/{{branchId}}
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Branch Update",
  "message": "New inventory policies are now in effect",
  "type": "SYSTEM_ALERT",
  "priority": "NORMAL"
}
```

---

### 20.7 Send Notification to Role (Admin/Manager Only)

```http
POST {{base_url}}/api/notifications/role?branchId={{branchId}}&role=CASHIER
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Cashier Training",
  "message": "Mandatory training session at 3 PM today",
  "type": "USER",
  "priority": "HIGH"
}
```

**Available Roles:**
- `SUPER_ADMIN`, `ADMIN`, `BRANCH_MANAGER`, `PHARMACIST`, `CASHIER`, `INVENTORY_MANAGER`, `ACCOUNTANT`

---

### 20.8 Mark Notification as Read

```http
PUT {{base_url}}/api/notifications/1/read
Authorization: Bearer {{token}}
```

---

### 20.9 Mark All Notifications as Read

```http
PUT {{base_url}}/api/notifications/read-all
Authorization: Bearer {{token}}
```

**🔥 Rate Limit:** 50 requests per minute

---

### 20.10 Delete Notification

```http
DELETE {{base_url}}/api/notifications/1
Authorization: Bearer {{token}}
```

---

### 20.11 Delete All Notifications

```http
DELETE {{base_url}}/api/notifications/all
Authorization: Bearer {{token}}
```

**🔥 Rate Limit:** 10 requests per minute

---

## 21. Barcode & QR Code APIs

### Overview
Generate, scan, and manage barcodes and QR codes for products, batches, invoices, and prescriptions.

### 📊 Barcode Generation

#### 21.1 Generate Single Barcode

```http
POST {{base_url}}/api/barcodes/generate
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "MED-PRD-001",
  "format": "CODE_128",
  "width": 300,
  "height": 100
}
```

**Barcode Formats Available:**
- `CODE_128` - Most versatile, alphanumeric (default)
- `CODE_39` - Alphanumeric with limited special chars
- `EAN_13` - 13-digit European Article Number
- `EAN_8` - 8-digit compact EAN
- `UPC_A` - 12-digit Universal Product Code (North America)
- `UPC_E` - Compressed 6-digit UPC
- `ITF` - Interleaved 2 of 5 (numeric only)
- `CODABAR` - Numeric with special characters

**Response:**
```json
{
  "success": true,
  "message": "Barcode generated successfully",
  "data": {
    "content": "MED-PRD-001",
    "format": "CODE_128",
    "base64Image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

---

#### 21.2 Generate Product Barcode

```http
GET {{base_url}}/api/barcodes/product/{{productId}}?format=CODE_128
Authorization: Bearer {{token}}
```

**Response:** Base64-encoded barcode image

---

#### 21.3 Generate Bulk Barcodes for Products

```http
POST {{base_url}}/api/barcodes/bulk
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "productIds": [1, 2, 3, 4, 5],
  "format": "CODE_128"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "1": {
      "productCode": "PRD-001",
      "barcodeImage": "data:image/png;base64,..."
    },
    "2": {
      "productCode": "PRD-002",
      "barcodeImage": "data:image/png;base64,..."
    }
  }
}
```

---

#### 21.4 Generate Shelf Label

```http
GET {{base_url}}/api/barcodes/shelf-label/{{productId}}?format=EAN_13
Authorization: Bearer {{token}}
```

**Response:** Shelf label with product name, price, and barcode.

---

### 🔲 QR Code Generation

#### 21.5 Generate QR Code

```http
POST {{base_url}}/api/barcodes/qr/generate?data={"productId":123,"name":"Paracetamol"}&size=250
Authorization: Bearer {{token}}
```

**Parameters:**
- `data` - JSON string or plain text
- `size` - QR code size in pixels (default: 250)

---

#### 21.6 Generate Product QR Code

```http
GET {{base_url}}/api/barcodes/qr/product/{{productId}}?includeBatchInfo=true&size=250
Authorization: Bearer {{token}}
```

**Parameters:**
- `includeBatchInfo` - Include batch details (default: false)
- `size` - QR code size

**Response:**
```json
{
  "success": true,
  "data": {
    "productId": 1,
    "qrCodeImage": "data:image/png;base64,...",
    "embeddedData": {
      "productId": 1,
      "productCode": "PRD-001",
      "productName": "Paracetamol 500mg",
      "price": 5.00
    }
  }
}
```

---

#### 21.7 Generate Batch QR Code (Traceability)

```http
GET {{base_url}}/api/barcodes/qr/batch/{{batchId}}?size=250
Authorization: Bearer {{token}}
```

**Use Case:** Product authentication and supply chain traceability.

**Embedded Data:**
- Batch number
- Manufacturing date
- Expiry date
- Manufacturer details
- Authenticity token

---

#### 21.8 Generate Invoice QR Code (GST Compliance)

```http
GET {{base_url}}/api/barcodes/qr/invoice/{{invoiceId}}
Authorization: Bearer {{token}}
```

**Use Case:** GST e-invoice compliance, customer receipt verification.

**Embedded Data:**
- Invoice number
- Date and time
- Total amount
- Tax details
- Business GSTIN

---

#### 21.9 Generate Prescription QR Code

```http
GET {{base_url}}/api/barcodes/qr/prescription/{{prescriptionId}}
Authorization: Bearer {{token}}
```

**Use Case:** Digital prescription verification, medicine dispensing tracking.

---

### 🔍 Barcode/QR Code Reading

#### 21.10 Decode Barcode from Image

```http
POST {{base_url}}/api/barcodes/decode/barcode
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "base64Image": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Barcode decoded successfully",
  "data": "MED-PRD-001"
}
```

---

#### 21.11 Decode QR Code from Image

```http
POST {{base_url}}/api/barcodes/decode/qr
Authorization: Bearer {{token}}
Content-Type: application/json
```

---

### 🔧 Utility Endpoints

#### 21.12 Validate Barcode Format

```http
GET {{base_url}}/api/barcodes/validate?barcode=1234567890123&format=EAN_13
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "message": "Barcode is valid",
  "data": true
}
```

---

#### 21.13 Generate Unique Barcode

```http
GET {{base_url}}/api/barcodes/generate-unique?prefix=MED
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": "MED-2024-001-ABC123"
}
```

**Use Case:** Generate unique barcode for new products.

---

#### 21.14 Generate EAN-13 with Check Digit

```http
GET {{base_url}}/api/barcodes/generate-ean13?baseNumber=123456789012
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": "1234567890128"
}
```

---

#### 21.15 Get Supported Barcode Formats

```http
GET {{base_url}}/api/barcodes/formats
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": [
    "CODE_128",
    "CODE_39",
    "EAN_13",
    "EAN_8",
    "UPC_A",
    "UPC_E",
    "ITF",
    "CODABAR",
    "QR_CODE"
  ]
}
```

---

## 22. Barcode Scanning APIs

### Overview
High-performance scanning with context-aware processing and FIFO inventory management.

### 22.1 Process Scan with Context

```http
POST {{base_url}}/api/scan
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "scanData": "8901234567890",
  "branchId": 1,
  "context": "POS",
  "userId": 1
}
```

**Scan Contexts:**
- `POS` - Point of Sale
- `RECEIVING` - Goods receiving
- `STOCK_TAKING` - Physical inventory count
- `STOCK_TRANSFER` - Inter-branch transfer
- `RETURN` - Product return
- `VERIFICATION` - Product verification

**Response:**
```json
{
  "success": true,
  "message": "Scan processed successfully",
  "data": {
    "success": true,
    "scanType": "BARCODE",
    "context": "POS",
    "product": {
      "id": 1,
      "productCode": "PRD-001",
      "productName": "Paracetamol 500mg",
      "sellingPrice": 5.00,
      "availableQuantity": 150
    },
    "batches": [
      {
        "batchId": 1,
        "batchNumber": "BATCH-2024-001",
        "quantity": 100,
        "expiryDate": "2026-06-01"
      }
    ],
    "errorMessage": null
  }
}
```

**🔥 Rate Limit:** 100 requests per minute per user

---

### 22.2 Quick POS Lookup

```http
GET {{base_url}}/api/scan/pos/8901234567890?branchId={{branchId}}
Authorization: Bearer {{token}}
```

**Use Case:** Ultra-fast product lookup during billing.

**🔥 Rate Limit:** 200 requests per minute per user

---

### 22.3 Lookup for Receiving

```http
GET {{base_url}}/api/scan/receiving/8901234567890?branchId={{branchId}}
Authorization: Bearer {{token}}
```

**Use Case:** Verify products during GRN creation.

---

### 22.4 Lookup for Stock Taking

```http
GET {{base_url}}/api/scan/stock-taking/8901234567890?branchId={{branchId}}
Authorization: Bearer {{token}}
```

**Use Case:** Physical inventory count and reconciliation.

---

### 22.5 Verify Product Authenticity (QR)

```http
POST {{base_url}}/api/scan/verify?qrData={encrypted-data}
Authorization: Bearer {{token}}
```

**Use Case:** Anti-counterfeit verification.

---

### 22.6 Process Batch QR Scan

```http
POST {{base_url}}/api/scan/batch-qr?qrData={batch-data}&branchId={{branchId}}
Authorization: Bearer {{token}}
```

**Use Case:** Batch-level traceability and expiry tracking.

---

### 22.7 Bulk Scan Processing

```http
POST {{base_url}}/api/scan/bulk
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "barcodes": ["8901234567890", "8901234567891", "8901234567892"],
  "branchId": 1,
  "context": "STOCK_TAKING"
}
```

**⚠️ Limit:** Maximum 100 barcodes per request

**🔥 Rate Limit:** 10 requests per minute (bulk operations)

---

### 22.8 Get Scan History

```http
GET {{base_url}}/api/scan/history?branchId={{branchId}}&userId=1&limit=50
Authorization: Bearer {{token}}
```

**Use Case:** Audit trail for scanning activities.

---

### 22.9 Get Available Scan Contexts

```http
GET {{base_url}}/api/scan/contexts
Authorization: Bearer {{token}}
```

---

## 23. Complete Testing Workflow

Follow this systematic order to test all APIs comprehensively:

### Phase 1: Initial Setup ✅ **REQUIRED FIRST**
1. ✅ **Register Initial Admin** - `POST /api/auth/register/initial`
2. ✅ **Login** - `POST /api/auth/login` (💾 Save token!)
3. ✅ **Get Current User** - `GET /api/auth/me` (Verify authentication)
4. ✅ **Create Main Branch** - `POST /api/branches` (💾 Save branchId!)

### Phase 2: Master Data Configuration
5. ✅ **Create Categories** - `POST /api/categories`
   - Antibiotics
   - Analgesics
   - Vitamins
   - Cardiovascular
6. ✅ **Create Products** - `POST /api/products` (💾 Save productIds!)
   - At least 5-10 products for testing
7. ✅ **Create Suppliers** - `POST /api/suppliers` (💾 Save supplierIds!)
8. ✅ **Create Customers** - `POST /api/customers` (💾 Save customerIds!)
9. ✅ **Create Additional Users** - `POST /api/users`
   - Pharmacist
   - Cashier
   - Inventory Manager

### Phase 3: Procurement Workflow (Stock In)
10. ✅ **Create Purchase Order** - `POST /api/purchase-orders`
11. ✅ **Approve Purchase Order** - `POST /api/purchase-orders/{id}/approve`
12. ✅ **Create GRN** - `POST /api/grn` ⚡ **This adds stock!**
13. ✅ **Approve GRN** - `POST /api/grn/{id}/approve` ⚡ **This updates inventory!**
14. ✅ **Check Inventory** - `GET /api/inventory/branch/{branchId}`
15. ✅ **Check Batches** - `GET /api/inventory/batches/product/{productId}/branch/{branchId}`

### Phase 4: Inventory Management
16. ✅ **Check Branch Inventory Status** - `GET /api/inventory/maintenance/branch-inventory-status`
17. ✅ **Sync if Needed** - `POST /api/inventory/maintenance/sync-branch-inventory`
18. ✅ **Get Low Stock** - `GET /api/inventory/branch/{branchId}/low-stock`
19. ✅ **Get Expiring Products** - `GET /api/inventory/branch/{branchId}/expiring`
20. ✅ **Get Product Availability** - `GET /api/inventory/available-quantity/product/{productId}/branch/{branchId}`

### Phase 5: Barcode & QR Code Setup
21. ✅ **Generate Product Barcodes** - `POST /api/barcodes/bulk`
22. ✅ **Generate QR Codes** - `GET /api/barcodes/qr/product/{productId}`
23. ✅ **Test Barcode Scanning** - `POST /api/scan`

### Phase 6: Sales Workflow (Stock Out)
24. ✅ **Quick Scan for POS** - `GET /api/scan/pos/{barcode}?branchId={branchId}`
25. ✅ **Create Sale** - `POST /api/sales` ⚡ **This reduces inventory!**
26. ✅ **Check Sale Details** - `GET /api/sales/{id}`
27. ✅ **Check Invoice** - `GET /api/invoices/number/{invoiceNumber}`
28. ✅ **Check Updated Inventory** - `GET /api/inventory/product/{productId}/branch/{branchId}`

### Phase 7: Returns & Adjustments
29. ✅ **Create Sale Return** - `POST /api/sale-returns`
30. ✅ **Create RGRN (Return to Supplier)** - `POST /api/rgrns`
31. ✅ **Check Inventory After Returns** - `GET /api/inventory/branch/{branchId}`

### Phase 8: Multi-Branch Operations
32. ✅ **Create Second Branch** - `POST /api/branches`
33. ✅ **Create Stock Transfer** - `POST /api/stock-transfers`
34. ✅ **Approve Stock Transfer** - `POST /api/stock-transfers/{id}/approve`
35. ✅ **Receive Stock Transfer** - `POST /api/stock-transfers/{id}/receive`
36. ✅ **Verify Inventory in Both Branches** 

### Phase 9: Reporting & Analytics
37. ✅ **Dashboard Summary** - `GET /api/dashboard/summary?branchId={branchId}`
38. ✅ **Sales Reports** - `GET /api/reports/sales/*`
39. ✅ **Inventory Reports** - `GET /api/reports/inventory/*`
40. ✅ **Financial Reports** - `GET /api/reports/financial/*`
41. ✅ **Top Selling Products** - `GET /api/reports/sales/top-products`

### Phase 10: Notifications & Alerts
42. ✅ **Get All Notifications** - `GET /api/notifications`
43. ✅ **Check Alert Count** - `GET /api/reports/alerts/count`
44. ✅ **Low Stock Alerts** - `GET /api/reports/alerts/low-stock`
45. ✅ **Expiry Alerts** - `GET /api/reports/alerts/expiry`

### Phase 11: Advanced Operations
46. ✅ **Record Invoice Payment** - `POST /api/invoices/{id}/payment`
47. ✅ **Get Overdue Invoices** - `GET /api/invoices/overdue`
48. ✅ **Sales by Payment Method** - `GET /api/reports/sales/by-payment-method`
49. ✅ **Profit & Loss Report** - `GET /api/reports/financial/profit-loss`
50. ✅ **Dead Stock Report** - `GET /api/reports/inventory/dead-stock`

---

## 24. Advanced Features

### 🔐 Security Features

**Role-Based Access Control (RBAC):**
- `SUPER_ADMIN` - Full system access
- `ADMIN` - Branch-level management
- `BRANCH_MANAGER` - Branch operations
- `PHARMACIST` - Dispensing & sales
- `CASHIER` - POS operations
- `INVENTORY_MANAGER` - Stock management
- `ACCOUNTANT` - Financial operations

**JWT Token Management:**
- Access token expires in 24 hours
- Refresh token for seamless re-authentication
- Token blacklisting on logout

**Rate Limiting:**
- Default: 100 requests/minute
- Bulk operations: 10 requests/minute
- Scan operations: 200 requests/minute

### 📊 Background Schedulers

The system runs automated background tasks:

**LowStockAlertScheduler:**
- Runs every 6 hours
- Checks products below reorder level
- Sends notifications to inventory managers

**ExpiryAlertScheduler:**
- Runs daily at 2 AM
- Checks products expiring within 30/60/90 days
- Sends tiered alerts (urgent, warning, info)

**SessionCleanupScheduler:**
- Runs every hour
- Cleans up expired tokens
- Removes inactive sessions

**ReportGenerationScheduler:**
- Runs daily at 3 AM
- Pre-generates daily reports
- Caches frequently accessed reports

**SyncScheduler:**
- Runs every 15 minutes
- Syncs data across branches (if enabled)
- Handles offline data reconciliation

### 🌐 WebSocket Support

Real-time updates via WebSocket:

**Notification WebSocket:**
- Endpoint: `ws://localhost:8080/ws/notifications`
- Receives real-time notifications
- Auto-reconnect on disconnect

**Sync WebSocket:**
- Endpoint: `ws://localhost:8080/ws/sync`
- Real-time data synchronization
- Multi-branch inventory updates

**Connection Example:**
```javascript
const ws = new WebSocket('ws://localhost:8080/ws/notifications');
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  console.log('New notification:', notification);
};
```

### 🔍 Advanced Search

**Product Search:**
- Search by name, code, barcode, generic name
- Fuzzy matching supported
- Category and supplier filters

**Customer Search:**
- Name, phone, email search
- Purchase history lookup
- Outstanding balance queries

### 📈 Performance Optimization

**Batch Operations:**
- Bulk barcode generation
- Bulk product import
- Batch inventory updates

**Caching:**
- Product catalog caching
- Category hierarchy caching
- User permissions caching

**Database Optimization:**
- Indexed queries
- Pagination for large datasets
- Read replicas for reports

### 🔄 Data Integrity

**Inventory Consistency:**
- ACID transactions for stock movements
- Batch-level tracking
- Automatic reconciliation

**Audit Trail:**
- All transactions logged
- User action tracking
- Data change history

### 📱 API Rate Limits Summary

| Endpoint Type | Rate Limit | Burst |
|--------------|------------|-------|
| Authentication | 5/min | 10 |
| General APIs | 100/min | 120 |
| Scan APIs | 200/min | 250 |
| Bulk Operations | 10/min | 15 |
| Reports | 50/min | 60 |
| Notifications | 100/min | 120 |

---

## 25. WebSocket APIs

### Overview
Real-time bidirectional communication for notifications and data synchronization.

### Notification WebSocket

**Connection URL:**
```
ws://localhost:8080/ws/notifications?token=YOUR_JWT_TOKEN
```

**Message Format (Server → Client):**
```json
{
  "type": "NOTIFICATION",
  "data": {
    "id": 123,
    "title": "Low Stock Alert",
    "message": "Paracetamol 500mg is below reorder level",
    "type": "LOW_STOCK_ALERT",
    "priority": "HIGH",
    "timestamp": "2024-12-29T10:30:00"
  }
}
```

**Notification Types:**
- `LOW_STOCK_ALERT`
- `OUT_OF_STOCK_ALERT`
- `EXPIRY_ALERT`
- `NEW_SALE`
- `NEW_GRN`
- `STOCK_TRANSFER`
- `SYSTEM_ALERT`

### Sync WebSocket

**Connection URL:**
```
ws://localhost:8080/ws/sync?branchId={branchId}&token=YOUR_JWT_TOKEN
```

**Message Format (Server → Client):**
```json
{
  "type": "INVENTORY_UPDATE",
  "data": {
    "productId": 1,
    "branchId": 1,
    "quantityBefore": 150,
    "quantityAfter": 148,
    "reason": "SALE",
    "timestamp": "2024-12-29T10:30:00"
  }
}
```

**Sync Types:**
- `INVENTORY_UPDATE` - Stock level changed
- `PRICE_UPDATE` - Product price changed
- `PRODUCT_UPDATE` - Product details updated
- `BATCH_UPDATE` - Batch information updated

**Client → Server Heartbeat:**
```json
{
  "type": "PING",
  "timestamp": "2024-12-29T10:30:00"
}
```

**Server → Client Response:**
```json
{
  "type": "PONG",
  "timestamp": "2024-12-29T10:30:01"
}
```

---

## 26. System Enums Reference

### Roles
- `SUPER_ADMIN` - System administrator
- `ADMIN` - Branch administrator
- `BRANCH_MANAGER` - Branch operations manager
- `PHARMACIST` - Licensed pharmacist
- `CASHIER` - POS cashier
- `INVENTORY_MANAGER` - Inventory/stock manager
- `ACCOUNTANT` - Financial accountant

### Payment Methods
- `CASH` - Cash payment
- `CARD` - Debit/Credit card
- `UPI` - UPI/Digital payment
- `CHEQUE` - Cheque payment
- `BANK_TRANSFER` - Bank transfer
- `CREDIT` - Credit sale (pay later)
- `INSURANCE` - Insurance claim

### Payment Status
- `PENDING` - Payment pending
- `PARTIAL` - Partially paid
- `COMPLETED` - Fully paid
- `FAILED` - Payment failed
- `REFUNDED` - Payment refunded
- `CANCELLED` - Payment cancelled

### Purchase Order Status
- `DRAFT` - Draft PO
- `PENDING_APPROVAL` - Awaiting approval
- `APPROVED` - Approved
- `REJECTED` - Rejected
- `SENT_TO_SUPPLIER` - Sent to supplier
- `PARTIALLY_RECEIVED` - Partially received
- `FULLY_RECEIVED` - Fully received
- `CANCELLED` - Cancelled

### GRN Status
- `PENDING` - Awaiting approval
- `APPROVED` - Approved
- `REJECTED` - Rejected
- `CANCELLED` - Cancelled

### Stock Transfer Status
- `PENDING` - Awaiting approval
- `APPROVED` - Approved
- `IN_TRANSIT` - In transit
- `RECEIVED` - Received
- `PARTIALLY_RECEIVED` - Partially received
- `REJECTED` - Rejected
- `CANCELLED` - Cancelled

### Sale Status
- `PENDING` - Sale pending
- `COMPLETED` - Sale completed
- `CANCELLED` - Sale cancelled
- `VOIDED` - Sale voided
- `PARTIALLY_RETURNED` - Partially returned
- `FULLY_RETURNED` - Fully returned

### Invoice Status
- `DRAFT` - Draft invoice
- `PENDING` - Awaiting payment
- `PAID` - Fully paid
- `PARTIALLY_PAID` - Partially paid
- `OVERDUE` - Payment overdue
- `CANCELLED` - Invoice cancelled
- `VOIDED` - Invoice voided

### Dosage Forms
- `TABLET` - Tablet
- `CAPSULE` - Capsule
- `SYRUP` - Syrup/Liquid
- `INJECTION` - Injection
- `DROPS` - Drops (eye/ear)
- `CREAM` - Cream
- `OINTMENT` - Ointment
- `GEL` - Gel
- `POWDER` - Powder
- `INHALER` - Inhaler
- `SUPPOSITORY` - Suppository
- `SUSPENSION` - Suspension
- `SOLUTION` - Solution
- `LOTION` - Lotion
- `SPRAY` - Spray
- `PATCH` - Transdermal patch
- `OTHER` - Other

### Drug Schedules
- `OTC` - Over the counter
- `H` - Schedule H (Prescription required)
- `H1` - Schedule H1 (Special prescription)
- `X` - Schedule X (Narcotic)
- `G` - Schedule G (General)

### Notification Types
- `LOW_STOCK_ALERT`
- `CRITICAL_STOCK_ALERT`
- `OUT_OF_STOCK_ALERT`
- `EXPIRY_ALERT`
- `EXPIRED_PRODUCT_ALERT`
- `NEAR_EXPIRY_ALERT`
- `SALE`
- `GRN`
- `STOCK_TRANSFER`
- `PAYMENT_DUE`
- `PAYMENT_RECEIVED`
- `SYSTEM_ALERT`
- `USER`
- `MAINTENANCE`

### Alert Levels
- `LOW` - Low priority
- `MEDIUM` - Medium priority
- `HIGH` - High priority
- `CRITICAL` - Critical alert

### Barcode Formats
- `CODE_128` - Versatile alphanumeric
- `CODE_39` - Basic alphanumeric
- `EAN_13` - 13-digit international
- `EAN_8` - 8-digit compact
- `UPC_A` - 12-digit North American
- `UPC_E` - 6-digit compact UPC
- `ITF` - Interleaved 2 of 5
- `CODABAR` - Numeric with special
- `QR_CODE` - 2D QR code

### Scan Contexts
- `POS` - Point of Sale
- `RECEIVING` - Goods receiving
- `STOCK_TAKING` - Physical count
- `STOCK_TRANSFER` - Inter-branch transfer
- `RETURN` - Product return
- `VERIFICATION` - Product verification

---

## 📝 Response Format

All APIs return responses in this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-12-19T10:30:00"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Field validation error 1", "Field validation error 2"],
  "timestamp": "2024-12-19T10:30:00"
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": {
    "content": [...],
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5,
    "first": true,
    "last": false
  }
}
```

---

## 🔐 Authentication Notes

1. All endpoints except `/api/auth/login` and `/api/auth/register/initial` require authentication
2. Token expires after 24 hours (86400000 ms)
3. Use refresh token to get new access token
4. Include token in header: `Authorization: Bearer <token>`

---

## 🎯 Quick Test Commands (cURL)

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Branches (with token)
```bash
curl -X GET http://localhost:8080/api/branches/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📚 Additional Resources

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI Spec**: http://localhost:8080/v3/api-docs
- **Actuator Health**: http://localhost:8080/actuator/health

---

**Happy Testing! 🚀**
