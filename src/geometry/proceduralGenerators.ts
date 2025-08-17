import * as THREE from 'three';

/**
 * Builds a skeletonized Victorian clockwork gear with involute teeth and hollowed gothic spokes.
 */
export function createSpokedGearGeometry(
  outerRadius: number = 0.25,
  innerRadius: number = 0.06,
  teethCount: number = 16,
  thickness: number = 0.03,
  spokesCount: number = 5
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const toothDepth = outerRadius * 0.14;
  const baseRadius = outerRadius - toothDepth;
  const step = (Math.PI * 2) / teethCount;

  for (let i = 0; i < teethCount; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.22;
    const a2 = a0 + step * 0.32;
    const a3 = a0 + step * 0.68;
    const a4 = a0 + step * 0.78;

    const p0x = Math.cos(a0) * baseRadius;
    const p0y = Math.sin(a0) * baseRadius;
    if (i === 0) shape.moveTo(p0x, p0y);
    else shape.lineTo(p0x, p0y);

    shape.lineTo(Math.cos(a1) * baseRadius, Math.sin(a1) * baseRadius);
    shape.lineTo(Math.cos(a2) * outerRadius, Math.sin(a2) * outerRadius);
    shape.lineTo(Math.cos(a3) * outerRadius, Math.sin(a3) * outerRadius);
    shape.lineTo(Math.cos(a4) * baseRadius, Math.sin(a4) * baseRadius);
  }
  shape.closePath();

  // Center axle hole
  const axleHole = new THREE.Path();
  axleHole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(axleHole);

  // Skeletonized sector cutouts between spokes
  const webInner = innerRadius * 1.45;
  const webOuter = baseRadius * 0.76;
  if (webOuter > webInner * 1.2 && spokesCount >= 3) {
    const spokeStep = (Math.PI * 2) / spokesCount;
    const padAngle = 0.14;
    for (let s = 0; s < spokesCount; s++) {
      const sa0 = s * spokeStep + padAngle;
      const sa1 = (s + 1) * spokeStep - padAngle;
      if (sa1 > sa0) {
        const hole = new THREE.Path();
        hole.moveTo(Math.cos(sa0) * webInner, Math.sin(sa0) * webInner);
        hole.absarc(0, 0, webInner, sa0, sa1, false);
        hole.lineTo(Math.cos(sa1) * webOuter, Math.sin(sa1) * webOuter);
        hole.absarc(0, 0, webOuter, sa1, sa0, true);
        hole.closePath();
        shape.holes.push(hole);
      }
    }
  }

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.16,
    bevelSize: thickness * 0.12,
    bevelSegments: 2,
    curveSegments: 16,
  });
  geom.center();
  return geom;
}

/**
 * Builds a multi-tiered Gothic Cathedral Spire profile using LatheGeometry.
 */
export function createGothicSpireLatheGeometry(
  baseRadius: number = 0.14,
  height: number = 0.75,
  radialSegments: number = 8
): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [
    new THREE.Vector2(baseRadius * 1.05, 0.0),
    new THREE.Vector2(baseRadius * 1.12, height * 0.04),
    new THREE.Vector2(baseRadius * 0.88, height * 0.08),
    new THREE.Vector2(baseRadius * 0.92, height * 0.18),
    new THREE.Vector2(baseRadius * 0.68, height * 0.22),
    new THREE.Vector2(baseRadius * 0.76, height * 0.25),
    new THREE.Vector2(baseRadius * 0.56, height * 0.28),
    new THREE.Vector2(baseRadius * 0.54, height * 0.45),
    new THREE.Vector2(baseRadius * 0.64, height * 0.48),
    new THREE.Vector2(baseRadius * 0.40, height * 0.52),
    new THREE.Vector2(baseRadius * 0.22, height * 0.75),
    new THREE.Vector2(baseRadius * 0.30, height * 0.77),
    new THREE.Vector2(baseRadius * 0.11, height * 0.81),
    new THREE.Vector2(0.003, height * 1.0),
  ];
  return new THREE.LatheGeometry(pts, radialSegments);
}

/**
 * Builds a pointed Gothic Lancet / Ogee Armor Shield plate with hollowed or beveled relief.
 */
export function createGothicArchShieldGeometry(
  width: number = 0.28,
  length: number = 0.72,
  thickness: number = 0.035,
  withCutoutWindow: boolean = false
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const hw = width * 0.5;
  const hl = length * 0.5;

  shape.moveTo(0, hl);
  shape.quadraticCurveTo(hw * 0.85, hl * 0.45, hw, 0);
  shape.quadraticCurveTo(hw * 0.9, -hl * 0.55, hw * 0.35, -hl * 0.85);
  shape.lineTo(0, -hl);
  shape.lineTo(-hw * 0.35, -hl * 0.85);
  shape.quadraticCurveTo(-hw * 0.9, -hl * 0.55, -hw, 0);
  shape.quadraticCurveTo(-hw * 0.85, hl * 0.45, 0, hl);
  shape.closePath();

  if (withCutoutWindow) {
    const hole = new THREE.Path();
    const ihw = hw * 0.54;
    const ihl = hl * 0.62;
    hole.moveTo(0, ihl);
    hole.quadraticCurveTo(ihw, ihl * 0.35, ihw, -ihl * 0.25);
    hole.lineTo(0, -ihl * 0.75);
    hole.lineTo(-ihw, -ihl * 0.25);
    hole.quadraticCurveTo(-ihw, ihl * 0.35, 0, ihl);
    hole.closePath();
    shape.holes.push(hole);
  }

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.3,
    bevelSize: thickness * 0.25,
    bevelSegments: 2,
  });
  geom.center();
  return geom;
}

/**
 * Builds a curved, razor-sharp claw talon or mandible blade along a 3D spline.
 */
export function createCurvedTalonGeometry(
  length: number = 0.85,
  baseRadius: number = 0.068,
  curveDrop: number = 0.22,
  segments: number = 20
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -length * 0.35, curveDrop * 0.45),
    new THREE.Vector3(0, -length * 0.72, curveDrop * 0.82),
    new THREE.Vector3(0, -length, curveDrop * 0.42),
  ]);

  const radialSegs = 6; // Hexagonal/bladed cross section
  const positions: number[] = [];
  const indices: number[] = [];
  const frames = curve.computeFrenetFrames(segments, false);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const pt = curve.getPointAt(t);
    // Taper smoothly with slight mid-swell like an armored Victorian leg blade
    const swell = Math.sin(t * Math.PI) * 0.28;
    const r = Math.max(0.004, baseRadius * (1 - Math.pow(t, 1.35)) + baseRadius * swell * (1 - t));
    const N = frames.normals[i];
    const B = frames.binormals[i];

    for (let j = 0; j < radialSegs; j++) {
      const ang = (j / radialSegs) * Math.PI * 2;
      // Flatten laterally, sharpen front/back edges
      const sx = Math.cos(ang) * r * (j % 3 === 0 ? 1.35 : 0.72);
      const sy = Math.sin(ang) * r * 0.78;
      const vx = pt.x + N.x * sx + B.x * sy;
      const vy = pt.y + N.y * sx + B.y * sy;
      const vz = pt.z + N.z * sx + B.z * sy;
      positions.push(vx, vy, vz);
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radialSegs; j++) {
      const a = i * radialSegs + j;
      const b = i * radialSegs + ((j + 1) % radialSegs);
      const c = (i + 1) * radialSegs + ((j + 1) % radialSegs);
      const d = (i + 1) * radialSegs + j;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}
