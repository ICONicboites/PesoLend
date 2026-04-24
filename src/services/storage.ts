// localStorage utility functions
const STORAGE_KEYS = {
  USER: 'pesolend_user',
  LOANS: 'pesolend_loans',
  TRANSACTIONS: 'pesolend_transactions',
  ACTIVITIES: 'pesolend_activities',
  DARK_MODE: 'pesolend_dark_mode',
  REGISTERED_USERS: 'pesolend_registered_users',
  SUPPORT_TICKETS: 'pesolend_support_tickets',
  PAYMENT_METHODS: 'pesolend_payment_methods',
  BALANCE_TRANSACTIONS: 'pesolend_balance_transactions',
}

// Built-in admin account
const ADMIN_CREDENTIALS = {
  email: 'admin@pesolend.com',
  password: 'rivera6969',
  id: 'admin-001',
  name: 'Admin',
  isAdmin: true,
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
  userId: string
  amount: number
  duration: number
  status: 'Pending' | 'Approved' | 'Rejected'
  date: string
  description?: string
  paymentMethodId?: string
}

export const addLoan = (loan: Omit<Loan, 'id' | 'date' | 'userId'>) => {
  const user = getUser()
  if (!user) return null
  
  const loans = getAllLoans()
  const newLoan: Loan = {
    ...loan,
    userId: user.id,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    paymentMethodId: loan.paymentMethodId || 'pm-gcash',
  }
  loans.push(newLoan)
  localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans))
  addActivity(`Applied for a ₱${loan.amount.toLocaleString()} loan`)
  addActivityForUser(
    ADMIN_CREDENTIALS.id,
    `${user.name} applied for a ₱${loan.amount.toLocaleString()} loan`
  )
  return newLoan
}

// Get all loans (internal use)
export const getAllLoans = (): Loan[] => {
  const loans = localStorage.getItem(STORAGE_KEYS.LOANS)
  return loans ? JSON.parse(loans) : []
}

// Get loans for current user only
export const getLoansList = (): Loan[] => {
  const user = getUser()
  if (!user) return []
  
  const allLoans = getAllLoans()
  return allLoans.filter(l => l.userId === user.id)
}

export const updateLoanStatus = (loanId: string, status: 'Pending' | 'Approved' | 'Rejected', paymentMethodId?: string) => {
  const loans = getAllLoans()
  const loan = loans.find(l => l.id === loanId)
  if (loan) {
    const previousStatus = loan.status // Save before modifying
    loan.status = status
    if (paymentMethodId) {
      loan.paymentMethodId = paymentMethodId
    }
    
    // Transfer funds OUT when loan is approved (admin lends money to customer)
    if (status === 'Approved' && previousStatus !== 'Approved' && loan.paymentMethodId) {
      const selectedMethod = loan.paymentMethodId
      deductFromPaymentMethod(selectedMethod, loan.amount)
      
      // Create disbursement transaction record
      addTransaction({
        type: 'Disbursement',
        amount: loan.amount,
        loanId,
        paymentMethodId: selectedMethod,
        description: `Loan disbursement via ${selectedMethod}`,
        status: 'Approved'
      })
      
      // Notify the customer
      addActivityForUser(loan.userId, `Your loan of ₱${loan.amount.toLocaleString()} has been approved and disbursed`)
      addActivity(`Loan #${loanId} approved — ₱${loan.amount.toLocaleString()} disbursed`)
    }
    
    // Only reverse funds if the loan was previously Approved (rollback disbursement)
    if (status === 'Rejected') {
      if (previousStatus === 'Approved' && loan.paymentMethodId) {
        // Funds were already sent out — add them back
        addToPaymentMethod(loan.paymentMethodId, loan.amount)
      }
      addActivityForUser(loan.userId, `Your loan application of ₱${loan.amount.toLocaleString()} has been rejected`)
      addActivity(`Loan #${loanId} rejected`)
    }
    
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans))
  }
}

// Transaction management
export interface Transaction {
  id: string
  userId: string
  type: 'Disbursement' | 'Payment' | 'Deposit' | 'Withdrawal'
  amount: number
  date: string
  loanId?: string
  description: string
  status: 'Pending' | 'Approved' | 'Rejected'
  paymentMethodId?: string
}

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'date' | 'userId'>) => {
  const user = getUser()
  if (!user) return null
  
  const transactions = getAllTransactions()
  const newTransaction: Transaction = {
    ...transaction,
    userId: user.id,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    status: transaction.status || 'Pending',
  }
  transactions.push(newTransaction)
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  return newTransaction
}

