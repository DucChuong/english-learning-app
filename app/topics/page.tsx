import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import { TopicIcon } from '@/app/components/TopicIcon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';

export default async function TopicsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const topics = await prisma.topic.findMany({
    include: {
      vocabularies: {
        include: {
          progress: {
            where: {
              userId: session.user.id,
            },
          },
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  // Calculate progress for each topic
  const topicsWithProgress = topics.map((topic) => {
    const totalWords = topic.vocabularies.length;
    const masteredWords = topic.vocabularies.filter(
      (vocab) => vocab.progress.length > 0 && vocab.progress[0].status === 'MASTERED'
    ).length;
    const learningWords = topic.vocabularies.filter(
      (vocab) => vocab.progress.length > 0 && vocab.progress[0].status === 'LEARNING'
    ).length;

    return {
      ...topic,
      totalWords,
      masteredWords,
      learningWords,
      progress: totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0,
    };
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <BookOpen className="w-8 h-8" />
        Topics
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topicsWithProgress.map((topic) => (
          <Card key={topic.id} className="hover:shadow-lg transition-shadow">
            <Link href={`/topics/${topic.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <TopicIcon icon={topic.icon} size={32} className="text-primary" />
                    <div>
                      <CardTitle className="text-xl">{topic.name}</CardTitle>
                      {topic.nameVi && (
                        <CardDescription>{topic.nameVi}</CardDescription>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {topic.description && (
                  <p className="text-muted-foreground text-sm mb-4">{topic.description}</p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{topic.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>
                      {topic.masteredWords}/{topic.totalWords} mastered
                    </span>
                    <span>{topic.learningWords} learning</span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {topicsWithProgress.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No topics available yet</p>
        </div>
      )}
    </main>
  );
}

