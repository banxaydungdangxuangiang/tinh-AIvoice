
// Fix: Import dependencies as ES modules instead of accessing them from the global scope.
import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Modality } from '@google/genai';


// ===================================================================================
// MERGED FILE CONTENT
// All local modules have been combined into this single file to work on GitHub Pages
// ===================================================================================

// --- From: types.ts ---
enum PrebuiltVoice {
  Kore = 'Kore',
  Puck = 'Puck',
  Charon = 'Charon',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr',
}

enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

enum GenerationMode {
  Prebuilt = 'prebuilt',
  Custom = 'custom',
}

interface CustomVoiceConfig {
  gender: string;
  age: string;
  texture: string;
  region: string;
  emotion: string;
  style: string;
  rate: string;
  pitch: string;
  pausing: string;
  volume: string;
  reverb: string;
  emphasis: string;
}

interface SavedPreset {
  name: string;
  config: CustomVoiceConfig;
}

type GenerationParams =
  | { mode: GenerationMode.Prebuilt; voice: PrebuiltVoice }
  | { mode: GenerationMode.Custom; config: CustomVoiceConfig };


// --- From: constants.ts ---
interface VoiceOption {
  value: PrebuiltVoice;
  label: string;
  description: string;
}

const VOICE_OPTIONS: VoiceOption[] = [
  { value: PrebuiltVoice.Kore, label: 'Kore', description: 'Một giọng nói điềm tĩnh và chuyên nghiệp.' },
  { value: PrebuiltVoice.Puck, label: 'Puck', description: 'Một giọng nói thân thiện và tràn đầy năng lượng.' },
  { value: PrebuiltVoice.Charon, label: 'Charon', description: 'Một giọng nói trầm và vang.' },
  { value: PrebuiltVoice.Fenrir, label: 'Fenrir', description: 'Một giọng nói rõ ràng và quyết đoán.' },
  { value: PrebuiltVoice.Zephyr, label: 'Zephyr', description: 'Một giọng nói ấm áp và nhẹ nhàng.' },
];

interface CustomOption {
  label: string;
  value: string;
  prompt: string;
}

