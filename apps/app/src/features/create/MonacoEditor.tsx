import Editor, { useMonaco } from "@monaco-editor/react"
import { useAtom } from "jotai"
import { useCallback, useEffect } from "react"
import { editorCodeAtom } from "./atoms"
import initialCode from "./initialCode"

const MonacoEditor = () => {
  const monaco = useMonaco()
  const [code, setEditorCode] = useAtom(editorCodeAtom)

  // Set up Monaco configuration
  useEffect(() => {
    if (monaco) {
      // Define theme first
      // monaco.editor.defineTheme("poimandres", poimandresTheme)
      // monaco.editor.setTheme("poimandres")

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
  }, [monaco])

  const onChange = (value: string | undefined) => {
    if (!value) return
    setEditorCode(value)
  }

  const onMount = useCallback(() => {
    if (!code) {
      console.log("setting initial code as no code", code)
      setEditorCode(initialCode)
    }
  }, [code, setEditorCode])

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      theme="poimandres"
      defaultValue={initialCode}
      onChange={onChange}
      onMount={onMount}
      value={code}
      options={{
        minimap: { enabled: false },
        lineNumbers: "on",
        fontSize: 12,
      }}
    />
  )
}

export default MonacoEditor
