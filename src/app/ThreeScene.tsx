"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

interface ThreeSceneProps {
    x: number;
    y: number;
    z: number;
}

const VideoScreen = ({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) => {
    const textureRef = useRef<THREE.VideoTexture | null>(null);
    const [isVideoReady, setIsVideoReady] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            
            const handleCanPlay = () => {
                setIsVideoReady(true);
                if (video) {
                    textureRef.current = new THREE.VideoTexture(video);
                    textureRef.current.minFilter = THREE.LinearFilter;
                    textureRef.current.magFilter = THREE.LinearFilter;
                    textureRef.current.format = THREE.RGBAFormat;
                }
            };

            video.addEventListener('canplay', handleCanPlay);
            
            // Ensure video is playing and looping
            video.play().catch(error => {
                console.error("Error playing video:", error);
            });

            // Handle video end to ensure looping
            video.addEventListener('ended', () => {
                video.currentTime = 0;
                video.play().catch(error => {
                    console.error("Error replaying video:", error);
                });
            });

            return () => {
                video.removeEventListener('canplay', handleCanPlay);
            };
        }
    }, [videoRef]);

    useFrame(() => {
        if (textureRef.current) {
            textureRef.current.needsUpdate = true;
        }
    });

    if (!isVideoReady) {
        return null;
    }

    return (
        <mesh position={[3.95, 2, 5]} rotation={[0, Math.PI, 0]} scale={[9.5, 4.8, 0]}>
            <planeGeometry />
            <meshBasicMaterial map={textureRef.current} />
        </mesh>
    );
};

const CinemaModel = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { scene } = useGLTF("/cinema/scene.gltf");

    useEffect(() => {
        setIsLoading(false);
    }, [scene]);

    return (
        <>
            {isLoading && (
                <Html center>
                    <div className="text-white bg-black p-2 rounded">Loading 3D Model...</div>
                </Html>
            )}
            <primitive object={scene} scale={1} />
        </>
    );
};

const FPSControls = () => {
    const { camera } = useThree();
    const [, setIsLocked] = useState(false);

    useEffect(() => {
        camera.lookAt(5, 1.3, 5);

        const handlePointerLockChange = () => {
            setIsLocked(document.pointerLockElement !== null);
        };

        document.addEventListener('pointerlockchange', handlePointerLockChange);

        return () => {
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
        };
    }, [camera]);

    return (
        <PointerLockControls 
            args={[camera]} 
            onLock={() => setIsLocked(true)}
            onUnlock={() => setIsLocked(false)}
        />
    );
};

const AudioSystem = ({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) => {
    const { camera } = useThree();
    const audioListener = useRef<THREE.AudioListener | null>(null);
    const audioSources = useRef<THREE.PositionalAudio[]>([]);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const hasCreatedSource = useRef(false);

    useEffect(() => {
        if (videoRef.current && !hasCreatedSource.current) {
            const video = videoRef.current;
            
            // Create audio listener and attach it to the camera
            audioListener.current = new THREE.AudioListener();
            camera.add(audioListener.current);

            try {
                // Use the audio context from the listener
                const audioContext = audioListener.current.context;
                const source = audioContext.createMediaElementSource(video);
                
                // Create multiple audio sources for stereo/surround effect
                const positions = [
                    { x: 3.95, y: 2, z: 5, pan: -1 },    // Left speaker
                    { x: 3.95, y: 2, z: 5, pan: 1 },     // Right speaker
                    { x: 3.95, y: 2, z: 5, pan: 0 },     // Center speaker
                    { x: 3.95, y: 2, z: 5, pan: -0.5 },  // Left surround
                    { x: 3.95, y: 2, z: 5, pan: 0.5 },   // Right surround
                ];

                positions.forEach(({ x, y, z, pan }) => {
                    if (!audioListener.current) return;
                    
                    const audioSource = new THREE.PositionalAudio(audioListener.current);
                    const sourceGain = audioContext.createGain();
                    const sourcePanner = audioContext.createPanner();
                    
                    // Set up the audio chain
                    source.connect(sourceGain);
                    sourceGain.connect(sourcePanner);
                    sourcePanner.connect(audioSource.gain);
                    
                    // Configure the panner for stereo effect
                    sourcePanner.setPosition(x, y, z);
                    sourcePanner.setOrientation(pan, 0, 0);
                    
                    // Set up the positional audio properties
                    audioSource.setRefDistance(20);
                    audioSource.setMaxDistance(50);
                    audioSource.setRolloffFactor(1);
                    audioSource.setLoop(true);
                    
                    // Position the audio source
                    audioSource.position.set(x, y, z);
                    
                    audioSources.current.push(audioSource);
                });
                
                hasCreatedSource.current = true;
                setIsAudioReady(true);
            } catch (error) {
                console.error("Error setting up audio:", error);
            }

            return () => {
                // Clean up all audio sources
                audioSources.current.forEach(source => {
                    source.stop();
                    if (source.source) {
                        source.source.disconnect();
                    }
                });
                audioSources.current = [];
                
                if (audioListener.current) {
                    camera.remove(audioListener.current);
                }
            };
        }
    }, [camera, videoRef]);

    if (!isAudioReady) {
        return null;
    }

    return null;
};

const ThreeScene = ({x,y,z}:ThreeSceneProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            
            // Set video properties
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            
            // Start playing
            video.play().catch(error => {
                console.error("Error playing video:", error);
            });
        }
    }, []);

    const toggleAudio = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                    Loading 3D Scene...
                </div>
            )}
            <button
                onClick={toggleAudio}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white px-4 py-2 rounded hover:bg-opacity-75"
            >
                {isAudioEnabled ? '🔊 Sound On' : '🔈 Sound Off'}
            </button>
            <video
                ref={videoRef}
                src="/videos/sample.mp4"
                style={{ display: 'none' }}
                loop
                muted
                playsInline
            />
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
