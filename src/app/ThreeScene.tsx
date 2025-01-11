"use client"
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeScene = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const animationFrameRef = useRef(null);
    const lightsRef = useRef({
        spotLight: null,
        ambientLight: null,
        redLight1: null,
        redLight2: null
    });
    const cameraRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0, isDown: false });
    const rotationRef = useRef({ x: 0, y: 0 });
    const [cameraDirection, setCameraDirection] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!mountRef.current) return;

        let mounted = true;

        // Dispose existing renderer if reinitializing
        if (rendererRef.current) {
            rendererRef.current.dispose();
            rendererRef.current = null;
        }

        if (!mountRef.current) {
            console.warn('Mount reference is missing');
            return;
        }

        const containerWidth = mountRef.current.clientWidth;
        const containerHeight = 600;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setSize(containerWidth, containerHeight);
        renderer.setClearColor(0x000000, 0.1);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        mountRef.current.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 1, 1000);
        camera.position.set(3.75, 2.5, -0.78);
        cameraRef.current = camera;

        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        groundGeometry.rotateX(-Math.PI / 2);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x331111,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.2
        });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.receiveShadow = true;
        scene.add(groundMesh);

        const spotLight = new THREE.SpotLight(0xffffff, 5000);
        spotLight.position.set(0, 25, 0);
        spotLight.castShadow = true;
        scene.add(spotLight);
        lightsRef.current.spotLight = spotLight;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambientLight);
        lightsRef.current.ambientLight = ambientLight;

        const redLight1 = new THREE.PointLight(0xff0000, 100);
        redLight1.position.set(-5, 3, -5);
        scene.add(redLight1);
        lightsRef.current.redLight1 = redLight1;

        const redLight2 = new THREE.PointLight(0xff0000, 100);
        redLight2.position.set(5, 3, -5);
        scene.add(redLight2);
        lightsRef.current.redLight2 = redLight2;

        const loader = new GLTFLoader();
        loader.load(
            `${process.env.PUBLIC_URL || ''}/cinema/scene.gltf`,
            (gltf) => {
                if (!mounted) return;
                const mesh = gltf.scene;
                mesh.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                mesh.position.set(0, 1.05, -1);
                scene.add(mesh);
            },
            undefined,
            (error) => {
                console.error('Error loading GLTF model:', error);
            }
        );

        const handleMouseDown = (e) => {
            if (!mounted) return;
            mouseRef.current.isDown = true;
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        const handleMouseUp = () => {
            if (!mounted) return;
            mouseRef.current.isDown = false;
        };

        const handleMouseMove = (e) => {
            if (!mouseRef.current.isDown || !mounted) return;

            const deltaX = e.clientX - mouseRef.current.x;
            const deltaY = e.clientY - mouseRef.current.y;

            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;

            rotationRef.current.y -= deltaX * 0.01;
            rotationRef.current.x = Math.max(
                -Math.PI / 2,
                Math.min(Math.PI / 2, rotationRef.current.x - deltaY * 0.01)
            );

            camera.rotation.order = 'YXZ';
            camera.rotation.x = rotationRef.current.x;
            camera.rotation.y = rotationRef.current.y;

            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            setCameraDirection({
                x: direction.x.toFixed(2),
                y: direction.y.toFixed(2),
                z: direction.z.toFixed(2)
            });
        };

        const handleResize = () => {
            if (!mounted) return;
            const newWidth = mountRef.current.clientWidth;
            camera.aspect = newWidth / containerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, containerHeight);
        };

        window.addEventListener('resize', handleResize);
        mountRef.current.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            if (!mounted) return;
            animationFrameRef.current = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            mounted = false;

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            window.removeEventListener('resize', handleResize);
            mountRef.current?.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);

            if (sceneRef.current) {
                sceneRef.current.traverse((object) => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach((mat) => mat.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }

            if (rendererRef.current) {
                if (mountRef.current) {
                    mountRef.current.removeChild(rendererRef.current.domElement);
                }
                rendererRef.current.dispose();
                rendererRef.current = null;
            }
        };
    }, []);

    return (
        <div className="w-full flex flex-col items-center">
            <div
                ref={mountRef}
                className="w-full max-w-4xl rounded-lg overflow-hidden border-2 border-red-800"
                style={{ height: '600px' }}
            />
            <div className="mt-4 text-white">
                <p>Kierunek: X: {cameraDirection.x}, Y: {cameraDirection.y}, Z: {cameraDirection.z}</p>
            </div>
        </div>
    );
};

export default ThreeScene;