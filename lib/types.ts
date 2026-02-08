// Core types for the application

export interface PatientInfo {
  name: string;
  age: string;
  gender: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface MedicalAnalysis {
  patientInfo: PatientInfo;
  symptoms: string[];
  diagnosis: string;
  medications: Medication[];
  instructions: string;
}

export interface Consultation {
  id: string;
  date: string;
  timestamp: number;
  transcript: string;
  analysis: MedicalAnalysis;
}

export interface AnalysisResponse {
  patientInfo?: PatientInfo;
  symptoms?: string[];
  diagnosis?: string;
  medications?: Medication[];
  instructions?: string;
  error?: string;
  details?: string;
}
