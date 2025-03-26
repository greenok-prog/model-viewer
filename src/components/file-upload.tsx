"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadSuccess(false)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)

    // Here you would implement the actual upload logic
    // For example, using FormData and fetch to upload to your server

    // Simulating upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setUploading(false)
    setUploadSuccess(true)
    setFile(null)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Загрузить 3D модель</CardTitle>
        <CardDescription>Загрузите вашу 3D модель в формате GLB или GLTF</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="model">Файл модели</Label>
            <Input ref={fileInputRef} id="model" type="file" accept=".glb,.gltf" onChange={handleFileChange} />
          </div>

          {file && (
            <div className="text-sm">
              Выбран файл: <span className="font-medium">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} МБ)
            </div>
          )}

          <Button className="w-full" onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Загрузка...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Загрузить модель
              </span>
            )}
          </Button>

          {uploadSuccess && <div className="text-sm text-green-600 font-medium">Файл успешно загружен!</div>}

          <div className="text-xs text-muted-foreground mt-4">
            <p>Поддерживаемые форматы: GLB, GLTF</p>
            <p>Максимальный размер файла: 50 МБ</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

