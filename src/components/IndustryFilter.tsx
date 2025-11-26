import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export interface IndustryOption {
  id: string;
  name: string;
}

interface IndustryFilterProps {
  industries: IndustryOption[];
  value: string;
  onChange: (industryId: string) => void;
}

export default function IndustryFilter({ industries, value, onChange }: IndustryFilterProps) {
  const { isDarkMode } = useTheme();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 rounded-md text-sm border focus:outline-none focus:ring-2 transition-colors ${
        isDarkMode
          ? 'bg-gray-800 text-gray-200 border-gray-700 focus:ring-blue-700'
          : 'bg-white text-gray-800 border-gray-300 focus:ring-blue-300'
      }`}
    >
      {industries.map((ind) => (
        <option key={ind.id} value={ind.id}>
          {ind.name}
        </option>
      ))}
    </select>
  );
}


