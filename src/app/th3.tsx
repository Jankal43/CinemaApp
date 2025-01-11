// "use client";
//
// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
//
// const ThreeScene = () => {
//     const mountRef = useRef(null);
//     const sceneRef = useRef(new THREE.Scene());
//     const rendererRef = useRef(null);
//     const cameraRef = useRef(null);
//     const mouseRef = useRef({ x: 0, y: 0, isDown: false });
//     const rotationRef = useRef({ x: 0, y: 0 });
//     const [cameraDirection, setCameraDirection] = useState({ x: 0, y: 0, z: 0 });
//
//     useEffect(() => {
//         if (typeof window === "undefined" || !mountRef.current) return;
//
//         console.log("Inicjalizacja komponentu ThreeScene");
//
//         // Get container dimensions
//         const containerWidth = mountRef.current.clientWidth;
//         const containerHeight = 600;
//
//         // Renderer setup
//         const renderer = new THREE.WebGLRenderer({
//             antialias: true,
//             alpha: true,
//         });
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
//         const scene = sceneRef.current;
//
//         // Camera setup
//         const camera = new THREE.PerspectiveCamera(
//             45,
//             containerWidth / containerHeight,
//             1,
//             1000
//         );
//         camera.position.set(3.75, 2.5, -0.78);
//         cameraRef.current = camera;
//
//         // Ground setup
//         const groundGeometry = new THREE.PlaneGeometry(20, 20);
//         groundGeometry.rotateX(-Math.PI / 2);
//         const groundMaterial = new THREE.MeshStandardMaterial({
//             color: 0x331111,
//             side: THREE.DoubleSide,
//             roughness: 0.8,
//             metalness: 0.2,
//         });
//         const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
//         groundMesh.receiveShadow = true;
//         scene.add(groundMesh);
//
//         // Lighting setup
//         const spotLight = new THREE.SpotLight(0xffffff, 5000);
//         spotLight.position.set(0, 25, 0);
//         spotLight.castShadow = true;
//         scene.add(spotLight);
//
//         const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
//         scene.add(ambientLight);
//
//         const redLight1 = new THREE.PointLight(0xff0000, 100);
//         redLight1.position.set(-5, 3, -5);
//         scene.add(redLight1);
//
//         const redLight2 = new THREE.PointLight(0xff0000, 100);
//         redLight2.position.set(5, 3, -5);
//         scene.add(redLight2);
//
//         // Load GLTF model
//         const loader = new GLTFLoader();
//         loader.load(
//             "/cinema/scene.gltf", // Upewnij się, że ścieżka do modelu jest poprawna
//             (gltf) => {
//                 console.log("Model załadowany:", gltf);
//                 const mesh = gltf.scene;
//                 mesh.traverse((child) => {
//                     if (child.isMesh) {
//                         child.castShadow = true;
//                         child.receiveShadow = true;
//                     }
//                 });
//                 mesh.position.set(0, 1.05, -1);
//                 scene.add(mesh);
//             },
//             undefined,
//             (error) => {
//                 console.error("Błąd ładowania modelu:", error);
//             }
//         );
//
//         // Mouse controls
//         const handleMouseDown = (e) => {
//             mouseRef.current.isDown = true;
//             mouseRef.current.x = e.clientX;
//             mouseRef.current.y = e.clientY;
//         };
//
//         const handleMouseUp = () => {
//             mouseRef.current.isDown = false;
//         };
//
//         const handleMouseMove = (e) => {
//             if (!mouseRef.current.isDown) return;
//
//             const deltaX = e.clientX - mouseRef.current.x;
//             const deltaY = e.clientY - mouseRef.current.y;
//
//             mouseRef.current.x = e.clientX;
//             mouseRef.current.y = e.clientY;
//
//             rotationRef.current.y -= deltaX * 0.01;
//             rotationRef.current.x = Math.max(
//                 -Math.PI / 2,
//                 Math.min(Math.PI / 2, rotationRef.current.x - deltaY * 0.01)
//             );
//
//             camera.rotation.order = "YXZ";
//             camera.rotation.x = rotationRef.current.x;
//             camera.rotation.y = rotationRef.current.y;
//
//             const direction = new THREE.Vector3();
//             camera.getWorldDirection(direction);
//             setCameraDirection({
//                 x: direction.x.toFixed(2),
//                 y: direction.y.toFixed(2),
//                 z: direction.z.toFixed(2),
//             });
//         };
//
//         // Handle resize
//         const handleResize = () => {
//             const newWidth = mountRef.current.clientWidth;
//             camera.aspect = newWidth / containerHeight;
//             camera.updateProjectionMatrix();
//             renderer.setSize(newWidth, containerHeight);
//         };
//         window.addEventListener("resize", handleResize);
//
//         // Add mouse event listeners
//         mountRef.current.addEventListener("mousedown", handleMouseDown);
//         window.addEventListener("mouseup", handleMouseUp);
//         window.addEventListener("mousemove", handleMouseMove);
//
//         // Animation loop
//         const animate = () => {
//             requestAnimationFrame(animate);
//             renderer.render(scene, camera);
//         };
//         animate();
//
//         // Cleanup
//         return () => {
//             window.removeEventListener("resize", handleResize);
//             mountRef.current?.removeEventListener("mousedown", handleMouseDown);
//             window.removeEventListener("mouseup", handleMouseUp);
//             window.removeEventListener("mousemove", handleMouseMove);
//
//             scene.traverse((object) => {
//                 if (object.geometry) object.geometry.dispose();
//                 if (object.material) {
//                     if (Array.isArray(object.material)) {
//                         object.material.forEach((material) => material.dispose());
//                     } else {
//                         object.material.dispose();
//                     }
//                 }
//             });
//
//             if (mountRef.current) {
//                 mountRef.current.removeChild(renderer.domElement);
//             }
//
//             renderer.dispose();
//         };
//     }, []);
//
//     return (
//         <div className="w-full flex flex-col items-center">
//             <div
//                 ref={mountRef}
//                 className="w-full max-w-4xl rounded-lg overflow-hidden border-2 border-red-800"
//                 style={{ height: "600px" }}
//             />
//             <div className="mt-4 text-white">
//                 <p>
//                     Kierunek: X: {cameraDirection.x}, Y: {cameraDirection.y}, Z:{" "}
//                     {cameraDirection.z}
//                 </p>
//             </div>
//         </div>
//     );
// };
//
// export default ThreeScene;