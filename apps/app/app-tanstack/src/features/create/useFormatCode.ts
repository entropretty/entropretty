import prettier from "prettier/standalone"
import parserBabel from "prettier/plugins/babel"
import parserEstree from "prettier/plugins/estree"

export const useFormatCode = () => {
  const formatCode = async (code: string): Promise<string> => {
    try {
      const formatted = await prettier.format(code, {
        parser: "babel",
        plugins: [parserBabel, parserEstree],
      })
      return formatted
    } catch (error) {
      console.error("Format error:", error)
      return code
    }
  }

  return { formatCode }
}
