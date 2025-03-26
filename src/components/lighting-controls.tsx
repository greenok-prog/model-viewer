"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select } from "@/components/ui/select"
import { RefreshCw } from "lucide-react"

interface LightingControlsProps {
  ambientIntensity: number
  setAmbientIntensity: (value: number) => void
  directionalIntensity: number
  setDirectionalIntensity: (value: number) => void
  environmentPreset: string
  setEnvironmentPreset: (value: string) => void
  showShadows: boolean
  setShowShadows: (value: boolean) => void
  onReset: () => void
  onPresetSelect: (preset: string) => void
}

export default function LightingControls({
  ambientIntensity,
  setAmbientIntensity,
  directionalIntensity,
  setDirectionalIntensity,
  environmentPreset,
  setEnvironmentPreset,
  showShadows,
  setShowShadows,
  onReset,
  onPresetSelect,
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
    { value: "soft", label: "Мягкое освещение" },
    { value: "bright", label: "Яркое освещение" },
    { value: "dark", label: "Тёмное освещение" },
    { value: "neutral", label: "Нейтральное" },
  ]

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Настройки освещения</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lighting presets */}
        <div className="space-y-2">
          <Label className="text-xs">Пресеты освещения</Label>
          <div className="grid grid-cols-2 gap-2">
            {lightingPresets.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => onPresetSelect(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Ambient light intensity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Фоновое освещение</Label>
            <span className="text-xs text-muted-foreground">{(ambientIntensity * 100).toFixed(0)}%</span>
          </div>
          <Slider
            value={[ambientIntensity]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(value) => setAmbientIntensity(value[0])}
          />
        </div>

        {/* Directional light intensity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Направленное освещение</Label>
            <span className="text-xs text-muted-foreground">{(directionalIntensity * 100).toFixed(0)}%</span>
          </div>
          <Slider
            value={[directionalIntensity]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(value) => setDirectionalIntensity(value[0])}
          />
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

        {/* Reset button */}
        <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={onReset}>
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Сбросить освещение
        </Button>
      </CardContent>
    </Card>
  )
}

