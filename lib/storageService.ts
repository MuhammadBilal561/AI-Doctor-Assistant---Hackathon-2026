import { Consultation } from "./types";

const STORAGE_KEY = "consultations";
const MAX_CONSULTATIONS = 20;

/**
 * Service for managing consultation storage
 */
export class StorageService {
  /**
   * Get all consultations from localStorage
   */
  static getConsultations(): Consultation[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading consultations:", error);
      return [];
    }
  }

  /**
   * Save a new consultation
   */
  static saveConsultation(consultation: Consultation): Consultation[] {
    try {
      const existing = this.getConsultations();
      const updated = [consultation, ...existing].slice(0, MAX_CONSULTATIONS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Error saving consultation:", error);
      return this.getConsultations();
    }
  }

  /**
   * Delete a consultation by ID
   */
  static deleteConsultation(id: string): Consultation[] {
    try {
      const existing = this.getConsultations();
      const updated = existing.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Error deleting consultation:", error);
      return this.getConsultations();
    }
  }

  /**
   * Clear all consultations
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing consultations:", error);
    }
  }

  /**
   * Get consultation statistics
   */
  static getStats() {
    const consultations = this.getConsultations();
    return {
      total: consultations.length,
      timeSaved: consultations.length * 30, // Assume 30 min saved per consultation
      lastConsultation: consultations[0]?.date || "N/A",
    };
  }
}
