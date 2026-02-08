"use client";

import { useState, useEffect } from "react";
import { Sparkles, FileText, Keyboard, Mic, History } from "lucide-react";
import {
  MedicalAnalysis as MedicalAnalysisType,
  Consultation,
} from "@/lib/types";
import { generateId, isValidTranscript, sanitizeInput } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useConsultationHistory } from "@/hooks/useConsultationHistory";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatsBar } from "@/components/StatsBar";
import { ConsultationHistory } from "@/components/ConsultationHistory";
import { ConsultationInput } from "@/components/ConsultationInput";
import { MedicalAnalysis } from "@/components/MedicalAnalysis";
import { APP_METADATA } from "@/constants/demoData";

/**
 * Main application page
 */
export default function Home() {
  // State management
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState<MedicalAnalysisType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useManualInput, setUseManualInput] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Custom hooks
  const {
    transcript: voiceTranscript,
    isRecording,
    error: micError,
    startRecording,
    stopRecording,
    resetTranscript,
  } = useSpeechRecognition();

  const { consultations, saveConsultation, deleteConsultation, stats } =
    useConsultationHistory();

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync voice transcript with manual transcript - MOVED TO useEffect
  useEffect(() => {
    if (voiceTranscript && !useManualInput && voiceTranscript !== transcript) {
      setTranscript(voiceTranscript);
    }
  }, [voiceTranscript, useManualInput]);

  /**
   * Handle consultation analysis
   */
  const handleAnalyze = async () => {
    const sanitized = sanitizeInput(transcript);

    if (!isValidTranscript(sanitized)) {
      alert(
        "Please provide a valid consultation transcript (minimum 20 characters)",
      );
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: sanitized }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data as MedicalAnalysisType);

      // Save to history
      const consultation: Consultation = {
        id: generateId(),
        date: new Date().toLocaleString(),
        timestamp: Date.now(),
        transcript: sanitized,
        analysis: data,
      };

      saveConsultation(consultation);
    } catch (error: any) {
      console.error("Analysis error:", error);
      alert(
        `Error: ${error.message}\n\nPlease try again or check your internet connection.`,
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Load a consultation from history
   */
  const handleLoadConsultation = (consultation: Consultation) => {
    setTranscript(consultation.transcript);
    setAnalysis(consultation.analysis);
    setShowHistory(false);
  };

  /**
   * Toggle between voice and manual input
   */
  const handleToggleInputMode = () => {
    if (!useManualInput && isRecording) {
      stopRecording();
    }
    setUseManualInput(!useManualInput);
    if (useManualInput) {
      resetTranscript();
    }
  };

  /**
   * Handle voice recording start
   */
  const handleStartRecording = async () => {
    setTranscript("");
    setAnalysis(null);
    await startRecording();
  };

  // Stats for display - only show after mount to prevent hydration mismatch
  const displayStats = mounted
    ? [
        { value: stats.total, label: "Consultations", color: "text-blue-600" },
        {
          value: `${stats.timeSaved} min`,
          label: "Time Saved",
          color: "text-green-600",
        },
        { value: "100%", label: "Accuracy", color: "text-purple-600" },
      ]
    : [
        { value: 0, label: "Consultations", color: "text-blue-600" },
        { value: "0 min", label: "Time Saved", color: "text-green-600" },
        { value: "100%", label: "Accuracy", color: "text-purple-600" },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {APP_METADATA.name}
            </h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg px-4">
            {APP_METADATA.description}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            🏆 {APP_METADATA.author} | Powered by Groq AI
          </p>
        </header>

        {/* Statistics Bar */}
        <StatsBar stats={displayStats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Input Section */}
          <Card padding="lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <CardHeader
                icon={
                  useManualInput ? (
                    <Keyboard className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )
                }
              >
                Live Consultation
              </CardHeader>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  icon={<History className="w-4 h-4" />}
                  className="flex-1 sm:flex-none"
                >
                  History
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleToggleInputMode}
                  className="flex-1 sm:flex-none"
                >
                  {useManualInput ? "🎤 Voice" : "⌨️ Type"}
                </Button>
              </div>
            </div>

            {/* Consultation History */}
            <ConsultationHistory
              consultations={consultations}
              onLoad={handleLoadConsultation}
              onDelete={deleteConsultation}
              isOpen={showHistory}
            />

            {/* Microphone Error */}
            {micError && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">{micError}</p>
              </div>
            )}

            {/* Input Component */}
            <CardContent>
              <ConsultationInput
                transcript={transcript}
                onTranscriptChange={setTranscript}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                isRecording={isRecording}
                onStartRecording={handleStartRecording}
                onStopRecording={stopRecording}
                useManualInput={useManualInput}
                onToggleInputMode={handleToggleInputMode}
              />
            </CardContent>
          </Card>

          {/* Analysis Section */}
          <Card padding="lg">
            <CardHeader icon={<FileText className="w-6 h-6" />}>
              Medical Documentation
            </CardHeader>

            <CardContent>
              <MedicalAnalysis analysis={analysis} />
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 pb-4">
          <p className="text-xs text-gray-500">
            {APP_METADATA.tagline} • Version {APP_METADATA.version}
          </p>
        </footer>
      </div>
    </div>
  );
}
