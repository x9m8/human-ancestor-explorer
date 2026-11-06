import { PaleoData, SiteMarker } from "../types";
import { ANCESTOR_DB, HomininDatabaseEntry, getArchivalReconstruction } from "../data/ancestorData";

// In-memory cache to prevent redundant API calls for the same taxa/sites
const reconstructionCache: Record<string, string> = {};
const homininDataCache: Record<string, HomininDatabaseEntry> = {};

/**
 * Generic retry wrapper for API calls to handle transient network errors.
 */
const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 2, initialDelay = 1500): Promise<T> => {
  let lastError: any;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message?.toLowerCase() || "";
      const isQuotaError =
        errorMsg.includes("429") ||
        error?.status === 429 ||
        errorMsg.includes("exhausted") ||
        errorMsg.includes("quota");

      // For quota errors, fail fast so client can serve fallback without long pauses
      if (isQuotaError) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * (attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

/**
 * Helper to match an ancestor from local database by species name or common name.
 */
export const findLocalAncestor = (query: string): HomininDatabaseEntry | null => {
  const q = query.toLowerCase().trim();
  return (
    ANCESTOR_DB.find((a) => a.name.toLowerCase() === q) ||
    ANCESTOR_DB.find((a) => a.commonName.toLowerCase() === q) ||
    ANCESTOR_DB.find((a) => a.name.toLowerCase().includes(q) || a.commonName.toLowerCase().includes(q)) ||
    null
  );
};

/**
 * GEMINI API (Server-side proxy): Fetches live structured data for a specific human ancestor.
 */
export const generateLiveAncestorData = async (query: string): Promise<HomininDatabaseEntry | null> => {
  const normalizedQuery = query.toLowerCase().trim();
  if (homininDataCache[normalizedQuery]) {
    return homininDataCache[normalizedQuery];
  }

  return withRetry(async () => {
    const response = await fetch("/api/ancestor-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${response.status}`);
    }

    const result = await response.json();
    if (result?.data) {
      homininDataCache[normalizedQuery] = result.data as HomininDatabaseEntry;
      return result.data as HomininDatabaseEntry;
    }
    return null;
  });
};

// Backwards compatibility alias
export const generateLiveDinosaurData = generateLiveAncestorData;

/**
 * GEMINI API (with local fallback): Finds site markers for a specific human ancestor.
 */
export const fetchSitesForQuery = async (query: string): Promise<SiteMarker[]> => {
  let ancestor: HomininDatabaseEntry | null = null;
  try {
    ancestor = await generateLiveAncestorData(query);
  } catch (err) {
    console.warn("Live ancestor data fetch failed, using local offline database fallback", err);
  }

  if (!ancestor) {
    ancestor = findLocalAncestor(query);
  }

  if (!ancestor) return [];

  return ancestor.sites.map((site, index) => ({
    name: site.name,
    lat: site.coordinates.lat,
    lng: site.coordinates.lng,
    id: `${ancestor!.name.replace(/\s/g, "-")}-${index}`,
  }));
};

/**
 * GEMINI API (with local fallback): Retrieves full PaleoData for a hominin & excavation site combo.
 */
export const fetchPaleoData = async (siteName: string, speciesName: string): Promise<PaleoData | null> => {
  let ancestor: HomininDatabaseEntry | null = null;
  try {
    ancestor = await generateLiveAncestorData(speciesName);
  } catch (err) {
    console.warn("Live ancestor data fetch failed, using local offline database fallback", err);
  }

  if (!ancestor) {
    ancestor = findLocalAncestor(speciesName);
  }

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
    reconstructionUrl: ancestor.reconstructionUrl || getArchivalReconstruction(ancestor.name),
    coordinates: site.coordinates,
    summary: ancestor.summary,
    geologicalContext: site.geologicalContext,
    stats: site.stats,
    metadata: ancestor.metadata,
    features: site.inventory,
  };
};

/**
 * GEMINI API (Server-side proxy with Archival museum fallback):
 * Fetches or generates a forensic facial/anatomical reconstruction portrait.
 */
export const generateTaxaBlueprint = async (taxaName: string): Promise<string> => {
  if (reconstructionCache[taxaName]) {
    return reconstructionCache[taxaName];
  }

  const fallback = getArchivalReconstruction(taxaName);

  try {
    const result = await withRetry(async () => {
      const response = await fetch("/api/ancestor-reconstruction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taxaName }),
      });

      if (!response.ok) {
        return { url: fallback };
      }

      return await response.json();
    }, 1, 500);

    const finalUrl = result?.url || fallback;
    reconstructionCache[taxaName] = finalUrl;
    return finalUrl;
  } catch (err) {
    console.info("Using archival museum reconstruction for:", taxaName);
    reconstructionCache[taxaName] = fallback;
    return fallback;
  }
};
