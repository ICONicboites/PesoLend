# PesoLend - Modern Lending Platform

PesoLend is a full-featured Philippine-peso lending platform built with **React + TypeScript**, **Tailwind CSS**, and **Framer Motion**. It simulates a real-world lending business — customers apply for loans, admins review and approve/reject them, payments are processed, and every action is tracked in real time across tabs via a custom localStorage sync system.

---

## 🚀 Latest Progress (April 2026)

### ✅ Real-Time Cross-Tab Sync
- Custom `useStorageSync` hook polls localStorage every 3–5 seconds and listens to native `storage` events for instant cross-tab updates.
- All dashboards (admin and customer) refresh automatically without a page reload.

### ✅ Corrected Financial Money Flow
- **Approving a loan** deducts funds from the admin's selected payment method (disbursement wallet).
- **Customer payment** returns the amount back to that same disbursement wallet.
- Financial metrics update live: Total Lent Out, Total Collected, Outstanding Debt.

### ✅ Dual Activity Logging
- Every loan application, approval, rejection, and payment is logged for **both** the customer and the admin.
- Timestamps use relative formatting (e.g., "Just now", "5m ago").

### ✅ Admin Dashboard Overhaul
- Live stat cards: Pending Loans, Open Tickets, System Balance, Total Lent Out, Total Collected, Outstanding Debt.
- New-loan alert badge with dismiss button.
- Recent Activity Log embedded directly in the dashboard.

### ✅ Payment Modal Fixes
- Live-synced approved loan list refreshes every 3 seconds.
- Loan selection persists during sync cycles (dependency array fix).
- Dropdown shows loan description, amount, and duration.

### ✅ Transaction Table — Loan Identification
- Admin transaction table now includes a **Description** column.
- Clicking "View" on any payment transaction opens a detail modal showing:
  - Loan description & duration
  - Original disbursed amount
  - **Remaining balance** (live-calculated as payments arrive)

---

## 🎯 Features

### Customer Side

| Feature | Description |
|---|---|
| Registration & Login | Email/password auth stored in localStorage |
| Dashboard | Summary cards, quick actions, recent transactions, activity log |
| Loan Application | Apply with amount, duration (months), and description |
| Loan Tracking | Filter by All / Pending / Approved / Rejected |
| Payment Processing | Pay approved loans via saved payment method |
| Transaction History | Full history with type, amount, date, and status |
| Support Tickets | Submit and track support requests |
| Profile Management | View and update profile details |
| Dark Mode | Toggle-able dark theme, persisted in localStorage |

### Admin Side

| Feature | Description |
|---|---|
| Admin Dashboard | Live metrics — balance, loans, collections, outstanding debt |
| Loan Management | Review, approve, or reject pending loans |
| Balance Management | Manage payment methods; view all transactions with description and remaining balance |
| Transaction Audit Log | Full audit trail of every financial event |
| Support Management | View and respond to customer support tickets |
| Activity Log | Live feed of all system activity |

---

## 🗺️ User Flow

### Customer Flow

```
Landing Page
    │
    ├── Register → Fill name, email, password → Account created
    │
    └── Login → Redirected to Dashboard
                    │
                    ├── Apply for Loan
                    │       └── Enter amount + duration + description
                    │               └── Loan submitted (status: Pending)
                    │
                    ├── My Loans → View all loans by status
                    │       └── Approved loan → Make a Payment
                    │               └── Select loan → Enter amount → Confirm
                    │                       └── Balance updates; remaining balance decreases
                    │
                    ├── Transactions → View full payment & disbursement history
                    │
                    ├── Support → Submit a support ticket → Track status
                    │
                    └── Profile → View/edit profile details
```

### Admin Flow

```
Login (admin@pesolend.com)
    │
    └── Admin Dashboard
            │
            ├── View live stats (pending loans, balance, debt, collections)
            │
            ├── Review Loans (/admin/loans)
            │       └── Approve → Funds deducted from payment method → Customer notified
            │       └── Reject  → Loan marked rejected → Customer notified
            │
            ├── Balance Management (/admin/balance)
            │       ├── Manage payment methods (GCash, Bank, etc.)
            │       ├── View all transactions with Description column
            │       └── Click "View" → See loan details + remaining balance
            │
            ├── Audit Log (/admin/audit)
            │       └── Full chronological log of every transaction
            │
            └── Support (/admin/support)
                    └── View and respond to customer tickets
```

---

## 🏗️ Project Structure

