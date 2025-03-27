import { Component,  OnInit } from "@angular/core"
import { RouterLink } from "@angular/router"
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonSpinner,
  IonList,
  IonListHeader,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
} from "@ionic/angular/standalone"
import { NgFor, NgIf, AsyncPipe, CurrencyPipe } from "@angular/common"
import { addIcons } from "ionicons"
import { cartOutline, chevronForwardOutline } from "ionicons/icons"

import  { ProductService } from "../../services/product.service"
import  { Product } from "../../models/product.model"

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    NgIf,
    AsyncPipe,
    CurrencyPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonText,
    IonSpinner,
    IonList,
    IonListHeader,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonItem,
  ],
})
export class HomePage implements OnInit {
  featuredProducts: Product[] = []
  categories: string[] = []
  isLoading = true

  constructor(private productService: ProductService) {
    addIcons({ cartOutline, chevronForwardOutline })
  }

  ngOnInit() {
    this.loadProducts()
  }

  loadProducts() {
    this.isLoading = true
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.featuredProducts = products.slice(0, 4)

        // Extract unique categories
        const categorySet = new Set<string>()
        products.forEach((product) => categorySet.add(product.category))
        this.categories = Array.from(categorySet)

        this.isLoading = false
      },
      (error) => {
        console.error("Error loading products:", error)
        this.isLoading = false
      },
    )
  }
}

