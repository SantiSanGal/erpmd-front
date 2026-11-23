import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react'
import { ImagePlus, UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

type InvoiceDropzoneProps = {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export function InvoiceDropzone({
  onFilesSelected,
  disabled = false,
}: InvoiceDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  function openFilePicker() {
    if (!disabled) inputRef.current?.click()
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (disabled) return

    dragDepth.current += 1
    setIsDragging(true)
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (!disabled) event.dataTransfer.dropEffect = 'copy'
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (disabled) return

    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setIsDragging(false)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    dragDepth.current = 0
    setIsDragging(false)

    if (disabled) return

    const droppedFiles = Array.from(event.dataTransfer.files)
    if (droppedFiles.length > 0) onFilesSelected(droppedFiles)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openFilePicker()
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])
    if (selectedFiles.length > 0) onFilesSelected(selectedFiles)

    // Permite volver a seleccionar el mismo archivo.
    event.target.value = ''
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Añadir fotos de facturas"
      aria-disabled={disabled}
      onClick={openFilePicker}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'group relative flex min-h-72 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all outline-none select-none',
        'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50',
        'focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20',
        isDragging && 'scale-[1.01] border-primary bg-primary/5 ring-4 ring-primary/10',
        disabled && 'pointer-events-none opacity-60',
      )}
    >
      <div
        className={cn(
          'flex size-16 items-center justify-center rounded-2xl bg-background shadow-sm ring-1 ring-border transition-transform duration-200',
          isDragging && 'scale-110',
        )}
      >
        {isDragging ? (
          <ImagePlus className="size-7 text-primary" />
        ) : (
          <UploadCloud className="size-7 text-primary" />
        )}
      </div>

      <div className="space-y-1.5">
        <p className="font-heading text-lg font-medium">
          {isDragging
            ? 'Suelta las facturas aquí'
            : 'Arrastra y suelta tus facturas'}
        </p>
        <p className="text-sm text-muted-foreground">
          o{' '}
          <span className="font-medium text-foreground underline underline-offset-4">
            selecciónalas desde tu equipo
          </span>
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        JPG, PNG, WEBP, HEIC o AVIF · Máximo 10 MB por archivo
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleInputChange}
        tabIndex={-1}
      />
    </div>
  )
}
