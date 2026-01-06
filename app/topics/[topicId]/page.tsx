import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { TopicIcon } from '@/app/components/TopicIcon';
import { WordCard } from '@/app/components/WordCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

interface TopicPageProps {
  params: {
    topicId: string;
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }
  const { topicId } = await params;

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      vocabularies: {
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
      },
      sentences: {
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      },
    },
  });

  if (!topic) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
          <Link href="/topics" className="text-primary underline">
            Back to Topics
          </Link>
        </div>
      </main>
    );
  }

  const totalWords = topic.vocabularies.length;
  const masteredWords = topic.vocabularies.filter(
    (vocab) => vocab.progress.length > 0 && vocab.progress[0].status === 'MASTERED'
  ).length;
  const learningWords = topic.vocabularies.filter(
    (vocab) => vocab.progress.length > 0 && vocab.progress[0].status === 'LEARNING'
  ).length;
  const progress = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/topics"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Topics
        </Link>
      </div>

      <section className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <TopicIcon icon={topic.icon} size={40} className="text-primary" />
                <div>
                  <CardTitle className="text-3xl">{topic.name}</CardTitle>
                  {topic.nameVi && (
                    <CardDescription className="text-lg">{topic.nameVi}</CardDescription>
                  )}
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center justify-end gap-2 text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="w-40 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
                  <span>
                    {masteredWords}/{totalWords} mastered
                  </span>
                  <span>{learningWords} learning</span>
                </div>
              </div>
            </div>
          </CardHeader>
          {topic.description && (
            <CardContent>
              <p className="text-muted-foreground">{topic.description}</p>
            </CardContent>
          )}
        </Card>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Words in this topic
          </h2>
          {totalWords > 0 && (
            <Badge variant="outline" className="text-xs">
              {totalWords} words
            </Badge>
          )}
        </div>

        {totalWords === 0 ? (
          <p className="text-muted-foreground">No words available for this topic yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topic.vocabularies.map((vocab) => (
              <WordCard
                key={vocab.id}
                word={{
                  id: vocab.id,
                  word: vocab.word,
                  meaningVi: vocab.meaningVi,
                  example: vocab.example,
                  phonetic: vocab.phonetic,
                  audioUrl: vocab.audioUrl,
                  topic: {
                    name: topic.name,
                    icon: topic.icon,
                  },
                }}
              />
            ))}
          </div>
        )}
      </section>

      {topic.sentences.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent sentences you saved for this topic</h2>
            <Link
              href="/sentences"
              className="text-sm text-primary hover:underline"
            >
              Manage all sentences
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {topic.sentences.map((sentence) => (
              <Card key={sentence.id} className="border-dashed">
                <CardContent className="pt-4">
                  <p className="font-medium mb-2">{sentence.sentence}</p>
                  {sentence.translation && (
                    <p className="text-sm text-muted-foreground">{sentence.translation}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}


