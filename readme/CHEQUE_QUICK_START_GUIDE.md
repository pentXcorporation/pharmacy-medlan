# Cheque Management Quick Start Guide

## Prerequisites

1. **Database Migration** - Run the SQL migration first:
   ```bash
   # Connect to your database and run:
   backend/cheque_financial_integration.sql
   ```

2. **Backend Running** - Ensure Spring Boot backend is running on port 8080 or your configured port

3. **Frontend Environment** - Your `.env` file should have:
   ```env
   VITE_API_BASE_URL=https://nonprotuberant-nonprojective-son.ngrok-free.dev/api
   ```

## Step-by-Step Usage

### 1. Access the Cheques Page
Navigate to: **Finance → Cheques** in the sidebar

### 2. Create Your First Cheque

**Prerequisites**: 
- You must have at least one active bank account created
- Go to **Finance → Banks** first if you haven't created one

**Steps**:
1. Click **"New Cheque"** button (top right)
2. Fill in the form:
   - **Cheque Number**: Unique identifier (e.g., "CHQ123456")
   - **Cheque Date**: Date on the cheque
   - **Deposit Date**: When you'll deposit it
   - **Bank Account**: Select from dropdown (shows active banks)
   - **Amount**: Cheque amount (e.g., 5000.00)
   - **Status**: Choose initial status (typically "PENDING")
   - **Received From**: Name of the payer (optional)
   - **Company**: Company name (optional)
   - **Reference Number**: Link to invoice/payment (optional)
   - **Remarks**: Additional notes (optional)
3. Click **"Create Cheque"**
4. Success! The cheque appears in the list

### 3. View and Filter Cheques

**Filter by Status**:
- Use the dropdown to filter: All Status, Pending, Cleared, Bounced, Cancelled

**Search**:
- Type in the search box to search by cheque number, payer, or company

**Sort**:
- Click column headers to sort (Cheque Date, Amount, etc.)

**Pagination**:
- Navigate through pages using the pagination controls at the bottom

### 4. Edit a Cheque

1. Find the cheque in the list
2. Click **"Edit"** in the Actions column
3. Modify the fields you want to change
4. Click **"Update Cheque"**

**Note**: Some fields may be restricted based on cheque status.

### 5. Delete a Cheque

1. Find the cheque in the list
2. Click **"Delete"** in the Actions column
3. Confirm the deletion

**Important**: You cannot delete cleared cheques (for accounting integrity).

### 6. Change Cheque Status

**Manual Status Change**:
- Edit the cheque and change the Status dropdown

**Recommended Workflow** (via backend API):
```javascript
// Deposit a cheque
await chequeService.depositCheque(chequeId, depositDate);

// Clear a cheque (creates bank transaction)
await chequeService.clearCheque(chequeId, clearanceDate);

// Bounce a cheque (reverses transaction)
await chequeService.bounceCheque(chequeId, reason, bounceDate);

// Cancel a cheque
await chequeService.cancelCheque(chequeId, reason);

// Reconcile with bank statement
await chequeService.reconcileCheque(chequeId);
```

### 7. View Statistics

The dashboard shows real-time statistics:
- **Total Cheques**: Overall count
- **Pending Amount**: Sum of pending cheques
- **Cleared Amount**: Sum of cleared cheques
- **Bounced**: Count of bounced cheques

These update automatically when you create, edit, or delete cheques.

## Financial Integration Features

### Automatic Bank Transaction Creation

When a cheque is **cleared**:
1. A credit entry is automatically created in BankData
2. The bank's current balance is updated (+amount)
3. The cheque is linked to the bank transaction

**Example**:
```
Cheque: CHQ123456, Amount: ₹5,000.00
Status: PENDING → CLEARED

Bank Transaction Created:
- Type: Credit
- Amount: ₹5,000.00
- Description: "Cheque cleared: CHQ123456 from John Doe"
- Bank Balance: ₹50,000.00 → ₹55,000.00
```

