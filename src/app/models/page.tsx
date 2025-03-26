"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Список тестовых моделей
const testModels = [
  {
    id: "booth1",
    name: "Выставочный стенд 1",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Простой выставочный стенд с баннерами и стойкой",
    url: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/exhibition-stand/model.gltf",
  },
  {
    id: "booth2",
    name: "Выставочный стенд 2",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Угловой выставочный стенд с подсветкой",
    url: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/simple-stall/model.gltf",
  },
  {
    id: "room",
    name: "Комната с мебелью",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Интерьер комнаты для тестирования просмотрщика",
    url: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/room/model.gltf",
  },
  {
    id: "duck",
    name: "Тестовая утка",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Стандартная тестовая модель для Three.js",
    url: "/model.glb",
  },
]

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Тестовые 3D модели</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testModels.map((model) => (
          <Card key={model.id} className={selectedModel === model.id ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{model.name}</CardTitle>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="aspect-video bg-muted rounded-md overflow-hidden"
                style={{
                  backgroundImage: `url(${model.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedModel(model.id)}>
                Выбрать
              </Button>
              <Button asChild>
                <Link href={`/viewer?model=${encodeURIComponent(model.url)}`}>Просмотреть</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedModel && (
        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <Link
              href={`/viewer?model=${encodeURIComponent(testModels.find((m) => m.id === selectedModel)?.url || "")}`}
            >
              Открыть выбранную модель
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

