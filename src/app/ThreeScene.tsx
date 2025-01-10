"use client"
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const lightsRef = useRef({
        spotLight: null,
        ambientLight: null,
        redLight1: null,
        redLight2: null
    });
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const [cameraCoords, setCameraCoords] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!mountRef.current) return;

        console.log('Inicjalizacja komponentu ThreeScene');

        const containerWidth = mountRef.current.clientWidth;
        const containerHeight = 600;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
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
        camera.position.set(-0.50, 2.10, -1.50);
        camera.lookAt(255,255,5);
        //pierwszy prawo -0.38 1.63  -1.87
        cameraRef.current = camera;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = true;
        controls.target.set(0, 1, 0);
        controls.update();
        controlsRef.current = controls;

        const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
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
            '/cinema/scene.gltf',
            (gltf) => {
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
                console.error('Błąd ładowania modelu:', error);
            }
        );

        const handleResize = () => {
            const newWidth = mountRef.current.clientWidth;
            camera.aspect = newWidth / containerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, containerHeight);
        };
        window.addEventListener('resize', handleResize);

        const movementSpeed = 0.1;
        const keys = {};
        const handleKeyDown = (event) => {
            keys[event.key.toLowerCase()] = true;
        };

        const handleKeyUp = (event) => {
            keys[event.key.toLowerCase()] = false;
        };



        const updateCameraPosition = () => {
            if (keys['w']) camera.position.z -= movementSpeed;
            if (keys['s']) camera.position.z += movementSpeed;
            if (keys['a']) camera.position.x -= movementSpeed;
            if (keys['d']) camera.position.x += movementSpeed;
            if (keys['q']) camera.position.y -= movementSpeed;
            if (keys['e']) camera.position.y += movementSpeed;
            setCameraCoords({
                x: camera.position.x.toFixed(2),
                y: camera.position.y.toFixed(2),
                z: camera.position.z.toFixed(2)
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const animate = () => {
            requestAnimationFrame(animate);
            updateCameraPosition();
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);

            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }

            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((mat) => mat.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });

            renderer.dispose();
            controls.dispose();
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
                <p>Kamera: X: {cameraCoords.x}, Y: {cameraCoords.y}, Z: {cameraCoords.z}</p>
            </div>
        </div>
    );
};

export default ThreeScene;
