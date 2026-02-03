
import React from 'react';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  return (
    <div className="w-full">
      <audio controls src={src} className="w-full rounded-lg" autoPlay>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
