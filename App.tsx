
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
// FIX: Import GenerationParams to explicitly type the generation configuration.
import { PrebuiltVoice, Status, GenerationMode, CustomVoiceConfig, GenerationParams, SavedPreset } from './types';
import { 
  GENDER_OPTIONS, AGE_OPTIONS, TEXTURE_OPTIONS, REGION_OPTIONS, 
  EMOTION_OPTIONS, STYLE_OPTIONS, RATE_OPTIONS, PITCH_OPTIONS, 
  PAUSING_OPTIONS, VOLUME_OPTIONS, REVERB_OPTIONS, EMPHASIS_OPTIONS
} from './constants';
import { generateSpeech } from './services/geminiService';
import { pcmToWavBlob } from './utils/audioUtils';
import VoiceSelector from './components/VoiceSelector';
import CustomVoiceControls from './components/CustomVoiceControls';
import AudioPlayer from './components/AudioPlayer';
import Loader from './components/Loader';
import { WaveformIcon, SparklesIcon } from './components/Icons';

const PRESETS_STORAGE_KEY = 'gemini_tts_presets_v1';

export default function App() {
  const [text, setText] = useState<string>("Xin chào, đây là một bài kiểm tra của mô hình tạo giọng nói. Tôi có thể nói bằng nhiều giọng khác nhau.");
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [presets, setPresets] = useState<SavedPreset[]>([]);

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

  useEffect(() => {
    try {
      const savedPresets = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (savedPresets) {
        setPresets(JSON.parse(savedPresets));
      }
    } catch (e) {
      console.error("Failed to load presets from localStorage", e);
    }
  }, []);

  const updatePresets = (newPresets: SavedPreset[]) => {
    setPresets(newPresets);
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(newPresets));
    } catch (e) {
      console.error("Failed to save presets to localStorage", e);
    }
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

  const handleLoadPreset = (config: CustomVoiceConfig) => {
    setCustomVoiceConfig(config);
  };

  const handleDeletePreset = (name: string) => {
    if (confirm(`Bạn có chắc muốn xóa giọng nói "${name}" không?`)) {
      const newPresets = presets.filter(p => p.name !== name);
      updatePresets(newPresets);
    }
  };

  const handleConversion = useCallback(async () => {
    if (!text.trim()) {
      setError("Vui lòng nhập văn bản để chuyển đổi.");
      return;
    }

    setStatus(Status.Loading);
    setError(null);
    setAudioUrl(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API key chưa được cấu hình. Vui lòng đặt biến môi trường API_KEY.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
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
        // Check for the specific rate limit error message
        if (err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED")) {
           displayError = "Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng đợi một lát (khoảng 1 phút) rồi thử lại.";
        } else {
           displayError = err.message;
        }
      }
      setError(`Không thể tạo âm thanh. ${displayError}`);
      setStatus(Status.Error);
    }
  }, [text, mode, selectedVoice, customVoiceConfig]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 border border-gray-700">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center gap-3">
            <WaveformIcon className="w-8 h-8"/>
            Phòng thu Giọng nói AI
          </h1>
          <p className="text-gray-400 mt-2">
            Thiết kế, lưu và sử dụng các giọng nói độc đáo do AI tạo ra.
          </p>
        </header>

        <main className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="text-input" className="font-semibold text-gray-300">
              Văn bản cần chuyển đổi
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập văn bản tại đây..."
              className="w-full h-36 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none"
              disabled={status === Status.Loading}
            />
          </div>

          <div className="space-y-4">
            <fieldset className="flex gap-x-6 border border-gray-700 p-3 rounded-lg">
              <legend className="px-2 text-sm font-semibold text-gray-400">Chế độ</legend>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="prebuilt-mode"
                  name="mode"
                  value={GenerationMode.Prebuilt}
                  checked={mode === GenerationMode.Prebuilt}
                  onChange={() => setMode(GenerationMode.Prebuilt)}
                  className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                />
                <label htmlFor="prebuilt-mode" className="text-gray-300">Giọng có sẵn</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="custom-mode"
                  name="mode"
                  value={GenerationMode.Custom}
                  checked={mode === GenerationMode.Custom}
                  onChange={() => setMode(GenerationMode.Custom)}
                  className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                />
                <label htmlFor="custom-mode" className="text-gray-300">Tùy chỉnh giọng nói</label>
              </div>
            </fieldset>

            {mode === GenerationMode.Prebuilt ? (
              <VoiceSelector
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
                disabled={status === Status.Loading}
              />
            ) : (
              <CustomVoiceControls
                config={customVoiceConfig}
                onConfigChange={setCustomVoiceConfig}
                disabled={status === Status.Loading}
                presets={presets}
                onSave={handleSavePreset}
                onLoad={handleLoadPreset}
                onDelete={handleDeletePreset}
              />
            )}
          </div>

          <button
            onClick={handleConversion}
            disabled={status === Status.Loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {status === Status.Loading ? (
              <>
                <Loader />
                Đang tạo...
              </>
            ) : (
               <>
                <SparklesIcon className="w-5 h-5" />
                Chuyển đổi thành giọng nói
               </>
            )}
          </button>

          {error && (
            <div className="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {status === Status.Success && audioUrl && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-center text-gray-300">Âm thanh đã tạo</h3>
              <AudioPlayer src={audioUrl} />
            </div>
          )}
        </main>
      </div>
       <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Phát triển bởi Google Gemini API</p>
      </footer>
    </div>
  );
}
