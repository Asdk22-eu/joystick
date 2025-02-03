import React, { createContext, useState, useRef } from "react";

export const MusicaContext = createContext();

export const MusicaProvider = ({ children }) => {
  const audioRef = useRef(new Audio("/game.mp3"));
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          audioRef.current.volume = 0.3;
          audioRef.current.loop = true;
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Error al reproducir audio:", error);
        }
      }
    }
  };

  return (
    <MusicaContext.Provider value={{ isPlaying, togglePlay }}>
      {children}
    </MusicaContext.Provider>
  );
};