const GENDER_OPTIONS: CustomOption[] = [ { label: 'Nữ', value: 'female', prompt: 'Female' }, { label: 'Nam', value: 'male', prompt: 'Male' }, { label: 'Trung tính', value: 'androgynous', prompt: 'Androgynous' },];
const AGE_OPTIONS: CustomOption[] = [ { label: 'Trưởng thành - Giọng hiện đại, rõ ràng', value: 'young adult', prompt: 'Young Adult (a modern, clear voice)' }, { label: 'Trẻ em - Giọng cao, trong, thơ ngây', value: 'child', prompt: 'Child (a high-pitched, clear, innocent voice)' }, { label: 'Thanh thiếu niên - Giọng năng động', value: 'teenager', prompt: 'Teenager (an energetic voice)' }, { label: 'Trung niên - Giọng trầm, đĩnh đạc', value: 'middle-aged', prompt: 'Middle-aged (a deeper, mature, and confident voice)' }, { label: 'Người già - Giọng chậm, trải đời', value: 'senior', prompt: 'Senior (a slow, experienced voice, possibly with a slight tremor)' },];
const TEXTURE_OPTIONS: CustomOption[] = [ { label: 'Mượt mà - Không có tạp âm', value: 'smooth', prompt: 'Smooth (a clear voice with no raspiness)' }, { label: 'Ấm - Tạo cảm giác tin cậy', value: 'warm', prompt: 'Warm (a trustworthy and friendly tone)' }, { label: 'Khàn - Nghe phong trần', value: 'hoarse/raspy', prompt: 'Hoarse/Raspy (a rough, gravelly voice)' }, { label: 'Mỏng/Cao - Nhẹ nhàng, bay bổng', value: 'thin/high-pitched', prompt: 'Thin/High-pitched (a light, airy voice)' }, { label: 'Dày/Trầm - Quyền lực, vang', value: 'deep/resonant', prompt: 'Deep/Resonant (a powerful, booming voice)' },];
const REGION_OPTIONS: CustomOption[] = [ { label: 'Miền Bắc', value: 'Northern Vietnamese', prompt: 'Northern Vietnamese Accent' }, { label: 'Miền Nam', value: 'Southern Vietnamese', prompt: 'Southern Vietnamese Accent' }, { label: 'Miền Trung', value: 'Central Vietnamese', prompt: 'Central Vietnamese Accent' },];
const EMOTION_OPTIONS: CustomOption[] = [ { label: 'Trung tính', value: 'neutral', prompt: 'Neutral' }, { label: 'Hạnh phúc - Giọng tươi tắn', value: 'happy', prompt: 'Happy (a bright, cheerful tone)' }, { label: 'Hào hứng - Tốc độ nhanh, nhấn mạnh', value: 'excited', prompt: 'Excited (an energetic, fast-paced tone with high inflection)' }, { label: 'Biết ơn - Giọng mềm, ấm', value: 'grateful', prompt: 'Grateful (a soft, warm, and sincere tone)' }, { label: 'Hài hước/Châm biếm - Biến đổi cao độ', value: 'sarcastic/witty', prompt: 'Sarcastic/Witty (a voice with ironic pitch changes)' }, { label: 'Buồn - Giọng trầm, kéo dài', value: 'sad', prompt: 'Sad (a low-pitched, slow, somber tone)' }, { label: 'Giận dữ - Giọng gằn, dồn dập', value: 'angry', prompt: 'Angry (a harsh, sharp, and fast-paced tone)' }, { label: 'Lo lắng - Giọng hơi run, ngắt quãng', value: 'anxious', prompt: 'Anxious (a slightly trembling, hesitant voice)' }, { label: 'Mệt mỏi - Giọng thều thào, thiếu hơi', value: 'tired', prompt: 'Tired (a low-energy, breathy voice)' }, { label: 'Nghiêm túc - Cứng rắn, dứt khoát', value: 'serious', prompt: 'Serious (a firm, steady, and resolute tone)' }, { label: 'Tò mò - Lên giọng ở cuối câu', value: 'curious', prompt: 'Curious (a voice with rising intonation, especially at the end of sentences)' }, { label: 'Thì thầm - Sử dụng nhiều hơi', value: 'whispering', prompt: 'Whispering (a very quiet, breathy voice)' },];
const STYLE_OPTIONS: CustomOption[] = [ { label: 'Trò chuyện - Như bạn bè', value: 'conversational', prompt: 'Conversational (like talking to a friend)' }, { label: 'Phát thanh viên - Chuẩn mực, trang trọng', value: 'news anchor', prompt: 'News Anchor (formal, standard, and authoritative)' }, { label: 'Quảng cáo - Năng lượng, lôi cuốn', value: 'commercial/sales', prompt: 'Commercial/Sales (energetic, persuasive, and engaging)' }, { label: 'Phóng sự - Chậm rãi, uyên bác', value: 'documentary', prompt: 'Documentary (slow, deliberate, and knowledgeable)' }, { label: 'Kể chuyện đêm khuya - Ru ngủ, êm ái', value: 'bedtime story', prompt: 'Bedtime Story (soothing, gentle, and calm)' }, { label: 'Kịch tính - Biến đổi âm lượng lớn', value: 'dramatic', prompt: 'Dramatic (large variations in volume and emotion)' }, { label: 'Thuyết trình - Rõ ràng, nhấn mạnh ý chính', value: 'presentation', prompt: 'Presentation (clear, confident, with emphasis on key points)' }, { label: 'Hướng dẫn - Kiên nhẫn, tốc độ vừa phải', value: 'instructional/tutorial', prompt: 'Instructional/Tutorial (patient and clear with a moderate pace)' }, { label: 'Lễ tân - Lịch sự, chuyên nghiệp', value: 'concierge', prompt: 'Concierge (polite, professional, and helpful)' },];
const RATE_OPTIONS: CustomOption[] = [ { label: 'Vừa (1.0x)', value: 'normal', prompt: 'Normal (1.0x)' }, { label: 'Chậm', value: 'slow', prompt: 'Slow' }, { label: 'Cực chậm (0.8x)', value: 'very slow', prompt: 'Very Slow (0.8x)' }, { label: 'Nhanh (1.2x)', value: 'fast', prompt: 'Fast (1.2x)' },];
const PITCH_OPTIONS: CustomOption[] = [ { label: 'Trung bình', value: 'medium pitch', prompt: 'Medium Pitch' }, { label: 'Rất trầm', value: 'very low pitch', prompt: 'Very Low Pitch' }, { label: 'Trầm', value: 'low pitch', prompt: 'Low Pitch' }, { label: 'Cao', value: 'high pitch', prompt: 'High Pitch' }, { label: 'Rất cao (the thé)', value: 'very high pitch', prompt: 'Very High Pitch' },];
const PAUSING_OPTIONS: CustomOption[] = [ { label: 'Tự nhiên - Ngắt nghỉ theo dấu câu', value: 'natural pauses', prompt: 'Natural pauses (based on punctuation)' }, { label: 'Liên tục - Không nghỉ', value: 'no pauses', prompt: 'No pauses (continuous speech)' }, { label: 'Sâu - Có tiếng lấy hơi', value: 'deep breathing', prompt: 'Deep breathing (audible breaths between phrases)' },];
const VOLUME_OPTIONS: CustomOption[] = [ { label: 'Vừa', value: 'standard volume', prompt: 'Standard Volume' }, { label: 'Nhỏ', value: 'soft volume', prompt: 'Soft Volume' }, { label: 'Mạnh', value: 'loud volume', prompt: 'Loud Volume' },];
const REVERB_OPTIONS: CustomOption[] = [ { label: 'Phòng kín - Không vang (podcast, trợ lý ảo)', value: 'a dry room (no reverb)', prompt: 'Dry Room (no reverb, suitable for podcasts or virtual assistants)' }, { label: 'Phòng nhỏ - Vang nhẹ (trò chuyện)', value: 'a small room reverb', prompt: 'Small Room Reverb (light echo, suitable for indoor conversations)' }, { label: 'Hội trường lớn - Vang rộng (diễn thuyết)', value: 'a large hall reverb', prompt: 'Large Hall Reverb (wide echo, suitable for speeches)' }, { label: 'Hang động - Vang kéo dài (truyện kỳ bí)', value: 'a cave/tunnel reverb', prompt: 'Cave/Tunnel Reverb (long echo, suitable for mystery stories)' }, { label: 'Thông báo công cộng - Vang có độ trễ', value: 'a public announcement echo', prompt: 'Public Announcement Echo (echo with a delay)' },];
const EMPHASIS_OPTIONS: CustomOption[] = [ { label: 'Tự nhiên - Theo ngữ pháp', value: 'natural emphasis', prompt: 'Natural (emphasis follows normal grammatical rules)' }, { label: 'Phẳng - Không nhấn nhá (đọc danh sách)', value: 'monotone emphasis', prompt: 'Monotone (no emphasis, suitable for reading lists or codes)' }, { label: 'Truyền cảm - Nhấn vào tính từ (kể chuyện)', value: 'expressive emphasis', prompt: 'Expressive (emphasizes adjectives and adverbs, suitable for storytelling)' }, { label: 'Thuyết phục - Nhấn vào từ khóa (quảng cáo)', value: 'persuasive emphasis', prompt: 'Persuasive (emphasizes keywords and brand names, suitable for advertising)' },];


