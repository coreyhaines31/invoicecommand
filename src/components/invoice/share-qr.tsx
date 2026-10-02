'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ShareQRProps {
  url: string
  size?: number
  filename?: string
  showDownload?: boolean
  className?: string
}

export function ShareQR({ url, size = 192, filename = 'invoice-qr.png', showDownload = true, className }: ShareQRProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(url, {
      width: size,
      margin: 1,
      // High error correction so the code still scans when overlaid with a
      // logo or printed at low resolution.
      errorCorrectionLevel: 'H',
    })
      .then((d) => {
        if (!cancelled) setDataUrl(d)
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err)
      })
    return () => {
      cancelled = true
    }
  }, [url, size])

  const handleDownload = () => {
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={className}>
      <div
        className="bg-white rounded-md border p-2 inline-block"
        style={{ width: size + 16, height: size + 16 }}
      >
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="QR code linking to invoice" width={size} height={size} />
        ) : (
          <div className="w-full h-full animate-pulse bg-muted rounded" />
        )}
      </div>
      {showDownload && (
        <div className="mt-2">
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!dataUrl}>
            <Download className="w-4 h-4 mr-2" />
            Download QR
          </Button>
        </div>
      )}
    </div>
  )
}