// Get all transactions (internal use)
export const getAllTransactions = (): Transaction[] => {
  const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
  return transactions ? JSON.parse(transactions) : []
}

// Get transactions for current user only
export const getTransactions = (): Transaction[] => {
  const user = getUser()
  if (!user) return []
  
  const allTransactions = getAllTransactions()
  return allTransactions.filter(t => t.userId === user.id)
}

// Activity management
export interface Activity {
  id: string
  userId: string
  action: string
  timestamp: string
}

export const addActivity = (action: string) => {
  const user = getUser()
  if (!user) return
  
  const activities = getAllActivities()
  const newActivity: Activity = {
    id: Date.now().toString(),
    userId: user.id,
    action,
    timestamp: new Date().toISOString(),
  }
  activities.unshift(newActivity)
  // Keep only last 100 activities per user
  if (activities.length > 100) {
    activities.pop()
  }
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities))
}

// Get all activities (internal use)
export const getAllActivities = (): Activity[] => {
  const activities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES)
  return activities ? JSON.parse(activities) : []
}

// Get activities for current user only
export const getActivities = (): Activity[] => {
  const user = getUser()
  if (!user) return []
  
  const allActivities = getAllActivities()
  return allActivities.filter(a => a.userId === user.id)
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
  // Check admin credentials first
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    setUser({
      id: ADMIN_CREDENTIALS.id,
      name: ADMIN_CREDENTIALS.name,
      email: ADMIN_CREDENTIALS.email,
    })
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

// Check if current user is admin
export const isAdmin = (): boolean => {
  const user = getUser()
  return user?.id === ADMIN_CREDENTIALS.id
}

// Payment method balance functions
export const deductFromPaymentMethod = (paymentMethodId: string, amount: number): boolean => {
  try {
    const methods = getPaymentMethods()
    const method = methods.find(m => m.id === paymentMethodId)
    if (method) {
      method.available_balance -= amount
      localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(methods))
      return true
    }
    return false
  } catch (error) {
    console.error('Error deducting from payment method:', error)
    return false
  }
}

export const addToPaymentMethod = (paymentMethodId: string, amount: number): boolean => {
  try {
    const methods = getPaymentMethods()
    const method = methods.find(m => m.id === paymentMethodId)
    if (method) {
      method.available_balance += amount
      localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(methods))
      return true
    }
    return false
  } catch (error) {
    console.error('Error adding to payment method:', error)
    return false
  }
}

// Payment Processing Functions
export const processPayment = (
  amount: number,
  loanId: string,
  paymentMethod: string,
  description: string
): boolean => {
  if (amount <= 0) {
    return false
  }

  try {
    const loans = getAllLoans()
    const loan = loans.find(l => l.id === loanId)
    if (!loan || loan.status !== 'Approved') {
      return false
    }

    // Return payment to the same wallet used for disbursement (borrow wallet)
    const disbursementWalletId = loan.paymentMethodId || 'pm-gcash'
    const credited = addToPaymentMethod(disbursementWalletId, amount)
    if (!credited) {
      return false
    }
    
    // Record the payment transaction
    const transaction = addTransaction({
      type: 'Payment',
      amount,
      loanId,
      paymentMethodId: disbursementWalletId,
      description: `Payment - ${description} (${paymentMethod})`,
      status: 'Approved'
    })

    // Add activity log
    addActivity(`Made a payment of ₱${amount.toLocaleString()} via ${paymentMethod}`)
    if (loan.userId) {
      const users = getRegisteredUsers()
      const borrower = users.find(u => u.id === loan.userId)
      const payerName = borrower?.name || 'Customer'
      addActivityForUser(
        ADMIN_CREDENTIALS.id,
        `${payerName} paid ₱${amount.toLocaleString()} for loan #${loanId}`
      )
    }

    return !!transaction
  } catch (error) {
    console.error('Payment processing error:', error)
    return false
  }
}

// Get loan by ID
export const getLoanById = (loanId: string): Loan | undefined => {
  const loans = getLoansList()
  return loans.find(l => l.id === loanId)
}

// Get loan by ID (admin version - all loans)
export const getLoanByIdAdmin = (loanId: string): Loan | undefined => {
  const loans = getAllLoans()
  return loans.find(l => l.id === loanId)
}

