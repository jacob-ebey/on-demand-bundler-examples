import { serve } from "https://deno.land/std@0.156.0/http/server.ts";
import path from "https://deno.land/std@0.156.0/node/path.ts";
import { bundleFile } from "on-demand-bundler";

const port = 3000;
console.log(`Listening on at http://localhost:${port}`);
serve(
  async (request) => {
    const url = new URL(request.url);
    if (url.pathname === "/_script") {
      const src = url.searchParams.get("src");
      if (!src) return new Response(null, { status: 400 });

      try {
        const bundled = await bundleFile({
          fileToBundle: path.resolve(Deno.cwd(), src),
          include: [/app[\/\\]islands[\/\\]/],
          publicPath: "/_script",
          rootDirectory: Deno.cwd(),
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
  { port }
);
