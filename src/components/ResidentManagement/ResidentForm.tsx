
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Resident } from "@/lib/residentStore";
import { useResidentForm } from "./hooks/useResidentForm";
import PersonalInfoSection from "./FormSections/PersonalInfoSection";
import ContactInfoSection from "./FormSections/ContactInfoSection";
import AddressSection from "./FormSections/AddressSection";
import EmergencyContactsSection from "./FormSections/EmergencyContactsSection";

interface ResidentFormProps {
  resident?: Resident;
  onCancel: () => void;
  onSuccess: () => void;
}

const ResidentForm = ({ resident, onCancel, onSuccess }: ResidentFormProps) => {
  const {
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
  } = useResidentForm({ resident, onSuccess });

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
              <PersonalInfoSection form={form} />
              <ContactInfoSection form={form} />
              <AddressSection form={form} />
              
              <EmergencyContactsSection
                contacts={contacts}
                showContactForm={showContactForm}
                editingContact={editingContact}
                onAddContact={handleAddContact}
                onEditContact={handleEditContact}
                onDeleteContact={handleDeleteContact}
                onContactSave={handleContactSave}
                onContactCancel={handleContactCancel}
              />

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
