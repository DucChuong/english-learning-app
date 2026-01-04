import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    return NextResponse.json(
      { ieltsLevel: user?.ieltsLevel || null },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get level error:', error);
    return NextResponse.json(
      { error: 'Failed to get IELTS level' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { ieltsLevel } = await request.json();

    if (ieltsLevel !== null && (typeof ieltsLevel !== 'number' || ieltsLevel < 0 || ieltsLevel > 9)) {
      return NextResponse.json(
        { error: 'IELTS level must be a number between 0 and 9' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { ieltsLevel: ieltsLevel || null },
    });

    return NextResponse.json(
      { ieltsLevel: user.ieltsLevel },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update level error:', error);
    return NextResponse.json(
      { error: 'Failed to update IELTS level' },
      { status: 500 }
    );
  }
}

