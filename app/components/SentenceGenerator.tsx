'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle, BookOpen } from 'lucide-react';
import { SentenceDisplay } from './SentenceDisplay';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface Topic {
  id: string;
  name: string;
  nameVi: string | null;
  icon: string | null;
}

interface SentenceGeneratorProps {
  topics: Topic[];
  userId: string;
}

export function SentenceGenerator({ topics, userId }: SentenceGeneratorProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [isStoryMode, setIsStoryMode] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ieltsLevel, setIeltsLevel] = useState<number | null>(null);

  // Fetch user's IELTS level on mount
  useEffect(() => {
    fetch('/api/user/level')
      .then((res) => res.json())
      .then((data) => setIeltsLevel(data.ieltsLevel))
      .catch(() => {});
  }, []);
  const [sentenceData, setSentenceData] = useState<{
    sentence: string;
    translation: string;
    highlightedWords: Array<{
      word: string;
      meaning: string;
      meaningVi: string;
      vocabularyId: string | null;
      startIndex: number;
      endIndex: number;
    }>;
    topicId: string;
    topicName: string;
    isStory?: boolean;
  } | null>(null);

  const generateSentence = async () => {
    if (!selectedTopicId) {
      setError('Please select a topic first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sentences/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topicId: selectedTopicId,
          isStory: isStoryMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate sentence');
      }

      setSentenceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate sentence');
      console.error('Error generating sentence:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSentence = async (wordIds: string[]) => {
    if (!sentenceData) return;

    try {
      const response = await fetch('/api/sentences/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence: sentenceData.sentence,
          translation: sentenceData.translation,
          topicId: sentenceData.topicId,
          highlightedWordIds: wordIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save sentence');
      }

      // Show success message
      alert('Sentence saved successfully!');
    } catch (error) {
      console.error('Error saving sentence:', error);
      alert('Failed to save sentence');
    }
  };

  const handleAddWords = async (wordIds: string[]) => {
    try {
      const response = await fetch('/api/sentences/add-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordIds }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add words');
      }

      alert(`Added ${wordIds.length} word(s) to your learning list!`);
    } catch (error) {
      console.error('Error adding words:', error);
      alert('Failed to add words to learning list');
    }
  };

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  return (
    <div className="space-y-6">
      {/* Topic Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Topic</CardTitle>
          <CardDescription>
            Choose a topic to generate {isStoryMode ? 'story-like sentences' : 'sentences'} with relevant vocabulary words
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a topic..." />
            </SelectTrigger>
            <SelectContent>
              {topics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  <div className="flex items-center gap-2">
                    <span>{topic.icon || '📖'}</span>
                    <span>{topic.name}</span>
                    {topic.nameVi && (
                      <span className="text-muted-foreground">({topic.nameVi})</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* IELTS Level Display */}
          {ieltsLevel && (
            <div className="p-3 border rounded-lg bg-primary/5 border-primary/20">
              <p className="text-sm font-medium text-primary">
                📊 Your IELTS Level: {ieltsLevel}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Content will be generated appropriate for your level
              </p>
            </div>
          )}

          {/* Story Mode Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex-1">
              <Label htmlFor="story-mode" className="text-base font-medium cursor-pointer">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span>Story Mode</span>
                </div>
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {isStoryMode 
                  ? 'Generate longer story-like sentences (>100 words) with mini narratives'
                  : 'Generate short sentences (10-20 words) for quick learning'}
              </p>
            </div>
            <Switch
              id="story-mode"
              checked={isStoryMode}
              onCheckedChange={setIsStoryMode}
            />
          </div>

          <Button
            onClick={generateSentence}
            disabled={loading || !selectedTopicId}
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate {isStoryMode ? 'Story' : 'Sentence'}
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Generated Sentence */}
      {sentenceData && (
        <SentenceDisplay
          sentence={sentenceData.sentence}
          translation={sentenceData.translation}
          highlightedWords={sentenceData.highlightedWords}
          topicName={sentenceData.topicName}
          isStory={sentenceData.isStory ?? isStoryMode}
          onSave={handleSaveSentence}
          onAddWords={handleAddWords}
        />
      )}

      {/* Instructions */}
      {!sentenceData && (
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Select a topic from the dropdown above</li>
              <li>Toggle "Story Mode" to generate longer story-like sentences or short sentences</li>
              <li>Click "Generate {isStoryMode ? 'Story' : 'Sentence'}" to create content with highlighted vocabulary words</li>
              <li>Click on highlighted words to see their meanings and select them</li>
              <li>Add selected words to your learning list or save the entire {isStoryMode ? 'story' : 'sentence'}</li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

