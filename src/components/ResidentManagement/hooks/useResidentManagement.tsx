
import { useState } from "react";
import { Resident, Contact, residentsStore } from "@/lib/residentStore";
import { toast } from "sonner";

export const useResidentManagement = () => {
  const [showResidentForm, setShowResidentForm] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | undefined>(undefined);
  const [viewMode, setViewMode] = useState(false);

  const handleAddResidentClick = () => {
    setSelectedResident(undefined);
    setShowResidentForm(true);
    setViewMode(false);
  };

  const handleEditResident = (resident: Resident) => {
    setSelectedResident(resident);
    setShowResidentForm(true);
    setViewMode(false);
  };

  const handleViewResident = (resident: Resident) => {
    setSelectedResident(resident);
    setShowResidentForm(false);
    setViewMode(true);
  };

  const handleResidentFormCancel = () => {
    setShowResidentForm(false);
    setSelectedResident(undefined);
  };

  const handleResidentFormSuccess = () => {
    setShowResidentForm(false);
    setSelectedResident(undefined);
  };

  const handleBackToList = () => {
    setShowResidentForm(false);
    setSelectedResident(undefined);
    setViewMode(false);
  };

  return {
    showResidentForm,
    selectedResident,
    viewMode,
    handleAddResidentClick,
    handleEditResident,
    handleViewResident,
    handleResidentFormCancel,
    handleResidentFormSuccess,
    handleBackToList
  };
};
