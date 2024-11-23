import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = 'public/uploads'

export default defineEventHandler(async (event) => {
  try {
    const files = await readMultipartFormData(event)
    if (!files) {
      throw createError({
        statusCode: 400,
        message: '파일이 없습니다.',
      })
    }

    // 업로드 디렉토리 생성
    await mkdir(UPLOAD_DIR, { recursive: true })

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const ext = file.filename?.split('.').pop() || ''
        const newFilename = `${randomUUID()}.${ext}`
        const filePath = join(UPLOAD_DIR, newFilename)
        
        await writeFile(filePath, file.data)
        
        return {
          originalName: file.filename,
          filename: newFilename,
          path: `/uploads/${newFilename}`,
          size: file.data.length,
          type: file.type
        }
      })
    )

    return {
      success: true,
      data: uploadedFiles
    }
  } catch (error) {
    console.error('Error uploading files:', error)
    throw createError({
      statusCode: 500,
      message: 'File upload failed'
    })
  }
}) 