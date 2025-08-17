import * as THREE from 'three';
import { ComponentId, ComponentMetadata } from '../types/spider';
import { SpiderMaterialSet } from '../materials/materialSystem';
import {
  createCurvedTalonGeometry,
  createGothicArchShieldGeometry,
  createGothicSpireLatheGeometry,
  createSpokedGearGeometry,
} from './proceduralGenerators';

export const COMPONENT_METADATA: Record<ComponentId, ComponentMetadata> = {
  observation_dome: {
    id: 'observation_dome',
    code: 'SYS-01 // TURRET-SPIRE',
    name: 'OBSERVATION DOME',
    subtitle: 'Multi-layered optical lens with 360° vision',
    description:
      'Elevated Gothic belfry spire mounted atop the cephalothorax collar. Houses a periscopic prism assembly and 360-degree panoramic rangefinder.',
    mechanicalFunction: '360° azimuthal target acquisition, ballistic triangulation, and elevated reconnaissance.',
    materialComposition: 'Blackened Crucible Steel, Chased 18k Antique Gold, Alchemical Ruby Prism',
    dimensions: 'Ø 280 mm × 640 mm H',
    calloutPosition: [-0.26, 1.38, 0.28],
  },
  optical_array: {
    id: 'optical_array',
    code: 'SYS-02 // OCULAR-CLUSTER',
    name: 'OPTICAL SYSTEM',
    subtitle: 'Crimson Ruby Multi-Spectrum Ocular Array',
    description:
      'Primary central blood-ruby compound lens flanked by eight articulated secondary ocular turrets with motorized brass iris diaphragms.',
    mechanicalFunction: 'Thermal-alchemical night vision, micro-motion tracking, and focal depth lock.',
    materialComposition: 'Synthetic Blood Ruby Crystal, Spun Brass Bezels, Obsidian Antireflective Glass',
    dimensions: 'Ø 420 mm Frontal Cluster',
    calloutPosition: [0.0, 0.66, 0.92],
  },
  clockwork_core: {
    id: 'clockwork_core',
    code: 'SYS-03 // MAINSPRING-ENGINE',
    name: 'CLOCKWORK CORE',
    subtitle: 'High-torque spring engine with gear transmission',
    description:
      'Coaxial twin-barrel mainspring engine driving 14 skeletonized epicyclic brass gear trains and a resonant crimson crystal governor.',
    mechanicalFunction: 'Distributes synchronized mechanical torque to all eight leg sockets and dorsal actuators.',
    materialComposition: 'Hardened Phosphor Bronze, Tempered Spring Steel, Resonant Ruby Heart',
    dimensions: 'Ø 780 mm × 920 mm Core Volume',
    calloutPosition: [0.18, 1.12, -0.32],
  },
  armored_abdomen: {
    id: 'armored_abdomen',
    code: 'SYS-04 // CATHEDRAL-VAULT',
    name: 'ARMORED CARAPACE',
    subtitle: 'Openable structure for maintenance',
    description:
      'Six-segment cathedral-domed abdomen built from curved blackened steel plates, pointed gothic lancet tracery, and crimson stained-glass vents.',
    mechanicalFunction: 'Ballistic protection for the Clockwork Core with motorized wing-shell maintenance deployment.',
    materialComposition: 'Case-Hardened Obsidian Steel, Gold Rose-Window Filigree, Ruby Stained Glass',
    dimensions: '1,180 mm L × 960 mm W × 980 mm H',
    calloutPosition: [0.58, 1.06, -0.45],
  },
  gothic_carapace: {
    id: 'gothic_carapace',
    code: 'SYS-05 // THORAX-CHASSIS',
    name: 'GOTHIC CARAPACE',
    subtitle: 'Reinforced Cephalothorax & Gimbal Chassis',
    description:
      'Triple-collared gothic breastplate and ventral frame uniting the head assembly, observation spire, and eight high-load leg gimbal sockets.',
    mechanicalFunction: 'Primary load-bearing structural spine and harmonic vibration dampening via ventral pendulum.',
    materialComposition: 'Forged Blackened Iron, Gilded Structural Ribs, Hardened Brass Bearings',
    dimensions: '840 mm L × 760 mm W',
    calloutPosition: [-0.38, 0.78, 0.15],
  },
  leg_assembly: {
    id: 'leg_assembly',
    code: 'SYS-06 // OCTA-LIMB',
    name: 'ARTICULATED LEG',
    subtitle: 'Multi-axis joint with silent mechanism',
    description:
      'Eight 4-DOF kinematic limbs featuring geared coxa gimbals, high-arched gothic armored femurs, hydraulic damping pistons, and tapered tibia-tarsus claws.',
    mechanicalFunction: 'Silent alternating-tetrapod locomotion, vertical wall scaling, and strike elevation.',
    materialComposition: 'Blackened Spring Steel, Antique Gold Filigree Guards, Brass Hydraulic Cylinders',
    dimensions: '2,600 mm Total Span / 1,400 mm Standing Arch',
    calloutPosition: [-0.95, 0.56, 0.65],
  },
  mandibles: {
    id: 'mandibles',
    code: 'SYS-07 // CHELICERAE',
    name: 'MECHANICAL MANDIBLES',
    subtitle: 'Articulated Serrated Pincers & Fang Pendulums',
    description:
      'Twin gear-driven chelicerae pincers flanked by articulated pedipalp feelers and suspended gothic chain counterweights.',
    mechanicalFunction: 'Close-quarters armor shearing, wire severing, and specimen immobilization.',
    materialComposition: 'Tungsten-Carburized Black Steel, Gilded Bevel Gears',
    dimensions: '340 mm Extended Reach',
    calloutPosition: [0.22, 0.42, 0.96],
  },
  retractable_blade: {
    id: 'retractable_blade',
    code: 'SYS-08 // CONCEALED-LANCE',
    name: 'RETRACTABLE BLADE',
    subtitle: 'Concealed weaponry within the legs',
    description:
      'Spring-loaded twin assassination stilettos concealed inside the lower tarsus sheaths of the anterior and mid mechanical legs.',
    mechanicalFunction: 'Rapid pneumatic deployment during Threat Mode for high-velocity kinetic strikes.',
    materialComposition: 'Damascus Blackened Steel, Gold Fuller Engraving',
    dimensions: '410 mm Blade Extension',
    calloutPosition: [0.58, 0.34, 0.76],
  },
  venom_injector: {
    id: 'venom_injector',
    code: 'SYS-09 // CHEM-PAYLOAD',
    name: 'VENOM INJECTOR',
    subtitle: 'Chemical payload system (modular)',
    description:
      'Pressurized alchemical glass ampoules and hollow hypodermic talon tips integrated into the terminal leg claws.',
    mechanicalFunction: 'Delivers metered neuro-paralytic or corrosive alchemical agents upon talon penetration.',
    materialComposition: 'Borosilicate Ruby Glass, Hollow Platinum-Iridium Needle Tip',
    dimensions: '45 mL Pressurized Ampoule × 8',
    calloutPosition: [0.82, 0.14, 0.74],
  },
};

