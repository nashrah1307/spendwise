import axios from "axios"

// ── Base URL ───────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:5000/api"

// ── Create axios instance ──────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

// ── Request interceptor ────────────────────────────────────────────────────
// Automatically attach token to every request
// So we don't have to manually add it in every API call
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("spendwise_user") || "{}")
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

// ── Response interceptor ───────────────────────────────────────────────────
// If token expires or is invalid, redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("spendwise_user")
      localStorage.removeItem("spendwise_auth")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

// ── Auth APIs ──────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login:  (data) => api.post("/auth/login", data),
  getMe:  ()     => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
}

// ── Transaction APIs ───────────────────────────────────────────────────────
export const transactionAPI = {
  // Get all transactions with optional filters
  getAll: (filters = {}) => api.get("/transactions", { params: filters }),

  // Get summary (total income, expense, balance)
  getSummary: (month) => api.get("/transactions/summary", { params: { month } }),

  // Create a new transaction
  create: (data) => api.post("/transactions", data),

  // Update a transaction by id
  update: (id, data) => api.put(`/transactions/${id}`, data),

  // Delete a transaction by id
  delete: (id) => api.delete(`/transactions/${id}`),
}

// ── Budget APIs ────────────────────────────────────────────────────────────
export const budgetAPI = {
  // Get all budgets for a month
  getAll: (month) => api.get("/budgets", { params: { month } }),

  // Create a new budget
  create: (data) => api.post("/budgets", data),

  // Update a budget by id
  update: (id, data) => api.put(`/budgets/${id}`, data),

  // Delete a budget by id
  delete: (id) => api.delete(`/budgets/${id}`),
}

export default api
