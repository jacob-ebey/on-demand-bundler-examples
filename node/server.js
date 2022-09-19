import * as path from "path";
import { createServer } from "http";
import { bundleFile } from "on-demand-bundler";

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/_script") {
    try {
      const src = url.searchParams.get("src");
      if (!src) {
        res.statusCode = 400;
        res.end();
      }
      const bundled = await bundleFile({
        fileToBundle: path.resolve(process.cwd(), src),
        include: [/app[\/\\]islands[\/\\]/],
        publicPath: "/_script",
        rootDirectory: process.cwd(),
        jsxImportSource: "preact",
        mode: "production",
      });

      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(bundled);
      return;
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end();
      return;
    }
  }

  res.statusCode = 404;
  res.end();
});

console.log("Listening on http://localhost:3000");
server.listen(3000);
