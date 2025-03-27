import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
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
  IonSpinner,
  IonAvatar,
  IonChip,
  IonLabel,
  IonItem,
  IonInput,
   AlertController,
   ToastController,
} from "@ionic/angular/standalone"
import { NgIf } from "@angular/common"
import { addIcons } from "ionicons"
import { logOutOutline } from "ionicons/icons"

import  { AuthService } from "../../services/auth.service"
import  { User } from "../../models/user.model"

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
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
    IonButton,
    IonIcon,
    IonContent,
    IonSpinner,
    IonAvatar,
    IonChip,
    IonLabel,
    IonItem,
    IonInput,
  ],
})
export class ProfilePage implements OnInit {
  profileForm!: FormGroup
  user: User | null = null
  isLoading = true
  isSubmitting = false

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    addIcons({ logOutOutline })
    this.createForm()
  }

  createForm() {
    this.profileForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
    })
  }

  ngOnInit() {
    this.loadUserProfile()
  }
// Add this method to the ProfilePage class
getLowercaseEmail(): string {
  return this.user?.email?.toLowerCase() || '';
}
  loadUserProfile() {
    this.isLoading = true
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
        })
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading user profile:", error)
        this.isLoading = false
      },
    })
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return
    }

    this.isSubmitting = true
    const { name, email } = this.profileForm.value

    this.authService.updateUserProfile({ name, email }).subscribe({
      next: () => {
        this.isSubmitting = false
        this.presentToast("Perfil actualizado correctamente")
      },
      error: (error) => {
        this.isSubmitting = false
        this.presentToast(error.error?.message || "Error al actualizar perfil")
      },
    })
  }

  async logout() {
    const alert = await this.alertController.create({
      header: "Cerrar sesión",
      message: "¿Estás seguro de que deseas cerrar sesión?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
        },
        {
          text: "Cerrar sesión",
          handler: () => {
            this.authService.logout().subscribe(() => {
              this.router.navigate(["/home"])
            })
          },
        },
      ],
    })

    await alert.present()
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

