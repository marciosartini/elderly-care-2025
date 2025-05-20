
import { useState } from "react";
import { Contact, Resident, residentsStore } from "@/lib/residentStore";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form schema
const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z.string().min(1, "Gênero é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  zipCode: z.string().min(1, "CEP é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("E-mail inválido"),
  admissionDate: z.string().min(1, "Data de admissão é obrigatória"),
});

export type ResidentFormValues = z.infer<typeof formSchema>;

export interface UseResidentFormProps {
  resident?: Resident;
  onSuccess: () => void;
}

export const useResidentForm = ({ resident, onSuccess }: UseResidentFormProps) => {
  const editing = !!resident;
  
  // State to manage contacts
  const [contacts, setContacts] = useState<Contact[]>(
    resident ? [...resident.contacts] : []
  );
  
  // State to show/hide contact form
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Initialize form
  const form = useForm<ResidentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: resident?.name || "",
      cpf: resident?.cpf || "",
      birthDate: resident?.birthDate || "",
      gender: resident?.gender || "",
      address: resident?.address || "",
      city: resident?.city || "",
      state: resident?.state || "",
      zipCode: resident?.zipCode || "",
      phone: resident?.phone || "",
      email: resident?.email || "",
      admissionDate: resident?.admissionDate || "",
    },
  });

  const onSubmit = (values: ResidentFormValues) => {
    try {
      if (editing && resident) {
        // Update existing resident
        residentsStore.updateResident(resident.id, {
          ...values,
          contacts,
        } as Resident);
        toast.success("Residente atualizado com sucesso!");
      } else {
        // Add new resident
        residentsStore.addResident({
          ...values,
          contacts,
        } as Omit<Resident, "id">);
        toast.success("Residente cadastrado com sucesso!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Erro ao salvar residente");
      console.error(error);
    }
  };

  // Handle contact operations
  const handleAddContact = () => {
    setEditingContact(null);
    setShowContactForm(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowContactForm(true);
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter((c) => c.id !== contactId));
    toast.success("Contato removido");
  };

  const handleContactSave = (contact: Contact) => {
    if (editingContact) {
      // Update existing contact
      setContacts(
        contacts.map((c) => (c.id === contact.id ? contact : c))
      );
    } else {
      // Add new contact with generated ID
      const newContact = {
        ...contact,
        id: `temp-${Date.now()}`, // Temporary ID that will be replaced when saving the resident
      };
      setContacts([...contacts, newContact]);
    }
    setShowContactForm(false);
    setEditingContact(null);
  };

  const handleContactCancel = () => {
    setShowContactForm(false);
    setEditingContact(null);
  };

  return {
    form,
    contacts,
    showContactForm,
    editingContact,
    editing,
    onSubmit,
    handleAddContact,
    handleEditContact,
    handleDeleteContact,
    handleContactSave,
    handleContactCancel,
  };
};
