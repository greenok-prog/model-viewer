import AdjustableModelViewer from "@/components/adjustable-model-viewer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full h-screen">
        <AdjustableModelViewer modelUrl="/model.glb" />
      </div>
    </main>
  )
}

