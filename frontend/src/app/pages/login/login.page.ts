import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import {  Router, RouterLink } from "@angular/router"
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
   ToastController,
} from "@ionic/angular/standalone"
import { NgIf } from "@angular/common"
import  { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
  ],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup
  isSubmitting = false

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
  ) {
    this.createForm()
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit() {
    // Check if already logged in
    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(["/home"])
      }
    })
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return
    }

    this.isSubmitting = true
    const { email, password } = this.loginForm.value

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isSubmitting = false
        this.router.navigate(["/home"])
      },
      error: (error) => {
        this.isSubmitting = false
        this.presentToast(error.error?.message || "Error al iniciar sesión")
      },
    })
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: "danger",
    })
    toast.present()
  }
}