// --- From: utils/audioUtils.ts ---
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function pcmToWavBlob(base64Pcm: string): Blob {
  const pcmData = decodeBase64(base64Pcm);
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.length;
  const fileSize = 36 + dataSize;

  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, fileSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  return new Blob([view, pcmData], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}


// --- From: services/geminiService.ts ---
const transcribeAudio = async (
  ai: GoogleGenAI,
  audioPart: { inlineData: { mimeType: string; data: string } }
): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: 'Hãy phiên âm đoạn âm thanh sau đây thành văn bản:' },
        audioPart
      ],
    },
  });

  const transcription = response.text;
  if (!transcription) {
    throw new Error('Không thể phiên âm âm thanh. Phản hồi trống.');
  }
  return transcription;
};

const generateSpeech = async (
  ai: GoogleGenAI,
  text: string,
  params: GenerationParams
): Promise<string> => {
  const model = "gemini-2.5-flash-preview-tts";
  let contents, config;

  if (params.mode === GenerationMode.Prebuilt) {
    contents = [{ parts: [{ text }] }];
    config = {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: params.voice },
        },
      },
    };
  } else {
    const { gender, age, texture, region, emotion, style, rate, pitch, pausing, volume, reverb, emphasis } = params.config;
    const getPrompt = (options: {label: string, value: string, prompt: string}[], value: string) => 
      options.find(o => o.value === value)?.prompt || value;

    const descriptivePrompt = `
VOICE PROFILE:
- GENDER: ${getPrompt(GENDER_OPTIONS, gender)}
- AGE: ${getPrompt(AGE_OPTIONS, age)}
- VOICE TEXTURE: ${getPrompt(TEXTURE_OPTIONS, texture)}
- ACCENT: ${getPrompt(REGION_OPTIONS, region)}
- EMOTION: ${getPrompt(EMOTION_OPTIONS, emotion)}
- SPEAKING STYLE: ${getPrompt(STYLE_OPTIONS, style)}
- RATE: ${getPrompt(RATE_OPTIONS, rate)}
- PITCH: ${getPrompt(PITCH_OPTIONS, pitch)}
- PAUSING: ${getPrompt(PAUSING_OPTIONS, pausing)}
- VOLUME: ${getPrompt(VOLUME_OPTIONS, volume)}
- EMPHASIS: ${getPrompt(EMPHASIS_OPTIONS, emphasis)}
- ENVIRONMENT: ${getPrompt(REVERB_OPTIONS, reverb)}

TEXT TO SPEAK:
${text}
`;
    
    contents = [{ parts: [{ text: descriptivePrompt }] }];
    config = {
      responseModalities: [Modality.AUDIO],
    };
  }

  const response = await ai.models.generateContent({ model, contents, config });
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error('Không nhận được dữ liệu âm thanh từ API.');
  }
  return base64Audio;
};


