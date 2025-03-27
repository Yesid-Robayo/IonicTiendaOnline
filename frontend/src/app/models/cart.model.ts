import  { Product } from "./product.model"

export interface CartItem {
  id?: number
  userId?: number
  productId: number
  quantity: number
  Product?: Product
}

