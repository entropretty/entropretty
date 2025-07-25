import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAtom } from "jotai"
import { Suspense, lazy } from "react"
import { FamilyKindBadge } from "../../components/FamilyKindBadge"
import { AlgorithmNameInput } from "./AlgorithmNameInput"
import { AlgorithmPreview } from "./AlgorithmPreview"
import { editorSeedTypeAtom, scriptErrorAtom } from "./atoms"
import { Benchmarking } from "./Benchmarking"
import { PostButton } from "./PostButton"
import { SeedTools } from "./SeedTools"
import { FeedbackDialog } from "@/components/FeedbackDialog"
import { RerollBadge } from "./RerollBadge"

const MonacoEditor = lazy(() => import("./MonacoEditor"))

export const CreateFeature = () => {
  const [scriptError] = useAtom(scriptErrorAtom)
  const [editorSeedType] = useAtom(editorSeedTypeAtom)

  return (
    <>
      <FeedbackDialog className="fixed bottom-4 right-4 z-50" />
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
                <div className="absolute bottom-0 left-0 flex w-full flex-row justify-between">
                  <FamilyKindBadge familyKind={editorSeedType} />
                  <RerollBadge />
                </div>

                {/* <CollisionIndicator
                  algorithmId={0}
                  className="absolute bottom-0 right-0"
                /> */}
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
              {/* <Separator orientation="vertical" /> */}
              <TabsList>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger className="border-foreground border" value="check">
                  Check
                </TabsTrigger>
                <TabsTrigger value="seed">Seed</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="code" className="flex-1">
              <Suspense fallback={<div className="p-8">Loading code...</div>}>
                <MonacoEditor />
              </Suspense>
            </TabsContent>

            <TabsContent value="seed" className="flex-1 overflow-y-scroll">
              <SeedTools />
            </TabsContent>
            <TabsContent value="check" className="flex-1 overflow-y-scroll p-4">
              <Benchmarking />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}

export default CreateFeature
