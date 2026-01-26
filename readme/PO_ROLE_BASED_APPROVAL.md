# Purchase Order Role-Based Approval System

## Overview
The Purchase Order (PO) approval process has been enhanced to support role-based workflows, where SUPER_ADMIN users bypass the approval process entirely, while other roles follow the standard approval workflow.

## Implementation Summary

### Role-Based Approval Logic

#### SUPER_ADMIN Role
- **Create PO**: Orders are **automatically approved** upon creation
- **Status**: Created with `APPROVED` status (bypasses `DRAFT` and `PENDING_APPROVAL`)
- **Approval Details**: System automatically sets:
  - `approvedByUser`: Current user (SUPER_ADMIN)
  - `approvedAt`: Current timestamp
- **UI Behavior**: 
  - No "Submit for Approval" button shown
  - Can immediately proceed to create GRN (Goods Receipt Note)
  - Success message: "Purchase order created and automatically approved"

#### Other Roles (ADMIN, MANAGER, PHARMACIST, etc.)
- **Create PO**: Orders created with `DRAFT` status
- **Workflow**: Must follow standard approval process:
  1. **DRAFT** → Edit and prepare order
  2. Submit → **PENDING_APPROVAL** → Awaiting approval
  3. Approve/Reject → **APPROVED/REJECTED** → Final status
- **UI Behavior**:
  - "Submit for Approval" button visible for DRAFT orders
  - Approval buttons visible for authorized approvers
  - Standard success message: "Purchase order created successfully"

## Code Changes

### Backend Changes

#### 1. PurchaseOrderServiceImpl.java
**Location**: `backend/src/main/java/com/pharmacy/medlan/service/supplier/PurchaseOrderServiceImpl.java`

**Modified Method**: `createPurchaseOrder()`

```java
@Override
public PurchaseOrderResponse createPurchaseOrder(CreatePurchaseOrderRequest request) {
    // ... existing code ...
    
    User currentUser = SecurityUtils.getCurrentUser(userRepository);

    // SUPER_ADMIN doesn't need approval - auto-approve
    boolean isSuperAdmin = currentUser.getRole().name().equals("SUPER_ADMIN");
    PurchaseOrderStatus initialStatus = isSuperAdmin ? 
        PurchaseOrderStatus.APPROVED : PurchaseOrderStatus.DRAFT;

    PurchaseOrder po = PurchaseOrder.builder()
        .poNumber(generatePoNumber())
        // ... other fields ...
        .status(initialStatus)
        .createdByUser(currentUser)
        .build();

    // If SUPER_ADMIN, set approval details immediately
    if (isSuperAdmin) {
        po.setApprovedByUser(currentUser);
        po.setApprovedAt(LocalDateTime.now());
    }
    
    // ... rest of the method ...
    
    po = purchaseOrderRepository.save(po);
    if (isSuperAdmin) {
        log.info("Purchase order created and auto-approved by SUPER_ADMIN: {}", po.getPoNumber());
    } else {
        log.info("Purchase order created: {}", po.getPoNumber());
    }
    
    return purchaseOrderMapper.toResponse(po);
}
```

**Key Changes**:
- Detects if current user is SUPER_ADMIN
- Sets initial status to `APPROVED` for SUPER_ADMIN, `DRAFT` for others
- Auto-fills approval details for SUPER_ADMIN
- Enhanced logging to track auto-approvals

### Frontend Changes

#### 2. usePurchaseOrders.js Hook
**Location**: `frontend/src/features/purchase-orders/hooks/usePurchaseOrders.js`

**Modified Hook**: `useCreatePurchaseOrder()`

```javascript
export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => purchaseOrderService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      
      // Check if the order was auto-approved (SUPER_ADMIN creates orders as APPROVED)
      const orderStatus = response.data?.data?.status || response.data?.status;
      if (orderStatus === "APPROVED") {
        toast.success("Purchase order created and automatically approved");
      } else {
        toast.success("Purchase order created successfully");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create purchase order");
    },
  });
};
```

**Key Changes**:
- Detects auto-approved orders by checking response status
- Shows different success message for auto-approved orders
- Provides clear feedback to SUPER_ADMIN users

#### 3. PurchaseOrderViewPage.jsx
**Location**: `frontend/src/pages/purchase-orders/PurchaseOrderViewPage.jsx`

**Modified Logic**: Permission checks with comments

```javascript
const status = po?.status;

// Permission checks combined with status checks
// Note: SUPER_ADMIN creates orders directly as APPROVED, so they won't see DRAFT status
const canEdit = status === "DRAFT" && hasPermission("purchaseOrders", "edit");
const canSubmit = status === "DRAFT" && hasPermission("purchaseOrders", "edit");
const canApprove = status === "PENDING_APPROVAL" && hasPermission("purchaseOrders", "approve");
const canReceive = (status === "APPROVED" || status === "ORDERED") && hasPermission("grn", "create");
const canCancel = (status === "DRAFT" || status === "PENDING_APPROVAL") && hasPermission("purchaseOrders", "edit");
```

**Key Changes**:
- Added clarifying comments about SUPER_ADMIN behavior
- Permission checks remain unchanged (status-based)
- SUPER_ADMIN won't see submit button since their orders are never in DRAFT

#### 4. PurchaseOrderColumns.jsx
**Location**: `frontend/src/features/purchase-orders/components/PurchaseOrderColumns.jsx`

**Modified Logic**: Action column permissions

