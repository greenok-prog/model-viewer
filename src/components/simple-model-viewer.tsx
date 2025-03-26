"use client"

import { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Html, useProgress, PerspectiveCamera } from "@react-three/drei"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} position={[0, 0, 0]} scale={1} />
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <Card className="p-4 flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{progress.toFixed(0)}% загружено</span>
      </Card>
    </Html>
  )
}

export default function SimpleModelViewer({ modelUrl }: { modelUrl: string }) {
  const [loading, setLoading] = useState(true)

  return (
    <div className="relative w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={45} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <Suspense fallback={<Loader />}>
          <Model url={modelUrl} />
          <Environment preset="studio" />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  )
}

