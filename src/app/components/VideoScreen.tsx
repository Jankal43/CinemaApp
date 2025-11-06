"use client";

import { useVideoTexture, Html } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

// Komponent glosnika
// const Speaker = ({ position, label }: { position: [number, number, number], label: string }) => {
//     return (
//         <group position={position}>
//             {/* Główny korpus glosnika */}
//             <mesh>
//                 <boxGeometry args={[0.3, 0.4, 0.2]} />
//                 <meshStandardMaterial color="#2a2a2a" />
//             </mesh>
            
//             {/* Przód glosnika */}
//             <mesh position={[0, 3, 0.11]}>
//                 <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
//                 <meshStandardMaterial color="#1a1a1a" />
//             </mesh>
            
//             {/* Środek glosnika */}
//             <mesh position={[0, 0, 0.12]}>
//                 <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
//                 <meshStandardMaterial color="#333333" />
//             </mesh>
            
//             {/* Etykieta */}
//             <Html position={[0, -0.3, 0]} center>
//                 <div className="text-white text-xs bg-black bg-opacity-70 px-2 py-1 rounded">
//                     {label}
//                 </div>
//             </Html>
//         </group>
//     );
// };

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
function VideoPlayer({ src, videoRef, isAudioEnabled }: { src: string, videoRef: React.RefObject<HTMLVideoElement | null>, isAudioEnabled: boolean }) {
    const groupRef = useRef<THREE.Group>(null);

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

    // Pozycje glosników w układzie surround (2 z przodu, 2 z tyłu, 1 na środku)
    // const speakerPositions = [
    //     { position: [1.5, 2, 5] as [number, number, number], label: "Left Front" },      // Lewy przedni
    //     { position: [6.4, 2, 5] as [number, number, number], label: "Right Front" },     // Prawy przedni
    //     { position: [3.95, 2, 5] as [number, number, number], label: "Center" },         // Środek
    //     { position: [1.5, 2, 1] as [number, number, number], label: "Left Rear" },       // Lewy tylny
    //     { position: [6.4, 2, 1] as [number, number, number], label: "Right Rear" },     // Prawy tylny
    // ];

    return (
        <group ref={groupRef}>
            {/* Ekran video */}
            <group position={[3.95, 2, 5]}>
                <mesh rotation={[0, Math.PI, 0]} scale={[9.5, 4.8, 0]}>
                    <planeGeometry />
                    <meshBasicMaterial map={texture} toneMapped={false} />
                </mesh>
            </group>
            
            {/* Renderuj glosniki */}
            {/* {speakerPositions.map((speaker, index) => (
                <Speaker 
                    key={index}
                    position={speaker.position} 
                    label={speaker.label} 
                />
            ))} */}
        </group>
    );
}


const VideoScreen = ({ videoRef, isAudioEnabled }: { videoRef: React.RefObject<HTMLVideoElement | null>, isAudioEnabled: boolean }) => {
    return (
        <Suspense fallback={<VideoLoadingFallback />}>
            <VideoPlayer src="/videos/sample2.mp4" videoRef={videoRef} isAudioEnabled={isAudioEnabled} />
        </Suspense>
    );
};

export default VideoScreen;