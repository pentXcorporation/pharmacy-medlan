# Cheque System Integration Test Plan

## Pre-Test Setup

### 1. Database Setup
- [ ] Run `cheque_financial_integration.sql` migration
- [ ] Verify `incoming_cheques` table has new columns
- [ ] Verify foreign key to `bank_data` exists
- [ ] Check indexes are created

### 2. Backend Setup
- [ ] Spring Boot application running
- [ ] No compilation errors
- [ ] Check logs for successful startup
- [ ] Verify ChequeController is mapped to `/api/cheques`

### 3. Frontend Setup
- [ ] Frontend dev server running (npm run dev)
- [ ] `.env` file has correct `VITE_API_BASE_URL`
- [ ] No console errors on page load
- [ ] User logged in with ACCOUNTANT/OWNER/SUPER_ADMIN role

### 4. Prerequisites
- [ ] At least one active bank account exists (Finance → Banks)
- [ ] User has valid JWT token (logged in)

## Test Cases

### Test 1: Create New Cheque
**Steps**:
1. Navigate to Finance → Cheques
2. Click "New Cheque" button
3. Fill in form:
   - Cheque Number: "TEST001"
   - Cheque Date: Today's date
   - Deposit Date: Today's date
   - Bank Account: Select from dropdown
   - Amount: 5000.00
   - Status: PENDING
   - Received From: "Test Customer"
   - Company: "Test Company"
   - Reference Number: "INV-TEST-001"
   - Remarks: "Test cheque creation"
4. Click "Create Cheque"

**Expected Results**:
- [ ] Form validates all required fields
- [ ] Success toast notification appears
- [ ] Cheque appears in the list
- [ ] Statistics update to show new cheque
- [ ] Cheque number is "TEST001"
- [ ] Amount is ₹5,000.00
- [ ] Status badge shows "PENDING" (yellow)

**API Verification**:
```bash
# Check backend logs for:
POST /api/cheques - Status: 201 Created
```

---

### Test 2: View Cheque List
**Steps**:
1. On Cheques page, observe the data table

**Expected Results**:
- [ ] Table displays all cheques
- [ ] Columns: Cheque #, Date, Bank, Received From, Amount, Status, Clearance Date, Actions
- [ ] Data is sorted by Cheque Date (desc) by default
- [ ] Pagination controls visible if > 10 records
- [ ] Status badges colored correctly:
  - PENDING: Yellow
  - CLEARED: Green
  - BOUNCED: Red
  - DEPOSITED: Blue

---

### Test 3: Edit Existing Cheque
**Steps**:
1. Click "Edit" on TEST001 cheque
2. Change amount to 6000.00
3. Change remarks to "Updated test cheque"
4. Click "Update Cheque"

**Expected Results**:
- [ ] Form opens with pre-filled data
- [ ] All fields editable
- [ ] Success toast after update
- [ ] Amount in list updates to ₹6,000.00
- [ ] Remarks updated in database

**API Verification**:
```bash
# Check backend logs for:
PUT /api/cheques/1 - Status: 200 OK
```

---

### Test 4: Filter by Status
**Steps**:
1. Use status filter dropdown
2. Select "Pending"
3. Observe filtered results
4. Select "All Status"

**Expected Results**:
- [ ] List filters to show only PENDING cheques
- [ ] Other statuses hidden
- [ ] Statistics remain unchanged (shows all)
- [ ] "All Status" shows all cheques again

**API Verification**:
```bash
GET /api/cheques?status=PENDING&page=0&size=10
```

---

### Test 5: Search Functionality
**Steps**:
1. Type "TEST" in search box
2. Observe results
3. Clear search box

**Expected Results**:
- [ ] Only cheques matching "TEST" appear
- [ ] Matches cheque number, payer, or company
- [ ] Clearing search shows all cheques again

---

### Test 6: Pagination
**Steps**:
1. If > 10 cheques exist, test pagination
2. Click "Next" page
3. Change page size to 25
4. Navigate to page 2

**Expected Results**:
- [ ] Page navigation works correctly
- [ ] Correct number of rows per page
- [ ] Page indicators accurate
- [ ] API called with correct page params

**API Verification**:
```bash
GET /api/cheques?page=1&size=25
```

---

### Test 7: Sorting
**Steps**:
1. Click "Amount" column header
2. Click again to reverse sort

