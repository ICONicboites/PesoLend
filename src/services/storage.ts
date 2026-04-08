// localStorage utility functions
const STORAGE_KEYS = {
  USER: 'pesolend_user',
  LOANS: 'pesolend_loans',
  TRANSACTIONS: 'pesolend_transactions',
  ACTIVITIES: 'pesolend_activities',
  DARK_MODE: 'pesolend_dark_mode',
  REGISTERED_USERS: 'pesolend_registered_users',
}

// User management
export const setUser = (user: { id: string; name: string; email: string }) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER)
  return user ? JSON.parse(user) : null
}

export const clearUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

// Loan management
export interface Loan {
  id: string
  amount: number
  duration: number
  status: 'Pending' | 'Approved' | 'Rejected'
  date: string
  description?: string
}

export const addLoan = (loan: Omit<Loan, 'id' | 'date'>) => {
  const loans = getLoansList()
  const newLoan: Loan = {
    ...loan,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
  }
  loans.push(newLoan)
  localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans))
  addActivity(`Applied for a ₱${loan.amount.toLocaleString()} loan`)
  return newLoan
}

export const getLoansList = (): Loan[] => {
  const loans = localStorage.getItem(STORAGE_KEYS.LOANS)
  return loans ? JSON.parse(loans) : []
}

export const updateLoanStatus = (loanId: string, status: 'Pending' | 'Approved' | 'Rejected') => {
  const loans = getLoansList()
  const loan = loans.find(l => l.id === loanId)
  if (loan) {
    loan.status = status
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans))
    addActivity(`Loan #${loanId} status changed to ${status}`)
  }
}

// Transaction management
export interface Transaction {
  id: string
  type: 'Disbursement' | 'Payment'
  amount: number
  date: string
  loanId?: string
  description: string
}

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
  const transactions = getTransactions()
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
  }
  transactions.push(newTransaction)
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  return newTransaction
}

export const getTransactions = (): Transaction[] => {
  const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
  return transactions ? JSON.parse(transactions) : []
}

// Activity management
export interface Activity {
  id: string
  action: string
  timestamp: string
}

export const addActivity = (action: string) => {
  const activities = getActivities()
  const newActivity: Activity = {
    id: Date.now().toString(),
    action,
    timestamp: new Date().toISOString(),
  }
  activities.unshift(newActivity)
  // Keep only last 50 activities
  if (activities.length > 50) {
    activities.pop()
  }
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities))
}

export const getActivities = (): Activity[] => {
  const activities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES)
  return activities ? JSON.parse(activities) : []
}

// Dark mode
export const setDarkMode = (enabled: boolean) => {
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(enabled))
  if (enabled) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const getDarkMode = (): boolean => {
  const mode = localStorage.getItem(STORAGE_KEYS.DARK_MODE)
  if (mode !== null) {
    return JSON.parse(mode)
  }
  // Check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Initialize dark mode on app load
export const initDarkMode = () => {
  const darkMode = getDarkMode()
  setDarkMode(darkMode)
}

// Demo Account Login - Bypasses registration
export const loginDemoAccount = () => {
  const demoUser = {
    id: 'demo-user-001',
    name: 'Juan Dela Cruz',
    email: 'test@pesolend.com',
  }

  setUser(demoUser)

  // Initialize demo data
  const existingLoans = getLoansList()
  if (existingLoans.length === 0) {
    // Add demo loans
    const demoLoans: Loan[] = [
      {
        id: 'loan-001',
        amount: 50000,
        duration: 12,
        status: 'Approved',
        date: '2026-01-15',
        description: 'Personal Loan',
      },
      {
        id: 'loan-002',
        amount: 30000,
        duration: 6,
        status: 'Pending',
        date: '2026-04-09',
        description: 'Business Loan',
      },
    ]
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(demoLoans))
  }

  // Initialize demo transactions
  const existingTransactions = getTransactions()
  if (existingTransactions.length === 0) {
    const demoTransactions: Transaction[] = [
      {
        id: 'trans-001',
        type: 'Disbursement',
        amount: 50000,
        date: '2026-01-15',
        loanId: 'loan-001',
        description: 'Loan Approval - Loan #001',
      },
      {
        id: 'trans-002',
        type: 'Payment',
        amount: 5500,
        date: '2026-02-15',
        loanId: 'loan-001',
        description: 'Payment - Loan #001',
      },
      {
        id: 'trans-003',
        type: 'Payment',
        amount: 5500,
        date: '2026-03-15',
        loanId: 'loan-001',
        description: 'Payment - Loan #001',
      },
      {
        id: 'trans-004',
        type: 'Disbursement',
        amount: 30000,
        date: '2026-04-09',
        loanId: 'loan-002',
        description: 'Loan Approval - Loan #002',
      },
    ]
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(demoTransactions))
  }

  // Initialize demo activities
  const existingActivities = getActivities()
  if (existingActivities.length === 0) {
    const demoActivities: Activity[] = [
      {
        id: 'act-004',
        action: 'Applied for a ₱30,000.00 loan',
        timestamp: '2026-04-09T10:30:00.000Z',
      },
      {
        id: 'act-003',
        action: 'Made payment of ₱5,500.00',
        timestamp: '2026-03-15T14:20:00.000Z',
      },
      {
        id: 'act-002',
        action: 'Made payment of ₱5,500.00',
        timestamp: '2026-02-15T09:45:00.000Z',
      },
      {
        id: 'act-001',
        action: 'Received loan disbursement of ₱50,000.00',
        timestamp: '2026-01-15T08:00:00.000Z',
      },
    ]
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(demoActivities))
  }
}

// Verify demo account credentials
export const verifyDemoAccount = (email: string, password: string): boolean => {
  return email === 'test@pesolend.com' && password === 'Test123!'
}

// Registered user interface
export interface RegisteredUser {
  id: string
  email: string
  password: string
  name: string
  phone: string
  registeredAt: string
}

// Get all registered users
export const getRegisteredUsers = (): RegisteredUser[] => {
  const users = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS)
  return users ? JSON.parse(users) : []
}

// Save new registered user
export const registerUser = (data: {
  email: string
  password: string
  name: string
  phone: string
}): boolean => {
  const users = getRegisteredUsers()

  // Check if email already exists
  if (users.some((u) => u.email === data.email)) {
    return false
  }

  const newUser: RegisteredUser = {
    id: Date.now().toString(),
    email: data.email,
    password: data.password, // In production, this should be hashed
    name: data.name,
    phone: data.phone,
    registeredAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users))
  return true
}

// Validate user login and set user session
export const loginUser = (email: string, password: string): boolean => {
  // Check demo account first
  if (verifyDemoAccount(email, password)) {
    loginDemoAccount()
    return true
  }

  // Check registered users
  const users = getRegisteredUsers()
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    setUser({
      id: user.id,
      name: user.name,
      email: user.email,
    })
    return true
  }

  return false
}