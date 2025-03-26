"use client"

import { useSearchParams } from "next/navigation"
import ModelViewer from "@/components/model-viewer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ViewerPage() {
  const searchParams = useSearchParams()
  const modelUrl = searchParams.get("model") || "/model.glb"

  return (
    <main className="flex min-h-screen flex-col">
      <div className="p-4 border-b flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/models">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к моделям
          </Link>
        </Button>
        <h1 className="text-lg font-medium">Просмотр модели</h1>
      </div>

      <div className="w-full flex-1">
        <ModelViewer modelUrl={modelUrl} />
      </div>
    </main>
  )
}

