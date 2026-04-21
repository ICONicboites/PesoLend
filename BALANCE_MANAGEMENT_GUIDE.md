# Available Balance Management Feature - Setup Guide

## Overview

This feature adds comprehensive balance management to PesoLend, allowing admins to:
- Manage multiple payment methods (GCash, Bank Transfer, PayPal)
- Track available balance per payment method
- Approve/reject customer transactions
- Maintain a complete audit log of all balance changes
- Ensure transparency and accountability in fund movement

## Features Implemented

### 1. **Payment Methods Management**
- **Three default payment methods** initialized with ₱1,000,000 each:
  - GCash
  - Bank Transfer
  - PayPal
- Each payment method has:
  - Unique ID
  - Real-time available balance
  - Active/Inactive status
  - Creation timestamp

### 2. **Transaction Status Workflow**
All transactions follow this workflow:
```
Pending → Approved → (affects balance)
       → Rejected  → (no balance impact)
```

**Only APPROVED transactions affect the payment method balance.**

### 3. **Balance Logic**
- **Deposits/Payments**: INCREASE payment method balance
- **Withdrawals/Disbursements**: DECREASE payment method balance
- **Validation**: Balance cannot go below zero
- **Audit Trail**: Every balance change is recorded

### 4. **Admin Dashboard Enhancements**
- View total system balance across all payment methods
- See count of pending transactions requiring approval
- Quick access links to:
  - Balance Management (approve transactions)
  - Audit Log (view transaction history)

### 5. **Balance Management Page** (`/admin/balance`)
Features:
- Display all payment methods with real-time balances
- Show system totals: approved, rejected, pending transactions
- Filter transactions by:
  - Payment method
  - Status (Pending, Approved, Rejected)
  - Type (Deposit, Withdrawal)
  - Date range
- Approve/Reject transactions with balance validation
- Prevent withdrawals exceeding available balance

### 6. **Transaction Approval Modal**
- View complete transaction details
- Verify available balance before approval
- Transaction status enforcement
- Balance impact preview

### 7. **Audit Log Page** (`/admin/audit-log`)
Complete transparency with:
- Real-time balance changes
- Previous and new balance tracking
- Transaction timestamps
- Detailed transaction descriptions
- CSV export for reporting
- Summary statistics (total deposits, withdrawals, net change)
- Transaction timeline view

### 8. **Customer Transaction Modal**
For customers to request:
- Deposits (to add funds)
- Withdrawals (to remove funds)
- Requires admin approval before balance changes
- Shows available balance for each payment method

## Data Structure

### PaymentMethod Interface
```typescript
interface PaymentMethod {
  id: string
  name: string
  type: 'GCash' | 'Bank Transfer' | 'PayPal' | 'Other'
  available_balance: number
  createdAt: string
  status: 'Active' | 'Inactive'
}
```

### Transaction Interface (Enhanced)
```typescript
interface Transaction {
  id: string
  userId: string
  type: 'Disbursement' | 'Payment' | 'Deposit' | 'Withdrawal'
  amount: number
  date: string
  loanId?: string
  description: string
  status: 'Pending' | 'Approved' | 'Rejected'  // NEW
  paymentMethodId?: string                      // NEW
}
```

### BalanceTransaction Interface (Audit Record)
```typescript
interface BalanceTransaction {
  id: string
  paymentMethodId: string
  type: 'Deposit' | 'Withdrawal'
  amount: number
  transactionId: string          // Reference to main transaction
  status: 'Pending' | 'Approved' | 'Rejected'
  previousBalance: number        // Balance before transaction
  newBalance: number            // Balance after transaction
  timestamp: string
  description: string
}
```

## Key Functions in storage.ts

### Payment Method Functions
```typescript
// Get all payment methods (initializes if empty)
getPaymentMethods(): PaymentMethod[]

// Get specific payment method
getPaymentMethodById(id: string): PaymentMethod | undefined

// Get total balance across all methods
getTotalSystemBalance(): number
```

### Transaction Functions
```typescript
// Create customer transaction request
createCustomerTransaction(data: {
  type: 'Deposit' | 'Withdrawal'
  amount: number
  paymentMethodId: string
  description: string
}): Transaction | null

// Update transaction status and affect balance
updateTransactionStatus(
  transactionId: string,
  newStatus: 'Pending' | 'Approved' | 'Rejected',
  paymentMethodId?: string
): boolean

// Get filtered transactions
getFilteredTransactions(filters: {
  paymentMethodId?: string
  type?: 'Deposit' | 'Withdrawal'
  status?: 'Pending' | 'Approved' | 'Rejected'
  startDate?: string
  endDate?: string
  isAdmin?: boolean
}): Transaction[]
```

