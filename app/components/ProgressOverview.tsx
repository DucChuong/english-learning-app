'use client';

import { Trophy, Flame, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface ProgressOverviewProps {
  stats: {
    streak: number;
    totalWords: number;
    mastered: number;
  };
}

export function ProgressOverview({ stats }: ProgressOverviewProps) {
  const masteryPercentage = stats.totalWords > 0 
    ? Math.round((stats.mastered / stats.totalWords) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Streak Card */}
      <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Daily Streak</p>
              <p className="text-4xl font-bold mt-1">{stats.streak}</p>
              <p className="text-sm mt-1">days</p>
            </div>
            <Flame className="w-12 h-12 opacity-80" />
          </div>
        </CardContent>
      </Card>

      {/* Total Words Card */}
      <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Words</p>
              <p className="text-4xl font-bold mt-1">{stats.totalWords}</p>
              <p className="text-sm mt-1">learned</p>
            </div>
            <BookOpen className="w-12 h-12 opacity-80" />
          </div>
        </CardContent>
      </Card>

      {/* Mastered Card */}
      <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Mastered</p>
              <p className="text-4xl font-bold mt-1">{stats.mastered}</p>
              <p className="text-sm mt-1">{masteryPercentage}% complete</p>
            </div>
            <Trophy className="w-12 h-12 opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}