
import { residentsStore } from "./residentStore";

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

export const EVOLUTION_CATEGORIES: EvolutionCategory[] = [
  {
    id: "bloodPressure",
    title: "Pressão Arterial",
    fieldType: "text",
  },
  {
    id: "feeding",
    title: "Alimentação",
    fieldType: "option",
    options: [
      { id: "ate-well", label: "Comeu bem", value: "Comeu bem", icon: "check", color: "bg-custom-green text-white" },
      { id: "ate-little", label: "Comeu pouco", value: "Comeu pouco", icon: "alert-triangle", color: "bg-amber-500 text-white" },
      { id: "refused", label: "Recusou alimentação", value: "Recusou alimentação", icon: "x", color: "bg-red-500 text-white" },
    ],
  },
  {
    id: "hydration",
    title: "Hidratação",
    fieldType: "option",
    options: [
      { id: "hydrated", label: "Bem hidratado", value: "Bem hidratado", icon: "droplet", color: "bg-custom-green text-white" },
      { id: "needs-water", label: "Precisa de mais água", value: "Precisa de mais água", icon: "alert-triangle", color: "bg-amber-500 text-white" },
      { id: "dehydrated", label: "Desidratado", value: "Desidratado", icon: "x", color: "bg-red-500 text-white" },
    ],
  },
  {
    id: "physiologicalNeeds",
    title: "Necessidades fisiológicas",
    fieldType: "option",
    options: [
      { id: "normal", label: "Normal", value: "Normal", icon: "check", color: "bg-custom-green text-white" },
      { id: "difficulty", label: "Dificuldade", value: "Dificuldade", icon: "alert-triangle", color: "bg-amber-500 text-white" },
      { id: "assistance", label: "Assistência necessária", value: "Assistência necessária", icon: "x", color: "bg-custom-blue text-white" },
    ],
  },
  {
    id: "pain",
    title: "Dor ou Desconforto",
    fieldType: "boolean",
  },
  {
    id: "mood",
    title: "Humor e Comportamento",
    fieldType: "option",
    options: [
      { id: "calm", label: "Calmo", value: "Calmo", icon: "check", color: "bg-custom-green text-white" },
      { id: "agitated", label: "Agitado", value: "Agitado", icon: "alert-triangle", color: "bg-amber-500 text-white" },
      { id: "depressed", label: "Depressivo", value: "Depressivo", icon: "meh", color: "bg-custom-blue text-white" },
    ],
  },
  {
    id: "physicalActivity",
    title: "Atividade Física",
    fieldType: "option",
    options: [
      { id: "independent", label: "Independente", value: "Independente", icon: "check", color: "bg-custom-green text-white" },
      { id: "with-help", label: "Com ajuda", value: "Com ajuda", icon: "alert-triangle", color: "bg-amber-500 text-white" },
      { id: "bedridden", label: "Acamado", value: "Acamado", icon: "bed", color: "bg-custom-blue text-white" },
    ],
  },
  {
    id: "medication",
    title: "Uso de Medicamentos",
    fieldType: "boolean",
  },
  {
    id: "sleep",
    title: "Qualidade do Sono",
    fieldType: "option",
    options: [
      { id: "slept-well", label: "Dormiu bem", value: "Dormiu bem", icon: "sleep", color: "bg-custom-green text-white" },
      { id: "restless", label: "Sono agitado", value: "Sono agitado", icon: "alert-triangle", color: "bg-amber-500 text-white" },
      { id: "insomnia", label: "Insônia", value: "Insônia", icon: "x", color: "bg-red-500 text-white" },
    ],
  },
  {
    id: "cognition",
    title: "Orientação Cognitiva",
    fieldType: "option",
    options: [
      { id: "oriented", label: "Orientado", value: "Orientado", icon: "check", color: "bg-custom-green text-white" },
      { id: "confused", label: "Confuso", value: "Confuso", icon: "confused", color: "bg-amber-500 text-white" },
      { id: "disoriented", label: "Desorientado", value: "Desorientado", icon: "x", color: "bg-red-500 text-white" },
    ],
  },
  {
    id: "socialInteraction",
    title: "Interação Social",
    fieldType: "option",
    options: [
      { id: "socialized", label: "Socializou", value: "Socializou", icon: "check", color: "bg-custom-green text-white" },
      { id: "isolated", label: "Ficou isolado", value: "Ficou isolado", icon: "x", color: "bg-amber-500 text-white" },
      { id: "participated", label: "Participou de atividades", value: "Participou de atividades", icon: "activity", color: "bg-custom-blue text-white" },
    ],
  },
  {
    id: "emotionalState",
    title: "Estado Emocional",
    fieldType: "option",
    options: [
      { id: "happy", label: "Feliz", value: "Feliz", icon: "smile", color: "bg-custom-green text-white" },
      { id: "sad", label: "Triste", value: "Triste", icon: "frown", color: "bg-amber-500 text-white" },
      { id: "irritated", label: "Irritado", value: "Irritado", icon: "meh", color: "bg-red-500 text-white" },
      { id: "anxious", label: "Ansioso", value: "Ansioso", icon: "x", color: "bg-custom-blue text-white" },
    ],
  },
  {
    id: "mobility",
    title: "Mobilidade",
    fieldType: "option",
    options: [
      { id: "walked", label: "Caminhou", value: "Caminhou", icon: "walking", color: "bg-custom-green text-white" },
      { id: "wheelchair", label: "Cadeira de rodas", value: "Cadeira de rodas", icon: "wheelchair", color: "bg-custom-blue text-white" },
      { id: "bedridden", label: "No leito", value: "No leito", icon: "x", color: "bg-red-500 text-white" },
    ],
  },
  {
    id: "medicalCare",
    title: "Atendimento Médico",
    fieldType: "option",
    allowMultiple: true,
    options: [
      { id: "doctor", label: "Consultou médico", value: "Consultou médico", icon: "hospital", color: "bg-custom-blue text-white" },
      { id: "medication", label: "Tomou remédios", value: "Tomou remédios", icon: "medicine", color: "bg-custom-brown text-white" },
      { id: "emergency", label: "Atendimento emergencial", value: "Atendimento emergencial", icon: "ambulance", color: "bg-red-500 text-white" },
    ],
  },
  {
    id: "satisfaction",
    title: "Satisfação com cuidados",
    fieldType: "rating",
  },
  {
    id: "medications",
    title: "Medicamentos",
    fieldType: "text",
  },
  {
    id: "observations",
    title: "Observações adicionais",
    fieldType: "text",
  },
];

