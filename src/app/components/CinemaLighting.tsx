"use client";

import { useEffect, useRef, useEff } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CinemaLighting = () => {
    const screenLightRef = useRef<THREE.SpotLight>(null);
    const screenGlowRef = useRef<THREE.PointLight>(null);

   
    useFrame((state) => {
        if (screenGlowRef.current) {
         
            const time = state.clock.elapsedTime;
            screenGlowRef.current.intensity = 0.3 + Math.sin(time * 0.5) * 0.05;
        }
    });



 
  useFrame(() => {
    if (screenLightRef.current) {
      screenLightRef.current.target.position.set(4.2, -2, 0); // punkt na ekranie
      screenLightRef.current.target.updateMatrixWorld(); // bardzo ważne!
    }
  }, []);
  


    return (
        <>
            {/* Bardzo ciemne światło otoczenia - typowe dla kina */}
            <ambientLight intensity={0.15} color="#1a1a1a" />
            
            {/* Główne światło skierowane na ekran - symuluje światło z projektora */}
            {/* <spotLight
                ref={screenLightRef}
                position={[4.2, 6, -9]}
                angle={0.6}
                penumbra={0.8}
                intensity={532.9}
                distance={17}
                decay={1.2}
                target-position={[-8.2, -10, 0]}
                color="#ffffff"
                castShadow={false}
            />
             */}
          <spotLight
        ref={screenLightRef}
        position={[4.2, 4.3, -9.8]}
        angle={1}
        penumbra={0.8}
        intensity={40}
        distance={10}
        decay={2}
        color="#ffffff"
        castShadow={false}
      />

            {/* Światło od ekranu - delikatny blask ekranu */}
            <pointLight
                ref={screenGlowRef}
                position={[3.95, 2, 5]}
                intensity={1.3}
                distance={8}
                decay={2}
                color="#ffffff"
            />

           
          

            {/* Dodatkowe światło kierunkowe z góry - bardzo delikatne */}
            {/* <directionalLight
                position={[3.95, 5, 2.5]}
                intensity={4.1}
                color="#2a2a2a"
                castShadow={false}
            /> */}
        </>
    );
};

export default CinemaLighting;

