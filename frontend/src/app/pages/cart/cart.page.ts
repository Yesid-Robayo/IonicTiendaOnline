import { Component,  OnInit } from "@angular/core"
import {  Router, RouterLink } from "@angular/router"
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonList,
  IonItemSliding,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonItemOptions,
  IonItemOption,
   AlertController,
   ToastController,
} from "@ionic/angular/standalone"
import { NgFor, NgIf, CurrencyPipe } from "@angular/common"
import { addIcons } from "ionicons"
import { trashOutline, trash, removeCircle, addCircle, cartOutline } from "ionicons/icons"

import  { CartService } from "../../services/cart.service"
import  { CartItem } from "../../models/cart.model"

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    NgIf,
    CurrencyPipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonList,
    IonItemSliding,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonItemOptions,
    IonItemOption,
  ],
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = []
  total = 0
  isLoading = true

  constructor(
    private cartService: CartService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    addIcons({ trashOutline, trash, removeCircle, addCircle, cartOutline })
  }

  ngOnInit() {
    this.loadCart()
  }

  ionViewWillEnter() {
    this.loadCart()
  }

  loadCart() {
    this.isLoading = true
    this.cartService.cartItems$.subscribe({
      next: (items) => {
        this.cartItems = items
        this.calculateTotal()
        this.isLoading = false
      },
    })
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => {
      const price = item.Product ? item.Product.price : 0
      return sum + price * item.quantity
    }, 0)
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) {
      return
    }

    if (item.Product && quantity > item.Product.stock) {
      this.presentToast(`Solo hay ${item.Product.stock} unidades disponibles`)
      return
    }

    if (item.id) {
      this.cartService.updateCartItem(item.id, quantity).subscribe({
        next: () => {
          this.loadCart()
        },
        error: () => {
          this.presentToast("Error al actualizar la cantidad")
        },
      })
    }
  }

  removeItem(item: CartItem) {
    if (item.id) {
      this.cartService.removeFromCart(item.id).subscribe({
        next: () => {
          this.loadCart()
          this.presentToast("Producto eliminado del carrito")
        },
        error: () => {
          this.presentToast("Error al eliminar el producto")
        },
      })
    }
  }

  async clearCart() {
    const alert = await this.alertController.create({
      header: "Vaciar carrito",
      message: "¿Estás seguro de que deseas vaciar el carrito?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
        },
        {
          text: "Vaciar",
          handler: () => {
            this.cartService.clearCart().subscribe({
              next: () => {
                this.loadCart()
                this.presentToast("Carrito vaciado correctamente")
              },
              error: () => {
                this.presentToast("Error al vaciar el carrito")
              },
            })
          },
        },
      ],
    })

    await alert.present()
  }

  checkout() {
    // Since payment is not implemented, we'll just show a success message
    this.presentToast("¡Gracias por tu compra! (Simulación)")
    this.cartService.clearCart().subscribe(() => {
      this.router.navigate(["/home"])
    })
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: "primary",
    })
    toast.present()
  }
}

