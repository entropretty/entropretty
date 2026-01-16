import { proxy, wrap } from 'comlink'
import PQueue from 'p-queue'
import type { Remote } from 'comlink'
import type { ComplianceWorker as ComplianceWorkerType } from '@/workers/compliance'
import type { RenderWorker as RenderWorkerType } from '@/workers/render'
import type { FamilyKind, Seed } from '@entropretty/utils'
import RenderWorker from '@/workers/render?worker'
import ComplianceWorker from '@/workers/compliance?worker'

export class AlgorithmService {
  private complianceWorker: Remote<ComplianceWorkerType>
  private renderWorker: Remote<RenderWorkerType>
  private inventory: Set<number>
  private queue = new PQueue({ concurrency: 2 })

  constructor() {
    const complianceInstance = new ComplianceWorker()
    const renderInstance = new RenderWorker()
    this.complianceWorker = wrap<ComplianceWorkerType>(complianceInstance)
    this.renderWorker = wrap<RenderWorkerType>(renderInstance)

    this.inventory = new Set<number>()
  }

  async updateAlgorithm(
    algorithmId: number,
    algorithm: string,
    kind: FamilyKind,
  ) {
    return await Promise.all([
      this.renderWorker.updateAlgorithm(algorithmId, algorithm, kind),
      this.complianceWorker.updateAlgorithm(algorithmId, algorithm, kind),
    ])
  }

  async addAlgorithm(algorithmId: number, algorithm: string, kind: FamilyKind) {
    if (this.inventory.has(algorithmId)) return
    await Promise.all([
      this.complianceWorker.updateAlgorithm(algorithmId, algorithm, kind),
      this.renderWorker.updateAlgorithm(algorithmId, algorithm, kind),
    ])
    this.inventory.add(algorithmId)
  }

  async testRender(algorithmId: number) {
    return this.renderWorker.testRender(algorithmId)
  }

  async renderWithQueue(
    algorithmId: number,
    size: number,
    seed: Seed,
    { signal }: { signal: AbortSignal },
  ) {
    return this.queue
      .add(
        () => {
          return this.renderWorker.renderBitmap(algorithmId, size, [...seed])
        },
        {
          priority: 100,
          signal,
        },
      )
      .catch((error) => {
        if (error.name === 'AbortError') {
          return null
        }

        throw error
      })
  }

  async checkCompliance(
    algorithmId: number,
    size: number,
    seed: Seed,
    { signal }: { signal: AbortSignal },
  ) {
    return this.queue
      .add(
        () => {
          return this.complianceWorker.checkCompliance(algorithmId, seed, {
            withOverlay: true,
            overlaySize: size,
          })
        },
        {
          priority: 0,
          signal,
        },
      )
      .catch((error) => {
        if (error.name === 'AbortError') {
          return null
        }

        throw error
      })
  }

  async benchmark(
    algorithmId: number,
    size: number,
    amount: number,
    onProgress: (progress: number) => void,
  ) {
    await this.complianceWorker.onProgress(proxy(onProgress))
    return this.complianceWorker.benchmark(algorithmId, size, amount)
  }

  cancelAllRenderRequests() {
    this.queue.clear()
  }
}
