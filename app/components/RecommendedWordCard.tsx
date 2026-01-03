'use client';

import { useState } from 'react';
import { Sparkles, Volume2, Plus } from 'lucide-react';
import { RecommendedWord } from '@/app/lib/deepseek';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface RecommendedWordCardProps {
  word: RecommendedWord;
  onAddToLearning?: (word: RecommendedWord) => void;
}

export function RecommendedWordCard({ word, onAddToLearning }: RecommendedWordCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const playAudio = () => {
    // Use Web Speech API for pronunciation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      setIsPlaying(true);
      speechSynthesis.speak(utterance);
      utterance.onend = () => setIsPlaying(false);
    }
  };

  const handleAddToLearning = async () => {
    if (onAddToLearning) {
      setIsAdding(true);
      try {
        await onAddToLearning(word);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const levelVariant = word.level === 'BEGINNER' 
    ? 'default' 
    : word.level === 'INTERMEDIATE' 
    ? 'secondary' 
    : 'destructive';

  return (
    <Card className="border-2 border-dashed border-primary/30 hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50/50 to-blue-50/50 relative">
      <div className="absolute top-2 right-2">
        <Sparkles className="w-5 h-5 text-primary" />
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2">
              ✨ AI Recommended
            </Badge>
            {word.topic && (
              <CardDescription className="mb-1">
                📚 {word.topic}
              </CardDescription>
            )}
            <CardTitle className="text-2xl">{word.word}</CardTitle>
            {word.phonetic && (
              <p className="text-sm text-muted-foreground mt-1">{word.phonetic}</p>
            )}
            <Badge variant={levelVariant} className="mt-2">
              {word.level}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={playAudio}
            disabled={isPlaying}
          >
            <Volume2 className={isPlaying ? 'text-primary' : 'text-muted-foreground'} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-3">
          <p className="text-foreground font-medium">{word.meaningVi}</p>
          <p className="text-sm text-muted-foreground mt-1">{word.meaning}</p>
        </div>
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm italic text-foreground mb-1">{word.example}</p>
          {word.exampleVi && (
            <p className="text-xs text-muted-foreground">{word.exampleVi}</p>
          )}
        </div>
      </CardContent>

      {onAddToLearning && (
        <CardFooter>
          <Button
            onClick={handleAddToLearning}
            disabled={isAdding}
            className="w-full"
            variant="default"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isAdding ? 'Adding...' : 'Add to My Learning'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