export interface LegRig {
  index: number;
  side: number; // -1 left, +1 right
  pairIndex: number; // 0..3 front to back
  rootGroup: THREE.Group;
  coxaGroup: THREE.Group;
  femurGroup: THREE.Group;
  femurArmorGroup: THREE.Group;
  tibiaGroup: THREE.Group;
  tibiaArmorGroup: THREE.Group;
  tarsusGroup: THREE.Group;
  bladeGroup: THREE.Group;
  venomGlowMesh: THREE.Mesh;
  pistonCylinder: THREE.Object3D;
  pistonRod: THREE.Object3D;
  kneeGear: THREE.Mesh;
  baseYaw: number;
  baseFemurPitch: number;
  baseTibiaPitch: number;
  baseTarsusPitch: number;
}

export interface CarapacePetalRig {
  group: THREE.Group;
  hingeGroup: THREE.Group;
  side: number;
  row: number;
  explodeDir: THREE.Vector3;
}

export interface NoctisArachnidRig {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  thoraxGroup: THREE.Group;
  observationSpireGroup: THREE.Group;
  headGroup: THREE.Group;
  centralLensGroup: THREE.Group;
  secondaryLenses: THREE.Group[];
  leftMandible: THREE.Group;
  rightMandible: THREE.Group;
  abdomenGroup: THREE.Group;
  topCupolaGroup: THREE.Group;
  carapacePetals: CarapacePetalRig[];
  clockworkCoreGroup: THREE.Group;
  gears: { mesh: THREE.Object3D; axis: 'x' | 'y' | 'z'; speed: number }[];
  pendulumGroup: THREE.Group;
  legs: LegRig[];
  pointLights: THREE.PointLight[];
  explodableParts: {
    object: THREE.Object3D;
    basePos: THREE.Vector3;
    baseRot: THREE.Euler;
    explodeOffset: THREE.Vector3;
    explodeRot?: THREE.Euler;
  }[];
}

function tagComponent(obj: THREE.Object3D, componentId: ComponentId): void {
  obj.userData.componentId = componentId;
  obj.traverse((child) => {
    child.userData.componentId = componentId;
  });
}

