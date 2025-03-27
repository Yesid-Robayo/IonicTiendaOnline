import { DataTypes, Model } from "sequelize"
import { sequelize } from "../database/connection"

interface ProductAttributes {
  id?: number
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  stock: number
}

export class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number
  public name!: string
  public description!: string
  public price!: number
  public imageUrl!: string
  public category!: string
  public stock!: number
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Product",
  },
)

