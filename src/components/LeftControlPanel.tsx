import React from 'react';
import {
  AnimationMode,
  CameraPresetId,
  MechanicalState,
} from '../types/spider';

interface LeftControlPanelProps {
  animationMode: AnimationMode;
  onChangeAnimationMode: (mode: AnimationMode) => void;
  mechState: MechanicalState;
  onToggleMechanical: (key: keyof MechanicalState) => void;
  onSelectCameraPreset: (preset: CameraPresetId) => void;
}

export const LeftControlPanel: React.FC<LeftControlPanelProps> = ({
  animationMode,
  onChangeAnimationMode,
  mechState,
  onToggleMechanical,
  onSelectCameraPreset,
}) => {
  const cameraButtons: { id: CameraPresetId; label: string }[] = [
    { id: 'reset', label: 'Reset View' },
    { id: 'isometric', label: 'Isometric' },
    { id: 'front', label: 'Front' },
    { id: 'side', label: 'Side' },
    { id: 'rear', label: 'Rear' },
    { id: 'top', label: 'Top' },
  ];

  const animationModes: { id: AnimationMode; label: string; desc: string }[] = [
    { id: 'idle', label: 'IDLE MODE', desc: 'Harmonic breathing & ocular scan' },
    { id: 'walk', label: 'WALK MODE', desc: '8-leg alternating tetrapod gait' },
    { id: 'threat', label: 'THREAT MODE', desc: 'Rear front legs & deploy weaponry' },
    { id: 'clockwork', label: 'CLOCKWORK MODE', desc: 'Expose & drive internal gear core' },
    { id: 'inspection', label: 'INSPECTION MODE', desc: 'Freeze stance for part analysis' },
  ];

  const mechToggles: { key: keyof MechanicalState; label: string }[] = [
    { key: 'abdomenOpen', label: 'Open Abdomen Armor' },
    { key: 'rotateGears', label: 'Rotate Internal Gears' },
    { key: 'activateOptics', label: 'Activate Optical Lenses' },
    { key: 'extendMandibles', label: 'Extend Mandibles' },
    { key: 'deployBlades', label: 'Deploy Concealed Blades' },
    { key: 'crimsonIllumination', label: 'Crimson Illumination' },
    { key: 'activatePistons', label: 'Activate Leg Pistons' },
    { key: 'venomPurge', label: 'Venom Injector Pulse' },
  ];

  return (
    <aside className="left-manuscript-panel">
      <div className="workshop-stamp">✦ IMPERIAL MECHANICS WORKSHOP ✦</div>
      <h1 className="project-main-title">NOCTIS ARACHNID</h1>
      <h2 className="project-subtitle">VICTORIAN GOTHIC AUTOMATON</h2>

      <p className="manuscript-lore">
        A high-precision reconnaissance and assassination automaton developed in
        the late Victorian era. Its design combines cathedral architecture with
        clockwork engineering. Equipped with silent locomotion, multi-lens
        optical system, and concealed weaponry.
      </p>

      {/* CONCEPTUAL SPECIFICATIONS TABLE MATCHING REFERENCE */}
      <dl className="specs-ledger">
        <div className="spec-row">
          <dt>CLASS</dt>
          <dd>: ARACHNID AUTOMATON</dd>
        </div>
        <div className="spec-row">
          <dt>TYPE</dt>
          <dd>: RECON / ASSASSINATION</dd>
        </div>
        <div className="spec-row">
          <dt>HEIGHT</dt>
          <dd>: 1.4 m (1,400 mm)</dd>
        </div>
        <div className="spec-row">
          <dt>WIDTH</dt>
          <dd>: 2.6 m (2,600 mm)</dd>
        </div>
        <div className="spec-row">
          <dt>WEIGHT</dt>
          <dd>: 480 kg</dd>
        </div>
        <div className="spec-row">
          <dt>POWER</dt>
          <dd>: CLOCKWORK CORE</dd>
        </div>
        <div className="spec-row">
          <dt>MATERIAL</dt>
          <dd>: BRASS / IRON / OBSIDIAN GLASS</dd>
        </div>
      </dl>

      {/* CAMERA VIEW CONTROLS */}
      <div className="control-block">
        <div className="section-banner-title">CAMERA ELEVATIONS</div>
        <div className="camera-btn-grid">
          {cameraButtons.map((btn) => (
            <button
              key={btn.id}
              type="button"
              className="manuscript-btn"
              onClick={() => onSelectCameraPreset(btn.id)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* SPIDER LOCOMOTION & ANIMATION MODES */}
      <div className="control-block">
        <div className="section-banner-title">AUTOMATON GAIT &amp; STATE</div>
        <div className="mode-btn-stack">
          {animationModes.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`mode-select-btn ${animationMode === m.id ? 'active' : ''}`}
              onClick={() => onChangeAnimationMode(m.id)}
            >
              <span className="mode-name">{m.label}</span>
              <span className="mode-desc">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MECHANICAL ACTUATOR OVERRIDES */}
      <div className="control-block">
        <div className="section-banner-title">MECHANICAL ACTUATORS</div>
        <div className="actuator-toggle-grid">
          {mechToggles.map((item) => {
            const active = Boolean(mechState[item.key]);
            return (
              <button
                key={item.key}
                type="button"
                className={`actuator-toggle-btn ${active ? 'active' : ''}`}
                onClick={() => onToggleMechanical(item.key)}
              >
                <span className="toggle-indicator">{active ? '◈' : '◇'}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
