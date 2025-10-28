"use client";

import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import VideoScreen from "./components/VideoScreen";
import AudioSystem from "./components/AudioSystem";
import CinemaModel from "./components/CinemaModel";
import FPSControls from "./components/FPSControls";

interface ThreeSceneProps {
    x: number;
    y: number;
    z: number;
}

const ThreeScene = ({x,y,z}:ThreeSceneProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);

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
                <VideoScreen videoRef={videoRef} />
                <AudioSystem videoRef={videoRef} />
                <FPSControls />
            </Canvas>
        </div>
    );
};

export default ThreeScene;