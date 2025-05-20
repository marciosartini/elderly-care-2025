
import React from "react";
import { Button } from "@/components/ui/button";
import { Contact } from "@/lib/residentStore";
import ContactForm from "../ContactForm";
import ContactsList from "../ContactsList";

interface EmergencyContactsSectionProps {
  contacts: Contact[];
  showContactForm: boolean;
  editingContact: Contact | null;
  onAddContact: () => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
  onContactSave: (contact: Contact) => void;
  onContactCancel: () => void;
}

const EmergencyContactsSection = ({
  contacts,
  showContactForm,
  editingContact,
  onAddContact,
  onEditContact,
  onDeleteContact,
  onContactSave,
  onContactCancel,
}: EmergencyContactsSectionProps) => {
  return (
    <div className="border-t pt-4 border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Contatos de Emergência</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onAddContact}
          disabled={showContactForm}
        >
          Adicionar Contato
        </Button>
      </div>

      {showContactForm ? (
        <div className="mb-6">
          <ContactForm 
            contact={editingContact || undefined} 
            onSave={onContactSave} 
            onCancel={onContactCancel} 
          />
        </div>
      ) : (
        <ContactsList 
          contacts={contacts} 
          onEdit={onEditContact} 
          onDelete={onDeleteContact} 
        />
      )}
    </div>
  );
};

export default EmergencyContactsSection;
