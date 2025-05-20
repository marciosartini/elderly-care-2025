
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Contact, residentsStore } from "@/lib/residentStore";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, User } from "lucide-react";
import ContactForm from "./ContactForm";
import { toast } from "sonner";

interface ContactsListProps {
  residentId?: string;
  contacts: Contact[];
  onContactsChange?: () => void;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contactId: string) => void;
}

const ContactsList = ({ residentId, contacts, onContactsChange, onEdit, onDelete }: ContactsListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<Contact | null>(null);

  const handleAddContact = () => {
    setSelectedContact(undefined);
    setShowForm(true);
  };

  const handleEditContact = (contact: Contact) => {
    // Use the provided onEdit if available
    if (onEdit) {
      onEdit(contact);
      return;
    }
    setSelectedContact(contact);
    setShowForm(true);
  };

  const handleDeleteContact = (contact: Contact) => {
    // Use the provided onDelete if available
    if (onDelete) {
      onDelete(contact.id);
      return;
    }
    setConfirmDelete(contact);
  };

  const confirmDeleteContact = () => {
    if (confirmDelete && residentId) {
      residentsStore.deleteResidentContact(residentId, confirmDelete.id);
      toast.success("Contato removido com sucesso");
      setConfirmDelete(null);
      if (onContactsChange) onContactsChange();
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedContact(undefined);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedContact(undefined);
    if (onContactsChange) onContactsChange();
  };

  if (showForm && residentId) {
    return (
      <ContactForm 
        residentId={residentId}
        contact={selectedContact}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Contatos</h3>
          <p className="text-sm text-muted-foreground">Gerenciar contatos do residente</p>
        </div>
        {residentId && (
          <Button 
            variant="outline" 
            className="border-custom-blue text-custom-blue"
            onClick={handleAddContact}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Contato
          </Button>
        )}
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <h3 className="font-medium text-gray-600">Nenhum contato cadastrado</h3>
          <p className="text-sm text-gray-500 mt-1">Clique em "Adicionar Contato" para cadastrar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{contact.name}</h4>
                    {contact.isEmergencyContact && (
                      <Badge className="bg-red-600">Emergência</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                  <p className="text-sm">{contact.phone}</p>
                  {contact.email && <p className="text-sm">{contact.email}</p>}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditContact(contact)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteContact(contact)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Contato</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteContact} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactsList;
