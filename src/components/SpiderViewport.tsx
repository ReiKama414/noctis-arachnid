import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import {
  AnimationMode,
  CameraPresetId,
  ComponentId,
  MaterialVariantId,
  MechanicalState,
} from '../types/spider';
import {
  applyMaterialVariant,
  createSpiderMaterialSet,
  SpiderMaterialSet,
} from '../materials/materialSystem';
import {
  buildNoctisArachnid,
  COMPONENT_METADATA,
  NoctisArachnidRig,
} from '../geometry/buildNoctisArachnid';
import { updateSpiderAnimation } from '../animations/spiderAnimator';

interface SpiderViewportProps {
  variant: MaterialVariantId;
  animationMode: AnimationMode;
  mechState: MechanicalState;
  selectedComponent: ComponentId | null;
  onSelectComponent: (id: ComponentId | null) => void;
  cameraPresetTrigger: { preset: CameraPresetId; seq: number };
  onExposeSceneRefs: (refs: {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    spiderRig: NoctisArachnidRig;
    groundShadow: THREE.Object3D;
  }) => void;
}

const CAMERA_PRESETS: Record<
  CameraPresetId,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  reset: { pos: [0.35, 1.38, 2.75], target: [0, 0.72, 0.05] },
  isometric: { pos: [2.15, 1.78, 2.15], target: [0, 0.72, 0] },
  front: { pos: [0, 0.85, 2.95], target: [0, 0.72, 0] },
  side: { pos: [2.95, 0.88, 0], target: [0, 0.72, -0.05] },
  rear: { pos: [0, 0.95, -2.95], target: [0, 0.75, -0.15] },
  top: { pos: [0, 3.45, 0.01], target: [0, 0.65, 0] },
  detail_optics: { pos: [0.18, 0.88, 1.55], target: [0, 0.68, 0.65] },
  detail_clockwork: { pos: [0.68, 1.48, -0.05], target: [0, 0.94, -0.45] },
  detail_leg_joint: { pos: [-1.45, 1.05, 1.25], target: [-0.72, 0.75, 0.35] },
  detail_hidden_weapon: { pos: [1.22, 0.48, 1.42], target: [0.68, 0.25, 0.65] },
  detail_carapace: { pos: [-0.85, 1.65, -1.15], target: [0, 1.05, -0.48] },
};

