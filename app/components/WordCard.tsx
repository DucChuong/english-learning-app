'use client';

import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface WordCardProps {
  word: {
    id: string;
    word: string;
    meaningVi: string;
    example: string;
    phonetic: string | null;
    audioUrl: string | null;
    topic: {
      name: string;
      icon: string | null;
    };
  };
}

export function WordCard({ word }: WordCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (word.audioUrl) {
      const audio = new Audio(word.audioUrl);
      setIsPlaying(true);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardDescription className="mb-2">
              {word.topic.icon} {word.topic.name}
            </CardDescription>
            <CardTitle className="text-2xl">{word.word}</CardTitle>
            {word.phonetic && (
              <p className="text-sm text-muted-foreground mt-1">{word.phonetic}</p>
            )}
          </div>
          {word.audioUrl && (
            <Button
              variant="ghost"
              size="icon"
              onClick={playAudio}
              disabled={isPlaying}
            >
              <Volume2 className={isPlaying ? 'text-primary' : 'text-muted-foreground'} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground mb-3">{word.meaningVi}</p>
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm italic text-foreground">{word.example}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/learn/${word.id}`}>
            Learn this word →
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}