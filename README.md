# 💸 PesoLend — Modern Lending Platform

> A full-featured Philippine-peso lending platform that simulates a real-world lending business. Customers apply for loans, admins review and disburse funds, payments are tracked, and everything syncs in real time across browser tabs.

Built with ⚛️ **React + TypeScript**, 🎨 **Tailwind CSS**, and 🎞️ **Framer Motion**.

---

## 🚀 Latest Progress (April 2026)

### ⚡ Real-Time Cross-Browser Sync (WebSockets)

- A lightweight WebSocket relay server (`scripts/realtime-sync-server.mjs`) broadcasts localStorage updates to all connected clients.
- Customer loan submissions now appear on admin dashboards instantly, even when both sessions run in different browsers.
- `useStorageSync` still keeps a storage-event + polling fallback for resilience.

### 💰 Corrected Financial Money Flow

- ✅ **Approving a loan** deducts funds from the admin's disbursement wallet.
- ✅ **Customer payment** returns the amount back to that same wallet.
- 📊 Live metrics: Total Lent Out, Total Collected, Outstanding Debt.

### 📋 Dual Activity Logging

- Every loan application, approval, rejection, and payment is logged for **both** the customer and the admin.
- Timestamps use relative formatting (e.g., "Just now", "5m ago").

### 🛡️ Admin Dashboard Overhaul

- Live stat cards: Pending Loans 🕐, Open Tickets 🎫, System Balance 💳, Total Lent Out 📤, Total Collected 📥, Outstanding Debt ⚠️.
- 🔔 New-loan alert badge with dismiss button.
- Recent Activity Log embedded directly in the dashboard.

### 🔧 Payment Modal Fixes

- Live-synced approved loan list refreshes every 3 seconds.
- Loan selection persists during sync cycles.
- Dropdown shows loan description, amount, and duration.

### 🔍 Transaction Table — Loan Identification

- Admin transaction table now has a **Description** column so admins know exactly what each transaction is for.
- Clicking **View** on any payment opens a detail modal showing:
  - 📝 Loan description & duration
  - 💵 Original disbursed amount
  - 📉 **Remaining balance** (live-calculated as payments arrive)

---

## 🎯 Features

### 👤 Customer Side

| Feature                 | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| 📝 Registration & Login | Email/password auth stored in localStorage                      |
| 📊 Dashboard            | Summary cards, quick actions, recent transactions, activity log |
| 💸 Loan Application     | Apply with amount, duration (months), and description           |
| 🔎 Loan Tracking        | Filter by All / Pending / Approved / Rejected                   |
| 💳 Payment Processing   | Pay approved loans via saved payment method                     |
| 📈 Transaction History  | Full history with type, amount, date, and status                |
| 🎫 Support Tickets      | Submit and track support requests                               |
| 👤 Profile Management   | View and update profile details                                 |
| 🌙 Dark Mode            | Toggle-able dark theme, persisted in localStorage               |

### 🛡️ Admin Side

| Feature                  | Description                                                                      |
| ------------------------ | -------------------------------------------------------------------------------- |
| 📊 Admin Dashboard       | Live metrics — balance, loans, collections, outstanding debt                     |
| ✅ Loan Management       | Review, approve, or reject pending loans                                         |
| 💳 Balance Management    | Manage payment methods; view transactions with description and remaining balance |
| 🗂️ Transaction Audit Log | Full audit trail of every financial event                                        |
| 🎫 Support Management    | View and respond to customer support tickets                                     |
| 🔔 Activity Log          | Live feed of all system activity                                                 |

---

## 🗺️ User Flow

### 👤 Customer Flow

```
🌐 Landing Page
    │
    ├── 📝 Register → Fill name, email, password → Account created
    │
    └── 🔑 Login → Redirected to Dashboard
                    │
                    ├── 💸 Apply for Loan
                    │       └── Enter amount + duration + description
                    │               └── Loan submitted (status: 🕐 Pending)
                    │
                    ├── 🔎 My Loans → View all loans by status
                    │       └── ✅ Approved loan → Make a Payment
                    │               └── Select loan → Enter amount → Confirm
                    │                       └── 📉 Remaining balance decreases live
                    │
                    ├── 📈 Transactions → View full payment & disbursement history
                    │
                    ├── 🎫 Support → Submit a support ticket → Track status
                    │
                    └── 👤 Profile → View/edit profile details
```

### 🛡️ Admin Flow

```
🔑 Login (admin@pesolend.com)
    │
    └── 📊 Admin Dashboard
            │
            ├── 📌 View live stats (pending loans, balance, debt, collections)
            │
            ├── ✅ Review Loans (/admin/loans)
            │       └── Approve → 💳 Funds deducted from payment method
            │       └── Reject  → ❌ Loan marked rejected
            │
            ├── 💳 Balance Management (/admin/balance)
            │       ├── Manage payment methods (GCash, Bank, etc.)
            │       ├── View all transactions with 📝 Description column
            │       └── Click "View" → 📉 See loan details + remaining balance
            │
            ├── 🗂️ Audit Log (/admin/audit)
            │       └── Full chronological log of every transaction
            │
            └── 🎫 Support (/admin/support)
                    └── View and respond to customer tickets
```

---

## 🏗️ Project Structure

