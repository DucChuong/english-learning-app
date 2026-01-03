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

    const { wordIds } = await request.json();

    if (!wordIds || !Array.isArray(wordIds) || wordIds.length === 0) {
      return NextResponse.json(
        { error: 'wordIds array is required' },
        { status: 400 }
      );
    }

    // Add words to user's learning list
    const results = await Promise.all(
      wordIds.map(async (wordId: string) => {
        // Check if word exists
        const vocabulary = await prisma.vocabulary.findUnique({
          where: { id: wordId },
        });

        if (!vocabulary) {
          return { wordId, success: false, error: 'Word not found' };
        }

        // Check if user already has progress for this word
        const existingProgress = await prisma.userProgress.findUnique({
          where: {
            userId_vocabularyId: {
              userId: session.user.id,
              vocabularyId: wordId,
            },
          },
        });

        if (existingProgress) {
          return { wordId, success: true, message: 'Already in learning list' };
        }

        // Create new progress entry
        await prisma.userProgress.create({
          data: {
            userId: session.user.id,
            vocabularyId: wordId,
            status: 'NEW',
          },
        });

        return { wordId, success: true };
      })
    );

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      message: `Added ${successCount} word(s) to learning list`,
      results,
    });
  } catch (error) {
    console.error('Add words error:', error);
    return NextResponse.json(
      { error: 'Failed to add words to learning list' },
      { status: 500 }
    );
  }
}

