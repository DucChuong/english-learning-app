import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { generateSentenceWithWords } from '@/app/lib/deepseek';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { topicId, isStory = true } = await request.json();

    if (!topicId) {
      return NextResponse.json(
        { error: 'Topic ID is required' },
        { status: 400 }
      );
    }

    // Fetch topic and its vocabulary
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        vocabularies: {
          take: 20, // Limit to 20 words for context
        },
      },
    });

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Check if we have OpenRouter API key
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Get topic words for context
    const topicWords = topic.vocabularies.map((v) => v.word);

    // Generate sentence (default to story mode for longer sentences)
    const generatedSentence = await generateSentenceWithWords(
      topic.name,
      topicWords,
      isStory
    );

    // Match highlighted words with vocabulary in database
    const matchedWords = await Promise.all(
      generatedSentence.highlightedWords.map(async (word) => {
        const vocabulary = await prisma.vocabulary.findFirst({
          where: {
            word: {
              equals: word.word,
              mode: 'insensitive',
            },
            topicId: topic.id,
          },
        });

        return {
          ...word,
          vocabularyId: vocabulary?.id || null,
        };
      })
    );

    return NextResponse.json({
      sentence: generatedSentence.sentence,
      translation: generatedSentence.translation,
      highlightedWords: matchedWords,
      topicId: topic.id,
      topicName: topic.name,
      isStory: isStory,
    });
  } catch (error) {
    console.error('Sentence generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate sentence',
      },
      { status: 500 }
    );
  }
}

