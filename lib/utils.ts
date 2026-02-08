/**
 * Utility functions for the application
 */

/**
 * Formats a date to a readable string
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Truncates text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Validates if a transcript has minimum required content
 */
export const isValidTranscript = (transcript: string): boolean => {
  return transcript.trim().length >= 20; // Minimum 20 characters
};

/**
 * Classnames utility for conditional CSS classes
 */
export const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Sanitizes user input
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};
