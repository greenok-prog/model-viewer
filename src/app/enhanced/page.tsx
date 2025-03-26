import ModelViewer from "@/components/model-viewer"

export default function EnhancedViewerPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full h-screen">
        <ModelViewer />
      </div>
    </main>
  )
}

