// "use client";

// import { useVideoTexture, Html, PositionalAudio } from "@react-three/drei";
// import { Suspense, useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { useThree } from "@react-three/fiber";

// // --- Komponent wyświetlający ekran ładowania (bez zmian) ---
// function VideoLoadingFallback() {
//     return (
//         <mesh position={[3.95, 2, 5]} rotation={[0, Math.PI, 0]} scale={[9.5, 4.8, 0]}>
//             <planeGeometry />
//             <meshBasicMaterial color="#000000" />
//             <Html center style={{ pointerEvents: 'none' }}>
//                 <div className="bg-black bg-opacity-80 text-white p-4 rounded-lg border-2 border-gray-600 flex flex-col items-center justify-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
//                     <div className="text-sm font-medium">Ładowanie filmu...</div>
//                 </div>
//             </Html>
//         </mesh>
//     );
// }

// // --- Główny komponent łączący wideo i audio ---
// function VideoAndAudioPlayer({ src, isAudioGloballyEnabled }: { src: string, isAudioGloballyEnabled: boolean }) {
//     const { camera } = useThree();
//     const soundRef = useRef<THREE.PositionalAudio>(null);

//     // useVideoTexture może przyjąć opcje startowe, w tym muted i loop
//     const texture = useVideoTexture(src, {
//         loop: true,
//         muted: false, // Wideo nie musi być mutowane, kontrola audio jest osobno
//         playsInline: true,
//     });

//     // Odwrócenie tekstury w poziomie
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.repeat.x = -1;

//     useEffect(() => {
//         if (soundRef.current) {
//             console.log("VideoAndAudioPlayer: Setting up audio properties");
//             soundRef.current.setRefDistance(20);
//             soundRef.current.setMaxDistance(50);
//             soundRef.current.setRolloffFactor(1);
//             soundRef.current.setLoop(true); // Ustawienie pętli dla dźwięku
//             console.log("VideoAndAudioPlayer: Audio properties set");
//         }
//     }, []);

//     // Kluczowy useEffect do kontroli odtwarzania dźwięku
//     useEffect(() => {
//         if (soundRef.current) {
//             if (isAudioGloballyEnabled) {
//                 // Spróbuj odtworzyć dźwięk tylko, jeśli jest włączony globalnie
//                 try {
//                     soundRef.current.play();
//                     console.log("Audio started playing.");
//                 } catch (error) {
//                     console.error("Error playing audio:", error);
//                     // Tutaj możesz dodać fallback lub komunikat dla użytkownika
//                 }
//             } else {
//                 // Jeśli audio nie jest włączone, zatrzymaj je
//                 if (soundRef.current.isPlaying) {
//                     soundRef.current.pause(); // lub .stop()
//                     console.log("Audio paused.");
//                 }
//             }
//         }
//     }, [isAudioGloballyEnabled]); // Reaguj na zmianę stanu globalnego

//     return (
//         <group position={[3.95, 2, 5]}>
//             <mesh rotation={[0, Math.PI, 0]} scale={[9.5, 4.8, 0]}>
//                 <planeGeometry />
//                 <meshBasicMaterial map={texture} toneMapped={false} />
//             </mesh>
//             {/* PositionalAudio jest stworzone, ale odtwarzanie jest kontrolowane przez useEffect */}
//             <PositionalAudio ref={soundRef} url={src} />
//         </group>
//     );
// }

// // --- Komponent główny VideoScreen (bez zmian) ---
// const VideoScreen = ({ isAudioGloballyEnabled }: { isAudioGloballyEnabled: boolean }) => {
//     return (
//         <Suspense fallback={<VideoLoadingFallback />}>
//             <VideoAndAudioPlayer src="/videos/sample2.mp4" isAudioGloballyEnabled={isAudioGloballyEnabled} />
//         </Suspense>
//     );
// };

// export default VideoScreen;
"use client";

import { useVideoTexture, Html, PositionalAudio } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa"; // Upewnij się, że masz react-icons

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


