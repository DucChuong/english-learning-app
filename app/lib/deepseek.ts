import { OpenRouter } from '@openrouter/sdk';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface RecommendedWord {
  word: string;
  meaning: string;
  meaningVi: string;
  example: string;
  exampleVi: string;
  phonetic?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  topic?: string;
}

/**
 * Call OpenRouter API to get word recommendations
 */
export async function getRecommendedWords(
  userProgress: {
    mastered: number;
    learning: number;
    totalWords: number;
  },
  learnedWords: string[] = [],
  ieltsLevel?: number
): Promise<RecommendedWord[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const levelDescription = ieltsLevel 
    ? `The user's IELTS level is ${ieltsLevel}. Recommend words appropriate for IELTS ${ieltsLevel} level.`
    : 'Recommend words appropriate for intermediate level learners.';

  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: `You are an English vocabulary learning assistant. Recommend 5 new English words for a learner based on their progress and IELTS level.
      
User's current progress:
- Total words learned: ${userProgress.totalWords}
- Words mastered: ${userProgress.mastered}
- Words currently learning: ${userProgress.learning}
${levelDescription}

Already learned words (avoid these): ${learnedWords.join(', ') || 'none'}

For each recommended word, provide:
1. The English word
2. Meaning in English
3. Meaning in Vietnamese (meaningVi)
4. An example sentence in English
5. Example sentence translation in Vietnamese (exampleVi)
6. Phonetic pronunciation (IPA format, optional)
7. Difficulty level (BEGINNER, INTERMEDIATE, or ADVANCED) - should match the IELTS level
8. Suggested topic category (e.g., "Daily Life", "Business", "Technology", etc.)

${ieltsLevel ? `Word difficulty mapping:
- IELTS 4.0-5.0: Use BEGINNER level words
- IELTS 5.5-6.5: Use INTERMEDIATE level words  
- IELTS 7.0-8.0: Use ADVANCED level words
- IELTS 8.5+: Use ADVANCED level words with academic vocabulary` : ''}

Return ONLY a valid JSON array with this exact structure:
[
  {
    "word": "example",
    "meaning": "a thing characteristic of its kind",
    "meaningVi": "ví dụ",
    "example": "This is a good example of modern architecture.",
    "exampleVi": "Đây là một ví dụ tốt về kiến trúc hiện đại.",
    "phonetic": "/ɪɡˈzæmpəl/",
    "level": "INTERMEDIATE",
    "topic": "General"
  }
]

Make sure the words are appropriate for the user's IELTS level and will help them progress.`,
    },
    {
      role: 'user',
      content: `Please recommend 5 new English words for today's learning session. Consider my current progress and suggest words that will help me advance.`,
    },
  ];

  try {
    const openrouter = new OpenRouter({
      apiKey: apiKey,
    });

    const completion = await openrouter.chat.send({
      model: 'deepseek/deepseek-chat',
      messages: messages as any,
      temperature: 0.7,
      maxTokens: 2000,
      stream: false,
    });

    const messageContent = completion.choices[0]?.message?.content;
    
    // Handle content that might be string or array
    let content: string;
    if (typeof messageContent === 'string') {
      content = messageContent;
    } else if (Array.isArray(messageContent)) {
      // Extract text from content array
      content = messageContent
        .filter((item: any) => item.type === 'text')
        .map((item: any) => item.text)
        .join('');
    } else {
      throw new Error('No content received from OpenRouter API');
    }

    if (!content) {
      throw new Error('No content received from OpenRouter API');
    }

    // Extract JSON from the response (handle cases where AI adds extra text)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from OpenRouter response');
    }

    const recommendedWords: RecommendedWord[] = JSON.parse(jsonMatch[0]);
    return recommendedWords;
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

/**
 * Get a single word recommendation for today
 */
export async function getTodayWordRecommendation(
  userProgress: {
    mastered: number;
    learning: number;
    totalWords: number;
  },
  learnedWords: string[] = []
): Promise<RecommendedWord | null> {
  try {
    const words = await getRecommendedWords(userProgress, learnedWords);
    return words[0] || null;
  } catch (error) {
    console.error('Failed to get word recommendation:', error);
    return null;
  }
}

