/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { getArchivalReconstruction, findLocalAncestor } from "./data/ancestorData";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  const handleAncestorDataRequest = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      const { query } = req.body || {};
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Missing query parameter." });
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return res.json({
          data: findLocalAncestor(query),
          isLocal: true,
          message: "Using curated offline paleoanthropological database."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const promptConfig = {
        contents: {
          parts: [
            {
              text: `Act as a world-leading paleoanthropologist and archaeological database specialist for the "Human Ancestor Explorer by x9m8". Provide comprehensive, factually accurate scientific information for the fossil hominin, human ancestor, or prehistoric human species: "${query}". Include its taxonomy, common name, temporal range, cranial capacity (cc), bipedal locomotion, material culture / stone tool industry, and burial / mortuary traditions (e.g. intentional burials, grave goods, ochre, cave chamber body caching, or absence thereof). Include a comprehensive scientific summary and all major archaeological & fossil sites where remains, burials, or lithic assemblages have been discovered (must be factually true, with a minimum of 4-5 sites). For each site, include highly specific geographic coordinates, geological context, inventory of features (skulls, burials, footprints, tools), and stats.`,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Formal taxon name (e.g. Homo neanderthalensis)" },
              commonName: { type: Type.STRING, description: "Common name (e.g. Neanderthal, Turkana Boy, Lucy)" },
              temporalRange: { type: Type.STRING, description: "Chronological age range (e.g. 430,000 – 40,000 Years Ago)" },
              cranialCapacity: { type: Type.STRING, description: "Brain volume in cc" },
              locomotion: { type: Type.STRING, description: "Bipedal gait and postural adaptation" },
              materialCulture: { type: Type.STRING, description: "Lithic mode and tool industry" },
              burialTradition: { type: Type.STRING, description: "Mortuary and funerary practices" },
              summary: { type: Type.STRING, description: "A detailed scientific summary of the ancestor." },
              metadata: {
                type: Type.OBJECT,
                properties: {
                  threatLevel: { type: Type.STRING, description: "Ecological role / social foraging status" },
                  threatScore: { type: Type.INTEGER, description: "1-5 scale" },
                  diet: { type: Type.STRING },
                  packBehavior: { type: Type.STRING, description: "Band / clan social structure" },
                  integument: { type: Type.STRING, description: "Body hair and tailored hide clothing" },
                  flight: { type: Type.STRING, description: "Bipedal locomotion description" },
                  osteologicalCompleteness: { type: Type.INTEGER, description: "0-100 percentage" },
                },
                required: [
                  "threatLevel",
                  "threatScore",
                  "diet",
                  "packBehavior",
                  "integument",
                  "flight",
                  "osteologicalCompleteness",
                ],
              },
              sites: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of the fossil excavation site or cave" },
                    coordinates: {
                      type: Type.OBJECT,
                      properties: {
                        lat: { type: Type.NUMBER },
                        lng: { type: Type.NUMBER },
                      },
                      required: ["lat", "lng"],
                    },
                    geologicalContext: {
                      type: Type.OBJECT,
                      properties: {
                        era: { type: Type.STRING },
                        period: { type: Type.STRING },
                        climate: { type: Type.STRING },
                        age: { type: Type.STRING },
                      },
                      required: ["era", "period", "climate", "age"],
                    },
                    inventory: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          description: { type: Type.STRING },
                          category: {
                            type: Type.STRING,
                            enum: ["skull", "skeleton", "burial", "footprint", "environment"],
                          },
                        },
                        required: ["name", "description", "category"],
                      },
                    },
                    stats: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          label: { type: Type.STRING },
                          value: { type: Type.STRING },
                          subtext: { type: Type.STRING },
                          iconType: {
                            type: Type.STRING,
                            enum: ["era", "geology", "discovery", "status"],
                          },
                        },
                        required: ["label", "value", "subtext", "iconType"],
                      },
                    },
                  },
                  required: ["name", "coordinates", "geologicalContext", "inventory", "stats"],
                },
              },
            },
            required: ["name", "summary", "metadata", "sites"],
          },
        },
      };

      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          ...promptConfig,
        });
      } catch (err: any) {
        console.warn("gemini-3.8-flash call failed, trying gemini-3.1-flash-lite:", err?.message || err);
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            ...promptConfig,
          });
        } catch (innerErr: any) {
          console.warn("Live API unavailable, serving verified local hominin record for:", query);
          return res.json({ data: findLocalAncestor(query), isLocal: true });
        }
      }

      const resultText = response.text;
      if (resultText) {
        const parsed = JSON.parse(resultText);
        return res.json({ data: parsed });
      }
      return res.json({ data: findLocalAncestor(query), isLocal: true });
    } catch (error: any) {
      console.warn("[Backend] Serving local database fallback for query:", req.body?.query);
      return res.json({ data: findLocalAncestor(req.body?.query || "Homo neanderthalensis"), isLocal: true });
    }
  };

  app.post("/api/dinosaur-data", handleAncestorDataRequest);
  app.post("/api/ancestor-data", handleAncestorDataRequest);

  const handleReconstructionRequest = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      const { taxaName } = req.body || {};
      if (!taxaName || typeof taxaName !== "string") {
        return res.status(400).json({ error: "Missing taxaName parameter." });
      }

      const archivalFallback = getArchivalReconstruction(taxaName);

      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return res.json({ url: archivalFallback, isArchival: true, message: "No API key configured, using archival reconstruction." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const promptText = `A scientifically rigorous, photorealistic forensic facial and anatomical reconstruction of the prehistoric human ancestor: "${taxaName}". Depicted as a lifelike, photorealistic portrait or upper bust profile created by an expert forensic paleoanthropologist (in the style of renowned scientific paleoartists John Gurche and Elisabeth Daynès). Shows anatomically correct hominin cranial morphology, brow ridge structure (supraorbital torus), facial prognathism, authentic lifelike eye expression, realistic skin texture and natural skin tones, and hominin hair growth patterns based on current paleoanthropological fossil crania. Set against a clean, plain solid neutral white #ffffff background with natural museum lighting. No modern clothes, no distortion, no text, no borders.`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [
              {
                text: promptText,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1",
            },
          },
        });
      } catch (err: any) {
        console.warn("[Backend] Image generation unavailable on current tier, serving verified museum reconstruction for:", taxaName);
        return res.json({ url: archivalFallback, isArchival: true });
      }

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const mimeType = part.inlineData.mimeType || "image/png";
          const base64Data = `data:${mimeType};base64,${part.inlineData.data}`;
          return res.json({ url: base64Data, isArchival: false });
        }
      }
      return res.json({ url: archivalFallback, isArchival: true });
    } catch (error: any) {
      const taxa = req.body?.taxaName || "homo";
      console.warn("[Backend] Reconstruction request handled via archival fallback:", error?.message || error);
      return res.json({ url: getArchivalReconstruction(taxa), isArchival: true });
    }
  };

  app.post("/api/taxa-blueprint", handleReconstructionRequest);
  app.post("/api/ancestor-reconstruction", handleReconstructionRequest);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Backend] Server running on http://localhost:${PORT}`);
  });
}

startServer();
