import { useAtom } from 'jotai'
import { Suspense, lazy } from 'react'
import { useBlocker } from '@tanstack/react-router'
import { FamilyKindBadge } from '../../components/FamilyKindBadge'
import { AlgorithmNameInput } from './AlgorithmNameInput'
import { AlgorithmPreview } from './AlgorithmPreview'
import {
  algorithmNameAtom,
  editorCodeAtom,
  editorSeedTypeAtom,
  localFileModeAtom,
  scriptErrorAtom,
  skipNavigationBlockAtom,
} from './atoms'
import { Benchmarking } from './Benchmarking'
import { PostButton } from './PostButton'
import { RerollBadge } from './RerollBadge'
import { SeedTools } from './SeedTools'
import { LocalFileDrawer } from './LocalFile'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FeedbackDialog } from '@/components/FeedbackDialog'

const MonacoEditor = lazy(() => import('./MonacoEditor'))

interface CreateFeatureProps {
  initialCode: string
}

const CreateNavigationGuard = ({ initialCode }: CreateFeatureProps) => {
  const [editorCode] = useAtom(editorCodeAtom)
  const [algorithmName] = useAtom(algorithmNameAtom)
  const [skipNavigationBlock] = useAtom(skipNavigationBlockAtom)
  const shouldBlock =
    !skipNavigationBlock &&
    (editorCode !== initialCode || algorithmName.trim().length > 0)

  const blocker = useBlocker({
    shouldBlockFn: () => shouldBlock,
    withResolver: true,
    enableBeforeUnload: shouldBlock,
  })
  const isOpen = blocker.status === 'blocked'

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && isOpen) {
          blocker.reset()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave create page?</DialogTitle>
          <DialogDescription>
            You have unsaved changes. If you leave now, your edits will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={blocker.reset}>
            Stay
          </Button>
          <Button onClick={blocker.proceed}>Leave page</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const CreateFeature = ({ initialCode }: CreateFeatureProps) => {
  const [scriptError] = useAtom(scriptErrorAtom)
  const [editorSeedType] = useAtom(editorSeedTypeAtom)
  const [localFileMode] = useAtom(localFileModeAtom)

  return (
    <>
      <CreateNavigationGuard initialCode={initialCode} />
      <FeedbackDialog className="fixed bottom-4 right-4 z-50" />
      <LocalFileDrawer />
      <ResizablePanelGroup
        direction="horizontal"
        className="h-screen w-screen"
        autoSave="editor-layout"
        autoSaveId="editor-layout-id"
      >
        <ResizablePanel defaultSize={localFileMode ? 100 : 50}>
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

        {!localFileMode && (
          <>
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
                    <TabsTrigger
                      className="border-foreground border"
                      value="check"
                    >
                      Check
                    </TabsTrigger>
                    <TabsTrigger value="seed">Settings</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="code" className="flex-1">
                  <Suspense
                    fallback={<div className="p-8">Loading code...</div>}
                  >
                    <MonacoEditor />
                  </Suspense>
                </TabsContent>

                <TabsContent value="seed" className="flex-1 overflow-y-scroll">
                  <SeedTools />
                </TabsContent>
                <TabsContent
                  value="check"
                  className="flex-1 overflow-y-scroll p-4"
                >
                  <Benchmarking />
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </>
  )
}

export default CreateFeature
