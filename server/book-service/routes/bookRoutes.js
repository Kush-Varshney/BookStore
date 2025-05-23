import express from "express"
import { 
  addBook, 
  getBooks, 
  getBookById, 
  updateBook, 
  deleteBook, 
  searchBooks,
  addReview,
  getReviews
} from "../controllers/bookController.js"
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()

// Search route should be before the /:id route to avoid conflicts
router.get("/books/search", searchBooks)

// Book routes
router.post("/books", verifyToken, adminOnly, addBook)
router.get("/books", getBooks)
router.get("/books/:id", getBookById)
router.put("/books/:id", verifyToken, adminOnly, updateBook)
router.delete("/books/:id", verifyToken, adminOnly, deleteBook)

// Review routes
router.post("/books/:id/reviews", verifyToken, addReview)
router.get("/books/:id/reviews", getReviews)

export default router
