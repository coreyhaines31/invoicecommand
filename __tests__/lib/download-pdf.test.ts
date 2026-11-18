import { downloadOwnerInvoicePdf, downloadSharedInvoicePdf } from '@/lib/download-pdf'

const fetchMock = jest.fn()
let clickSpy: jest.SpyInstance
const clicked = () => clickSpy.mock.contexts[0] as HTMLAnchorElement | undefined

beforeEach(() => {
  fetchMock.mockReset()
  global.fetch = fetchMock
  URL.createObjectURL = jest.fn(() => 'blob:pdf')
  URL.revokeObjectURL = jest.fn()
  clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
})

afterEach(() => jest.restoreAllMocks())

function pdfResponse(filename: string) {
  return {
    ok: true,
    headers: new Headers({ 'content-disposition': `attachment; filename="${filename}"` }),
    blob: async () => new Blob(['%PDF']),
  }
}

describe('download-pdf', () => {
  it('posts the invoice id to the owner route and saves the file under the server filename', async () => {
    fetchMock.mockResolvedValue(pdfResponse('invoice-INV-1.pdf'))

    await downloadOwnerInvoicePdf('inv-1')

    expect(fetchMock).toHaveBeenCalledWith('/api/generate-pdf', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ invoiceId: 'inv-1' }),
    }))
    expect(clicked()?.download).toBe('invoice-INV-1.pdf')
    expect(clicked()?.href).toBe('blob:pdf')
  })

  it('fetches the share route for a token', async () => {
    fetchMock.mockResolvedValue(pdfResponse('estimate-EST-2.pdf'))

    await downloadSharedInvoicePdf('tok_abcdefghijklmnop')

    expect(fetchMock).toHaveBeenCalledWith('/api/share/tok_abcdefghijklmnop/pdf', undefined)
    expect(clicked()?.download).toBe('estimate-EST-2.pdf')
  })

  it('throws the route error and saves nothing when the request fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, json: async () => ({ error: 'Invoice not found' }) })

    await expect(downloadSharedInvoicePdf('tok_abcdefghijklmnop')).rejects.toThrow('Invoice not found')
    expect(clickSpy).not.toHaveBeenCalled()
  })
})