// --- From: components/Icons.tsx ---
const WaveformIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12.75h16.5m-16.5-3.75h16.5M3.75 19.5h16.5m-16.5-11.25h16.5" />
  </svg>
);
const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);
const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);


// --- From: components/Loader.tsx ---
const Loader: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


// --- From: components/AudioPlayer.tsx ---
const AudioPlayer: React.FC<{ src: string }> = ({ src }) => (
  <div className="w-full space-y-3">
    <h3 className="text-lg font-semibold text-center text-gray-300">Âm thanh đã tạo</h3>
    <audio controls src={src} className="w-full rounded-lg">
      Your browser does not support the audio element.
    </audio>
  </div>
);


// --- From: components/VoiceSelector.tsx ---
const VoiceSelector: React.FC<{
  selectedVoice: PrebuiltVoice;
  onVoiceChange: (voice: PrebuiltVoice) => void;
  disabled?: boolean;
}> = ({ selectedVoice, onVoiceChange, disabled }) => (
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


// --- From: components/CustomVoiceControls.tsx ---
const CustomVoiceControls: React.FC<{
  config: CustomVoiceConfig;
  onConfigChange: (newConfig: CustomVoiceConfig) => void;
  disabled?: boolean;
  presets: SavedPreset[];
  onSave: () => void;
  onLoad: (config: CustomVoiceConfig) => void;
  onDelete: (name: string) => void;
}> = ({ 
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
                onClick={() => { if (selectedPreset) { onDelete(selectedPreset); setSelectedPreset(''); } }} 
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

// --- From: App.tsx ---
const App = () => {
  const [text, setText] = useState<string>("Xin chào, đây là một bài kiểm tra của mô hình tạo giọng nói. Tôi có thể nói bằng nhiều giọng khác nhau.");
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [transcriptionStatus, setTranscriptionStatus] = useState<Status>(Status.Idle);
  const [sourceAudioFile, setSourceAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState<boolean>(false);

  const [mode, setMode] = useState<GenerationMode>(GenerationMode.Prebuilt);
  const [selectedVoice, setSelectedVoice] = useState<PrebuiltVoice>(PrebuiltVoice.Kore);
  const [customVoiceConfig, setCustomVoiceConfig] = useState<CustomVoiceConfig>({
    gender: GENDER_OPTIONS[0].value,
    age: AGE_OPTIONS[0].value,
    texture: TEXTURE_OPTIONS[0].value,
    region: REGION_OPTIONS[0].value,
    emotion: EMOTION_OPTIONS[0].value,
    style: STYLE_OPTIONS[0].value,
    rate: RATE_OPTIONS[0].value,
    pitch: PITCH_OPTIONS[0].value,
    pausing: PAUSING_OPTIONS[0].value,
    volume: VOLUME_OPTIONS[0].value,
    reverb: REVERB_OPTIONS[0].value,
    emphasis: EMPHASIS_OPTIONS[0].value,
  });

  const PRESETS_STORAGE_KEY = 'gemini_tts_presets_v1';

  useEffect(() => {
    setIsApiKeyConfigured(!!process.env.API_KEY);
    try {
      const savedPresets = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (savedPresets) setPresets(JSON.parse(savedPresets));
    } catch (e) {
      console.error("Failed to load presets from localStorage", e);
    }
  }, []);

  async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  const handleSourceAudioUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isApiKeyConfigured) {
       setError("API key chưa được cấu hình. Không thể thực hiện yêu cầu.");
       return;
    }
    
    setSourceAudioFile(file);
    setTranscriptionStatus(Status.Loading);
    setError(null);
    setText('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const audioPart = await fileToGenerativePart(file);
      const transcribedText = await transcribeAudio(ai, audioPart);
      setText(transcribedText);
      setTranscriptionStatus(Status.Success);
    } catch (err) {
      console.error(err);
      let displayError = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.";
      setError(`Không thể phiên âm âm thanh. ${displayError}`);
      setTranscriptionStatus(Status.Error);
    }
    event.target.value = '';
  }, [isApiKeyConfigured]);

  const updatePresets = (newPresets: SavedPreset[]) => {
    setPresets(newPresets);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(newPresets));
  };

  const handleSavePreset = () => {
    const name = prompt("Nhập tên cho giọng nói này:", `Giọng nói tùy chỉnh ${presets.length + 1}`);
    if (name && name.trim()) {
      if (presets.some(p => p.name === name.trim())) {
        alert("Tên này đã tồn tại. Vui lòng chọn tên khác.");
        return;
      }
      const newPreset: SavedPreset = { name: name.trim(), config: customVoiceConfig };
      updatePresets([...presets, newPreset]);
      alert(`Đã lưu giọng nói "${name.trim()}"!`);
    }
  };

  const handleLoadPreset = (config: CustomVoiceConfig) => setCustomVoiceConfig(config);

  const handleDeletePreset = (name: string) => {
    if (confirm(`Bạn có chắc muốn xóa giọng nói "${name}" không?`)) {
      updatePresets(presets.filter(p => p.name !== name));
    }
  };

  const handleConversion = useCallback(async () => {
    if (!isApiKeyConfigured) {
       setError("API key chưa được cấu hình. Không thể thực hiện yêu cầu.");
       return;
    }
    if (!text.trim()) {
      setError("Vui lòng nhập văn bản để chuyển đổi.");
      return;
    }

    setStatus(Status.Loading);
    setError(null);
    setAudioUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const generationConfig: GenerationParams = mode === GenerationMode.Prebuilt
        ? { mode: GenerationMode.Prebuilt, voice: selectedVoice }
        : { mode: GenerationMode.Custom, config: customVoiceConfig };

      const base64Audio = await generateSpeech(ai, text, generationConfig);
      const audioBlob = pcmToWavBlob(base64Audio);
      const url = URL.createObjectURL(audioBlob);

      setAudioUrl(url);
      setStatus(Status.Success);
    } catch (err) {
      console.error(err);
      let displayError = "Đã xảy ra lỗi không xác định.";
      if (err instanceof Error) {
        if (err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED")) {
           displayError = "Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng đợi một lát rồi thử lại.";
        } else {
           displayError = err.message;
        }
      }
      setError(`Không thể tạo âm thanh. ${displayError}`);
      setStatus(Status.Error);
    }
  }, [text, mode, selectedVoice, customVoiceConfig, isApiKeyConfigured]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 border border-gray-700">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center gap-3">
            <WaveformIcon className="w-8 h-8"/>
            Phòng thu Giọng nói AI
          </h1>
          <p className="text-gray-400 mt-2">
            Chuyển đổi văn bản hoặc âm thanh thành giọng nói với phong cách bạn chọn.
          </p>
        </header>

        <main className="space-y-6">
          <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-300">Bắt đầu từ Âm thanh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="style-audio-upload" className="block text-sm font-medium text-gray-400 mb-1">
                  1. Tải lên Giọng nói Mẫu
                </label>
                <button 
                  onClick={() => document.getElementById('style-audio-upload')?.click()}
                  disabled 
                  className="w-full flex items-center justify-center gap-2 bg-gray-700 text-gray-400 font-bold py-2 px-4 rounded-lg cursor-not-allowed"
                  title="Tính năng sẽ sớm có mặt"
                >
                  <UploadIcon className="w-5 h-5" />
                  <span>Chọn Tệp (Sắp có)</span>
                </button>
                <input type="file" id="style-audio-upload" className="hidden" />
              </div>
               <div>
                <label htmlFor="source-audio-upload" className="block text-sm font-medium text-gray-400 mb-1">
                  2. Tải lên Âm thanh để Lấy Nội dung
                </label>
                <button 
                  onClick={() => document.getElementById('source-audio-upload')?.click()}
                  disabled={transcriptionStatus === Status.Loading || !isApiKeyConfigured}
                  className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                  {transcriptionStatus === 'loading' ? <Loader/> : <UploadIcon className="w-5 h-5" />}
                  <span>{transcriptionStatus === 'loading' ? 'Đang phiên âm...' : 'Chọn Tệp'}</span>
                </button>
                <input 
                  type="file" 
                  id="source-audio-upload" 
                  className="hidden" 
                  accept="audio/*"
                  onChange={handleSourceAudioUpload}
                />
                 {sourceAudioFile && <p className="text-xs text-gray-400 mt-2 truncate">Đã chọn: {sourceAudioFile.name}</p>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center text-gray-500">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-sm">HOẶC NHẬP VĂN BẢN</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <div className="space-y-2">
            <label htmlFor="text-input" className="font-semibold text-gray-300">
              Văn bản cần chuyển đổi
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nội dung phiên âm từ tệp âm thanh sẽ xuất hiện ở đây, hoặc bạn có thể tự nhập..."
              className="w-full h-36 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none"
              disabled={status === Status.Loading || transcriptionStatus === Status.Loading}
            />
          </div>

          <div className="space-y-4">
            <fieldset className="flex gap-x-6 border border-gray-700 p-3 rounded-lg">
              <legend className="px-2 text-sm font-semibold text-gray-400">Chọn Phong cách Giọng nói</legend>
              <div className="flex items-center gap-2">
                <input
                  type="radio" id="prebuilt-mode" name="mode" value={GenerationMode.Prebuilt}
                  checked={mode === GenerationMode.Prebuilt} onChange={() => setMode(GenerationMode.Prebuilt)}
                  className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                />
                <label htmlFor="prebuilt-mode">Giọng có sẵn</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio" id="custom-mode" name="mode" value={GenerationMode.Custom}
                  checked={mode === GenerationMode.Custom} onChange={() => setMode(GenerationMode.Custom)}
                  className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                />
                <label htmlFor="custom-mode">Tùy chỉnh Giọng</label>
              </div>
            </fieldset>

            {mode === GenerationMode.Prebuilt ? (
              <VoiceSelector selectedVoice={selectedVoice} onVoiceChange={setSelectedVoice} disabled={status === Status.Loading} />
            ) : (
              <CustomVoiceControls
                config={customVoiceConfig} onConfigChange={setCustomVoiceConfig}
                disabled={status === Status.Loading} presets={presets}
                onSave={handleSavePreset} onLoad={handleLoadPreset} onDelete={handleDeletePreset}
              />
            )}
          </div>

          {!isApiKeyConfigured && (
            <div className="bg-yellow-900/50 text-yellow-200 border border-yellow-700 p-4 rounded-lg text-center">
              <p className="font-bold">Cảnh báo Cấu hình</p>
              <p className="text-sm mt-1">Không tìm thấy API key. Vui lòng đặt biến môi trường <code>API_KEY</code> để kích hoạt.</p>
            </div>
          )}

          <button
            onClick={handleConversion}
            disabled={status === Status.Loading || transcriptionStatus === Status.Loading || !isApiKeyConfigured}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            aria-label={!isApiKeyConfigured ? 'Cần cấu hình API key' : 'Tạo giọng nói'}
          >
            {status === Status.Loading ? <><Loader />Đang tạo...</> : <><SparklesIcon className="w-5 h-5" />Tạo giọng nói</>}
          </button>

          {error && <div className="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-lg text-center">{error}</div>}
          {status === Status.Success && audioUrl && <AudioPlayer src={audioUrl} />}
        </main>
      </div>
       <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Phát triển bởi Google Gemini API</p>
      </footer>
    </div>
  );
};


// --- Final Render Call ---
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<React.StrictMode><App /></React.StrictMode>);
} else {
  console.error('Root element with id "root" not found in the DOM.');
}