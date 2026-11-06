import { PaleoData, SiteMarker } from "../types";
import { HomininDatabaseEntry, findLocalAncestor } from "../data/ancestorData";

/** Static build: everything comes from the bundled curated database. No network calls. */
export const fetchSitesForQuery = async (query: string): Promise<SiteMarker[]> => {
  const ancestor: HomininDatabaseEntry | null = findLocalAncestor(query);
  if (!ancestor) return [];
  return ancestor.sites.map((site, index) => ({
    name: site.name,
    lat: site.coordinates.lat,
    lng: site.coordinates.lng,
    id: `${ancestor.name.replace(/\s/g, "-")}-${index}`,
  }));
};

export const fetchPaleoData = async (siteName: string, speciesName: string): Promise<PaleoData | null> => {
  const ancestor = findLocalAncestor(speciesName);
  if (!ancestor) return null;
  const site = ancestor.sites.find((s) => s.name === siteName) || ancestor.sites[0];
  return {
    name: site.name,
    commonName: ancestor.commonName,
    temporalRange: ancestor.temporalRange,
    epoch: ancestor.epoch,
    cranialCapacity: ancestor.cranialCapacity,
    locomotion: ancestor.locomotion,
    materialCulture: ancestor.materialCulture,
    burialTradition: ancestor.burialTradition,
    reconstructionUrl: "",
    coordinates: site.coordinates,
    summary: ancestor.summary,
    geologicalContext: site.geologicalContext,
    stats: site.stats,
    metadata: ancestor.metadata,
    features: site.inventory,
  };
};

export const generateTaxaBlueprint = async (_taxaName: string): Promise<string> => "";
