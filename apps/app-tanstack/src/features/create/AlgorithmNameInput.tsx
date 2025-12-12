import { Input } from "@/components/ui/input"
import { useAtom } from "jotai"
import { algorithmNameAtom } from "./atoms"

export const AlgorithmNameInput = () => {
  const [algorithmName, setAlgorithmName] = useAtom(algorithmNameAtom)

  return (
    <Input
      type="text"
      placeholder="Algorithm Name"
      value={algorithmName}
      onChange={(e) => setAlgorithmName(e.target.value)}
    />
  )
}
