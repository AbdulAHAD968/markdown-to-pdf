import mongoose from 'mongoose';

const SnippetSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled Snippet',
  },
  content: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'text',
  },
  authorId: {
    type: String, // User ID from NextAuth or session
    default: null, // null for guest
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  expiresAt: {
    type: Date,
    default: null, // null means never
  },
}, { timestamps: true });

export default mongoose.models.Snippet || mongoose.model('Snippet', SnippetSchema);
