import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAtom } from "jotai"
import { Suspense, lazy } from "react"
import { FamilyKindBadge } from "../../components/FamilyKindBadge"
import { AlgorithmNameInput } from "./AlgorithmNameInput"
import { AlgorithmPreview } from "./AlgorithmPreview"
import { editorSeedTypeAtom, scriptErrorAtom } from "./atoms"
import { PostButton } from "./PostButton"
import { SeedTools } from "./SeedTools"

const MonacoEditor = lazy(() => import("./MonacoEditor"))

export const CreateFeature = () => {
  const [scriptError] = useAtom(scriptErrorAtom)
  const [editorSeedType] = useAtom(editorSeedTypeAtom)

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-screen w-screen"
        autoSave="editor-layout"
        autoSaveId="editor-layout-id"
      >
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={90} className="h-full w-full">
              <div className="relative h-full w-full">
                <AlgorithmPreview />
                <FamilyKindBadge
                  className="absolute bottom-0 left-0"
                  familyKind={editorSeedType}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={10}>
              <div className="text-destructive h-full w-full whitespace-pre-wrap bg-gray-800/10 p-1">
                {scriptError || null}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={50}
          minSize={10}
          className="flex h-full flex-col"
        >
          <Tabs defaultValue="code" className="flex h-full flex-col">
            <div className="flex flex-row items-center gap-4 border-b p-2">
              <div className="flex w-full flex-row items-center gap-2">
                <AlgorithmNameInput />
                <PostButton />
              </div>
              <Separator orientation="vertical" />
              <TabsList>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="seed">Seed</TabsTrigger>
                {/* <TabsTrigger value="check">Check</TabsTrigger> */}
              </TabsList>
            </div>
            <TabsContent value="code" className="flex-1">
              <Suspense
                fallback={<div className="p-8">Loading Monaco editor...</div>}
              >
                <MonacoEditor />
              </Suspense>
            </TabsContent>

            <TabsContent value="seed" className="flex-1 overflow-y-scroll">
              <SeedTools />
            </TabsContent>
            {/* <TabsContent value="check" className="flex-1 overflow-y-scroll">
              <h1>Checking code</h1>
            </TabsContent> */}
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}

export default CreateFeature
