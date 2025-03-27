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
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
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
export class RegisterPage implements OnInit {
  registerForm!: FormGroup
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
    this.registerForm = this.formBuilder.group(
      {
        name: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    )
  }

  ngOnInit() {
    // Check if already logged in
    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(["/home"])
      }
    })
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get("password")?.value
    const confirmPassword = formGroup.get("confirmPassword")?.value

    return password === confirmPassword ? null : { passwordMismatch: true }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return
    }

    this.isSubmitting = true
    const { name, email, password } = this.registerForm.value

    this.authService.register(email, password, name).subscribe({
      next: () => {
        this.isSubmitting = false
        this.router.navigate(["/home"])
      },
      error: (error) => {
        this.isSubmitting = false
        this.presentToast(error.error?.message || "Error al registrar usuario")
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

