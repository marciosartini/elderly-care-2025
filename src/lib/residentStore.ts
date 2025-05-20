
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  isEmergencyContact: boolean;
}

export interface Resident {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  admissionDate: string;
  contacts: Contact[];
}

// Mock residents for the demo
const mockResidents: Resident[] = [
  {
    id: "1",
    name: "Maria Silva",
    cpf: "123.456.789-00",
    birthDate: "1945-05-10",
    gender: "Feminino",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    phone: "(11) 98765-4321",
    email: "maria.silva@email.com",
    admissionDate: "2023-01-15",
    contacts: [
      {
        id: "1-1",
        name: "João Silva",
        phone: "(11) 99999-8888",
        email: "joao.silva@email.com",
        relationship: "Filho",
        isEmergencyContact: true,
      },
    ],
  },
];

export const residentsStore = {
  residents: [...mockResidents],
  
  addResident: (resident: Omit<Resident, "id">) => {
    const newResident: Resident = {
      ...resident,
      id: (residentsStore.residents.length + 1).toString(),
    };
    
    residentsStore.residents.push(newResident);
    return newResident;
  },
  
  updateResident: (id: string, residentData: Partial<Resident>) => {
    const index = residentsStore.residents.findIndex(resident => resident.id === id);
    if (index !== -1) {
      residentsStore.residents[index] = { 
        ...residentsStore.residents[index], 
        ...residentData 
      };
      return true;
    }
    return false;
  },
  
  deleteResident: (id: string) => {
    const index = residentsStore.residents.findIndex(resident => resident.id === id);
    if (index !== -1) {
      residentsStore.residents.splice(index, 1);
      return true;
    }
    return false;
  },
  
  getResidentById: (id: string) => {
    return residentsStore.residents.find(resident => resident.id === id) || null;
  },
  
  getResidents: () => {
    return [...residentsStore.residents];
  },
  
  addContactToResident: (residentId: string, contact: Omit<Contact, "id">) => {
    const residentIndex = residentsStore.residents.findIndex(
      resident => resident.id === residentId
    );
    
    if (residentIndex !== -1) {
      const newContact: Contact = {
        ...contact,
        id: `${residentId}-${residentsStore.residents[residentIndex].contacts.length + 1}`,
      };
      
      residentsStore.residents[residentIndex].contacts.push(newContact);
      return newContact;
    }
    return null;
  },
  
  updateResidentContact: (
    residentId: string, 
    contactId: string, 
    contactData: Partial<Contact>
  ) => {
    const residentIndex = residentsStore.residents.findIndex(
      resident => resident.id === residentId
    );
    
    if (residentIndex !== -1) {
      const contactIndex = residentsStore.residents[residentIndex].contacts.findIndex(
        contact => contact.id === contactId
      );
      
      if (contactIndex !== -1) {
        residentsStore.residents[residentIndex].contacts[contactIndex] = {
          ...residentsStore.residents[residentIndex].contacts[contactIndex],
          ...contactData,
        };
        return true;
      }
    }
    return false;
  },
  
  deleteResidentContact: (residentId: string, contactId: string) => {
    const residentIndex = residentsStore.residents.findIndex(
      resident => resident.id === residentId
    );
    
    if (residentIndex !== -1) {
      const contactIndex = residentsStore.residents[residentIndex].contacts.findIndex(
        contact => contact.id === contactId
      );
      
      if (contactIndex !== -1) {
        residentsStore.residents[residentIndex].contacts.splice(contactIndex, 1);
        return true;
      }
    }
    return false;
  },
};