export interface EvolutionEntry {
  id: string;
  residentId: string;
  date: string;
  time: string;
  userId: string;
  userName: string;
  data: Record<string, any>;
}

// Mock evolution entries for the demo
const mockEvolutionEntries: EvolutionEntry[] = [
  {
    id: "1",
    residentId: "1",
    date: "2024-05-14", // Updated from 2024-05-15 to 2024-05-14 to match the mentioned date
    time: "08:30",
    userId: "1",
    userName: "Administrador",
    data: {
      bloodPressure: "120/80",
      feeding: "Comeu bem",
      hydration: "Bem hidratado",
      physiologicalNeeds: "Normal",
      pain: false,
      mood: "Calmo",
      physicalActivity: "Independente",
      medication: true,
      sleep: "Dormiu bem",
      cognition: "Orientado",
      socialInteraction: "Socializou",
      emotionalState: "Feliz",
      mobility: "Caminhou",
      medicalCare: ["Tomou remédios"],
      satisfaction: 5,
      medications: "Losartana 50mg - 1x ao dia",
      observations: "Paciente está bem adaptado e com boa disposição.",
    },
  },
];

export const evolutionsStore = {
  evolutions: [...mockEvolutionEntries],
  
  addEvolution: (evolution: Omit<EvolutionEntry, "id">) => {
    const newEvolution: EvolutionEntry = {
      ...evolution,
      id: (evolutionsStore.evolutions.length + 1).toString(),
    };
    
    evolutionsStore.evolutions.push(newEvolution);
    return newEvolution;
  },
  
  updateEvolution: (id: string, evolutionData: Partial<EvolutionEntry>) => {
    const index = evolutionsStore.evolutions.findIndex(
      evolution => evolution.id === id
    );
    
    if (index !== -1) {
      evolutionsStore.evolutions[index] = { 
        ...evolutionsStore.evolutions[index], 
        ...evolutionData 
      };
      return true;
    }
    return false;
  },
  
  deleteEvolution: (id: string) => {
    const index = evolutionsStore.evolutions.findIndex(
      evolution => evolution.id === id
    );
    
    if (index !== -1) {
      evolutionsStore.evolutions.splice(index, 1);
      return true;
    }
    return false;
  },
  
  getEvolutionById: (id: string) => {
    return evolutionsStore.evolutions.find(evolution => evolution.id === id) || null;
  },
  
  getEvolutions: () => {
    return [...evolutionsStore.evolutions];
  },
  
  getEvolutionsByResidentId: (residentId: string) => {
    return evolutionsStore.evolutions.filter(
      evolution => evolution.residentId === residentId
    );
  },
  
  getEvolutionsByDate: (date: string) => {
    return evolutionsStore.evolutions.filter(
      evolution => evolution.date === date
    );
  },
  
  getEvolutionsByResidentIdAndDate: (residentId: string, date: string) => {
    return evolutionsStore.evolutions.filter(
      evolution => evolution.residentId === residentId && evolution.date === date
    );
  },
};
