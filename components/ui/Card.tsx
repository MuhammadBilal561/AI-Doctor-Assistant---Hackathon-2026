import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient";
  padding?: "sm" | "md" | "lg";
}

/**
 * Reusable Card component for content containers
 */
export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  padding = "md",
}) => {
  const baseStyles = "rounded-2xl shadow-xl";

  const variantStyles = {
    default: "bg-white",
    gradient:
      "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100",
  };

  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Card Header component
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  icon,
}) => {
  return (
    <div className={cn("flex items-center gap-2 mb-6", className)}>
      {icon}
      <h2 className="text-2xl font-bold text-gray-800">{children}</h2>
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card Content component
 */
export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => {
  return <div className={cn("space-y-6", className)}>{children}</div>;
};
