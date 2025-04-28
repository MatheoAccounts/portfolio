import * as THREE from 'three';  // Importing the entire Three.js library
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';  // Importing GLTFLoader from the addons path
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';  // Importing OrbitControls

let scene, camera, renderer, controls;

init();
animate();

function init() {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);

  // Create camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 10, 3);

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('scene-container').appendChild(renderer.domElement);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

  // Initialize OrbitControls (for camera control)
  controls = new OrbitControls(camera, renderer.domElement);

  // Load the 3D model using GLTFLoader
  const loader = new GLTFLoader();
  loader.load('assets/models/my_model.glb', function (gltf) {
    console.log("Model loaded:", gltf);
    scene.add(gltf.scene);
  }, undefined, function (error) {
    console.error("Error loading model:", error);
  });
}

function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  renderer.render(scene, camera);
}
