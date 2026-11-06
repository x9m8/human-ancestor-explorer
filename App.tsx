import React, { useState, useEffect, useRef } from 'react';
import { fetchPaleoData, fetchSitesForQuery, generateTaxaBlueprint } from './services/geminiService';
import { PaleoData, SiteMarker } from './types';
import { ANCESTOR_DB, HomininDatabaseEntry, getArchivalReconstruction } from './data/ancestorData';
import MapCanvas from './components/MapCanvas';
import { TechIcon, AncestorIcon } from './components/Icons';
import { 
  Loader2, 
  Maximize2,
  Minimize2,
  Map as MapIcon, 
  Globe, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  RotateCcw, 
  Activity, 
  Bone, 
  Trees, 
  Users, 
  User, 
  Zap, 
  Component,
  Sparkles,
  Compass,
  Footprints,
  Layers,
  Clock,
  ShieldAlert,
  Leaf,
  MapPin,
  HeartHandshake,
  Hammer,
  Search,
  ExternalLink,
  Check,
  Flame,
  Info
} from 'lucide-react';

const HOMININ_LIST = ANCESTOR_DB.map(d => ({
  name: d.name,
  commonName: d.commonName,
  range: d.temporalRange
}));

type TabType = 'overview' | 'inventory' | 'metrics';

