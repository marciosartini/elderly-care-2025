
import { EvolutionEntry } from "./types";
import { mockEvolutionEntries } from "./mockData";

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
