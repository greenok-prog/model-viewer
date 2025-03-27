"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, ZoomIn, ZoomOut, MoveHorizontal, ArrowDown, ArrowUp } from "lucide-react"

interface ModelControlsProps {
  scale: number
  setScale: (scale: number) => void
  position: [number, number, number]
  setPosition: (position: [number, number, number]) => void
  onReset: () => void
  onFitToView: () => void
  isMobile?: boolean
}

export default function ModelControls({
  scale,
  setScale,
  position,
  setPosition,
  onReset,
  onFitToView,
  isMobile = false,
}: ModelControlsProps) {
  // Use local state to prevent jumps in the UI
  const [localScale, setLocalScale] = useState(scale)
  const [posX, setPosX] = useState(position[0].toString())
  const [posY, setPosY] = useState(position[1].toString())
  const [posZ, setPosZ] = useState(position[2].toString())

  // Update local scale when prop changes
  useEffect(() => {
    if (Math.abs(localScale - scale) > 0.01) {
      setLocalScale(scale)
    }
  }, [scale])

  // Update position fields when props change
  useEffect(() => {
    setPosX(position[0].toString())
    setPosY(position[1].toString())
    setPosZ(position[2].toString())
  }, [position])

  const handleScaleChange = (value: number[]) => {
    const newScale = Math.max(0.01, value[0])
    setLocalScale(newScale)
    setScale(newScale)
  }

  const handleScaleButton = (delta: number) => {
    const newScale = Math.max(0.01, localScale + delta)
    setLocalScale(newScale)
    setScale(newScale)
  }

  const handlePositionChange = (axis: "x" | "y" | "z", value: string) => {
    const numValue = Number.parseFloat(value) || 0

    if (axis === "x") {
      setPosX(value)
      setPosition([numValue, position[1], position[2]])
    } else if (axis === "y") {
      setPosY(value)
      setPosition([position[0], numValue, position[2]])
    } else {
      setPosZ(value)
      setPosition([position[0], position[1], numValue])
    }
  }

  const adjustPosition = (axis: "x" | "y" | "z", delta: number) => {
    if (axis === "x") {
      const newX = position[0] + delta
      setPosX(newX.toString())
      setPosition([newX, position[1], position[2]])
    } else if (axis === "y") {
      const newY = position[1] + delta
      setPosY(newY.toString())
      setPosition([position[0], newY, position[2]])
    } else {
      const newZ = position[2] + delta
      setPosZ(newZ.toString())
      setPosition([position[0], position[1], newZ])
    }
  }

  // Компактная версия для мобильных устройств
  if (isMobile) {
    return (
      <Card className="w-full max-w-[250px]">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-medium">Настройки модели</CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          {/* Scale controls - компактная версия */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Масштаб</Label>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleScaleButton(-0.1)}>
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <span className="text-xs w-10 text-center">{localScale.toFixed(2)}x</span>
                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleScaleButton(0.1)}>
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1 text-xs h-7" onClick={onReset}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Сбросить
            </Button>
            <Button variant="default" size="sm" className="flex-1 text-xs h-7" onClick={onFitToView}>
              Подогнать
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Полная версия для десктопа
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Настройки модели</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scale controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Масштаб модели</Label>
            <span className="text-xs text-muted-foreground">{localScale.toFixed(2)}x</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleScaleButton(-0.1)}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <Slider
              value={[localScale]}
              min={0.01}
              max={2}
              step={0.01}
              onValueChange={handleScaleChange}
              className="flex-1"
            />
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleScaleButton(0.1)}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Position controls */}
        <div className="space-y-2">
          <Label className="text-xs">Положение модели</Label>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs">X</Label>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => adjustPosition("x", -0.5)}>
                    <MoveHorizontal className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => adjustPosition("x", 0.5)}>
                    <MoveHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Input value={posX} onChange={(e) => handlePositionChange("x", e.target.value)} className="h-7 text-xs" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Y</Label>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => adjustPosition("y", -0.5)}>
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => adjustPosition("y", 0.5)}>
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Input value={posY} onChange={(e) => handlePositionChange("y", e.target.value)} className="h-7 text-xs" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Z</Label>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => adjustPosition("z", -0.5)}>
                    <MoveHorizontal className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => adjustPosition("z", 0.5)}>
                    <MoveHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Input value={posZ} onChange={(e) => handlePositionChange("z", e.target.value)} className="h-7 text-xs" />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={onReset}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Сбросить
          </Button>
          <Button variant="default" size="sm" className="flex-1 text-xs h-8" onClick={onFitToView}>
            Подогнать размер
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

