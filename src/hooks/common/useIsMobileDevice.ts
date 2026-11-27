import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/**
 * Detecta programáticamente si el usuario está accediendo desde un teléfono celular (iOS o Android)
 * analizando el User Agent y Client Hints del navegador, sin depender de media queries CSS.
 */
export function useIsMobileDevice(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => checkIsMobilePhone(),
    () => false
  )
}

export function checkIsMobilePhone(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }

  const ua = navigator.userAgent || navigator.vendor || ''

  // 1. Detección de teléfonos iPhone e iPod
  const isIPhone = /iPhone|iPod/i.test(ua)

  // 2. Detección de teléfonos Android
  const isAndroidPhone = /Android/i.test(ua) && /Mobile/i.test(ua)

  // 3. Otros sistemas operativos móviles para celulares
  const isOtherPhone = /webOS|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(ua)

  // 4. iPad o dispositivos táctiles móviles iOS (iOS 13+ en iPad reporta MacIntel con touch)
  const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  // 5. Verificación complementaria mediante User-Agent Client Hints en navegadores Chromium modernos
  const nav = navigator as Navigator & {
    userAgentData?: {
      mobile?: boolean
      platform?: string
    }
  }
  const isClientHintsMobile = nav.userAgentData?.mobile === true

  return isIPhone || isAndroidPhone || isOtherPhone || isIPad || (isClientHintsMobile && /Android/i.test(ua))
}
