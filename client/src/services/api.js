import axios from "axios"

// ── Base URL now comes from .env instead of being hardcoded ────────────────
// This means when you deploy later, you just change the .env value —
// no code changes needed.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("spendwise_user") || "{}")
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

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

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login:  (data) => api.post("/auth/login", data),
  getMe:  ()     => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
}

export const transactionAPI = {
  getAll: (filters = {}) => api.get("/transactions", { params: filters }),
  getSummary: (month) => api.get("/transactions/summary", { params: { month } }),
  create: (data) => api.post("/transactions", data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
}

export const budgetAPI = {
  getAll: (month) => api.get("/budgets", { params: { month } }),
  create: (data) => api.post("/budgets", data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
}

export default api
