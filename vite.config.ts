import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

/**
 * Vite configuration file.
 * @remarks This file exports the configuration object for Vite, the build tool for modern web applications.
 * @see {@link https://vitejs.dev/config/}
 */
export default defineConfig({
	plugins: [
		react(),
		/**
		 * Vite plugin for enabling PWA features.
		 * @see {@link https://vite-pwa-org.netlify.app/guide/}
		 */
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
