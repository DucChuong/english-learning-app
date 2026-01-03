import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { RecommendedWord } from '@/app/lib/deepseek';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const wordData: RecommendedWord = await request.json();

    // Check if word already exists
    const existingWord = await prisma.vocabulary.findUnique({
      where: { word: wordData.word },
    });

    let vocabulary;

    if (existingWord) {
      vocabulary = existingWord;
    } else {
      // Find or create topic
      let topic = await prisma.topic.findFirst({
        where: { name: wordData.topic || 'General' },
      });

      if (!topic) {
        topic = await prisma.topic.create({
          data: {
            name: wordData.topic || 'General',
            nameVi: wordData.topic || 'Chung',
            order: 999, // Place at the end
          },
        });
      }

      // Get the next order number
      const maxOrder = await prisma.vocabulary.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });

      // Create new vocabulary entry
      vocabulary = await prisma.vocabulary.create({
        data: {
          word: wordData.word,
          meaning: wordData.meaning,
          meaningVi: wordData.meaningVi,
          example: wordData.example,
          exampleVi: wordData.exampleVi,
          phonetic: wordData.phonetic || null,
          level: wordData.level,
          topicId: topic.id,
          order: (maxOrder?.order || 0) + 1,
        },
      });
    }

    // Check if user already has progress for this word
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_vocabularyId: {
          userId: session.user.id,
          vocabularyId: vocabulary.id,
        },
      },
    });

    if (!existingProgress) {
      // Create initial progress entry
      await prisma.userProgress.create({
        data: {
          userId: session.user.id,
          vocabularyId: vocabulary.id,
          status: 'NEW',
        },
      });
    }

    return NextResponse.json(
      { 
        message: 'Word added to learning',
        vocabularyId: vocabulary.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Add word error:', error);
    return NextResponse.json(
      { error: 'Failed to add word to learning' },
      { status: 500 }
    );
  }
}