export function buildNoctisArachnid(materials: SpiderMaterialSet): NoctisArachnidRig {
  const root = new THREE.Group();
  root.name = 'NoctisArachnidRoot';

  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'BodyCenterGroup';
  bodyGroup.position.set(0, 0.72, 0);
  root.add(bodyGroup);

  const gears: { mesh: THREE.Object3D; axis: 'x' | 'y' | 'z'; speed: number }[] = [];
  const explodableParts: NoctisArachnidRig['explodableParts'] = [];
  const pointLights: THREE.PointLight[] = [];

  const registerExplodable = (
    object: THREE.Object3D,
    offset: [number, number, number],
    rotOffset?: [number, number, number]
  ) => {
    explodableParts.push({
      object,
      basePos: object.position.clone(),
      baseRot: object.rotation.clone(),
      explodeOffset: new THREE.Vector3(...offset),
      explodeRot: rotOffset ? new THREE.Euler(...rotOffset) : undefined,
    });
  };

  // Shared procedural geometries for performance
  const gearLargeGeom = createSpokedGearGeometry(0.26, 0.05, 18, 0.032, 6);
  const gearMedGeom = createSpokedGearGeometry(0.17, 0.04, 14, 0.026, 5);
  const gearSmallGeom = createSpokedGearGeometry(0.10, 0.025, 12, 0.022, 4);
  const spireMainGeom = createGothicSpireLatheGeometry(0.15, 0.78, 8);
  const spireMiniGeom = createGothicSpireLatheGeometry(0.048, 0.28, 6);
  const femurShieldGeom = createGothicArchShieldGeometry(0.22, 0.74, 0.032, true);
  const tibiaShieldGeom = createGothicArchShieldGeometry(0.17, 0.68, 0.026, false);
  const talonGeom = createCurvedTalonGeometry(0.86, 0.064, 0.18, 18);
  const bladeGeom = createCurvedTalonGeometry(0.52, 0.026, 0.06, 12);

  // ============================================================================
  // 1. THORAX & GOTHIC COLLAR CHASSIS (gothic_carapace)
  // ============================================================================
  const thoraxGroup = new THREE.Group();
  thoraxGroup.name = 'ThoraxChassis';
  bodyGroup.add(thoraxGroup);

  // Core sculpted thorax barrel
  const thoraxCoreGeom = new THREE.CylinderGeometry(0.34, 0.42, 0.72, 12, 1);
  thoraxCoreGeom.rotateX(Math.PI / 2);
  const thoraxCoreMesh = new THREE.Mesh(thoraxCoreGeom, materials.blackenedSteel);
  thoraxCoreMesh.position.set(0, 0.02, 0.22);
  thoraxCoreMesh.scale.set(1.15, 0.92, 1.0);
  thoraxCoreMesh.castShadow = true;
  thoraxCoreMesh.receiveShadow = true;
  thoraxGroup.add(thoraxCoreMesh);

  // 3 Layered Gothic Collar Arches with Gold Filigree Ribs over Thorax
  for (let c = 0; c < 3; c++) {
    const zPos = 0.42 - c * 0.17;
    const radius = 0.39 + c * 0.045;
    const collarGroup = new THREE.Group();
    collarGroup.position.set(0, 0.05, zPos);

    // Blackened steel armor band
    const bandGeom = new THREE.TorusGeometry(radius, 0.055, 8, 24, Math.PI * 1.18);
    const bandMesh = new THREE.Mesh(bandGeom, materials.blackenedSteel);
    bandMesh.rotation.z = -Math.PI * 0.09;
    bandMesh.scale.set(1.08, 0.95, 1.45);
    bandMesh.castShadow = true;
    collarGroup.add(bandMesh);

    // Raised antique gold filigree trim rings
    for (const zOff of [-0.042, 0.042]) {
      const trimGeom = new THREE.TorusGeometry(radius + 0.018, 0.016, 8, 28, Math.PI * 1.2);
      const trimMesh = new THREE.Mesh(trimGeom, materials.antiqueGold);
      trimMesh.rotation.z = -Math.PI * 0.1;
      trimMesh.position.z = zOff;
      trimMesh.scale.set(1.08, 0.95, 1.0);
      collarGroup.add(trimMesh);
    }

    // Gold decorative rivets & dorsal ridge crest
    for (let r = -3; r <= 3; r++) {
      const ang = Math.PI * 0.5 + r * 0.28;
      const stud = new THREE.Mesh(
        new THREE.ConeGeometry(0.022, 0.065, 6),
        materials.antiqueGold
      );
      stud.position.set(Math.cos(ang) * (radius + 0.05) * 1.08, Math.sin(ang) * (radius + 0.05) * 0.95, 0);
      stud.rotation.z = ang - Math.PI / 2;
      collarGroup.add(stud);
    }

    thoraxGroup.add(collarGroup);
  }

  // Ventral sternum plate & hanging Victorian chains / pendulum
  const sternumGeom = new THREE.CylinderGeometry(0.36, 0.24, 0.18, 8);
  const sternumMesh = new THREE.Mesh(sternumGeom, materials.secondaryIron);
  sternumMesh.position.set(0, -0.26, 0.15);
  sternumMesh.scale.set(1.1, 1, 1.4);
  thoraxGroup.add(sternumMesh);

  const pendulumGroup = new THREE.Group();
  pendulumGroup.position.set(0, -0.32, 0.24);
  // Central gothic plumb-bob pendulum
  const plumbRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 0.26, 6),
    materials.antiqueGold
  );
  plumbRod.position.y = -0.13;
  pendulumGroup.add(plumbRod);
  const plumbBob = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.048, 0),
    materials.antiqueGold
  );
  plumbBob.position.y = -0.27;
  plumbBob.scale.set(0.75, 1.65, 0.75);
  pendulumGroup.add(plumbBob);

  // Hanging draped gold filigree chains under thorax
  for (const side of [-1, 1]) {
    const chainArc = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.01, 6, 18, Math.PI),
      materials.antiqueGold
    );
    chainArc.position.set(side * 0.14, -0.02, 0.08);
    chainArc.rotation.z = Math.PI;
    chainArc.rotation.y = side * 0.35;
    pendulumGroup.add(chainArc);
  }
  thoraxGroup.add(pendulumGroup);

  // Exposed flank clockwork gears on the thorax sides
  for (const side of [-1, 1]) {
    const flankGear = new THREE.Mesh(gearMedGeom, materials.antiqueGold);
    flankGear.position.set(side * 0.44, 0.02, 0.16);
    flankGear.rotation.y = Math.PI / 2;
    thoraxGroup.add(flankGear);
    gears.push({ mesh: flankGear, axis: 'z', speed: side * 1.4 });
  }

  tagComponent(thoraxGroup, 'gothic_carapace');
  registerExplodable(pendulumGroup, [0, -0.42, 0.12]);

  // ============================================================================
  // 2. OBSERVATION DOME & GOTHIC BELFRY SPIRE (observation_dome)
  // ============================================================================
  const observationSpireGroup = new THREE.Group();
  observationSpireGroup.name = 'ObservationSpireTower';
  observationSpireGroup.position.set(-0.22, 0.34, 0.28);
  bodyGroup.add(observationSpireGroup);

  // Main spire shaft
  const mainSpireMesh = new THREE.Mesh(spireMainGeom, materials.blackenedSteel);
  mainSpireMesh.castShadow = true;
  observationSpireGroup.add(mainSpireMesh);

  // Gold gothic ribs & belfry arches around the observation spire
  for (let i = 0; i < 8; i++) {
    const ang = (i * Math.PI) / 4;
    const rib = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.014, 0.62, 5),
      materials.antiqueGold
    );
    rib.position.set(Math.cos(ang) * 0.095, 0.30, Math.sin(ang) * 0.095);
    rib.rotation.z = Math.cos(ang) * 0.12;
    rib.rotation.x = -Math.sin(ang) * 0.12;
    observationSpireGroup.add(rib);

    if (i % 2 === 0) {
      // Corner miniature pinnacle turret
      const pinnacle = new THREE.Mesh(spireMiniGeom, materials.antiqueGold);
      pinnacle.position.set(Math.cos(ang) * 0.145, 0.14, Math.sin(ang) * 0.145);
      observationSpireGroup.add(pinnacle);
    }
  }

  // Crimson 360° observation lantern ring inside belfry
  const beaconMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.078, 0.078, 0.11, 12),
    materials.crimsonCrystal
  );
  beaconMesh.position.y = 0.21;
  observationSpireGroup.add(beaconMesh);

  tagComponent(observationSpireGroup, 'observation_dome');
  registerExplodable(observationSpireGroup, [-0.25, 0.68, 0.22]);

  // ============================================================================
  // 3. HEAD, CRIMSON OPTICAL ARRAY & MANDIBLES (optical_array & mandibles)
  // ============================================================================
  const headGroup = new THREE.Group();
  headGroup.name = 'HeadOpticalCluster';
  headGroup.position.set(0, -0.04, 0.64);
  bodyGroup.add(headGroup);

  // Armored Gothic Cephalic Cowl
  const headCowlGeom = new THREE.SphereGeometry(0.32, 20, 16);
  headCowlGeom.scale(1.08, 0.88, 0.95);
  const headCowlMesh = new THREE.Mesh(headCowlGeom, materials.blackenedSteel);
  headCowlMesh.castShadow = true;
  headGroup.add(headCowlMesh);

  // Ornate Gold Gothic Brow Arch over the central eye
  const browArch = new THREE.Mesh(
    createGothicArchShieldGeometry(0.56, 0.48, 0.04, true),
    materials.antiqueGold
  );
  browArch.position.set(0, 0.06, 0.22);
  browArch.rotation.x = -0.22;
  headGroup.add(browArch);

  // Central Large Crimson Optical Lens Assembly
  const centralLensGroup = new THREE.Group();
  centralLensGroup.position.set(0, 0.02, 0.26);
  headGroup.add(centralLensGroup);

  // Spun gold outer bezel & gear-toothed aperture ring
  const mainBezel = new THREE.Mesh(
    new THREE.TorusGeometry(0.145, 0.024, 12, 28),
    materials.antiqueGold
  );
  centralLensGroup.add(mainBezel);

  const irisGear = new THREE.Mesh(
    createSpokedGearGeometry(0.165, 0.125, 20, 0.018, 4),
    materials.antiqueGold
  );
  irisGear.position.z = -0.01;
  centralLensGroup.add(irisGear);
  gears.push({ mesh: irisGear, axis: 'z', speed: 0.8 });

  // Domed multi-faceted Blood-Crimson Ruby Lens
  const mainRubyGeom = new THREE.SphereGeometry(0.132, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
  mainRubyGeom.rotateX(Math.PI / 2);
  const mainRubyMesh = new THREE.Mesh(mainRubyGeom, materials.crimsonCrystal);
  mainRubyMesh.position.z = 0.01;
  centralLensGroup.add(mainRubyMesh);

  // Inner bright crimson focal core
  const innerCoreMesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.065, 1),
    materials.crimsonCoreGlow
  );
  innerCoreMesh.position.z = 0.02;
  centralLensGroup.add(innerCoreMesh);

  const eyeLight = new THREE.PointLight('#ff1a2e', 1.4, 2.2);
  eyeLight.position.set(0, 0, 0.18);
  centralLensGroup.add(eyeLight);
  pointLights.push(eyeLight);

  // 8 Secondary Crimson Optical Lenses arranged symmetrically around the face
  const secondaryLenses: THREE.Group[] = [];
  const secEyeCoords: [number, number, number, number][] = [
    [-0.19, 0.11, 0.20, 0.052],
    [0.19, 0.11, 0.20, 0.052],
    [-0.24, -0.01, 0.16, 0.062],
    [0.24, -0.01, 0.16, 0.062],
    [-0.15, -0.12, 0.22, 0.046],
    [0.15, -0.12, 0.22, 0.046],
    [-0.08, 0.18, 0.19, 0.038],
    [0.08, 0.18, 0.19, 0.038],
  ];

  secEyeCoords.forEach(([x, y, z, r]) => {
    const sGroup = new THREE.Group();
    sGroup.position.set(x, y, z);
    sGroup.lookAt(x * 2.2, y * 1.8, z + 0.5);

    const bezel = new THREE.Mesh(
      new THREE.TorusGeometry(r, r * 0.22, 10, 20),
      materials.antiqueGold
    );
    sGroup.add(bezel);

    const lens = new THREE.Mesh(
      new THREE.SphereGeometry(r * 0.92, 14, 12),
      materials.crimsonCrystal
    );
    lens.scale.set(1, 1, 0.65);
    sGroup.add(lens);

    headGroup.add(sGroup);
    secondaryLenses.push(sGroup);
  });

  tagComponent(headGroup, 'optical_array');
  registerExplodable(headGroup, [0, 0.08, 0.58]);
  registerExplodable(centralLensGroup, [0, 0.04, 0.34]);

  // Mechanical Mandibles & Chelicerae (mandibles)
  const mandiblesRoot = new THREE.Group();
  mandiblesRoot.name = 'MechanicalMandibles';
  mandiblesRoot.position.set(0, -0.18, 0.16);
  headGroup.add(mandiblesRoot);

  const buildMandibleSide = (side: number): THREE.Group => {
    const mGroup = new THREE.Group();
    mGroup.position.set(side * 0.13, 0, 0.04);

    // Geared base housing
    const mGear = new THREE.Mesh(gearSmallGeom, materials.antiqueGold);
    mGear.rotation.x = Math.PI / 2;
    mGroup.add(mGear);
    gears.push({ mesh: mGear, axis: 'z', speed: side * 2.0 });

    // Primary curved serrated pincer
    const pincerMesh = new THREE.Mesh(
      createCurvedTalonGeometry(0.42, 0.048, 0.12, 14),
      materials.blackenedSteel
    );
    pincerMesh.rotation.z = side * 0.28;
    pincerMesh.rotation.x = 0.35;
    mGroup.add(pincerMesh);

    // Gold filigree dorsal ridge & inner teeth
    const goldSpine = new THREE.Mesh(
      createCurvedTalonGeometry(0.39, 0.024, 0.13, 12),
      materials.antiqueGold
    );
    goldSpine.position.z = 0.018;
    goldSpine.rotation.z = side * 0.28;
    goldSpine.rotation.x = 0.35;
    mGroup.add(goldSpine);

    // Secondary pedipalp feeler spike
    const feeler = new THREE.Mesh(
      createCurvedTalonGeometry(0.34, 0.022, 0.09, 10),
      materials.antiqueGold
    );
    feeler.position.set(side * 0.07, -0.04, -0.02);
    feeler.rotation.z = side * 0.15;
    feeler.rotation.x = 0.22;
    mGroup.add(feeler);

    return mGroup;
  };

  const leftMandible = buildMandibleSide(-1);
  const rightMandible = buildMandibleSide(1);
  mandiblesRoot.add(leftMandible, rightMandible);

  tagComponent(mandiblesRoot, 'mandibles');
  registerExplodable(mandiblesRoot, [0, -0.28, 0.36]);

  // ============================================================================
  // 4. CATHEDRAL ABDOMEN & IMPERIAL CLOCKWORK CORE (armored_abdomen & clockwork_core)
  // ============================================================================
  const abdomenGroup = new THREE.Group();
  abdomenGroup.name = 'CathedralAbdomen';
  abdomenGroup.position.set(0, 0.22, -0.48);
  bodyGroup.add(abdomenGroup);

  // 4A. Internal Imperial Clockwork Core (clockwork_core)
  const clockworkCoreGroup = new THREE.Group();
  clockworkCoreGroup.name = 'ImperialClockworkCore';
  abdomenGroup.add(clockworkCoreGroup);

  // Glowing Crimson Alchemical Core Heart
  const heartCoreMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.24, 1),
    materials.crimsonCoreGlow
  );
  clockworkCoreGroup.add(heartCoreMesh);

  const coreLight = new THREE.PointLight('#ff182c', 2.2, 3.0);
  clockworkCoreGroup.add(coreLight);
  pointLights.push(coreLight);

  // Brass Meridian Cage around the Crimson Core
  for (let m = 0; m < 4; m++) {
    const cageRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.014, 8, 32),
      materials.antiqueGold
    );
    cageRing.rotation.y = (m * Math.PI) / 4;
    clockworkCoreGroup.add(cageRing);
  }

  // 12 Interlocking Spoked Clockwork Gears inside the abdomen core
  const gearSpecs: {
    pos: [number, number, number];
    rot: [number, number, number];
    size: 'L' | 'M' | 'S';
    axis: 'x' | 'y' | 'z';
    speed: number;
  }[] = [
    { pos: [0, 0.18, 0], rot: [Math.PI / 2, 0, 0], size: 'L', axis: 'z', speed: 1.0 },
    { pos: [0, -0.18, 0], rot: [Math.PI / 2, 0, 0], size: 'L', axis: 'z', speed: -1.0 },
    { pos: [-0.28, 0.04, 0.08], rot: [0, Math.PI / 2, 0.2], size: 'L', axis: 'z', speed: 1.35 },
    { pos: [0.28, 0.04, 0.08], rot: [0, Math.PI / 2, -0.2], size: 'L', axis: 'z', speed: -1.35 },
    { pos: [-0.24, 0.16, -0.18], rot: [0.3, Math.PI / 3, 0], size: 'M', axis: 'z', speed: -1.8 },
    { pos: [0.24, 0.16, -0.18], rot: [0.3, -Math.PI / 3, 0], size: 'M', axis: 'z', speed: 1.8 },
    { pos: [0, 0.28, 0.16], rot: [0.4, 0, 0], size: 'M', axis: 'z', speed: 2.1 },
    { pos: [0, 0.24, -0.26], rot: [-0.4, 0, 0], size: 'M', axis: 'z', speed: -2.1 },
    { pos: [-0.34, -0.10, -0.06], rot: [0, Math.PI / 2, 0], size: 'S', axis: 'z', speed: 2.8 },
    { pos: [0.34, -0.10, -0.06], rot: [0, Math.PI / 2, 0], size: 'S', axis: 'z', speed: -2.8 },
  ];

  gearSpecs.forEach((spec, idx) => {
    const gGeom =
      spec.size === 'L' ? gearLargeGeom : spec.size === 'M' ? gearMedGeom : gearSmallGeom;
    const gMesh = new THREE.Mesh(
      gGeom,
      idx % 3 === 0 ? materials.secondaryIron : materials.antiqueGold
    );
    gMesh.position.set(...spec.pos);
    gMesh.rotation.set(...spec.rot);
    clockworkCoreGroup.add(gMesh);
    gears.push({ mesh: gMesh, axis: spec.axis, speed: spec.speed });
  });

  tagComponent(clockworkCoreGroup, 'clockwork_core');
  registerExplodable(clockworkCoreGroup, [0, 0.18, -0.22]);

  // 4B. Cathedral Abdomen Carapace Dome & 6 Hinged Shell Petals (armored_abdomen)
  const carapaceRootGroup = new THREE.Group();
  carapaceRootGroup.name = 'ArmoredCarapaceAssembly';
  abdomenGroup.add(carapaceRootGroup);

  // Top Central Gothic Lantern Cupola & Spire at the apex of the dome
  const topCupolaGroup = new THREE.Group();
  topCupolaGroup.position.set(0, 0.56, -0.04);
  carapaceRootGroup.add(topCupolaGroup);

  const cupolaPlinth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.24, 0.08, 8),
    materials.antiqueGold
  );
  topCupolaGroup.add(cupolaPlinth);

  const cupolaLantern = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.13, 0.18, 8),
    materials.crimsonCrystal
  );
  cupolaLantern.position.y = 0.12;
  topCupolaGroup.add(cupolaLantern);

  // 8 Gothic Pillars framing the apex cupola lantern
  for (let p = 0; p < 8; p++) {
    const ang = (p * Math.PI) / 4;
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.014, 0.20, 6),
      materials.antiqueGold
    );
    col.position.set(Math.cos(ang) * 0.135, 0.12, Math.sin(ang) * 0.135);
    topCupolaGroup.add(col);
  }

  const apexSpire = new THREE.Mesh(
    createGothicSpireLatheGeometry(0.14, 0.48, 8),
    materials.blackenedSteel
  );
  apexSpire.position.y = 0.21;
  topCupolaGroup.add(apexSpire);

  const apexGoldTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.025, 0.18, 8),
    materials.antiqueGold
  );
  apexGoldTip.position.y = 0.68;
  topCupolaGroup.add(apexGoldTip);

  registerExplodable(topCupolaGroup, [0, 0.72, -0.06]);

  // 6 Hinged Armored Carapace Petals with Gothic Stained-Glass Windows & Gold Filigree
  const carapacePetals: CarapacePetalRig[] = [];
  const domeRadius = 0.58;
  const petalConfigs: {
    side: number;
    row: number;
    phiStart: number;
    phiLen: number;
    explode: [number, number, number];
  }[] = [
    // Left 3 petals (front, mid, rear)
    { side: -1, row: 0, phiStart: Math.PI * 0.52, phiLen: Math.PI * 0.30, explode: [-0.52, 0.36, 0.24] },
    { side: -1, row: 1, phiStart: Math.PI * 0.84, phiLen: Math.PI * 0.32, explode: [-0.66, 0.32, -0.08] },
    { side: -1, row: 2, phiStart: Math.PI * 1.18, phiLen: Math.PI * 0.30, explode: [-0.48, 0.28, -0.44] },
    // Right 3 petals (front, mid, rear)
    { side: 1, row: 0, phiStart: Math.PI * 0.18, phiLen: Math.PI * 0.30, explode: [0.52, 0.36, 0.24] },
    { side: 1, row: 1, phiStart: -Math.PI * 0.16, phiLen: Math.PI * 0.32, explode: [0.66, 0.32, -0.08] },
    { side: 1, row: 2, phiStart: -Math.PI * 0.48, phiLen: Math.PI * 0.30, explode: [0.48, 0.28, -0.44] },
  ];

  petalConfigs.forEach((cfg) => {
    const petalGroup = new THREE.Group();
    const hingeGroup = new THREE.Group();
    // Place hinge near upper dorsal rim so petals wing outward realistically
    hingeGroup.position.set(cfg.side * 0.12, 0.36, (1 - cfg.row) * 0.16);
    petalGroup.add(hingeGroup);

    const localGroup = new THREE.Group();
    localGroup.position.set(-cfg.side * 0.12, -0.36, -(1 - cfg.row) * 0.16);
    hingeGroup.add(localGroup);

    // Outer blackened-steel spherical shell slice
    const shellGeom = new THREE.SphereGeometry(
      domeRadius,
      16,
      14,
      cfg.phiStart,
      cfg.phiLen,
      Math.PI * 0.14,
      Math.PI * 0.56
    );
    shellGeom.scale(1.06, 0.96, 1.22);
    const shellMesh = new THREE.Mesh(shellGeom, materials.blackenedSteel);
    shellMesh.castShadow = true;
    shellMesh.receiveShadow = true;
    localGroup.add(shellMesh);

    // Inner Recessed Crimson Stained-Glass Cathedral Window Layer
    const glassGeom = new THREE.SphereGeometry(
      domeRadius * 0.965,
      12,
      10,
      cfg.phiStart + 0.04,
      cfg.phiLen - 0.08,
      Math.PI * 0.20,
      Math.PI * 0.42
    );
    glassGeom.scale(1.06, 0.96, 1.22);
    const glassMesh = new THREE.Mesh(glassGeom, materials.crimsonCrystal);
    localGroup.add(glassMesh);

    // Raised Gold Gothic Filigree Ribs along both meridian edges & center of each petal
    for (const frac of [0.02, 0.5, 0.98]) {
      const phi = cfg.phiStart + cfg.phiLen * frac;
      const ribPts: THREE.Vector3[] = [];
      for (let s = 0; s <= 12; s++) {
        const theta = Math.PI * (0.13 + (s / 12) * 0.58);
        const r = domeRadius * (frac === 0.5 ? 1.025 : 1.018);
        const x = -r * Math.cos(phi) * Math.sin(theta) * 1.06;
        const y = r * Math.cos(theta) * 0.96;
        const z = r * Math.sin(phi) * Math.sin(theta) * 1.22;
        ribPts.push(new THREE.Vector3(x, y, z));
      }
      const ribCurve = new THREE.CatmullRomCurve3(ribPts);
      const ribTube = new THREE.Mesh(
        new THREE.TubeGeometry(ribCurve, 14, frac === 0.5 ? 0.013 : 0.018, 6, false),
        materials.antiqueGold
      );
      localGroup.add(ribTube);
    }

    // Gothic Rose-Window Medallion & Spirelet on the exterior of each petal
    const midPhi = cfg.phiStart + cfg.phiLen * 0.5;
    const midTheta = Math.PI * 0.42;
    const mx = -domeRadius * 1.02 * Math.cos(midPhi) * Math.sin(midTheta) * 1.06;
    const my = domeRadius * 1.02 * Math.cos(midTheta) * 0.96;
    const mz = domeRadius * 1.02 * Math.sin(midPhi) * Math.sin(midTheta) * 1.22;

    const roseMedallion = new THREE.Mesh(gearSmallGeom, materials.antiqueGold);
    roseMedallion.position.set(mx, my, mz);
    roseMedallion.lookAt(mx * 2, my * 2, mz * 2);
    localGroup.add(roseMedallion);

    // Perimeter gothic spirelet pinnacle
    const spirelet = new THREE.Mesh(spireMiniGeom, materials.antiqueGold);
    spirelet.position.set(mx * 0.94, my + 0.14, mz * 0.94);
    localGroup.add(spirelet);

    carapaceRootGroup.add(petalGroup);
    carapacePetals.push({
      group: petalGroup,
      hingeGroup,
      side: cfg.side,
      row: cfg.row,
      explodeDir: new THREE.Vector3(...cfg.explode),
    });
    registerExplodable(petalGroup, cfg.explode);
  });

  // Lower Abdomen Undercarriage & Tail Finial
  const underBellyGeom = new THREE.SphereGeometry(
    domeRadius * 0.94,
    18,
    10,
    0,
    Math.PI * 2,
    Math.PI * 0.68,
    Math.PI * 0.32
  );
  underBellyGeom.scale(1.04, 0.85, 1.20);
  const underBellyMesh = new THREE.Mesh(underBellyGeom, materials.secondaryIron);
  carapaceRootGroup.add(underBellyMesh);

  tagComponent(carapaceRootGroup, 'armored_abdomen');

  // ============================================================================
  // 5. EIGHT ARTICULATED MECHANICAL LEGS (leg_assembly, retractable_blade, venom_injector)
  // ============================================================================
  const legs: LegRig[] = [];

  // 4 pairs from front (pair 0) to back (pair 3) matching reference silhouette
  const pairSpecs = [
    {
      zSocket: 0.40,
      xSocket: 0.36,
      ySocket: -0.08,
      baseYaw: 0.56,
      femurLen: 0.84,
      tibiaLen: 0.78,
      tarsusLen: 0.92,
      femurPitch: 0.88,
      tibiaPitch: -1.32,
      tarsusPitch: -0.68,
      scale: 1.06,
    },
    {
      zSocket: 0.18,
      xSocket: 0.42,
      ySocket: -0.09,
      baseYaw: 0.16,
      femurLen: 0.88,
      tibiaLen: 0.82,
      tarsusLen: 0.95,
      femurPitch: 0.94,
      tibiaPitch: -1.36,
      tarsusPitch: -0.70,
      scale: 1.08,
    },
    {
      zSocket: -0.06,
      xSocket: 0.40,
      ySocket: -0.10,
      baseYaw: -0.26,
      femurLen: 0.84,
      tibiaLen: 0.78,
      tarsusLen: 0.90,
      femurPitch: 0.90,
      tibiaPitch: -1.34,
      tarsusPitch: -0.68,
      scale: 1.02,
    },
    {
      zSocket: -0.28,
      xSocket: 0.34,
      ySocket: -0.10,
      baseYaw: -0.68,
      femurLen: 0.80,
      tibiaLen: 0.76,
      tarsusLen: 0.88,
      femurPitch: 0.84,
      tibiaPitch: -1.28,
      tarsusPitch: -0.66,
      scale: 0.96,
    },
  ];

  let legIdx = 0;
  for (let pairIndex = 0; pairIndex < 4; pairIndex++) {
    const spec = pairSpecs[pairIndex];
    for (const side of [-1, 1]) {
      const legRoot = new THREE.Group();
      legRoot.name = `Leg_${side < 0 ? 'L' : 'R'}${pairIndex + 1}`;
      legRoot.position.set(side * spec.xSocket, spec.ySocket, spec.zSocket);
      legRoot.scale.setScalar(spec.scale);
      bodyGroup.add(legRoot);

      // 5A. Coxa Socket & Geared Gimbal Joint
      const coxaGroup = new THREE.Group();
      const yawAngle = side > 0 ? spec.baseYaw : Math.PI - spec.baseYaw;
      coxaGroup.rotation.y = yawAngle;
      legRoot.add(coxaGroup);

      const socketBell = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.11, 0.16, 10),
        materials.antiqueGold
      );
      socketBell.rotation.z = Math.PI / 2;
      socketBell.position.x = 0.06;
      coxaGroup.add(socketBell);

      const coxaSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.088, 12, 12),
        materials.blackenedSteel
      );
      coxaSphere.position.x = 0.14;
      coxaGroup.add(coxaSphere);

      // 5B. Femur (Upper Arched Mechanical Limb)
      const femurGroup = new THREE.Group();
      femurGroup.position.set(0.14, 0, 0);
      femurGroup.rotation.z = spec.femurPitch;
      coxaGroup.add(femurGroup);

      // Structural inner truss beam
      const femurBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.044, 0.058, spec.femurLen, 8),
        materials.secondaryIron
      );
      femurBeam.rotation.z = -Math.PI / 2;
      femurBeam.position.x = spec.femurLen * 0.5;
      femurBeam.castShadow = true;
      femurGroup.add(femurBeam);

      // Explodable Outer Gothic Femur Armor Plate & Gold Filigree Crest
      const femurArmorGroup = new THREE.Group();
      femurArmorGroup.position.set(spec.femurLen * 0.5, 0.045, 0);
      femurGroup.add(femurArmorGroup);

      const femurArmorPlate = new THREE.Mesh(femurShieldGeom, materials.blackenedSteel);
      femurArmorPlate.rotation.z = Math.PI / 2;
      femurArmorPlate.rotation.x = Math.PI / 2;
      femurArmorPlate.castShadow = true;
      femurArmorGroup.add(femurArmorPlate);

      const femurGoldTrim = new THREE.Mesh(femurShieldGeom, materials.antiqueGold);
      femurGoldTrim.rotation.z = Math.PI / 2;
      femurGoldTrim.rotation.x = Math.PI / 2;
      femurGoldTrim.scale.set(1.06, 1.03, 0.65);
      femurGoldTrim.position.y = 0.012;
      femurArmorGroup.add(femurGoldTrim);

      // Gothic Finial Spikes along the femur crest
      for (const sOff of [-0.22, 0, 0.22]) {
        const crestSpike = new THREE.Mesh(spireMiniGeom, materials.antiqueGold);
        crestSpike.scale.setScalar(0.55);
        crestSpike.position.set(sOff, 0.03, 0);
        femurArmorGroup.add(crestSpike);
      }

      // Functional Hydraulic / Mechanical Piston under the femur
      const pistonCylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.026, 0.026, spec.femurLen * 0.52, 8),
        materials.antiqueGold
      );
      pistonCylinder.rotation.z = -Math.PI / 2 + 0.12;
      pistonCylinder.position.set(spec.femurLen * 0.28, -0.075, 0);
      femurGroup.add(pistonCylinder);

      const pistonRod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, spec.femurLen * 0.54, 8),
        materials.secondaryIron
      );
      pistonRod.rotation.z = -Math.PI / 2 + 0.12;
      pistonRod.position.set(spec.femurLen * 0.62, -0.04, 0);
      femurGroup.add(pistonRod);

      // 5C. Patella Knee Joint & Tibia (Middle Limb Segment)
      const tibiaGroup = new THREE.Group();
      tibiaGroup.position.set(spec.femurLen, 0, 0);
      tibiaGroup.rotation.z = spec.tibiaPitch;
      femurGroup.add(tibiaGroup);

      // Ornate geared knee joint
      const kneeGear = new THREE.Mesh(gearSmallGeom, materials.antiqueGold);
      kneeGear.position.z = 0.035;
      tibiaGroup.add(kneeGear);
      gears.push({ mesh: kneeGear, axis: 'z', speed: side * 1.6 });

      const kneeCapSpire = new THREE.Mesh(spireMiniGeom, materials.antiqueGold);
      kneeCapSpire.scale.setScalar(0.72);
      kneeCapSpire.position.set(0.02, 0.06, 0);
      kneeCapSpire.rotation.z = -0.35;
      tibiaGroup.add(kneeCapSpire);

      // Tibia inner structural bar
      const tibiaBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.036, 0.048, spec.tibiaLen, 8),
        materials.secondaryIron
      );
      tibiaBeam.rotation.z = -Math.PI / 2;
      tibiaBeam.position.x = spec.tibiaLen * 0.5;
      tibiaBeam.castShadow = true;
      tibiaGroup.add(tibiaBeam);

      // Explodable Tibia Gothic Armor Shell
      const tibiaArmorGroup = new THREE.Group();
      tibiaArmorGroup.position.set(spec.tibiaLen * 0.48, 0.038, 0);
      tibiaGroup.add(tibiaArmorGroup);

      const tibiaPlate = new THREE.Mesh(tibiaShieldGeom, materials.blackenedSteel);
      tibiaPlate.rotation.z = Math.PI / 2;
      tibiaPlate.rotation.x = Math.PI / 2;
      tibiaPlate.castShadow = true;
      tibiaArmorGroup.add(tibiaPlate);

      const tibiaGoldRib = new THREE.Mesh(
        new THREE.BoxGeometry(spec.tibiaLen * 0.78, 0.022, 0.028),
        materials.antiqueGold
      );
      tibiaGoldRib.position.y = 0.024;
      tibiaArmorGroup.add(tibiaGoldRib);

      // Hanging Victorian Chain / Charm under the knee joint
      const kneePendant = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.028, 0),
        materials.antiqueGold
      );
      kneePendant.scale.set(0.7, 1.8, 0.7);
      kneePendant.position.set(0.08, -0.11, 0);
      tibiaGroup.add(kneePendant);

      // 5D. Metatarsus & Tarsus Claw Foot + Concealed Retractable Blade + Venom Injector
      const tarsusGroup = new THREE.Group();
      tarsusGroup.position.set(spec.tibiaLen, 0, 0);
      tarsusGroup.rotation.z = spec.tarsusPitch;
      tibiaGroup.add(tarsusGroup);

      // Ankle joint collar
      const ankleCollar = new THREE.Mesh(
        new THREE.TorusGeometry(0.048, 0.015, 8, 16),
        materials.antiqueGold
      );
      ankleCollar.rotation.y = Math.PI / 2;
      tarsusGroup.add(ankleCollar);

      // Tapering curved Blackened-Steel & Gold Talon Foot
      const clawHolder = new THREE.Group();
      clawHolder.rotation.z = Math.PI / 2; // Align -Y of talon along +X limb axis
      tarsusGroup.add(clawHolder);

      const mainTalonMesh = new THREE.Mesh(talonGeom, materials.blackenedSteel);
      mainTalonMesh.castShadow = true;
      clawHolder.add(mainTalonMesh);

      const goldTalonEdge = new THREE.Mesh(talonGeom, materials.antiqueGold);
      goldTalonEdge.scale.set(0.68, 0.98, 1.08);
      goldTalonEdge.position.z = 0.012;
      clawHolder.add(goldTalonEdge);

      // Concealed Retractable Twin Assassin Blades (retractable_blade)
      const bladeGroup = new THREE.Group();
      bladeGroup.name = `RetractableBlade_${legIdx}`;
      bladeGroup.position.set(spec.tarsusLen * 0.36, -0.025, 0);
      tarsusGroup.add(bladeGroup);

      for (const bZ of [-0.018, 0.018]) {
        const stiletto = new THREE.Mesh(bladeGeom, materials.antiqueGold);
        stiletto.rotation.z = Math.PI / 2 - 0.08;
        stiletto.position.set(0, 0, bZ);
        bladeGroup.add(stiletto);
      }

      // Modular Venom Injector Ampoule & Hypodermic Tip (venom_injector)
      const venomGroup = new THREE.Group();
      venomGroup.name = `VenomInjector_${legIdx}`;
      venomGroup.position.set(spec.tarsusLen * 0.72, -0.03, 0);
      tarsusGroup.add(venomGroup);

      const venomGlowMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.012, 0.16, 8),
        materials.crimsonCrystal
      );
      venomGlowMesh.rotation.z = Math.PI / 2;
      venomGroup.add(venomGlowMesh);

      const needleTip = new THREE.Mesh(
        new THREE.ConeGeometry(0.011, 0.18, 6),
        materials.antiqueGold
      );
      needleTip.rotation.z = -Math.PI / 2;
      needleTip.position.x = 0.18;
      venomGroup.add(needleTip);

      // Tag leg components for interactive click inspection
      tagComponent(legRoot, 'leg_assembly');
      tagComponent(bladeGroup, 'retractable_blade');
      tagComponent(venomGroup, 'venom_injector');

      // Register leg and its sub-armor plates for Exploded View
      const radialX = side * 0.56;
      const radialZ = (1.5 - pairIndex) * 0.24;
      registerExplodable(legRoot, [radialX, -0.08, radialZ]);
      registerExplodable(femurArmorGroup, [0, 0.24, 0]);
      registerExplodable(tibiaArmorGroup, [0, 0.20, 0]);

      legs.push({
        index: legIdx,
        side,
        pairIndex,
        rootGroup: legRoot,
        coxaGroup,
        femurGroup,
        femurArmorGroup,
        tibiaGroup,
        tibiaArmorGroup,
        tarsusGroup,
        bladeGroup,
        venomGlowMesh,
        pistonCylinder,
        pistonRod,
        kneeGear,
        baseYaw: yawAngle,
        baseFemurPitch: spec.femurPitch,
        baseTibiaPitch: spec.tibiaPitch,
        baseTarsusPitch: spec.tarsusPitch,
      });

      legIdx++;
    }
  }

  return {
    root,
    bodyGroup,
    thoraxGroup,
    observationSpireGroup,
    headGroup,
    centralLensGroup,
    secondaryLenses,
    leftMandible,
    rightMandible,
    abdomenGroup,
    topCupolaGroup,
    carapacePetals,
    clockworkCoreGroup,
    gears,
    pendulumGroup,
    legs,
    pointLights,
    explodableParts,
  };
}
