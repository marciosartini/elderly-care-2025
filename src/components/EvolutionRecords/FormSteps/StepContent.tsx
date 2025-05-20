
import { Label } from "@/components/ui/label";
import CategoryField from "../FormFields/CategoryField";

interface StepContentProps {
  categories: any[];
  formData: Record<string, any>;
  handleInputChange: (categoryId: string, value: any) => void;
  handleMultiOptionChange: (categoryId: string, optionValue: string) => void;
  loading: boolean;
}

const StepContent = ({
  categories,
  formData,
  handleInputChange,
  handleMultiOptionChange,
  loading,
}: StepContentProps) => {
  return (
    <div className="space-y-8">
      {categories.map((category: any) => (
        <div key={category.id} className="space-y-2">
          <Label>{category.title}</Label>
          <CategoryField 
            category={category}
            formData={formData}
            handleInputChange={handleInputChange}
            handleMultiOptionChange={handleMultiOptionChange}
            loading={loading}
          />
        </div>
      ))}
    </div>
  );
};

export default StepContent;