export interface GeneratedSentence {
  sentence: string;
  translation: string;
  highlightedWords: Array<{
    word: string;
    meaning: string;
    meaningVi: string;
    startIndex: number;
    endIndex: number;
  }>;
}

/**
 * Generate a sentence with highlighted words from a specific topic
 */
export async function generateSentenceWithWords(
  topicName: string,
  topicWords: string[] = [],
  isStory: boolean = true,
  ieltsLevel?: number
): Promise<GeneratedSentence> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const sentenceType = isStory 
    ? 'a longer story-like sentence or short paragraph (>100 words) that tells a mini story or narrative'
    : 'a natural English sentence (10-20 words)';

  const levelDescription = ieltsLevel
    ? `The user's IELTS level is ${ieltsLevel}. Generate content appropriate for IELTS ${ieltsLevel} level. Use vocabulary and sentence structures that match this level.`
    : 'Generate content appropriate for intermediate level learners (IELTS 5.5-6.5).';

  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: `You are an English learning assistant. Generate ${sentenceType} related to the topic "${topicName}".

${levelDescription}

The ${isStory ? 'story/sentence' : 'sentence'} should:
1. Be natural and engaging${isStory ? ', like a mini story or narrative' : ''}
2. Include 4-8 vocabulary words from this topic (if provided): ${topicWords.join(', ') || 'any words related to the topic'}
3. Use vocabulary and grammar appropriate for the specified IELTS level
4. Include a Vietnamese translation
${isStory ? '5. Tell a complete mini story or narrative that makes sense\n6. Be interesting and engaging to read' : ''}

Return ONLY a valid JSON object with this exact structure:
{
  "sentence": "The complete ${isStory ? 'story/sentence' : 'sentence'} text",
  "translation": "Vietnamese translation of the ${isStory ? 'story/sentence' : 'sentence'}",
  "highlightedWords": [
    {
      "word": "vocabulary word from the sentence",
      "meaning": "English meaning",
      "meaningVi": "Vietnamese meaning",
      "startIndex": 0,
      "endIndex": 4
    }
  ]
}

The startIndex and endIndex should indicate where the word appears in the sentence (character positions). Make sure to highlight ALL vocabulary words from the topic that appear in the ${isStory ? 'story' : 'sentence'}.`,
    },
    {
      role: 'user',
      content: `Generate ${isStory ? 'a story-like sentence or short paragraph' : 'a sentence'} about "${topicName}" with highlighted vocabulary words.`,
    },
  ];

  try {
    const openrouter = new OpenRouter({
      apiKey: apiKey,
    });

    const completion = await openrouter.chat.send({
      model: 'deepseek/deepseek-chat',
      messages: messages as any,
      temperature: 0.8,
      maxTokens: isStory ? 2000 : 1000, // More tokens for story-like sentences
      stream: false,
    });

    const messageContent = completion.choices[0]?.message?.content;
    
    // Handle content that might be string or array
    let content: string;
    if (typeof messageContent === 'string') {
      content = messageContent;
    } else if (Array.isArray(messageContent)) {
      // Extract text from content array
      content = messageContent
        .filter((item: any) => item.type === 'text')
        .map((item: any) => item.text)
        .join('');
    } else {
      throw new Error('No content received from OpenRouter API');
    }

    if (!content) {
      throw new Error('No content received from OpenRouter API');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from OpenRouter response');
    }

    const sentence: GeneratedSentence = JSON.parse(jsonMatch[0]);
    
    // Validate and fix indices if needed
    sentence.highlightedWords = sentence.highlightedWords.map((word) => {
      const actualIndex = sentence.sentence.toLowerCase().indexOf(word.word.toLowerCase());
      return {
        ...word,
        startIndex: actualIndex >= 0 ? actualIndex : word.startIndex,
        endIndex: actualIndex >= 0 ? actualIndex + word.word.length : word.endIndex,
      };
    });

    return sentence;
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

