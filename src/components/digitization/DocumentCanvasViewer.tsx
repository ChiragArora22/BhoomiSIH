import React, { useRef, useEffect, useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { renderSyntheticLandRecordToCanvas } from '../../utils/documentRenderer';
import { BoundingBox } from '../../types/landRecord';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Move
} from 'lucide-react';

export const DocumentCanvasViewer: React.FC = () => {
  const { activeRecord, selectedBoundingBoxId, setSelectedBoundingBoxId } = useLandRecord();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);
  const [isInverted, setIsInverted] = useState<boolean>(false);

  // Pan states
  const [isPanning, setIsPanning] = useState(false);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!activeRecord || !canvasRef.current) return;
    renderSyntheticLandRecordToCanvas(canvasRef.current, activeRecord);
  }, [activeRecord]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click for pan
      setIsPanning(true);
      setStartPan({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanPos({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const resetView = () => {
    setZoom(100);
    setRotation(0);
    setPanPos({ x: 0, y: 0 });
  };

  if (!activeRecord) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
          <Layers className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-xs">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No Document Selected
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Select a land record from the queue bar above to render its high-resolution scan and interactive OCR bounding boxes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-card select-none">
      {/* Viewer Header Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {activeRecord.originalFileName}
          </span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px] uppercase font-semibold">
            {activeRecord.documentLanguage.toUpperCase()} OCR
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setZoom(Math.max(30, zoom - 15))}
            className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold w-9 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(300, zoom + 15))}
            className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            title="Rotate 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsInverted(!isInverted)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              isInverted ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Invert Colors (Faded Ink View)"
          >
            Invert
          </button>

          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition ${
              showBoundingBoxes ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Toggle OCR Bounding Boxes"
          >
            {showBoundingBoxes ? <Eye className="w-3 h-3 text-brand-600 dark:text-brand-400" /> : <EyeOff className="w-3 h-3" />}
            Boxes
          </button>

          <button
            onClick={resetView}
            className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 px-1.5 py-0.5 font-medium transition"
            title="Reset Zoom & Pan"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Canvas Container with Interactive Bounding Box Overlays */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 bg-slate-100/90 dark:bg-slate-950 overflow-hidden relative flex items-center justify-center cursor-grab active:cursor-grabbing p-4"
      >
        <div
          className="relative shadow-2xl transition-transform duration-75"
          style={{
            transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            filter: isInverted ? 'invert(0.9) contrast(1.2)' : 'none'
          }}
        >
          {/* Base Document Canvas */}
          <canvas
            ref={canvasRef}
            className="block max-w-[580px] h-auto object-contain rounded-lg border border-slate-300 dark:border-slate-700 bg-white shadow-md"
          />

          {/* Dynamic Interactive OCR Bounding Boxes */}
          {showBoundingBoxes && activeRecord.ocrBoundingBoxes.map((box: BoundingBox) => {
            const isSelected = selectedBoundingBoxId === box.id;
            const isHovered = hoveredBoxId === box.id;

            // Determine box outline color based on confidence score
            let colorClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300';
            if (box.confidence < 70) {
              colorClass = 'border-rose-500 bg-rose-500/20 text-rose-600 dark:text-rose-300';
            } else if (box.confidence < 90) {
              colorClass = 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-300';
            }

            if (isSelected) {
              colorClass = 'border-brand-500 bg-brand-500/20 ring-2 ring-brand-400 text-brand-700 dark:text-brand-200 shadow-lg focused-box-pulse';
            }

            return (
              <div
                key={box.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBoundingBoxId(box.id);
                }}
                onMouseEnter={() => setHoveredBoxId(box.id)}
                onMouseLeave={() => setHoveredBoxId(null)}
                style={{
                  position: 'absolute',
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`
                }}
                className={`border-2 rounded transition-all cursor-pointer z-20 group ${colorClass}`}
                title={`${box.label}: ${box.extractedValue} (${box.confidence}% conf)`}
              >
                {/* Floating Tag on Hover or Select */}
                {(isHovered || isSelected) && (
                  <div className="absolute -top-6 left-0 bg-slate-900/95 text-slate-100 text-[10px] px-2 py-0.5 rounded shadow-xl border border-slate-700 whitespace-nowrap z-30 font-mono flex items-center gap-1.5 pointer-events-none">
                    <span className="font-bold text-white">{box.label}</span>
                    <span className="text-emerald-400 font-semibold">{box.confidence}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend Overlay at bottom left */}
        <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-slate-700 dark:text-slate-300 flex items-center space-x-3 shadow-card z-30 font-mono">
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px]">Confidence:</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> &gt;90% High
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> 70-89% Med
          </span>
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> &lt;70% Low
          </span>
        </div>
      </div>
    </div>
  );
};
