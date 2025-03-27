import { DataTypes, Model } from "sequelize"
import { sequelize } from "../database/connection"
import { User } from "./User"
import { Product } from "./Product"

interface CartItemAttributes {
  id?: number
  userId: number
  productId: number
  quantity: number
}

export class CartItem extends Model<CartItemAttributes> implements CartItemAttributes {
  public id!: number
  public userId!: number
  public productId!: number
  public quantity!: number
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "CartItem",
  },
)

// Define associations
User.hasMany(CartItem, { foreignKey: "userId" })
CartItem.belongsTo(User, { foreignKey: "userId" })

Product.hasMany(CartItem, { foreignKey: "productId" })
CartItem.belongsTo(Product, { foreignKey: "productId" })