```
💸 PesoLend/
├── src/
│   ├── 🪝 hooks/
│   │   └── useStorageSync.ts        # ⚡ Real-time cross-tab sync hook
│   ├── 📄 pages/
│   │   ├── LandingPage.tsx          # 🌐 Public homepage
│   │   ├── LoginPage.tsx            # 🔑 Login view
│   │   ├── RegisterPage.tsx         # 📝 Registration view
│   │   ├── DashboardPage.tsx        # 📊 Customer dashboard
│   │   ├── LoansPage.tsx            # 💸 Customer loan list
│   │   ├── TransactionsPage.tsx     # 📈 Customer transaction history
│   │   ├── ProfilePage.tsx          # 👤 Customer profile
│   │   ├── SupportPage.tsx          # 🎫 Customer support tickets
│   │   ├── AdminDashboard.tsx       # 🛡️ Admin overview & live metrics
│   │   ├── AdminLoans.tsx           # ✅ Admin loan review
│   │   ├── AdminSupport.tsx         # 🎫 Admin ticket management
│   │   ├── BalanceManagement.tsx    # 💳 Admin payment methods & transactions
│   │   └── TransactionAuditLog.tsx  # 🗂️ Admin audit log
│   ├── 🧩 components/
│   │   ├── Navbar.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── LoanCard.tsx
│   │   ├── LoanApplicationModal.tsx
│   │   ├── PaymentModal.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── TransactionHistory.tsx
│   │   ├── ActivityLog.tsx
│   │   ├── ActivityModal.tsx
│   │   ├── ProfileModal.tsx
│   │   ├── TransactionApprovalModal.tsx
│   │   ├── AnimatedComponents.tsx
│   │   ├── ProtectedRoute.tsx       # 🔒 Redirects unauthenticated users
│   │   └── AdminRoute.tsx           # 🛡️ Redirects non-admin users
│   ├── ⚙️ services/
│   │   └── storage.ts               # 💾 All localStorage read/write logic
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## ⚙️ How It Works

### 💾 Data Layer

All data is persisted in **localStorage** under namespaced keys:

| 🗝️ Key                      | 📦 Data                                      |
| --------------------------- | -------------------------------------------- |
| `pesolend_user`             | 👤 Currently logged-in user session          |
| `pesolend_registered_users` | 👥 All registered customer accounts          |
| `pesolend_loans`            | 💸 All loan records                          |
| `pesolend_transactions`     | 💳 All financial transactions                |
| `pesolend_activities`       | 🔔 Activity log entries per user             |
| `pesolend_support_tickets`  | 🎫 Customer support tickets                  |
| `pesolend_payment_methods`  | 🏦 Admin payment methods (GCash, bank, etc.) |

### ⚡ Real-Time Sync

The app combines a WebSocket bridge and `useStorageSync`:

1. 📡 `src/services/realtimeSync.ts` patches localStorage writes for `pesolend_*` keys.
2. 🌐 Writes are broadcast via WebSocket (`ws://localhost:8787` by default).
3. 📥 Other browser sessions apply incoming updates locally and emit an immediate sync event.
4. ⏱️ `useStorageSync` still listens to `storage` events + polling as a fallback safety net.

### 💰 Financial Logic (`storage.ts`)

- `updateLoanStatus(loanId, 'Approved', paymentMethodId)` → 📤 Deducts from payment method, logs Disbursement.
- `processPayment(amount, loanId, paymentMethod, description)` → 📥 Adds to payment method, logs Payment.
- `getLoanRemainingBalance(loanId)` → 📉 Original loan amount minus all approved payments for that loan.

### 🔒 Route Protection

- `<ProtectedRoute>` — redirects to `/login` if no session exists.
- `<AdminRoute>` — redirects to `/dashboard` if user is not admin.

---

## 🛠️ Tech Stack

| 🔧 Technology            | 📋 Purpose                    |
| ------------------------ | ----------------------------- |
| ⚛️ React 18 + TypeScript | UI framework with type safety |
| ⚡ Vite                  | Build tool & dev server       |
| 🎨 Tailwind CSS          | Utility-first styling         |
| 🎞️ Framer Motion         | Animations & transitions      |
| 🔀 React Router DOM v6   | Client-side routing           |
| 🖼️ Lucide React          | Icon library                  |
| 💾 localStorage API      | Client-side data persistence  |

---

## 🏃 Getting Started

```bash
# 📦 Install dependencies
npm install

# 📡 Start realtime WebSocket relay (separate terminal)
npm run realtime

# 🚀 Start development server
npm run dev

# 🏗️ Build for production
npm run build

# 👀 Preview production build
npm run preview
```

> App runs at **http://localhost:5173**

Optional environment variable for custom WebSocket URL:

```bash
VITE_REALTIME_WS_URL=ws://localhost:8787
```

---

## 🔑 Admin Login

| Field       | Value                |
| ----------- | -------------------- |
| 📧 Email    | `admin@pesolend.com` |
| 🔒 Password | `rivera6969`         |

---

## 📱 Responsive Design

Fully responsive across all screen sizes:

| Device           | Breakpoint |
| ---------------- | ---------- |
| 📱 Mobile        | 320px+     |
| 📟 Tablet        | 768px+     |
| 🖥️ Desktop       | 1024px+    |
| 🖥️ Large screens | 1280px+    |

---

## 🌙 Dark Mode

- Toggle via 🌙 / ☀️ icon in the navbar
- Preference saved to localStorage — survives refreshes
- Smooth CSS transition between modes
- All components fully support dark colors
