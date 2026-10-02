/**
 * Tests for logo storage utilities
 * Tests client-side validation and the /api/upload/logo request
 */

import { uploadLogo, deleteLogo } from '@/lib/storage'

describe('Storage Utilities', () => {
  const mockFetch = jest.fn()
  const originalFetch = global.fetch

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = mockFetch as unknown as typeof fetch
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    global.fetch = originalFetch
    ;(console.error as jest.Mock).mockRestore()
  })

  const createMockFile = (options: {
    name?: string
    type?: string
    size?: number
  } = {}): File => {
    const { name = 'logo.png', type = 'image/png', size = 1024 } = options
    const blob = new Blob(['x'.repeat(size)], { type })
    return new File([blob], name, { type })
  }

  const mockUploadResponse = (url = 'https://example.com/logo.png') => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url }),
    })
  }

  describe('uploadLogo', () => {
    describe('File Validation', () => {
      it('should reject non-image files', async () => {
        const file = createMockFile({ type: 'text/plain', name: 'file.txt' })

        const result = await uploadLogo(file, 'user-123')

        expect(result).toEqual({ success: false, error: 'File must be an image' })
        expect(mockFetch).not.toHaveBeenCalled()
      })

      it.each(['image/png', 'image/jpeg', 'image/gif'])('should accept %s files', async (type) => {
        mockUploadResponse()

        const result = await uploadLogo(createMockFile({ type }), 'user-123')

        expect(result.success).toBe(true)
        expect(mockFetch).toHaveBeenCalled()
      })

      it('should reject files larger than 2MB', async () => {
        const file = createMockFile({ size: 3 * 1024 * 1024 })

        const result = await uploadLogo(file, 'user-123')

        expect(result).toEqual({ success: false, error: 'File size must be less than 2MB' })
        expect(mockFetch).not.toHaveBeenCalled()
      })

      it('should accept files exactly 2MB', async () => {
        mockUploadResponse()

        const result = await uploadLogo(createMockFile({ size: 2 * 1024 * 1024 }), 'user-123')

        expect(result.success).toBe(true)
      })
    })

    describe('File Upload', () => {
      it('should POST the file as form data to the upload API', async () => {
        const file = createMockFile()
        mockUploadResponse()

        await uploadLogo(file, 'user-123')

        expect(mockFetch).toHaveBeenCalledWith('/api/upload/logo', {
          method: 'POST',
          body: expect.any(FormData),
        })
        const body = mockFetch.mock.calls[0][1].body as FormData
        expect(body.get('file')).toBeInstanceOf(File)
        expect((body.get('file') as File).name).toBe('logo.png')
      })

      it('should return the URL from the API on success', async () => {
        const url = 'https://blob.example.com/logos/test.png'
        mockUploadResponse(url)

        const result = await uploadLogo(createMockFile(), 'user-123')

        expect(result).toEqual({ success: true, url })
      })

      it('should return an error when the API responds with a non-OK status', async () => {
        mockFetch.mockResolvedValue({ ok: false, json: jest.fn() })

        const result = await uploadLogo(createMockFile(), 'user-123')

        expect(result).toEqual({ success: false, error: 'Failed to upload file' })
      })

      it('should handle and log exceptions during upload', async () => {
        const error = new Error('Network error')
        mockFetch.mockRejectedValue(error)

        const result = await uploadLogo(createMockFile(), 'user-123')

        expect(result).toEqual({ success: false, error: 'Upload failed' })
        expect(console.error).toHaveBeenCalledWith('Upload error:', error)
      })

      it('should handle an invalid JSON response', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.reject(new SyntaxError('Unexpected token')),
        })

        const result = await uploadLogo(createMockFile(), 'user-123')

        expect(result).toEqual({ success: false, error: 'Upload failed' })
      })
    })
  })

  describe('deleteLogo', () => {
    it('should resolve true without making a network request', async () => {
      const result = await deleteLogo('https://blob.example.com/logos/test.png')

      expect(result).toBe(true)
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })
})
