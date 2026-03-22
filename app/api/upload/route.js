import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import FileMetadata from '@/models/FileMetadata';
import cloudinary from '@/lib/cloudinary';

export async function POST(req) {
  try {
    const session = await auth();
    const formData = await req.formData();
    const file = formData.get('file');
    const visibility = formData.get('visibility') || 'public';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 200MB Limit: 200 * 1024 * 1024 = 209,715,200
    const MAX_SIZE = 209715200;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'FILE SIZE EXCEEDS 200MB LIMIT' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        resource_type: 'auto',
        folder: 'warp-box',
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(buffer);
    });

    await dbConnect();
    const metadata = await FileMetadata.create({
      fileName: file.name,
      fileUrl: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      resourceType: uploadResponse.resource_type, // Crucial for deletion
      fileType: file.type,
      size: file.size,
      authorId: session?.user?.id || null,
      visibility: visibility,
    });

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await auth();
    await dbConnect();
    
    // Find files that are public OR belong to the current user
    const query = {
      $or: [
        { visibility: 'public' }
      ]
    };

    if (session?.user?.id) {
      query.$or.push({ authorId: session.user.id });
    }

    const files = await FileMetadata.find(query).sort({ createdAt: -1 });
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
