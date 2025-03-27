import  { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.tiendaonline.app",
  appName: "Tienda Online",
  webDir: "www",
  server: {
    androidScheme: "http",
    cleartext: true,
  },
}

export default config

