// "use client";

// import { useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import VideoScreen from "./components/VideoScreen";
// import CinemaModel from "./components/CinemaModel";
// import FPSControls from "./components/FPSControls";
// import { FaVolumeUp, FaVolumeMute } from "react-icons/fa"; // Załóżmy, że masz react-icons

// interface ThreeSceneProps {
//     x: number;
//     y: number;
//     z: number;
// }

// const ThreeScene = ({ x, y, z }: ThreeSceneProps) => {
//     const [isLoading, setIsLoading] = useState(true);
//     const [isAudioEnabled, setIsAudioEnabled] = useState(false); // Domyślnie audio wyłączone

//     const handleToggleAudio = () => {
//         setIsAudioEnabled(prev => !prev);
//     };

//     return (
//         <div className="relative">
//             {isLoading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white z-20">
//                     Loading 3D Scene...
//                 </div>
//             )}
//             <Canvas
//                 onCreated={() => setIsLoading(false)}
//                 style={{ width: "100%", height: "550px" }}
//                 camera={{ position: [x, y, z], fov: 75 }}
//                 gl={{ 
//                     preserveDrawingBuffer: true,
//                     powerPreference: "high-performance",
//                     antialias: true
//                 }}
//                 dpr={[1, 2]}
//             >
//                 <ambientLight intensity={0.5} />
//                 <directionalLight position={[5, 5, 5]} intensity={1} />
//                 <CinemaModel />
//                 <VideoScreen isAudioGloballyEnabled={isAudioEnabled} /> {/* Przekazujemy stan audio */}
//                 <FPSControls />
//             </Canvas>

//             {/* Przycisk kontroli dźwięku */}
//             <button
//                 onClick={handleToggleAudio}
//                 className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
//             >
//                 {isAudioEnabled ? <FaVolumeUp size={24} /> : <FaVolumeMute size={24} />}
//             </button>
            
//             {!isAudioEnabled && !isLoading && (
//                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-xl z-10 text-center animate-pulse">
//                     Kliknij ikonę głośnika, aby włączyć dźwięk
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ThreeScene;
"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import VideoScreen from "./components/VideoScreen";
import CinemaModel from "./components/CinemaModel";
import FPSControls from "./components/FPSControls";
// FaVolumeUp, FaVolumeMute nie są już potrzebne w tym komponencie

interface ThreeSceneProps {
    x: number;
    y: number;
    z: number;
}

const ThreeScene = ({ x, y, z }: ThreeSceneProps) => {
    const [isLoading, setIsLoading] = useState(true);
    // const [isAudioEnabled, setIsAudioEnabled] = useState(false); // Niepotrzebne tutaj

    // const handleToggleAudio = () => { // Niepotrzebne tutaj
    //     setIsAudioEnabled(prev => !prev);
    // };

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white z-20">
                    Loading 3D Scene...
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
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <CinemaModel />
                <VideoScreen /* isAudioGloballyEnabled={isAudioEnabled} */ /> {/* Usuwamy prop */}
                <FPSControls />
            </Canvas>

            {/* Usuwamy przycisk kontroli audio z tego miejsca */}
            {/* Usuwamy również wskazówkę, bo przycisk jest teraz częścią sceny */}
            {/*
            {!isAudioEnabled && !isLoading && (
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-xl z-10 text-center animate-pulse">
                    Kliknij ikonę głośnika, aby włączyć dźwięk
                </div>
            )}
            */}
        </div>
    );
};

export default ThreeScene;