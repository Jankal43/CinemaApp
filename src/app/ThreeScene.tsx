"use client";

import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import VideoScreen from "./components/VideoScreen";
import AudioSystem from "./components/AudioSystem";
import CinemaModel from "./components/CinemaModel";
import FPSControls from "./components/FPSControls";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

interface ThreeSceneProps {
    x: number;
    y: number;
    z: number;
}

const ThreeScene = ({x,y,z}:ThreeSceneProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    console.log(x,y,z);

    const handleToggleAudio = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsAudioEnabled(prev => !prev);
    };

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                    Loading 3D Scene...
                </div>
            )}
            {/* Usuwamy przycisk i ukryty element <video> stąd */}
            <Canvas
                onCreated={() => setIsLoading(false)}
                style={{ width: "100%", height: "550px" }}
                camera={{ position: [x, y, z], fov: 75 }}
                gl={{ 
                    preserveDrawingBuffer: true,
                    powerPreference: "high-performance",
                    antialias: true
                }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <CinemaModel />
                <VideoScreen videoRef={videoRef} isAudioEnabled={isAudioEnabled} />
                <AudioSystem videoRef={videoRef} />
                <FPSControls />
            </Canvas>
            {/* Przycisk audio jako zwykły przycisk 2D w prawym dolnym rogu */}
            <button
                onClick={handleToggleAudio}
                className="absolute bottom-4 right-4 flex items-center justify-center bg-gray-800 bg-opacity-80 rounded-full shadow-lg cursor-pointer hover:bg-opacity-100 transition-all"
                style={{
                    width: '48px',
                    height: '48px',
                    fontSize: '24px',
                    color: 'white',
                    zIndex: 10
                }}
            >
                {isAudioEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
        </div>
    );
};

export default ThreeScene;