export type PersonalityId =
  | "dramatic"
  | "snarky"
  | "cute"
  | "honest"
  | "villain"
  | "advisor"
  | "chaotic"
  | "professional";

export type GameMode =
  | "classic"
  | "best_of_3"
  | "veto"
  | "elimination";

export type TemplateCategory =
  | "daily"
  | "couple"
  | "work"
  | "friends"
  | "selfcare"
  | "food"
  | "entertainment"
  | "chores"
  | "challenges"
  | "random";

export interface RouletteOption {
  id: string;
  label: string;
  weight: number;
  color: string;
  isVetoed?: boolean;
  isEliminated?: boolean;
}

export interface Roulette {
  id: string;
  name: string;
  description?: string;
  options: RouletteOption[];
  personalityId: PersonalityId;
  gameMode: GameMode;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
}

export interface RouletteTemplate {
  id: string;
  name: string;
  description: string;
  tagline: string;
  category: TemplateCategory;
  defaultOptions: Array<{
    label: string;
    weight: number;
    color?: string;
  }>;
  recommendedPersonality: PersonalityId;
  recommendedGameMode: GameMode;
}

export interface SpinResult {
  id: string;
  rouletteId: string;
  rouletteName: string;
  selectedOption: RouletteOption;
  personalityId: PersonalityId;
  gameMode: GameMode;
  spunAt: string;
  wasAccepted?: boolean;
  roundNumber?: number;
  phrase?: string;
}

export interface Personality {
  id: PersonalityId;
  name: string;
  description: string;
  tone: string;
  bestFor: string[];
  phrases: {
    before: string[];
    during: string[];
    after: string[];
  };
}

// ─── Game mode sessions ───────────────────────────────────────────────────────

export interface BestOfThreeRound {
  roundNumber: number;
  selectedOption: RouletteOption;
}

export interface BestOfThreeSession {
  rounds: BestOfThreeRound[];
  isComplete: boolean;
  winner: RouletteOption | null;
}

export interface EliminationSession {
  eliminatedIds: string[];
  winner: RouletteOption | null;
  isComplete: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────

export interface AppPreferences {
  defaultPersonality: PersonalityId;
  hasCompletedOnboarding: boolean;
  /** ID da última roleta ativa na SpinPage — usado para restaurar após F5. */
  lastActiveRouletteId?: string;
}

export interface AppState {
  roulettes: Roulette[];
  history: SpinResult[];
  dailyDestiny?: {
    date: string;
    rouletteId?: string;
    resultId?: string;
    completed: boolean;
  };
  preferences: AppPreferences;
}
