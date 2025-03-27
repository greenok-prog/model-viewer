"use client"

import { Suspense, useState, useRef, useEffect, useMemo } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html, useProgress, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Info, ZoomIn, ZoomOut, RotateCcw, Settings, X, Loader2, RefreshCw, Layers } from "lucide-react"
import ModelControls from "./model-controls"
import { useMediaQuery } from "@/hooks/use-mobile"

// Типы вариантов стенда
export type StandVariant = "construction" | "draft" | "design"

// Интерфейс для вариантов стенда
interface StandVariantInfo {
  id: StandVariant
  name: string
  url: string
}

// Глобальный компонент загрузки, который отображается до инициализации Canvas
function GlobalLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-50">
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium">Загрузка 3D модели...</p>
        <p className="text-sm text-muted-foreground">Пожалуйста, подождите</p>
      </div>
    </div>
  )
}

// Компонент для отображения ошибки WebGL
function WebGLErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
      <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <h3 className="text-lg font-medium text-red-700 mb-2">Ошибка 3D рендеринга</h3>
        <p className="text-red-600 mb-4">
          Произошла ошибка WebGL (Context Lost). Это может быть вызвано ограничениями браузера или проблемами с
          видеокартой.
        </p>
        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Попробовать снова
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Рекомендации: закройте другие вкладки, обновите драйверы видеокарты или попробуйте другой браузер.
          </p>
        </div>
      </div>
    </div>
  )
}

// Упрощенная модель без сложных оптимизаций
function Model({
  url,
  scale = 1,
  position = [0, 0, 0],
  onLoad,
  onError,
}: {
  url: string
  scale?: number
  position?: [number, number, number]
  onLoad?: (scene: THREE.Group) => void
  onError?: (error: any) => void
}) {
  const { scene } = useGLTF(url, undefined)
  const modelRef = useRef<THREE.Group>(null)

  // Простое клонирование сцены
  const clonedScene = useMemo(() => {
    console.log("Cloning scene")
    return scene.clone()
  }, [scene])

  useEffect(() => {
    if (onLoad && clonedScene) {
      console.log("Model loaded, applying visibility")

      // Убедимся, что модель видима
      clonedScene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.visible = true

          // Упрощаем материалы для стабильности
          if (node.material) {
            if (Array.isArray(node.material)) {
              node.material.forEach((mat) => {
                // Убедимся, что материал видим
                mat.transparent = false
                mat.opacity = 1
                mat.needsUpdate = true
              })
            } else {
              // Убедимся, что материал видим
              node.material.transparent = false
              node.material.opacity = 1
              node.material.needsUpdate = true
            }
          }
        }
      })

      onLoad(clonedScene)
    }
  }, [onLoad, clonedScene])

  return <primitive ref={modelRef} object={clonedScene} position={position} scale={scale} visible={true} />
}

function Loader() {
  const { progress, active, errors } = useProgress()

  if (errors.length > 0) {
    return (
      <Html center>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Ошибка загрузки модели</p>
          <p className="text-sm text-red-500 mt-1">Пожалуйста, проверьте URL или формат файла</p>
        </div>
      </Html>
    )
  }

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
        <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-sm font-medium">{progress.toFixed(0)}% загружено</p>
        </div>
      </div>
    </Html>
  )
}

// Контролы камеры с возможностью сохранения/восстановления позиции
function CameraControls({
  cameraPosition,
  onCameraChange,
}: {
  cameraPosition?: { position: THREE.Vector3; target: THREE.Vector3 }
  onCameraChange?: (position: THREE.Vector3, target: THREE.Vector3) => void
}) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  // Восстанавливаем позицию камеры при изменении cameraPosition
  useEffect(() => {
    if (cameraPosition && controlsRef.current) {
      camera.position.copy(cameraPosition.position)
      controlsRef.current.target.copy(cameraPosition.target)
      controlsRef.current.update()
    }
  }, [camera, cameraPosition])

  // Сохраняем позицию камеры при её изменении
  useEffect(() => {
    if (!controlsRef.current || !onCameraChange) return

    const saveCamera = () => {
      onCameraChange(camera.position.clone(), controlsRef.current.target.clone())
    }

    // Добавляем обработчик события изменения камеры
    controlsRef.current.addEventListener("change", saveCamera)

    return () => {
      if (controlsRef.current) {
        controlsRef.current.removeEventListener("change", saveCamera)
      }
    }
  }, [camera, onCameraChange])

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

