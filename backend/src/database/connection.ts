import { Sequelize } from "sequelize"

// Get database configuration from environment variables or use defaults
const DB_NAME = process.env.DB_NAME || "tienda_online"
const DB_USER = process.env.DB_USER || "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD || "postgres"
const DB_HOST = process.env.DB_HOST || "localhost"
const DB_PORT = process.env.DB_PORT || "5432"

// Create Sequelize instance
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number.parseInt(DB_PORT, 10),
  dialect: "postgres",
  logging: false,
})

// Test database connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("Database connection has been established successfully.")
    return true
  } catch (error) {
    console.error("Unable to connect to the database:", error)
    return false
  }
}

