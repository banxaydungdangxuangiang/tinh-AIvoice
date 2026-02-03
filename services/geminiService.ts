import { GoogleGenAI, Modality } from "@google/genai";
import { GenerationMode, GenerationParams } from "../types";
import { AGE_OPTIONS, EMOTION_OPTIONS, EMPHASIS_OPTIONS, GENDER_OPTIONS, PAUSING_OPTIONS, PITCH_OPTIONS, RATE_OPTIONS, REGION_OPTIONS, REVERB_OPTIONS, STYLE_OPTIONS, TEXTURE_OPTIONS, VOLUME_OPTIONS } from "../constants";

export const transcribeAudio = async (
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

export const generateSpeech = async (
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
