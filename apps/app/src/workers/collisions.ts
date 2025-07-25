import { blake2b256 as blake2b256Hasher } from "@multiformats/blake2/blake2b"
import { bytesToHex } from "@noble/hashes/utils"
import { expose } from "comlink"
import { FamilyKind, getSeedFamily, RenderCore } from "entropretty-utils"

const COLLISION_SIZE = 100

const core = new RenderCore(300) // 300ms timeout by default
let aborted = false
const api = {
  async updateAlgorithm(id: number, script: string, kind: FamilyKind) {
    return core.updateAlgorithm(id, script, kind)
  },

  async checkCollisions(
    id: number,
    amount: number,
    options?: { signal?: AbortSignal },
  ) {
    return { collisions: [], checked: 0 }
  },

  cancelCheck() {
    core.cancelPending()
    aborted = true
  },

  getAlgorithmMeta(id: number) {
    return core.getAlgorithmMeta(id)
  },
}

export type CollisionWorker = typeof api

expose(api)