### Automatic Reversal on Bounce

When a cleared cheque **bounces**:
1. A debit reversal entry is created in BankData
2. The bank's current balance is updated (-amount)
3. The cheque is marked as bounced with reason

**Example**:
```
Cheque: CHQ123456, Amount: ₹5,000.00
Status: CLEARED → BOUNCED
Reason: "Insufficient funds"

Bank Transaction Created (Reversal):
- Type: Debit
- Amount: ₹5,000.00
- Description: "Cheque bounced - reversal: CHQ123456"
- Bank Balance: ₹55,000.00 → ₹50,000.00
```

## Common Workflows

### Workflow 1: Normal Cheque Processing
1. **Create cheque** with status PENDING
2. **Deposit cheque** (status → DEPOSITED)
3. Wait for bank clearance (3-5 business days)
4. **Clear cheque** (status → CLEARED, creates bank transaction)
5. **Reconcile** after bank statement verification

### Workflow 2: Bounced Cheque
1. Cheque is CLEARED
2. Bank notifies of bounce
3. **Bounce cheque** with reason (reverses transaction)
4. Contact customer for payment
5. May create new cheque (REPLACED status)

### Workflow 3: Cancelled Cheque
1. Customer wants to cancel before deposit
2. **Cancel cheque** with reason
3. Issue new cheque if needed

## API Testing (Optional)

You can test the backend API directly using tools like Postman:

**Create Cheque**:
```http
POST http://localhost:8080/api/cheques
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "chequeNumber": "CHQ123456",
  "amount": 5000.00,
  "chequeDate": "2026-01-24",
  "depositDate": "2026-01-24",
  "bankId": 1,
  "status": "PENDING",
  "receivedFrom": "John Doe",
  "referenceNumber": "INV-001"
}
```

**Get All Cheques**:
```http
GET http://localhost:8080/api/cheques?page=0&size=10&sort=chequeDate,desc
Authorization: Bearer <your-jwt-token>
```

**Clear Cheque**:
```http
POST http://localhost:8080/api/cheques/1/clear
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "clearanceDate": "2026-01-27"
}
```

## Troubleshooting

### "Failed to load banks" in form
**Solution**: Create at least one bank account at Finance → Banks

### "Cheque number already exists"
**Solution**: Use a unique cheque number for each cheque

### "Cannot delete cleared cheques"
**Solution**: This is intentional for accounting integrity. You can cancel or reverse instead.

### "Failed to create cheque"
**Possible Causes**:
1. Backend not running
2. Invalid data (check required fields)
3. Bank ID doesn't exist
4. Authentication token expired (refresh page)

### Statistics not updating
**Solution**: Refresh the page or check browser console for errors

### CORS error
**Solution**: Already fixed in api.config.js. Ensure backend CORS is configured for your frontend URL.

## Best Practices

1. **Always use unique cheque numbers** - No duplicates
2. **Record immediately** - Add cheques as soon as received
3. **Update status promptly** - Keep cheques current with actual status
4. **Add references** - Link to invoices for easy tracking
5. **Regular reconciliation** - Match with bank statements monthly
6. **Document bounce reasons** - Helps with follow-up
7. **Backup database regularly** - Financial data is critical

## Security Notes

- Only users with roles: SUPER_ADMIN, OWNER, or ACCOUNTANT can access cheques
- All operations are logged with user info and timestamps
- Cannot delete cleared cheques maintains audit trail
- JWT authentication required for all API calls

## Support

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify backend logs in Spring Boot console
3. Ensure database migration was successful
4. Confirm user has appropriate role permissions

## Summary

The cheque management system is now fully integrated with:
✅ Real-time backend API calls
✅ Automatic bank transaction recording
✅ Bounce handling with reversals
✅ Comprehensive validation
✅ Role-based security
✅ Financial reconciliation support

You're ready to manage cheques efficiently! 🎉
