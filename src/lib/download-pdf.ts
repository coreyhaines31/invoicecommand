// Downloads a server-rendered PDF (the same render the emailed PDF uses) and
// hands it to the browser as a file. Throws with the route's error message so
// callers can show it.
export async function downloadPdf(url: string, init?: RequestInit): Promise<void> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error || 'Could not download the PDF')
  }

  const disposition = res.headers.get('content-disposition') || ''
  const filename = /filename="([^"]+)"/.exec(disposition)?.[1] || 'invoice.pdf'

  const objectUrl = URL.createObjectURL(await res.blob())
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Revoking in the same tick can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}

export function downloadOwnerInvoicePdf(invoiceId: string): Promise<void> {
  return downloadPdf('/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ invoiceId }),
  })
}

export function downloadSharedInvoicePdf(shareToken: string): Promise<void> {
  return downloadPdf(`/api/share/${encodeURIComponent(shareToken)}/pdf`)
}
