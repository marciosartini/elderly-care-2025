
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AlertDialog, AlertDialogContent, AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { UserPlus } from "lucide-react";
import { Contact, Resident, residentsStore } from "@/lib/residentStore";
import ContactForm from "./ContactForm";
import { toast } from "sonner";

interface ResidentDetailProps {
  resident: Resident;
  onEdit: (resident: Resident) => void;
  onBackToList: () => void;
}

const ResidentDetail = ({ resident, onEdit, onBackToList }: ResidentDetailProps) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedResident, setSelectedResident] = useState<Resident>(resident);

  const handleAddContactClick = () => {
    setSelectedContact(undefined);
    setShowContactForm(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact({...contact});
    setShowContactForm(true);
  };

  const handleDeleteContact = (contactId: string) => {
    setSelectedContactId(contactId);
    setDialogOpen(true);
  };

  const confirmDeleteContact = () => {
    if (!selectedResident || !selectedContactId) return;

    residentsStore.deleteResidentContact(
      selectedResident.id, 
      selectedContactId
    );
    
    // Update the selected resident to reflect changes
    setSelectedResident(
      residentsStore.getResidentById(selectedResident.id)
    );
    
    toast.success("Contato removido com sucesso");
    setDialogOpen(false);
    setSelectedContactId(null);
  };

  const handleContactFormCancel = () => {
    setShowContactForm(false);
    setSelectedContact(undefined);
  };

  const handleContactFormSuccess = () => {
    setShowContactForm(false);
    setSelectedContact(undefined);
    
    // Update the selected resident to reflect changes
    setSelectedResident(
      residentsStore.getResidentById(selectedResident.id)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBackToList}
        >
          Voltar para lista
        </Button>
        <Button 
          onClick={() => onEdit(selectedResident)}
          className="bg-custom-blue hover:bg-custom-blue/90"
        >
          Editar Residente
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dados do Residente</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="contact">Endereço e Contato</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Nome</h3>
                  <p className="text-base">{selectedResident.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">CPF</h3>
                  <p className="text-base">{selectedResident.cpf}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Data de Nascimento</h3>
                  <p className="text-base">
                    {new Date(selectedResident.birthDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Gênero</h3>
                  <p className="text-base">{selectedResident.gender || "Não informado"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Data de Admissão</h3>
                  <p className="text-base">
                    {new Date(selectedResident.admissionDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Endereço</h3>
                  <p className="text-base">{selectedResident.address}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Cidade</h3>
                  <p className="text-base">{selectedResident.city}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Estado</h3>
                  <p className="text-base">{selectedResident.state}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">CEP</h3>
                  <p className="text-base">{selectedResident.zipCode || "Não informado"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Telefone</h3>
                  <p className="text-base">{selectedResident.phone || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                  <p className="text-base">{selectedResident.email || "Não informado"}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <ResidentContacts 
        resident={selectedResident}
        showContactForm={showContactForm}
        selectedContact={selectedContact}
        onAddContact={handleAddContactClick}
        onEditContact={handleEditContact}
        onDeleteContact={handleDeleteContact}
        onContactFormCancel={handleContactFormCancel}
        onContactFormSuccess={handleContactFormSuccess}
      />

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir contato</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Este contato será permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteContact} className="bg-red-600">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Separate component for resident contacts section
interface ResidentContactsProps {
  resident: Resident;
  showContactForm: boolean;
  selectedContact?: Contact;
  onAddContact: () => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
  onContactFormCancel: () => void;
  onContactFormSuccess: () => void;
}

const ResidentContacts = ({
  resident,
  showContactForm,
  selectedContact,
  onAddContact,
  onEditContact,
  onDeleteContact,
  onContactFormCancel,
  onContactFormSuccess
}: ResidentContactsProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-custom-blue">Contatos</h3>
        <Button 
          onClick={onAddContact}
          className="bg-custom-blue hover:bg-custom-blue/90"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Contato
        </Button>
      </div>
      
      {showContactForm ? (
        <ContactForm 
          residentId={resident.id}
          contact={selectedContact}
          onCancel={onContactFormCancel}
          onSuccess={onContactFormSuccess}
        />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Relacionamento</TableHead>
                  <TableHead>Emergência</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resident.contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum contato cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  resident.contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.email || "-"}</TableCell>
                      <TableCell>{contact.relationship || "-"}</TableCell>
                      <TableCell>{contact.isEmergencyContact ? "Sim" : "Não"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-custom-blue text-custom-blue"
                          onClick={() => onEditContact(contact)}
                        >
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                          onClick={() => onDeleteContact(contact.id)}
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ResidentDetail;
