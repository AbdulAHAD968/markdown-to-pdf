import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FileMetadata from '@/models/FileMetadata';
import cloudinary from '@/lib/cloudinary';

export async function GET(req) {
  try {
    // Basic security check: verify if the request is from a Cron job or a secret header
    // In a real app, you would use a secret key in the headers
    
    await dbConnect();
    
    // Find files that have expired
    const expiredFiles = await FileMetadata.find({
      expiresAt: { $lt: new Date() }
    });

    const results = {
      filesFound: expiredFiles.length,
      deletedFromCloudinary: 0,
      deletedFromDB: 0,
      errors: []
    };

    for (const file of expiredFiles) {
      try {
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(file.publicId, {
          resource_type: file.resourceType || 'auto'
        });
        results.deletedFromCloudinary++;

        // Delete from MongoDB
        await FileMetadata.findByIdAndDelete(file._id);
        results.deletedFromDB++;
      } catch (err) {
        results.errors.push(`Error deleting ${file.fileName}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${results.deletedFromDB} items.`,
      details: results
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
