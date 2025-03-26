"use client"

import { Suspense, useState, useRef, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  useGLTF,
  Html,
  useProgress,
  PerspectiveCamera,
  BakeShadows,
  ContactShadows,
  SoftShadows,

} from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Info, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import ModelControls from "./model-controls"
import LightingControls from "./lighting-controls"

// Optional: Enable soft shadows for better visual quality


function Model({
  url,
  scale = 1,
  position = [0, 0, 0],
  onLoad,
}: {
  url: string
  scale?: number
  position?: [number, number, number]
  onLoad?: (scene: THREE.Group) => void
}) {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)

  // Clone the scene to avoid modifying the cached original
  const clonedScene = useRef(scene.clone())

  useEffect(() => {
    if (onLoad && clonedScene.current) {
      onLoad(clonedScene.current)
    }
  }, [onLoad])

  return <primitive ref={modelRef} object={clonedScene.current} position={position} scale={scale} />
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-sm text-gray-600">{progress.toFixed(0)}% загружено</p>
      </div>
    </Html>
  )
}

function CameraControls() {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2)
    }
  }

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2)
    }
  }

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.1}
        minDistance={1}
        maxDistance={100}
        enablePan={true}
        autoRotate={false}
      />

      <Html position={[-1, -1, 0]} distanceFactor={10} zIndexRange={[100, 0]}>
        <Card className="p-2 bg-white/80 backdrop-blur-sm">
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </Html>
    </>
  )
}

function SceneLighting({
  ambientIntensity = 0.3,
  directionalIntensity = 0.5,
  environmentPreset = "studio",
  showShadows = true,
}: {
  ambientIntensity: number
  directionalIntensity: number
  environmentPreset: string
  showShadows: boolean
}) {
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={directionalIntensity}
        castShadow={showShadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Environment preset={environmentPreset as any} />
      {showShadows && <ContactShadows opacity={0.5} scale={10} blur={1} far={10} resolution={256} color="#000000" />}
    </>
  )
}

function InfoPanel() {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="absolute top-4 right-4 z-10">
      <Button
        variant="outline"
        size="icon"
        className="bg-white/80 backdrop-blur-sm"
        onClick={() => setShowInfo(!showInfo)}
      >
        <Info className="h-4 w-4" />
      </Button>

      {showInfo && (
        <Card className="p-4 mt-2 w-64 bg-white/80 backdrop-blur-sm">
          <h3 className="font-medium mb-2">Управление просмотром:</h3>
          <ul className="text-sm space-y-1">
            <li>• Вращение: левая кнопка мыши</li>
            <li>• Перемещение: правая кнопка мыши</li>
            <li>• Масштабирование: колесо мыши</li>
            <li>• Сенсорный экран: два пальца для масштабирования и вращения</li>
          </ul>
        </Card>
      )}
    </div>
  )
}

export default function AdjustableModelViewer({ modelUrl = "/model.glb" }) {
  const [modelScale, setModelScale] = useState(1)
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([0, 0, 0])
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelSize, setModelSize] = useState<THREE.Vector3 | null>(null)
  const [autoFitApplied, setAutoFitApplied] = useState(false)

  // Lighting state
  const [ambientIntensity, setAmbientIntensity] = useState(0.3)
  const [directionalIntensity, setDirectionalIntensity] = useState(0.5)
  const [environmentPreset, setEnvironmentPreset] = useState("studio")
  const [showShadows, setShowShadows] = useState(true)

  const scaleRef = useRef(modelScale)
  const positionRef = useRef(modelPosition)

  // Update refs when state changes
  useEffect(() => {
    scaleRef.current = modelScale
  }, [modelScale])

  useEffect(() => {
    positionRef.current = modelPosition
  }, [modelPosition])

  const handleModelLoad = (scene: THREE.Group) => {
    setModelLoaded(true)

    // Calculate model size
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    setModelSize(size)

    // Auto-fit model on first load, but only if we haven't manually set scale
    if (!autoFitApplied) {
      fitModelToView(size)
      setAutoFitApplied(true)
    }
  }

  const resetModel = () => {
    setModelScale(1)
    setModelPosition([0, 0, 0])
  }

  const fitModelToView = (size = modelSize) => {
    if (!size) return

    // Calculate appropriate scale based on model size
    const maxDimension = Math.max(size.x, size.y, size.z)
    const targetSize = 5 // Target size in world units
    const newScale = targetSize / maxDimension

    // Only update if the scale is significantly different to avoid jumps
    if (Math.abs(scaleRef.current - newScale) > 0.01) {
      setModelScale(newScale)
    }

    // Center the model
    setModelPosition([0, 0, 0])
  }

  // Safe scale setter that prevents jumps
  const updateModelScale = (newScale: number) => {
    // Prevent scale from jumping to 0
    if (newScale <= 0.01) newScale = 0.01

    // Only update if the change is significant
    if (Math.abs(scaleRef.current - newScale) > 0.001) {
      setModelScale(newScale)
    }
  }

  // Reset lighting to defaults
  const resetLighting = () => {
    setAmbientIntensity(0.3)
    setDirectionalIntensity(0.5)
    setEnvironmentPreset("studio")
    setShowShadows(true)
  }

  // Preset lighting configurations
  const applyLightingPreset = (preset: string) => {
    switch (preset) {
      case "soft":
        setAmbientIntensity(0.4)
        setDirectionalIntensity(0.3)
        setEnvironmentPreset("city")
        setShowShadows(true)
        break
      case "bright":
        setAmbientIntensity(0.5)
        setDirectionalIntensity(0.8)
        setEnvironmentPreset("sunset")
        setShowShadows(true)
        break
      case "dark":
        setAmbientIntensity(0.2)
        setDirectionalIntensity(0.3)
        setEnvironmentPreset("night")
        setShowShadows(true)
        break
      case "neutral":
        setAmbientIntensity(0.3)
        setDirectionalIntensity(0.4)
        setEnvironmentPreset("warehouse")
        setShowShadows(true)
        break
      default:
        resetLighting()
    }
  }

  return (
    <div className="relative w-full h-full">
      <InfoPanel />

      {/* Model controls panel */}
      <div className="absolute left-4 top-4 z-10">
        <ModelControls
          scale={modelScale}
          setScale={updateModelScale}
          position={modelPosition}
          setPosition={setModelPosition}
          onReset={resetModel}
          onFitToView={() => fitModelToView()}
        />
      </div>

      {/* Lighting controls panel */}
      <div className="absolute left-4 top-[280px] z-10">
        <LightingControls
          ambientIntensity={ambientIntensity}
          setAmbientIntensity={setAmbientIntensity}
          directionalIntensity={directionalIntensity}
          setDirectionalIntensity={setDirectionalIntensity}
          environmentPreset={environmentPreset}
          setEnvironmentPreset={setEnvironmentPreset}
          showShadows={showShadows}
          setShowShadows={setShowShadows}
          onReset={resetLighting}
          onPresetSelect={applyLightingPreset}
        />
      </div>

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={45} />

        <SceneLighting
          ambientIntensity={ambientIntensity}
          directionalIntensity={directionalIntensity}
          environmentPreset={environmentPreset}
          showShadows={showShadows}
        />

        <Suspense fallback={<Loader />}>
          <Model url={modelUrl} scale={modelScale} position={modelPosition} onLoad={handleModelLoad} />
          <CameraControls />
          <BakeShadows />
        </Suspense>
      </Canvas>
    </div>
  )
}

