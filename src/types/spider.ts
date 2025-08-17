export type MaterialVariantId = 'default' | 'bloodglass' | 'obsidian' | 'ivory';

export type AnimationMode = 'idle' | 'walk' | 'threat' | 'inspection' | 'clockwork';

export type CameraPresetId =
  | 'reset'
  | 'isometric'
  | 'front'
  | 'side'
  | 'rear'
  | 'top'
  | 'detail_optics'
  | 'detail_clockwork'
  | 'detail_leg_joint'
  | 'detail_hidden_weapon'
  | 'detail_carapace';

export type ComponentId =
  | 'optical_array'
  | 'observation_dome'
  | 'clockwork_core'
  | 'armored_abdomen'
  | 'gothic_carapace'
  | 'leg_assembly'
  | 'mandibles'
  | 'retractable_blade'
  | 'venom_injector';

export interface MechanicalState {
  abdomenOpen: boolean;
  rotateGears: boolean;
  activateOptics: boolean;
  extendMandibles: boolean;
  deployBlades: boolean;
  crimsonIllumination: boolean;
  activatePistons: boolean;
  venomPurge: boolean;
  explosionIntensity: number; // 0 to 1
  gearSpeedMultiplier: number; // 0.2 to 3.0
  isolatedComponent: ComponentId | null;
}

export interface ComponentMetadata {
  id: ComponentId;
  code: string;
  name: string;
  subtitle: string;
  description: string;
  mechanicalFunction: string;
  materialComposition: string;
  dimensions: string;
  calloutPosition: [number, number, number];
  calloutOffset2D?: [number, number];
}

export interface MaterialVariantConfig {
  id: MaterialVariantId;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  primarySteel: {
    color: string;
    metalness: number;
    roughness: number;
  };
  antiqueGold: {
    color: string;
    metalness: number;
    roughness: number;
  };
  secondaryIron: {
    color: string;
    metalness: number;
    roughness: number;
  };
  obsidianGlass: {
    color: string;
    metalness: number;
    roughness: number;
    opacity: number;
  };
  crimsonCrystal: {
    color: string;
    emissive: string;
    emissiveIntensity: number;
    roughness: number;
  };
}
