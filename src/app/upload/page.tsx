import FileUpload from "@/components/file-upload"

export default function UploadPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Загрузка 3D модели</h1>
      <FileUpload />
    </div>
  )
}

