import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Snippet from '@/models/Snippet';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const snippet = await Snippet.findById(id);
    
    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }

    
    
    
    return NextResponse.json(snippet);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch snippet' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    
    await dbConnect();
    await Snippet.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
