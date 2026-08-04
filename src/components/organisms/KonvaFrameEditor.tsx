import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { ZoomIn, ZoomOut, RotateCw, Trash2 } from 'lucide-react';
import IconButton from '../atoms/IconButton';

export interface PhotoLayerItem {
  id: string; // ID unik untuk tiap foto di canvas
  url: string; // Base64 / URL foto mentah
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface KonvaFrameEditorProps {
  photoLayers: PhotoLayerItem[];
  frameOverlayUrl: string;
  selectedPhotoId: string | null;
  stageRef: React.RefObject<Konva.Stage | null>;
  onSelectPhotoLayer: (id: string | null) => void;
  onUpdatePhotoLayer: (id: string, newAttrs: Partial<PhotoLayerItem>) => void;
  onRemovePhotoLayer: (id: string) => void;
}

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 533;

// Sub-komponent Render Foto
function SingleKonvaPhoto({
  item,
  onSelect,
  onChange,
  onRef,
}: {
  item: PhotoLayerItem;
  onSelect: () => void;
  onChange: (newAttrs: Partial<PhotoLayerItem>) => void;
  onRef: (node: Konva.Image | null) => void;
}) {
  const [image] = useImage(item.url, 'anonymous');

  return (
    <>
      {image && (
        <KonvaImage
          ref={(node) => onRef(node)}
          image={image}
          x={item.x}
          y={item.y}
          scaleX={item.scale}
          scaleY={item.scale}
          rotation={item.rotation}
          offsetX={image.width / 2}
          offsetY={image.height / 2}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            onChange({
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = e.target;
            onChange({
              x: node.x(),
              y: node.y(),
              scale: node.scaleX(),
              rotation: node.rotation(),
            });
          }}
        />
      )}
    </>
  );
}

export default function KonvaFrameEditor({
  photoLayers,
  frameOverlayUrl,
  selectedPhotoId,
  stageRef,
  onSelectPhotoLayer,
  onUpdatePhotoLayer,
  onRemovePhotoLayer,
}: KonvaFrameEditorProps) {
  const [frameOverlay] = useImage(frameOverlayUrl, 'anonymous');
  const activeLayer = photoLayers.find((p) => p.id === selectedPhotoId);

  const imageRefs = useRef<Record<string, Konva.Image | null>>({});
  const trRef = useRef<Konva.Transformer | null>(null);

  // Helper instan untuk attach Transformer ke node foto
  const attachTransformer = (node: Konva.Image | null) => {
    if (trRef.current) {
      if (node) {
        trRef.current.nodes([node]);
      } else {
        trRef.current.nodes([]);
      }
      trRef.current.getLayer()?.batchDraw();
    }
  };

  // Efek ketika selectedPhotoId berubah
  useEffect(() => {
    if (selectedPhotoId) {
      const selectedNode = imageRefs.current[selectedPhotoId];
      attachTransformer(selectedNode || null);
    } else if (trRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedPhotoId, photoLayers]);

  const handleZoom = (delta: number) => {
    if (!activeLayer) return;
    const newScale = Math.max(0.1, Math.min(3, activeLayer.scale + delta));
    onUpdatePhotoLayer(activeLayer.id, { scale: newScale });
  };

  const handleRotate = () => {
    if (!activeLayer) return;
    const newRotation = (activeLayer.rotation + 90) % 360;
    onUpdatePhotoLayer(activeLayer.id, { rotation: newRotation });
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Canvas Area */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-[#111827] touch-none">
        <Stage
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={stageRef}
          onMouseDown={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) onSelectPhotoLayer(null);
          }}
          onTouchStart={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) onSelectPhotoLayer(null);
          }}
        >
          {/* LAYER 1 (PALING BELAKANG): Foto-Foto Tamu */}
          <Layer>
            {photoLayers.map((item) => (
              <SingleKonvaPhoto
                key={item.id}
                item={item}
                onSelect={() => onSelectPhotoLayer(item.id)}
                onChange={(newAttrs) => onUpdatePhotoLayer(item.id, newAttrs)}
                onRef={(node) => {
                  imageRefs.current[item.id] = node;
                  // Begitu node selesai dirender oleh useImage, jika id-nya sedang terpilih, langsung sambungkan Transformer secara instan!
                  if (item.id === selectedPhotoId && node) {
                    attachTransformer(node);
                  }
                }}
              />
            ))}
          </Layer>

          {/* LAYER 2 (TENGAH): Overlay Bingkai Transparan */}
          <Layer listening={false}>
            {frameOverlay && (
              <KonvaImage
                image={frameOverlay}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                listening={false}
              />
            )}
          </Layer>

          {/* LAYER 3 (PALING DEPAN): Titik-Titik Resize Transformer */}
          <Layer>
            {selectedPhotoId && (
              <Transformer
                ref={trRef}
                rotateEnabled={true}
                keepRatio={false}
                anchorFill="#4648d4"
                anchorStroke="#ffffff"
                anchorCornerRadius={4}
                anchorSize={10}
                borderStroke="#4648d4"
                borderDash={[4, 4]}
                enabledAnchors={[
                  'top-left',
                  'top-right',
                  'bottom-left',
                  'bottom-right',
                  'top-center',
                  'bottom-center',
                  'middle-left',
                  'middle-right',
                ]}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 30 || newBox.height < 30) return oldBox;
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>

        <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded pointer-events-none">
          {photoLayers.length === 0
            ? 'Klik "+ Foto" untuk menambah foto'
            : 'Sentuh foto untuk geser/resize'}
        </span>
      </div>

      {/* Kontrol Foto yang Sedang Aktif Dipilih */}
      {activeLayer && (
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-[#e2e8f0] shadow-sm animate-fade-in">
          <IconButton
            icon={<ZoomOut className="w-4 h-4 text-slate-700" />}
            onClick={() => handleZoom(-0.1)}
            title="Perkecil"
          />
          <span className="text-xs font-semibold text-slate-500 w-12 text-center">
            {Math.round(activeLayer.scale * 100)}%
          </span>
          <IconButton
            icon={<ZoomIn className="w-4 h-4 text-slate-700" />}
            onClick={() => handleZoom(0.1)}
            title="Perbesar"
          />
          <div className="w-px h-5 bg-slate-200 my-auto mx-1" />
          <IconButton
            icon={<RotateCw className="w-4 h-4 text-slate-700" />}
            onClick={handleRotate}
            title="Putar Foto"
          />
          <div className="w-px h-5 bg-slate-200 my-auto mx-1" />
          <IconButton
            icon={<Trash2 className="w-4 h-4 text-red-500" />}
            onClick={() => onRemovePhotoLayer(activeLayer.id)}
            title="Hapus Foto Ini dari Bingkai"
          />
        </div>
      )}
    </div>
  );
}