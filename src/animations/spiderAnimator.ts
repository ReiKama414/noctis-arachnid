import * as THREE from 'three';
import { AnimationMode, ComponentId, MechanicalState } from '../types/spider';
import { NoctisArachnidRig } from '../geometry/buildNoctisArachnid';

/**
 * Updates the entire NOCTIS ARACHNID 3D mechanical hierarchy each frame:
 * - Walk Mode (8-legged coordinated alternating tetrapod gait)
 * - Idle Mode (subtle mechanical breathing, pendulum sway, optical scanning)
 * - Threat Mode (front legs reared high, torso pitched, blades & mandibles deployed)
 * - Inspection Mode (calibrated static engineering stance)
 * - Clockwork Mode (open carapace shells, high-speed internal gear transmission)
 * - Mechanical feature toggles & Exploded View smooth interpolation
 */
export function updateSpiderAnimation(
  rig: NoctisArachnidRig,
  time: number,
  delta: number,
  mode: AnimationMode,
  mechState: MechanicalState,
  selectedComponent: ComponentId | null
): void {
  const explodeT = THREE.MathUtils.clamp(mechState.explosionIntensity, 0, 1);

  // 1. Apply Exploded View Offsets smoothly
  for (const part of rig.explodableParts) {
    const targetPos = part.basePos
      .clone()
      .addScaledVector(part.explodeOffset, explodeT);
    part.object.position.lerp(targetPos, Math.min(1, delta * 10));
  }

  // 2. Body Posture by Mode
  let targetBodyY = 0.72;
  let targetBodyPitch = 0;
  let targetBodyRoll = 0;

  if (mode === 'walk') {
    const walkFreq = 4.2;
    targetBodyY = 0.72 + Math.sin(time * walkFreq * 2) * 0.028;
    targetBodyPitch = Math.sin(time * walkFreq) * 0.035;
    targetBodyRoll = Math.cos(time * walkFreq) * 0.03;
  } else if (mode === 'idle') {
    targetBodyY = 0.72 + Math.sin(time * 1.6) * 0.016;
    targetBodyPitch = Math.sin(time * 0.9) * 0.015;
  } else if (mode === 'threat') {
    targetBodyY = 0.80 + Math.sin(time * 3.2) * 0.02;
    targetBodyPitch = -0.24; // Rear cephalothorax upward
  } else if (mode === 'clockwork') {
    targetBodyY = 0.74 + Math.sin(time * 2.4) * 0.012;
  }

  rig.bodyGroup.position.y = THREE.MathUtils.lerp(
    rig.bodyGroup.position.y,
    targetBodyY + explodeT * 0.12,
    Math.min(1, delta * 8)
  );
  rig.bodyGroup.rotation.x = THREE.MathUtils.lerp(
    rig.bodyGroup.rotation.x,
    targetBodyPitch,
    Math.min(1, delta * 8)
  );
  rig.bodyGroup.rotation.z = THREE.MathUtils.lerp(
    rig.bodyGroup.rotation.z,
    targetBodyRoll,
    Math.min(1, delta * 8)
  );

  // 3. Abdomen Armored Carapace Petals (Open / Close + Clockwork Mode + Exploded View)
  const shouldOpenAbdomen =
    mechState.abdomenOpen || mode === 'clockwork' || explodeT > 0.15;
  const openAmount = shouldOpenAbdomen
    ? Math.max(0.65, explodeT * 0.85)
    : explodeT * 0.5;

  for (const petal of rig.carapacePetals) {
    const targetZRot = -petal.side * openAmount * 0.72;
    const targetXRot = (petal.row - 1) * openAmount * 0.18;
    petal.hingeGroup.rotation.z = THREE.MathUtils.lerp(
      petal.hingeGroup.rotation.z,
      targetZRot,
      Math.min(1, delta * 7)
    );
    petal.hingeGroup.rotation.x = THREE.MathUtils.lerp(
      petal.hingeGroup.rotation.x,
      targetXRot,
      Math.min(1, delta * 7)
    );
  }

  // 4. Internal Clockwork Gears Rotation
  const gearsActive =
    mechState.rotateGears ||
    mode === 'walk' ||
    mode === 'clockwork' ||
    mode === 'threat';
  const speedMult =
    (mode === 'clockwork' ? 2.4 : mode === 'walk' ? 1.6 : 1.0) *
    mechState.gearSpeedMultiplier;

  if (gearsActive && mode !== 'inspection') {
    for (const g of rig.gears) {
      g.mesh.rotation[g.axis] += delta * g.speed * speedMult;
    }
  }

  // 5. Optical Lens Array Rotation & Scanning
  const opticsActive =
    mechState.activateOptics ||
    mode === 'idle' ||
    mode === 'threat' ||
    mode === 'walk';
  if (opticsActive && mode !== 'inspection') {
    const scanRate = mode === 'threat' ? 3.8 : 1.5;
    rig.centralLensGroup.rotation.z += delta * (mode === 'threat' ? 1.8 : 0.65);
    rig.observationSpireGroup.rotation.y = Math.sin(time * 0.8) * 0.35;
    rig.secondaryLenses.forEach((lens, idx) => {
      lens.rotation.z = Math.sin(time * scanRate + idx) * 0.4;
    });
  }

  // 6. Mechanical Mandibles Extension
  const mandiblesActive = mechState.extendMandibles || mode === 'threat';
  const mandibleSpread = mandiblesActive
    ? 0.42 + Math.sin(time * 5.0) * 0.08
    : mode === 'idle'
    ? 0.06 + Math.sin(time * 1.8) * 0.03
    : 0.04;

  rig.leftMandible.rotation.y = THREE.MathUtils.lerp(
    rig.leftMandible.rotation.y,
    -mandibleSpread,
    Math.min(1, delta * 9)
  );
  rig.rightMandible.rotation.y = THREE.MathUtils.lerp(
    rig.rightMandible.rotation.y,
    mandibleSpread,
    Math.min(1, delta * 9)
  );

  // Ventral Pendulum Harmonic Sway
  rig.pendulumGroup.rotation.z = Math.sin(time * 2.4) * 0.14;
  rig.pendulumGroup.rotation.x = Math.cos(time * 1.9) * 0.09;

  // 7. Crimson Point Lights Intensity
  for (const pl of rig.pointLights) {
    const baseIntensity = mechState.crimsonIllumination
      ? mode === 'threat'
        ? 2.6 + Math.sin(time * 8) * 0.5
        : 1.6
      : 0.0;
    pl.intensity = THREE.MathUtils.lerp(pl.intensity, baseIntensity, Math.min(1, delta * 10));
  }

  // 8. Eight Articulated Mechanical Legs (Tetrapod Gait, Threat Rearing, Blades & Pistons)
  const bladesDeployed = mechState.deployBlades || mode === 'threat';
  const pistonsActive = mechState.activatePistons || mode === 'walk' || mode === 'clockwork';

  for (const leg of rig.legs) {
    let yawOffset = 0;
    let femurOffset = 0;
    let tibiaOffset = 0;
    let tarsusOffset = 0;

    // Tetrapod group: Group A = (L1, R2, L3, R4), Group B = (R1, L2, R3, L4)
    const isGroupA = (leg.pairIndex + (leg.side > 0 ? 1 : 0)) % 2 === 0;
    const phase = (isGroupA ? 0 : Math.PI) + leg.pairIndex * 0.32;

    if (mode === 'walk') {
      const wTime = time * 4.2 + phase;
      const swing = Math.sin(wTime);
      const lift = Math.max(0, Math.cos(wTime));

      yawOffset = swing * 0.18 * leg.side;
      femurOffset = lift * 0.28;
      tibiaOffset = -lift * 0.22 + Math.sin(wTime) * 0.08;
      tarsusOffset = lift * 0.14;
    } else if (mode === 'idle') {
      const idlePhase = time * 1.5 + leg.index * 0.7;
      femurOffset = Math.sin(idlePhase) * 0.025;
      tibiaOffset = -Math.sin(idlePhase) * 0.022;
    } else if (mode === 'threat') {
      if (leg.pairIndex === 0) {
        // Front pair rears high into strike stance
        yawOffset = leg.side * 0.22;
        femurOffset = 0.58 + Math.sin(time * 5 + leg.side) * 0.08;
        tibiaOffset = 0.45;
        tarsusOffset = 0.28;
      } else if (leg.pairIndex === 1) {
        femurOffset = 0.18;
        tibiaOffset = -0.10;
      } else {
        // Rear legs brace low and wide
        femurOffset = -0.12;
        tibiaOffset = 0.08;
      }
    }

    leg.coxaGroup.rotation.y = THREE.MathUtils.lerp(
      leg.coxaGroup.rotation.y,
      leg.baseYaw + yawOffset,
      Math.min(1, delta * 10)
    );
    leg.femurGroup.rotation.z = THREE.MathUtils.lerp(
      leg.femurGroup.rotation.z,
      leg.baseFemurPitch + femurOffset,
      Math.min(1, delta * 10)
    );
    leg.tibiaGroup.rotation.z = THREE.MathUtils.lerp(
      leg.tibiaGroup.rotation.z,
      leg.baseTibiaPitch + tibiaOffset,
      Math.min(1, delta * 10)
    );
    leg.tarsusGroup.rotation.z = THREE.MathUtils.lerp(
      leg.tarsusGroup.rotation.z,
      leg.baseTarsusPitch + tarsusOffset,
      Math.min(1, delta * 10)
    );

    // Retractable Concealed Blade Slide
    const targetBladeX = bladesDeployed ? 0.62 : 0.28;
    const targetBladeScale = bladesDeployed ? 1.15 : 0.65;
    leg.bladeGroup.position.x = THREE.MathUtils.lerp(
      leg.bladeGroup.position.x,
      targetBladeX,
      Math.min(1, delta * 12)
    );
    leg.bladeGroup.scale.setScalar(
      THREE.MathUtils.lerp(leg.bladeGroup.scale.x, targetBladeScale, Math.min(1, delta * 12))
    );

    // Mechanical Hydraulic Piston Stroke
    const pistonStroke = pistonsActive
      ? Math.sin(time * 4.5 + leg.index * 0.8) * 0.055 + femurOffset * 0.12
      : femurOffset * 0.12;
    leg.pistonRod.position.x = 0.52 + pistonStroke;

    // Venom Injector Pulse
    const venomScale = mechState.venomPurge
      ? 1.25 + Math.sin(time * 9 + leg.index) * 0.25
      : 1.0;
    leg.venomGlowMesh.scale.set(venomScale, 1, venomScale);
  }

  // 9. Component Isolation Visibility (when user toggles Isolate Component in Inspector)
  const isolated = mechState.isolatedComponent;
  rig.root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh && obj.userData.componentId) {
      if (!isolated) {
        obj.visible = true;
      } else {
        obj.visible = obj.userData.componentId === isolated;
      }
    }
  });
}
