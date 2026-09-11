export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  category?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  text?: string;
  options: [string, string, string, string]; // Exactly 4 options
  correctOptionIndex: 0 | 1 | 2 | 3;
  correctAnswer?: string;
  explanation: string;
}

export interface StudySet {
  id: string;
  title: string;
  topic?: string;
  summary: string;
  createdAt: number;
  sourceTextSnippet: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  questions?: QuizQuestion[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: {
    latencyMs: number;
    provider: string;
    model: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: 'MALFORMED_INPUT' | 'UPSTREAM_FAILURE' | 'PARSE_ERROR' | 'TIMEOUT' | 'RATE_LIMITED';
    message: string;
    actionableSuggestion: string;
    recoverable: boolean;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface GenerateStudySetRequest {
  text: string;
  mockMode?: boolean;
}
