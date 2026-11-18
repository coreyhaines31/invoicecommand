'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

function filenameFrom(header: string | null) {
  const match = header?.match(/filename="([^"]+)"/)
  return match?.[1] ?? 'invoicecommand-export.json'
}

export function ExportDataButton() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleExport() {
    setPending(true)
    setError(null)
    try {
      const res = await fetch('/api/account/export')
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'The export failed. Please try again.')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filenameFrom(res.headers.get('content-disposition'))
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch {
      setError('The export failed. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" onClick={handleExport} disabled={pending}>
        {pending ? 'Preparing export...' : 'Download my data'}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
