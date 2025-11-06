"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";

const FPSControls = () => {
    const { camera } = useThree();

    useEffect(() => {
        camera.lookAt(5, 1.3, 5);

        return () => {
            try {
                if (document.pointerLockElement) {
                    document.exitPointerLock();
                }
            } catch (error) {
                console.warn("Error exiting pointer lock:", error);
            }
        };
    }, [camera]);

    return (
        <PointerLockControls args={[camera]} />
    );
};

export default FPSControls;
