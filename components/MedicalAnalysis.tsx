import React from "react";
import {
  FileText,
  Download,
  AlertTriangle,
  Activity,
  Pill,
  ClipboardList,
} from "lucide-react";
import { MedicalAnalysis as MedicalAnalysisType } from "@/lib/types";
import { Button } from "./ui/Button";
import { PDFGenerator } from "@/lib/pdfGenerator";

interface MedicalAnalysisProps {
  analysis: MedicalAnalysisType | null;
}

/**
 * Component for displaying medical analysis results
 */
export const MedicalAnalysis: React.FC<MedicalAnalysisProps> = ({
  analysis,
}) => {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <FileText className="w-20 h-20 text-gray-300 mb-4" />
        <p className="text-gray-400 italic text-center px-4">
          Record or type a consultation and click
          <br />
          <strong className="text-gray-500">"Generate Medical Notes"</strong> to
          see AI analysis
        </p>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    PDFGenerator.generate(analysis);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Patient Information */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-blue-900">Patient Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Name</p>
            <p className="font-semibold text-gray-800">
              {analysis.patientInfo?.name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Age</p>
            <p className="font-semibold text-gray-800">
              {analysis.patientInfo?.age || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Gender</p>
            <p className="font-semibold text-gray-800">
              {analysis.patientInfo?.gender || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* SOAP Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-gray-600" />
          SOAP Notes
        </h3>

        {/* S - Subjective */}
        <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 rounded-r-lg p-3">
          <h4 className="font-bold text-yellow-900 text-sm mb-2">
            S - Subjective (Chief Complaints)
          </h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {(analysis.symptoms || []).map((symptom, i) => (
              <li key={i} className="text-gray-700">
                {symptom}
              </li>
            ))}
          </ul>
        </div>

        {/* A - Assessment */}
        <div className="border-l-4 border-red-500 pl-4 bg-red-50 rounded-r-lg p-3">
          <h4 className="font-bold text-red-900 text-sm mb-2">
            A - Assessment (Diagnosis)
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {analysis.diagnosis}
          </p>
        </div>

        {/* P - Plan */}
        <div className="border-l-4 border-green-500 pl-4 bg-green-50 rounded-r-lg p-3">
          <h4 className="font-bold text-green-900 text-sm mb-3 flex items-center gap-2">
            <Pill className="w-4 h-4" />P - Plan (Prescription)
          </h4>
          <div className="space-y-3">
            {(analysis.medications || []).map((med, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-3 border border-green-200 hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-green-900 mb-2">{med.name}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Dosage:</span>
                    <p className="font-medium text-gray-800">{med.dosage}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Frequency:</span>
                    <p className="font-medium text-gray-800">{med.frequency}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="font-medium text-gray-800">{med.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-bold text-purple-900 mb-2 text-sm">
          📋 Instructions & Follow-up
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {analysis.instructions}
        </p>
      </div>

      {/* Drug Interaction Warning */}
      {analysis.medications && analysis.medications.length > 1 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 rounded-r-lg p-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-orange-900 text-sm">
              Drug Interaction Alert
            </p>
            <p className="text-xs text-orange-700 mt-1">
              Multiple medications prescribed. Please verify for potential drug
              interactions before dispensing.
            </p>
          </div>
        </div>
      )}

      {/* Download Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={handleDownloadPDF}
        className="w-full"
        icon={<Download className="w-5 h-5" />}
      >
        Download Prescription PDF
      </Button>

      {/* Disclaimer */}
      <div className="text-center">
        <p className="text-xs text-gray-500 italic">
          ⚠️ This prescription was generated using AI assistance. Please verify
          with a licensed physician.
        </p>
      </div>
    </div>
  );
};