// Get remaining balance for a specific loan
export const getLoanRemainingBalance = (loanId: string): number => {
  const loan = getLoanByIdAdmin(loanId)
  if (!loan || loan.status !== 'Approved') return 0
  
  const transactions = getAllTransactions()
  const payments = transactions
    .filter(t => t.loanId === loanId && t.type === 'Payment' && t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0)
  
  return Math.max(0, loan.amount - payments)
}

// Get total disbursed amount
export const getTotalDisbursed = (): number => {
  const transactions = getTransactions()
  return transactions
    .filter(t => t.type === 'Disbursement' && t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0)
}

// Get total payments made
export const getTotalPayments = (): number => {
  const transactions = getTransactions()
  return transactions
    .filter(t => t.type === 'Payment' && t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0)
}

// Total amount the bank has already lent to the current user.
export const getBorrowedBalance = (): number => {
  return getTotalDisbursed()
}

// Remaining debt = borrowed amount - total payments made.
export const getOutstandingBalance = (): number => {
  return Math.max(0, getBorrowedBalance() - getTotalPayments())
}

// ====== ADMIN-FACING FINANCIAL METRICS ======

// Total amount lent out to ALL customers (sum of approved Disbursements)
export const getAdminTotalDisbursed = (): number => {
  return getAllTransactions()
    .filter(t => t.type === 'Disbursement' && t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0)
}

// Total payments collected back from ALL customers (sum of approved Payments)
export const getAdminTotalCollected = (): number => {
  return getAllTransactions()
    .filter(t => t.type === 'Payment' && t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0)
}

// Net amount still owed by all customers (disbursed - collected, min 0)
export const getAdminOutstandingDebt = (): number => {
  return Math.max(0, getAdminTotalDisbursed() - getAdminTotalCollected())
}

// Get available credit (fixed amount - total disbursed + total payments)
export const getAvailableCredit = (): number => {
  const totalCredit = 100000 // Default available credit
  const remainingDebt = getOutstandingBalance()
  return Math.min(totalCredit, Math.max(0, totalCredit - remainingDebt))
}

// Get active loans
export const getActiveLoans = (): Loan[] => {
  const loans = getLoansList()
  return loans.filter(l => l.status === 'Approved')
}

// Get pending loans (ALL loans - for admin)
export const getPendingLoans = (): Loan[] => {
  const loans = getAllLoans()
  return loans.filter(l => l.status === 'Pending')
}

// Support Ticket Management
export interface SupportTicket {
  id: string
  userId: string
  userName: string
  userEmail: string
  subject: string
  message: string
  status: 'Open' | 'In Progress' | 'Resolved'
  createdAt: string
  replies: {
    id: string
    from: string // 'user' or 'admin'
    message: string
    timestamp: string
  }[]
}

// Get all support tickets (admin only)
export const getAllSupportTickets = (): SupportTicket[] => {
  const tickets = localStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS)
  return tickets ? JSON.parse(tickets) : []
}

// Get support tickets for current user
export const getUserSupportTickets = (): SupportTicket[] => {
  const user = getUser()
  if (!user) return []
  
  const allTickets = getAllSupportTickets()
  return allTickets.filter(t => t.userId === user.id)
}

// Create new support ticket
export const createSupportTicket = (data: {
  subject: string
  message: string
}): SupportTicket | null => {
  const user = getUser()
  if (!user) return null
  
  const tickets = getAllSupportTickets()
  const newTicket: SupportTicket = {
    id: Date.now().toString(),
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    subject: data.subject,
    message: data.message,
    status: 'Open',
    createdAt: new Date().toISOString(),
    replies: [],
  }
  
  tickets.push(newTicket)
  localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(tickets))
  addActivity(`Created support ticket: ${data.subject}`)
  return newTicket
}

// ====== PAYMENT METHODS & BALANCE MANAGEMENT ======

// Payment Method Interface
export interface PaymentMethod {
  id: string
  name: string
  type: 'GCash' | 'Bank Transfer' | 'PayPal' | 'Other'
  available_balance: number
  createdAt: string
  status: 'Active' | 'Inactive'
}

// Balance Transaction Record (for audit)
export interface BalanceTransaction {
  id: string
  paymentMethodId: string
  type: 'Deposit' | 'Withdrawal'
  amount: number
  transactionId: string // Reference to main transaction
  status: 'Pending' | 'Approved' | 'Rejected'
  previousBalance: number
  newBalance: number
  timestamp: string
  description: string
}

