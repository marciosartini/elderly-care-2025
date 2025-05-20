import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Resident, residentsStore } from "@/lib/residentStore";
import ContactsList from "./ContactsList";

interface ResidentFormProps {
  resident?: Resident;
  onCancel: () => void;
  onSuccess: () => void;
}

const ResidentForm = ({ resident, onCancel, onSuccess }: ResidentFormProps) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const isEditing = !!resident;
  
  // Form state
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [admissionDate, setAdmissionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [contacts, setContacts] = useState<Resident['contacts']>([]);
  const [residentId, setResidentId] = useState<string>("");

  useEffect(() => {
    if (resident) {
      setName(resident.name);
      setCpf(resident.cpf);
      setBirthDate(resident.birthDate);
      setGender(resident.gender);
      setAddress(resident.address);
      setCity(resident.city);
      setState(resident.state);
      setZipCode(resident.zipCode);
      setPhone(resident.phone);
      setEmail(resident.email);
      setAdmissionDate(resident.admissionDate);
      setContacts(resident.contacts || []);
      setResidentId(resident.id);
    }
  }, [resident]);

  const validatePersonalInfo = () => {
    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return false;
    }

    if (!cpf.trim()) {
      toast.error("CPF é obrigatório");
      return false;
    }

    if (!birthDate) {
      toast.error("Data de nascimento é obrigatória");
      return false;
    }

    return true;
  };

  const validateContactInfo = () => {
    if (!address.trim()) {
      toast.error("Endereço é obrigatório");
      return false;
    }

    if (!city.trim()) {
      toast.error("Cidade é obrigatória");
      return false;
    }

    if (!state.trim()) {
      toast.error("Estado é obrigatório");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePersonalInfo() || !validateContactInfo()) {
      return;
    }

    setLoading(true);

    const residentData = {
      name,
      cpf,
      birthDate,
      gender,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      admissionDate,
      contacts,
    };

    try {
      if (isEditing && resident) {
        residentsStore.updateResident(resident.id, residentData);
        toast.success("Residente atualizado com sucesso");
      } else {
        const newResident = residentsStore.addResident(residentData);
        setResidentId(newResident.id);
        toast.success("Residente cadastrado com sucesso");
        setActiveTab("contacts"); // Switch to contacts tab for a new resident
      }
      
      if (!isEditing) {
        // If new resident, keep the form open to add contacts
        setIsEditing(true);
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving resident:", error);
      toast.error("Erro ao salvar residente");
    } finally {
      setLoading(false);
    }
  };

  // Keep track if we've saved the initial form
  const [isEditing, setIsEditing] = useState(!!resident);

  const formatCPF = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as CPF
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    } else if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
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

  // Reload contacts
  const handleContactsChange = () => {
    if (isEditing && residentId) {
      const updatedResident = residentsStore.getResidentById(residentId);
      if (updatedResident) {
        setContacts(updatedResident.contacts);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Residente" : "Novo Residente"}</CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="contact">Endereço e Contato</TabsTrigger>
            <TabsTrigger value="contacts" disabled={!isEditing}>
              Lista de Contatos
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-6">
          <TabsContent value="personal">
            <form onSubmit={(e) => { e.preventDefault(); setActiveTab("contact"); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    disabled={loading}
                    maxLength={14}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero</Label>
                  <Select value={gender} onValueChange={setGender} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admissionDate">Data de Admissão *</Label>
                  <Input
                    id="admissionDate"
                    type="date"
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
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
                >
                  Próximo
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="contact">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    disabled={loading}
                    maxLength={15}
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
              </div>

              <div className="flex justify-between pt-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("personal")}
                >
                  Anterior
                </Button>
                
                <div className="space-x-2">
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
                    {isEditing ? "Salvar" : "Salvar e Continuar"}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="contacts">
            {residentId ? (
              <div className="space-y-6">
                <ContactsList 
                  residentId={residentId} 
                  contacts={contacts}
                  onContactsChange={handleContactsChange}
                />
                
                <div className="flex justify-between pt-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("contact")}
                  >
                    Anterior
                  </Button>
                  
                  <Button
                    type="button"
                    className="bg-custom-blue hover:bg-custom-blue/90"
                    onClick={onSuccess}
                  >
                    Concluir
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>Salve os dados do residente primeiro para adicionar contatos.</p>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default ResidentForm;