```
PesoLend/
├── src/
│   ├── hooks/
│   │   └── useStorageSync.ts        # Real-time cross-tab sync hook
│   ├── pages/
│   │   ├── LandingPage.tsx          # Public homepage
│   │   ├── LoginPage.tsx            # Login view
│   │   ├── RegisterPage.tsx         # Registration view
│   │   ├── DashboardPage.tsx        # Customer dashboard
│   │   ├── LoansPage.tsx            # Customer loan list
│   │   ├── TransactionsPage.tsx     # Customer transaction history
│   │   ├── ProfilePage.tsx          # Customer profile
│   │   ├── SupportPage.tsx          # Customer support tickets
│   │   ├── AdminDashboard.tsx       # Admin overview & metrics
│   │   ├── AdminLoans.tsx           # Admin loan review
│   │   ├── AdminSupport.tsx         # Admin ticket management
│   │   ├── BalanceManagement.tsx    # Admin payment methods & transactions
│   │   └── TransactionAuditLog.tsx  # Admin audit log
│   ├── components/
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
│   │   ├── ProtectedRoute.tsx       # Redirects unauthenticated users
│   │   └── AdminRoute.tsx           # Redirects non-admin users
│   ├── services/
│   │   └── storage.ts               # All localStorage read/write logic
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

### Data Layer
All data is persisted in **localStorage** under namespaced keys:

| Key | Data |
|---|---|
| `pesolend_user` | Currently logged-in user session |
| `pesolend_registered_users` | All registered customer accounts |
| `pesolend_loans` | All loan records |
| `pesolend_transactions` | All financial transactions |
| `pesolend_activities` | Activity log entries per user |
| `pesolend_support_tickets` | Customer support tickets |
| `pesolend_payment_methods` | Admin payment methods (GCash, bank, etc.) |

### Real-Time Sync
The `useStorageSync` hook:
1. Listens to the browser's native `storage` event for cross-tab changes.
2. Polls every N milliseconds (configurable) for same-tab updates.
3. Returns `{ data, newCount, clearAlert }` — components receive fresh data and badge counts automatically.

### Financial Logic (`storage.ts`)
- `updateLoanStatus(loanId, 'Approved', paymentMethodId)` → deducts from payment method balance, logs Disbursement transaction.
- `processPayment(amount, loanId, paymentMethod, description)` → adds to payment method balance, logs Payment transaction.
- `getLoanRemainingBalance(loanId)` → original loan amount minus all approved payments for that loan.

### Route Protection
- `<ProtectedRoute>` — redirects to `/login` if no session exists.
- `<AdminRoute>` — redirects to `/dashboard` if user is not admin.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |
| React Router DOM v6 | Client-side routing |
| Lucide React | Icon library |
| localStorage API | Client-side data persistence |

---

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Admin Login
| Field | Value |
|---|---|
| Email | admin@pesolend.com |
| Password | rivera6969 |

## 🎯 Features

### 1. **Landing Page** ✨

- Attractive hero section with compelling copy
- Feature highlights with icons
- Call-to-action buttons
- Responsive design for all devices
- Dark mode support

### 2. **Authentication System** 🔐

- Register form with validation
- Login form with secure password field
- localStorage-based session management
- Form validation and error handling
- Eye icon toggle for password visibility

### 3. **Dashboard** 📊

- Personalized welcome message
- Summary cards showing:
  - Total Loans count
  - Active Loans count
  - Total Paid Amount
  - Approved Loans count
- Quick action buttons
- Transaction history display
- Recent activity log

### 4. **Loan Management** 💰

- Apply for loans with:
  - Loan amount input
  - Duration selection (months)
  - Optional description
- View all loans in a grid layout
- Filter loans by status:
  - All
  - Pending
  - Approved
  - Rejected
- Mock approve/reject functionality
- Status indicators with color coding

### 5. **Transaction History** 📈

- Professional table view
- Displays transaction type and amount
- Sortable by date
- Separate disbursement (green) and payment (blue) indicators
- Recent transaction highlighting

### 6. **Activity Log** 🔔

- Recent user actions tracking
- Timestamp display
- Time-relative formatting (Just now, 5m ago, etc.)
- Latest activities first

### 7. **User Experience** 🎨

- **Dark Mode**: Toggle-able dark theme
- **Animations**: Smooth Framer Motion transitions
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Professional blue gradient
- **Icons**: Lucide React icons throughout

## 🏗️ Project Structure

```
PesoLend/
├── src/
│   ├── pages/
│   │   ├── LandingPage.tsx      # Homepage
│   │   ├── LoginPage.tsx        # Login view
│   │   ├── RegisterPage.tsx     # Registration view
│   │   ├── DashboardPage.tsx    # Main dashboard
│   │   ├── LoansPage.tsx        # Loan management
│   │   └── TransactionsPage.tsx # Transaction history
│   ├── components/
│   │   ├── NavBar.tsx           # Navigation bar
│   │   ├── LoginForm.tsx        # Login form
│   │   ├── RegisterForm.tsx     # Register form
│   │   ├── LoanCard.tsx         # Individual loan card
│   │   ├── LoanApplicationModal.tsx
│   │   ├── SummaryCards.tsx     # Dashboard cards
│   │   ├── TransactionHistory.tsx
│   │   ├── ActivityLog.tsx
│   │   ├── AnimatedComponents.tsx
│   │   └── ProtectedRoute.tsx   # Route protection
│   ├── services/
│   │   └── storage.ts           # localStorage utilities
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS config
├── postcss.config.js            # PostCSS config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies

