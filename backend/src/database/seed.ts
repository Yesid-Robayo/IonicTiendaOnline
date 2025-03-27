import { Product } from "../models/Product"
import { User } from "../models/User"

export const seedDatabase = async () => {
  // Create default admin user
  await User.create({
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  })

  // Create default regular user
  await User.create({
    email: "user@example.com",
    password: "user123",
    name: "Regular User",
    role: "user",
  })

  // Create default products
  const products = [
    {
      name: "Smartphone XYZ",
      description: "Último modelo con cámara de alta resolución y batería de larga duración.",
      price: 699.99,
      imageUrl: "https://png.pngtree.com/png-clipart/20240907/original/pngtree-the-new-xyz-smartphone-design-and-innovation-png-image_15964110.png",
      category: "Electrónica",
      stock: 50,
    },
    {
      name: "Laptop Pro",
      description: "Potente laptop para profesionales con procesador de última generación.",
      price: 1299.99,
      imageUrl: "https://co-media.hptiendaenlinea.com/catalog/product/A/2/A24Z2LT-1_T1740417369.png",
      category: "Electrónica",
      stock: 30,
    },
    {
      name: "Auriculares Inalámbricos",
      description: "Auriculares con cancelación de ruido y sonido de alta calidad.",
      price: 149.99,
      imageUrl: "https://exitocol.vteximg.com.br/arquivos/ids/10956983/auriculares-inalambricos-con-cancelacion-de-ruido.jpg?v=637731958568000000",
      category: "Accesorios",
      stock: 100,
    },
    {
      name: "Smartwatch Fitness",
      description: "Reloj inteligente con monitoreo de actividad física y notificaciones.",
      price: 199.99,
      imageUrl: "https://m.media-amazon.com/images/I/71JU-bUt-sL.jpg",
      category: "Wearables",
      stock: 45,
    },
    {
      name: "Tablet Ultra",
      description: "Tablet con pantalla de alta resolución ideal para entretenimiento y trabajo.",
      price: 349.99,
      imageUrl: "https://exitocol.vteximg.com.br/arquivos/ids/26894595/Table-SAMSUNG-GALAXY-Tab-S9-Ultra-146-pulgadas-Wifi-256-GB-12-GB-RAM-Gris-3424495_a.jpg",
      category: "Electrónica",
      stock: 25,
    },
    {
      name: "Cámara Digital Pro",
      description: "Cámara profesional con sensor de alta resolución y grabación 4K.",
      price: 899.99,
      imageUrl: "https://m.media-amazon.com/images/I/81vCVCSvm7S.jpg",
      category: "Fotografía",
      stock: 15,
    },
    {
      name: "Altavoz Bluetooth",
      description: "Altavoz portátil con sonido envolvente y batería de larga duración.",
      price: 79.99,
      imageUrl: "https://http2.mlstatic.com/D_NQ_NP_650703-MLU73767765268_012024-O.webp",
      category: "Audio",
      stock: 60,
    },
    {
      name: "Monitor Curvo Gaming",
      description: "Monitor de alta tasa de refresco ideal para gaming y diseño.",
      price: 449.99,
      imageUrl: "https://www.lg.com/content/dam/channel/wcms/co/images/monitores/34gp63a-b_awp_escb_co_c/gallery/DZ-01.jpg",
      category: "Periféricos",
      stock: 20,
    },
  ]

  await Product.bulkCreate(products)
}

