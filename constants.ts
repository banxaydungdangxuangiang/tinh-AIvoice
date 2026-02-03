
import { PrebuiltVoice } from './types';

interface VoiceOption {
  value: PrebuiltVoice;
  label: string;
  description: string;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  { value: PrebuiltVoice.Kore, label: 'Kore', description: 'Một giọng nói điềm tĩnh và chuyên nghiệp.' },
  { value: PrebuiltVoice.Puck, label: 'Puck', description: 'Một giọng nói thân thiện và tràn đầy năng lượng.' },
  { value: PrebuiltVoice.Charon, label: 'Charon', description: 'Một giọng nói trầm và vang.' },
  { value: PrebuiltVoice.Fenrir, label: 'Fenrir', description: 'Một giọng nói rõ ràng và quyết đoán.' },
  { value: PrebuiltVoice.Zephyr, label: 'Zephyr', description: 'Một giọng nói ấm áp và nhẹ nhàng.' },
];

interface CustomOption {
  label: string; // For UI display (Vietnamese)
  value: string; // For state management
  prompt: string; // For the AI prompt (English)
}

// Nhóm 1: Nhận Dạng Nhân Vật (Identity)
export const GENDER_OPTIONS: CustomOption[] = [
  { label: 'Nữ', value: 'female', prompt: 'Female' },
  { label: 'Nam', value: 'male', prompt: 'Male' },
  { label: 'Trung tính', value: 'androgynous', prompt: 'Androgynous' },
];

export const AGE_OPTIONS: CustomOption[] = [
  { label: 'Trưởng thành - Giọng hiện đại, rõ ràng', value: 'young adult', prompt: 'Young Adult (a modern, clear voice)' },
  { label: 'Trẻ em - Giọng cao, trong, thơ ngây', value: 'child', prompt: 'Child (a high-pitched, clear, innocent voice)' },
  { label: 'Thanh thiếu niên - Giọng năng động', value: 'teenager', prompt: 'Teenager (an energetic voice)' },
  { label: 'Trung niên - Giọng trầm, đĩnh đạc', value: 'middle-aged', prompt: 'Middle-aged (a deeper, mature, and confident voice)' },
  { label: 'Người già - Giọng chậm, trải đời', value: 'senior', prompt: 'Senior (a slow, experienced voice, possibly with a slight tremor)' },
];

export const TEXTURE_OPTIONS: CustomOption[] = [
  { label: 'Mượt mà - Không có tạp âm', value: 'smooth', prompt: 'Smooth (a clear voice with no raspiness)' },
  { label: 'Ấm - Tạo cảm giác tin cậy', value: 'warm', prompt: 'Warm (a trustworthy and friendly tone)' },
  { label: 'Khàn - Nghe phong trần', value: 'hoarse/raspy', prompt: 'Hoarse/Raspy (a rough, gravelly voice)' },
  { label: 'Mỏng/Cao - Nhẹ nhàng, bay bổng', value: 'thin/high-pitched', prompt: 'Thin/High-pitched (a light, airy voice)' },
  { label: 'Dày/Trầm - Quyền lực, vang', value: 'deep/resonant', prompt: 'Deep/Resonant (a powerful, booming voice)' },
];

export const REGION_OPTIONS: CustomOption[] = [
  { label: 'Miền Bắc', value: 'Northern Vietnamese', prompt: 'Northern Vietnamese Accent' },
  { label: 'Miền Nam', value: 'Southern Vietnamese', prompt: 'Southern Vietnamese Accent' },
  { label: 'Miền Trung', value: 'Central Vietnamese', prompt: 'Central Vietnamese Accent' },
];

// Nhóm 2: Trạng Thái Cảm Xúc (Emotional State)
export const EMOTION_OPTIONS: CustomOption[] = [
  { label: 'Trung tính', value: 'neutral', prompt: 'Neutral' },
  { label: 'Hạnh phúc - Giọng tươi tắn', value: 'happy', prompt: 'Happy (a bright, cheerful tone)' },
  { label: 'Hào hứng - Tốc độ nhanh, nhấn mạnh', value: 'excited', prompt: 'Excited (an energetic, fast-paced tone with high inflection)' },
  { label: 'Biết ơn - Giọng mềm, ấm', value: 'grateful', prompt: 'Grateful (a soft, warm, and sincere tone)' },
  { label: 'Hài hước/Châm biếm - Biến đổi cao độ', value: 'sarcastic/witty', prompt: 'Sarcastic/Witty (a voice with ironic pitch changes)' },
  { label: 'Buồn - Giọng trầm, kéo dài', value: 'sad', prompt: 'Sad (a low-pitched, slow, somber tone)' },
  { label: 'Giận dữ - Giọng gằn, dồn dập', value: 'angry', prompt: 'Angry (a harsh, sharp, and fast-paced tone)' },
  { label: 'Lo lắng - Giọng hơi run, ngắt quãng', value: 'anxious', prompt: 'Anxious (a slightly trembling, hesitant voice)' },
  { label: 'Mệt mỏi - Giọng thều thào, thiếu hơi', value: 'tired', prompt: 'Tired (a low-energy, breathy voice)' },
  { label: 'Nghiêm túc - Cứng rắn, dứt khoát', value: 'serious', prompt: 'Serious (a firm, steady, and resolute tone)' },
  { label: 'Tò mò - Lên giọng ở cuối câu', value: 'curious', prompt: 'Curious (a voice with rising intonation, especially at the end of sentences)' },
  { label: 'Thì thầm - Sử dụng nhiều hơi', value: 'whispering', prompt: 'Whispering (a very quiet, breathy voice)' },
];

