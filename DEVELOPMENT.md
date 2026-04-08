# DEVELOPMENT GUIDE FOR PesoLend

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server (auto-opens in browser)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## File Structure Guide

### Pages (`src/pages/`)

Each page component represents a complete route in the application. They compose smaller components and handle page-level logic.

**LandingPage.tsx** - Entry point, shows features and CTAs
**LoginPage.tsx** - Wraps LoginForm component
**RegisterPage.tsx** - Wraps RegisterForm component
**DashboardPage.tsx** - Main dashboard with summary cards and modals
**LoansPage.tsx** - Loan management with filtering
**TransactionsPage.tsx** - Transaction history and stats

### Components (`src/components/`)

Reusable UI components with specific responsibilities.

**Navbar.tsx** - Top navigation with logout and dark mode toggle
**LoginForm.tsx** - Handles login validation and submission
**RegisterForm.tsx** - Handles registration with password confirmation
**LoanCard.tsx** - Individual loan display with approve/reject buttons
**LoanApplicationModal.tsx** - Modal for submitting new loan applications
**SummaryCards.tsx** - Dashboard metrics cards
**TransactionHistory.tsx** - Table display of transactions
**ActivityLog.tsx** - Recent user actions list
**AnimatedComponents.tsx** - Reusable animated wrappers
**ProtectedRoute.tsx** - Route guard for authenticated pages

### Services (`src/services/`)

Business logic and data management.

**storage.ts** - All localStorage operations

- User authentication
- Loan management
- Transaction tracking
- Activity logging
- Dark mode settings

## Key Development Patterns

### Using localStorage Service

```typescript
// Import the service
import { setUser, getUser, getLoans, addLoan } from "../services/storage";

// Use in components
const user = getUser();
const loans = getLoansList();
addLoan({ amount: 50000, duration: 12, status: "Pending" });
```

### Creating Animated Components

```typescript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Form Handling with Validation

```typescript
const [formData, setFormData] = useState({ email: "", password: "" });
const [error, setError] = useState("");

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!formData.email || !formData.password) {
    setError("Please fill in all fields");
    return;
  }

  // Process form...
};
```

### Using Tailwind Classes

```typescript
// Color utilities
className = "bg-blue-500 dark:bg-blue-900 text-white";

// Spacing
className = "px-6 py-3 mx-4 my-2";

// Responsive
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

// Hover/States
className = "hover:bg-blue-600 transition-colors duration-200";
```

## Styling Guide

### Custom Tailwind Classes (in index.css)

```css
.btn-primary {
  /* Blue button */
}
.btn-secondary {
  /* Gray button */
}
.btn-danger {
  /* Red button */
}
.card {
  /* White card with shadow */
}
.input-field {
  /* Form input with focus state */
}
.text-gradient {
  /* Blue gradient text */
}
```

### Dark Mode

Two approaches:

1. **Direct class**: `dark:bg-gray-900`
2. **Using Tailwind config**: Automatically applies with `dark:` prefix

Enable dark mode:

```typescript
import { setDarkMode } from "../services/storage";
setDarkMode(true);
```

## Adding New Features

### Add a New Page

1. Create file in `src/pages/NewPage.tsx`
2. Import necessary components
3. Add route in `src/App.tsx`:

```typescript
<Route path="/newpage" element={<NewPage />} />
```

### Add a New Component

1. Create file in `src/components/NewComponent.tsx`
2. Export component
3. Import in page where needed
4. Add props and handle state as needed

### Add New localStorage Data

1. Add interface in `services/storage.ts`
2. Create getter/setter functions
3. Use in components via imports

## Testing Locally

### User Authentication Flow

1. Go to landing page (http://localhost:5173)
2. Click "Register"
3. Fill form and submit
4. You're redirected to dashboard
5. Logout from navbar
6. Login with same credentials

### Loan Application Flow

1. On dashboard, click "Apply for Loan"
2. Fill amount, duration, description
3. Submit modal
4. See new loan in "My Loans" page
5. Toggle status with Approve/Reject buttons

### Dark Mode Testing

1. Click moon icon in navbar
2. All colors should invert
3. Refresh page - setting should persist

## Common Tasks

### Change Color Scheme

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#3B82F6', // Change blue
  secondary: '#10B981', // Change green
  // etc...
}
```

### Add New Status Indicator Color

In `LoanCard.tsx`, add to `statusConfig` object.

### Modify Form Validation

Update validation logic in respective form components (`LoginForm.tsx`, `RegisterForm.tsx`, `LoanApplicationModal.tsx`).

### Add New Mock Transactions

In `TransactionHistory.tsx`, add to `mockTransactions` array.

## Performance Tips

- Components use React.FC for type safety
- Animations optimized with Framer Motion
- No unnecessary re-renders with proper dependencies
- localStorage is async-safe in this usage
- Images would be lazy-loaded in production

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ support required
- CSS Grid and Flexbox required
- localStorage required

## Debugging

### Check localStorage

```javascript
// In browser console
localStorage.getItem("pesolend_user");
localStorage.getItem("pesolend_loans");
localStorage.getItem("pesolend_transactions");
```

### Check dark mode state

```javascript
localStorage.getItem("pesolend_dark_mode");
```

### React DevTools

Install React DevTools browser extension for component inspection.

## Next Steps for Production

1. **Backend Integration**
   - Replace localStorage with API calls
   - Implement proper authentication
   - Add database for persistence

2. **Security**
   - HTTPS/SSL
   - JWT tokens
   - CSRF protection
   - Input sanitization

3. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Cypress)

4. **Performance**
   - Code splitting
   - Image optimization
   - Lazy loading
   - CDN deployment

5. **Monitoring**
   - Error tracking (Sentry)
   - Analytics
   - User behavior tracking

6. **Accessibility**
   - WCAG compliance
   - Screen reader testing
   - Keyboard navigation

---

Happy coding! Make sure to test thoroughly before deploying. 🚀
