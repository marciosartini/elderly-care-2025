
import { useState } from "react";
import { EvolutionEntry } from "@/lib/evolutionStore";

export const useEvolutionRecordsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewingEvolution, setViewingEvolution] = useState<EvolutionEntry | null>(null);

  const handleAddClick = () => {
    setViewingEvolution(null);
    setShowForm(true);
  };

  const handleViewEvolution = (evolution: EvolutionEntry) => {
    setViewingEvolution(evolution);
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
  };

  const handleBackToList = () => {
    setViewingEvolution(null);
  };

  return {
    showForm,
    viewingEvolution,
    handleAddClick,
    handleViewEvolution,
    handleFormCancel,
    handleFormSuccess,
    handleBackToList,
  };
};
