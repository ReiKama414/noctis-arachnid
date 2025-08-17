import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { AnimationMode, MaterialVariantId, MechanicalState } from '../types/spider';
import { MATERIAL_VARIANTS } from '../materials/materialSystem';

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2500);
}

/**
 * Exports a high-resolution PNG screenshot with warm Victorian parchment background and title stamp.
 */
export function exportHighResPNG(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  variant: MaterialVariantId
): void {
  const originalSize = new THREE.Vector2();
  renderer.getSize(originalSize);
  const prevPixelRatio = renderer.getPixelRatio();

  renderer.setPixelRatio(2);
  renderer.setSize(1920, 1200, false);
  renderer.render(scene, camera);

  const composite = document.createElement('canvas');
  composite.width = 1920;
  composite.height = 1200;
  const ctx = composite.getContext('2d')!;

  // Warm parchment background gradient
  const grad = ctx.createRadialGradient(960, 600, 120, 960, 600, 1100);
  grad.addColorStop(0, '#efe6d4');
  grad.addColorStop(1, '#d4c5aa');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1920, 1200);

  // Fine engineering grid
  ctx.strokeStyle = 'rgba(92, 74, 48, 0.10)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1920; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1200);
    ctx.stroke();
  }
  for (let y = 0; y < 1200; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1920, y);
    ctx.stroke();
  }

  // Draw 3D render
  ctx.drawImage(renderer.domElement, 0, 0, 1920, 1200);

  // Double border & Victorian title stamp
  ctx.strokeStyle = '#5c4930';
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, 1864, 1144);
  ctx.lineWidth = 1;
  ctx.strokeRect(36, 36, 1848, 1128);

  ctx.fillStyle = '#241b12';
  ctx.font = 'bold 36px "Tenor Sans", sans-serif';
  ctx.fillText('NOCTIS ARACHNID — IMPERIAL MECHANICS WORKSHOP', 64, 88);
  ctx.font = '18px "Courier New", monospace';
  ctx.fillStyle = '#5c4930';
  ctx.fillText(
    `SPECIFICATION: ${MATERIAL_VARIANTS[variant].name} (${MATERIAL_VARIANTS[variant].subtitle}) // SCALE 1:10`,
    64,
    118
  );

  renderer.setPixelRatio(prevPixelRatio);
  renderer.setSize(originalSize.x, originalSize.y, false);
  renderer.render(scene, camera);

  composite.toBlob((blob) => {
    if (blob) triggerDownload(blob, `noctis-arachnid-${variant}-highres.png`);
  }, 'image/png');
}

/**
 * Exports a transparent-background PNG of the 3D spider mesh only.
 */
export function exportTransparentPNG(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  groundShadowObj: THREE.Object3D | null,
  variant: MaterialVariantId
): void {
  const prevBg = scene.background;
  const prevClearAlpha = renderer.getClearAlpha();
  const prevGroundVis = groundShadowObj ? groundShadowObj.visible : true;

  scene.background = null;
  if (groundShadowObj) groundShadowObj.visible = false;
  renderer.setClearColor(0x000000, 0);
  renderer.render(scene, camera);

  renderer.domElement.toBlob((blob) => {
    if (blob) triggerDownload(blob, `noctis-arachnid-${variant}-transparent.png`);
  }, 'image/png');

  scene.background = prevBg;
  if (groundShadowObj) groundShadowObj.visible = prevGroundVis;
  renderer.setClearAlpha(prevClearAlpha);
  renderer.render(scene, camera);
}

/**
 * Exports the actual Three.js procedural 3D spider hierarchy to a binary .glb file.
 */
export function exportSpiderGLB(spiderRoot: THREE.Object3D, variant: MaterialVariantId): void {
  const exporter = new GLTFExporter();
  exporter.parse(
    spiderRoot,
    (result) => {
      if (result instanceof ArrayBuffer) {
        const blob = new Blob([result], { type: 'model/gltf-binary' });
        triggerDownload(blob, `noctis-arachnid-${variant}.glb`);
      } else {
        const json = JSON.stringify(result, null, 2);
        const blob = new Blob([json], { type: 'model/gltf+json' });
        triggerDownload(blob, `noctis-arachnid-${variant}.gltf`);
      }
    },
    (error) => {
      console.error('GLB Export Error:', error);
    },
    { binary: true, onlyVisible: false }
  );
}

/**
 * Exports the current material configuration and mechanical telemetry as JSON.
 */
export function exportMaterialConfigJSON(
  variant: MaterialVariantId,
  mode: AnimationMode,
  mechState: MechanicalState
): void {
  const payload = {
    project: 'NOCTIS ARACHNID — The Forbidden Imperial Automaton',
    archiveStamp: 'IMPERIAL MECHANICS WORKSHOP // LATE VICTORIAN ARCHIVE',
    exportedAt: new Date().toISOString(),
    conceptualDimensions: {
      widthMm: 2600,
      heightMm: 1400,
      carapaceHeightMm: 1240,
      weightKg: 480,
      legsCount: 8,
    },
    activeVariant: MATERIAL_VARIANTS[variant],
    animationMode: mode,
    mechanicalState: mechState,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  triggerDownload(blob, `noctis-arachnid-config-${variant}.json`);
}