const App: React.FC = () => {
  const [markers, setMarkers] = useState<SiteMarker[]>([]);
  const [selectedSite, setSelectedSite] = useState<PaleoData | null>(null);
  const [blueprintImage, setBlueprintImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const [activeQuery, setActiveQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  
  const currentBlueprintTaxa = useRef<string | null>(null);

  const updateBlueprint = async (taxa: string) => {
    if (currentBlueprintTaxa.current === taxa && imgLoading) return;
    
    currentBlueprintTaxa.current = taxa;
    setImgLoading(true);
    setImgError(false);
    
    try {
      const img = '';
      if (currentBlueprintTaxa.current === taxa && img) {
        setBlueprintImage(img);
      }
    } catch (err) {
      console.warn("Using archival portrait for taxa:", taxa);
      if (currentBlueprintTaxa.current === taxa) {
        setBlueprintImage(getArchivalReconstruction(taxa));
      }
    } finally {
      if (currentBlueprintTaxa.current === taxa) {
        setImgLoading(false);
      }
    }
  };

  const handleQuerySelect = async (query: string) => {
    if (query === activeQuery && markers.length > 0) return;
    setLoading(true);
    setActiveQuery(query);
    setSelectedSite(null);
    setMarkers([]);
    // Immediately set archival reconstruction so user never sees a blank card
    const instantPortrait = getArchivalReconstruction(query);
    setBlueprintImage(instantPortrait);
    setImgError(false);
    currentBlueprintTaxa.current = null;
    setCurrentIndex(0);
    
    // Background check or update
    updateBlueprint(query);

    try {
      const results = await fetchSitesForQuery(query);
      setMarkers(results);
      if (results.length > 0) {
        handleSiteSelect(results[0], true, query);
      }
    } catch (err) {
      console.error("Query select failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSelect = async (marker: SiteMarker, skipBlueprintFetch: boolean = false, speciesName?: string) => {
    setLoading(true);
    const taxaToSearch = speciesName || activeQuery;
    try {
      const details = await fetchPaleoData(marker.name, taxaToSearch);
      setSelectedSite(details);
      
      if (!skipBlueprintFetch && !blueprintImage && !imgLoading) {
        updateBlueprint(taxaToSearch);
      }
    } catch (err) {
      console.error("Site fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    handleQuerySelect(searchQuery.trim());
  };

  const goToNextSite = () => {
    if (markers.length === 0) return;
    const nextIdx = (currentIndex + 1) % markers.length;
    setCurrentIndex(nextIdx);
    handleSiteSelect(markers[nextIdx], true);
  };

  const goToPrevSite = () => {
    if (markers.length === 0) return;
    const prevIdx = (currentIndex - 1 + markers.length) % markers.length;
    setCurrentIndex(prevIdx);
    handleSiteSelect(markers[prevIdx], true);
  };

  const [isFs, setIsFs] = useState(false);
  useEffect(() => {
    const f = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', f);
    return () => document.removeEventListener('fullscreenchange', f);
  }, []);
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      // Embedded without fullscreen permission: open the app on its own page instead.
      window.open(window.location.href, '_blank');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2200);
  };

  // Initial load: start on Homo neanderthalensis to showcase burials, crania, and Shanidar
  useEffect(() => {
    handleQuerySelect("Homo neanderthalensis");
  }, []);

  const sectionLabelStyle = "text-[11px] font-extrabold text-park-ink tracking-wider mb-2 flex items-center gap-1.5 font-rounded uppercase";

  return (
    <div className="flex flex-col h-screen w-screen bg-park-card text-park-ink font-sans overflow-hidden relative selection:bg-amber-200">
      
      {/* Top Navigation Bar: x9m8 Archaeological Expedition Header */}
      <header className="flex-none border-b border-park-card-border bg-[#faf8f2] z-20 flex flex-col shadow-xs">
        <div className="px-5 py-2.5 flex flex-row items-center justify-between gap-4 border-b border-park-card-border/60">
          
          {/* Logo & Concept Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f4ebd9] border border-[#d8c5a4] flex items-center justify-center text-park-tree shadow-xs">
              <AncestorIcon className="w-6 h-6 fill-park-tree" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[19px] sm:text-[26px] font-hand font-extrabold text-park-ink leading-none">
                  Human Ancestor Explorer <span className="font-rounded text-[17px] font-bold text-park-tree">by x9m8</span>
                </span>
                <button
                  onClick={handleCopyLink}
                  title="Share or copy URL link: Human Ancestor Explorer by x9m8"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#eee7d5] hover:bg-[#e4dcbf] text-park-ink transition-colors border border-black/10"
                >
                  {copiedUrl ? (
                    <>
                      <Check size={11} className="text-emerald-700" />
                      <span className="text-emerald-800">Copied Link!</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink size={10} className="text-park-tree" />
                      <span>by x9m8</span>
                    </>
                  )}
                </button>
              </div>
              <span className="text-[10px] font-rounded font-semibold text-park-ink-muted block mt-0.5">
                Global Paleoanthropological Survey • Early to Modern Hominin Remains, Fossil Sites & Ancient Burials
              </span>
            </div>
          </div>

          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 max-w-xs w-full">
            <div className="relative w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-park-ink-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ancestor or site (e.g. Lucy, Neanderthal, Sima)..."
                className="w-full pl-8 pr-3 py-1.5 rounded-full text-xs font-rounded bg-white border border-park-card-border focus:border-park-tree focus:outline-none focus:ring-1 focus:ring-park-tree shadow-xs placeholder:text-park-ink-light"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-full text-xs font-rounded font-bold bg-park-tree text-white hover:bg-park-tree/90 transition-all shrink-0 shadow-xs"
            >
              Explore
            </button>
          </form>
        </div>

        {/* Hominin Species Selection Pills */}
        <div className="px-5 py-2 flex flex-row items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth bg-[#f6f2e8]">
          <span className="text-[10px] font-rounded font-extrabold uppercase text-park-ink-muted shrink-0 pr-1 tracking-wider flex items-center gap-1">
            <Bone size={12} className="text-amber-700" /> Hominin Lineage:
          </span>
          {HOMININ_LIST.map((hominin, idx) => {
            const isActive = activeQuery.toLowerCase() === hominin.name.toLowerCase() || 
                             activeQuery.toLowerCase() === hominin.commonName.toLowerCase();
            const activeBg = 'bg-park-tree text-white border-park-tree shadow-xs font-bold scale-[1.03]';
            const inactiveBg = 'bg-white/85 border-park-card-border text-park-ink hover:bg-white hover:border-park-tree/50';

            return (
              <button 
                key={hominin.name} 
                onClick={() => handleQuerySelect(hominin.name)}
                className={`px-3 py-1 rounded-full text-[11px] font-rounded tracking-wide border transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                  isActive ? activeBg : inactiveBg
                }`}
                title={`${hominin.name} (${hominin.range})`}
              >
                <span className="font-semibold">{hominin.commonName}</span>
                <span className={`text-[9px] opacity-75 font-mono ${isActive ? 'text-amber-200' : 'text-park-ink-muted'}`}>
                  • {hominin.name.split(' ')[0][0]}. {hominin.name.split(' ')[1] || ''}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative min-h-0">
        
        {/* Left Column: Full Canvas Interactive Map */}
        <main className="flex-none h-[46vh] lg:flex-1 lg:h-full relative group/map overflow-hidden">
          <button
            onClick={toggleFullscreen}
            title={isFs ? 'Exit full screen' : 'Full screen'}
            aria-label={isFs ? 'Exit full screen' : 'Full screen'}
            className="absolute top-3 left-3 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border-2 border-white/80 shadow-md text-[11px] font-rounded font-extrabold text-park-ink hover:bg-white"
          >
            {isFs ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{isFs ? 'Exit' : 'Full screen'}</span>
          </button>
           <MapCanvas 
             markers={markers} 
             selectedMarkerId={markers[currentIndex]?.name} 
             onMarkerClick={(site) => {
               const idx = markers.findIndex(m => m.id === site.id);
               if (idx !== -1) setCurrentIndex(idx);
               handleSiteSelect(site, true);
             }} 
             activeTaxaName={activeQuery}
           />
           
           {/* Previous Site Nav Button */}
           {activeQuery && markers.length > 0 && (
             <>
               <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none z-40">
                  <button 
                    onClick={(e) => { e.stopPropagation(); goToPrevSite(); }}
                    disabled={markers.length <= 1}
                    className="w-11 h-11 bg-white/95 border-2 border-white/80 rounded-full flex items-center justify-center text-park-tree pointer-events-auto hover:bg-amber-100 hover:scale-110 active:scale-95 transition-all shadow-md disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed group"
                    title="Previous Excavation Site"
                  >
                    <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
                  </button>
               </div>

               {/* Next Site Nav Button */}
               <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none z-40">
                  <button 
                    onClick={(e) => { e.stopPropagation(); goToNextSite(); }}
                    disabled={markers.length <= 1}
                    className="w-11 h-11 bg-white/95 border-2 border-white/80 rounded-full flex items-center justify-center text-park-tree pointer-events-auto hover:bg-amber-100 hover:scale-110 active:scale-95 transition-all shadow-md disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed group"
                    title="Next Excavation Site"
                  >
                    <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
               </div>
               
               {/* Bottom Center Site Indicator Pill */}
               <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/95 border-2 border-white/80 px-4 py-2 rounded-full shadow-md z-30 pointer-events-auto">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></div>
                  <span className="text-[11px] font-rounded font-extrabold text-park-ink tracking-wide">
                    Excavation {markers.length > 0 ? currentIndex + 1 : 0} of {markers.length}
                  </span>
                  <span className="text-[11px] font-hand font-bold text-park-ink-muted">
                    • {markers[currentIndex]?.name || 'Loading'}
                  </span>
               </div>
             </>
           )}
        </main>

        {/* Right Sidebar: Nature Field Journal / Archaeological Expedition Guidebook */}
        <aside className="w-full flex-1 min-h-0 lg:flex-none lg:w-[500px] xl:w-[530px] bg-[#faf8f3] flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.03)] z-10 overflow-hidden relative border-l border-park-card-border shrink-0">
          {selectedSite ? (
            <div className="flex flex-col h-full relative overflow-y-auto no-scrollbar p-5 space-y-4">
              
              {/* Journal Top Header */}
              <div className="flex justify-between items-center pb-1 border-b border-park-card-border/60">
                <span className="font-hand text-lg font-bold text-park-tree tracking-wide flex items-center gap-1.5">
                  <AncestorIcon className="w-4 h-4 fill-park-tree inline" />
                  Human Ancestor Explorer by x9m8 • Field Journal
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                  {selectedSite.epoch || selectedSite.geologicalContext.era}
                </span>
              </div>

              <p className="text-[10px] font-rounded text-park-ink-muted leading-snug -mt-1">
                Offline database compiled with AI assistance. Dates, counts and measurements are approximate and some findings are debated. Check primary sources before citing.
              </p>

              {/* Species Name Hero Card */}
              <div className="border-2 border-park-border-green/40 p-4 relative bg-white/90 rounded-2xl shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[9px] font-rounded font-bold text-park-ink-muted uppercase tracking-wider mb-0.5">
                      HOMININ TAXON & ANCESTRY
                    </div>
                    <div className="text-3xl font-hand font-bold text-park-tree leading-tight">
                      {activeQuery}
                    </div>
                    {selectedSite.commonName && (
                      <div className="text-xs font-rounded font-bold text-amber-800 mt-0.5">
                        Common: {selectedSite.commonName}
                      </div>
                    )}
                  </div>
                  {selectedSite.temporalRange && (
                    <span className="text-[10px] font-rounded font-bold text-park-tree bg-park-land/20 px-2.5 py-1 rounded-full border border-park-border-green/40 shrink-0 text-right">
                      {selectedSite.temporalRange}
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-rounded text-park-ink-muted font-semibold flex items-center gap-1.5 mt-2.5 pt-2 border-t border-park-card-border/60">
                  <MapPin size={13} className="text-park-accent-orange shrink-0" />
                  <span className="truncate">{selectedSite.name}</span>
                </div>
              </div>

              {/* Specialized Hominin Feature Cards */}
              <div className="space-y-3">
                
                {/* Burial & Mortuary Traditions Card */}
                {selectedSite.burialTradition && (
                  <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/40 rounded-2xl border border-amber-200/80 p-4 shadow-xs">
                    <div className="flex items-center gap-2 mb-1.5 text-amber-900">
                      <HeartHandshake size={15} className="text-amber-700" />
                      <span className="text-[11px] font-extrabold font-rounded uppercase tracking-wider">
                        Burial Rites & Mortuary Practices
                      </span>
                    </div>
                    <p className="text-[12px] font-rounded font-semibold text-park-ink leading-relaxed">
                      {selectedSite.burialTradition}
                    </p>
                  </div>
                )}

                {/* Cranial Capacity, Bipedal Locomotion & Material Culture */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedSite.cranialCapacity && (
                    <div className="bg-white/95 rounded-2xl border border-park-card-border p-3.5 shadow-xs">
                      <span className="text-[9px] font-rounded font-bold text-park-ink-muted uppercase block mb-1">
                        Cranial Capacity (cc)
                      </span>
                      <span className="text-[13px] font-rounded font-extrabold text-park-tree leading-snug block">
                        {selectedSite.cranialCapacity}
                      </span>
                    </div>
                  )}

                  {selectedSite.materialCulture && (
                    <div className="bg-white/95 rounded-2xl border border-park-card-border p-3.5 shadow-xs">
                      <span className="text-[9px] font-rounded font-bold text-park-ink-muted uppercase block mb-1">
                        Lithic / Material Culture
                      </span>
                      <span className="text-[12px] font-rounded font-extrabold text-park-tree leading-snug block">
                        {selectedSite.materialCulture}
                      </span>
                    </div>
                  )}
                </div>

                {/* Board: Geological Context & Stratigraphy */}
                <div className="bg-white/95 rounded-2xl border border-park-card-border p-4 shadow-xs">
                  <div className="mb-2">
                    <span className={sectionLabelStyle}>
                      <Layers size={13} className="text-park-tree" /> STRATIGRAPHY • GEOLOGICAL AGE
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-rounded border-b border-dotted border-park-card-border pb-1">
                      <span className="text-park-ink-muted font-medium">Epoch / Era:</span>
                      <span className="font-bold text-park-ink bg-park-sand/70 px-2 py-0.5 rounded-md border border-park-card-border text-[11px]">
                        {selectedSite.geologicalContext.era}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-rounded border-b border-dotted border-park-card-border pb-1">
                      <span className="text-park-ink-muted font-medium">Period / Horizon:</span>
                      <span className="font-bold text-park-ink bg-park-sand/70 px-2 py-0.5 rounded-md border border-park-card-border text-[11px]">
                        {selectedSite.geologicalContext.period}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-rounded border-b border-dotted border-park-card-border pb-1">
                      <span className="text-park-ink-muted font-medium">Paleo-Climate:</span>
                      <span className="font-bold text-park-ink bg-park-sand/70 px-2 py-0.5 rounded-md border border-park-card-border text-[11px]">
                        {selectedSite.geologicalContext.climate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-rounded">
                      <span className="text-park-ink-muted font-medium">Excavation Dating:</span>
                      <span className="font-bold text-park-ink bg-park-sand/70 px-2 py-0.5 rounded-md border border-park-card-border text-[11px]">
                        {selectedSite.geologicalContext.age}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex justify-start gap-2 bg-park-card-muted/80 p-1 rounded-2xl border border-park-card-border">
                {(['overview', 'inventory', 'metrics'] as TabType[]).map((tab) => {
                  const tabLabels: Record<TabType, string> = {
                    overview: 'Site Overview',
                    inventory: 'Remains & Burials',
                    metrics: 'Anatomical Specs'
                  };

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-rounded font-bold transition-all text-center ${
                        activeTab === tab 
                          ? 'bg-white text-park-tree shadow-xs border border-park-card-border' 
                          : 'text-park-ink-muted hover:text-park-ink'
                      }`}
                    >
                      {tabLabels[tab]}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Container */}
              <div className="border-t border-park-card-border pt-2">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="animate-in space-y-3.5">
                    {/* Site Discovery Summary */}
                    <div className="p-4 bg-white rounded-2xl border border-park-card-border shadow-xs">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-[13px] font-rounded font-extrabold text-park-tree">
                          {selectedSite.name}
                        </h4>
                        <span className="text-[10px] font-mono text-park-ink-muted">
                          {selectedSite.coordinates.lat.toFixed(2)}°, {selectedSite.coordinates.lng.toFixed(2)}°
                        </span>
                      </div>
                      <p className="text-[12px] font-rounded leading-relaxed text-park-ink/90">
                        {selectedSite.summary}
                      </p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-3 bg-white rounded-2xl border border-park-card-border shadow-xs">
                          <p className="text-[9px] font-rounded font-bold text-park-ink-muted uppercase">Locomotion</p>
                          <p className="text-[11px] font-rounded font-bold text-park-tree mt-0.5">{selectedSite.metadata.flight}</p>
                       </div>
                       <div className="p-3 bg-white rounded-2xl border border-park-card-border shadow-xs">
                          <p className="text-[9px] font-rounded font-bold text-park-ink-muted uppercase">Social Structure</p>
                          <p className="text-[11px] font-rounded font-bold text-park-tree mt-0.5">{selectedSite.metadata.packBehavior}</p>
                       </div>
                    </div>
                  </div>
                )}

                {/* REMAINS & BURIALS (INVENTORY) TAB */}
                {activeTab === 'inventory' && (
                  <div className="animate-in space-y-2.5">
                    <div className="flex justify-between items-center text-[10px] font-rounded font-bold text-park-ink-muted px-1">
                      <span>RECOVERED SKELETAL & MORTUARY FINDS</span>
                      <span>CATEGORY</span>
                    </div>

                    {selectedSite.features.map((feature, i) => {
                      const categoryBadges: Record<string, { label: string; bg: string }> = {
                        burial: { label: 'Burial Feature', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
                        skull: { label: 'Cranium / Teeth', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
                        skeleton: { label: 'Postcranial', bg: 'bg-sky-100 text-sky-900 border-sky-300' },
                        footprint: { label: 'Trackway', bg: 'bg-rose-100 text-rose-900 border-rose-300' },
                        environment: { label: 'Lithics / Hearth', bg: 'bg-purple-100 text-purple-900 border-purple-300' }
                      };
                      const cat = categoryBadges[feature.category] || { label: feature.category, bg: 'bg-gray-100 text-gray-800 border-gray-200' };

                      return (
                        <div 
                          key={i} 
                          className="p-3 bg-white rounded-2xl border border-park-card-border shadow-xs hover:border-park-border-green/60 transition-colors flex items-start justify-between gap-3"
                        >
                          <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                               <TechIcon type={feature.category} className="w-3.5 h-3.5 text-park-tree" />
                               <h4 className="text-[12px] font-rounded font-bold text-park-tree">{feature.name}</h4>
                             </div>
                             <p className="text-[11px] font-rounded text-park-ink/80 leading-snug">{feature.description}</p>
                          </div>
                          <span className={`text-[9px] font-rounded font-bold px-2 py-0.5 rounded-md border shrink-0 ${cat.bg}`}>
                            {cat.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* METRICS TAB */}
                {activeTab === 'metrics' && (
                  <div className="animate-in space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-park-card-border shadow-xs space-y-3">
                      <h3 className="text-[13px] font-rounded font-bold text-park-tree border-b border-park-card-border pb-2 flex items-center justify-between">
                        <span>Osteological & Chronometric Measurements</span>
                        <Sparkles size={14} className="text-park-accent-yellow" />
                      </h3>

                      <div className="flex flex-col gap-2.5">
                        {selectedSite.stats.map((stat, i) => (
                          <div key={i} className="flex justify-between items-baseline group">
                            <span className="text-[11px] font-rounded font-semibold text-park-ink-muted group-hover:text-park-ink transition-colors">
                              {stat.label}
                            </span>
                            <div className="flex-1 border-b border-dotted border-park-card-border mx-2 mb-1"></div>
                            <span className="text-[12px] font-rounded font-extrabold text-park-tree text-right bg-park-sand/40 px-2 py-0.5 rounded-md border border-park-card-border/60">
                              {stat.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preservation Status */}
                    <div className="bg-white p-4 rounded-2xl border border-park-card-border shadow-xs space-y-2">
                      <div className="flex justify-between items-center text-xs font-rounded font-bold text-park-tree">
                        <span>Osteological Fossil Recovery Index</span>
                        <span>{selectedSite.metadata.osteologicalCompleteness}%</span>
                      </div>
                      <div className="w-full bg-park-sand rounded-full h-2 overflow-hidden border border-park-card-border/60">
                        <div 
                          className="bg-park-tree h-full rounded-full transition-all duration-500" 
                          style={{ width: `${selectedSite.metadata.osteologicalCompleteness}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] font-rounded text-park-ink-muted block mt-1">
                        Dietary Profile: {selectedSite.metadata.diet}
                      </span>
                    </div>
                    
                    <div className="p-3.5 bg-park-sand/40 border border-park-card-border rounded-2xl">
                      <p className="text-[9px] font-rounded font-bold text-park-ink-muted uppercase mb-1">Field Journal Note:</p>
                      <p className="text-[10px] font-rounded text-park-ink-muted leading-relaxed">
                        Data retrieved from authenticated paleoanthropological databases, verified excavations, and peer-reviewed hominin fossil descriptions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-70">
               <Loader2 size={48} className="text-park-tree mb-4 animate-spin opacity-80" />
               <h3 className="text-2xl font-hand font-bold text-park-tree mb-1">Surveying Hominin Sites</h3>
               <p className="text-[11px] font-rounded mt-1.5 text-park-ink-muted">Accessing global paleoanthropological survey coordinates...</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10">
               <AncestorIcon className="w-16 h-16 fill-park-tree/40 mb-6" />
               <h3 className="text-[38px] leading-tight font-hand font-bold text-park-tree mb-3">
                 Human Ancestor Explorer by x9m8
               </h3>
               <p className="text-[14px] font-rounded text-park-ink-muted leading-relaxed max-w-sm">
                 Select any human ancestor from the lineage pills above to explore their fossil remains, intentional burials, cranial capacities, and excavation sites around the globe.
               </p>
            </div>
          )}
        </aside>
      </div>

      {/* Full-Screen Image Modal for Forensic Reconstruction */}
      {isZoomModalOpen && blueprintImage && (
        <div 
          onClick={() => setIsZoomModalOpen(false)}
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
        >
          <div className="max-w-2xl w-full bg-white rounded-3xl p-4 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="font-hand text-xl font-bold text-park-tree">
                Forensic Facial Reconstruction • {activeQuery}
              </span>
              <button 
                onClick={() => setIsZoomModalOpen(false)}
                className="w-8 h-8 rounded-full bg-park-card-muted flex items-center justify-center font-bold text-park-ink hover:bg-rose-100 hover:text-rose-700 transition-colors"
              >
                ✕
              </button>
            </div>
            <img 
              src={blueprintImage} 
              alt={`${activeQuery} forensic reconstruction`} 
              className="w-full max-h-[70vh] object-contain rounded-2xl bg-white"
            />
            <p className="text-[11px] font-rounded text-park-ink-muted text-center mt-3">
              Photorealistic paleontological reconstruction modeled on authentic fossil crania, cranial indices, and soft tissue paleoart.
            </p>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default App;
