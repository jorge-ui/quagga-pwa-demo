import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
			manifest: {
				name: "Barcode Scanner",
				short_name: "Barcode Scanner",
				theme_color: "#46d2c0",
			},
			devOptions: {
				enabled: process.env.NODE_ENV === "development",
			},
		}),
	],
});
