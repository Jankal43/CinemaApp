"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls, useGLTF, useTexture } from "@react-three/drei";
import { Html } from "@react-three/drei";
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
    const [isLocked, setIsLocked] = useState(false);

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
    const audioSource = useRef<THREE.PositionalAudio | null>(null);
    const [isAudioReady, setIsAudioReady] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            
            // Create audio listener and attach it to the camera
            audioListener.current = new THREE.AudioListener();
            camera.add(audioListener.current);

            // Create audio source
            audioSource.current = new THREE.PositionalAudio(audioListener.current);
            audioSource.current.setMediaElementSource(video);
            audioSource.current.setRefDistance(20);
            audioSource.current.setMaxDistance(50);
            audioSource.current.setRolloffFactor(1);
            audioSource.current.setLoop(true);

            // Position the audio source at the screen location
            audioSource.current.position.set(3.95, 2, 5);

            setIsAudioReady(true);

            return () => {
                if (audioSource.current) {
                    audioSource.current.stop();
                }
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

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                    Loading 3D Scene...
                </div>
            )}
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
