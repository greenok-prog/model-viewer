"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Maximize, Minimize, Camera, Share2, RotateCw, Grid3X3, Sun, Moon } from "lucide-react"

interface ViewControlsProps {
  onToggleFullscreen?: () => void
  onTakeScreenshot?: () => void
  onShare?: () => void
  onToggleRotation?: () => void
  onToggleGrid?: () => void
  onToggleLighting?: () => void
}

export default function ViewControls({
  onToggleFullscreen,
  onTakeScreenshot,
  onShare,
  onToggleRotation,
  onToggleGrid,
  onToggleLighting,
}: ViewControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [isDaylight, setIsDaylight] = useState(true)

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (onToggleFullscreen) onToggleFullscreen()
  }

  const handleRotation = () => {
    setIsRotating(!isRotating)
    if (onToggleRotation) onToggleRotation()
  }

  const handleGrid = () => {
    setShowGrid(!showGrid)
    if (onToggleGrid) onToggleGrid()
  }

  const handleLighting = () => {
    setIsDaylight(!isDaylight)
    if (onToggleLighting) onToggleLighting()
  }

  return (
    <TooltipProvider>
      <Card className="p-2 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={handleFullscreen}>
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onTakeScreenshot}>
                  <Camera className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Сделать снимок</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Поделиться</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={handleRotation} className={isRotating ? "bg-muted" : ""}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRotating ? "Остановить вращение" : "Автоматическое вращение"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={handleGrid} className={showGrid ? "bg-muted" : ""}>
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showGrid ? "Скрыть сетку" : "Показать сетку"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={handleLighting}>
                  {isDaylight ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isDaylight ? "Ночное освещение" : "Дневное освещение"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

