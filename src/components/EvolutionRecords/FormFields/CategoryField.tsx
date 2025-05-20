
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Check, X, AlertTriangle, Star } from "lucide-react";

interface CategoryOption {
  id: string;
  value: string;
  label: string;
  color?: string;
  icon?: string;
}

interface CategoryProps {
  category: {
    id: string;
    title: string;
    fieldType: string;
    placeholder?: string;
    options?: CategoryOption[];
    allowMultiple?: boolean;
  };
  formData: Record<string, any>;
  handleInputChange: (categoryId: string, value: any) => void;
  handleMultiOptionChange: (categoryId: string, optionValue: string) => void;
  loading: boolean;
}

const CategoryField = ({
  category,
  formData,
  handleInputChange,
  handleMultiOptionChange,
  loading,
}: CategoryProps) => {
  const getIconForOption = (iconName: string) => {
    switch (iconName) {
      case "check": return <Check size={16} className="animate-pulse text-green-600" />;
      case "x": return <X size={16} className="animate-bounce text-red-600" />;
      case "alert-triangle": return <AlertTriangle size={16} className="animate-pulse text-amber-600" />;
      default: return null;
    }
  };

  switch (category.fieldType) {
    case "text":
      return (
        <Textarea
          value={formData[category.id] || ""}
          onChange={(e) => handleInputChange(category.id, e.target.value)}
          disabled={loading}
          placeholder={category.placeholder || `Informe ${category.title.toLowerCase()}`}
          className="min-h-[80px]"
        />
      );

    case "number":
      return (
        <Input
          type="text"
          value={formData[category.id] || ""}
          onChange={(e) => handleInputChange(category.id, e.target.value)}
          disabled={loading}
          placeholder={category.placeholder || `Informe ${category.title.toLowerCase()}`}
        />
      );

    case "boolean":
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={!!formData[category.id]}
            onCheckedChange={(checked) =>
              handleInputChange(category.id, checked)
            }
            disabled={loading}
          />
          <Label>{formData[category.id] ? "Sim" : "Não"}</Label>
        </div>
      );

    case "rating":
      return (
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleInputChange(category.id, rating)}
              className={`p-1 ${
                formData[category.id] === rating
                  ? "text-custom-brown"
                  : "text-gray-300"
              } transition-transform hover:scale-110`}
              disabled={loading}
            >
              <div className="flex">
                {Array(rating)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        formData[category.id] === rating
                          ? "#A78C5D"
                          : "transparent"
                      }
                      className={formData[category.id] === rating ? "animate-pulse" : ""}
                    />
                  ))}
              </div>
            </button>
          ))}
        </div>
      );

    case "option":
      return category.options ? (
        <div className="flex flex-wrap gap-2">
          {category.options.map((option: any) => {
            const isSelected = category.allowMultiple
              ? (formData[category.id] || []).includes(option.value)
              : formData[category.id] === option.value;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  category.allowMultiple
                    ? handleMultiOptionChange(category.id, option.value)
                    : handleInputChange(category.id, option.value)
                }
                className={`evolution-option ${option.color || "bg-gray-100"} ${
                  isSelected ? "selected-option border-2 border-custom-blue" : ""
                } p-2 rounded-md flex items-center gap-2 text-sm transition-all hover:scale-105`}
                disabled={loading}
              >
                {isSelected ? (
                  getIconForOption(option.icon)
                ) : (
                  <div className="w-4 h-4"></div>
                )}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null;

    default:
      return null;
  }
};

export default CategoryField;
