import * as THREE from 'three';
import { MaterialVariantConfig, MaterialVariantId } from '../types/spider';

export const MATERIAL_VARIANTS: Record<MaterialVariantId, MaterialVariantConfig> = {
  default: {
    id: 'default',
    name: 'DEFAULT',
    subtitle: 'Black & Gold',
    badge: '70% Obsidian / 25% Gold / 5% Crimson',
    description: 'Standard Imperial Mechanics Workshop specification: blackened crucible steel armor, hand-chased antique gold filigree, and blood-ruby optical lenses.',
    primarySteel: { color: '#141519', metalness: 0.86, roughness: 0.28 },
    antiqueGold: { color: '#c89d46', metalness: 0.94, roughness: 0.22 },
    secondaryIron: { color: '#272930', metalness: 0.80, roughness: 0.36 },
    obsidianGlass: { color: '#0c0b0e', metalness: 0.92, roughness: 0.12, opacity: 0.94 },
    crimsonCrystal: { color: '#b50e1c', emissive: '#940714', emissiveIntensity: 1.35, roughness: 0.08 },
  },
  bloodglass: {
    id: 'bloodglass',
    name: 'BLOOD GLASS',
    subtitle: 'Red Accents',
    badge: 'Sanguine Ruby Carapace & Copper-Gold',
    description: 'High-output alchemical ruby variant featuring translucent crimson stained-glass vaulting, dark sanguine steel plating, and burnished copper-gold ribs.',
    primarySteel: { color: '#280d12', metalness: 0.82, roughness: 0.24 },
    antiqueGold: { color: '#c48348', metalness: 0.92, roughness: 0.25 },
    secondaryIron: { color: '#3b151b', metalness: 0.78, roughness: 0.34 },
    obsidianGlass: { color: '#450810', metalness: 0.88, roughness: 0.10, opacity: 0.90 },
    crimsonCrystal: { color: '#e61529', emissive: '#cc0c20', emissiveIntensity: 2.1, roughness: 0.06 },
  },
  obsidian: {
    id: 'obsidian',
    name: 'OBSIDIAN',
    subtitle: 'Matte Black',
    badge: 'Nocturnal Infiltration Carbon-Steel',
    description: 'Light-absorbing nocturnal assassination coating: acid-etched matte obsidian armor, smoked gunmetal bronze filigree, and subdued garnet optics.',
    primarySteel: { color: '#0c0d10', metalness: 0.62, roughness: 0.52 },
    antiqueGold: { color: '#59554d', metalness: 0.84, roughness: 0.36 },
    secondaryIron: { color: '#181a1f', metalness: 0.70, roughness: 0.46 },
    obsidianGlass: { color: '#050507', metalness: 0.95, roughness: 0.14, opacity: 0.98 },
    crimsonCrystal: { color: '#7a0912', emissive: '#59040b', emissiveIntensity: 0.85, roughness: 0.14 },
  },
  ivory: {
    id: 'ivory',
    name: 'IVORY',
    subtitle: 'Bone White',
    badge: 'Cathedral Ossuary Enamel & Champagne Gold',
    description: 'Ceremonial Imperial Palace Guard edition: carved bone-ivory porcelain armor plates framed in pale champagne gold filigree over dark bronze clockwork.',
    primarySteel: { color: '#dfd6c5', metalness: 0.22, roughness: 0.32 },
    antiqueGold: { color: '#bfa054', metalness: 0.90, roughness: 0.24 },
    secondaryIron: { color: '#4a4339', metalness: 0.76, roughness: 0.38 },
    obsidianGlass: { color: '#2b2520', metalness: 0.86, roughness: 0.16, opacity: 0.95 },
    crimsonCrystal: { color: '#a80d1a', emissive: '#850611', emissiveIntensity: 1.25, roughness: 0.09 },
  },
};

export interface SpiderMaterialSet {
  blackenedSteel: THREE.MeshStandardMaterial;
  antiqueGold: THREE.MeshStandardMaterial;
  secondaryIron: THREE.MeshStandardMaterial;
  obsidianGlass: THREE.MeshStandardMaterial;
  crimsonCrystal: THREE.MeshStandardMaterial;
  crimsonCoreGlow: THREE.MeshStandardMaterial;
}

/**
 * Generates a procedural Victorian gothic filigree & brushed metal bump texture
 * on an in-memory HTMLCanvasElement so zero external texture files are needed.
 */
