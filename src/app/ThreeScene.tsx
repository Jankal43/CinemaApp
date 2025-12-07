"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import VideoScreen from "./components/VideoScreen";
import AudioSystem from "./components/AudioSystem";
import CinemaModel from "./components/CinemaModel";
import FPSControls from "./components/FPSControls";
import CinemaLighting from "./components/CinemaLighting";
import PerformanceOverlay from "./components/PerformanceOverlay";
import PerformanceStats from "./components/PerformanceStats";
import PerformanceMonitor from "./components/PerformanceMonitor";
import { getPerformanceMonitor, PerformanceMetrics } from "@/utils/performanceMonitor";
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
    const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handlePointerLockChange = () => {
            const isLocked = document.pointerLockElement !== null;
            setShowEnterPrompt(!isLocked);
            setIsViewingMode(isLocked);
        };

        // Skrót klawiszowy do pokazywania/ukrywania monitora wydajności (P)
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'p' || e.key === 'P') {
                setShowPerformanceMonitor(prev => !prev);
            }
        };

        document.addEventListener('pointerlockchange', handlePointerLockChange);
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            document.removeEventListener('keydown', handleKeyPress);
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
                onCreated={(state) => {
                    setIsLoading(false);
                    // Ustaw kontekst WebGL dla monitora wydajności
                    const monitor = getPerformanceMonitor();
                    try {
                        const context = state.gl.getContext();
                        if (context) {
                            monitor.setGLContext(context);
                        }
                    } catch {
                        // Ignoruj błąd - kontekst może być już ustawiony
                    }
                }}
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
                <PerformanceStats 
                    enabled={showPerformanceMonitor} 
                    onMetricsUpdate={setPerformanceMetrics}
                />
            </Canvas>
            {showPerformanceMonitor && (
                <PerformanceMonitor 
                    visible={true} 
                    position="top-right"
                    metrics={performanceMetrics}
                />
            )}
            {showPerformanceMonitor && (
                <PerformanceOverlay 
                    visible={true} 
                    onSave={(session) => {
                        console.log("Performance session saved:", session);
                    }}
                />
            )}
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