// Компонент для очистки фона
function ClearBackground() {
  const { gl } = useThree()

  useEffect(() => {
    gl.setClearColor("#ffffff", 1)
  }, [gl])

  return null
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

// Компонент для переключения между вариантами стенда
function VariantSwitcher({
  variants,
  currentVariant,
  onVariantChange,
}: {
  variants: StandVariantInfo[]
  currentVariant: StandVariant
  onVariantChange: (variant: StandVariant) => void
}) {
  return (
    <Card className="p-2 bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-2 py-1">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Варианты стенда</span>
        </div>
        <div className="flex flex-wrap gap-2 p-1">
          {variants.map((variant) => (
            <Button
              key={variant.id}
              size="sm"
              variant={currentVariant === variant.id ? "default" : "outline"}
              onClick={() => onVariantChange(variant.id)}
              className="flex-1 min-w-[100px]"
            >
              {variant.name}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}

interface AdjustableModelViewerProps {
  modelUrl?: string
  constructionUrl?: string
  draftUrl?: string
  designUrl?: string
}

export default function AdjustableModelViewer({
  modelUrl = "/model.glb",
  constructionUrl,
  draftUrl,
  designUrl,
}: AdjustableModelViewerProps) {
  // Определяем варианты стенда
  const standVariants = useMemo<StandVariantInfo[]>(
    () => [
      { id: "construction", name: "Конструкция", url: constructionUrl || modelUrl },
      { id: "draft", name: "Черновой", url: draftUrl || modelUrl },
      { id: "design", name: "Дизайн", url: designUrl || modelUrl },
    ],
    [modelUrl, constructionUrl, draftUrl, designUrl],
  )

  // Состояние для текущего варианта стенда
  const [currentVariant, setCurrentVariant] = useState<StandVariant>("design")

  // Получаем URL текущего варианта
  const currentModelUrl = useMemo(() => {
    const variant = standVariants.find((v) => v.id === currentVariant)
    return variant ? variant.url : modelUrl
  }, [currentVariant, standVariants, modelUrl])

  const [modelScale, setModelScale] = useState(1)
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([0, 0, 0])
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelSize, setModelSize] = useState<THREE.Vector3 | null>(null)
  const [autoFitApplied, setAutoFitApplied] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isCanvasLoading, setIsCanvasLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [webGLContextLost, setWebGLContextLost] = useState(false)

  // Состояние для хранения позиции камеры
  const [cameraPosition, setCameraPosition] = useState<
    | {
        position: THREE.Vector3
        target: THREE.Vector3
      }
    | undefined
  >(undefined)

  const isMobile = useMediaQuery("(max-width: 768px)")

  const scaleRef = useRef(modelScale)
  const positionRef = useRef(modelPosition)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Update refs when state changes
  useEffect(() => {
    scaleRef.current = modelScale
  }, [modelScale])

  useEffect(() => {
    positionRef.current = modelPosition
  }, [modelPosition])

  // Обработчик события потери WebGL контекста
  useEffect(() => {
    const handleContextLost = () => {
      console.error("WebGL context lost")
      setWebGLContextLost(true)
    }

    // Добавляем слушатель события потери контекста
    window.addEventListener("webglcontextlost", handleContextLost, false)

    return () => {
      window.removeEventListener("webglcontextlost", handleContextLost)
    }
  }, [])

  // Обработчик изменения варианта стенда
  const handleVariantChange = (variant: StandVariant) => {
    // Сохраняем текущий вариант
    setCurrentVariant(variant)

    // Показываем индикатор загрузки при смене модели
    setIsCanvasLoading(true)

    // Сбрасываем флаг автоматического масштабирования
    // чтобы новая модель была правильно масштабирована
    // setAutoFitApplied(false)
  }

  // Обработчик изменения позиции камеры
  const handleCameraChange = (position: THREE.Vector3, target: THREE.Vector3) => {
    setCameraPosition({ position, target })
  }

  const handleModelLoad = (scene: THREE.Group) => {
    console.log("Model loaded callback triggered")
    setModelLoaded(true)
    setLoadError(null)
    // Отключаем глобальный индикатор загрузки
    setIsCanvasLoading(false)

    // Calculate model size
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    console.log("Model size:", size)
    setModelSize(size)

    // Auto-fit model on first load, but only if we haven't manually set scale
    if (!autoFitApplied) {
      // Добавляем небольшую задержку перед автоматическим масштабированием
      setTimeout(() => {
        fitModelToView(size)
        setAutoFitApplied(true)
      }, 100)
    }
  }

  const handleModelError = (error: any) => {
    console.error("Error loading model:", error)
    setLoadError("Не удалось загрузить 3D модель. Пожалуйста, проверьте URL или формат файла.")
    setIsCanvasLoading(false)
  }

  const resetModel = () => {
    setModelScale(1)
    setModelPosition([0, 0, 0])
  }

  const fitModelToView = (size = modelSize) => {
    if (!size) return

    // Calculate appropriate scale based on model size
    const maxDimension = Math.max(size.x, size.y, size.z)
    // Если размер модели слишком мал, установим минимальный масштаб
    if (maxDimension < 0.1) {
      setModelScale(1)
      return
    }

    const targetSize = 5 // Target size in world units
    const newScale = targetSize / maxDimension

    // Установим безопасные границы для масштаба
    const safeScale = Math.max(0.01, Math.min(newScale, 10))

    console.log("Fitting model to view, scale:", safeScale)

    // Only update if the scale is significantly different to avoid jumps
    if (Math.abs(scaleRef.current - safeScale) > 0.01) {
      setModelScale(safeScale)
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

  // Функция для перезагрузки после потери контекста
  const handleRetryAfterContextLost = () => {
    setWebGLContextLost(false)
    setIsCanvasLoading(true)
    setModelLoaded(false)
    setAutoFitApplied(false)

    // Перезагружаем страницу, так как восстановление контекста может быть ненадежным
    window.location.reload()
  }

  // Определяем, нужно ли показывать запасной вариант
  const showFallback = webGLContextLost || loadError === "Ошибка инициализации 3D сцены. Пожалуйста, обновите страницу."

  return (
    <div className="relative w-full h-full bg-white">
      {/* Глобальный индикатор загрузки */}
      {isCanvasLoading && !showFallback && <GlobalLoader />}

      {/* Запасной вариант при потере WebGL контекста */}
      {showFallback && <WebGLErrorFallback onRetry={handleRetryAfterContextLost} />}

      {/* Сообщение об ошибке загрузки */}
      {loadError && !showFallback && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/80">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg max-w-md">
            <h3 className="text-lg font-medium text-red-700 mb-2">Ошибка загрузки</h3>
            <p className="text-red-600">{loadError}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Попробовать снова
            </Button>
          </div>
        </div>
      )}

      {!showFallback && (
        <>
          <InfoPanel />

          {/* Переключатель вариантов стенда */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <VariantSwitcher
              variants={standVariants}
              currentVariant={currentVariant}
              onVariantChange={handleVariantChange}
            />
          </div>

          {/* Кнопка для показа/скрытия панели управления на мобильных устройствах */}
          {isMobile && (
            <div className="absolute bottom-4 right-4 z-10">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 backdrop-blur-sm"
                onClick={() => setShowControls(!showControls)}
              >
                {showControls ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
              </Button>
            </div>
          )}

          {/* Model controls panel - адаптивное расположение */}
          {(!isMobile || showControls) && (
            <div className={`${isMobile ? "absolute bottom-16 right-4 z-10" : "absolute left-4 top-4 z-10"}`}>
              <ModelControls
                scale={modelScale}
                setScale={updateModelScale}
                position={modelPosition}
                setPosition={setModelPosition}
                onReset={resetModel}
                onFitToView={() => fitModelToView()}
                isMobile={isMobile}
              />
            </div>
          )}
        </>
      )}

      {/* Добавим проверку на загруженность модели */}
      {!showFallback && (
        <div className="w-full h-full">
          <Canvas
            key={`canvas-${currentVariant}`} // Добавляем ключ для пересоздания Canvas при смене варианта
            className="bg-white"
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "default",
              stencil: false,
              depth: true,
              
            }}
            dpr={1}
            onCreated={({ gl }) => {
              console.log("Canvas created")
              // Устанавливаем белый фон
              gl.setClearColor("#ffffff", 1)
              canvasRef.current = gl.domElement
            }}
            onError={(error) => {
              console.error("Canvas error:", error)
              setLoadError("Ошибка инициализации 3D сцены. Пожалуйста, обновите страницу.")
            }}
          >
            {/* Компонент для установки белого фона */}
            <ClearBackground />

            <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={45} />

            {/* Базовое освещение - адаптировано для белого фона */}
            <ambientLight intensity={1.0} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <directionalLight position={[-10, -10, -5]} intensity={0.2} />

            <Suspense fallback={<Loader />}>
              <Model
                url={currentModelUrl}
                scale={modelScale}
                position={modelPosition}
                onLoad={handleModelLoad}
                onError={handleModelError}
              />
              <CameraControls cameraPosition={cameraPosition} onCameraChange={handleCameraChange} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Добавим отладочную информацию */}
      {process.env.NODE_ENV === "development" && !showFallback && (
        <div className="absolute bottom-4 left-4 z-10 bg-white/80 p-2 rounded text-xs">
          <div>Модель загружена: {modelLoaded ? "Да" : "Нет"}</div>
          <div>Вариант: {currentVariant}</div>
          <div>Масштаб: {modelScale.toFixed(2)}</div>
          <div>Позиция: [{modelPosition.map((p) => p.toFixed(2)).join(", ")}]</div>
        </div>
      )}
    </div>
  )
}

