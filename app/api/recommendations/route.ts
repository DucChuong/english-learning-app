import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { getRecommendedWords, RecommendedWord } from '@/app/lib/deepseek';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get today's date string (YYYY-MM-DD)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Check if we have recommendations for today
    let dailyRec = await prisma.dailyRecommendations.findUnique({
      where: {
        date: todayString,
      },
    });

    // If we have today's recommendations, return them
    if (dailyRec) {
      const recommendations = dailyRec.recommendations as unknown as RecommendedWord[];
      return NextResponse.json({ recommendations }, { status: 200 });
    }

    // If no recommendations for today, generate new ones
    // Check if we have OpenRouter API key
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { 
          error: 'OpenRouter API key not configured',
          recommendations: null 
        },
        { status: 200 } // Return 200 but with error message
      );
    }

    // Generate recommendations (using average stats for general recommendations)
    // We'll use general stats since these are shared across all users
    const allUsersProgress = await prisma.userProgress.findMany({
      include: {
        vocabulary: true,
      },
    });

    // Get all users to calculate average IELTS level
    const allUsers = await prisma.user.findMany({
      select: { ieltsLevel: true },
    });

    const uniqueUserCount = new Set(allUsersProgress.map((p) => p.userId)).size;
    
    // Calculate average stats, or use defaults if no users
    const avgStats = uniqueUserCount > 0
      ? {
          mastered: Math.round(
            allUsersProgress.filter((p) => p.status === 'MASTERED').length / uniqueUserCount
          ),
          learning: Math.round(
            allUsersProgress.filter((p) => p.status === 'LEARNING').length / uniqueUserCount
          ),
          totalWords: Math.round(allUsersProgress.length / uniqueUserCount),
        }
      : {
          mastered: 0,
          learning: 0,
          totalWords: 0,
        };

    // Calculate average IELTS level
    const usersWithLevel = allUsers.filter((u) => u.ieltsLevel !== null);
    const avgIeltsLevel = usersWithLevel.length > 0
      ? usersWithLevel.reduce((sum, u) => sum + (u.ieltsLevel || 0), 0) / usersWithLevel.length
      : 6.0; // Default to 6.0 if no users have level set

    // Get common learned words to avoid (limit to most common ones)
    const allLearnedWords = Array.from(
      new Set(allUsersProgress.map((p) => p.vocabulary.word))
    ).slice(0, 50); // Limit to avoid too long context

    // Generate new recommendations with average IELTS level
    const recommendations = await getRecommendedWords(
      avgStats,
      allLearnedWords,
      Math.round(avgIeltsLevel * 10) / 10 // Round to 1 decimal place
    );

    // Save to database for today
    await prisma.dailyRecommendations.upsert({
      where: {
        date: todayString,
      },
      create: {
        date: todayString,
        recommendations: recommendations as any,
      },
      update: {
        recommendations: recommendations as any,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ recommendations }, { status: 200 });
  } catch (error) {
    console.error('Recommendation error:', error);
    
    // Return error but don't fail the request
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to get recommendations',
        recommendations: null 
      },
      { status: 200 }
    );
  }
}

