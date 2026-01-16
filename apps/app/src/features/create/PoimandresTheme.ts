import { editor } from "monaco-editor"

const poimandresTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "keyword", foreground: "#ff4c9d" }, // Pink keywords
    { token: "type", foreground: "#5de4c7" }, // Teal types
    { token: "string", foreground: "#fff6f6" }, // White strings
    { token: "number", foreground: "#add7ff" }, // Blue numbers
    { token: "delimiter", foreground: "#5de4c7" }, // Teal brackets
    { token: "operator", foreground: "#91b4d5" }, // Light blue operators
    { token: "invalid", foreground: "#d0679d" }, // Red errors
  ],
  colors: {
    "editor.background": "#1b1e28",
    "editor.foreground": "#a6accd",
    "editorCursor.foreground": "#a6accd",
    "editor.lineHighlightBackground": "#00000030",
    "editor.selectionBackground": "#717cb470",
  },
} as const

export default poimandresTheme