function VideoAndAudioPlayer({ src }: { src: string }) { // Nie potrzebujemy już propsa isAudioGloballyEnabled
    const { camera } = useThree();
    const soundRef = useRef<THREE.PositionalAudio>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false); // Lokalny stan dla tego odtwarzacza

    const texture = useVideoTexture(src, {
        loop: true,
        muted: false, // Wideo nie musi być mutowane, kontrola audio jest osobno
        playsInline: true,
    });

    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;

    // Ustawienie właściwości audio (wykonywane tylko raz po zamontowaniu komponentu)
    // useEffect(() => {
    //     if (soundRef.current) {
    //         console.log("VideoAndAudioPlayer: Setting up audio properties");
    //         soundRef.current.setRefDistance(20);
    //         soundRef.current.setMaxDistance(50);
    //         soundRef.current.setRolloffFactor(1);
    //         soundRef.current.setLoop(true);
    //         console.log(soundRef.current.listener, '------------useEffect----')
    //         console.log("VideoAndAudioPlayer: Audio properties set");
    //     }
    // }, []);

    // Kluczowy useEffect do kontroli odtwarzania/pauzowania dźwięku na podstawie lokalnego stanu
    // useEffect(() => {
    //     console.log(soundRef.current, '----------------')
    //     if (soundRef.current) {
    //         if (isAudioEnabled) {
    //             if (!soundRef.current.isPlaying) {
    //                 try {
    //                     // Ważne: Wznowienie kontekstu audio przed odtworzeniem
    //                     soundRef.current.context.resume();
    //                     soundRef.current.play();
    //                     console.log("Audio started/resumed playing.");
    //                 } catch (error) {
    //                     console.error("Error playing audio:", error);
    //                 }
    //             }
    //         } else {
    //             if (soundRef.current.isPlaying) {
    //                 soundRef.current.pause();
    //                 console.log("Audio paused.");
    //             }
    //         }
    //     }
    // }, [isAudioEnabled]); // Reaguj na zmianę lokalnego stanu isAudioEnabled
   
    useEffect(() => {
        if (soundRef.current) {
            
            const gain = soundRef.current.gain;
            console.log(gain, '------------gain----')
            if (gain) {
                gain.gain.setValueAtTime(isAudioEnabled ? 1 : 0, soundRef.current.context.currentTime);
                console.log(isAudioEnabled ? "Audio unmuted" : "Audio muted");
            }
        }
    }, [isAudioEnabled]);
    

    const handleToggleAudio = (event: React.MouseEvent) => {
        event.stopPropagation(); // Ważne: Zatrzymaj propagację zdarzenia, aby uniknąć kolizji z kontrolkami kamery
        setIsAudioEnabled(prev => !prev);
    };

    return (
        <group position={[3.95, 2, 5]}> {/* Grupa dla ekranu i dźwięku */}
            <mesh rotation={[0, Math.PI, 0]} scale={[9.5, 4.8, 0]}>
                <planeGeometry />
                <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>
            <PositionalAudio ref={soundRef} url={src} />

            {/* Przycisk kontroli audio umieszczony jako HTML w scenie 3D */}
            {/* Pozycjonujemy go relatywnie do grupy VideoAndAudioPlayer */}
            <Html position={[0, -2.8, 0.1]} transform> {/* X, Y, Z - dostosuj pozycję */}
                <div 
                    className="flex items-center justify-center bg-gray-800 bg-opacity-80 rounded-full shadow-lg cursor-pointer"
                    style={{
                        width: '48px', // Stała szerokość
                        height: '48px', // Stała wysokość
                        fontSize: '24px', // Rozmiar ikony
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

// --- Komponent główny VideoScreen ---
const VideoScreen = () => {
    // isAudioGloballyEnabled nie jest już potrzebne jako prop
    return (
        <Suspense fallback={<VideoLoadingFallback />}>
            <VideoAndAudioPlayer src="/videos/sample2.mp4" />
        </Suspense>
    );
};

export default VideoScreen;