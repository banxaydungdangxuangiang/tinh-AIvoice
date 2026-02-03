
import React from 'react';
import { PrebuiltVoice } from '../types';
import { VOICE_OPTIONS } from '../constants';

interface VoiceSelectorProps {
  selectedVoice: PrebuiltVoice;
  onVoiceChange: (voice: PrebuiltVoice) => void;
  disabled?: boolean;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onVoiceChange, disabled }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="voice-selector" className="font-semibold text-gray-300">
        Chọn một giọng có sẵn
      </label>
      <select
        id="voice-selector"
        value={selectedVoice}
        onChange={(e) => onVoiceChange(e.target.value as PrebuiltVoice)}
        disabled={disabled}
        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
        }}
      >
        {VOICE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} - {option.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VoiceSelector;
