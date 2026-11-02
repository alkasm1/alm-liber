import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(new URL("../public/", import.meta.url)));
const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 8787);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, `http://${HOST}:${PORT}`).pathname
    );

    const relativePath = pathname === "/"
      ? "index.html"
      : pathname.replace(/^\/+/, "");

    const filePath = path.resolve(ROOT, relativePath);

    if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    const data = await readFile(filePath);
    const contentType =
      mimeTypes[path.extname(filePath).toLowerCase()] ||
      "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`HEMA server running at http://${HOST}:${PORT}`);
});
