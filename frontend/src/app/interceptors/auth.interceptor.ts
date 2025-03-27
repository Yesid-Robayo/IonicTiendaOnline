import  { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from "@angular/common/http"
import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { Storage } from "@ionic/storage-angular"
import { catchError, from, switchMap, throwError } from "rxjs"
import { AuthService } from "../services/auth.service"

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const storage = inject(Storage)
  const authService = inject(AuthService)
  const router = inject(Router)

  return from(storage.get("token")).pipe(
    switchMap((token) => {
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      }

      return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Token expired or invalid
            authService.logout().subscribe(() => {
              router.navigate(["/login"])
            })
          }
          return throwError(() => error)
        }),
      )
    }),
  )
}

