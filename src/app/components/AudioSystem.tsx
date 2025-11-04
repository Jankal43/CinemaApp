"use client";

import { useEffect, useState, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

interface AudioSystemProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

const AudioSystem = ({ videoRef }: AudioSystemProps) => {
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
                // const positions = [
                //     { x: 1.5, y: 2, z: 5, pan: -1 },     // Left Front speaker
                //     { x: 6.4, y: 2, z: 5, pan: 1 },      // Right Front speaker
                //     { x: 3.95, y: 2, z: 5, pan: 0 },     // Center speaker
                //     { x: 1.5, y: 2, z: 1, pan: -0.5 },  // Left Rear speaker
                //     { x: 6.4, y: 2, z: 1, pan: 0.5 },    // Right Rear speaker
                // ];
                const positions = [
                    { x: 8.4, y: 1.3, z: 0, pan: -1 },     // Left Front speaker
                    { x: 0, y: 1.3, z: 0, pan: 1 },      // Right Front speaker
                    // { x: 3.95, y: 2, z: 5, pan: 0 },     // Center speaker
                    { x: 8.4, y: 4.1, z: 0, pan: -9.2 },  // Left Rear speaker
                    { x: 0, y: 4.1, z: 0, pan: -9.2 },     // Right Rear speaker
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
                console.log("Cleaning up AudioSystem...");
                
                // Clean up all audio sources
                audioSources.current.forEach(source => {
                    try {
                        source.stop();
                        if (source.source) {
                            source.source.disconnect();
                        }
                    } catch (error) {
                        console.error("Error stopping audio source:", error);
                    }
                });
                audioSources.current = [];
                
                if (audioListener.current) {
                    try {
                        camera.remove(audioListener.current);
                    } catch (error) {
                        console.error("Error removing audio listener:", error);
                    }
                }
                
                // Reset flags
                hasCreatedSource.current = false;
                setIsAudioReady(false);
            };
        }
    }, [camera, videoRef]);

    if (!isAudioReady) {
        return null;
    }

    return null;
};

export default AudioSystem;
