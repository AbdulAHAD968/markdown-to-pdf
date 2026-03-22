import mongoose from 'mongoose';

const FileMetadataSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
  },
  size: {
    type: Number,
  },
  authorId: {
    type: String, 
    default: null, 
  },
  resourceType: {
    type: String,
    default: 'auto',
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
}, { timestamps: true });

export default mongoose.models.FileMetadata || mongoose.model('FileMetadata', FileMetadataSchema);
