import * as Comlink from "comlink"
import { createWorker } from "@/lib/createWorker"

Comlink.expose(
  createWorker(import.meta.glob(["./schemas/*.ts", "./schemas/*.js"])),
)
