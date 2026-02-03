
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { PrebuiltVoice, Status, GenerationMode, CustomVoiceConfig, GenerationParams, SavedPreset } from './types';
import { 
  GENDER_OPTIONS, AGE_OPTIONS, TEXTURE_OPTIONS, REGION_OPTIONS, 
  EMOTION_OPTIONS, STYLE_OPTIONS, RATE_OPTIONS, PITCH_OPTIONS, 
  PAUSING_OPTIONS, VOLUME_OPTIONS, REVERB_OPTIONS, EMPHASIS_OPTIONS
} from './constants';
import { generateSpeech, transcribeAudio } from './services/geminiService';
import { pcmToWavBlob } from './utils/audioUtils';
import VoiceSelector from './components/VoiceSelector';
import CustomVoiceControls from './components/CustomVoiceControls';
import AudioPlayer from './components/AudioPlayer';
import Loader from './components/Loader';
import { WaveformIcon, SparklesIcon, UploadIcon } from './components/Icons';

const PRESETS_STORAGE_KEY = 'gemini_tts_presets_v1';

// Helper to convert a File object to the format Gemini API expects
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

export default function App() {
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

  useEffect(() => {
    setIsApiKeyConfigured(!!process.env.API_KEY);
    try {
      const savedPresets = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (savedPresets) setPresets(JSON.parse(savedPresets));
    } catch (e) {
      console.error("Failed to load presets from localStorage", e);
    }
  }, []);

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
    setText(''); // Clear previous text

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
    // Reset file input to allow re-uploading the same file
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
}
