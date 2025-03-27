import AdjustableModelViewer from "@/components/adjustable-model-viewer"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-lg font-medium">Загрузка приложения...</p>
            </div>
          </div>
        }
      >
        <div className="w-full h-screen">
          <AdjustableModelViewer modelUrl="/design.glb" constructionUrl="/construct.glb" draftUrl="/sharp.glb" designUrl="/design.glb" />
        </div>
      </Suspense>
    </main>
  )
}

