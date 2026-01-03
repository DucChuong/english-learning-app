import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { ProgressOverview } from '@/app/components/ProgressOverview';
import { CheckCircle, Clock, BookOpen, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Fetch all user progress
  const userProgress = await prisma.userProgress.findMany({
    where: {
      userId: session.user.id,
    },
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

  // Calculate statistics
  const stats = {
    streak: user?.streakDays || 0,
    totalWords: userProgress.length,
    mastered: userProgress.filter((p) => p.status === 'MASTERED').length,
    learning: userProgress.filter((p) => p.status === 'LEARNING').length,
    reviewing: userProgress.filter((p) => p.status === 'REVIEWING').length,
    new: userProgress.filter((p) => p.status === 'NEW').length,
    totalPoints: user?.totalPoints || 0,
  };

  // Group by status
  const byStatus = {
    mastered: userProgress.filter((p) => p.status === 'MASTERED'),
    learning: userProgress.filter((p) => p.status === 'LEARNING'),
    reviewing: userProgress.filter((p) => p.status === 'REVIEWING'),
    new: userProgress.filter((p) => p.status === 'NEW'),
  };

  // Recent activity (last 10)
  const recentActivity = userProgress.slice(0, 10);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">📊 Your Progress</h1>

      {/* Overview Stats */}
      <div className="mb-8">
        <ProgressOverview
          stats={{
            streak: stats.streak,
            totalWords: stats.totalWords,
            mastered: stats.mastered,
          }}
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Total Points</span>
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold">{stats.totalPoints}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Learning</span>
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.learning}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Reviewing</span>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">{stats.reviewing}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">New</span>
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{stats.new}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress by Status */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Mastered Words ({byStatus.mastered.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {byStatus.mastered.length > 0 ? (
                byStatus.mastered.map((progress) => (
                  <div
                    key={progress.id}
                    className="flex items-center justify-between p-3 bg-green-500/10 dark:bg-green-500/20 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{progress.vocabulary.word}</p>
                      <p className="text-sm text-muted-foreground">
                        {progress.vocabulary.meaningVi}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-green-600 dark:text-green-400 font-semibold">
                        {progress.correctCount}✓
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No mastered words yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Learning Words ({byStatus.learning.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {byStatus.learning.length > 0 ? (
                byStatus.learning.map((progress) => (
                  <div
                    key={progress.id}
                    className="flex items-center justify-between p-3 bg-primary/10 dark:bg-primary/20 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{progress.vocabulary.word}</p>
                      <p className="text-sm text-muted-foreground">
                        {progress.vocabulary.meaningVi}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-primary">
                        {progress.correctCount}✓ / {progress.incorrectCount}✗
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No words in learning yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivity.length > 0 ? (
              recentActivity.map((progress) => (
                <div
                  key={progress.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                >
                  <div>
                    <p className="font-medium">{progress.vocabulary.word}</p>
                    <p className="text-sm text-muted-foreground">
                      {progress.vocabulary.topic.name} • Last reviewed:{' '}
                      {progress.lastReviewed
                        ? new Date(progress.lastReviewed).toLocaleDateString()
                        : 'Never'}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        progress.status === 'MASTERED'
                          ? 'default'
                          : progress.status === 'LEARNING'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {progress.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No activity yet. Start learning!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

