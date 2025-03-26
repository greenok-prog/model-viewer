import AdjustableModelViewer from "@/components/adjustable-model-viewer"

export default function EnhancedViewerPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full h-screen">
        <AdjustableModelViewer />
      </div>
    </main>
  )
}

