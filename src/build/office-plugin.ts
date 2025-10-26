import fs from "node:fs";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { loadEnv } from "vite";

interface Options {
  path?: string;
  devUrl?: string;
  prodUrl?: string;
}

export const officeManifest = (options?: Options): Plugin => {
  const manifestFile = options?.path ?? "manifest.xml";

  let viteConfig: ResolvedConfig;
  let env: Record<string, string>;

  return {
    configResolved(resolvedConfig: ResolvedConfig) {
      viteConfig = resolvedConfig;
      env = loadEnv(viteConfig.mode, process.cwd(), "ADDIN");
    },

    generateBundle() {
      const manifestPath = path.resolve(viteConfig.root, manifestFile);

      if (!fs.existsSync(manifestPath)) {
        viteConfig.logger.warn(`The manifest.xml file does not exist at path: '${manifestPath}'`);
        return;
      }

      const devUrl = options?.devUrl || env.ADDIN_DEV_URL;
      const prodUrl = options?.prodUrl || env.ADDIN_PROD_URL;

      let content = fs.readFileSync(manifestPath, "utf-8");
      if (devUrl && devUrl !== "") {
        content = content.replace(new RegExp(devUrl, "g"), prodUrl);
      }

      this.emitFile({
        fileName: path.basename(manifestPath),
        source: content,
        type: "asset",
      });
    },
    name: "office-addin:manifest",
  };
};

