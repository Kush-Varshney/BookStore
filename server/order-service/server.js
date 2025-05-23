import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
import path from "path"
import { fileURLToPath } from "url"
import orderRoutes from "./routes/orderRoutes.js"
import cors from "cors"

// ES module support for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const PORT = process.env.PORT || 5003

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, "./swagger/swagger.yaml"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Routes
app.use("/api", orderRoutes)

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Order Service is running" })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`)
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

export default app
