import React, { useContext } from "react";
import { MusicaContext } from "./MusicaContext";

const MusicaFondo = () => {
  const { isPlaying, togglePlay } = useContext(MusicaContext);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={togglePlay}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isPlaying ? "🔇 Jugar Sin Música" : "🔊 Jugar Con Música"}
      </button>
    </div>
  );
};

export default MusicaFondo;
