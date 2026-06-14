const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
const SVG_PATH = process.env.ASIA_SVG || path.join(ROOT, "asia.svg");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8"
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store"
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/" || url.pathname === "/index.html") {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    send(res, 200, html, TYPES[".html"]);
    return;
  }

  if (url.pathname === "/asia.svg") {
    if (!fs.existsSync(SVG_PATH)) {
      send(res, 404, `No encuentro el SVG en: ${SVG_PATH}`);
      return;
    }

    const svg = fs.readFileSync(SVG_PATH, "utf8");
    send(res, 200, svg, TYPES[".svg"]);
    return;
  }

  send(res, 404, "No encontrado");
});

server.listen(PORT, HOST, () => {
  console.log(`Mapa de Asia listo en http://${HOST}:${PORT}`);
  console.log(`Usando SVG: ${SVG_PATH}`);
});
