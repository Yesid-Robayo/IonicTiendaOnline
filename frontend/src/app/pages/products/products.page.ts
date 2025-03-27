import { Component,  OnInit } from "@angular/core"
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
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
   ToastController,
} from "@ionic/angular/standalone"
import { NgFor, NgIf, AsyncPipe, CurrencyPipe, SlicePipe } from "@angular/common"
import { addIcons } from "ionicons"
import { cartOutline, cart } from "ionicons/icons"

import  { ProductService } from "../../services/product.service"
import  { CartService } from "../../services/cart.service"
import  { Product } from "../../models/product.model"

@Component({
  selector: "app-products",
  templateUrl: "./products.page.html",
  styleUrls: ["./products.page.scss"],
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    NgIf,
    AsyncPipe,
    CurrencyPipe,
    SlicePipe,
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
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSpinner,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
  ],
})
export class ProductsPage implements OnInit {
  products: Product[] = []
  filteredProducts: Product[] = []
  categories: string[] = []
  selectedCategory: string | null = null
  searchTerm = ""
  isLoading = true

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private toastController: ToastController,
  ) {
    addIcons({ cartOutline, cart })
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["category"]) {
        this.selectedCategory = params["category"]
      }
      this.loadProducts()
    })
  }

  loadProducts() {
    this.isLoading = true
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products

        // Extract unique categories
        const categorySet = new Set<string>()
        products.forEach((product) => categorySet.add(product.category))
        this.categories = Array.from(categorySet)

        this.filterProducts()
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading products:", error)
        this.isLoading = false
      },
    })
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
      // Filter by category if selected
      const categoryMatch = !this.selectedCategory || product.category === this.selectedCategory

      // Filter by search term if provided
      const searchMatch =
        !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())

      return categoryMatch && searchMatch
    })
  }

  onCategoryChange(category: string | null) {
    this.selectedCategory = category
    this.filterProducts()
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value
    this.filterProducts()
  }

  addToCart(product: Product) {
    console.log("Adding to cart:", product)
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        this.presentToast(`${product.name} añadido al carrito`)
      },
      error: (error) => {
        console.error("Error adding to cart", error)

        this.presentToast("Error al añadir al carrito")
      },
    })
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

