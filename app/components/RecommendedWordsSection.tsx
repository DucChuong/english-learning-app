'use client';

import { useState, useEffect } from 'react';
import { RecommendedWordCard } from './RecommendedWordCard';
import { RecommendedWord } from '@/app/lib/deepseek';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';

export function RecommendedWordsSection() {
  const [recommendations, setRecommendations] = useState<RecommendedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/recommendations');
      const data = await response.json();
      
      if (data.error && !data.recommendations) {
        setError(data.error);
      } else if (data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        setError('No recommendations available');
      }
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleAddToLearning = async (word: RecommendedWord) => {
    try {
      // Save the recommended word to database
      const response = await fetch('/api/recommendations/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(word),
      });

      if (!response.ok) {
        throw new Error('Failed to add word');
      }

      // Remove the word from recommendations after adding
      setRecommendations(prev => prev.filter(w => w.word !== word.word));
    } catch (err) {
      console.error('Error adding word:', err);
      alert('Failed to add word to learning. Please try again.');
    }
  };

  if (loading) {
    return (
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Recommended Words
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading recommendations...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Recommended Words
          </h2>
          <Button
            onClick={fetchRecommendations}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load recommendations</AlertTitle>
          <AlertDescription>
            {error}
            {error.includes('API key') && (
              <span className="block mt-2 text-xs">
                Please configure OPENROUTER_API_KEY in your environment variables.
              </span>
            )}
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Recommended Words
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Daily recommendations shared across all users
          </p>
        </div>
        <Button
          onClick={fetchRecommendations}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <p className="text-muted-foreground mb-4">
        Today's curated word recommendations to help you expand your vocabulary:
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((word, index) => (
          <RecommendedWordCard
            key={`${word.word}-${index}`}
            word={word}
            onAddToLearning={handleAddToLearning}
          />
        ))}
      </div>
    </section>
  );
}

