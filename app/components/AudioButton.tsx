'use client';

import { Volume2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';

interface AudioButtonProps {
  audioUrl: string;
}

export function AudioButton({ audioUrl }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setIsPlaying(true);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    }
  };

  return (
    <Button
      onClick={playAudio}
      disabled={isPlaying}
      variant="ghost"
      size="icon"
      className="rounded-full"
    >
      <Volume2 className="w-6 h-6 text-primary" />
    </Button>
  );
}

