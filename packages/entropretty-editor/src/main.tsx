import { createRoot } from "react-dom/client"
import { EntroprettyEditor } from "./EntroprettyEditor.tsx"

import Worker from "./worker?worker&inline"
export const worker = new Worker()
createRoot(document.getElementById("root")!).render(
  <EntroprettyEditor worker={worker} />,
)