// Initialize default payment methods
const initializePaymentMethods = () => {
  const existing = localStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS)
  if (!existing || JSON.parse(existing).length === 0) {
    const defaults: PaymentMethod[] = [
      {
        id: 'pm-gcash',
        name: 'GCash',
        type: 'GCash',
        available_balance: 1000000,
        createdAt: new Date().toISOString(),
        status: 'Active',
      },
      {
        id: 'pm-bank',
        name: 'Bank Transfer',
        type: 'Bank Transfer',
        available_balance: 1000000,
        createdAt: new Date().toISOString(),
        status: 'Active',
      },
      {
        id: 'pm-paypal',
        name: 'PayPal',
        type: 'PayPal',
        available_balance: 1000000,
        createdAt: new Date().toISOString(),
        status: 'Active',
      },
    ]
    localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(defaults))
  }
}

// Get all payment methods
export const getPaymentMethods = (): PaymentMethod[] => {
  initializePaymentMethods()
  const methods = localStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS)
  return methods ? JSON.parse(methods) : []
}

// Get payment method by ID
export const getPaymentMethodById = (id: string): PaymentMethod | undefined => {
  const methods = getPaymentMethods()
  return methods.find(m => m.id === id)
}

// Get total system balance across all payment methods
export const getTotalSystemBalance = (): number => {
  const methods = getPaymentMethods()
  return methods.reduce((sum, m) => sum + m.available_balance, 0)
}

// Update payment method balance
const updatePaymentMethodBalance = (paymentMethodId: string, newBalance: number) => {
  const methods = getPaymentMethods()
  const method = methods.find(m => m.id === paymentMethodId)
  if (method) {
    method.available_balance = Math.max(0, newBalance) // Ensure balance never goes below 0
    localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(methods))
  }
}

// Record balance transaction (for audit trail)
const recordBalanceTransaction = (record: Omit<BalanceTransaction, 'id' | 'timestamp'>) => {
  const balanceTransactions = getAllBalanceTransactions()
  const newRecord: BalanceTransaction = {
    ...record,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  }
  balanceTransactions.push(newRecord)
  localStorage.setItem(STORAGE_KEYS.BALANCE_TRANSACTIONS, JSON.stringify(balanceTransactions))
  return newRecord
}

// Get all balance transactions (admin only)
export const getAllBalanceTransactions = (): BalanceTransaction[] => {
  const transactions = localStorage.getItem(STORAGE_KEYS.BALANCE_TRANSACTIONS)
  return transactions ? JSON.parse(transactions) : []
}

// Get balance transactions for a specific payment method
export const getPaymentMethodTransactions = (paymentMethodId: string): BalanceTransaction[] => {
  const allTransactions = getAllBalanceTransactions()
  return allTransactions.filter(t => t.paymentMethodId === paymentMethodId)
}

// Process transaction status change and update balance
export const updateTransactionStatus = (
  transactionId: string,
  newStatus: 'Pending' | 'Approved' | 'Rejected',
  paymentMethodId?: string
): boolean => {
  try {
    const transactions = getAllTransactions()
    const transaction = transactions.find(t => t.id === transactionId)
    
    if (!transaction) return false

    const oldStatus = transaction.status
    transaction.status = newStatus

    // Only update balance when transitioning to Approved
    if (oldStatus !== 'Approved' && newStatus === 'Approved' && paymentMethodId) {
      const paymentMethod = getPaymentMethodById(paymentMethodId)
      if (!paymentMethod) return false

      const previousBalance = paymentMethod.available_balance
      let newBalance = previousBalance

      if (transaction.type === 'Deposit' || transaction.type === 'Payment') {
        // Deposits and payments increase balance
        newBalance = previousBalance + transaction.amount
      } else if (transaction.type === 'Withdrawal' || transaction.type === 'Disbursement') {
        // Withdrawals and disbursements decrease balance
        if (previousBalance < transaction.amount) {
          return false // Insufficient balance
        }
        newBalance = previousBalance - transaction.amount
      }

      // Update payment method balance
      updatePaymentMethodBalance(paymentMethodId, newBalance)

      // Record balance transaction for audit
      recordBalanceTransaction({
        paymentMethodId,
        type: (transaction.type === 'Deposit' || transaction.type === 'Payment') ? 'Deposit' : 'Withdrawal',
        amount: transaction.amount,
        transactionId,
        status: 'Approved',
        previousBalance,
        newBalance,
        description: transaction.description,
      })
    } else if (oldStatus === 'Approved' && newStatus === 'Rejected' && paymentMethodId) {
      // Reverse the transaction if it was previously approved
      const paymentMethod = getPaymentMethodById(paymentMethodId)
      if (!paymentMethod) return false

      const previousBalance = paymentMethod.available_balance
      let newBalance = previousBalance

      if (transaction.type === 'Deposit' || transaction.type === 'Payment') {
        newBalance = previousBalance - transaction.amount
      } else if (transaction.type === 'Withdrawal' || transaction.type === 'Disbursement') {
        newBalance = previousBalance + transaction.amount
      }

      updatePaymentMethodBalance(paymentMethodId, newBalance)

      recordBalanceTransaction({
        paymentMethodId,
        type: (transaction.type === 'Deposit' || transaction.type === 'Payment') ? 'Deposit' : 'Withdrawal',
        amount: transaction.amount,
        transactionId,
        status: 'Rejected',
        previousBalance,
        newBalance,
        description: transaction.description,
      })
    }

    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
    addActivity(`Transaction #${transactionId} status changed to ${newStatus}`)
    return true
  } catch (error) {
    console.error('Error updating transaction status:', error)
    return false
  }
}

