import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "JWT123"

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        email: string
        role: string
      }
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number
      email: string
      role: string
    }

    // Add user info to request
    req.user = decoded

    next()
  } catch (error) {
    console.error("Authentication error:", error)
    return res.status(401).json({ message: "Invalid token" })
  }
}

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" })
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador" })
    }

    next()
  } catch (error) {
    console.error("Authorization error:", error)
    return res.status(403).json({ message: "Error de autorización" })
  }
}

