import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLandRecord } from '../../context/LandRecordContext';
import { CADASTRAL_SAMPLE_GEOJSON } from '../../data/cadastralGeoJson';
import { CadastralFeature } from '../../types/gis';
import {
  MapPin,
  Layers,
  Sparkles,
  Scissors,
  ShieldAlert,
  CheckCircle2,
  Maximize2,
  Info,
  Compass,
  Building,
  Scale
} from 'lucide-react';
import L from 'leaflet';

export const CadastralMapViewer: React.FC = () => {
  const { records, setActiveRecordId, setActiveTab, appendAuditBlock, t } = useLandRecord();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);

  const [selectedFeature, setSelectedFeature] = useState<CadastralFeature['properties'] | null>(
    CADASTRAL_SAMPLE_GEOJSON.features[0].properties
  );
  const [mapMode, setMapMode] = useState<'STREET' | 'SATELLITE' | 'HYBRID'>('HYBRID');
  const [isMutationModalOpen, setIsMutationModalOpen] = useState(false);
  const [splitSubCount, setSplitSubCount] = useState(2);
  const [splitSuccessToast, setSplitSuccessToast] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map centered on sample revenue village (Mohanlalganj, Lucknow: 26.685, 80.979)
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [26.6852, 80.9785],
        zoom: 16,
        zoomControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Tile Layer (OpenStreetMap Carto Dark & Satellite)
      const tileUrl = mapMode === 'SATELLITE'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const baseTile = L.tileLayer(tileUrl, {
        attribution: '© OpenStreetMap contributors, Esri Bhuvan GIS',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;

      // Clicking empty map canvas resets the inspector panel
      map.on('click', () => {
        setSelectedFeature(null);
      });

      // Add GeoJSON Cadastral Layer
      const geoLayer = L.geoJSON(CADASTRAL_SAMPLE_GEOJSON as any, {
        style: (feature) => {
          const props = feature?.properties;
          const isDisputed = props?.disputeFlag;
          return {
            fillColor: isDisputed ? '#ef4444' : '#10b981',
            weight: 2.5,
            opacity: 1,
            color: isDisputed ? '#dc2626' : '#059669',
            dashArray: isDisputed ? '4, 4' : '',
            fillOpacity: isDisputed ? 0.45 : 0.35,
            className: isDisputed ? 'disputed-parcel-glow' : ''
          };
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties;
          layer.on({
            mouseover: (e) => {
              const target = e.target;
              target.setStyle({
                weight: 4,
                color: '#38bdf8',
                fillOpacity: 0.75
              });
            },
            mouseout: (e) => {
              geoLayer.resetStyle(e.target);
            },
            click: (e) => {
              L.DomEvent.stopPropagation(e);
              setSelectedFeature(props);
            }
          });

          // Permanent Khasra number label in center of polygon
          layer.bindTooltip(`Khasra ${props.khasraNo}`, {
            permanent: true,
            direction: 'center',
            className: 'bg-slate-900/90 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow border border-slate-700'
          });
        }
      }).addTo(map);

      geojsonLayerRef.current = geoLayer;
    }

    return () => {
      // Map cleanup if required
    };
  }, []);

  // Update base tile layer on mode change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    const tileUrl = (mapMode === 'SATELLITE' || mapMode === 'HYBRID')
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      attribution: '© OpenStreetMap, Esri World Imagery, Bhuvan ISRO',
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    if (geojsonLayerRef.current && mapInstanceRef.current) {
      geojsonLayerRef.current.bringToFront();
    }
  }, [mapMode]);

  const handleSimulateSplit = async () => {
    setIsMutationModalOpen(false);
    setSplitSuccessToast(true);
    if (selectedFeature) {
      await appendAuditBlock(
        `GIS-MUT-${selectedFeature.khasraNo}`,
        `KHASRA-${selectedFeature.khasraNo}`,
        'MUTATION_EXECUTED',
        'Anil Varma, PCS',
        'TEHSILDAR',
        'Sub-Divisional Magistrate / Tehsildar',
        `Cadastral parcel subdivision mutation executed on Khasra ${selectedFeature.khasraNo}. Generated ${splitSubCount} legally partitioned sub-parcels with verified spatial geometries.`
      );
    }
    setTimeout(() => setSplitSuccessToast(false), 4000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-85px)] p-4 space-y-4 bg-[var(--bg-base)] text-[var(--text-primary)] overflow-hidden">
      {/* Toast */}
      <AnimatePresence>
        {splitSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xl shrink-0"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Cadastral Parcel {selectedFeature?.khasraNo} successfully mutated and sub-divided into {splitSubCount} legal polygons on Bhuvan GIS!
            </span>
            <button onClick={() => setSplitSuccessToast(false)} className="text-white/80 hover:text-white">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-card shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
            <MapPin className="w-4 h-4" />
            Bhuvan ISRO / DILRMP Spatial Cadastral GIS Engine
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t('gisTitle')}
          </h2>
        </div>

        {/* Layer Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setMapMode('HYBRID')}
              className={`relative px-3 py-1 rounded-lg font-medium transition-colors ${
                mapMode === 'HYBRID' ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mapMode === 'HYBRID' && (
                <motion.div
                  layoutId="mapModeIndicator"
                  className="absolute inset-0 bg-brand-600 rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">{t('satelliteOverlay')}</span>
            </button>
            <button
              onClick={() => setMapMode('STREET')}
              className={`relative px-3 py-1 rounded-lg font-medium transition-colors ${
                mapMode === 'STREET' ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mapMode === 'STREET' && (
                <motion.div
                  layoutId="mapModeIndicator"
                  className="absolute inset-0 bg-brand-600 rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">{t('cadastralVector')}</span>
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsMutationModalOpen(true)}
            className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Scissors className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            {t('mutationSim')}
          </motion.button>
        </div>
      </div>

      {/* Main Grid: Map (8 cols) + Selected Parcel Details Drawer (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden min-h-0">
        {/* Left 8 Cols: Interactive Map Canvas */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden relative shadow-card flex flex-col">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-card text-xs space-y-1.5 font-mono text-slate-700 dark:text-slate-300">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Cadastral Legend</div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
              <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500"></span>
              Clear Title (Verified RoR)
            </div>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-[11px] font-semibold">
              <span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500 border-dashed"></span>
              Disputed / Active Stay (Khasra 118/3)
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Selected Parcel Inspector Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card flex flex-col justify-between overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedFeature ? (
              <motion.div
                key={selectedFeature.khasraNo}
                initial={{ x: 16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -16, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="space-y-4 text-xs"
              >
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-brand-600 dark:text-brand-400 uppercase font-bold font-mono">
                      {t('parcelId')}: {selectedFeature.bhuvanId}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      Khasra No. {selectedFeature.khasraNo}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {selectedFeature.village}, {selectedFeature.tehsil}, {selectedFeature.district}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedFeature.disputeFlag
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {selectedFeature.mutationStatus}
                  </span>
                </div>

                {/* Dispute Warning if active */}
                {selectedFeature.disputeFlag && (
                  <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/40 rounded-xl p-3 text-rose-800 dark:text-rose-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-300">
                      <ShieldAlert className="w-4 h-4" /> Legal Title Alert
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">{selectedFeature.disputeReason}</p>
                  </div>
                )}

                {/* Details Key-Value Table */}
                <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Registered Landowner:</span>
                    <span className="text-slate-900 dark:text-white font-semibold text-right">{selectedFeature.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Khata / Khewat No:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-200">{selectedFeature.khataNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{t('totalArea')}:</span>
                    <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">
                      {selectedFeature.areaHectares} Ha ({(selectedFeature.areaHectares * 2.471).toFixed(2)} Acres)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Land Use / Crop:</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedFeature.landUse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{t('soilQuality')}:</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedFeature.soilType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{t('irrigationStatus')}:</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedFeature.irrigationStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{t('marketVal')}:</span>
                    <span className="font-mono text-amber-600 dark:text-amber-300 font-semibold">
                      ₹{selectedFeature.marketValueINR.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Last Cadastral Resurvey:</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedFeature.lastSurveyYear}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const matched = records.find(r => r.khasraNumber === selectedFeature.khasraNo);
                      if (matched) {
                        setActiveRecordId(matched.id);
                        setActiveTab('SPLIT_VERIFY');
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-card transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Open in Dual-Pane Verification Studio
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 my-auto min-h-[360px]"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm">
                  <MapPin className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    Cadastral Inspector Standby
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Click any Khasra parcel polygon on the GIS map to inspect boundary coordinates, legal mutation history, soil quality, and ownership title.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFeature(CADASTRAL_SAMPLE_GEOJSON.features[0].properties)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-xs"
                >
                  Select Sample Khasra {CADASTRAL_SAMPLE_GEOJSON.features[0].properties.khasraNo}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Parcel Subdivision / Mutation Simulator Modal */}
      <AnimatePresence>
        {isMutationModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-xs text-slate-700 dark:text-slate-200"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                Cadastral Parcel Subdivision & Partition Simulator
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Simulate mutation partition deed for Khasra <span className="font-bold text-slate-900 dark:text-white">{selectedFeature?.khasraNo}</span> (Area: {selectedFeature?.areaHectares} Ha). The AI spatial algorithm automatically splits vertices and generates sub-polygons.
              </p>

              <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <label className="text-slate-700 dark:text-slate-300 font-medium block">Number of Sub-Parcels to Partition:</label>
                <div className="flex gap-2">
                  {[2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => setSplitSubCount(num)}
                      className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                        splitSubCount === num ? 'bg-brand-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {num} Sub-Plots
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5 pt-2 text-[11px] font-mono">
                  {Array.from({ length: splitSubCount }).map((_, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const subArea = ((selectedFeature?.areaHectares || 1.0) / splitSubCount).toFixed(4);
                    return (
                      <div key={i} className="flex justify-between bg-white dark:bg-slate-900/80 p-2 rounded border border-slate-200 dark:border-slate-800">
                        <span className="text-brand-600 dark:text-brand-400 font-bold">Khasra {selectedFeature?.khasraNo}/{letter}</span>
                        <span className="text-slate-700 dark:text-slate-300">Area: {subArea} Hectares</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsMutationModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSimulateSplit}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-colors shadow-card"
                >
                  Apply Spatial Partition
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
