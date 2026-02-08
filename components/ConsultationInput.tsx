import React, { useState } from "react";
import { Mic, Square, Keyboard, Sparkles } from "lucide-react";
import { TextArea } from "./ui/Input";
import { Button } from "./ui/Button";
import { DEMO_CONSULTATION } from "@/constants/demoData";

interface ConsultationInputProps {
  transcript: string;
  onTranscriptChange: (transcript: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  useManualInput: boolean;
  onToggleInputMode: () => void;
}

/**
 * Component for consultation input (voice or text)
 */
export const ConsultationInput: React.FC<ConsultationInputProps> = ({
  transcript,
  onTranscriptChange,
  onAnalyze,
  isAnalyzing,
  isRecording,
  onStartRecording,
  onStopRecording,
  useManualInput,
  onToggleInputMode,
}) => {
  const [showDemo, setShowDemo] = useState(false);

  const loadDemo = () => {
    onTranscriptChange(DEMO_CONSULTATION);
    setShowDemo(false);
  };

  return (
    <div className="space-y-4">
      {/* Voice Recording Mode */}
      {!useManualInput && (
        <div className="flex flex-col items-center gap-6 py-8">
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 animate-pulse scale-110"
                : "bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105"
            } text-white shadow-2xl`}
          >
            {isRecording ? (
              <Square className="w-12 h-12" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </button>

          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">
              {isRecording ? "🔴 Recording..." : "Click to Start Recording"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isRecording
                ? "Speak clearly near your microphone"
                : "Tap the microphone to begin"}
            </p>
          </div>
        </div>
      )}

      {/* Transcript Display/Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold text-gray-700">
            {useManualInput ? "Consultation Transcript" : "Live Transcript"}
          </label>
          {useManualInput && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                {showDemo ? "Hide" : "Show"} Demo
              </button>
              <button
                onClick={loadDemo}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg transition-colors"
              >
                Load Demo
              </button>
            </div>
          )}
        </div>

        {showDemo && useManualInput && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800 font-medium mb-1">
              📝 Demo Consultation Preview:
            </p>
            <p className="text-xs text-gray-600 line-clamp-3">
              {DEMO_CONSULTATION}
            </p>
          </div>
        )}

        {useManualInput ? (
          <TextArea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder={`Type or paste the doctor-patient consultation here...

Example format:
Doctor: Good morning, what brings you in today?
Patient: I've had a fever for 3 days...
Doctor: Any other symptoms?
Patient: Yes, headache and body aches.
Doctor: I'll prescribe paracetamol for the fever...`}
            className="min-h-[300px] font-mono text-sm"
          />
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto border border-gray-200">
            {transcript ? (
              <p className="text-gray-800 whitespace-pre-wrap font-mono text-sm">
                {transcript}
              </p>
            ) : (
              <p className="text-gray-400 italic text-center py-8">
                Start recording to see live transcription...
              </p>
            )}
          </div>
        )}

        {transcript && (
          <p className="text-xs text-gray-500 mt-2">
            {transcript.length} characters • ~
            {Math.ceil(transcript.split(" ").length / 150)} min read
          </p>
        )}
      </div>

      {/* Analyze Button */}
      <Button
        variant="success"
        size="lg"
        onClick={onAnalyze}
        isLoading={isAnalyzing}
        disabled={!transcript.trim() || isAnalyzing}
        className="w-full"
        icon={<Sparkles className="w-5 h-5" />}
      >
        {isAnalyzing ? "Analyzing with AI..." : "Generate Medical Notes"}
      </Button>
    </div>
  );
};
