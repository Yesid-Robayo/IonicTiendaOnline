import type { Request, Response } from "express"
import { CartItem } from "../models/Cart"
import { Product } from "../models/Product"

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" })
    }

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [Product],
    })

    return res.status(200).json(cartItems)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return res.status(500).json({ message: "Error al obtener el carrito" })
  }
}

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" })
    }

    const { productId, quantity } = req.body

    // Check if product exists
    const product = await Product.findByPk(productId)
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" })
    }

    // Check if product is in stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Producto sin stock suficiente" })
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: { userId, productId },
    })

    if (cartItem) {
      // Update quantity if item already exists
      await cartItem.update({
        quantity: cartItem.quantity + quantity,
      })
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        userId,
        productId,
        quantity
      })
      
    }

    // Get updated cart item with product details
    const updatedCartItem = await CartItem.findByPk(cartItem.id, {
      include: [Product],
    })

    return res.status(200).json(updatedCartItem)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return res.status(500).json({ message: "Error al agregar al carrito" })
  }
}

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" })
    }

    const { id } = req.params
    const { quantity } = req.body

    // Find cart item
    const cartItem = await CartItem.findOne({
      where: { id, userId },
      include: [Product],
    })

    if (!cartItem) {
      return res.status(404).json({ message: "Item de carrito no encontrado" })
    }

    // Check if product has enough stock
    const product = await Product.findByPk(cartItem.productId)
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: "Producto sin stock suficiente" })
    }

    // Update quantity
    await cartItem.update({ quantity })

    // Get updated cart item
    const updatedCartItem = await CartItem.findByPk(cartItem.id, {
      include: [Product],
    })

    return res.status(200).json(updatedCartItem)
  } catch (error) {
    console.error("Error updating cart item:", error)
    return res.status(500).json({ message: "Error al actualizar item del carrito" })
  }
}

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" })
    }

    const { id } = req.params

    // Find cart item
    const cartItem = await CartItem.findOne({
      where: { id, userId },
    })

    if (!cartItem) {
      return res.status(404).json({ message: "Item de carrito no encontrado" })
    }

    // Delete cart item
    await cartItem.destroy()

    return res.status(200).json({ message: "Item eliminado del carrito" })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return res.status(500).json({ message: "Error al eliminar del carrito" })
  }
}

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" })
    }

    // Delete all cart items for user
    await CartItem.destroy({
      where: { userId },
    })

    return res.status(200).json({ message: "Carrito vaciado correctamente" })
  } catch (error) {
    console.error("Error clearing cart:", error)
    return res.status(500).json({ message: "Error al vaciar el carrito" })
  }
}