export const SpiderViewport: React.FC<SpiderViewportProps> = ({
  variant,
  animationMode,
  mechState,
  selectedComponent,
  onSelectComponent,
  cameraPresetTrigger,
  onExposeSceneRefs,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<ComponentId | null>(null);
  const [calloutCoords, setCalloutCoords] = useState<
    Record<ComponentId, { x: number; y: number; visible: boolean }>
  >({} as any);

  const rigRef = useRef<NoctisArachnidRig | null>(null);
  const materialsRef = useRef<SpiderMaterialSet | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const stateRef = useRef({ animationMode, mechState, selectedComponent });

  useEffect(() => {
    stateRef.current = { animationMode, mechState, selectedComponent };
  }, [animationMode, mechState, selectedComponent]);

  useEffect(() => {
    if (materialsRef.current) {
      applyMaterialVariant(
        materialsRef.current,
        variant,
        mechState.crimsonIllumination
      );
    }
  }, [variant, mechState.crimsonIllumination]);

  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const p = CAMERA_PRESETS[cameraPresetTrigger.preset] || CAMERA_PRESETS.reset;
    gsap.to(cameraRef.current.position, {
      x: p.pos[0],
      y: p.pos[1],
      z: p.pos[2],
      duration: 1.05,
      ease: 'power3.inOut',
    });
    gsap.to(controlsRef.current.target, {
      x: p.target[0],
      y: p.target[1],
      z: p.target[2],
      duration: 1.05,
      ease: 'power3.inOut',
    });
  }, [cameraPresetTrigger]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      50
    );
    camera.position.set(...CAMERA_PRESETS.reset.pos);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 0.9;
    controls.maxDistance = 7.5;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(...CAMERA_PRESETS.reset.target);
    controlsRef.current = controls;

    // Studio & Victorian Exhibition Lighting
    const hemiLight = new THREE.HemisphereLight('#fff5e4', '#3b2d1f', 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#fff2da', 2.4);
    keyLight.position.set(2.8, 4.6, 3.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    const d = 2.4;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#ffd385', 1.35);
    rimLight.position.set(-3.2, 2.4, -2.6);
    scene.add(rimLight);

    const crimsonUnderLight = new THREE.DirectionalLight('#b80f1f', 0.55);
    crimsonUnderLight.position.set(0, -2.0, 1.5);
    scene.add(crimsonUnderLight);

    // Soft Ground Shadow Receiver + Technical Polar Grid on Parchment Floor
    const groundGroup = new THREE.Group();
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.ShadowMaterial({ opacity: 0.34 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    groundGroup.add(shadowPlane);

    const polarGrid = new THREE.PolarGridHelper(2.2, 16, 8, 64, 0x7a6548, 0x9c8667);
    polarGrid.position.y = 0.002;
    (polarGrid.material as THREE.Material).transparent = true;
    (polarGrid.material as THREE.Material).opacity = 0.24;
    groundGroup.add(polarGrid);
    scene.add(groundGroup);

    // Build Procedural NOCTIS ARACHNID Model
    const materials = createSpiderMaterialSet(variant);
    materialsRef.current = materials;
    const spiderRig = buildNoctisArachnid(materials);
    rigRef.current = spiderRig;
    scene.add(spiderRig.root);

    onExposeSceneRefs({
      renderer,
      scene,
      camera,
      spiderRig,
      groundShadow: groundGroup,
    });

    // Raycasting for Component Inspection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(spiderRig.root.children, true);
      const found = hits.find((h) => h.object.userData?.componentId);
      setHoveredComponent(found ? (found.object.userData.componentId as ComponentId) : null);
    };

    const handlePointerUp = (e: MouseEvent) => {
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(spiderRig.root.children, true);
      const found = hits.find((h) => h.object.userData?.componentId);
      if (found) {
        onSelectComponent(found.object.userData.componentId as ComponentId);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / Math.max(1, container.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();
    let frameId = 0;
    let frameCounter = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = Math.min(0.05, clock.getDelta());
      const elapsed = clock.getElapsedTime();

      controls.update();
      updateSpiderAnimation(
        spiderRig,
        elapsed,
        delta,
        stateRef.current.animationMode,
        stateRef.current.mechState,
        stateRef.current.selectedComponent
      );

      renderer.render(scene, camera);

      // Project 3D Callout Anchor Positions every 3 frames
      frameCounter++;
      if (frameCounter % 3 === 0 && container) {
        const nextCallouts: Record<ComponentId, { x: number; y: number; visible: boolean }> =
          {} as any;
        const w = container.clientWidth;
        const h = container.clientHeight;
        (Object.keys(COMPONENT_METADATA) as ComponentId[]).forEach((cid) => {
          const meta = COMPONENT_METADATA[cid];
          const v = new THREE.Vector3(...meta.calloutPosition);
          v.project(camera);
          nextCallouts[cid] = {
            x: (v.x * 0.5 + 0.5) * w,
            y: (-v.y * 0.5 + 0.5) * h,
            visible: v.z < 1,
          };
        });
        setCalloutCoords(nextCallouts);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.dispose();
    };
  }, []);

  const primaryCallouts: {
    id: ComponentId;
    boxStyle: React.CSSProperties;
  }[] = [
    { id: 'observation_dome', boxStyle: { top: '4%', left: '4%' } },
    { id: 'clockwork_core', boxStyle: { top: '4%', right: '4%' } },
    { id: 'armored_abdomen', boxStyle: { top: '20%', right: '3%' } },
    { id: 'leg_assembly', boxStyle: { bottom: '12%', left: '4%' } },
    { id: 'retractable_blade', boxStyle: { bottom: '6%', left: '38%' } },
    { id: 'venom_injector', boxStyle: { bottom: '8%', right: '4%' } },
  ];

  return (
    <div className="spider-viewport-wrapper">
      <div ref={mountRef} className="spider-canvas-mount" />

      {/* SVG Leader Lines connecting Callout Labels to real 3D projected coordinates */}
      <svg className="callout-svg-overlay" aria-hidden="true">
        {primaryCallouts.map(({ id }) => {
          const pt = calloutCoords[id];
          if (!pt || !pt.visible) return null;
          const isActive = selectedComponent === id || hoveredComponent === id;
          return (
            <g key={id}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isActive ? 5.5 : 3.5}
                fill={isActive ? '#b50e1c' : '#3a2c1c'}
                stroke="#f3ead8"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </svg>

      {/* Poster Engineering Annotations matching Reference Image */}
      {primaryCallouts.map(({ id, boxStyle }) => {
        const meta = COMPONENT_METADATA[id];
        const isActive = selectedComponent === id || hoveredComponent === id;
        return (
          <button
            key={id}
            type="button"
            style={boxStyle}
            className={`engineering-callout-pin ${isActive ? 'active' : ''}`}
            onClick={() => onSelectComponent(id)}
          >
            <span className="callout-title">{meta.name}</span>
            <span className="callout-sub">{meta.subtitle}</span>
          </button>
        );
      })}

      {/* Live Hover Indicator Badge */}
      {hoveredComponent && (
        <div className="hover-telemetry-badge">
          <span className="telemetry-dot" />
          <span>
            {COMPONENT_METADATA[hoveredComponent].code} —{' '}
            <strong>{COMPONENT_METADATA[hoveredComponent].name}</strong> (Click to Inspect)
          </span>
        </div>
      )}
    </div>
  );
};
