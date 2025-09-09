import { Remote, wrap } from "comlink"
import type { FamilyKind, SchemaMetadata, Seed } from "entropretty-utils"
import { getSeedFamily } from "entropretty-utils"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { EntroprettyEditorWorker } from "./createWorker"

export const MODES = [
  "horizontal",
  "vertical",
  "grid",
  "single",
  "families",
] as const
type Mode = (typeof MODES)[number]

type SeedStash = Record<FamilyKind, Array<Array<Seed>>>

interface AppState {
  worker: Remote<EntroprettyEditorWorker> | null
  schemas: SchemaMetadata[]
  schema: SchemaMetadata | null
  setSchema: (schema: string) => void
  init: (worker: Worker) => Promise<void>
  showControls: boolean
  toggleControls: () => void
  mode: Mode
  cycleMode: () => void
  seeds: SeedStash
  showDetails: boolean
  toggleDetails: () => void
  familyIndex: number
  focusIndex: number
  setFocus(familyIndex: number, focusIndex: number): void
  refreshSeeds: () => void
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => {
      const range = Array(8).fill(1)

      const seeds = {
        Procedural: range.map(() => getSeedFamily("Procedural")),
        ProceduralPersonal: range.map(() =>
          getSeedFamily("ProceduralPersonal"),
        ),
        ProceduralAccount: range.map(() => getSeedFamily("ProceduralAccount")),
      }

      return {
        worker: null,
        schema: null,
        schemas: [],
        showControls: true,
        seeds,
        showDetails: false,
        focus: [0, 0],
        familyIndex: 0,
        focusIndex: 0,
        toggleDetails() {
          set({ showDetails: !get().showDetails })
        },
        setFocus(familyIndex, focusIndex) {
          set({ familyIndex, focusIndex })
        },
        refreshSeeds() {
          set({
            seeds: {
              Procedural: range.map(() => getSeedFamily("Procedural")),
              ProceduralPersonal: range.map(() =>
                getSeedFamily("ProceduralPersonal"),
              ),
              ProceduralAccount: range.map(() =>
                getSeedFamily("ProceduralAccount"),
              ),
            },
          })
        },
        toggleControls() {
          set({ showControls: !get().showControls })
        },
        async init(worker) {
          const wrapped: Remote<EntroprettyEditorWorker> = wrap(worker)
          const schemas = await wrapped.init()

          if (schemas.length === 0) throw new Error("No schemas found")

          const previousSchema = get().schema
          if (
            previousSchema &&
            schemas.find((s) => s.name === previousSchema.name)
          ) {
            set({ schema: previousSchema })
          } else {
            set({ schema: schemas[0] })
          }

          set({
            worker: wrapped,
            schemas,
          })
        },
        setSchema(schemaName) {
          const schema = get().schemas.find((s) => s.name === schemaName)
          set({ schema })
        },
        mode: "horizontal",
        cycleMode() {
          const currentMode = get().mode
          const currentIndex = MODES.indexOf(currentMode)
          const nextIndex = (currentIndex + 1) % MODES.length
          set({ mode: MODES[nextIndex] })
        },
      }
    },
    {
      name: "entropretty-editor-state",
      partialize: (state) => ({
        mode: state.mode,
        showControls: state.showControls,
        schema: state.schema,
        showDetails: state.showDetails,
        focusIndex: state.focusIndex,
        familyIndex: state.familyIndex,
      }),
    },
  ),
)
