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

export default AudioSystem;
