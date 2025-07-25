import { useTheme } from "@/contexts/theme-context"
import { FEATURES } from "@/lib/features"
import Editor, { useMonaco } from "@monaco-editor/react"
import { useAtom } from "jotai"
import { useCallback, useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { editorCodeAtom } from "./atoms"
import initialCode from "./initialCode"
import poimandresTheme from "./PoimandresTheme"

const MonacoEditor = () => {
  const monaco = useMonaco()
  const [code, setEditorCode] = useAtom(editorCodeAtom)
  const [localCode, setLocalCode] = useState(code)
  const debouncedSetEditorCode = useDebouncedCallback(
    // function
    (value) => {
      setEditorCode(value)
    },
    // delay in ms
    250,
  )
  const { theme } = useTheme()

  // Set up Monaco configuration
  useEffect(() => {
    if (monaco) {
      // Define theme first
      if (FEATURES.isCompetition) {
        monaco.editor.defineTheme("poimandres", poimandresTheme)

        // Set theme based on current theme context
        if (theme === "dark") {
          monaco.editor.setTheme("poimandres")
        } else {
          monaco.editor.setTheme("vs") // Monaco's default light theme
        }
      }

      // Then set up JavaScript environment
      monaco.languages.typescript.javascriptDefaults.addExtraLib(`
        declare const ctx: CanvasRenderingContext2D;
        declare const seed: number[];

        // Function declarations
        declare function getByte(seed: number[], index: number): number;
        declare function split(seed: number[], parts: number): number[];
        declare function bytesToNibbles(bytes: number[]): number[];
        declare function bit(seed: number[], i: number): 0 | 1;
        declare function bits(seed: number[], from?: number, to?: number): number;
        declare function symmetrical(factor: number, fn: (i: number) => void, ctx: CanvasRenderingContext2D): void;
        declare function strokeEach<T>(array: readonly T[], fn: (element: T, index: number) => void, ctx: CanvasRenderingContext2D): void;
        declare function fillEach<T>(array: readonly T[], fn: (element: T, index: number) => void, ctx: CanvasRenderingContext2D): void;
        declare function numeric(seed: number[]): bigint;
        declare function randomGenerator(seed: number[]): () => number;
        declare function sfc32(a: number, b: number, c: number, d: number): () => number;
      `)
    }
  }, [monaco, theme]) // Add theme to dependency array

  const onChange = (value: string | undefined) => {
    if (!value) return
    setLocalCode(value)
    debouncedSetEditorCode(value)
  }

  const onMount = useCallback(() => {
    if (!code) {
      console.log("setting initial code as no code", code)
      setLocalCode(initialCode)
      setEditorCode(initialCode)
    }
  }, [code, setEditorCode])

  // Determine which theme to use for the Editor component
  const getEditorTheme = () => {
    if (FEATURES.isCompetition && theme === "dark") {
      return "poimandres"
    }
    return "vs" // Monaco's default light theme
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      theme={getEditorTheme()}
      defaultValue={initialCode}
      onChange={onChange}
      onMount={onMount}
      value={localCode}
      options={{
        minimap: { enabled: false },
        lineNumbers: "on",
        fontSize: 12,
      }}
    />
  )
}

export default MonacoEditor
