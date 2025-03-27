import type { Request, Response } from "express"
import { User } from "../models/User"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" })
    }

    // Create new user
    const newUser = await User.create({
      email,
      password,
      name,
      role: "user",
    })

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
      expiresIn: "24h",
    })

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Error registering user:", error)
    return res.status(500).json({ message: "Error al registrar usuario" })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" })

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error logging in:", error)
    return res.status(500).json({ message: "Error al iniciar sesión" })
  }
}

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" })
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return res.status(500).json({ message: "Error al obtener perfil de usuario" })
  }
}

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" })
    }

    const { name, email } = req.body

    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    await user.update({
      name,
      email,
    })

    return res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return res.status(500).json({ message: "Error al actualizar perfil de usuario" })
  }
}

