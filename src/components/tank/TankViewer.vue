<template>
  <div ref="container" class="tank-viewer" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const props = defineProps<{
  level: number;
}>();

const container = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let controls: OrbitControls | null = null;
let animationFrameId: number | null = null;

let tank: THREE.Object3D | null = null;
let liquid: THREE.Mesh | null = null;

const TANK_LEVEL_MIN_Y = 0.5;
const TANK_LEVEL_MAX_Y = 1.27;

function createLiquid(): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 64);

  const material = new THREE.MeshStandardMaterial({
    color: 0x2196f3,
    transparent: true,
    opacity: 0.5,
    roughness: 0.2,
    metalness: 0,
    depthWrite: false,
    depthTest: false,
  });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.renderOrder = 10;

  return mesh;
}

function updateLiquidLevel(level: number) {
  if (!liquid) {
    return;
  }

  const normalizedLevel = THREE.MathUtils.clamp(level, 0, 100) / 100;

  const tankHeight = TANK_LEVEL_MAX_Y - TANK_LEVEL_MIN_Y;

  const liquidHeight = Math.max(tankHeight * normalizedLevel, 0.001);

  liquid.scale.y = liquidHeight;

  liquid.position.y = TANK_LEVEL_MIN_Y + liquidHeight / 2;
}

function addLiquidToTank(model: THREE.Object3D) {
  liquid = createLiquid();

  model.add(liquid);

  updateLiquidLevel(props.level);
}

function setupScene() {
  if (!container.value) {
    return;
  }

  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x111827);

  camera = new THREE.PerspectiveCamera(
    45,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    100,
  );

  camera.position.set(0, 2, 6);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.setSize(container.value.clientWidth, container.value.clientHeight);

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  container.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.minDistance = 1;
  controls.maxDistance = 10;

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);

  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);

  directionalLight.position.set(2, 4, 5);

  scene.add(directionalLight);

  loadTank();
}

function loadTank() {
  if (!scene) {
    return;
  }

  const loader = new GLTFLoader();

  loader.load(
    '/models/tank.glb',
    (gltf) => {
      tank = gltf.scene;

      const box = new THREE.Box3().setFromObject(tank);

      const size = box.getSize(new THREE.Vector3());

      const center = box.getCenter(new THREE.Vector3());

      tank.position.sub(center);

      // Move the tank slightly downward.
      tank.position.y -= 0.5;

      const maxDimension = Math.max(size.x, size.y, size.z);

      if (maxDimension > 0) {
        const targetSize = 3;

        const scale = targetSize / maxDimension;

        tank.scale.setScalar(scale);
      }

      scene?.add(tank);

      addLiquidToTank(tank);
    },
    undefined,
    (error) => {
      console.error('Failed to load tank model:', error);
    },
  );
}

function handleResize() {
  if (!container.value || !camera || !renderer) {
    return;
  }

  const width = container.value.clientWidth;

  const height = container.value.clientHeight;

  camera.aspect = width / height;

  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

function animate() {
  animationFrameId = requestAnimationFrame(animate);

  controls?.update();

  if (scene && camera && renderer) {
    renderer.render(scene, camera);
  }
}

function cleanup() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  window.removeEventListener('resize', handleResize);

  controls?.dispose();

  renderer?.dispose();

  if (renderer?.domElement.parentElement) {
    renderer.domElement.parentElement.removeChild(renderer.domElement);
  }

  scene = null;
  camera = null;
  renderer = null;
  controls = null;
  tank = null;
  liquid = null;
}

watch(
  () => props.level,
  (newLevel) => {
    updateLiquidLevel(newLevel);
  },
);

onMounted(() => {
  setupScene();

  window.addEventListener('resize', handleResize);

  animate();
});

onBeforeUnmount(() => {
  cleanup();
});
</script>

<style scoped>
.tank-viewer {
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 12px;
}
</style>
