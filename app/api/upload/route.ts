import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { type NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'

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
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')

    await mkdir(uploadDir, { recursive: true })

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(uploadDir, key)
    await writeFile(filePath, fileBuffer)

    return NextResponse.json({ url: `/uploads/${key}` })
  } catch (error) {
    console.error('[upload] Save failed:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