// Nhóm 3: Phong Cách & Ngữ Cảnh (Style & Genre)
export const STYLE_OPTIONS: CustomOption[] = [
    { label: 'Trò chuyện - Như bạn bè', value: 'conversational', prompt: 'Conversational (like talking to a friend)' },
    { label: 'Phát thanh viên - Chuẩn mực, trang trọng', value: 'news anchor', prompt: 'News Anchor (formal, standard, and authoritative)' },
    { label: 'Quảng cáo - Năng lượng, lôi cuốn', value: 'commercial/sales', prompt: 'Commercial/Sales (energetic, persuasive, and engaging)' },
    { label: 'Phóng sự - Chậm rãi, uyên bác', value: 'documentary', prompt: 'Documentary (slow, deliberate, and knowledgeable)' },
    { label: 'Kể chuyện đêm khuya - Ru ngủ, êm ái', value: 'bedtime story', prompt: 'Bedtime Story (soothing, gentle, and calm)' },
    { label: 'Kịch tính - Biến đổi âm lượng lớn', value: 'dramatic', prompt: 'Dramatic (large variations in volume and emotion)' },
    { label: 'Thuyết trình - Rõ ràng, nhấn mạnh ý chính', value: 'presentation', prompt: 'Presentation (clear, confident, with emphasis on key points)' },
    { label: 'Hướng dẫn - Kiên nhẫn, tốc độ vừa phải', value: 'instructional/tutorial', prompt: 'Instructional/Tutorial (patient and clear with a moderate pace)' },
    { label: 'Lễ tân - Lịch sự, chuyên nghiệp', value: 'concierge', prompt: 'Concierge (polite, professional, and helpful)' },
];

// Nhóm 4: Điều Khiển Kỹ Thuật (Technical Specs)
export const RATE_OPTIONS: CustomOption[] = [
  { label: 'Vừa (1.0x)', value: 'normal', prompt: 'Normal (1.0x)' },
  { label: 'Chậm', value: 'slow', prompt: 'Slow' },
  { label: 'Cực chậm (0.8x)', value: 'very slow', prompt: 'Very Slow (0.8x)' },
  { label: 'Nhanh (1.2x)', value: 'fast', prompt: 'Fast (1.2x)' },
];

export const PITCH_OPTIONS: CustomOption[] = [
  { label: 'Trung bình', value: 'medium pitch', prompt: 'Medium Pitch' },
  { label: 'Rất trầm', value: 'very low pitch', prompt: 'Very Low Pitch' },
  { label: 'Trầm', value: 'low pitch', prompt: 'Low Pitch' },
  { label: 'Cao', value: 'high pitch', prompt: 'High Pitch' },
  { label: 'Rất cao (the thé)', value: 'very high pitch', prompt: 'Very High Pitch' },
];

export const PAUSING_OPTIONS: CustomOption[] = [
  { label: 'Tự nhiên - Ngắt nghỉ theo dấu câu', value: 'natural pauses', prompt: 'Natural pauses (based on punctuation)' },
  { label: 'Liên tục - Không nghỉ', value: 'no pauses', prompt: 'No pauses (continuous speech)' },
  { label: 'Sâu - Có tiếng lấy hơi', value: 'deep breathing', prompt: 'Deep breathing (audible breaths between phrases)' },
];

export const VOLUME_OPTIONS: CustomOption[] = [
    { label: 'Vừa', value: 'standard volume', prompt: 'Standard Volume' },
    { label: 'Nhỏ', value: 'soft volume', prompt: 'Soft Volume' },
    { label: 'Mạnh', value: 'loud volume', prompt: 'Loud Volume' },
];

export const REVERB_OPTIONS: CustomOption[] = [
    { label: 'Phòng kín - Không vang (podcast, trợ lý ảo)', value: 'a dry room (no reverb)', prompt: 'Dry Room (no reverb, suitable for podcasts or virtual assistants)' },
    { label: 'Phòng nhỏ - Vang nhẹ (trò chuyện)', value: 'a small room reverb', prompt: 'Small Room Reverb (light echo, suitable for indoor conversations)' },
    { label: 'Hội trường lớn - Vang rộng (diễn thuyết)', value: 'a large hall reverb', prompt: 'Large Hall Reverb (wide echo, suitable for speeches)' },
    { label: 'Hang động - Vang kéo dài (truyện kỳ bí)', value: 'a cave/tunnel reverb', prompt: 'Cave/Tunnel Reverb (long echo, suitable for mystery stories)' },
    { label: 'Thông báo công cộng - Vang có độ trễ', value: 'a public announcement echo', prompt: 'Public Announcement Echo (echo with a delay)' },
];

export const EMPHASIS_OPTIONS: CustomOption[] = [
    { label: 'Tự nhiên - Theo ngữ pháp', value: 'natural emphasis', prompt: 'Natural (emphasis follows normal grammatical rules)' },
    { label: 'Phẳng - Không nhấn nhá (đọc danh sách)', value: 'monotone emphasis', prompt: 'Monotone (no emphasis, suitable for reading lists or codes)' },
    { label: 'Truyền cảm - Nhấn vào tính từ (kể chuyện)', value: 'expressive emphasis', prompt: 'Expressive (emphasizes adjectives and adverbs, suitable for storytelling)' },
    { label: 'Thuyết phục - Nhấn vào từ khóa (quảng cáo)', value: 'persuasive emphasis', prompt: 'Persuasive (emphasizes keywords and brand names, suitable for advertising)' },
];
