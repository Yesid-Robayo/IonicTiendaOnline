import type { Request, Response } from "express"
import { Product } from "../models/Product"

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll()
    return res.status(200).json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return res.status(500).json({ message: "Error al obtener productos" })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" })
    }

    return res.status(200).json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return res.status(500).json({ message: "Error al obtener el producto" })
  }
}

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params
    const products = await Product.findAll({
      where: { category },
    })

    return res.status(200).json(products)
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return res.status(500).json({ message: "Error al obtener productos por categoría" })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, category, stock } = req.body

    const newProduct = await Product.create({
      name,
      description,
      price,
      imageUrl,
      category,
      stock,
    })

    return res.status(201).json(newProduct)
  } catch (error) {
    console.error("Error creating product:", error)
    return res.status(500).json({ message: "Error al crear el producto" })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, description, price, imageUrl, category, stock } = req.body

    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" })
    }

    await product.update({
      name,
      description,
      price,
      imageUrl,
      category,
      stock,
    })

    return res.status(200).json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return res.status(500).json({ message: "Error al actualizar el producto" })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" })
    }

    await product.destroy()

    return res.status(200).json({ message: "Producto eliminado correctamente" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return res.status(500).json({ message: "Error al eliminar el producto" })
  }
}

