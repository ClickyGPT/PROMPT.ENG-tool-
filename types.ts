
export enum CraftComponent {
  Context = 'Context',
  Role = 'Role',
  Action = 'Action',
  Format = 'Format',
  Target = 'Target',
}

export interface CraftState {
  [CraftComponent.Context]: string;
  [CraftComponent.Role]: string;
  [CraftComponent.Action]: string;
  [CraftComponent.Format]: string;
  [CraftComponent.Target]: string;
}

export interface LinterSuggestion {
  component: CraftComponent;
  suggestionText: string;
  fix: string;
}

export interface LinterResponse {
  score: number;
  suggestions: LinterSuggestion[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  prompt: string;
  craftState: CraftState;
}

export interface Template {
  name: string;
  craftState: CraftState;
}
