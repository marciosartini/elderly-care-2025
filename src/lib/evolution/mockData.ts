
import { EvolutionEntry } from "./types";

// Mock evolution entries for the demo
export const mockEvolutionEntries: EvolutionEntry[] = [
  {
    id: "1",
    residentId: "1",
    date: "2024-05-14",
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