```javascript
// Combine status checks with permission checks
// Note: SUPER_ADMIN creates orders directly as APPROVED, bypassing DRAFT/PENDING_APPROVAL states
const canEdit = status === "DRAFT" && (!hasPermission || hasPermission("purchaseOrders", "edit"));
const canSubmit = status === "DRAFT" && (!hasPermission || hasPermission("purchaseOrders", "edit"));
const canApprove = status === "PENDING_APPROVAL" && (!hasPermission || hasPermission("purchaseOrders", "approve"));
const canReject = status === "PENDING_APPROVAL" && (!hasPermission || hasPermission("purchaseOrders", "reject"));
const canReceive = (status === "APPROVED" || status === "ORDERED") && (!hasPermission || hasPermission("grn", "create"));
```

**Key Changes**:
- Added clarifying comments about status bypass
- Action buttons rendered based on status
- SUPER_ADMIN sees appropriate actions for APPROVED status

## Status Flow Comparison

### Standard Users (ADMIN, MANAGER, PHARMACIST)
```
Create PO
    ↓
  DRAFT ←──────────────┐
    ↓                  │
Submit for Approval    │ (Can Edit)
    ↓                  │
PENDING_APPROVAL       │
    ↓         ↓        │
Approve   Reject ──────┘
    ↓
APPROVED
    ↓
Create GRN / Receive Goods
```

### SUPER_ADMIN
```
Create PO
    ↓
APPROVED (auto-approved)
    ↓
Create GRN / Receive Goods
```

## UI/UX Impact

### For SUPER_ADMIN
1. **Create PO Form**: Same experience, but order is automatically approved
2. **PO List View**: Orders appear with `APPROVED` status immediately
3. **PO Detail View**: 
   - No "Submit for Approval" button
   - No "Approve" button
   - Shows "Receive (Create GRN)" button immediately
   - Approval history shows auto-approval
4. **Success Toast**: "Purchase order created and automatically approved"

### For Other Roles
1. **Create PO Form**: Same experience as before
2. **PO List View**: Orders appear with `DRAFT` status
3. **PO Detail View**:
   - Shows "Submit for Approval" button (if in DRAFT)
   - Shows "Approve/Reject" buttons (if PENDING_APPROVAL and has permission)
   - Shows "Receive (Create GRN)" button (if APPROVED)
4. **Success Toast**: "Purchase order created successfully"

## Permissions Matrix

| Role | Create PO | View PO | Edit Draft | Submit | Approve | Reject | Create GRN |
|------|-----------|---------|------------|--------|---------|--------|------------|
| **SUPER_ADMIN** | ✅ | ✅ | N/A* | N/A* | N/A* | N/A* | ✅ |
| **ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **MANAGER** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PHARMACIST** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **INVENTORY_MANAGER** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

*N/A - Not applicable because SUPER_ADMIN orders are created as APPROVED

## Benefits

1. **Streamlined Workflow**: SUPER_ADMIN can create and process orders immediately
2. **Clear Role Separation**: Explicit distinction between admin and standard user workflows
3. **Audit Trail**: All approvals tracked with user and timestamp
4. **Flexibility**: Easy to extend to other roles if needed
5. **Security**: Backend enforcement ensures client-side bypasses are not possible

## Testing Scenarios

### Test Case 1: SUPER_ADMIN Creates PO
1. Login as SUPER_ADMIN
2. Navigate to Purchase Orders → Create Order
3. Fill in order details and submit
4. **Expected**: 
   - Success message: "Purchase order created and automatically approved"
   - Order status: APPROVED
   - Approval info populated
   - Can immediately create GRN

### Test Case 2: ADMIN Creates PO
1. Login as ADMIN
2. Navigate to Purchase Orders → Create Order
3. Fill in order details and submit
4. **Expected**:
   - Success message: "Purchase order created successfully"
   - Order status: DRAFT
   - "Submit for Approval" button visible
   - Must submit before approval

### Test Case 3: Approval Workflow
1. PHARMACIST creates PO (status: DRAFT)
2. PHARMACIST submits for approval (status: PENDING_APPROVAL)
3. ADMIN/MANAGER approves (status: APPROVED)
4. **Expected**: Standard workflow completes successfully

## Database Impact

No schema changes required. Existing fields are used:
- `status` (enum: DRAFT, PENDING_APPROVAL, APPROVED, etc.)
- `approved_by_user_id` (foreign key to users table)
- `approved_at` (timestamp)

## Security Considerations

1. **Backend Validation**: Role check performed server-side in service layer
2. **Cannot Be Bypassed**: Client cannot manipulate approval status
3. **Audit Trail**: All actions logged with user info
4. **Permission Checks**: Frontend still validates permissions for display
5. **API Security**: Existing `@PreAuthorize` annotations remain in place

## Future Enhancements

Potential improvements:
1. **Configurable Auto-Approval**: Allow configuration of which roles auto-approve
2. **Approval Limits**: Set monetary limits for auto-approval
3. **Multi-Level Approval**: Support approval chains for high-value orders
4. **Notification System**: Alert approvers when POs await their approval
5. **Approval History**: Track all approval state changes in separate table

## Rollback Plan

If issues arise, rollback is straightforward:
1. Revert service implementation to always create DRAFT status
2. Remove auto-approval logic
3. Revert frontend toast message changes
4. No database changes required

## References

- Backend Service: [PurchaseOrderServiceImpl.java](backend/src/main/java/com/pharmacy/medlan/service/supplier/PurchaseOrderServiceImpl.java)
- Frontend Hook: [usePurchaseOrders.js](frontend/src/features/purchase-orders/hooks/usePurchaseOrders.js)
- View Page: [PurchaseOrderViewPage.jsx](frontend/src/pages/purchase-orders/PurchaseOrderViewPage.jsx)
- Columns: [PurchaseOrderColumns.jsx](frontend/src/features/purchase-orders/components/PurchaseOrderColumns.jsx)
- Permissions: [permissions.js](frontend/src/constants/permissions.js)
- Roles: [roles.js](frontend/src/constants/roles.js)
