import { Component,  CUSTOM_ELEMENTS_SCHEMA,  OnInit } from "@angular/core"
import {  ActivatedRoute, RouterLink } from "@angular/router"
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonSpinner,
  IonImg,
  IonChip,
  IonLabel,
   ToastController,
} from "@ionic/angular/standalone"
import { NgIf, NgClass, CurrencyPipe } from "@angular/common"
import { addIcons } from "ionicons"
import { cartOutline, cart, checkmarkCircle, closeCircle, removeCircle, addCircle } from "ionicons/icons"

import  { ProductService } from "../../services/product.service"
import  { CartService } from "../../services/cart.service"
import  { Product } from "../../models/product.model"

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.page.html",
  styleUrls: ["./product-detail.page.scss"],
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgClass,
    CurrencyPipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonSpinner,
    IonImg,
    IonChip,
    IonLabel,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class ProductDetailPage implements OnInit {
  product: Product | null = null
  quantity = 1
  isLoading = true

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastController: ToastController,
  ) {
    addIcons({ cartOutline, cart, checkmarkCircle, closeCircle, removeCircle, addCircle })
  }

  ngOnInit() {
    this.loadProduct()
  }

  loadProduct() {
    this.isLoading = true
    const productId = this.route.snapshot.paramMap.get("id")

    if (productId) {
      this.productService.getProductById(Number.parseInt(productId)).subscribe({
        next: (product) => {
          this.product = product
          this.isLoading = false
        },
        error: (error) => {
          console.error("Error loading product:", error)
          this.isLoading = false
        },
      })
    }
  }

  incrementQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity).subscribe({
        next: () => {
          this.presentToast(`${this.product?.name} añadido al carrito`)
        },
        error: (error) => {
          console.error("Error adding to cart", error)
          this.presentToast("Error al añadir al carrito")
        },
      })
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: "success",
    })
    toast.present()
  }
}

