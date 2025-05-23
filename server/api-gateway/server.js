import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
import dotenv from "dotenv"
import cors from "cors"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Service URLs
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5001"
const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || "http://localhost:5002"
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:5003"

// Proxy middleware options
const options = {
  changeOrigin: true,
  pathRewrite: {
    "^/api/users": "/api",
    "^/api/books": "/api/books",
    "^/api/orders": "/api/orders",
  },
}

// Proxy routes
app.use("/api/users", createProxyMiddleware({ ...options, target: USER_SERVICE_URL }))
app.use("/api/books", createProxyMiddleware({ ...options, target: BOOK_SERVICE_URL }))
app.use("/api/orders", createProxyMiddleware({ ...options, target: ORDER_SERVICE_URL }))

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "API Gateway is running" })
})

// Documentation route
app.get("/", (req, res) => {
  res.send(`
    <h1>Book Store API Gateway</h1>
    <p>API Gateway for the Book Store microservices</p>
    <ul>
      <li><a href="${USER_SERVICE_URL}/api-docs" target="_blank">User Service Documentation</a></li>
      <li><a href="${BOOK_SERVICE_URL}/api-docs" target="_blank">Book Service Documentation</a></li>
      <li><a href="${ORDER_SERVICE_URL}/api-docs" target="_blank">Order Service Documentation</a></li>
    </ul>
  `)
})

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`)
  console.log(`User Service: ${USER_SERVICE_URL}`)
  console.log(`Book Service: ${BOOK_SERVICE_URL}`)
  console.log(`Order Service: ${ORDER_SERVICE_URL}`)
})

export default app
