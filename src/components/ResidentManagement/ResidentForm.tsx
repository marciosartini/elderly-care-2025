import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Resident, Contact, residentsStore } from "@/lib/residentStore";
import { toast } from "sonner";
import ContactForm from "./ContactForm";
import ContactsList from "./ContactsList";

interface ResidentFormProps {
  resident?: Resident;
  onCancel: () => void;
  onSuccess: () => void;
}

interface ResidentFormValues {
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
}

const ResidentForm = ({ resident, onCancel, onSuccess }: ResidentFormProps) => {
  // Check if we're editing an existing resident
  const editing = !!resident;
  
  // State to manage contacts
  const [contacts, setContacts] = useState<Contact[]>(
    resident ? [...resident.contacts] : []
  );
  
  // State to show/hide contact form
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

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

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-custom-blue">
          {editing ? "Editar Residente" : "Novo Residente"}
        </h2>
        <p className="text-muted-foreground">
          {editing
            ? "Atualize os dados do residente"
            : "Preencha os dados para cadastrar um novo residente"}
        </p>
      </div>

      <Card className="border-custom-gray/20">
        <CardHeader>
          <CardTitle className="text-xl text-custom-blue">
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Personal Information Fields */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do residente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gênero</FormLabel>
                      <FormControl>
                        <Input placeholder="Gênero" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="admissionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Admissão</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-4 border-gray-200">
                <h3 className="text-lg font-medium mb-2">
                  Informações de Contato
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Contact Information Fields */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(00) 00000-0000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-4 border-gray-200">
                <h3 className="text-lg font-medium mb-2">Endereço</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Address Fields */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, número, complemento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="Estado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input placeholder="00000-000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-4 border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Contatos de Emergência</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddContact}
                    disabled={showContactForm}
                  >
                    Adicionar Contato
                  </Button>
                </div>

                {showContactForm ? (
                  <ContactForm 
                    contact={editingContact || undefined} 
                    onSave={handleContactSave} 
                    onCancel={handleContactCancel} 
                  />
                ) : (
                  <ContactsList 
                    contacts={contacts} 
                    onEdit={handleEditContact} 
                    onDelete={handleDeleteContact} 
                  />
                )}
              </div>

              <CardFooter className="flex justify-between border-t pt-5 px-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-custom-blue hover:bg-custom-blue/90"
                >
                  {editing ? "Atualizar" : "Cadastrar"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentForm;
