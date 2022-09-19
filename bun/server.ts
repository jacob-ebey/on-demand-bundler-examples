import { serve } from "bun";
import * as path from "path";
import { bundleFile } from "on-demand-bundler";

const port = 3000;
console.log(`Listening on at http://localhost:${port}`);
serve({
  port,
  fetch: async (request) => {
    const url = new URL(request.url);
    if (url.pathname === "/_script") {
      const src = url.searchParams.get("src");
      if (!src) return new Response(null, { status: 400 });

      try {
        const bundled = await bundleFile({
          fileToBundle: path.resolve(process.cwd(), src),
          include: [/app[\/\\]islands[\/\\]/],
          publicPath: "/_script",
          rootDirectory: process.cwd(),
          jsxImportSource: "preact",
          mode: "production",
        });

        return new Response(bundled, {
          headers: {
            "Content-Type": "application/javascript",
          },
        });
      } catch (error) {
        console.error(error);
        return new Response(null, { status: 500 });
      }
    }

    return new Response(null, { status: 404 });
  },
});
