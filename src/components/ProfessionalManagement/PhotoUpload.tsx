
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Image } from "lucide-react";
import { toast } from "sonner";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface PhotoUploadProps {
  photoPreview: string | null;
  setPhotoPreview: React.Dispatch<React.SetStateAction<string | null>>;
  form: UseFormReturn<any>;
}

const PhotoUpload = ({ photoPreview, setPhotoPreview, form }: PhotoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }
    
    // Check file type (allow only images)
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setPhotoPreview(imageUrl);
      form.setValue("photo", imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <FormField
      control={form.control}
      name="photo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Foto do Profissional</FormLabel>
          <FormControl>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border">
                  <AvatarImage src={photoPreview || "/placeholder.svg"} alt="Foto do profissional" />
                  <AvatarFallback>
                    <Image className="w-6 h-6 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={triggerFileUpload}
                  className="flex gap-2 items-center"
                >
                  <Upload className="h-4 w-4" />
                  Selecionar Imagem
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB
              </p>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhotoUpload;
