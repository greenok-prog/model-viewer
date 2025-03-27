"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select } from "@/components/ui/select"
import { Sun, Moon, Cloud } from "lucide-react"

interface LightingControlsProps {
  environmentPreset: string
  setEnvironmentPreset: (value: string) => void
  showShadows: boolean
  setShowShadows: (value: boolean) => void
  onPresetSelect: (preset: string) => void
  activePreset: string
}

export default function LightingControls({
  environmentPreset,
  setEnvironmentPreset,
  showShadows,
  setShowShadows,
  onPresetSelect,
  activePreset,
}: LightingControlsProps) {
  const environmentOptions = [
    { value: "studio", label: "Студия" },
    { value: "city", label: "Город" },
    { value: "warehouse", label: "Склад" },
    { value: "sunset", label: "Закат" },
    { value: "dawn", label: "Рассвет" },
    { value: "night", label: "Ночь" },
    { value: "forest", label: "Лес" },
    { value: "apartment", label: "Квартира" },
    { value: "lobby", label: "Холл" },
    { value: "park", label: "Парк" },
  ]

  const lightingPresets = [
    { value: "soft", label: "Мягкое", icon: Cloud },
    { value: "bright", label: "Яркое", icon: Sun },
    { value: "dark", label: "Тёмное", icon: Moon },
  ]

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Настройки освещения</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lighting presets */}
        <div className="space-y-2">
          <Label className="text-xs">Тип освещения</Label>
          <div className="grid grid-cols-3 gap-2">
            {lightingPresets.map((preset) => {
              const Icon = preset.icon
              return (
                <Button
                  key={preset.value}
                  variant={activePreset === preset.value ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-10 flex flex-col gap-1 items-center justify-center"
                  onClick={() => onPresetSelect(preset.value)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{preset.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Environment preset */}
        <div className="space-y-2">
          <Label className="text-xs">Окружение</Label>
          <Select
            value={environmentPreset}
            onChange={(e) => setEnvironmentPreset(e.target.value)}
            options={environmentOptions}
            className="h-8 text-xs"
          />
        </div>

        {/* Shadows toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-xs">Показывать тени</Label>
          <Switch checked={showShadows} onCheckedChange={setShowShadows} />
        </div>
      </CardContent>
    </Card>
  )
}

