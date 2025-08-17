import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CameraPresetId } from '../types/spider';
import { NoctisArachnidRig } from '../geometry/buildNoctisArachnid';

interface TechnicalDrawingsPanelProps {
  spiderRig: NoctisArachnidRig | null;
  scene: THREE.Scene | null;
  onSelectCameraPreset: (preset: CameraPresetId) => void;
}

type ElevationType = 'front' | 'side' | 'top' | 'rear';

const ELEVATION_SPECS: Record<
  ElevationType,
  {
    label: string;
    preset: CameraPresetId;
    pos: [number, number, number];
    up: [number, number, number];
    horizDim: string;
    vertDim: string;
  }
> = {
  front: {
    label: 'FRONT VIEW',
    preset: 'front',
    pos: [0, 0.72, 4.5],
    up: [0, 1, 0],
    horizDim: '2,600 mm',
    vertDim: '1,400 mm',
  },
  side: {
    label: 'SIDE VIEW',
    preset: 'side',
    pos: [4.5, 0.72, 0],
    up: [0, 1, 0],
    horizDim: '2,600 mm',
    vertDim: '1,240 mm',
  },
  top: {
    label: 'TOP VIEW',
    preset: 'top',
    pos: [0, 4.5, 0],
    up: [0, 0, -1],
    horizDim: '2,600 mm',
    vertDim: '1,400 mm',
  },
  rear: {
    label: 'REAR VIEW',
    preset: 'rear',
    pos: [0, 0.72, -4.5],
    up: [0, 1, 0],
    horizDim: '2,600 mm',
    vertDim: '1,400 mm',
  },
};

