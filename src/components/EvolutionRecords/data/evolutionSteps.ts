
// Evolution categories and steps configuration
import { EVOLUTION_CATEGORIES } from "@/lib/evolutionStore";

// Additional categories that might be relevant for nursing home evolution records
export const ADDITIONAL_CATEGORIES = [
  {
    id: "vitalSigns",
    title: "Sinais Vitais",
    fieldType: "text",
    placeholder: "Temperatura, frequência cardíaca, etc."
  },
  {
    id: "medication",
    title: "Medicação",
    fieldType: "text",
    placeholder: "Liste os medicamentos administrados"
  },
  {
    id: "wounds",
    title: "Feridas/Lesões",
    fieldType: "boolean"
  },
  {
    id: "oxygenation",
    title: "Oxigenação",
    fieldType: "text",
    placeholder: "Saturação de O2, uso de suporte"
  },
  {
    id: "skinCondition",
    title: "Condição da Pele",
    fieldType: "option",
    options: [
      { id: "normal", value: "normal", label: "Normal", color: "bg-green-100", icon: "check" },
      { id: "dry", value: "dry", label: "Seca", color: "bg-yellow-100", icon: "alert-triangle" },
      { id: "redness", value: "redness", label: "Vermelhidão", color: "bg-red-100", icon: "x" }
    ]
  },
  {
    id: "respiratoryCondition",
    title: "Condição Respiratória",
    fieldType: "option",
    options: [
      { id: "normal", value: "normal", label: "Normal", color: "bg-green-100", icon: "check" },
      { id: "wheezing", value: "wheezing", label: "Chiado", color: "bg-yellow-100", icon: "alert-triangle" },
      { id: "shortness", value: "shortness", label: "Falta de ar", color: "bg-red-100", icon: "x" }
    ]
  },
  {
    id: "notes",
    title: "Observações Adicionais",
    fieldType: "text",
    placeholder: "Insira aqui quaisquer observações relevantes sobre o paciente"
  }
];

// Combine original categories with additional ones
export const ALL_CATEGORIES = [...EVOLUTION_CATEGORIES, ...ADDITIONAL_CATEGORIES];

// Group categories into logical steps - removed bloodPressure from the basic step
export const EVOLUTION_STEPS = [
  {
    id: "basic",
    title: "Informações Básicas",
    categories: [] // Removed bloodPressure since it's redundant with the systolic/diastolic fields
  },
  {
    id: "nutrition",
    title: "Alimentação e Hidratação",
    categories: ["eating", "hydration"]
  },
  {
    id: "physical",
    title: "Condição Física",
    categories: ["physiologicalNeeds", "physicalActivity", "mobility", "skinCondition", "wounds"]
  },
  {
    id: "medical",
    title: "Condições Médicas",
    categories: ["pain", "medication", "oxygenation", "respiratoryCondition"]
  },
  {
    id: "mental",
    title: "Estado Mental e Emocional",
    categories: ["mood", "cognitiveOrientation", "sleep", "emotionalState"]
  },
  {
    id: "social",
    title: "Aspectos Sociais",
    categories: ["socialInteraction", "satisfactionLevel"]
  },
  {
    id: "notes",
    title: "Observações Adicionais",
    categories: ["notes"]
  }
];
