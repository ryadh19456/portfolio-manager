import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'
import { type NextRequest, NextResponse } from 'next/server'

function getUploadDirectory() {
  return process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(process.cwd(), 'public', 'uploads')
}

function getMimeType(filename: string) {
  const extension = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }

  return mimeTypes[extension] || 'application/octet-stream'
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params
  const safeName = path.basename(filename)

  if (!safeName || safeName !== filename) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 })
  }

  const uploadDir = getUploadDirectory()
  const filePath = path.join(uploadDir, safeName)

  if (!existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const fileBuffer = await readFile(filePath)

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': getMimeType(safeName),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
