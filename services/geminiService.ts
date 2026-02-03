
import { GoogleGenAI, Modality } from '@google/genai';
import { GenerationMode, PrebuiltVoice, CustomVoiceConfig, GenerationParams } from '../types';
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
    const { 
      gender, age, texture, region, 
      emotion, style, 
      rate, pitch, pausing, volume, reverb, emphasis
    } = params.config;
    
    // Helper function to find the full English prompt description for a given value.
    const getPrompt = (options: {label: string, value: string, prompt: string}[], value: string) => 
      options.find(o => o.value === value)?.prompt || value;

    // Construct a highly structured and explicit VOICE PROFILE for the AI.
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

  const response = await ai.models.generateContent({
    model: model,
    contents,
    config,
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!base64Audio) {
    throw new Error('Không nhận được dữ liệu âm thanh từ API.');
  }

  return base64Audio;
};
