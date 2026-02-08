import React from "react";

interface Stat {
  value: string | number;
  label: string;
  color: string;
}

interface StatsBarProps {
  stats: Stat[];
}

/**
 * Statistics bar component for displaying metrics
 */
export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow"
        >
          <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
            {stat.value}
          </p>
          <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};
