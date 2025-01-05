import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // Sprawdzamy czy komponent jest zamontowany
        if (!mountRef.current) return;

        // Ustawienia renderera
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Dodajemy renderer do DOM
        mountRef.current.appendChild(renderer.domElement);

        // Scena i kamera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(4, 5, 11);

        // Kontrolki
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = 5;
        controls.maxDistance = 20;
        controls.minPolarAngle = 0.5;
        controls.maxPolarAngle = 1.5;
        controls.autoRotate = false;
        controls.target = new THREE.Vector3(0, 1, 0);
        controls.update();

        // Podłoże
        const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
        groundGeometry.rotateX(-Math.PI / 2);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            side: THREE.DoubleSide
        });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.castShadow = false;
        groundMesh.receiveShadow = true;
        scene.add(groundMesh);

        // Światła
        const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
        spotLight.position.set(0, 25, 0);
        spotLight.castShadow = true;
        spotLight.shadow.bias = -0.0001;
        scene.add(spotLight);

        // Dodaj światło ambient dla lepszego oświetlenia
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Ładowanie modelu
        const loader = new GLTFLoader();
        loader.load('/cinema/scene.gltf', (gltf) => {
            const mesh = gltf.scene;
            mesh.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            mesh.position.set(0, 1.05, -1);
            scene.add(mesh);
        });

        // Obsługa zmiany rozmiaru okna
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Funkcja animacji
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Czyszczenie
        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current?.removeChild(renderer.domElement);
            scene.clear();
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ThreeScene;