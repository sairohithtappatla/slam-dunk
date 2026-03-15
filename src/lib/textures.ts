import * as THREE from 'three';

export const generateBasketballTextures = (primaryColor: string, lineColor: string, pattern: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { map: null, normalMap: null };

  // Background
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, 1024, 512);

  // Noise/Texture
  const imageData = ctx.getImageData(0, 0, 1024, 512);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 20;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);

  // Draw Lines
  const drawLines = (c: CanvasRenderingContext2D, strokeStyle: string, lineWidth: number, glow: boolean) => {
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.lineWidth = lineWidth;
    c.strokeStyle = strokeStyle;
    
    if (pattern === 'tech' && glow) {
      c.shadowColor = lineColor;
      c.shadowBlur = 10;
    }

    // Horizontal line
    c.beginPath();
    c.moveTo(0, 256);
    c.lineTo(1024, 256);
    c.stroke();

    if (pattern === 'classic' || pattern === 'tech') {
      c.beginPath();
      c.moveTo(256, 0);
      c.lineTo(256, 512);
      c.stroke();
      c.beginPath();
      c.moveTo(768, 0);
      c.lineTo(768, 512);
      c.stroke();
      
      c.beginPath();
      for (let i = 0; i <= 1024; i++) {
        const angle = (i / 1024) * Math.PI * 2;
        const y = 512 / 2 + Math.sin(angle) * (512 * 0.42);
        if (i === 0) c.moveTo(i, y);
        else c.lineTo(i, y);
      }
      c.stroke();
    } else if (pattern === 'cross') {
      c.beginPath();
      for (let i = 0; i <= 1024; i++) {
        const angle = (i / 1024) * Math.PI * 2;
        const y = 512 / 2 + Math.cos(angle) * (512 * 0.45);
        if (i === 0) c.moveTo(i, y);
        else c.lineTo(i, y);
      }
      c.stroke();
      c.beginPath();
      for (let i = 0; i <= 1024; i++) {
        const angle = (i / 1024) * Math.PI * 2;
        const y = 512 / 2 - Math.cos(angle) * (512 * 0.45);
        if (i === 0) c.moveTo(i, y);
        else c.lineTo(i, y);
      }
      c.stroke();
    } else if (pattern === 'street') {
      c.beginPath();
      c.moveTo(0, 153.6);
      c.lineTo(1024, 153.6);
      c.stroke();
      c.beginPath();
      c.moveTo(0, 358.4);
      c.lineTo(1024, 358.4);
      c.stroke();
      for (let i = 1; i < 4; i++) {
        c.beginPath();
        c.moveTo(1024 * (i / 4), 0);
        c.lineTo(1024 * (i / 4), 512);
        c.stroke();
      }
    }
  };

  drawLines(ctx, lineColor, 6, true);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = 1024;
  normalCanvas.height = 512;
  const nCtx = normalCanvas.getContext('2d');
  if (nCtx) {
    nCtx.fillStyle = '#8080ff';
    nCtx.fillRect(0, 0, 1024, 512);
    const nImageData = nCtx.createImageData(1024, 512);
    const nData = nImageData.data;
    for (let i = 0; i < nData.length; i += 4) {
      nData[i] = 128 + (Math.random() - 0.5) * 60;
      nData[i + 1] = 128 + (Math.random() - 0.5) * 60;
      nData[i + 2] = 255;
      nData[i + 3] = 255;
    }
    nCtx.putImageData(nImageData, 0, 0);
    drawLines(nCtx, '#2020ff', 8, false);
  }
  const normalMap = new THREE.CanvasTexture(normalCanvas);

  return { map, normalMap };
};
