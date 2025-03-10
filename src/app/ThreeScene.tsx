"use client";

import { useEffect, useState} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PointerLockControls, useGLTF } from "@react-three/drei";
import { Html } from "@react-three/drei";


interface ThreeSceneProps {
    x: number;
    y: number;
    z: number;
}

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

    useEffect(() => {
        camera.lookAt(5, 1.3, 5);
    }, [camera]);

    return <PointerLockControls args={[camera]} />;
};

const ThreeScene = ({x,y,z}:ThreeSceneProps) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                    Loading 3D Scene...
                </div>
            )}
            <Canvas
                onCreated={() => setIsLoading(false)}
                style={{ width: "100%", height: "550px" }}
                camera={{ position: [x, y, z], fov: 75 }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <CinemaModel />
                <FPSControls />
            </Canvas>
        </div>
    );
};

export default ThreeScene;
