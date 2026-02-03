export enum PrebuiltVoice {
  Kore = 'Kore',
  Puck = 'Puck',
  Charon = 'Charon',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr',
}

export enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export enum GenerationMode {
  Prebuilt = 'prebuilt',
  Custom = 'custom',
}

export interface CustomVoiceConfig {
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

export interface SavedPreset {
  name: string;
  config: CustomVoiceConfig;
}

export type GenerationParams =
  | { mode: GenerationMode.Prebuilt; voice: PrebuiltVoice }
  | { mode: GenerationMode.Custom; config: CustomVoiceConfig };
