import { expose, transfer } from "comlink"
import { FamilyKind, RenderCore } from "entropretty-utils"

const core = new RenderCore(300) // 300ms timeout by default

const api = {
  async updateAlgorithm(id: number, script: string, kind: FamilyKind) {
    return core.updateAlgorithm(id, script, kind)
  },

  async render(id: number, size: number, seed: number[]) {
    const image = await core.render(id, size, seed)
    return transfer(image, [image]) // zero-copy back to main thread
  },

  cancelPending() {
    core.cancelPending()
  },

  getAlgorithmMeta(id: number) {
    return core.getAlgorithmMeta(id)
  },
}

export type RenderWorker = typeof api

expose(api)
