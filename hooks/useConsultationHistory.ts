import { useState, useEffect, useCallback } from "react";
import { Consultation } from "@/lib/types";
import { StorageService } from "@/lib/storageService";

interface UseConsultationHistoryReturn {
  consultations: Consultation[];
  saveConsultation: (consultation: Consultation) => void;
  deleteConsultation: (id: string) => void;
  clearHistory: () => void;
  stats: {
    total: number;
    timeSaved: number;
    lastConsultation: string;
  };
}

/**
 * Custom hook for managing consultation history
 */
export const useConsultationHistory = (): UseConsultationHistoryReturn => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  // Load consultations on mount
  useEffect(() => {
    const loaded = StorageService.getConsultations();
    setConsultations(loaded);
  }, []);

  const saveConsultation = useCallback((consultation: Consultation) => {
    const updated = StorageService.saveConsultation(consultation);
    setConsultations(updated);
  }, []);

  const deleteConsultation = useCallback((id: string) => {
    const updated = StorageService.deleteConsultation(id);
    setConsultations(updated);
  }, []);

  const clearHistory = useCallback(() => {
    StorageService.clearAll();
    setConsultations([]);
  }, []);

  const stats = StorageService.getStats();

  return {
    consultations,
    saveConsultation,
    deleteConsultation,
    clearHistory,
    stats,
  };
};
