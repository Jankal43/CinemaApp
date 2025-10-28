"use client";
import SeatMap from "@/app/seatMap";
import { useState, useCallback } from "react";
import ThreeScene from "@/app/ThreeScene";

export default function CinemaLayout() {
  const [currentScene, setCurrentScene] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const [position, setPosition] = useState({ x: 3.6, y: 1.3, z: 0 });

  const handleSceneChange = useCallback(
    (newScene: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentScene(newScene);
        // Zwiększamy klucz przy każdej zmianie sceny, żeby wymusić pełny reset
        setSceneKey((prev) => prev + 1);
        setIsTransitioning(false);
      }, 100);
    },
    [isTransitioning]
  );

  return (
    <div className="w-full min-h-dvh flex flex-col items-center justify-center text-gray-100">
      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
        Cinema Layout
      </h2>

      <div className="mb-6">
        <button
          onClick={() => handleSceneChange(1)}
          disabled={isTransitioning}
          className={`group bg-gradient-to-r from-red-500 via-red-600 to-red-800 m-3 p-2 
              hover:font-semibold hover:text-white disabled:opacity-50 
              ${currentScene === 1 ? "ring-2 ring-red-400" : ""}`}
        >
          Select a seat
        </button>
        <button
          onClick={() => handleSceneChange(0)}
          disabled={isTransitioning}
          className={`group bg-gradient-to-r from-red-500 via-red-600 to-red-800 m-3 p-2 
              hover:font-semibold hover:text-white disabled:opacity-50
              ${currentScene === 0 ? "ring-2 ring-red-400" : ""}`}
        >
          View preview
        </button>
      </div>

      <div className="w-full flex justify-center items-center" style={{ minHeight: "600px" }}>
        {currentScene === 1 ? (
          <SeatMap setPosition={setPosition} />
        ) : currentScene === 0 ? (
          <div className="w-2/3 h-full">
            <ThreeScene key={sceneKey} x={position.x} y={position.y} z={position.z} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
