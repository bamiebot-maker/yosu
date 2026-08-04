import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No media file provided' }, { status: 400 });
    }

    // Security Validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, WEBP, GIF, and PDF files are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit of 10MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Perform Cloudinary Upload
    const cloudinaryResult = await uploadToCloudinary(buffer, file.name);

    // Save file locally as secondary fallback if running locally
    if (cloudinaryResult.secure_url.startsWith('/uploads/')) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });
      const safeName = cloudinaryResult.secure_url.replace('/uploads/', '');
      await writeFile(path.join(uploadsDir, safeName), buffer);
    }

    // Store Metadata in Neon PostgreSQL
    const media = await db.media.create({
      data: {
        filename: file.name,
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        mimeType: file.type || 'image/jpeg',
        sizeBytes: cloudinaryResult.bytes,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
      },
    });

    return NextResponse.json({
      success: true,
      url: cloudinaryResult.secure_url,
      secure_url: cloudinaryResult.secure_url,
      public_id: cloudinaryResult.public_id,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      format: cloudinaryResult.format,
      mediaId: media.id,
    });
  } catch (error: any) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload media file' },
      { status: 500 }
    );
  }
}
