import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { BehaviorSubject,  Observable, from } from "rxjs"
import { map, tap } from "rxjs/operators"
import  { Storage } from "@ionic/storage-angular"
import { environment } from "../../environments/environment"
import  { User } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  private _storage: Storage | null = null

  constructor(
    private http: HttpClient,
    private storage: Storage,
  ) {
    this.init()
  }

  async init() {
    this._storage = await this.storage.create()
    this.loadStoredUser()
  }

  private async loadStoredUser() {
    if (!this._storage) {
      await this.init()
    }
    const userData = await this._storage?.get("user")
    const token = await this._storage?.get("token")

    if (userData && token) {
      this.currentUserSubject.next(userData)
    }
  }

  register(email: string, password: string, name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, name }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.storeUserData(response.user, response.token)
        }
      }),
    )
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.storeUserData(response.user, response.token)
        }
      }),
    )
  }

  logout(): Observable<boolean> {
    return from(Promise.all([this._storage?.remove("user"), this._storage?.remove("token")])).pipe(
      tap(() => {
        this.currentUserSubject.next(null)
      }),
      map(() => true),
    )
  }

  isAuthenticated(): Observable<boolean> {
    return from(this._storage?.get("token") ?? Promise.resolve(null)).pipe(map((token) => !!token))
  }

  getToken(): Observable<string | null> {
    return from(this._storage?.get("token") ?? Promise.resolve(null))
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`)
  }

  updateUserProfile(userData: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, userData).pipe(
      tap((response: any) => {
        if (response && response.user) {
          this.updateStoredUser(response.user)
        }
      }),
    )
  }

  private async storeUserData(user: User, token: string) {
    await this._storage?.set("user", user)
    await this._storage?.set("token", token)
    this.currentUserSubject.next(user)
  }

  private async updateStoredUser(user: User) {
    const currentUser = await this._storage?.get("user")
    if (currentUser) {
      const updatedUser = { ...currentUser, ...user }
      await this._storage?.set("user", updatedUser)
      this.currentUserSubject.next(updatedUser)
    }
  }
}

