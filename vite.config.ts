import tailwindcss from "@tailwindcss/vite";
import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import { officeManifest } from "./src/build/office-plugin";

async function getHttpsOptions() {
  const devCerts = await import("office-addin-dev-certs");
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return {
    ca: httpsOptions.ca,
    cert: httpsOptions.cert,
    key: httpsOptions.key,
  };
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
  build: {
    emptyOutDir: true,
    outDir: "../dist",
    rollupOptions: {
      input: {
        commands: "/commands/commands.html",
        taskpane: "/taskpane/taskpane.html",
      },
    },
    sourcemap: true,
  },
  plugins: [
    solidPlugin(),
    tsconfigPaths(),
    Sonda({ enabled: true, open: false }),
    tailwindcss(),
    officeManifest({
      devUrl: "https://localhost:3000",
      prodUrl: "https://www.contoso.com", // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION
    }),
  ],
  root: "src",
  server: mode !== "production" ? { https: await getHttpsOptions() } : {},
}));
