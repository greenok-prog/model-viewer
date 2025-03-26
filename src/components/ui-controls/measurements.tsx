"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Ruler, Move, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface MeasurementsProps {
  onToggleMeasurements?: (active: boolean) => void
  onMeasureDistance?: (point1: string, point2: string) => void
}

export default function Measurements({ onToggleMeasurements, onMeasureDistance }: MeasurementsProps) {
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [point1, setPoint1] = useState("")
  const [point2, setPoint2] = useState("")
  const [measurements, setMeasurements] = useState<Array<{ id: number; name: string; value: string }>>([
    { id: 1, name: "Высота стенда", value: "250 см" },
    { id: 2, name: "Ширина стенда", value: "300 см" },
    { id: 3, name: "Глубина стенда", value: "200 см" },
  ])

  const handleToggleMeasurements = (checked: boolean) => {
    setShowMeasurements(checked)
    if (onToggleMeasurements) {
      onToggleMeasurements(checked)
    }
  }

  const handleMeasure = () => {
    if (point1 && point2 && onMeasureDistance) {
      onMeasureDistance(point1, point2)
    }
  }

  const removeMeasurement = (id: number) => {
    setMeasurements(measurements.filter((m) => m.id !== id))
  }

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Измерения
          </div>
          <Switch checked={showMeasurements} onCheckedChange={handleToggleMeasurements} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showMeasurements && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Измерить расстояние</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Точка 1"
                  value={point1}
                  onChange={(e) => setPoint1(e.target.value)}
                  className="text-xs"
                />
                <Input
                  placeholder="Точка 2"
                  value={point2}
                  onChange={(e) => setPoint2(e.target.value)}
                  className="text-xs"
                />
              </div>
              <Button size="sm" className="w-full text-xs mt-1" onClick={handleMeasure} disabled={!point1 || !point2}>
                <Move className="h-3 w-3 mr-1" />
                Измерить
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Сохраненные измерения</Label>
              <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                {measurements.map((measurement) => (
                  <div
                    key={measurement.id}
                    className="flex items-center justify-between py-1 px-2 text-xs bg-muted rounded-md"
                  >
                    <span>{measurement.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{measurement.value}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() => removeMeasurement(measurement.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!showMeasurements && (
          <div className="text-xs text-muted-foreground text-center py-2">
            Включите измерения, чтобы отображать размеры на модели
          </div>
        )}
      </CardContent>
    </Card>
  )
}