export const TechnicalDrawingsPanel: React.FC<TechnicalDrawingsPanelProps> = ({
  spiderRig,
  scene,
  onSelectCameraPreset,
}) => {
  const [thirdViewMode, setThirdViewMode] = useState<'top' | 'rear'>('top');
  const canvasRefs = {
    front: useRef<HTMLCanvasElement | null>(null),
    side: useRef<HTMLCanvasElement | null>(null),
    third: useRef<HTMLCanvasElement | null>(null),
  };

  useEffect(() => {
    if (!spiderRig || !scene) return;

    const orthoRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    orthoRenderer.setSize(280, 150);
    const frustumH = 1.65;
    const aspect = 280 / 150;
    const orthoCam = new THREE.OrthographicCamera(
      (-frustumH * aspect) / 2,
      (frustumH * aspect) / 2,
      frustumH / 2,
      -frustumH / 2,
      0.1,
      15
    );

    const renderElevationToCanvas = (
      type: ElevationType,
      targetCanvas: HTMLCanvasElement | null
    ) => {
      if (!targetCanvas) return;
      const spec = ELEVATION_SPECS[type];
      orthoCam.position.set(...spec.pos);
      orthoCam.up.set(...spec.up);
      orthoCam.lookAt(0, 0.72, 0);
      orthoCam.updateProjectionMatrix();

      orthoRenderer.render(scene, orthoCam);

      const ctx = targetCanvas.getContext('2d')!;
      const w = targetCanvas.width;
      const h = targetCanvas.height;
      ctx.clearRect(0, 0, w, h);

      // Parchment blueprint background + fine technical grid
      ctx.fillStyle = '#e7ddc8';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(92, 74, 48, 0.14)';
      ctx.lineWidth = 0.75;
      for (let x = 0; x < w; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw actual orthographic 3D projection with high-contrast sepia ink filter
      ctx.save();
      ctx.filter = 'contrast(1.35) sepia(0.35)';
      ctx.drawImage(orthoRenderer.domElement, 0, 0, w, h);
      ctx.restore();

      // Dimension lines (Horiz & Vert conceptual measurements)
      ctx.strokeStyle = '#3b2d1d';
      ctx.fillStyle = '#2b2013';
      ctx.lineWidth = 1;
      ctx.font = '600 9px "JetBrains Mono", monospace';

      // Bottom horizontal dimension line
      const yLine = h - 12;
      ctx.beginPath();
      ctx.moveTo(28, yLine);
      ctx.lineTo(w - 24, yLine);
      ctx.moveTo(28, yLine - 4);
      ctx.lineTo(28, yLine + 4);
      ctx.moveTo(w - 24, yLine - 4);
      ctx.lineTo(w - 24, yLine + 4);
      ctx.stroke();

      ctx.fillStyle = '#e7ddc8';
      ctx.fillRect(w / 2 - 28, yLine - 6, 56, 11);
      ctx.fillStyle = '#2b2013';
      ctx.textAlign = 'center';
      ctx.fillText(spec.horizDim, w / 2, yLine + 3);

      // Left vertical dimension line
      const xLine = 14;
      ctx.beginPath();
      ctx.moveTo(xLine, 22);
      ctx.lineTo(xLine, h - 22);
      ctx.moveTo(xLine - 4, 22);
      ctx.lineTo(xLine + 4, 22);
      ctx.moveTo(xLine - 4, h - 22);
      ctx.lineTo(xLine + 4, h - 22);
      ctx.stroke();

      ctx.save();
      ctx.translate(xLine - 2, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#e7ddc8';
      ctx.fillRect(-26, -6, 52, 10);
      ctx.fillStyle = '#2b2013';
      ctx.fillText(spec.vertDim, 0, 2);
      ctx.restore();
    };

    const updateAll = () => {
      renderElevationToCanvas('front', canvasRefs.front.current);
      renderElevationToCanvas('side', canvasRefs.side.current);
      renderElevationToCanvas(thirdViewMode, canvasRefs.third.current);
    };

    updateAll();
    const interval = window.setInterval(updateAll, 450);
    return () => {
      clearInterval(interval);
      orthoRenderer.dispose();
    };
  }, [spiderRig, scene, thirdViewMode]);

  return (
    <aside className="right-engineering-panel">
      {/* ORTHOGRAPHIC ELEVATION CARDS */}
      <div className="ortho-drawings-stack">
        <div
          className="ortho-card"
          role="button"
          tabIndex={0}
          onClick={() => onSelectCameraPreset('front')}
        >
          <div className="ortho-card-header">
            <span>FRONT VIEW</span>
            <span className="ortho-scale-tag">ORTHO // 1:20</span>
          </div>
          <canvas ref={canvasRefs.front} width={280} height={150} className="ortho-canvas" />
        </div>

        <div
          className="ortho-card"
          role="button"
          tabIndex={0}
          onClick={() => onSelectCameraPreset('side')}
        >
          <div className="ortho-card-header">
            <span>SIDE VIEW</span>
            <span className="ortho-scale-tag">ORTHO // 1:20</span>
          </div>
          <canvas ref={canvasRefs.side} width={280} height={150} className="ortho-canvas" />
        </div>

        <div className="ortho-card">
          <div className="ortho-card-header">
            <span>{thirdViewMode === 'top' ? 'TOP VIEW' : 'REAR VIEW'}</span>
            <div className="ortho-toggle-pills">
              <button
                type="button"
                className={thirdViewMode === 'top' ? 'active' : ''}
                onClick={() => {
                  setThirdViewMode('top');
                  onSelectCameraPreset('top');
                }}
              >
                TOP
              </button>
              <button
                type="button"
                className={thirdViewMode === 'rear' ? 'active' : ''}
                onClick={() => {
                  setThirdViewMode('rear');
                  onSelectCameraPreset('rear');
                }}
              >
                REAR
              </button>
            </div>
          </div>
          <canvas
            ref={canvasRefs.third}
            width={280}
            height={150}
            className="ortho-canvas"
            onClick={() => onSelectCameraPreset(thirdViewMode)}
          />
        </div>
      </div>

      {/* MATERIALS & TEXTURES SWATCHES */}
      <div className="materials-textures-box">
        <div className="section-banner-title">MATERIALS &amp; TEXTURES</div>
        <div className="swatch-row">
          <div className="material-swatch swatch-steel" title="Blackened Crucible Steel (70%)" />
          <div className="material-swatch swatch-filigree" title="Antique Gold Filigree (25%)" />
          <div className="material-swatch swatch-tracery" title="Cathedral Bronze Lattice" />
          <div className="material-swatch swatch-crimson" title="Blood-Ruby Optical Crystal (5%)" />
          <div className="material-swatch swatch-iron" title="Tempered Spring Iron" />
        </div>
      </div>

      {/* BLUEPRINT ARCHITECTURAL & GEAR SCHEMATICS */}
      <div className="blueprint-details-box">
        <div className="section-banner-title">BLUEPRINT DETAILS</div>
        <svg viewBox="0 0 260 150" className="blueprint-svg">
          {/* Gothic Cathedral Lancet Arch Schematic */}
          <g stroke="#342719" fill="none" strokeWidth="0.9">
            <path d="M22,140 L22,58 Q22,18 52,8 Q82,18 82,58 L82,140 Z" />
            <path d="M28,140 L28,62 Q28,28 52,18 Q76,28 76,62 L76,140" />
            <circle cx="52" cy="48" r="14" />
            <circle cx="52" cy="48" r="7" />
            <line x1="52" y1="2" x2="52" y2="142" strokeDasharray="2 2" />
            <line x1="38" y1="72" x2="38" y2="140" />
            <line x1="66" y1="72" x2="66" y2="140" />
            {/* Secondary Spire Elevation */}
            <path d="M102,138 L112,24 L122,138 Z" />
            <circle cx="112" cy="75" r="8" />
            {/* Epicyclic Clockwork Gear Train Schematics */}
            <circle cx="178" cy="46" r="26" />
            <circle cx="178" cy="46" r="21" strokeDasharray="3 2" />
            <circle cx="178" cy="46" r="6" />
            <line x1="146" y1="46" x2="210" y2="46" />
            <line x1="178" y1="14" x2="178" y2="78" />
            <circle cx="222" cy="56" r="18" />
            <circle cx="222" cy="56" r="14" strokeDasharray="2 2" />
            <circle cx="192" cy="108" r="24" />
            <circle cx="192" cy="108" r="18" strokeDasharray="3 2" />
            <line x1="162" y1="108" x2="222" y2="108" />
            <line x1="192" y1="78" x2="192" y2="138" />
          </g>
        </svg>
      </div>
    </aside>
  );
};
