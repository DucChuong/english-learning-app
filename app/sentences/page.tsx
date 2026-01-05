import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { SentenceGenerator } from '@/app/components/SentenceGenerator';
import { PenTool } from 'lucide-react';

export default async function SentencesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Fetch all topics
  const topics = await prisma.topic.findMany({
    orderBy: {
      order: 'asc',
    },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <PenTool className="w-8 h-8" />
        Generate Sentences
      </h1>
      <p className="text-muted-foreground mb-8">
        Generate sentences with highlighted vocabulary words based on topics. 
        Click on highlighted words to learn them!
      </p>

      <SentenceGenerator topics={topics} userId={session.user.id} />
    </main>
  );
}

