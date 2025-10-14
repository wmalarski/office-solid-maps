import { defineConfig } from "vite";
import { officeManifest } from "./src/build/office-plugin";

const devCerts = require("office-addin-dev-certs");

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
  plugins: [
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
  },
  server: mode !== "production" ? { https: await getHttpsOptions() } : {},
}));
