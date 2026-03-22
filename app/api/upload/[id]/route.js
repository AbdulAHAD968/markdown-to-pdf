import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FileMetadata from '@/models/FileMetadata';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const file = await FileMetadata.findById(id);
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete from Cloudinary with correct resource type
    console.log(`Attempting to delete from Cloudinary: ${file.publicId} (${file.resourceType || 'image/fallback'})`);
    let cloudinaryResult = await cloudinary.uploader.destroy(file.publicId, {
      resource_type: file.resourceType || 'image'
    });
    
    // Fallback for legacy files that might be 'raw' instead of 'image'
    if (cloudinaryResult.result === 'not found' && !file.resourceType) {
      console.log('Not found as image, retrying as raw...');
      cloudinaryResult = await cloudinary.uploader.destroy(file.publicId, {
        resource_type: 'raw'
      });
    }
    
    console.log('Cloudinary delete result:', cloudinaryResult);
    
    // Delete from DB regardless of Cloudinary (to avoid orphaned UI entries)
    await FileMetadata.findByIdAndDelete(id);

    return NextResponse.json({ success: true, cloudinary: cloudinaryResult });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
