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
    type: String, 
    default: null, 
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  expiresAt: {
    type: Date,
    index: { expires: 0 },
    default: null, 
  },
}, { timestamps: true });


export default mongoose.models.Snippet || mongoose.model('Snippet', SnippetSchema);
