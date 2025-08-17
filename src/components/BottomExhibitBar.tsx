import React from 'react';
import {
  CameraPresetId,
  ComponentId,
  MaterialVariantId,
  MechanicalState,
} from '../types/spider';
import { MATERIAL_VARIANTS } from '../materials/materialSystem';

interface BottomExhibitBarProps {
  activeVariant: MaterialVariantId;
  onSelectVariant: (variant: MaterialVariantId) => void;
  mechState: MechanicalState;
  onChangeExplosion: (val: number) => void;
  onSelectDetailPreset: (
    preset: CameraPresetId,
    component: ComponentId,
    autoActuate?: Partial<MechanicalState>
  ) => void;
  onExportHighResPNG: () => void;
  onExportTransparentPNG: () => void;
  onExportGLB: () => void;
  onExportJSON: () => void;
}

export const BottomExhibitBar: React.FC<BottomExhibitBarProps> = ({
  activeVariant,
  onSelectVariant,
  mechState,
  onChangeExplosion,
  onSelectDetailPreset,
  onExportHighResPNG,
  onExportTransparentPNG,
  onExportGLB,
  onExportJSON,
}) => {
  const variants: MaterialVariantId[] = ['default', 'bloodglass', 'obsidian', 'ivory'];

  const detailCards: {
    title: string;
    subtitle: string;
    preset: CameraPresetId;
    componentId: ComponentId;
    autoState?: Partial<MechanicalState>;
  }[] = [
    {
      title: 'OPTICAL SYSTEM',
      subtitle: '9-Lens Ruby Ocular Cluster',
      preset: 'detail_optics',
      componentId: 'optical_array',
      autoState: { activateOptics: true, crimsonIllumination: true },
    },
    {
      title: 'CLOCKWORK CORE',
      subtitle: '14-Gear Epicyclic Transmission',
      preset: 'detail_clockwork',
      componentId: 'clockwork_core',
      autoState: { abdomenOpen: true, rotateGears: true },
    },
    {
      title: 'LEG JOINT',
      subtitle: 'Geared Patella & Brass Piston',
      preset: 'detail_leg_joint',
      componentId: 'leg_assembly',
      autoState: { activatePistons: true },
    },
    {
      title: 'HIDDEN WEAPON',
      subtitle: 'Twin Retractable Assassin Blades',
      preset: 'detail_hidden_weapon',
      componentId: 'retractable_blade',
      autoState: { deployBlades: true },
    },
    {
      title: 'CARAPACE DETAIL',
      subtitle: 'Cathedral Rose-Window Filigree',
      preset: 'detail_carapace',
      componentId: 'armored_abdomen',
    },
  ];

  const pct = Math.round(mechState.explosionIntensity * 100);

  return (
    <footer className="bottom-exhibit-deck">
      <div className="bottom-left-columns">
        {/* 4 SELECTABLE MATERIAL VARIATIONS */}
        <div className="variations-section">
          <div className="section-banner-title">VARIATIONS — MATERIAL PALETTES</div>
          <div className="variations-grid">
            {variants.map((vId) => {
              const cfg = MATERIAL_VARIANTS[vId];
              const isSelected = activeVariant === vId;
              return (
                <button
                  key={vId}
                  type="button"
                  className={`variation-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectVariant(vId)}
                >
                  <div className="variation-swatch-preview">
                    <span
                      className="swatch-dot"
                      style={{ background: cfg.primarySteel.color }}
                    />
                    <span
                      className="swatch-dot"
                      style={{ background: cfg.antiqueGold.color }}
                    />
                    <span
                      className="swatch-dot"
                      style={{ background: cfg.crimsonCrystal.color }}
                    />
                  </div>
                  <div className="variation-title">{cfg.name}</div>
                  <div className="variation-sub">{cfg.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5 CLOSE-UP MECHANICAL DETAIL CAMERA PRESETS */}
        <div className="details-section">
          <div className="section-banner-title">DETAILS — SUBSYSTEM INSPECTION</div>
          <div className="details-grid">
            {detailCards.map((d) => (
              <button
                key={d.title}
                type="button"
                className="detail-preview-card"
                onClick={() =>
                  onSelectDetailPreset(d.preset, d.componentId, d.autoState)
                }
              >
                <div className="detail-card-badge">{d.subtitle}</div>
                <div className="detail-card-label">{d.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EXPLODED ENGINEERING VIEW & EXPORT CONTROLS */}
      <div className="exploded-and-export-panel">
        <div className="exploded-control-box">
          <div className="exploded-header-row">
            <span className="section-banner-title">EXPLODED VIEW — DISASSEMBLY</span>
            <span className="explosion-readout">{pct}%</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={pct}
            aria-label="Explosion Intensity"
            className="explosion-slider"
            onChange={(e) => onChangeExplosion(Number(e.target.value) / 100)}
          />

          <div className="explosion-preset-row">
            <button type="button" onClick={() => onChangeExplosion(0)}>
              0% Assembled
            </button>
            <button type="button" onClick={() => onChangeExplosion(0.45)}>
              45% Maintenance
            </button>
            <button type="button" onClick={() => onChangeExplosion(1)}>
              100% Full Exploded
            </button>
          </div>
        </div>

        <div className="export-control-box">
          <div className="section-banner-title">ARCHIVE EXPORT</div>
          <div className="export-btn-grid">
            <button type="button" className="export-btn" onClick={onExportHighResPNG}>
              High-Res PNG
            </button>
            <button type="button" className="export-btn" onClick={onExportTransparentPNG}>
              Transparent PNG
            </button>
            <button type="button" className="export-btn primary" onClick={onExportGLB}>
              Export 3D .GLB
            </button>
            <button type="button" className="export-btn" onClick={onExportJSON}>
              Material .JSON
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
