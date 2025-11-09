import React, { useState, useEffect, useRef } from "react";

function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(err => console.log("Autoplay blocked:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-2">
      <audio ref={audioRef} loop>
        <source src="/music/Walen-Western.mp3" type="audio/mpeg" />
      </audio>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className=" text-black px-3 py-1 rounded-lg shadow-md"
        style={{
  background: 'linear-gradient(to right, #63a3ff, #b6deff)'}}
      >
        {isPlaying ? "🔊 Pause" : "🎵 Play"}
      </button>
    </div>
  );
}

export default BackgroundMusic;