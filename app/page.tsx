import { prisma } from './lib/prisma';
import { WordCard } from './components/WordCard';
import { ProgressOverview } from './components/ProgressOverview';
import { RecommendedWordsSection } from './components/RecommendedWordsSection';
import { getServerSession } from 'next-auth';
import { authOptions } from './lib/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  // Fetch today's words (SSR)
  const todayWords = await prisma.vocabulary.findMany({
    where: {
      order: {
        lte: 5, // First 5 words for today
      },
    },
    include: {
      topic: true,
      progress: {
        where: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
    take: 5,
  });

  // Fetch user progress
  const userProgress = await prisma.userProgress.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const stats = {
    streak: session.user.streakDays,
    totalWords: userProgress.length,
    mastered: userProgress.filter((p) => p.status === 'MASTERED').length,
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, {session.user.name}! 👋
      </h1>

      <ProgressOverview stats={stats} />

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">📚 Today's Words</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {todayWords.map((word) => (
            <WordCard key={word.id} word={word} />
          ))}
        </div>
      </section>

      {/* AI Recommended Words Section */}
      <RecommendedWordsSection />
    </main>
  );
}