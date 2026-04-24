import express from "express"
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

// All budget routes are protected
router.use(protect)

router.get("/",    getBudgets)   // GET    /api/budgets
router.post("/",   createBudget) // POST   /api/budgets
router.put("/:id", updateBudget) // PUT    /api/budgets/:id
router.delete("/:id", deleteBudget) // DELETE /api/budgets/:id

export default router
