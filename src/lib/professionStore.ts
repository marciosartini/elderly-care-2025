
export interface Profession {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

// Mock professions
const mockProfessions: Profession[] = [
  {
    id: "1",
    name: "Enfermeira",
    description: "Profissional de saúde responsável pelos cuidados de enfermagem",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Cuidadora",
    description: "Profissional que oferece assistência e cuidados diários",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Fisioterapeuta",
    description: "Profissional especializado em reabilitação física",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Nutricionista",
    description: "Profissional especializado em alimentação e nutrição",
    createdAt: new Date().toISOString()
  }
];

export const professionsStore = {
  professions: [...mockProfessions],
  
  getProfessions: () => {
    return [...professionsStore.professions];
  },
  
  getProfessionById: (id: string) => {
    return professionsStore.professions.find(profession => profession.id === id) || null;
  },
  
  addProfession: (professionData: Omit<Profession, "id" | "createdAt">) => {
    const newProfession = {
      ...professionData,
      id: (professionsStore.professions.length + 1).toString(),
      createdAt: new Date().toISOString()
    };
    
    professionsStore.professions.push(newProfession);
    return newProfession;
  },
  
  updateProfession: (id: string, professionData: Partial<Profession>) => {
    const index = professionsStore.professions.findIndex(profession => profession.id === id);
    if (index !== -1) {
      professionsStore.professions[index] = {
        ...professionsStore.professions[index],
        ...professionData
      };
      return true;
    }
    return false;
  },
  
  deleteProfession: (id: string) => {
    const index = professionsStore.professions.findIndex(profession => profession.id === id);
    if (index !== -1) {
      professionsStore.professions.splice(index, 1);
      return true;
    }
    return false;
  }
};
