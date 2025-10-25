"use client";

import { useEffect, useState } from "react";
import { useGLTF, Html } from "@react-three/drei";

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

export default CinemaModel;
