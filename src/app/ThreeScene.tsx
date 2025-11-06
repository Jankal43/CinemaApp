"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import VideoScreen from "./components/VideoScreen";
import AudioSystem from "./components/AudioSystem";
import CinemaModel from "./components/CinemaModel";
import FPSControls from "./components/FPSControls";
import CinemaLighting from "./components/CinemaLighting";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

interface ThreeSceneProps {
    x: number;
    y: number;
    z: number;
}

const ThreeScene = ({x,y,z}:ThreeSceneProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [showEnterPrompt, setShowEnterPrompt] = useState(true);
    const [isViewingMode, setIsViewingMode] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    console.log(x,y,z);

    useEffect(() => {
        const handlePointerLockChange = () => {
            const isLocked = document.pointerLockElement !== null;
            setShowEnterPrompt(!isLocked);
            setIsViewingMode(isLocked);
        };

        document.addEventListener('pointerlockchange', handlePointerLockChange);

        return () => {
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
        };
    }, []);

    const handleToggleAudio = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsAudioEnabled(prev => !prev);
    };

    return (
        <div className="relative" ref={canvasRef}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white z-20">
                    Loading 3D Scene...
                </div>
            )}
            {showEnterPrompt && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-20 pointer-events-none">
                    <div className="text-white text-2xl md:text-3xl font-semibold text-center px-4 animate-pulse">
                        Click to enter viewing mode
                    </div>
                </div>
            )}
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
                <CinemaLighting />
                <CinemaModel />
                <VideoScreen videoRef={videoRef} isAudioEnabled={isAudioEnabled} />
                <AudioSystem videoRef={videoRef} />
                <FPSControls />
            </Canvas>
            {isViewingMode && !isLoading && (
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm z-30">
                    Press <kbd className="px-2 py-1 bg-gray-700 rounded font-mono">ESC</kbd> to exit viewing mode
                </div>
            )}
            <button
                onClick={handleToggleAudio}
                className="absolute bottom-4 right-4 flex items-center justify-center bg-gray-800 bg-opacity-80 rounded-full shadow-lg cursor-pointer hover:bg-opacity-100 transition-all"
                style={{
                    width: '48px',
                    height: '48px',
                    fontSize: '24px',
                    color: 'white',
                    zIndex: 30
                }}
            >
                {isAudioEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
        </div>
    );
};

export default ThreeScene;