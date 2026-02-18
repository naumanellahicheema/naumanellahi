import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { X, Check, ZoomIn, ZoomOut, Move } from "lucide-react";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.92);
  });
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio = 1 }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((z: number) => {
    setZoom(z);
  }, []);

  const onCropAreaComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(blob);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/90">
        <div className="flex items-center gap-2 text-white">
          <Move size={18} />
          <span className="text-sm font-medium">Drag to position • Scroll to zoom</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors">
            <X size={18} /> Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors">
            <Check size={18} /> Apply Crop
          </button>
        </div>
      </div>

      {/* Cropper */}
      <div className="flex-1 relative">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          cropShape="round"
          showGrid={false}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropAreaComplete}
        />
      </div>

      {/* Zoom controls */}
      <div className="flex items-center justify-center gap-4 py-4 bg-black/90">
        <button onClick={() => setZoom(Math.max(1, zoom - 0.1))} className="p-2 text-white/70 hover:text-white">
          <ZoomOut size={20} />
        </button>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-48 accent-white"
        />
        <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="p-2 text-white/70 hover:text-white">
          <ZoomIn size={20} />
        </button>
        <span className="text-white/50 text-sm ml-2">{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
