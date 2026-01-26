# GRN Workflow - Visual Guide

## 🔴 BEFORE FIX (Incorrect Understanding)

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (CONFUSED)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  grnService.verify(id)   ──────┐                            │
│  grnService.complete(id) ──────┼─→ ALL pointed to same API  │
│  grnService.approve(id)  ──────┘                            │
│                                                               │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend (ONLY ONE METHOD EXISTS)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  POST /api/grn/{id}/approve                                 │
│  ↓                                                            │
│  approveGRN(id) {                                            │
│    • Create InventoryBatch records                           │
│    • Update stock quantities                                 │
│    • Change GRN status to RECEIVED                           │
│  }                                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘

❌ Problem: Users thought verify/complete were different operations
❌ Problem: Frontend had 3 methods doing the exact same thing
❌ Problem: No clarity on which method actually updates inventory
```

---

## ✅ AFTER FIX (Correct Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (CLEAR)                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  grnService.approve(id) ──────┐                             │
│                                │                              │
│  [DEPRECATED - Aliases]        │                              │
│  useVerifyGRN()   ────┐        │                              │
│  useCompleteGRN() ────┼────────┴──→ All use useApproveGRN() │
│                       │                                       │
│  useApproveGRN() ─────┘                                      │
│  ↓                                                            │
│  • Clearly documented                                        │
│  • Single source of truth                                    │
│  • Invalidates inventory cache                               │
│                                                               │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend (UNCHANGED - Already Correct)           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  POST /api/grn/{id}/approve                                 │
│  ↓                                                            │
│  approveGRN(id) {                                            │
│    1. Validate GRN status (DRAFT or PENDING_APPROVAL)       │
│    2. For each GRN line item:                                │
│       → Create InventoryBatch                                │
│       → Set quantityReceived                                 │
│       → Set quantityAvailable                                │
│       → Link to product and branch                           │
│    3. Update GRN:                                            │
│       → status = RECEIVED                                    │
│       → approvedBy = currentUser                             │
│       → approvedAt = now()                                   │
│    4. Save to database (transaction)                         │
│  }                                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘

✅ Solution: One clear method name: approve
✅ Solution: Comprehensive documentation
✅ Solution: Backwards compatible with deprecated aliases
✅ Solution: Clear UI labels matching backend reality
```

---

## 📊 Status Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    PURCHASE ORDER WORKFLOW                        │
└──────────────────────────────────────────────────────────────────┘

    [Create PO]
         │
         ▼
    ┌─────────┐
    │  DRAFT  │  ← User creates PO with items
    └────┬────┘
         │ submit()
         ▼
 ┌──────────────────┐
 │ PENDING_APPROVAL │  ← Waiting for manager approval
 └────┬─────────────┘
      │ approve()
      ▼
 ┌──────────┐
 │ APPROVED │  ← Ready to receive goods ✅
 └──────────┘
      │
      │
      │
┌─────┴────────────────────────────────────────────────────────────┐
│                    GRN WORKFLOW (Goods Receipt)                   │
└───────────────────────────────────────────────────────────────────┘

    [Create GRN linked to approved PO]
         │
         ▼
    ┌─────────┐
    │  DRAFT  │  ← User records received quantities, batches, dates
    └────┬────┘
         │
         │ approve() ← CRITICAL: This is where inventory updates!
         │
         ▼
    ┌──────────────────────────────────────────────────────────┐
    │                        RECEIVED                          │
    │  • InventoryBatch records created ✅                     │
    │  • Product stock updated ✅                              │
    │  • Available for sale in POS ✅                          │
    │  • Purchase Order marked as received ✅                  │
    └──────────────────────────────────────────────────────────┘

Alternative paths:

    [DRAFT]
         │ reject()
         ▼
    [REJECTED]  ← GRN rejected, no inventory update


    [DRAFT]
         │ cancel()
         ▼
    [CANCELLED]  ← GRN cancelled, no inventory update
