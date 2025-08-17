import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import {
  AnimationMode,
  CameraPresetId,
  ComponentId,
  MaterialVariantId,
  MechanicalState,
} from './types/spider';
import { NoctisArachnidRig } from './geometry/buildNoctisArachnid';
import { SpiderViewport } from './components/SpiderViewport';
import { LeftControlPanel } from './components/LeftControlPanel';
import { TechnicalDrawingsPanel } from './components/TechnicalDrawingsPanel';
import { BottomExhibitBar } from './components/BottomExhibitBar';
import { ComponentInspectorModal } from './components/ComponentInspectorModal';
import {
  exportHighResPNG,
  exportMaterialConfigJSON,
  exportSpiderGLB,
  exportTransparentPNG,
} from './exporters/exportUtils';
import './styles/exhibit.css';

export default function App() {
  const [variant, setVariant] = useState<MaterialVariantId>('default');
  const [animationMode, setAnimationMode] = useState<AnimationMode>('idle');
  const [selectedComponent, setSelectedComponent] = useState<ComponentId | null>(null);
  const [cameraPresetTrigger, setCameraPresetTrigger] = useState<{
    preset: CameraPresetId;
    seq: number;
  }>({ preset: 'reset', seq: 0 });

  const [mechState, setMechState] = useState<MechanicalState>({
    abdomenOpen: false,
    rotateGears: true,
    activateOptics: true,
    extendMandibles: false,
    deployBlades: false,
    crimsonIllumination: true,
    activatePistons: true,
    venomPurge: false,
    explosionIntensity: 0,
    gearSpeedMultiplier: 1.0,
    isolatedComponent: null,
  });

  const sceneRefs = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    spiderRig: NoctisArachnidRig;
    groundShadow: THREE.Object3D;
  } | null>(null);
  const [, setRefsReady] = useState(false);

  const triggerCameraPreset = (preset: CameraPresetId) => {
    setCameraPresetTrigger((prev) => ({ preset, seq: prev.seq + 1 }));
  };

  const handleToggleMechanical = (key: keyof MechanicalState) => {
    setMechState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectDetailPreset = (
    preset: CameraPresetId,
    component: ComponentId,
    autoActuate?: Partial<MechanicalState>
  ) => {
    setSelectedComponent(component);
    triggerCameraPreset(preset);
    if (autoActuate) {
      setMechState((prev) => ({ ...prev, ...autoActuate }));
    }
  };

  const handleToggleIsolate = (id: ComponentId) => {
    setMechState((prev) => ({
      ...prev,
      isolatedComponent: prev.isolatedComponent === id ? null : id,
    }));
  };

  return (
    <div className="imperial-exhibit-shell">
      <div className="exhibit-top-grid">
        <LeftControlPanel
          animationMode={animationMode}
          onChangeAnimationMode={setAnimationMode}
          mechState={mechState}
          onToggleMechanical={handleToggleMechanical}
          onSelectCameraPreset={triggerCameraPreset}
        />

        <main className="center-stage-column">
          <SpiderViewport
            variant={variant}
            animationMode={animationMode}
            mechState={mechState}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            cameraPresetTrigger={cameraPresetTrigger}
            onExposeSceneRefs={(refs) => {
              sceneRefs.current = refs;
              setRefsReady(true);
            }}
          />

          <ComponentInspectorModal
            selectedComponent={selectedComponent}
            isolatedComponent={mechState.isolatedComponent}
            onToggleIsolate={handleToggleIsolate}
            onClose={() => {
              setSelectedComponent(null);
              setMechState((prev) => ({ ...prev, isolatedComponent: null }));
            }}
          />
        </main>

        <TechnicalDrawingsPanel
          spiderRig={sceneRefs.current?.spiderRig || null}
          scene={sceneRefs.current?.scene || null}
          onSelectCameraPreset={triggerCameraPreset}
        />
      </div>

      <BottomExhibitBar
        activeVariant={variant}
        onSelectVariant={setVariant}
        mechState={mechState}
        onChangeExplosion={(val) =>
          setMechState((prev) => ({ ...prev, explosionIntensity: val }))
        }
        onSelectDetailPreset={handleSelectDetailPreset}
        onExportHighResPNG={() => {
          if (sceneRefs.current) {
            exportHighResPNG(
              sceneRefs.current.renderer,
              sceneRefs.current.scene,
              sceneRefs.current.camera,
              variant
            );
          }
        }}
        onExportTransparentPNG={() => {
          if (sceneRefs.current) {
            exportTransparentPNG(
              sceneRefs.current.renderer,
              sceneRefs.current.scene,
              sceneRefs.current.camera,
              sceneRefs.current.groundShadow,
              variant
            );
          }
        }}
        onExportGLB={() => {
          if (sceneRefs.current) {
            exportSpiderGLB(sceneRefs.current.spiderRig.root, variant);
          }
        }}
        onExportJSON={() => {
          exportMaterialConfigJSON(variant, animationMode, mechState);
        }}
      />
    </div>
  );
}
