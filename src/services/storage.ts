// localStorage utility functions
const STORAGE_KEYS = {
  USER: 'pesolend_user',
  LOANS: 'pesolend_loans',
  TRANSACTIONS: 'pesolend_transactions',
  ACTIVITIES: 'pesolend_activities',
  DARK_MODE: 'pesolend_dark_mode',
  REGISTERED_USERS: 'pesolend_registered_users',
  SUPPORT_TICKETS: 'pesolend_support_tickets',
}

// Built-in admin account
const ADMIN_CREDENTIALS = {
  email: 'admin@pesolend.com',
  password: 'admin123',
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
  }
  loans.push(newLoan)
  localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans))
  addActivity(`Applied for a ₱${loan.amount.toLocaleString()} loan`)
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

export const updateLoanStatus = (loanId: string, status: 'Pending' | 'Approved' | 'Rejected') => {
  const loans = getAllLoans()
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
  userId: string
  type: 'Disbursement' | 'Payment'
  amount: number
  date: string
  loanId?: string
  description: string
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
    // Add payment transaction
    const transaction = addTransaction({
      type: 'Payment',
      amount,
      loanId,
      description: `Payment - ${description} (${paymentMethod})`,
    })

    // Add activity log
    addActivity(`Made a payment of ₱${amount.toLocaleString()} via ${paymentMethod}`)

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

// Get total disbursed amount
export const getTotalDisbursed = (): number => {
  const transactions = getTransactions()
  return transactions
    .filter(t => t.type === 'Disbursement')
    .reduce((sum, t) => sum + t.amount, 0)
}

// Get total payments made
export const getTotalPayments = (): number => {
  const transactions = getTransactions()
  return transactions
    .filter(t => t.type === 'Payment')
    .reduce((sum, t) => sum + t.amount, 0)
}

// Get available credit (fixed amount - total disbursed + total payments)
export const getAvailableCredit = (): number => {
  const totalCredit = 100000 // Default available credit
  const totalDisbursed = getTotalDisbursed()
  const totalPayments = getTotalPayments()
  return totalCredit - totalDisbursed + totalPayments
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