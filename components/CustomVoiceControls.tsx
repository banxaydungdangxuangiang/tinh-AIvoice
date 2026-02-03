import React, { useState } from 'react';
import { CustomVoiceConfig, SavedPreset } from '../types';
import {
  GENDER_OPTIONS,
  AGE_OPTIONS,
  TEXTURE_OPTIONS,
  REGION_OPTIONS,
  EMOTION_OPTIONS,
  STYLE_OPTIONS,
  RATE_OPTIONS,
  PITCH_OPTIONS,
  PAUSING_OPTIONS,
  VOLUME_OPTIONS,
  REVERB_OPTIONS,
  EMPHASIS_OPTIONS,
} from '../constants';

interface CustomVoiceControlsProps {
  config: CustomVoiceConfig;
  // FIX: Corrected typo from CustomVoice_Config to CustomVoiceConfig
  onConfigChange: (newConfig: CustomVoiceConfig) => void;
  disabled?: boolean;
  presets: SavedPreset[];
  onSave: () => void;
  onLoad: (config: CustomVoiceConfig) => void;
  onDelete: (name: string) => void;
}

const CustomVoiceControls: React.FC<CustomVoiceControlsProps> = ({ 
  config, onConfigChange, disabled, presets, onSave, onLoad, onDelete 
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  
  const handleChange = (field: keyof CustomVoiceConfig, value: string) => {
    onConfigChange({ ...config, [field]: value });
  };

  const handlePresetChange = (name: string) => {
    setSelectedPreset(name);
    const preset = presets.find(p => p.name === name);
    if (preset) {
      onLoad(preset.config);
    }
  };

  const renderSelect = (
    id: string,
    label: string,
    options: { label: string; value: string }[],
    field: keyof CustomVoiceConfig
  ) => (
    <div className="flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(33.33%-1rem)]">
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={config[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        disabled={disabled}
        className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderGroup = (title: string, children: React.ReactNode) => (
    <fieldset className="border border-gray-700 p-4 rounded-lg">
      <legend className="px-2 text-base font-semibold text-gray-300">{title}</legend>
      <div className="flex flex-wrap gap-4 pt-2">
        {children}
      </div>
    </fieldset>
  );

  return (
    <div className="space-y-6">
      {renderGroup('Quản lý Giọng nói', (
         <div className="w-full flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow w-full">
              <label htmlFor="preset-select" className="block text-sm font-medium text-gray-400 mb-1">
                Tải giọng nói đã lưu
              </label>
              <select 
                id="preset-select" 
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                disabled={disabled || presets.length === 0}
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled={presets.length > 0}>-- Chọn để tải --</option>
                {presets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={onSave} disabled={disabled} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50">Lưu giọng này</button>
              <button 
                onClick={() => selectedPreset && onDelete(selectedPreset)} 
                disabled={disabled || !selectedPreset} 
                className="flex-1 bg-red-800 hover:bg-red-900 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50"
              >
                Xóa
              </button>
            </div>
         </div>
      ))}

      {renderGroup('Nhận Dạng Nhân Vật', (
        <>
          {renderSelect('gender-select', 'Giới tính', GENDER_OPTIONS, 'gender')}
          {renderSelect('age-select', 'Độ tuổi', AGE_OPTIONS, 'age')}
          {renderSelect('texture-select', 'Chất giọng', TEXTURE_OPTIONS, 'texture')}
          {renderSelect('region-select', 'Vùng miền', REGION_OPTIONS, 'region')}
        </>
      ))}
      
      {renderGroup('Trạng Thái Cảm Xúc & Phong Cách', (
        <>
          {renderSelect('emotion-select', 'Cảm xúc', EMOTION_OPTIONS, 'emotion')}
          {renderSelect('style-select', 'Phong cách', STYLE_OPTIONS, 'style')}
        </>
      ))}

       {renderGroup('Điều Khiển Kỹ Thuật', (
        <>
          {renderSelect('rate-select', 'Tốc độ nói', RATE_OPTIONS, 'rate')}
          {renderSelect('pitch-select', 'Độ cao giọng', PITCH_OPTIONS, 'pitch')}
          {renderSelect('pausing-select', 'Ngắt nghỉ', PAUSING_OPTIONS, 'pausing')}
          {renderSelect('volume-select', 'Âm lượng', VOLUME_OPTIONS, 'volume')}
          {renderSelect('reverb-select', 'Độ vang', REVERB_OPTIONS, 'reverb')}
          {renderSelect('emphasis-select', 'Mức độ nhấn nhá', EMPHASIS_OPTIONS, 'emphasis')}
        </>
      ))}
    </div>
  );
};

export default CustomVoiceControls;