export type LayerType = 'image' | 'text' | 'solid';

export interface LayerFilters {
  grayscale: number; // 0-100
  contrast: number; // 50-200 (100 is normal)
  brightness: number; // 50-200 (100 is normal)
  blur: number; // 0-20px
  sepia: number; // 0-100
  hueRotate: number; // 0-360 degrees
  invert: boolean;
}

export interface TextConfig {
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: string;
}

export interface SolidConfig {
  color: string;
}

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export interface PSDLayer {
  id: string;
  name: string;
  type: LayerType;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number; // 0 to 1
  visible: boolean;
  blendMode: BlendMode;
  imageSrc?: string; // Optional: empty for solid / text
  filters?: LayerFilters;
  textConfig?: TextConfig;
  solidConfig?: SolidConfig;
  originalWidth?: number; // Cache for aspect ratio
  originalHeight?: number; // Cache for aspect ratio
}

export interface PSDCanvas {
  width: number;
  height: number;
  name: string;
}