**Expected Results**:
- [ ] Cheques sort by amount ascending
- [ ] Second click sorts descending
- [ ] Sort indicator visible in header

**API Verification**:
```bash
GET /api/cheques?sort=amount,asc
GET /api/cheques?sort=amount,desc
```

---

### Test 8: Delete Cheque (Pending)
**Steps**:
1. Click "Delete" on TEST001 cheque
2. Confirm deletion

**Expected Results**:
- [ ] Confirmation dialog appears
- [ ] Success toast after deletion
- [ ] Cheque removed from list
- [ ] Statistics update

**API Verification**:
```bash
DELETE /api/cheques/1 - Status: 204 No Content
```

---

### Test 9: Statistics Dashboard
**Steps**:
1. Create multiple cheques with different statuses:
   - 2 PENDING (₹5,000 each)
   - 1 CLEARED (₹10,000)
   - 1 BOUNCED (₹3,000)
2. Observe statistics cards

**Expected Results**:
- [ ] Total Cheques: 4
- [ ] Pending Amount: ₹10,000.00
- [ ] Cleared Amount: ₹10,000.00
- [ ] Bounced: 1
- [ ] Statistics update in real-time

**API Verification**:
```bash
GET /api/cheques/stats
Response: {
  "totalCheques": 4,
  "pendingAmount": 10000.00,
  "clearedAmount": 10000.00,
  "bouncedCount": 1
}
```

---

### Test 10: Bank Integration - Clear Cheque
**Prerequisites**:
- Create a DEPOSITED cheque
- Note current bank balance

**Steps**:
1. Use backend API or service to clear cheque:
```javascript
await chequeService.clearCheque(chequeId, "2026-01-24");
```

**Expected Results**:
- [ ] Cheque status changes to CLEARED
- [ ] Bank transaction created in BankData
- [ ] Bank balance increases by cheque amount
- [ ] `isRecordedInBank` = true
- [ ] `bankTransactionId` populated

**Database Verification**:
```sql
-- Check cheque
SELECT * FROM incoming_cheques WHERE id = ?;
-- Should show: status='CLEARED', is_recorded_in_bank=true

-- Check bank transaction
SELECT * FROM bank_data WHERE cheque_number = 'TEST001';
-- Should show: credit_amount = cheque amount

-- Check bank balance
SELECT current_balance FROM banks WHERE id = ?;
-- Should be increased by cheque amount
```

---

### Test 11: Bank Integration - Bounce Cheque
**Prerequisites**:
- Have a CLEARED cheque
- Note current bank balance

**Steps**:
1. Use backend API to bounce cheque:
```javascript
await chequeService.bounceCheque(chequeId, "Insufficient funds", "2026-01-24");
```

**Expected Results**:
- [ ] Cheque status changes to BOUNCED
- [ ] Reversal bank transaction created
- [ ] Bank balance decreases by cheque amount
- [ ] `isRecordedInBank` = false
- [ ] `bounceReason` populated
- [ ] `bounceDate` populated

**Database Verification**:
```sql
-- Check reversal transaction
SELECT * FROM bank_data 
WHERE cheque_number = 'TEST001' 
ORDER BY created_at DESC 
LIMIT 2;
-- Should show two transactions: credit and debit (reversal)

-- Check bank balance
SELECT current_balance FROM banks WHERE id = ?;
-- Should be back to original amount (before clear)
```

---

### Test 12: Form Validation
**Steps**:
1. Click "New Cheque"
2. Try to submit empty form
3. Enter invalid data:
   - Amount: -100
   - Cheque Number: Leave empty
4. Attempt submit

**Expected Results**:
- [ ] Required field errors appear
- [ ] "Cheque number is required"
- [ ] "Amount must be greater than 0"
- [ ] Form doesn't submit with errors
- [ ] Error messages in red text

---

### Test 13: Bank Dropdown Loading
**Steps**:
1. Open "New Cheque" form
2. Observe bank dropdown

**Expected Results**:
- [ ] Dropdown loads active banks
- [ ] Shows: Bank Name - Account Number
- [ ] At least one bank available
- [ ] "Select bank" placeholder visible

**API Verification**:
```bash
GET /api/banks/active
```

---

### Test 14: Duplicate Cheque Number Prevention
**Steps**:
1. Create cheque with number "DUP001"
2. Try to create another cheque with "DUP001"

