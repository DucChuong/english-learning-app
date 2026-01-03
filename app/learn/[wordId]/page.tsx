import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { ExerciseSection } from '@/app/components/ExerciseSection';
import { AudioButton } from '@/app/components/AudioButton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

interface LearnPageProps {
  params: {
    wordId: string;
  };
}

export default async function LearnPage({ params }: LearnPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const word = await prisma.vocabulary.findUnique({
    where: { id: params.wordId },
    include: {
      topic: true,
      exercises: true,
      progress: {
        where: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!word) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Word not found</h1>
          <Button asChild variant="link">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto">
        {/* Word Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardDescription className="mb-2">
                  {word.topic.icon} {word.topic.name}
                </CardDescription>
                <CardTitle className="text-4xl mb-2">{word.word}</CardTitle>
                {word.phonetic && (
                  <p className="text-lg text-muted-foreground mb-4">{word.phonetic}</p>
                )}
                <p className="text-xl mb-4">{word.meaningVi}</p>
              </div>
              {word.audioUrl && (
                <AudioButton audioUrl={word.audioUrl} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium mb-2">Example:</p>
              <p className="italic">{word.example}</p>
              {word.exampleVi && (
                <p className="text-muted-foreground mt-2">{word.exampleVi}</p>
              )}
            </div>

            {word.progress.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Progress:</span>
                  <Badge
                    variant={
                      word.progress[0].status === 'MASTERED'
                        ? 'default'
                        : word.progress[0].status === 'LEARNING'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {word.progress[0].status}
                  </Badge>
                  <span className="text-muted-foreground">
                    Correct: {word.progress[0].correctCount} | 
                    Incorrect: {word.progress[0].incorrectCount}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercises */}
        <ExerciseSection
          exercises={word.exercises}
          wordId={word.id}
          userId={session.user.id}
        />
      </div>
    </main>
  );
}

