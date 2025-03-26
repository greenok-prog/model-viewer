"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Eye, EyeOff } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface MaterialPickerProps {
  onColorChange?: (color: string, materialName: string) => void
  onOpacityChange?: (opacity: number, materialName: string) => void
  onVisibilityChange?: (visible: boolean, materialName: string) => void
  materials?: Array<{
    name: string
    color: string
    opacity: number
    visible: boolean
  }>
}

export default function MaterialPicker({
  onColorChange,
  onOpacityChange,
  onVisibilityChange,
  materials = [
    { name: "Стена 1", color: "#ffffff", opacity: 1, visible: true },
    { name: "Стена 2", color: "#f0f0f0", opacity: 1, visible: true },
    { name: "Пол", color: "#d0d0d0", opacity: 1, visible: true },
  ],
}: MaterialPickerProps) {
  const [localMaterials, setLocalMaterials] = useState(materials)

  const handleColorChange = (color: string, index: number) => {
    const newMaterials = [...localMaterials]
    newMaterials[index].color = color
    setLocalMaterials(newMaterials)

    if (onColorChange) {
      onColorChange(color, newMaterials[index].name)
    }
  }

  const handleOpacityChange = (opacity: number[], index: number) => {
    const newMaterials = [...localMaterials]
    newMaterials[index].opacity = opacity[0]
    setLocalMaterials(newMaterials)

    if (onOpacityChange) {
      onOpacityChange(opacity[0], newMaterials[index].name)
    }
  }

  const handleVisibilityChange = (visible: boolean, index: number) => {
    const newMaterials = [...localMaterials]
    newMaterials[index].visible = visible
    setLocalMaterials(newMaterials)

    if (onVisibilityChange) {
      onVisibilityChange(visible, newMaterials[index].name)
    }
  }

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Настройка материалов
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="materials">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="materials">Материалы</TabsTrigger>
            <TabsTrigger value="layers">Слои</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="mt-4 space-y-4">
            {localMaterials.map((material, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{material.name}</Label>
                  <input
                    type="color"
                    value={material.color}
                    onChange={(e) => handleColorChange(e.target.value, index)}
                    className="w-6 h-6 rounded-md border overflow-hidden cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Прозрачность</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(material.opacity * 100)}%</span>
                  </div>
                  <Slider
                    value={[material.opacity]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(value) => handleOpacityChange(value, index)}
                  />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="layers" className="mt-4 space-y-3">
            {localMaterials.map((material, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  {material.visible ? (
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <Label className="text-xs">{material.name}</Label>
                </div>
                <Switch
                  checked={material.visible}
                  onCheckedChange={(checked) => handleVisibilityChange(checked, index)}
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

