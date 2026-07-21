import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let fileBuffer: Buffer | null = null;
    let folder = 'angel-tiles';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const customFolder = formData.get('folder') as string | null;

      if (customFolder) {
        folder = customFolder;
      }

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided in request' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      const { file, folder: customFolder } = body;

      if (customFolder) {
        folder = customFolder;
      }

      if (!file) {
        return NextResponse.json(
          { error: 'No file string or URL provided in body' },
          { status: 400 }
        );
      }

      const result = await uploadToCloudinary(file, { folder });
      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Unsupported Content-Type header' },
        { status: 400 }
      );
    }

    if (fileBuffer) {
      const result = await uploadToCloudinary(fileBuffer, { folder });
      return NextResponse.json({ success: true, data: result }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Failed to process image file' },
      { status: 400 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload to Cloudinary';
    console.error('Cloudinary Upload API Error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