### Audit Functions
```typescript
// Get balance transaction records
getAllBalanceTransactions(): BalanceTransaction[]

// Get transactions for specific payment method
getPaymentMethodTransactions(paymentMethodId: string): BalanceTransaction[]
```

## Usage Workflow

### For Admins:

1. **Navigate to Balance Management** (`/admin/balance`)
2. **View Payment Methods** - See real-time balances
3. **Review Pending Transactions** - Filter by status
4. **Click "View"** on a transaction to review details
5. **Approve or Reject** transaction
   - If Approved + Deposit: Balance increases
   - If Approved + Withdrawal: Balance decreases (if sufficient funds)
   - If Rejected: No balance change
6. **Check Audit Log** (`/admin/audit-log`) for complete history
7. **Export CSV** for reporting and reconciliation

### For Customers:

1. **Request Deposit/Withdrawal** via modal (when available in customer dashboard)
2. **Select payment method**
3. **Enter amount**
4. **Submit request**
5. **Wait for admin approval**
6. **Once approved**, balance affects payment method

## Transaction Flow Example

### Scenario: Customer Requests ₱50,000 Deposit via GCash

1. **Initial State**:
   - GCash Balance: ₱1,000,000
   - Transaction Status: Creates with status "Pending"

2. **Admin Review** (`/admin/balance`):
   - View transaction details
   - Verify customer and amount
   - Click "Approve"

3. **Upon Approval**:
   - Transaction status → "Approved"
   - GCash balance → ₱1,050,000
   - BalanceTransaction record created with:
     - previousBalance: 1,000,000
     - newBalance: 1,050,000
     - type: "Deposit"
     - status: "Approved"

4. **Audit Log** shows complete record:
   - Timestamp of approval
   - Balance change details
   - Customer information
   - Payment method used

## Low Balance Alert

The system shows warnings when payment method balance < ₱100,000:
- Visual indicator on payment method card
- Warning message before approving withdrawals
- Suggestion to restock funds

## Validation Rules

1. **Withdrawal Validation**:
   - Cannot exceed available balance
   - Admin prevented from approving if insufficient funds
   - Error message shown to customer

2. **Amount Validation**:
   - Must be greater than zero
   - Both customers and admins must provide valid amounts

3. **Status Workflow**:
   - Only Pending transactions can be approved/rejected
   - Reversals supported if status changed from Approved to Rejected

## Components Created

1. **PaymentMethodCard.tsx** - Display individual payment method with balance
2. **TransactionApprovalModal.tsx** - Modal for reviewing and approving transactions
3. **CustomerTransactionModal.tsx** - Modal for customers to request transactions
4. **BalanceManagement.tsx** - Main admin page for managing balances
5. **TransactionAuditLog.tsx** - Comprehensive audit trail viewer

## Updated Pages

- **AdminDashboard.tsx** - Added balance management links and summary stats
- **App.tsx** - Added routes for new pages

## Updated Services

- **storage.ts** - Enhanced with complete balance management functions

## Initialization

Payment methods are automatically initialized on first access with:
- GCash: ₱1,000,000
- Bank Transfer: ₱1,000,000
- PayPal: ₱1,000,000

If you want to modify initial balances, edit the `initializePaymentMethods()` function in storage.ts.

## Future Enhancements

Optional features for later implementation:
1. Real-time WebSocket updates
2. More payment method types
3. Transaction scheduling
4. Automated balance reconciliation
5. Revenue split tracking
6. Commission calculations
7. Monthly statement generation
8. Balance adjustment notes
9. Multi-level approval workflows
10. Payment gateway integration

## Troubleshooting

### Payment Methods Not Showing
- Clear localStorage and refresh page
- Check browser console for errors
- Verify Firefox/Chrome developer tools show data in Application tab

### Transactions Not Being Created
- Verify payment method is Active
- Check that amount is valid (> 0)
- Ensure user is logged in

### Balance Not Updating After Approval
- Verify payment method has sufficient balance
- Check transaction is actually approved (status = "Approved")
- Look at BalanceTransactions in audit log

### CSV Export Not Working
- Check browser allows downloads
- Verify no pop-up blockers
- Firefox may require manual download folder selection

## Testing Checklist

- [ ] Create test deposit transaction (pending)
- [ ] Approve deposit and verify balance increases
- [ ] Reject deposit and verify balance unchanged
- [ ] Create withdrawal request
- [ ] Test insufficient balance scenario
- [ ] View audit log and verify all records
- [ ] Export CSV and check format
- [ ] Test all filters in balance management
- [ ] Verify payment methods display correctly
- [ ] Check low balance warnings

## Security Notes

- Only admin users can access balance management
- Transaction approval requires admin confirmation
- Balance changes are immutable (audit trail maintained)
- All operations logged with timestamps
- No backdoor balance manipulation possible

Now your system has complete balance management with full transparency and accountability!
