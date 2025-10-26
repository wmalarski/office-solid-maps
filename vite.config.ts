import tailwindcss from "@tailwindcss/vite";
import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import { officeManifest } from "./src/build/office-plugin";

async function getHttpsOptions() {
  const devCerts = await import("office-addin-dev-certs");
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
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
  build: {
    rollupOptions: {
      input: {
        taskpane: "/taskpane/taskpane.html",
        commands: "/commands/commands.html",
      },
    },
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  server: mode !== "production" ? { https: await getHttpsOptions() } : {},
}));
