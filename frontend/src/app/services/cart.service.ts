import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, Observable, from } from "rxjs"
import { map, switchMap, tap } from "rxjs/operators"
import { Storage } from "@ionic/storage-angular"
import { environment } from "../../environments/environment"
import { CartItem } from "../models/cart.model"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([])
  public cartItems$ = this.cartItemsSubject.asObservable()
  private _storage: Storage | null = null

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthService,
  ) {
    this.init()
  }

  async init() {
    this._storage = await this.storage.create()
    this.loadLocalCart()
    this.syncWithServer()
  }

  private async loadLocalCart() {
    if (!this._storage) await this.init()
    const localCart = (await this._storage?.get("cart")) || []
    this.cartItemsSubject.next(localCart)
  }

  private syncWithServer() {
    this.authService.isAuthenticated().pipe(
      switchMap((isAuthenticated) => {
        return isAuthenticated ? this.getCartFromServer() : from(Promise.resolve([]))
      })
    ).subscribe({
      next: (serverCart) => {
        if (serverCart?.length) {
          this.cartItemsSubject.next(serverCart)
          this._storage?.set("cart", serverCart)
        }
      },
      error: (error) => console.error("Error syncing cart with server:", error),
    })
  }

  getCartFromServer(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl)
  }

  addToCart(productId: number, quantity = 1): Observable<any> {
    return this.authService.isAuthenticated().pipe(
      switchMap((isAuthenticated) => {
        return isAuthenticated
          ? this.http.post(this.apiUrl, { productId, quantity }).pipe(tap(() => this.syncWithServer()))
          : this.addToLocalCart(productId, quantity)
      })
    )
  }

  private addToLocalCart(productId: number, quantity: number): Observable<any> {
    return from(this._storage?.get("cart") || []).pipe(
      map((cart) => {
        if (!cart) cart = []
        const existingItem = cart.find((item: CartItem) => item.productId === productId)

        if (existingItem) {
          existingItem.quantity += quantity
        } else {
          cart.push({ productId, quantity })
        }

        this._storage?.set("cart", cart)
        this.cartItemsSubject.next(cart)
        return { success: true }
      })
    )
  }

  updateCartItem(itemId: number, quantity: number): Observable<any> {
    return this.authService.isAuthenticated().pipe(
      switchMap((isAuthenticated) => {
        return isAuthenticated
          ? this.http.put(`${this.apiUrl}/${itemId}`, { quantity }).pipe(tap(() => this.syncWithServer()))
          : this.updateLocalCartItem(itemId, quantity)
      })
    )
  }

  private updateLocalCartItem(itemId: number, quantity: number): Observable<any> {
    return from(this._storage?.get("cart") || []).pipe(
      map((cart) => {
        if (!cart) cart = []
        const updatedCart = cart.map((item: CartItem) =>
          item.productId === itemId ? { ...item, quantity } : item
        )

        this._storage?.set("cart", updatedCart)
        this.cartItemsSubject.next(updatedCart)
        return { success: true }
      })
    )
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.authService.isAuthenticated().pipe(
      switchMap((isAuthenticated) => {
        return isAuthenticated
          ? this.http.delete(`${this.apiUrl}/${itemId}`).pipe(tap(() => this.syncWithServer()))
          : this.removeFromLocalCart(itemId)
      })
    )
  }

  private removeFromLocalCart(itemId: number): Observable<any> {
    return from(this._storage?.get("cart") || []).pipe(
      map((cart) => {
        if (!cart) cart = []
        const updatedCart = cart.filter((item: CartItem) => item.productId !== itemId)

        this._storage?.set("cart", updatedCart)
        this.cartItemsSubject.next(updatedCart)
        return { success: true }
      })
    )
  }

  clearCart(): Observable<any> {
    return this.authService.isAuthenticated().pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return this.http.delete(`${this.apiUrl}/clear`).pipe(
            tap(() => {
              this._storage?.set("cart", [])
              this.cartItemsSubject.next([])
            })
          )
        } else {
          this._storage?.set("cart", [])
          this.cartItemsSubject.next([])
          return from(Promise.resolve({ success: true }))
        }
      })
    )
  }

  getCartCount(): Observable<number> {
    return this.cartItems$.pipe(map((items) => items.reduce((count, item) => count + item.quantity, 0)))
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map((items) =>
        items.reduce((total, item) => {
          const price = item.Product?.price || 0
          return total + price * item.quantity
        }, 0)
      )
    )
  }
}