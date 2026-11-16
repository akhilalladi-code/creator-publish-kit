import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isPathInsideRoot } from "./server-utils.mjs";

const root = path.resolve(process.cwd());
const port = Number(process.env.PORT || 4179);
const host = process.env.HOST || "127.0.0.1";
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json" };

export function createAppServer(baseDirectory = root) {
  const base = path.resolve(baseDirectory);
  return http.createServer(async (req, res) => {
    try {
      const rawPath = new URL(req.url, "http://localhost").pathname;
      let pathname;
      try { pathname = decodeURIComponent(rawPath); } catch { res.writeHead(400); res.end("Bad request"); return; }
      const file = path.resolve(base, "." + pathname);
      if (!isPathInsideRoot(base, file)) { res.writeHead(404); res.end("Not found"); return; }
      const info = await stat(file);
      const target = info.isDirectory() ? path.join(file, "index.html") : file;
      if (!isPathInsideRoot(base, target)) { res.writeHead(404); res.end("Not found"); return; }
      const body = await readFile(target);
      res.writeHead(200, { "content-type": types[path.extname(target)] || "application/octet-stream", "cache-control": "no-store", "x-content-type-options": "nosniff", "referrer-policy": "no-referrer" });
      res.end(body);
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8", "x-content-type-options": "nosniff" });
      res.end("Not found");
    }
  });
}
const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) createAppServer().listen(port, host, () => console.log(`Creator Publish Kit running at http://${host}:${port}`));