// Create a customer transaction (Deposit/Withdrawal)
export const createCustomerTransaction = (data: {
  type: 'Deposit' | 'Withdrawal'
  amount: number
  paymentMethodId: string
  description: string
}): Transaction | null => {
  const user = getUser()
  if (!user) return null

  // Validate payment method exists
  const paymentMethod = getPaymentMethodById(data.paymentMethodId)
  if (!paymentMethod) return null

  // For withdrawals, check if sufficient balance exists
  if (data.type === 'Withdrawal' && paymentMethod.available_balance < data.amount) {
    return null // Insufficient balance
  }

  const transaction = addTransaction({
    type: data.type,
    amount: data.amount,
    paymentMethodId: data.paymentMethodId,
    description: data.description,
    status: 'Pending',
  })

  if (transaction) {
    const actionText = data.type === 'Deposit' ? 'requested a deposit' : 'requested a withdrawal'
    addActivity(`${actionText} of ₱${data.amount.toLocaleString()} via ${paymentMethod.name}`)
  }

  return transaction
}

// Get transactions filtered by various criteria
export const getFilteredTransactions = (filters: {
  paymentMethodId?: string
  type?: 'Deposit' | 'Withdrawal'
  status?: 'Pending' | 'Approved' | 'Rejected'
  startDate?: string
  endDate?: string
  isAdmin?: boolean
}): Transaction[] => {
  let transactions = filters.isAdmin ? getAllTransactions() : getTransactions()

  if (filters.paymentMethodId) {
    transactions = transactions.filter(t => t.paymentMethodId === filters.paymentMethodId)
  }

  if (filters.type) {
    transactions = transactions.filter(t => t.type === filters.type)
  }

  if (filters.status) {
    transactions = transactions.filter(t => t.status === filters.status)
  }

  if (filters.startDate) {
    const start = filters.startDate
    transactions = transactions.filter(t => t.date >= start)
  }

  if (filters.endDate) {
    const end = filters.endDate
    transactions = transactions.filter(t => t.date <= end)
  }

  return transactions
}

// Add reply to support ticket
export const addTicketReply = (ticketId: string, from: 'user' | 'admin', message: string): boolean => {
  const tickets = getAllSupportTickets()
  const ticket = tickets.find(t => t.id === ticketId)
  
  if (ticket) {
    ticket.replies.push({
      id: Date.now().toString(),
      from,
      message,
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(tickets))
    
    if (from === 'admin') {
      addActivityForUser(ticket.userId, `Admin replied to your support ticket: ${ticket.subject}`)
    }
    return true
  }
  return false
}

// Update ticket status
export const updateTicketStatus = (ticketId: string, status: 'Open' | 'In Progress' | 'Resolved'): boolean => {
  const tickets = getAllSupportTickets()
  const ticket = tickets.find(t => t.id === ticketId)
  
  if (ticket) {
    ticket.status = status
    localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(tickets))
    return true
  }
  return false
}

// Add activity for a specific user (helper for admin actions)
export const addActivityForUser = (userId: string, action: string) => {
  const activities = getAllActivities()
  const newActivity: Activity = {
    id: Date.now().toString(),
    userId,
    action,
    timestamp: new Date().toISOString(),
  }
  activities.unshift(newActivity)
  if (activities.length > 100) {
    activities.pop()
  }
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities))
}