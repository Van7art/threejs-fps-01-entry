// Rendering for Sunscorch Yard: the three.js scene, the desert sun and
// sky, and the short-lived effects (tracers, muzzle flash, explosions, the
// charge marker). The simulation never touches the renderer directly; it
// asks this module for effects through the fx object main.js builds.

import * as THREE from 'three';
import { COLORS } from './palette.js';

export function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.sky);
  scene.fog = new THREE.Fog(COLORS.sky, 55, 140);

  const camera = new THREE.PerspectiveCamera(78, window.innerWidth / window.innerHeight, 0.08, 300);
  camera.rotation.order = 'YXZ';

  // Hard desert sun from the south-east, plus a sky bounce so shadows
  // never go black.
  const sun = new THREE.DirectionalLight(COLORS.sun, 2.6);
  sun.position.set(30, 42, 18);
  scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xcfe4f2, 0xb98d5e, 1.1);
  scene.add(hemi);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { renderer, scene, camera };
}

// Short-lived effects, all pooled: no new objects in the hot loop.
export function createEffects(scene) {
  const tracerMat = new THREE.LineBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0.9 });
  const tracerEnemyMat = new THREE.LineBasicMaterial({ color: 0xff9a7a, transparent: true, opacity: 0.9 });
  const tracers = [];
  const tracerGeo = new THREE.BufferGeometry();
  tracerGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));

  const flashMat = new THREE.MeshBasicMaterial({ color: 0xfff6c8, transparent: true, opacity: 0 });
  const flash = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), flashMat);
  flash.position.set(0, 0, -0.7);
  flash.visible = false;

  // The charge: a small blinking case on the ground, or on the carrier.
  const charge = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.2, 0.24),
    new THREE.MeshStandardMaterial({ color: 0xffd23e, emissive: 0xaa7700, emissiveIntensity: 0.8, roughness: 0.4 }),
  );
  charge.visible = false;
  scene.add(charge);

  return {
    flashMesh: flash,
    chargeMesh: charge,
    tracer(x1, y1, z1, x2, y2, z2, team) {
      const geo = tracerGeo.clone();
      const pos = geo.attributes.position;
      pos.setXYZ(0, x1, y1, z1);
      pos.setXYZ(1, x2, y2, z2);
      const line = new THREE.Line(geo, team === 'attackers' ? tracerMat : tracerEnemyMat);
      line.userData.born = performance.now();
      scene.add(line);
      tracers.push(line);
      if (tracers.length > 24) {
        const old = tracers.shift();
        scene.remove(old);
        old.geometry.dispose();
      }
    },
    muzzle() {
      flashMat.opacity = 0.85;
      flash.visible = true;
      setTimeout(() => {
        flashMat.opacity = 0;
        flash.visible = false;
      }, 45);
    },
    explosion(x, z) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xff7a2a, transparent: true, opacity: 0.85 });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), mat);
      sphere.position.set(x, 0.6, z);
      sphere.scale.setScalar(0.5);
      scene.add(sphere);
      const start = performance.now();
      const grow = () => {
        const t = (performance.now() - start) / 500;
        if (t >= 1) {
          scene.remove(sphere);
          mat.dispose();
          sphere.geometry.dispose();
          return;
        }
        sphere.scale.setScalar(0.5 + t * 6);
        mat.opacity = 0.85 * (1 - t);
        requestAnimationFrame(grow);
      };
      grow();
    },
    update(now) {
      for (let i = tracers.length - 1; i >= 0; i--) {
        if (now - tracers[i].userData.born > 90) {
          const line = tracers.splice(i, 1)[0];
          scene.remove(line);
          line.geometry.dispose();
        }
      }
      if (charge.visible) {
        const m = charge.material;
        m.emissiveIntensity = 0.6 + Math.sin(now / 180) * 0.5;
      }
    },
  };
}
