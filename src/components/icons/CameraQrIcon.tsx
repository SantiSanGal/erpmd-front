import { useId, type SVGProps } from 'react'

export function CameraQrIcon({
  className,
  size = 24,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number | string }) {
  const reactId = useId().replace(/:/g, '')
  const camClipId = `cam-clip-${reactId}`
  const qrClipId = `qr-clip-${reactId}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <defs>
        {/* Mitad diagonal superior izquierda para la cámara */}
        <clipPath id={camClipId}>
          <polygon points="0,0 24,0 0,24" />
        </clipPath>
        {/* Mitad diagonal inferior derecha para el código QR */}
        <clipPath id={qrClipId}>
          <polygon points="24,24 24,0 0,24" />
        </clipPath>
      </defs>

      {/* Mitad superior izquierda: Cámara */}
      <g clipPath={`url(#${camClipId})`}>
        {/* Cuerpo de la cámara */}
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        {/* Lente de la cámara */}
        <circle cx="12" cy="13" r="3.2" />
        {/* Flash */}
        <circle cx="6.5" cy="10" r="0.75" fill="currentColor" stroke="none" />
      </g>

      {/* Línea divisoria diagonal punteada */}
      <line
        x1="23.5"
        y1="0.5"
        x2="0.5"
        y2="23.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 1.5"
        opacity="0.7"
      />

      {/* Mitad inferior derecha: Código QR */}
      <g clipPath={`url(#${qrClipId})`}>
        {/* Cuadro detector principal inferior derecho */}
        <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" />
        <rect x="15" y="15" width="3.5" height="3.5" fill="currentColor" stroke="none" />

        {/* Marcadores adicionales de código QR */}
        <path d="M18 4h3v3" />
        <rect x="19" y="5" width="2" height="2" fill="currentColor" stroke="none" />

        <path d="M4 18v3h3" />
        <rect x="5" y="19" width="2" height="2" fill="currentColor" stroke="none" />

        {/* Puntos y líneas de datos */}
        <rect x="10" y="16" width="1.5" height="1.5" fill="currentColor" stroke="none" />
        <rect x="16" y="10" width="1.5" height="1.5" fill="currentColor" stroke="none" />
        <line x1="21" y1="10" x2="21" y2="11.5" strokeWidth="2" strokeLinecap="square" />
        <line x1="10" y1="21" x2="11.5" y2="21" strokeWidth="2" strokeLinecap="square" />
      </g>
    </svg>
  )
}
