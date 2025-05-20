
export type EvolutionOption = {
  id: string;
  label: string;
  icon?: string;
  value: string;
  color?: string;
};

export type EvolutionCategory = {
  id: string;
  title: string;
  fieldType: 'option' | 'text' | 'number' | 'boolean' | 'rating';
  options?: EvolutionOption[];
  allowMultiple?: boolean;
};

export interface EvolutionEntry {
  id: string;
  residentId: string;
  date: string;
  time: string;
  userId: string;
  userName: string;
  data: Record<string, any>;
}