**Expected Results**:
- [ ] Second creation fails
- [ ] Error toast: "Cheque number already exists"
- [ ] Form stays open
- [ ] No duplicate created in database

**API Verification**:
```bash
POST /api/cheques
Response: 400 Bad Request
Message: "Cheque number already exists: DUP001"
```

---

### Test 15: Cannot Delete Cleared Cheque
**Prerequisites**:
- Have a CLEARED cheque

**Steps**:
1. Try to delete a cleared cheque

**Expected Results**:
- [ ] Delete fails
- [ ] Error toast: "Cannot delete cleared cheques"
- [ ] Cheque remains in database
- [ ] Maintains accounting integrity

---

### Test 16: Error Handling - Backend Down
**Steps**:
1. Stop backend server
2. Try to load cheques page
3. Try to create a cheque

**Expected Results**:
- [ ] Error toast: "Failed to load cheques"
- [ ] Empty state shown in table
- [ ] Form submission fails gracefully
- [ ] No browser console crashes
- [ ] User can retry after backend restart

---

### Test 17: Authentication & Authorization
**Steps**:
1. Logout
2. Try to access /finance/cheques URL directly
3. Login with CASHIER role (if available)
4. Try to access cheques page

**Expected Results**:
- [ ] Redirected to login when not authenticated
- [ ] Users without proper role can't access
- [ ] Only SUPER_ADMIN, OWNER, ACCOUNTANT can access
- [ ] Proper error messages

---

### Test 18: Responsive Design
**Steps**:
1. Resize browser window to mobile size
2. Check form on mobile
3. Check table on mobile

**Expected Results**:
- [ ] Form adapts to small screens
- [ ] Table columns hide appropriately (hidden md:, lg:, xl:)
- [ ] Buttons remain clickable
- [ ] No horizontal scroll on mobile

---

### Test 19: Date Handling
**Steps**:
1. Create cheque with future cheque date
2. Create cheque with past deposit date

**Expected Results**:
- [ ] Dates accepted and stored correctly
- [ ] Displayed in correct format
- [ ] No timezone issues
- [ ] LocalDate format maintained

---

### Test 20: Concurrent Users
**Steps**:
1. Open cheques page in two browsers
2. Edit same cheque in both
3. Submit from browser 1
4. Submit from browser 2

**Expected Results**:
- [ ] Both submissions handled
- [ ] Latest update wins (optimistic locking)
- [ ] No data corruption
- [ ] Proper version handling

---

## Performance Tests

### Test 21: Large Dataset
**Steps**:
1. Create 100+ cheques
2. Load page
3. Filter and search

**Expected Results**:
- [ ] Page loads in < 2 seconds
- [ ] Pagination works smoothly
- [ ] Filtering is instant
- [ ] No browser lag

---

### Test 22: API Response Time
**Steps**:
1. Use browser DevTools Network tab
2. Monitor API call timings

**Expected Results**:
- [ ] GET /cheques: < 500ms
- [ ] POST /cheques: < 300ms
- [ ] GET /stats: < 200ms

---

## Integration Tests Complete

### Summary Checklist
- [ ] All CRUD operations work
- [ ] Pagination functional
- [ ] Filtering works correctly
- [ ] Search returns accurate results
- [ ] Bank integration creates transactions
- [ ] Bounce reverses transactions
- [ ] Form validation prevents bad data
- [ ] Error handling is graceful
- [ ] Security/authorization enforced
- [ ] Statistics accurate in real-time
- [ ] Responsive on all devices
- [ ] No console errors
- [ ] Backend logs clean
- [ ] Database integrity maintained

## Sign-off

**Tester**: _______________  
**Date**: _______________  
**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

## Common Issues & Solutions

### Issue: "Failed to load banks"
**Solution**: Create a bank account first at Finance → Banks

### Issue: CORS errors
**Solution**: Backend CORS configuration allows frontend origin

### Issue: 401 Unauthorized
**Solution**: JWT token expired, logout and login again

### Issue: Statistics not updating
**Solution**: Check fetchStats() is called after operations

### Issue: Pagination not working
**Solution**: Verify backend returns `totalElements` and `totalPages`

---

**Test Suite Version**: 1.0  
**Last Updated**: January 24, 2026  
**System Version**: MedLan Pharmacy v1.0.0
