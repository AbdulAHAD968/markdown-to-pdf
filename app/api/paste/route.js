import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Snippet from '@/models/Snippet';

export async function POST(req) {
  try {
    const session = await auth();
    const { title, content, language, visibility } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    await dbConnect();
    const expiresAt = !session?.user?.id ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

    const snippet = await Snippet.create({
      title: title || 'Untitled Snippet',
      content,
      language: language || 'text',
      authorId: session?.user?.id || null,
      visibility: visibility || 'public',
      expiresAt: expiresAt,
    });


    return NextResponse.json(snippet);
  } catch (error) {
    console.error('Paste error:', error);
    return NextResponse.json({ error: 'Failed to create snippet' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await auth();
    await dbConnect();

    const query = {
      $or: [
        { visibility: 'public' }
      ],
      $and: [
        { $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] }
      ]
    };


    if (session?.user?.id) {
      query.$or.push({ authorId: session.user.id });
    }

    const snippets = await Snippet.find(query).sort({ createdAt: -1 });
    return NextResponse.json(snippets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch snippets' }, { status: 500 });
  }
}
