import path from "path";
import { promises as fsPromises } from "fs";
import { pathToFileURL } from "url";

const initRoutes = async (prefix, app) => {
  const routesDir = path.join(appRootDir, "src", "routes");

  try {
    const files = await fsPromises.readdir(routesDir);

    for (const file of files) {
      if (file === "index.js" || !file.endsWith(".js")) continue;

      const fullPath = path.join(routesDir, file);
      const fileUrl = pathToFileURL(fullPath).href;

      console.log(`[initRoutes] Importing route: ${fileUrl}`);

      try {
        const mod = await import(fileUrl);

        if (!mod.default) {
          throw new Error(`Route '${file}' has no default export`);
        }

        console.log(
          `[initRoutes]   -> default export type for ${file}:`,
          typeof mod.default
        );

        app.use(prefix, mod.default);

        console.log(
          `[initRoutes]   -> mounted '${file}' under prefix '${prefix}'`
        );
      } catch (err) {
        console.error(`[initRoutes] Error loading file: ${file}`, err);
      }
    }
  } catch (err) {
    console.error(`[initRoutes] Top-level error`, err);
  }
};

export default initRoutes;
