"use client";

import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";

const FPSControls = () => {
    const { camera } = useThree();
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        camera.lookAt(5, 1.3, 5);

        const handlePointerLockChange = () => {
            const isCurrentlyLocked = document.pointerLockElement !== null;
            setIsLocked(isCurrentlyLocked);
        };

        document.addEventListener('pointerlockchange', handlePointerLockChange);

        return () => {
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            // Bezpieczne wyjście z pointer lock
            try {
                if (document.pointerLockElement) {
                    document.exitPointerLock();
                }
            } catch (error) {
                console.warn("Error exiting pointer lock:", error);
            }
        };
    }, [camera]);

    const handleLock = () => {
        setIsLocked(true);
    };

    const handleUnlock = () => {
        setIsLocked(false);
    };

    return (
        <PointerLockControls 
            camera={camera}
            onLock={handleLock}
            onUnlock={handleUnlock}
        />
    );
};

export default FPSControls;
