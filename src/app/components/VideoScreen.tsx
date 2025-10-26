"use client";

import { useVideoTexture, Html } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

// Komponent wyświetlający ekran ładowania (bez zmian)
function VideoLoadingFallback() {
    return (
        <mesh position={[3.95, 2, 5]} rotation={[0, Math.PI, 0]} scale={[9.5, 4.8, 0]}>
            <planeGeometry />
            <meshBasicMaterial color="#000000" />
            <Html center style={{ pointerEvents: 'none' }}>
                <div className="bg-black bg-opacity-80 text-white p-4 rounded-lg border-2 border-gray-600 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                    <div className="text-sm font-medium">Ładowanie filmu...</div>
                </div>
            </Html>
        </mesh>
    );
}


// --- Główny, połączony komponent ---
function VideoAndAudioPlayer({ src }: { src: string }) {
    const { camera } = useThree();
    const groupRef = useRef<THREE.Group>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    
    // Użyj refa do przechowywania obiektu audio, aby zapobiec ponownemu tworzeniu
    const audioRef = useRef<{
        listener: THREE.AudioListener | null,
        source: MediaElementAudioSourceNode | null,
        positionalAudio: THREE.PositionalAudio | null
    }>({ listener: null, source: null, positionalAudio: null });

    // 1. Używamy 'useVideoTexture' do wideo
    const texture = useVideoTexture(src, {
        loop: true,
        muted: true,
        playsInline: true,
    });
    
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;

    // 2. Wyciągamy element <video> stworzony przez useVideoTexture
    const videoElement = texture.source.data as HTMLVideoElement;

    // 3. Logika audio odporna na Strict Mode
    useEffect(() => {
  if (!videoElement || !camera || !groupRef.current) return;

  // Upewniamy się, że audio nie zostało już zainicjowane
  if (!audioRef.current.positionalAudio) {
    console.log("Setting up positional audio once...");

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const positionalAudio = new THREE.PositionalAudio(listener);
    positionalAudio.setMediaElementSource(videoElement); // ✅ zamiast createMediaElementSource + getInput()
    positionalAudio.setRefDistance(20);
    positionalAudio.setMaxDistance(50);
    positionalAudio.setRolloffFactor(1);

    groupRef.current.add(positionalAudio);

    // Zachowaj referencje
    audioRef.current = { listener, source: null, positionalAudio };
  }

  return () => {
    // W Strict Mode React odpala cleanup dwa razy, więc musimy uważać
    console.log("Audio cleanup (ignored in Strict Mode)");
  };
}, [videoElement, camera]);


  

    // 4. Logika do przełączania mutowania
    const handleToggleAudio = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsAudioEnabled(prev => !prev);
    };

    useEffect(() => {
        if (videoElement) {
            videoElement.muted = !isAudioEnabled;
            console.log(`Video muted state set to: ${!isAudioEnabled}`);
        }
    }, [isAudioEnabled, videoElement]);

    return (
        <group ref={groupRef} position={[3.95, 2, 5]}>
            <mesh rotation={[0, Math.PI, 0]} scale={[9.5, 4.8, 0]}>
                <planeGeometry />
                <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>
            
            <Html position={[0, -2.8, 0.1]} transform>
                <div 
                    className="flex items-center justify-center bg-gray-800 bg-opacity-80 rounded-full shadow-lg cursor-pointer"
                    style={{
                        width: '48px',
                        height: '48px',
                        fontSize: '24px',
                        color: 'white'
                    }}
                    onClick={handleToggleAudio}
                >
                    {isAudioEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                </div>
            </Html>
        </group>
    );
}

// Komponent-wrapper (bez zmian)
const VideoScreen = () => {
    return (
        <Suspense fallback={<VideoLoadingFallback />}>
            <VideoAndAudioPlayer src="/videos/sample2.mp4" />
        </Suspense>
    );
};

export default VideoScreen;