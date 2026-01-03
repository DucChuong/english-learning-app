'use client';

import { useState } from 'react';
import { Check, X, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { cn } from '@/app/lib/utils';

interface Exercise {
  id: string;
  type: string;
  question: string;
  questionVi: string | null;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
}

interface ExerciseSectionProps {
  exercises: Exercise[];
  wordId: string;
  userId: string;
}

export function ExerciseSection({ exercises, wordId, userId }: ExerciseSectionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const currentExercise = exercises[currentExerciseIndex];
  const isCorrect = selectedAnswer === currentExercise.correctAnswer;

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    
    setShowResult(true);
    const correct = selectedAnswer === currentExercise.correctAnswer;
    
    // Update score
    setScore(prev => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));

    // Send to API to update progress
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vocabularyId: wordId,
          isCorrect: correct,
        }),
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  if (exercises.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Practice Exercises</h2>
        <div className="text-sm text-muted-foreground">
          Question {currentExerciseIndex + 1} of {exercises.length}
          {score.total > 0 && (
            <span className="ml-3 font-semibold text-primary">
              Score: {score.correct}/{score.total}
            </span>
          )}
        </div>
      </div>

      {/* Exercise Card */}
      <Card>
        <CardContent className="p-6">
          {/* Question */}
          <div className="mb-6">
            <p className="text-lg font-medium mb-2">{currentExercise.question}</p>
            {currentExercise.questionVi && (
              <p className="text-sm text-muted-foreground">{currentExercise.questionVi}</p>
            )}
          </div>

          {/* Multiple Choice Options */}
          {currentExercise.type === 'MULTIPLE_CHOICE' && (
            <div className="space-y-3 mb-6">
              {currentExercise.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === currentExercise.correctAnswer;
                
                return (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                    variant="outline"
                    className={cn(
                      'w-full justify-start h-auto p-4 text-left',
                      showResult && isCorrectAnswer && 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400',
                      showResult && isSelected && !isCorrectAnswer && 'border-destructive bg-destructive/10 text-destructive',
                      showResult && !isCorrectAnswer && !isSelected && 'opacity-50',
                      !showResult && isSelected && 'border-primary bg-primary/10'
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{option}</span>
                      {showResult && isCorrectAnswer && (
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                      {showResult && isSelected && !isCorrectAnswer && (
                        <X className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          )}

          {/* Fill in the Blank */}
          {currentExercise.type === 'FILL_BLANK' && (
            <div className="mb-6">
              <Input
                type="text"
                value={selectedAnswer || ''}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showResult}
                placeholder="Type your answer..."
              />
            </div>
          )}

          {/* Result Message */}
          {showResult && (
            <Alert variant={isCorrect ? 'default' : 'destructive'} className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold">Correct! 🎉</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    <span className="font-semibold">Not quite right</span>
                  </>
                )}
              </div>
              {currentExercise.explanation && (
                <AlertDescription>{currentExercise.explanation}</AlertDescription>
              )}
              {!isCorrect && (
                <AlertDescription className="mt-2">
                  Correct answer: <strong>{currentExercise.correctAnswer}</strong>
                </AlertDescription>
              )}
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="flex-1"
              >
                Submit Answer
              </Button>
            ) : (
              <>
                {currentExerciseIndex < exercises.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Next Question
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <div className="flex-1">
                    <Alert className="text-center">
                      <AlertDescription>
                        <p className="font-semibold mb-2">
                          🎉 Exercise Complete!
                        </p>
                        <p className="text-sm mb-3">
                          You scored {score.correct} out of {score.total}
                        </p>
                        <Button
                          onClick={() => window.location.href = '/'}
                        >
                          Back to Home
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentExerciseIndex + (showResult ? 1 : 0)) / exercises.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}