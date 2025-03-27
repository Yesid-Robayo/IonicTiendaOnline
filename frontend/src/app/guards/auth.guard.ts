import { inject } from "@angular/core"
import { type CanActivateFn, Router } from "@angular/router"
import { tap } from "rxjs"
import { AuthService } from "../services/auth.service"

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  return authService.isAuthenticated().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(["/login"])
      }
    }),
  )
}

