"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PointerLockControls, useGLTF } from "@react-three/drei";

interface ThreeSceneProps {
    x: number;
    y: number;
    z: number;
}

const CinemaModel = () => {
    const { scene } = useGLTF("/cinema/scene.gltf");
    return <primitive object={scene} scale={1} />;
};

const FPSControls = () => {
    const { camera } = useThree();

    useEffect(() => {
        camera.lookAt(5, 1.3, 5);
    }, [camera]);

    return <PointerLockControls args={[camera]} />;
};

const ThreeScene = ({x,y,z}:ThreeSceneProps) => {
    return (
        <Canvas
            style={{ width: "100%", height: "550px" }}
            camera={{ position: [x, y, z], fov: 75 }} //w lewo 1.2
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <CinemaModel />
            <FPSControls />
        </Canvas>
    );
};

export default ThreeScene;
