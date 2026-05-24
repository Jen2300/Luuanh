import { writePsd } from 'ag-psd';
import { PSDLayer, PSDCanvas } from '../types';

/**
 * Loads an image from a source URL and returns an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
  });
}

/**
 * Renders a PSDLayer to an HTMLCanvasElement with filters and custom styles applied
 */
export async function renderLayerToCanvas(layer: PSDLayer): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(layer.width));
  canvas.height = Math.max(1, Math.round(layer.height));
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get 2D context for layer canvas');
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply CSS filters if present
  let filterStr = '';
  if (layer.filters) {
    const { grayscale, contrast, brightness, blur, sepia, hueRotate, invert } = layer.filters;
    if (grayscale > 0) filterStr += ` grayscale(${grayscale}%)`;
    if (contrast !== 100) filterStr += ` contrast(${contrast}%)`;
    if (brightness !== 100) filterStr += ` brightness(${brightness}%)`;
    if (blur > 0) filterStr += ` blur(${blur}px)`;
    if (sepia > 0) filterStr += ` sepia(${sepia}%)`;
    if (hueRotate > 0) filterStr += ` hue-rotate(${hueRotate}deg)`;
    if (invert) filterStr += ` invert(100%)`;
  }
  
  if (filterStr.trim()) {
    ctx.filter = filterStr.trim();
  }

  if (layer.type === 'image' && layer.imageSrc) {
    try {
      const img = await loadImage(layer.imageSrc);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch (e) {
      console.error(`Error rendering image layer "${layer.name}":`, e);
      // Fallback: draw placeholder text/box
      ctx.fillStyle = '#ff0055';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.fillText('Lỗi tải ảnh', 10, 30);
    }
  } else if (layer.type === 'solid' && layer.solidConfig) {
    ctx.fillStyle = layer.solidConfig.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (layer.type === 'text' && layer.textConfig) {
    const { content, fontSize, color, fontFamily, fontWeight } = layer.textConfig;
    
    // Reset filters for text rendering if we want clean text, or let it inherit filters.
    // Designers might want filters on text,, so we keep the filter.
    ctx.fillStyle = color;
    
    // Set font style
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    // Wrap and draw text if broad, or draw simple single line.
    // For general canvases we draw at the center.
    const words = content.split('\n');
    const lineHeight = fontSize * 1.25;
    const totalHeight = words.length * lineHeight;
    let startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;
    
    words.forEach((line) => {
      ctx.fillText(line, canvas.width / 2, startY);
      startY += lineHeight;
    });
  }

  return canvas;
}

/**
 * Maps our app layer blend modes to ag-psd expected blend mode strings
 */
function mapBlendMode(mode: string): any {
  // ag-psd expects specific string mappings
  const mapping: Record<string, string> = {
    'normal': 'normal',
    'multiply': 'multiply',
    'screen': 'screen',
    'overlay': 'overlay',
    'darken': 'darken',
    'lighten': 'lighten',
    'color-dodge': 'color dodge',
    'color-burn': 'color burn',
    'hard-light': 'hard light',
    'soft-light': 'soft light',
    'difference': 'difference',
    'exclusion': 'exclusion',
    'hue': 'hue',
    'saturation': 'saturation',
    'color': 'color',
    'luminosity': 'luminosity'
  };
  return mapping[mode] || 'normal';
}

/**
 * Builds and triggers the download of a PSD file from multiple layers
 */
export async function exportPSD(
  canvasConfig: PSDCanvas,
  layers: PSDLayer[],
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const totalLayers = layers.length;
  const psdChildren: any[] = [];

  // Important: ag-psd writes layers from bottom to top, or top to bottom?
  // Usually, in a PSD, the layers order is from top to bottom or bottom to top.
  // In ag-psd, layers are written such that the first item in children is the bottom-most layer,
  // and the last item is the top-most layer, or vice versa?
  // Actually, 'children' in config lists layers from bottom to top (bottom-most is index 0).
  // Let's reverse our internal order if index 0 is our top.
  // Let's assume our layers array is ordered from top-most (index 0) to bottom-most (index layers.length - 1).
  // Thus we should process them in reverse order (bottom-most to top-most) to export correctly!
  const reversedLayers = [...layers].reverse();

  for (let i = 0; i < reversedLayers.length; i++) {
    const layer = reversedLayers[i];
    if (onProgress) {
      onProgress(Math.round((i / totalLayers) * 85));
    }

    // Skip hidden layers? Or export them as hidden in Photoshop?
    // Designers love having hidden layers! It's one of PSD's key features.
    // So we can render them anyway and set `hidden: !layer.visible` or `opened: true` etc.
    const layerCanvas = await renderLayerToCanvas(layer);

    psdChildren.push({
      name: layer.name,
      canvas: layerCanvas,
      left: Math.round(layer.x),
      top: Math.round(layer.y),
      opacity: layer.opacity, // 0 to 1
      blendMode: mapBlendMode(layer.blendMode),
      visible: layer.visible,
    });
  }

  if (onProgress) {
    onProgress(90);
  }

  const psdConfig = {
    width: Math.round(canvasConfig.width),
    height: Math.round(canvasConfig.height),
    children: psdChildren,
  };

  // Convert to ArrayBuffer via ag-psd
  const buffer = writePsd(psdConfig);

  if (onProgress) {
    onProgress(100);
  }

  return new Blob([buffer], { type: 'image/vnd.adobe.photoshop' });
}
