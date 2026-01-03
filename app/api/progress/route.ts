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

    const { vocabularyId, isCorrect } = await request.json();

    if (!vocabularyId || typeof isCorrect !== 'boolean') {
      return NextResponse.json(
        { error: 'vocabularyId and isCorrect are required' },
        { status: 400 }
      );
    }

    // Find or create user progress
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_vocabularyId: {
          userId: session.user.id,
          vocabularyId,
        },
      },
    });

    let progress;
    const now = new Date();

    if (existingProgress) {
      // Update existing progress
      const newCorrectCount = existingProgress.correctCount + (isCorrect ? 1 : 0);
      const newIncorrectCount = existingProgress.incorrectCount + (isCorrect ? 0 : 1);
      
      // Determine new status based on performance
      let newStatus = existingProgress.status;
      if (newCorrectCount >= 3 && newCorrectCount > newIncorrectCount) {
        newStatus = 'MASTERED';
      } else if (newCorrectCount >= 1) {
        newStatus = 'LEARNING';
      }

      // Calculate next review (spaced repetition)
      const nextReview = new Date(now);
      if (isCorrect) {
        // If correct, review later (e.g., 1 day later)
        nextReview.setDate(nextReview.getDate() + 1);
      } else {
        // If incorrect, review sooner (e.g., 1 hour later)
        nextReview.setHours(nextReview.getHours() + 1);
      }

      progress = await prisma.userProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          correctCount: newCorrectCount,
          incorrectCount: newIncorrectCount,
          status: newStatus,
          lastReviewed: now,
          nextReview,
        },
      });
    } else {
      // Create new progress
      const nextReview = new Date(now);
      nextReview.setDate(nextReview.getDate() + 1);

      progress = await prisma.userProgress.create({
        data: {
          userId: session.user.id,
          vocabularyId,
          correctCount: isCorrect ? 1 : 0,
          incorrectCount: isCorrect ? 0 : 1,
          status: isCorrect ? 'LEARNING' : 'NEW',
          lastReviewed: now,
          nextReview,
        },
      });
    }

    // Update user streak and last study date
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastStudyDate = user.lastStudyDate
        ? new Date(user.lastStudyDate)
        : null;
      
      if (lastStudyDate) {
        lastStudyDate.setHours(0, 0, 0, 0);
      }

      let newStreak = user.streakDays;
      if (!lastStudyDate || lastStudyDate.getTime() < today.getTime() - 86400000) {
        // If last study was yesterday or earlier, increment streak
        if (lastStudyDate && lastStudyDate.getTime() === today.getTime() - 86400000) {
          newStreak += 1;
        } else if (!lastStudyDate) {
          newStreak = 1;
        } else {
          newStreak = 1; // Reset streak if gap > 1 day
        }
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          streakDays: newStreak,
          lastStudyDate: now,
          totalPoints: user.totalPoints + (isCorrect ? 10 : 5),
        },
      });
    }

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
    const status = searchParams.get('status');

    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    const progress = await prisma.userProgress.findMany({
      where,
      include: {
        vocabulary: {
          include: {
            topic: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

