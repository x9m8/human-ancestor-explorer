export interface PaleoData {
  name: string;
  commonName?: string;
  temporalRange?: string;
  epoch?: string;
  cranialCapacity?: string;
  locomotion?: string;
  materialCulture?: string;
  burialTradition?: string;
  reconstructionUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  summary: string;
  stats: PaleoStat[];
  features: PaleoFeature[];
  geologicalContext: {
    era: string;
    period: string;
    climate: string;
    age: string;
  };
  metadata: {
    threatLevel: string; // Used for Ecological/Hunter/Forager role
    threatScore: number; // 1-5 scale
    diet: string;
    packBehavior: string; // Band / social structure
    integument: string; // Clothing / physical adaptation
    flight: string; // Bipedal locomotion mode
    osteologicalCompleteness: number; // 0-100 percentage
  };
}

export interface SiteMarker {
  name: string;
  lat: number;
  lng: number;
  id: string;
}

export interface PaleoStat {
  label: string;
  value: string;
  subtext: string;
  iconType: 'era' | 'geology' | 'discovery' | 'status';
}

export interface PaleoFeature {
  name: string;
  description: string;
  category: 'skull' | 'skeleton' | 'burial' | 'footprint' | 'environment';
}

export interface MapStyleConfig {
  featureType?: string;
  elementType?: string;
  stylers: Array<{ [key: string]: string | number | boolean }>;
}
