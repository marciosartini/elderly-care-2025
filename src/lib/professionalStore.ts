
import { Profession } from "./professionStore";

export interface Professional {
  id: string;
  name: string;
  photo: string;
  professionId: string;
  profession?: Profession;
  experience: string;
  contact: {
    phone: string;
    email: string;
  };
  registration: string;
  specialty: string;
  schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    activities: string;
  }[];
  createdAt: string;
}

// Mock professionals
const mockProfessionals: Professional[] = [
  {
    id: "1",
    name: "Maria da Silva",
    photo: "/placeholder.svg",
    professionId: "1", // Enfermeira
    experience: "10 anos de experiência em casa de repouso. Trabalhou anteriormente no Hospital São Lucas (2010-2015) e na Casa de Repouso Esperança (2015-2020).",
    contact: {
      phone: "(11) 98765-4321",
      email: "maria.silva@example.com"
    },
    registration: "COREN-SP 123456",
    specialty: "Geriatria",
    schedule: [
      {
        dayOfWeek: "Segunda-feira",
        startTime: "08:00",
        endTime: "16:00",
        activities: "Administração de medicamentos, aferição de sinais vitais"
      },
      {
        dayOfWeek: "Terça-feira",
        startTime: "08:00",
        endTime: "16:00",
        activities: "Acompanhamento de pacientes, procedimentos"
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export const professionalsStore = {
  professionals: [...mockProfessionals],
  
  getProfessionals: () => {
    return [...professionalsStore.professionals];
  },
  
  getProfessionalById: (id: string) => {
    return professionalsStore.professionals.find(professional => professional.id === id) || null;
  },
  
  addProfessional: (professionalData: Omit<Professional, "id" | "createdAt">) => {
    const newProfessional = {
      ...professionalData,
      id: (professionalsStore.professionals.length + 1).toString(),
      createdAt: new Date().toISOString()
    };
    
    professionalsStore.professionals.push(newProfessional);
    return newProfessional;
  },
  
  updateProfessional: (id: string, professionalData: Partial<Professional>) => {
    const index = professionalsStore.professionals.findIndex(professional => professional.id === id);
    if (index !== -1) {
      professionalsStore.professionals[index] = {
        ...professionalsStore.professionals[index],
        ...professionalData
      };
      return true;
    }
    return false;
  },
  
  deleteProfessional: (id: string) => {
    const index = professionalsStore.professionals.findIndex(professional => professional.id === id);
    if (index !== -1) {
      professionalsStore.professionals.splice(index, 1);
      return true;
    }
    return false;
  }
};
