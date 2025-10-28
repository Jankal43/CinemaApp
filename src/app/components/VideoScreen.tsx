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


// --- Komponent tylko do video (bez audio) ---
function VideoPlayer({ src, videoRef }: { src: string, videoRef: React.RefObject<HTMLVideoElement | null> }) {
    const groupRef = useRef<THREE.Group>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);

    // 1. Używamy 'useVideoTexture' do wideo
    const texture = useVideoTexture(src, {
        loop: true,
        muted: true,
        playsInline: true,
    });
    
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;

    // 2. Wyciągamy element <video> i przekazujemy do ref
    const videoElement = texture.source.data as HTMLVideoElement;
    
    // Przekazujemy video element do ref dla AudioSystem
    useEffect(() => {
        if (videoElement && videoRef) {
            videoRef.current = videoElement;
        }
    }, [videoElement, videoRef]);

    // 3. Logika do przełączania mutowania
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

    // Cleanup effect to pause video when component unmounts
    useEffect(() => {
        return () => {
            if (videoElement) {
                console.log("Pausing video on component unmount");
                videoElement.pause();
                videoElement.currentTime = 0;
            }
        };
    }, [videoElement]);

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

// Komponent-wrapper z cleanup
const VideoScreen = ({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) => {
    return (
        <Suspense fallback={<VideoLoadingFallback />}>
            <VideoPlayer src="/videos/sample2.mp4" videoRef={videoRef} />
        </Suspense>
    );
};

export default VideoScreen;