```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Navigate to project directory:**

   ```bash
   cd PesoLend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Local: `http://localhost:5173`
   - The app will reload on file changes

### Build for Production

```bash
npm run build
npm run preview
```

## 🎨 Tech Stack

| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| **React 18**         | UI framework            |
| **TypeScript**       | Type safety             |
| **Vite**             | Build tool & dev server |
| **Tailwind CSS**     | Utility-first styling   |
| **Framer Motion**    | Smooth animations       |
| **React Router DOM** | Client-side routing     |
| **Lucide React**     | Beautiful icons         |
| **localStorage**     | Data persistence        |

## 📝 Key Components

### Storage Service (`services/storage.ts`)

Centralized localStorage management with type-safe functions:

- `setUser()` / `getUser()` / `clearUser()`
- `addLoan()` / `getLoansList()` / `updateLoanStatus()`
- `addTransaction()` / `getTransactions()`
- `addActivity()` / `getActivities()`
- `initDarkMode()` / `setDarkMode()` / `getDarkMode()`

### Protected Routes

The `ProtectedRoute` component ensures only authenticated users can access dashboard, loans, and transaction pages.

### Animations

All components use Framer Motion with:

- Fade-in on page load
- Staggered children animations
- Hover scale effects on buttons
- Smooth transitions

## 💾 Data Persistence

All data is stored in browser's `localStorage`:

- User sessions persist across page refreshes
- Loans and transactions saved locally
- Activity history stored (last 50 items)
- Dark mode preference remembered

## 🎯 User Workflows

### New User

1. Land on homepage
2. Click "Register"
3. Fill registration form with name, email, password
4. Redirected to dashboard

### Returning User

1. Click "Login"
2. Enter email and password
3. Redirected to dashboard

### Loan Application

1. From dashboard, click "Apply for Loan"
2. Fill modal with amount, duration, description
3. Submit application
4. Loan appears in "My Loans" with "Pending" status
5. Mock approve/reject in loans page

## 🌙 Dark Mode

- Toggle via moon/sun icon in navbar
- Preference saved to localStorage
- Smooth transition between modes
- All components support dark colors

## 📱 Responsive Design

Fully responsive across:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 🖥️ Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## ✨ Features Implemented

- ✅ Landing page with hero section
- ✅ Authentication (register/login)
- ✅ Protected routes
- ✅ Dashboard with summary cards
- ✅ Loan application form
- ✅ Loan list with filtering
- ✅ Transaction history table
- ✅ Activity log
- ✅ Dark mode toggle
- ✅ Smooth animations
- ✅ localStorage persistence
- ✅ Responsive design
- ✅ Form validation
- ✅ Status indicators
- ✅ Mock data for transactions

## 🔐 Security Notes

This is a frontend demo with simulated authentication. In production:

- Implement proper JWT authentication
- Use secure API endpoints
- Never store sensitive data in localStorage
- Implement proper session management
- Add HTTPS/SSL validation

## 🎓 Professional Features

- **Type-Safe**: Full TypeScript support
- **Error Handling**: Form validation and error messages
- **Loading States**: Async operation feedback
- **Accessibility**: Semantic HTML, proper labels
- **Performance**: Optimized animations, lazy loading ready
- **Code Quality**: Clean, modular, reusable components

## 📦 Mock Data

The app includes mock transaction data to demonstrate the transaction history feature:

- Sample disbursements
- Sample monthly payments
- Realistic transaction dates

## 🚢 Production Deployment

Ready to deploy to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting

After build:

```bash
npm run build
# dist/ folder ready for deployment
```

## 📄 License

rivera bacolod © 2024. All rights reserved.

---

**Built with ❤️ for the Filipino lending market.**

Developed as a professional frontend system for the PesoLend lending platform.
