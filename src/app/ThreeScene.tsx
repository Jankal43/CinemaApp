"use client";


import { Canvas, useThree } from "@react-three/fiber";
import { PointerLockControls, useGLTF } from "@react-three/drei";

const CinemaModel = () => {
    const { scene } = useGLTF("/cinema/scene.gltf");
    return <primitive object={scene} scale={1} />;
};

// Komponent kamery FPS
const FPSControls = () => {
    const { camera } = useThree();
    return <PointerLockControls args={[camera]} />;
};

const ThreeScene = () => {
    return (
        <Canvas
            style={{ width: "100%", height: "550px" }}
            camera={{ position: [0, 1.6, 0], fov: 75 }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <CinemaModel />
            <FPSControls />
        </Canvas>
    );
};

export default ThreeScene;
