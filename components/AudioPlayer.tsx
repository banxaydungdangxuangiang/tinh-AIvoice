
import React from 'react';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  return (
    <div className="w-full space-y-3">
      <h3 className="text-lg font-semibold text-center text-gray-300">Âm thanh đã tạo</h3>
      <audio controls src={src} className="w-full rounded-lg">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
