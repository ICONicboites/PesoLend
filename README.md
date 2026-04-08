# PesoLend - Modern Lending Platform

A professional, fully-featured lending application frontend built with React, Tailwind CSS, and Framer Motion. Fast, responsive, and feature-rich!

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

PesoLend © 2024. All rights reserved.

---

**Built with ❤️ for the Filipino lending market.**

Developed as a professional frontend system for the PesoLend lending platform.
