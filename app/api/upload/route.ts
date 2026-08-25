import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { type NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { isAdmin } from '@/lib/admin-auth'

function getUploadDirectory() {
  return process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(process.cwd(), 'public', 'uploads')
}

export async function POST(request: NextRequest) {
  // Only an unlocked admin may upload.
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 })
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Max file size is 8MB' }, { status: 400 })
    }

    const originalName = file.name || 'upload.png'
    const safeExt =
      originalName.includes('.')
        ? originalName.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'png'
        : 'png'
    const key = `projects-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`uploads/${key}`, fileBuffer, {
          access: 'public',
          contentType: file.type || 'application/octet-stream',
        })

        return NextResponse.json({ url: blob.url })
      } catch (blobError) {
        console.warn('[upload] Vercel Blob failed, falling back to local storage:', blobError)
      }
    }

    const uploadDir = getUploadDirectory()
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, key)
    await writeFile(filePath, fileBuffer)

    return NextResponse.json({ url: `/uploads/${key}` })
  } catch (error) {
    console.error('[upload] Save failed:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
