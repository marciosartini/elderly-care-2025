
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Contact, residentsStore } from "@/lib/residentStore";

interface ContactFormProps {
  residentId: string;
  contact?: Contact;
  onCancel: () => void;
  onSuccess: () => void;
}

const ContactForm = ({ residentId, contact, onCancel, onSuccess }: ContactFormProps) => {
  const [name, setName] = useState(contact?.name || "");
  const [phone, setPhone] = useState(contact?.phone || "");
  const [email, setEmail] = useState(contact?.email || "");
  const [relationship, setRelationship] = useState(contact?.relationship || "");
  const [isEmergencyContact, setIsEmergencyContact] = useState(
    contact?.isEmergencyContact || false
  );
  const [loading, setLoading] = useState(false);
  const isEditing = !!contact;

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return false;
    }

    if (!phone.trim()) {
      toast.error("Telefone é obrigatório");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const contactData = {
      name,
      phone,
      email,
      relationship,
      isEmergencyContact,
    };

    try {
      if (isEditing && contact) {
        residentsStore.updateResidentContact(residentId, contact.id, contactData);
        toast.success("Contato atualizado com sucesso");
      } else {
        residentsStore.addContactToResident(residentId, contactData);
        toast.success("Contato adicionado com sucesso");
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Erro ao salvar contato");
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as phone number
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Contato" : "Novo Contato"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              disabled={loading}
              maxLength={15}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Parentesco/Relacionamento</Label>
            <Input
              id="relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={isEmergencyContact}
              onCheckedChange={setIsEmergencyContact}
              disabled={loading}
              id="emergency-contact"
            />
            <Label htmlFor="emergency-contact">
              Contato de emergência
            </Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-custom-blue hover:bg-custom-blue/90"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ContactForm;
