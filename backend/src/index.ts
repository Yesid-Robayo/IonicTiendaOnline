import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
import { sequelize } from "./database/connection"
import productRoutes from "./routes/product.routes"
import userRoutes from "./routes/user.routes"
import cartRoutes from "./routes/cart.routes"
import { seedDatabase } from "./database/seed"

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tienda Online API",
      version: "1.0.0",
      description: "API para la aplicación móvil híbrida de tienda online",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Routes
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/cart", cartRoutes)

// Database initialization
async function initializeDatabase() {
  try {
    await sequelize.sync({ force: true })
    console.log("Database synchronized")

    // Seed the database with initial data
    await seedDatabase()
    console.log("Database seeded with initial data")
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  await initializeDatabase()
})

export default app

