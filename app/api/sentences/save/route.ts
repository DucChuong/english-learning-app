import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sentence, translation, topicId, highlightedWordIds } = await request.json();

    if (!sentence || !topicId) {
      return NextResponse.json(
        { error: 'Sentence and topicId are required' },
        { status: 400 }
      );
    }

    // Save the sentence
    const savedSentence = await prisma.savedSentence.create({
      data: {
        sentence,
        translation: translation || null,
        topicId,
        userId: session.user.id,
        highlightedWords: highlightedWordIds || [],
      },
    });

    return NextResponse.json(
      { sentence: savedSentence },
      { status: 201 }
    );
  } catch (error) {
    console.error('Save sentence error:', error);
    return NextResponse.json(
      { error: 'Failed to save sentence' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');

    const where: any = {
      userId: session.user.id,
    };

    if (topicId) {
      where.topicId = topicId;
    }

    const sentences = await prisma.savedSentence.findMany({
      where,
      include: {
        topic: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ sentences }, { status: 200 });
  } catch (error) {
    console.error('Fetch sentences error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sentences' },
      { status: 500 }
    );
  }
}