```

---

## 🔄 Data Flow: GRN Approval to Inventory Update

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: User clicks "Approve & Update Inventory" button       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Frontend calls useApproveGRN().mutate(grnId)          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: POST /api/grn/{id}/approve                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Backend GRNServiceImpl.approveGRN(id)                 │
│                                                                  │
│  1. Load GRN from database                                      │
│  2. Validate: status must be DRAFT or PENDING_APPROVAL          │
│  3. For each GRN line (product):                                │
│     ┌──────────────────────────────────────────┐               │
│     │ CREATE inventory_batch:                  │               │
│     │   - product_id                           │               │
│     │   - branch_id                            │               │
│     │   - batch_number                         │               │
│     │   - quantity_received = 100              │               │
│     │   - quantity_available = 100             │               │
│     │   - manufacturing_date                   │               │
│     │   - expiry_date                          │               │
│     │   - purchase_price (cost)                │               │
│     │   - selling_price                        │               │
│     │   - mrp                                  │               │
│     │   - is_active = true                     │               │
│     │   - grn_line_id (foreign key)           │               │
│     └──────────────────────────────────────────┘               │
│  4. UPDATE grn:                                                 │
│     - status = 'RECEIVED'                                       │
│     - approved_by = current_user_id                             │
│     - approved_at = CURRENT_TIMESTAMP                           │
│  5. COMMIT database transaction                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: Frontend receives success response                    │
│                                                                  │
│  React Query invalidates caches:                                │
│    • queryClient.invalidateQueries(["grns"])                   │
│    • queryClient.invalidateQueries(["inventory"])              │
│    • queryClient.invalidateQueries(["purchaseOrders"])         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 6: UI Updates                                             │
│                                                                  │
│  • Toast: "GRN approved - inventory updated successfully" ✅   │
│  • GRN status badge: "RECEIVED (Inventory Updated)"            │
│  • Inventory table automatically refetches → shows new stock   │
│  • POS now shows products as available                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Differences: Before vs After

| Aspect | BEFORE (Broken) | AFTER (Fixed) |
|--------|-----------------|---------------|
| **Service Methods** | 3 methods: `verify()`, `complete()`, `approve()` | 1 method: `approve()` (with deprecated aliases) |
| **Endpoint Mapping** | All 3 → same endpoint (confusing) | 1 → one endpoint (clear) |
| **Hook Names** | `useVerifyGRN()`, `useCompleteGRN()` | `useApproveGRN()` (primary), others deprecated |
| **UI Button Text** | "Complete & Update Stock" | "Approve & Update Inventory" |
| **Documentation** | None | Comprehensive inline docs |
| **User Understanding** | Confused which action updates inventory | Clear: approve = inventory update |
| **Status Labels** | Incorrect (VERIFIED, COMPLETED) | Correct (DRAFT, PENDING_APPROVAL, RECEIVED) |
| **Cache Invalidation** | Partial | Complete (inventory + GRNs + POs) |

---

## 💡 Why This Happened

1. **Frontend-Backend Mismatch**: Frontend developers assumed multiple workflow stages existed (verify → complete → approve)
2. **No Backend Endpoints**: Backend never had `/verify` or `/complete` endpoints - only `/approve`
3. **Copy-Paste Code**: Someone duplicated the approve method with different names without changing implementation
4. **Lack of Documentation**: No comments explaining what each method actually does
5. **Status Confusion**: Frontend used statuses (VERIFIED, COMPLETED) that don't exist in backend

---

## ✅ How We Fixed It

1. **Removed Duplicates**: Deleted `verify()` and `complete()` methods from service
2. **Added Documentation**: Clear JSDoc comments explaining approve updates inventory
3. **Updated Hooks**: Created `useApproveGRN()` as primary, deprecated others
4. **Fixed UI**: Changed button text and status labels to match reality
5. **Enhanced Cache**: Invalidate all related queries (inventory, GRNs, POs)
6. **Backwards Compatibility**: Kept deprecated hooks as aliases to prevent breaking existing code

---

## 🚀 Results

✅ **Inventory updates correctly** when GRN is approved  
✅ **Clear workflow** - users know approve updates stock  
✅ **No breaking changes** - deprecated hooks still work  
✅ **Better UX** - button text matches actual behavior  
✅ **Maintainable** - future developers understand the flow  

---

**For complete technical details, see:** [GRN_INVENTORY_UPDATE_FIX.md](GRN_INVENTORY_UPDATE_FIX.md)  
**For quick reference, see:** [GRN_FIX_SUMMARY.md](GRN_FIX_SUMMARY.md)