export function createProceduralEngravingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle brushed metal grain
  for (let i = 0; i < 1600; i++) {
    const y = Math.random() * 512;
    const alpha = 0.03 + Math.random() * 0.05;
    ctx.strokeStyle = i % 2 === 0 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y + (Math.random() - 0.5) * 4);
    ctx.stroke();
  }

  // Gothic lancet & rose tracery relief lines
  ctx.strokeStyle = 'rgba(235, 235, 235, 0.45)';
  ctx.lineWidth = 3;
  for (let col = 64; col < 512; col += 128) {
    ctx.beginPath();
    ctx.arc(col, 256, 48, 0, Math.PI * 2);
    ctx.stroke();
    for (let a = 0; a < 8; a++) {
      const ang = (a * Math.PI) / 4;
      ctx.beginPath();
      ctx.arc(col + Math.cos(ang) * 24, 256 + Math.sin(ang) * 24, 14, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

export function createSpiderMaterialSet(variantId: MaterialVariantId = 'default'): SpiderMaterialSet {
  const cfg = MATERIAL_VARIANTS[variantId];
  const bumpMap = createProceduralEngravingTexture();

  const blackenedSteel = new THREE.MeshStandardMaterial({
    name: 'BlackenedSteel',
    color: new THREE.Color(cfg.primarySteel.color),
    metalness: cfg.primarySteel.metalness,
    roughness: cfg.primarySteel.roughness,
    bumpMap,
    bumpScale: 0.015,
  });

  const antiqueGold = new THREE.MeshStandardMaterial({
    name: 'AntiqueGold',
    color: new THREE.Color(cfg.antiqueGold.color),
    metalness: cfg.antiqueGold.metalness,
    roughness: cfg.antiqueGold.roughness,
    bumpMap,
    bumpScale: 0.025,
  });

  const secondaryIron = new THREE.MeshStandardMaterial({
    name: 'SecondaryIron',
    color: new THREE.Color(cfg.secondaryIron.color),
    metalness: cfg.secondaryIron.metalness,
    roughness: cfg.secondaryIron.roughness,
  });

  const obsidianGlass = new THREE.MeshStandardMaterial({
    name: 'ObsidianGlass',
    color: new THREE.Color(cfg.obsidianGlass.color),
    metalness: cfg.obsidianGlass.metalness,
    roughness: cfg.obsidianGlass.roughness,
    transparent: true,
    opacity: cfg.obsidianGlass.opacity,
  });

  const crimsonCrystal = new THREE.MeshStandardMaterial({
    name: 'CrimsonCrystal',
    color: new THREE.Color(cfg.crimsonCrystal.color),
    emissive: new THREE.Color(cfg.crimsonCrystal.emissive),
    emissiveIntensity: cfg.crimsonCrystal.emissiveIntensity,
    metalness: 0.35,
    roughness: cfg.crimsonCrystal.roughness,
    transparent: true,
    opacity: 0.92,
  });

  const crimsonCoreGlow = new THREE.MeshStandardMaterial({
    name: 'CrimsonCoreGlow',
    color: new THREE.Color('#ff1e34'),
    emissive: new THREE.Color(cfg.crimsonCrystal.emissive),
    emissiveIntensity: cfg.crimsonCrystal.emissiveIntensity * 1.4,
    metalness: 0.2,
    roughness: 0.1,
  });

  return {
    blackenedSteel,
    antiqueGold,
    secondaryIron,
    obsidianGlass,
    crimsonCrystal,
    crimsonCoreGlow,
  };
}

export function applyMaterialVariant(
  materials: SpiderMaterialSet,
  variantId: MaterialVariantId,
  crimsonIlluminationEnabled: boolean = true
): void {
  const cfg = MATERIAL_VARIANTS[variantId];

  materials.blackenedSteel.color.set(cfg.primarySteel.color);
  materials.blackenedSteel.metalness = cfg.primarySteel.metalness;
  materials.blackenedSteel.roughness = cfg.primarySteel.roughness;

  materials.antiqueGold.color.set(cfg.antiqueGold.color);
  materials.antiqueGold.metalness = cfg.antiqueGold.metalness;
  materials.antiqueGold.roughness = cfg.antiqueGold.roughness;

  materials.secondaryIron.color.set(cfg.secondaryIron.color);
  materials.secondaryIron.metalness = cfg.secondaryIron.metalness;
  materials.secondaryIron.roughness = cfg.secondaryIron.roughness;

  materials.obsidianGlass.color.set(cfg.obsidianGlass.color);
  materials.obsidianGlass.metalness = cfg.obsidianGlass.metalness;
  materials.obsidianGlass.roughness = cfg.obsidianGlass.roughness;

  materials.crimsonCrystal.color.set(cfg.crimsonCrystal.color);
  materials.crimsonCrystal.emissive.set(cfg.crimsonCrystal.emissive);
  materials.crimsonCrystal.emissiveIntensity = crimsonIlluminationEnabled
    ? cfg.crimsonCrystal.emissiveIntensity
    : 0.08;

  materials.crimsonCoreGlow.emissive.set(cfg.crimsonCrystal.emissive);
  materials.crimsonCoreGlow.emissiveIntensity = crimsonIlluminationEnabled
    ? cfg.crimsonCrystal.emissiveIntensity * 1.4
    : 0.05;
}
