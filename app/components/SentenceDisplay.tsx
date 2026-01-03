'use client';

import { useState } from 'react';
import { BookOpen, Save, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';

interface HighlightedWord {
  word: string;
  meaning: string;
  meaningVi: string;
  vocabularyId: string | null;
  startIndex: number;
  endIndex: number;
}

interface SentenceDisplayProps {
  sentence: string;
  translation: string;
  highlightedWords: HighlightedWord[];
  topicName: string;
  isStory?: boolean;
  onSave?: (wordIds: string[]) => void;
  onAddWords?: (wordIds: string[]) => void;
}

export function SentenceDisplay({
  sentence,
  translation,
  highlightedWords,
  topicName,
  isStory = false,
  onSave,
  onAddWords,
}: SentenceDisplayProps) {
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sort highlighted words by position in sentence
  const sortedWords = [...highlightedWords].sort(
    (a, b) => a.startIndex - b.startIndex
  );

  // Build sentence with highlighted parts
  const renderSentence = () => {
    if (sortedWords.length === 0) {
      return [{ text: sentence, isHighlighted: false, wordId: null }];
    }

    const parts: Array<{ text: string; isHighlighted: boolean; wordId: string | null }> = [];
    let lastIndex = 0;

    sortedWords.forEach((word) => {
      // Add text before highlighted word
      if (word.startIndex > lastIndex) {
        parts.push({
          text: sentence.slice(lastIndex, word.startIndex),
          isHighlighted: false,
          wordId: null,
        });
      }

      // Add highlighted word
      parts.push({
        text: sentence.slice(word.startIndex, word.endIndex),
        isHighlighted: true,
        wordId: word.vocabularyId,
      });

      lastIndex = word.endIndex;
    });

    // Add remaining text
    if (lastIndex < sentence.length) {
      parts.push({
        text: sentence.slice(lastIndex),
        isHighlighted: false,
        wordId: null,
      });
    }

    return parts;
  };

  const toggleWordSelection = (wordId: string | null) => {
    if (!wordId) return;

    setSelectedWords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId);
      } else {
        newSet.add(wordId);
      }
      return newSet;
    });
  };

  const handleAddWords = async () => {
    if (selectedWords.size === 0 || !onAddWords) return;

    setIsAdding(true);
    try {
      await onAddWords(Array.from(selectedWords));
      setSelectedWords(new Set());
    } catch (error) {
      console.error('Failed to add words:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(Array.from(selectedWords));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save sentence:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const parts = renderSentence();
  const hasSelectedWords = selectedWords.size > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              {isStory ? '📖 Generated Story' : 'Generated Sentence'}
            </CardTitle>
            <CardDescription className="mt-1">
              Topic: {topicName} • {isStory ? 'Story Mode' : 'Short Sentence'}
            </CardDescription>
          </div>
          {onSave && (
            <Button
              onClick={handleSave}
              disabled={isSaving || saved}
              variant={saved ? 'secondary' : 'outline'}
              size="sm"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Sentence'}
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sentence with highlighted words */}
        <div className="p-6 bg-muted rounded-lg">
          <p className="text-lg leading-relaxed whitespace-pre-wrap break-words">
            {parts.map((part, index) => {
              if (!part.isHighlighted) {
                return <span key={index}>{part.text}</span>;
              }

              const word = sortedWords.find((w) => w.vocabularyId === part.wordId);
              const isSelected = part.wordId && selectedWords.has(part.wordId);

              return (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => part.wordId && toggleWordSelection(part.wordId)}
                      className={`
                        relative inline-block mx-1 px-2 py-1 rounded
                        transition-all cursor-pointer
                        ${
                          isSelected
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'bg-primary/20 text-primary hover:bg-primary/30 font-medium'
                        }
                        underline decoration-2 underline-offset-2
                      `}
                    >
                      {part.text}
                      {isSelected && (
                        <span className="absolute -top-1 -right-1">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  </DialogTrigger>
                  {word && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{word.word}</DialogTitle>
                        <DialogDescription>
                          <div className="mt-4 space-y-2">
                            <p>
                              <strong>Meaning:</strong> {word.meaning}
                            </p>
                            <p>
                              <strong>Nghĩa:</strong> {word.meaningVi}
                            </p>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => {
                            if (word.vocabularyId) {
                              toggleWordSelection(word.vocabularyId);
                            }
                          }}
                          variant={isSelected ? 'secondary' : 'default'}
                          className="flex-1"
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Selected
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Select to Learn
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              );
            })}
          </p>
        </div>

        {/* Translation */}
        {translation && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Translation:</p>
            <p className="text-foreground">{translation}</p>
          </div>
        )}

        {/* Selected words summary */}
        {hasSelectedWords && (
          <div className="p-4 border rounded-lg bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">
                {selectedWords.size} word(s) selected
              </p>
              {onAddWords && (
                <Button
                  onClick={handleAddWords}
                  disabled={isAdding}
                  size="sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {isAdding ? 'Adding...' : 'Add to Learning List'}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedWords).map((wordId) => {
                const word = sortedWords.find((w) => w.vocabularyId === wordId);
                return word ? (
                  <Badge key={wordId} variant="secondary">
                    {word.word}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

