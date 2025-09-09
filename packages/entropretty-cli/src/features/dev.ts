import react from "@vitejs/plugin-react-swc"
import fs from "node:fs/promises"
import path from "node:path"
import { createServer } from "vite"

const index_html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Entropretty Sketch</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
`

const main_tsx = `
import "entropretty-editor/entropretty-editor.css";
import { EntroprettyEditor } from "entropretty-editor";
import { createRoot } from "react-dom/client";
import Worker from "./worker?worker";

export const worker = new Worker();

function App() {
  return (
    <>
      <EntroprettyEditor worker={worker} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
`

const worker_ts = `
import * as Comlink from "comlink";
import { createWorker } from "entropretty-editor";

Comlink.expose(createWorker(import.meta.glob(["../src/*.js","../src/*.ts"])));
`

export default async function run() {
  const __cwd = process.cwd()
  const appPath = path.join(__cwd, ".entropretty")

  await fs.rm(appPath, { recursive: true, force: true })
  await fs.mkdir(appPath)
  await fs.writeFile(path.join(appPath, "index.html"), index_html)
  await fs.writeFile(path.join(appPath, "main.tsx"), main_tsx)
  await fs.writeFile(path.join(appPath, "worker.ts"), worker_ts)

  const server = await createServer({
    plugins: [react()],
    root: appPath,
    mode: "development",
    server: {
      port: 4242,
    },
    worker: {
      format: "es",
    },
  })
  await server.listen()

  server.printUrls()
  server.bindCLIShortcuts({ print: true })
}
