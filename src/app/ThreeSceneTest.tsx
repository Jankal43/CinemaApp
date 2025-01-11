    // "use client"
    // import React, { useEffect, useRef } from 'react';
    // import * as THREE from 'three';
    // import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
    // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    //
    // const ThreeScene = () => {
    //     const mountRef = useRef(null);
    //     const sceneRef = useRef(null);
    //     const rendererRef = useRef(null);
    //     const lightsRef = useRef({
    //         spotLight: null,
    //         ambientLight: null,
    //         redLight1: null,
    //         redLight2: null
    //     });
    //
    //     useEffect(() => {
    //         if (typeof window === 'undefined') return;
    //         if (!mountRef.current) return;
    //
    //         console.log('Inicjalizacja komponentu ThreeScene');
    //
    //         // Get container dimensions
    //         const containerWidth = mountRef.current.clientWidth;
    //         const containerHeight = 600;
    //
    //         // Renderer setup
    //         const renderer = new THREE.WebGLRenderer({
    //             antialias: true,
    //             alpha: true
    //         });
    //         console.log('Renderer utworzony:', renderer);
    //
    //         renderer.outputColorSpace = THREE.SRGBColorSpace;
    //         renderer.setSize(containerWidth, containerHeight);
    //         renderer.setClearColor(0x000000, 0.1);
    //         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    //         renderer.shadowMap.enabled = true;
    //         renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //         rendererRef.current = renderer;
    //
    //         mountRef.current.appendChild(renderer.domElement);
    //
    //         // Scene setup
    //         const scene = new THREE.Scene();
    //         sceneRef.current = scene;
    //         console.log('Scena utworzona:', scene);
    //
    //         // Camera setup
    //         const camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 1, 1000);
    //         camera.position.set(4, 5, 11);
    //
    //         // Controls
    //         const controls = new OrbitControls(camera, renderer.domElement);
    //         controls.enableDamping = true;
    //         controls.enablePan = false;
    //         controls.minDistance = 5;
    //         controls.maxDistance = 20;
    //         controls.minPolarAngle = 0.5;
    //         controls.maxPolarAngle = 1.5;
    //         controls.autoRotate = true;
    //         controls.autoRotateSpeed = 1;
    //         controls.target = new THREE.Vector3(0, 1, 0);
    //         controls.update();
    //
    //         // Ground
    //         const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    //         groundGeometry.rotateX(-Math.PI / 2);
    //         const groundMaterial = new THREE.MeshStandardMaterial({
    //             color: 0x331111,
    //             side: THREE.DoubleSide,
    //             roughness: 0.8,
    //             metalness: 0.2
    //         });
    //         const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    //         groundMesh.receiveShadow = true;
    //         scene.add(groundMesh);
    //
    //         console.log('Tworzenie świateł...');
    //
    //         // Lighting setup
    //         lightsRef.current.spotLight = new THREE.SpotLight(0xffffff, 5000);
    //         const spotLight = lightsRef.current.spotLight;
    //         spotLight.position.set(0, 25, 0);
    //         spotLight.angle = 0.5;
    //         spotLight.penumbra = 0.5;
    //         spotLight.castShadow = true;
    //         spotLight.shadow.mapSize.width = 1024;
    //         spotLight.shadow.mapSize.height = 1024;
    //         spotLight.shadow.bias = -0.0001;
    //         scene.add(spotLight);
    //         console.log('SpotLight dodany:', spotLight);
    //
    //         lightsRef.current.ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    //         scene.add(lightsRef.current.ambientLight);
    //         console.log('AmbientLight dodany:', lightsRef.current.ambientLight);
    //
    //         lightsRef.current.redLight1 = new THREE.PointLight(0xff0000, 100);
    //         const redLight1 = lightsRef.current.redLight1;
    //         redLight1.position.set(-5, 3, -5);
    //         scene.add(redLight1);
    //         console.log('RedLight1 dodany:', redLight1);
    //
    //         lightsRef.current.redLight2 = new THREE.PointLight(0xff0000, 100);
    //         const redLight2 = lightsRef.current.redLight2;
    //         redLight2.position.set(5, 3, -5);
    //         scene.add(redLight2);
    //         console.log('RedLight2 dodany:', redLight2);
    //
    //         // Debug helpers
    //         const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    //         scene.add(spotLightHelper);
    //
    //         const redLightHelper1 = new THREE.PointLightHelper(redLight1);
    //         scene.add(redLightHelper1);
    //
    //         const redLightHelper2 = new THREE.PointLightHelper(redLight2);
    //         scene.add(redLightHelper2);
    //
    //         // Load model
    //         const loader = new GLTFLoader();
    //         loader.load(
    //             '/cinema/scene.gltf',
    //             (gltf) => {
    //                 console.log('Model załadowany:', gltf);
    //                 const mesh = gltf.scene;
    //                 mesh.traverse((child) => {
    //                     if (child.isMesh) {
    //                         child.castShadow = true;
    //                         child.receiveShadow = true;
    //                         if (child.material) {
    //                             child.material.needsUpdate = true;
    //                             child.material.roughness = 0.7;
    //                             child.material.metalness = 0.3;
    //                             console.log('Mesh materials:', {
    //                                 name: child.name,
    //                                 material: child.material,
    //                                 castShadow: child.castShadow,
    //                                 receiveShadow: child.receiveShadow
    //                             });
    //                         }
    //                     }
    //                 });
    //                 mesh.position.set(0, 1.05, -1);
    //                 scene.add(mesh);
    //                 console.log('Model dodany do sceny');
    //             },
    //             (progress) => {
    //                 if (progress.total > 0) {
    //                     const percentage = (progress.loaded / progress.total) * 100;
    //                     console.log('Postęp ładowania:', percentage.toFixed(2) + '%');
    //                 }
    //             },
    //             (error) => {
    //                 console.error('Błąd ładowania modelu:', error);
    //             }
    //         );
    //
    //         // Handle resize
    //         const handleResize = () => {
    //             const newWidth = mountRef.current.clientWidth;
    //             camera.aspect = newWidth / containerHeight;
    //             camera.updateProjectionMatrix();
    //             renderer.setSize(newWidth, containerHeight);
    //         };
    //         window.addEventListener('resize', handleResize);
    //
    //         // Animation
    //         const animate = () => {
    //             requestAnimationFrame(animate);
    //
    //             // Sprawdź czy światła są nadal w scenie
    //             const lights = Object.values(lightsRef.current);
    //             lights.forEach(light => {
    //                 if (light && !scene.children.includes(light)) {
    //                     scene.add(light);
    //                 }
    //             });
    //
    //             controls.update();
    //             renderer.render(scene, camera);
    //         };
    //
    //         // Log stanu sceny przed animacją
    //         console.log('Stan sceny przed animacją:', {
    //             światła: scene.children.filter(child => child.isLight),
    //             całkowita_liczba_obiektów: scene.children.length
    //         });
    //
    //         animate();
    //
    //         // Cleanup
    //         return () => {
    //             window.removeEventListener('resize', handleResize);
    //
    //             // Usuń światła
    //             Object.values(lightsRef.current).forEach(light => {
    //                 if (light) scene.remove(light);
    //             });
    //
    //             if (mountRef.current) {
    //                 mountRef.current.removeChild(renderer.domElement);
    //             }
    //
    //             scene.traverse((object) => {
    //                 if (object.geometry) {
    //                     object.geometry.dispose();
    //                 }
    //                 if (object.material) {
    //                     if (Array.isArray(object.material)) {
    //                         object.material.forEach(material => material.dispose());
    //                     } else {
    //                         object.material.dispose();
    //                     }
    //                 }
    //             });
    //
    //             scene.clear();
    //             renderer.dispose();
    //             controls.dispose();
    //         };
    //     }, []);
    //
    //     return (
    //         <div className="w-full flex justify-center">
    //             <div
    //                 ref={mountRef}
    //                 className="w-full max-w-4xl rounded-lg overflow-hidden border-2 border-red-800"
    //                 style={{ height: '600px' }}
    //             />
    //         </div>
    //     );
    // };
    //
    // export default ThreeScene;