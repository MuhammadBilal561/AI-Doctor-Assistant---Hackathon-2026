import React from "react";
import { Consultation } from "@/lib/types";
import { formatDate, truncateText } from "@/lib/utils";
import { History, Trash2 } from "lucide-react";

interface ConsultationHistoryProps {
  consultations: Consultation[];
  onLoad: (consultation: Consultation) => void;
  onDelete?: (id: string) => void;
  isOpen: boolean;
}

/**
 * Component for displaying consultation history
 */
export const ConsultationHistory: React.FC<ConsultationHistoryProps> = ({
  consultations,
  onLoad,
  onDelete,
  isOpen,
}) => {
  if (!isOpen || consultations.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 max-h-64 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800">Recent Consultations</h3>
      </div>

      <div className="space-y-2">
        {consultations.map((consultation) => (
          <div
            key={consultation.id}
            className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between gap-2">
              <button
                onClick={() => onLoad(consultation)}
                className="flex-1 text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-blue-600">
                    {consultation.analysis.patientInfo?.name ||
                      "Unknown Patient"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(consultation.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {truncateText(consultation.transcript, 100)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Diagnosis:{" "}
                  {truncateText(consultation.analysis.diagnosis || "N/A", 50)}
                </p>
              </button>

              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Delete this consultation?")) {
                      onDelete(consultation.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
