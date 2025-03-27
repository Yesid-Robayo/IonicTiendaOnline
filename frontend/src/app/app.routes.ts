import  { Routes } from "@angular/router"
import { AuthGuard } from "./guards/auth.guard"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    loadComponent: () => import("./pages/home/home.page").then((m) => m.HomePage),
  },
  {
    path: "login",
    loadComponent: () => import("./pages/login/login.page").then((m) => m.LoginPage),
  },
  {
    path: "register",
    loadComponent: () => import("./pages/register/register.page").then((m) => m.RegisterPage),
  },
  {
    path: "products",
    loadComponent: () => import("./pages/products/products.page").then((m) => m.ProductsPage),
  },
  {
    path: "product/:id",
    loadComponent: () => import("./pages/product-detail/product-detail.page").then((m) => m.ProductDetailPage),
  },
  {
    path: "cart",
    loadComponent: () => import("./pages/cart/cart.page").then((m) => m.CartPage),
    canActivate: [AuthGuard],
  },
  {
    path: "profile",
    loadComponent: () => import("./pages/profile/profile.page").then((m) => m.ProfilePage),
    canActivate: [AuthGuard],
  },
  {
    path: "**",
    redirectTo: "home",
  },
]

