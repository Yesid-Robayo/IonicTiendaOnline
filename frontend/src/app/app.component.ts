import { Component } from "@angular/core"
import { IonApp, IonRouterOutlet } from "@ionic/angular/standalone"
import { StatusBar } from "@capacitor/status-bar"
import { SplashScreen } from "@capacitor/splash-screen"
import  { Platform } from "@ionic/angular/standalone"

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp()
  }

  async initializeApp() {
    await this.platform.ready()
    try {
      await StatusBar.setBackgroundColor({ color: "#3880ff" })
      await SplashScreen.hide()
    } catch (err) {
      console.warn("Error initializing Capacitor plugins", err)
    }
  }
}

