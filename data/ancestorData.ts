import { PaleoData, SiteMarker } from "../types";

export interface HomininDatabaseEntry {
  name: string;
  commonName: string;
  temporalRange: string;
  epoch: string;
  cranialCapacity: string;
  locomotion: string;
  materialCulture: string;
  burialTradition: string;
  summary: string;
  reconstructionUrl?: string;
  metadata: {
    threatLevel: string; // Used for Ecological/Predator role e.g. "Apex Forager", "Scavenger/Forager", "Social Hunter"
    threatScore: number; // 1-5 scale
    diet: string;
    packBehavior: string; // Social band structure
    integument: string; // Body hair / clothing
    flight: string; // Locomotion mode: "Obligate Bipedal", "Facultative Bipedal", etc.
    osteologicalCompleteness: number; // 0-100 percentage
  };
  sites: {
    name: string;
    coordinates: { lat: number; lng: number };
    geologicalContext: { era: string; period: string; climate: string; age: string };
    inventory: {
      name: string;
      description: string;
      category: 'skull' | 'skeleton' | 'burial' | 'footprint' | 'environment';
    }[];
    stats: {
      label: string;
      value: string;
      subtext: string;
      iconType: 'era' | 'geology' | 'discovery' | 'status';
    }[];
  }[];
}

// Static build: no external reconstruction images (their sources could not be verified).
export const getArchivalReconstruction = (_taxa: string): string => "";

export const findLocalAncestor = (query: string): HomininDatabaseEntry | null => {
  const q = query.toLowerCase().trim();
  return (
    ANCESTOR_DB.find((a) => a.name.toLowerCase() === q) ||
    ANCESTOR_DB.find((a) => a.commonName.toLowerCase() === q) ||
    ANCESTOR_DB.find((a) => a.name.toLowerCase().includes(q) || a.commonName.toLowerCase().includes(q)) ||
    ANCESTOR_DB[0]
  );
};

export const ANCESTOR_DB: HomininDatabaseEntry[] = [
  {
    name: "Homo neanderthalensis",
    commonName: "Neanderthal",
    temporalRange: "430,000 – 40,000 Years Ago",
    epoch: "Middle to Late Pleistocene",
    cranialCapacity: "1,450 – 1,650 cc (Exceeding modern human average)",
    locomotion: "Obligate Bipedalism (Robust, Cold-Adapted Stature)",
    materialCulture: "Mousterian Lithic Industry (Mode 3, Levallois technique), Ochre & Pigments, Eagle Talon Ornaments",
    burialTradition: "Deliberate Intentional Burials, Flexed Body Placement, Grave Offerings & Flower Pollen Deposits",
    summary: "Our closest extinct human relative. Neanderthals possessed stocky, cold-adapted anatomies, pronounced brow ridges, and brains slightly larger than modern humans. They mastered fire, synthesized birch-tar pitch glue, cared for elderly and injured band members, decorated themselves with raptor feathers and marine shells, and ritually buried their deceased.",
    metadata: {
      threatLevel: "APEX COOPERATIVE HUNTER",
      threatScore: 4,
      diet: "Big-Game Carnivore (Mammoth, Woolly Rhino, Steppe Bison) & Cooked Tubers",
      packBehavior: "Close-Knit Foraging Bands (15–30 Kin Individuals)",
      integument: "Tailored Hide Clothing, Neanderthal Pigmentation Variants (Red/Fair Hair)",
      flight: "Obligate Terrestrial Striding Biped",
      osteologicalCompleteness: 94
    },
    sites: [
      {
        name: "Shanidar Cave, Zagros Mountains, Iraq",
        coordinates: { lat: 36.8333, lng: 44.2167 },
        geologicalContext: { era: "Cenozoic", period: "Late Pleistocene", climate: "Montane Semi-Arid Steppe", age: "65,000 – 50,000 BP" },
        inventory: [
          { name: "Shanidar 4 'Flower Burial'", description: "Articulated flexed skeleton excavated alongside dense clusters of wild yarrow, cornflower, and grape hyacinth pollen clusters.", category: "burial" },
          { name: "Shanidar 1 'Nandy' Cranium & Skeleton", description: "Severely impaired older male showing healed cranial trauma, blindness in one eye, and amputated forearm—conclusive evidence of extensive social compassion and communal care.", category: "skull" },
          { name: "Shanidar Z Crushed Skull", description: "Articulated upper torso and flattened cranium recovered within a deliberate funerary trench.", category: "skeleton" }
        ],
        stats: [
          { label: "CRANIAL CAPACITY", value: "1,525 cc", subtext: "Shanidar 1 Cranium", iconType: "status" },
          { label: "BURIAL TYPE", value: "Intentional Grave Shaft", subtext: "Bedded in limestone trench", iconType: "discovery" },
          { label: "MORTUARY OCHRE", value: "Confirmed", subtext: "Associated floral & mineral deposits", iconType: "geology" }
        ]
      },
      {
        name: "La Chapelle-aux-Saints, Corrèze, France",
        coordinates: { lat: 44.9861, lng: 1.7214 },
        geologicalContext: { era: "Cenozoic", period: "Late Pleistocene (Würm Glaciation)", climate: "Cold Sub-Arctic Tundra", age: "~47,000–60,000 BP (published estimates)" },
        inventory: [
          { name: "The 'Old Man' of La Chapelle (LCS 1)", description: "Articulated skeleton that excavators read as an intentional burial in a shallow pit; a 2015 reanalysis argues the evidence is not unequivocal.", category: "burial" },
          { name: "Heavily Worn Mandible & Calvarium", description: "Jaw that had lost most of its teeth, with severe arthritis; later studies suggest he could probably still chew, with difficulty.", category: "skull" },
          { name: "Mousterian Side-Scrapers & Bovid Bones", description: "Flint tools and unburned reindeer/bison limbs placed directly above the burial cut.", category: "environment" }
        ],
        stats: [
          { label: "CRANIAL VOLUME", value: "1,620 cc", subtext: "Massive occipital bun", iconType: "status" },
          { label: "GRAVE CUT", value: "Possible Grave Pit", subtext: "Excavators' reading; debated", iconType: "discovery" },
          { label: "AGE AT DEATH", value: "Older Adult", subtext: "Age estimates vary by study", iconType: "era" }
        ]
      },
      {
        name: "Kebara Cave, Mount Carmel, Israel",
        coordinates: { lat: 32.5583, lng: 34.9333 },
        geologicalContext: { era: "Cenozoic", period: "Late Pleistocene", climate: "Mediterranean Woodland", age: "60,000 BP" },
        inventory: [
          { name: "Kebara 2 (Moshe) Skeleton & Hyoid Bone", description: "Most complete Neanderthal postcranial skeleton ever discovered, preserving a hyoid bone virtually identical to a modern human's.", category: "skeleton" },
          { name: "Deliberate Funerary Cut", description: "Read as an intentional burial; the skull was missing, possibly removed after decomposition. That interpretation has been questioned.", category: "burial" },
          { name: "Levallois Points & Ash Hearths", description: "Deep stratigraphic hearth layers showing sustained cooking of tortoises, fallow deer, and wild legumes.", category: "environment" }
        ],
        stats: [
          { label: "SPEECH ANATOMY", value: "Modern-Like Hyoid", subtext: "Speech implications still debated", iconType: "status" },
          { label: "SKELETAL COMPLETENESS", value: "Exceptionally Complete", subtext: "Torso & pelvis", iconType: "discovery" },
          { label: "HEARTH STRATA", value: "Stratified Ash Layers", subtext: "Repeated fire use", iconType: "geology" }
        ]
      },
      {
        name: "Neander Valley (Feldhofer Cave), Germany",
        coordinates: { lat: 51.2267, lng: 6.9458 },
        geologicalContext: { era: "Cenozoic", period: "Late Pleistocene", climate: "Glacial Forest-Steppe", age: "40,000 BP" },
        inventory: [
          { name: "Neanderthal 1 Holotype Calotte", description: "The iconic original skullcap discovered in 1856 with prominent continuous brow ridge (torus supraorbitalis).", category: "skull" },
          { name: "Femora & Humeral Diaphyses", description: "Extremely thick cortical bone indicating heavy muscular loads and cold adaptation.", category: "skeleton" }
        ],
        stats: [
          { label: "TYPE SPECIMEN", value: "Holotype 1856", subtext: "Founded paleoanthropology", iconType: "discovery" },
          { label: "CORTICAL THICKNESS", value: "Thick-Walled Long Bones", subtext: "Heavy build", iconType: "status" },
          { label: "DATING", value: "40,000 BP (AMS 14C)", subtext: "Final Neanderthal era", iconType: "era" }
        ]
      },
      {
        name: "Krapina Rock Shelter, Croatia",
        coordinates: { lat: 46.1606, lng: 15.8753 },
        geologicalContext: { era: "Cenozoic", period: "Late Pleistocene (Eemian Interglacial)", climate: "Warm Temperate Woodland", age: "130,000 BP" },
        inventory: [
          { name: "Krapina Dental & Cranial Remains (800+ fragments)", description: "Remains of dozens of individuals; cutmarks have been read as secondary mortuary treatment, a reading that is debated.", category: "burial" },
          { name: "White-Tailed Eagle Talon Jewelry", description: "Eight talons from at least three white-tailed eagles, about 130,000 years old; the authors suggest they formed a single piece, possibly a necklace.", category: "environment" }
        ],
        stats: [
          { label: "INDIVIDUAL COUNT", value: "Dozens of Individuals", subtext: "A large Neanderthal sample", iconType: "discovery" },
          { label: "SYMBOLIC ORNAMENT", value: "Eagle Talon Ornament", subtext: "Possible necklace, ~130,000 years old", iconType: "status" },
          { label: "MORTUARY CUTMARKS", value: "Cutmarks Present", subtext: "Interpretation debated", iconType: "geology" }
        ]
      }
    ]
  },
  {
    name: "Homo sapiens (Early Modern Humans)",
    commonName: "Early Homo sapiens",
    temporalRange: "315,000 Years Ago – Present",
    epoch: "Middle Pleistocene to Holocene",
    cranialCapacity: "1,350 – 1,500 cc (High, globular braincase with vertical forehead & chin)",
    locomotion: "Obligate Bipedalism (Slender, gracile, highly efficient long-distance endurance running)",
    materialCulture: "Upper Paleolithic Blade Tech (Mode 4), Bone/Ivory Needles, Spearthrowers (Atlatl), Cave Art & Ochre",
    burialTradition: "Elaborate Ritually Staged Burials with Thousands of Perforated Beads, Red Ochre, Mammoths Tusks, and Grave Goods",
    summary: "Anatomically modern humans emerged in Africa around 315,000 years ago. Defined by a gracile skeleton, globularized cranium, distinctive mental prominence (chin), and unparalleled cognitive plasticity. Early Homo sapiens pioneered complex figurative art, composite tools, widespread red ochre ceremonialism, and deeply symbolic funerary architecture with extraordinary grave goods.",
    metadata: {
      threatLevel: "COGNITIVE APEX SPECIES",
      threatScore: 5,
      diet: "Omnivorous (High dietary breadth: marine foods, wild cereals, tubers, megafauna)",
      packBehavior: "Regional Macro-Bands (Exchange Networks & Symbolic Clans)",
      integument: "Sweat-Gland Dense Skin, Complex Tailored Clothing with Awls & Needles",
      flight: "High-Efficiency Striding & Long-Distance Endurance Runner",
      osteologicalCompleteness: 98
    },
    sites: [
      {
        name: "Jebel Irhoud, Morocco",
        coordinates: { lat: 31.8542, lng: -8.8719 },
        geologicalContext: { era: "Cenozoic", period: "Middle Pleistocene", climate: "Semi-Arid Savanna Mosaic", age: "315,000 BP (Thermoluminescence)" },
        inventory: [
          { name: "Irhoud 10 Cranium & Mandibles", description: "Among the oldest securely dated Homo sapiens fossils (about 315,000 years, ±34,000), with a modern-looking face under an elongated braincase. The species attribution is debated.", category: "skull" },
          { name: "Prepared Levallois Flints (Fire-Heated)", description: "Flint blades deliberately tempered with fire, enabling precise thermoluminescence dating.", category: "environment" }
        ],
        stats: [
          { label: "OLDEST H. SAPIENS", value: "315,000 BP", subtext: "Pushes origin back 100ka", iconType: "discovery" },
          { label: "FACIAL MORPHOLOGY", value: "Fully Modern", subtext: "Tucked-in face beneath brow", iconType: "status" },
          { label: "HEAT-TREATED FLINTS", value: "Many Heated Flints", subtext: "Used to date the site", iconType: "geology" }
        ]
      },
      {
        name: "Sungir, Vladimir Oblast, Russia",
        coordinates: { lat: 56.1764, lng: 40.5058 },
        geologicalContext: { era: "Cenozoic", period: "Upper Paleolithic (Gravettian)", climate: "Glacial Mammoth-Steppe", age: "34,000 – 30,000 BP" },
        inventory: [
          { name: "Sungir 1 Adult Male Regal Burial", description: "Skeleton buried in thick red ochre bed, adorned with about 3,000 mammoth-ivory beads and pierced fox canines.", category: "burial" },
          { name: "Sungir 2 & 3 Juvenile Double Burial", description: "Head-to-head grave of two adolescents with 10,000 perforated ivory beads, straight 2.4-meter mammoth-tusk spears, and carved antler figurines.", category: "burial" },
          { name: "Polished Ivory Carvings & Needles", description: "Magnificent ivory disk pendants and fine eye needles illustrating tailored leather cold-weather parkas.", category: "environment" }
        ],
        stats: [
          { label: "GRAVE BEAD COUNT", value: "13,000+ Ivory Beads", subtext: "Thousands of labor hours", iconType: "status" },
          { label: "BURIAL POSTURE", value: "Head-to-Head Extended", subtext: "Ritually staged funerary bed", iconType: "discovery" },
          { label: "MAMMOTH TUSK LANCES", value: "2.4m Straightened", subtext: "Advanced ivory steaming", iconType: "geology" }
        ]
      },
      {
        name: "Qafzeh Cave, Lower Galilee, Israel",
        coordinates: { lat: 32.6847, lng: 35.3028 },
        geologicalContext: { era: "Cenozoic", period: "Late Pleistocene", climate: "Mediterranean Oak-Pistachio Wooded Steppe", age: "100,000 – 90,000 BP" },
        inventory: [
          { name: "Qafzeh 11 Child Burial with Fallow Deer Antlers", description: "A boy of about 12–13 buried in a grave cut with fallow deer antlers beside his chest, likely an offering.", category: "burial" },
          { name: "Qafzeh 9 & 10 Double Burial", description: "A young adult and a child buried together.", category: "burial" },
          { name: "Red Ochre Stained Glycymeris Marine Shells", description: "Glycymeris shells from the coast about 35 km away; naturally perforated, some with stringing wear and a few ochre-stained.", category: "environment" }
        ],
        stats: [
          { label: "BURIAL AGE", value: "~92,000–100,000 BP", subtext: "Burial with a deer-antler offering", iconType: "discovery" },
          { label: "GRAVE OFFERINGS", value: "Fallow Deer Antlers", subtext: "Clutched over chest", iconType: "status" },
          { label: "OCHRE SHELLS", value: "Perforated Shells", subtext: "Possible personal ornaments", iconType: "geology" }
        ]
      },
      {
        name: "Omo Kibish, Lower Omo Valley, Ethiopia",
        coordinates: { lat: 5.4042, lng: 35.9325 },
        geologicalContext: { era: "Cenozoic", period: "Late Middle Pleistocene", climate: "Fluvio-Lacustrine Delta Basin", age: "At least ~233,000 BP" },
        inventory: [
          { name: "Omo I Cranium & Postcrania", description: "Remarkably modern skeletal remain with prominent chin, canine fossa, and tall vault, confirming ancient East African modern human roots.", category: "skull" },
          { name: "Omo II Thick Cranial Vault", description: "A companion specimen exhibiting somewhat more archaic cranial contouring, illustrating early polymorphic population variation.", category: "skeleton" }
        ],
        stats: [
          { label: "RADIOISOTOPE AGE", value: "≥ ~233,000 years", subtext: "Minimum age from an ash layer above the fossils", iconType: "era" },
          { label: "CHIN FORMATION", value: "Mental Protuberance", subtext: "Diagnostic of modern Homo sapiens", iconType: "status" },
          { label: "VALLEY STRATA", value: "Member I Member III", subtext: "Lake Turkana tectonic rift", iconType: "geology" }
        ]
      },
      {
        name: "Cro-Magnon Rock Shelter, Les Eyzies, France",
        coordinates: { lat: 44.9367, lng: 1.0156 },
        geologicalContext: { era: "Cenozoic", period: "Upper Paleolithic", climate: "Periglacial Steppe", age: "~28,000 BP (radiocarbon)" },
        inventory: [
          { name: "Cro-Magnon 1 'The Old Man' Cranium", description: "Iconic cranium with rectangular eye orbits and a steep forehead; bone lesions on the skull have been attributed to several possible causes, still debated.", category: "skull" },
          { name: "Perforated Littorina Shells", description: "300 pierced marine shells used as burial shrouds or headdresses.", category: "burial" }
        ],
        stats: [
          { label: "CRANIAL VOLUME", value: "~1,590 cc", subtext: "High European vault", iconType: "status" },
          { label: "DISCOVERY YEAR", value: "1868", subtext: "Named the European Upper Paleolithic", iconType: "discovery" },
          { label: "LITHIC BLADES", value: "Mode 4 Prismatic", subtext: "Fine flint tool blades", iconType: "geology" }
        ]
      }
    ]
  },
  {
    name: "Homo erectus",
    commonName: "Peking Man / Turkana Boy / Java Man",
    temporalRange: "1.9 Million – 110,000 Years Ago",
    epoch: "Early to Late Pleistocene",
    cranialCapacity: "850 – 1,150 cc (Expanded brain with sagittal keel & thick skull bones)",
    locomotion: "Obligate Bipedalism (Modern human body proportions, tall, narrow pelvis)",
    materialCulture: "Acheulean Handaxes & Cleavers (Mode 2 Bifaces), Mastery of Fire, Ocean Rafting to Islands",
    burialTradition: "No Formal Graves Known; Caching & Sheltered Accumulations, Ochre Modification",
    summary: "The first hominin to leave Africa and conquer Eurasia, ranging from the Republic of Georgia to Java. Homo erectus possessed modern body proportions adapted for endurance running, invented symmetrical Acheulean tear-drop handaxes, harnessed the power of fire for cooking, and survived for nearly two million years—longer than any other human species in history.",
    metadata: {
      threatLevel: "COOPERATIVE PURSUIT PREDATOR",
      threatScore: 4,
      diet: "Omnivorous with Heavy Meat Consumption (Marrow processing & cooked tubers)",
      packBehavior: "Organized Multi-Family Bands with Camp Hearth Centering",
      integument: "Extensive Hair Loss with Thermoregulatory Sweating",
      flight: "Fully Obligate Striding Biped (Endurance pursuit running)",
      osteologicalCompleteness: 92
    },
    sites: [
      {
        name: "Nariokotome, West Turkana, Kenya",
        coordinates: { lat: 4.1333, lng: 35.8667 },
        geologicalContext: { era: "Cenozoic", period: "Early Pleistocene", climate: "Lacustrine Savanna Shoreline", age: "1.6 Million Years Ago" },
        inventory: [
          { name: "Turkana Boy (KNM-WT 15000)", description: "Among the most complete early Homo skeletons (108 bones), from an adolescent boy (age estimates range from about 8 to 12) who stood roughly 154–160 cm.", category: "skeleton" },
          { name: "Complete Pelvic & Femoral Grid", description: "Narrow pelvic aperture and elongated femoral neck showing modern biomechanical striding bipedalism.", category: "skeleton" },
          { name: "Cranial Vault KNM-WT 15000", description: "Braincase volume of 880 cc, projected to reach 910 cc at adulthood.", category: "skull" }
        ],
        stats: [
          { label: "SKELETAL COMPLETENESS", value: "Very Complete", subtext: "Among the best-preserved early Homo skeletons", iconType: "discovery" },
          { label: "ESTIMATED STATURE", value: "1.60 m (5 ft 3 in)", subtext: "Modern human proportions", iconType: "status" },
          { label: "DATING", value: "1.6 Ma (40Ar/39Ar)", subtext: "KBS Tuff correlation", iconType: "era" }
        ]
      },
      {
        name: "Dmanisi, Kvemo Kartli, Georgia",
        coordinates: { lat: 41.3325, lng: 44.3411 },
        geologicalContext: { era: "Cenozoic", period: "Early Pleistocene", climate: "Temperate Caucasian Forest & River Basin", age: "1.8 Million Years Ago" },
        inventory: [
          { name: "Dmanisi Skull 5 (D4500 cranium + D2600 jaw)", description: "World's only completely preserved adult early Homo skull, showcasing a tiny 546 cc braincase paired with a huge prognathic face.", category: "skull" },
          { name: "D3444/D3900 Toothless Elder", description: "Cranium with complete resorption of dental alveoli; the individual lived years without teeth, fed by group care.", category: "skull" },
          { name: "Oldowan Choppers & Saber-Tooth Remains", description: "Stone flakes excavated among carcasses of Megantereon and giant cheetahs.", category: "environment" }
        ],
        stats: [
          { label: "FIRST OUT OF AFRICA", value: "1.8 Million Years", subtext: "Oldest hominin outside Africa", iconType: "discovery" },
          { label: "CRANIAL RANGE", value: "546 – 775 cc", subtext: "Proves massive early variation", iconType: "status" },
          { label: "COMPASSION CARE", value: "Edentulous Elder", subtext: "Fed by kin without teeth", iconType: "geology" }
        ]
      },
      {
        name: "Zhoukoudian (Dragon Bone Hill), Beijing, China",
        coordinates: { lat: 39.6869, lng: 115.8453 },
        geologicalContext: { era: "Cenozoic", period: "Middle Pleistocene", climate: "Temperate Steppe-Woodland with Cold Winters", age: "~770,000 – 230,000 BP" },
        inventory: [
          { name: "Peking Man Calvaria & Mandibles (Sinanthropus)", description: "About 40 individuals recovered from Locality 1 cave infills displaying pronounced sagittal keeling and thick cranial bone.", category: "skull" },
          { name: "Burnt-Looking Bone & Ash-Like Deposits", description: "Once read as evidence of early fire use; a 1998 reanalysis found no hearths, ash or charcoal in the sampled layers.", category: "environment" },
          { name: "Quartz Chopping Tools & Scrapers", description: "Thousands of vein quartz flakes used to butcher sika deer and steppe bison.", category: "environment" }
        ],
        stats: [
          { label: "BRAIN VOLUME", value: "1,040 cc", subtext: "Average of Peking specimens", iconType: "status" },
          { label: "HEARTH THICKNESS", value: "Fire Use Debated", subtext: "Reanalysis questions the hearths", iconType: "geology" },
          { label: "INDIVIDUAL COUNT", value: "~40 Individuals", subtext: "Most fossils since lost", iconType: "discovery" }
        ]
      },
      {
        name: "Trinil, Solo River, Java, Indonesia",
        coordinates: { lat: -7.3756, lng: 111.3592 },
        geologicalContext: { era: "Cenozoic", period: "Early/Middle Pleistocene", climate: "Tropical Volcanic Riverine Lowlands", age: "Shell engraving ~540,000–430,000 years ago" },
        inventory: [
          { name: "Trinil 2 Calvarium ('Java Man')", description: "The landmark 1891 discovery by Eugène Dubois that demonstrated human origins occurred in deep prehistory.", category: "skull" },
          { name: "Trinil Femur I", description: "Pathological modern-looking bipedal femur that inspired Dubois to coin the name Pithecanthropus erectus.", category: "skeleton" },
          { name: "Pseudodon Shell with Zigzag Engraving", description: "Freshwater mussel shell with a zigzag engraving dated to roughly 540,000–430,000 years ago; in experiments a shark tooth matched the marks best.", category: "environment" }
        ],
        stats: [
          { label: "GEOMETRIC ENGRAVING", value: "~540,000–430,000 BP", subtext: "Zigzag geometric engraving", iconType: "status" },
          { label: "HISTORIC DISCOVERY", value: "Dubois 1891", subtext: "First fossil human ever sought", iconType: "discovery" },
          { label: "ISLAND HABITAT", value: "Volcanic Solo River", subtext: "Sunda shelf land bridge", iconType: "geology" }
        ]
      }
    ]
  },
  {
    name: "Homo heidelbergensis",
    commonName: "Heidelberg Man / Rhodesian Man",
    temporalRange: "600,000 – 200,000 Years Ago",
    epoch: "Middle Pleistocene (Chibanian)",
    cranialCapacity: "1,100 – 1,300 cc (Large robust braincase, arching double-torus brow)",
    locomotion: "Obligate Bipedalism (Tall, heavily muscled, deep thoracic cavity)",
    materialCulture: "Acheulean Mode 2 Handaxes, Prepared Levallois Flaking, Aerodynamic Wooden Javelins (Schöningen)",
    burialTradition: "Possible Deliberate Body Accumulation (Sima de los Huesos 'Pit of Bones'); interpretation debated",
    summary: "A Middle Pleistocene human whose place in our family tree is debated: some researchers place it near the ancestry of Neanderthals, Denisovans and modern humans, but the Sima de los Huesos fossils fall in the Neanderthal lineage. Associated sites include Schöningen, where spruce throwing spears were found (attribution to this species is inferred), and Sima de los Huesos, where at least 29 individuals lie at the bottom of a deep shaft next to a quartzite handaxe. Whether the bodies were placed there deliberately is still debated.",
    metadata: {
      threatLevel: "BIG-GAME APEX HUNTER",
      threatScore: 4,
      diet: "Carnivorous (Horse, Red Deer, Steppe Rhino butcher marks on bones)",
      packBehavior: "Large Cooperative Hunting Bands",
      integument: "Primitive Cloaks & Warm Season Exposure",
      flight: "Obligate Terrestrial Striding Biped",
      osteologicalCompleteness: 90
    },
    sites: [
      {
        name: "Sima de los Huesos (Atapuerca), Spain",
        coordinates: { lat: 42.3503, lng: -3.5181 },
        geologicalContext: { era: "Cenozoic", period: "Middle Pleistocene", climate: "Mediterranean Sub-Plateau Karst System", age: "430,000 BP" },
        inventory: [
          { name: "Bone Accumulation (at least 29 individuals)", description: "Over 7,000 human fossils and fragments at the bottom of a deep vertical shaft in the Cueva Mayor cave system. Whether the bodies were deliberately placed there is still debated.", category: "burial" },
          { name: "Cranium 5 'Miguelón'", description: "A nearly complete skull with a broad nasal aperture; severe dental decay and infection may have caused his death.", category: "skull" },
          { name: "Excalibur (Quartzite Biface)", description: "A 685 g quartzite handaxe with no clear signs of use, the only stone tool in the deposit; a possible grave good.", category: "burial" },
          { name: "Pelvis 'Elvis'", description: "Extremely broad male pelvis; body mass estimated at roughly 90–100 kg.", category: "skeleton" }
        ],
        stats: [
          { label: "FOSSIL ABUNDANCE", value: "7,000+ Fossils", subtext: "A major share of the world's Middle Pleistocene human fossils", iconType: "discovery" },
          { label: "POSSIBLE OFFERING", value: "Excalibur Handaxe", subtext: "Only stone tool in entire shaft", iconType: "status" },
          { label: "POPULATION SAMPLE", value: "29+ Individuals", subtext: "Adolescents & prime adults", iconType: "geology" }
        ]
      },
      {
        name: "Schöningen, Lower Saxony, Germany",
        coordinates: { lat: 52.1333, lng: 10.9667 },
        geologicalContext: { era: "Cenozoic", period: "Middle Pleistocene", climate: "Interglacial Lake Margin", age: "300,000 BP" },
        inventory: [
          { name: "Schöningen Wooden Hunting Spears", description: "A set of spruce throwing spears with the weight toward the front, like a modern javelin. Attribution to Homo heidelbergensis is inferred.", category: "environment" },
          { name: "Butchered Horse Kill Horizon", description: "Remains of many horses (Equus mosbachensis) with stone-tool cutmarks.", category: "environment" }
        ],
        stats: [
          { label: "WOODEN SPEARS", value: "~300,000 BP", subtext: "Aerodynamic throwing javelins", iconType: "discovery" },
          { label: "KILL HORIZON", value: "50+ Horses", subtext: "Coordinated pack ambush hunting", iconType: "status" },
          { label: "ORGANIC PRESERVATION", value: "Lacustrine Peat", subtext: "Anaerobic waterlogged soil", iconType: "geology" }
        ]
      },
      {
        name: "Kabwe (Broken Hill), Central Province, Zambia",
        coordinates: { lat: -14.4431, lng: 28.4286 },
        geologicalContext: { era: "Cenozoic", period: "Middle Pleistocene", climate: "Sub-Saharan Savanna Woodland", age: "300,000 BP" },
        inventory: [
          { name: "Kabwe 1 (Broken Hill Skull)", description: "Massive cranium with the largest brow ridge of any fossil hominin, showing severe dental caries and chronic ear infection perforations.", category: "skull" }
        ],
        stats: [
          { label: "BROW RIDGE SIZE", value: "Extremely Massive", subtext: "Thickest supraorbital torus", iconType: "status" },
          { label: "CRANIAL VOLUME", value: "1,280 cc", subtext: "Equal to modern human range", iconType: "era" },
          { label: "PALEOPATHOLOGY", value: "Dental Caries", subtext: "Earliest known extensive tooth decay", iconType: "discovery" }
        ]
      }
    ]
  },
  {
    name: "Homo naledi",
    commonName: "Rising Star Hominin",
    temporalRange: "335,000 – 236,000 Years Ago",
    epoch: "Middle Pleistocene",
    cranialCapacity: "465 – 610 cc (Small orange-sized brain with derived frontal lobe shape)",
    locomotion: "Obligate Bipedalism (Modern human-like foot with curved climbing fingers)",
    materialCulture: "Claimed chamber burials, wall markings and fire use (2023 preprints; contested)",
    burialTradition: "Possible deliberate body deposition in deep karst chambers (Dinaledi Chamber); debated",
    summary: "Discovered deep inside the Rising Star cave system in South Africa, Homo naledi combines a tiny, ape-sized brain with a human-like wrist, foot, and slender body. Most astonishingly, this small-brained species traversed hundreds of meters through pitch-black, suffocatingly narrow subterranean fissures while carrying torches to deposit their dead in isolated chambers.",
    metadata: {
      threatLevel: "CAVERN ADAPTED FORAGER",
      threatScore: 2,
      diet: "Omnivorous / High-Wear Grit Diet (Plant silica, roots, raw tubers)",
      packBehavior: "Intimate Karst-Sheltered Kin Groups",
      integument: "Sparse Hair Cover, High Manual Dexterity",
      flight: "Obligate Striding Biped with Arboreal Climbing Retention",
      osteologicalCompleteness: 95
    },
    sites: [
      {
        name: "Rising Star Cave (Dinaledi Chamber), South Africa",
        coordinates: { lat: -25.9222, lng: 27.7111 },
        geologicalContext: { era: "Cenozoic", period: "Middle Pleistocene", climate: "Karst Dolomite Subterranean Maze", age: "300,000 BP (US-ESR dating)" },
        inventory: [
          { name: "Dinaledi Chamber Skeleton Cache", description: "Remains of at least 15 individuals of all ages in a chamber reached through a narrow chute. Whether they were deliberately placed there is debated.", category: "burial" },
          { name: "Dinaledi Hand 1", description: "Nearly complete articulated hand showing curved phalanges for climbing combined with a robust thumb adapted for stone tool precision grips.", category: "skeleton" },
          { name: "DH1 Cranium and Mandible", description: "Small 560 cc braincase with advanced human-like cranial contouring.", category: "skull" }
        ],
        stats: [
          { label: "SPECIMEN COUNT", value: "1,550+ Bones", subtext: "Largest hominin find in African history", iconType: "discovery" },
          { label: "MORTUARY CACHING", value: "Subterranean Chute", subtext: "Intentional navigation in total darkness", iconType: "status" },
          { label: "CRANIAL VOLUME", value: "560 cc", subtext: "Small brain / complex behavior", iconType: "era" }
        ]
      },
      {
        name: "Lesedi Chamber (Rising Star), South Africa",
        coordinates: { lat: -25.9218, lng: 27.7108 },
        geologicalContext: { era: "Cenozoic", period: "Middle Pleistocene", climate: "Dolomite Karst Cave Sub-Chamber", age: "300,000 BP" },
        inventory: [
          { name: "LES1 'Neo' Skeleton", description: "A partial adult skeleton (LES1, 'Neo') from the Lesedi Chamber.", category: "skeleton" }
        ],
        stats: [
          { label: "CRANIAL INTEGRITY", value: "Near-Complete", subtext: "Neo specimen", iconType: "status" },
          { label: "ACCESS DIFFICULTY", value: "Super-Narrow Squeeze", subtext: "Requires speleological crawl", iconType: "geology" },
          { label: "INDIVIDUAL AGE", value: "Prime Adult Male", subtext: "Complete dental arcade", iconType: "era" }
        ]
      }
    ]
  },
  {
    name: "Australopithecus afarensis",
    commonName: "Lucy / Selam",
    temporalRange: "3.85 – 2.95 Million Years Ago",
    epoch: "Late Pliocene",
    cranialCapacity: "380 – 430 cc (Chimpanzee-sized cranial volume with subnasal prognathism)",
    locomotion: "Habitual Bipedalism with Tree-Climbing Retention (In-line big toe, valgus knee, arched foot)",
    materialCulture: "Possible Lomekwian / Early Pliocene Unmodified Stone Hammering & Bone Fracturing",
    burialTradition: "No Formal Burials; Rapid Fluvial & Volcanic Ash Sediment Preservation",
    summary: "One of the most famous human ancestors, best known from the 40% complete skeleton 'Lucy' (AL 288-1) and the iconic 3.6-million-year-old fossilized Laetoli footprint trails in Tanzania. Afarensis walked upright on two legs with an arched foot, but retained long curved fingers and climbing shoulders for foraging and nesting in trees.",
    metadata: {
      threatLevel: "FACULTATIVE BIPEDAL FORAGER",
      threatScore: 2,
      diet: "C3/C4 Plant Mosaic (Fruits, grasses, seeds, roots, occasional insects)",
      packBehavior: "Polygynous or Multi-Male Social Groups with Marked Sexual Dimorphism",
      integument: "Full Body Hair Coat, Arboreal Night Nesting",
      flight: "Habitual Terrestrial Biped & Arboreal Climber",
      osteologicalCompleteness: 85
    },
    sites: [
      {
        name: "Hadar, Afar Depression, Ethiopia",
        coordinates: { lat: 11.1667, lng: 40.5833 },
        geologicalContext: { era: "Cenozoic", period: "Late Pliocene", climate: "Fluviatile Floodplain & Lake Margin", age: "3.2 Million Years Ago" },
        inventory: [
          { name: "AL 288-1 'Lucy' Skeleton", description: "Iconic 40% complete skeleton of a 1.05-meter adult female demonstrating a short, bowl-shaped pelvis and valgus angled knees.", category: "skeleton" },
          { name: "AL 333 'First Family'", description: "Catastrophic assemblage of over 200 fossil fragments representing at least 13 individuals who died together in a flash flood event.", category: "skeleton" },
          { name: "AL 444-2 Male Cranium", description: "Large male skull displaying pronounced temporal crests and facial prognathism.", category: "skull" }
        ],
        stats: [
          { label: "BIPEDAL PROOF", value: "Valgus Knee & Pelvis", subtext: "Confirmed upright walking in 1974", iconType: "status" },
          { label: "LUCY STATURE", value: "1.05 m (3 ft 5 in)", subtext: "Pronounced sexual dimorphism", iconType: "discovery" },
          { label: "GEOLOGICAL MEMBER", value: "Kada Hadar Member", subtext: "Volcanic ash feldspar dating", iconType: "geology" }
        ]
      },
      {
        name: "Laetoli, Ngorongoro Conservation Area, Tanzania",
        coordinates: { lat: -2.9833, lng: 35.3500 },
        geologicalContext: { era: "Cenozoic", period: "Pliocene", climate: "Volcanic Savanna Plain", age: "3.66 Million Years Ago" },
        inventory: [
          { name: "Laetoli Footprint Trail (Site G)", description: "70-meter pathway of 70 fossilized bipedal footprints pressed into wet volcanic carbonatite ash of Sadiman volcano by three individuals walking together.", category: "footprint" },
          { name: "Adducted Hallux (Big Toe)", description: "The footprints prove the big toe was held in line with the foot rather than opposable, with deep heel strikes and modern weight transfer arches.", category: "footprint" }
        ],
        stats: [
          { label: "FOOTPRINT DATING", value: "3.66 Ma (Ar-Ar)", subtext: "Volcanic carbonatite tuff", iconType: "era" },
          { label: "STRIDE ANALYSIS", value: "Deep Heel-Toe Push", subtext: "Equivalent to modern human walking", iconType: "status" },
          { label: "INDIVIDUALS WALKING", value: "3 Hominins In Tandem", subtext: "One stepping in another's tracks", iconType: "discovery" }
        ]
      },
      {
        name: "Dikika, Afar Depression, Ethiopia",
        coordinates: { lat: 11.0833, lng: 40.5667 },
        geologicalContext: { era: "Cenozoic", period: "Late Pliocene", climate: "Deltaic Sandstone & Silt", age: "3.3 Million Years Ago" },
        inventory: [
          { name: "DIK-1-1 'Selam' (Lucy's Child)", description: "Near-complete skeleton of a 3-year-old female toddler encased in sandstone, with face, skull, hyoid bone, and shoulder blade intact.", category: "skeleton" }
        ],
        stats: [
          { label: "CHILD AGE", value: "3 Years Old", subtext: "Determined via dental CT scans", iconType: "discovery" },
          { label: "CLIMBING SCAPULA", value: "Gorilla-Like Upward Socket", subtext: "Retained tree-climbing prowess", iconType: "status" },
          { label: "HYOID BONE", value: "Ape-Like Air Sacs", subtext: "Primate vocal tract anatomy", iconType: "geology" }
        ]
      }
    ]
  },
  {
    name: "Australopithecus africanus",
    commonName: "Taung Child / Mrs. Ples",
    temporalRange: "3.3 – 2.1 Million Years Ago",
    epoch: "Late Pliocene to Early Pleistocene",
    cranialCapacity: "420 – 500 cc (Slightly larger, rounder brain than Afarensis, reduced canines)",
    locomotion: "Habitual Bipedalism (Upright pelvic structure with climbing adaptations)",
    materialCulture: "Osteodontokeratic Culture (Raymond Dart hypothesis, later disproven; foraged using perishable sticks)",
    burialTradition: "No Burials; Accumulated as Prey in Leopard and Eagle Caves",
    summary: "The species that revealed Africa as the cradle of humankind when Raymond Dart recognized the Taung Child in 1924. With a parabolic dental arcade, smaller canines, and a slightly larger cranial capacity than Afarensis, Africanus lived across the ancient southern African highveld.",
    metadata: {
      threatLevel: "PREY / FORAGER SPECIES",
      threatScore: 2,
      diet: "Omnivorous (C3 fruits, nuts, seeds, and tough roots)",
      packBehavior: "Foraging Kin Bands (Vulnerable to predatory carnivores)",
      integument: "Full Body Fur Coat",
      flight: "Habitual Terrestrial Biped",
      osteologicalCompleteness: 88
    },
    sites: [
      {
        name: "Taung, North West Province, South Africa",
        coordinates: { lat: -27.6167, lng: 24.7500 },
        geologicalContext: { era: "Cenozoic", period: "Early Pleistocene", climate: "Dry Kalahari Margin Savanna", age: "2.5 – 2.0 Million Years Ago" },
        inventory: [
          { name: "Taung 1 (Taung Child)", description: "Fossilized face, jaw with milk teeth, and natural limestone endocast of the brain showing an anteriorly positioned foramen magnum.", category: "skull" },
          { name: "Predator Talon Puncture Marks", description: "Punctures at the base of the eye orbits matching the talon strikes of a Crowned Hawk-Eagle, resolving the child's cause of death.", category: "skull" }
        ],
        stats: [
          { label: "CRADLE DISCOVERY", value: "Raymond Dart 1924", subtext: "First early African hominin found", iconType: "discovery" },
          { label: "PREDATION MARK", value: "Eagle Talon Holes", subtext: "Crowned hawk-eagle prey", iconType: "status" },
          { label: "BRAIN ENDOCAST", value: "Natural Calcite", subtext: "Preserves cortex surface", iconType: "geology" }
        ]
      },
      {
        name: "Sterkfontein (Cradle of Humankind), South Africa",
        coordinates: { lat: -26.0156, lng: 27.7344 },
        geologicalContext: { era: "Cenozoic", period: "Late Pliocene", climate: "Subterranean Karst Infill System", age: "2.6 – 2.1 Million Years Ago" },
        inventory: [
          { name: "Sts 5 'Mrs. Ples' Complete Cranium", description: "Most complete cranium of Australopithecus africanus ever found, devoid of temporal crests.", category: "skull" },
          { name: "Sts 14 Articulated Pelvis and Spine", description: "Vertebral column and pelvis proving lumbar lordosis (S-curve spine) required for upright bipedal posture.", category: "skeleton" },
          { name: "Little Foot (StW 573)", description: "A virtually 90% complete skeleton discovered in Member 2 deep in the Silberberg Grotto.", category: "skeleton" }
        ],
        stats: [
          { label: "SPINE CURVATURE", value: "Lumbar Lordosis", subtext: "Clear upright S-curve spine", iconType: "status" },
          { label: "FOSSIL RICHNESS", value: "500+ Hominin Fossils", subtext: "UNESCO World Heritage Cradle", iconType: "discovery" },
          { label: "LITTLE FOOT", value: "90% Complete", subtext: "Most complete early hominin", iconType: "era" }
        ]
      }
    ]
  },
  {
    name: "Homo habilis",
    commonName: "Handy Man",
    temporalRange: "2.4 – 1.4 Million Years Ago",
    epoch: "Early Pleistocene (Gelasian to Calabrian)",
    cranialCapacity: "550 – 687 cc (Enlarged frontal lobes and Broca's area asymmetry)",
    locomotion: "Obligate Bipedalism (Modern walking gait with retained arm-swing proportion)",
    materialCulture: "Oldowan Stone Tool Industry (Mode 1: river pebble choppers, acute cutting flakes, hammerstones)",
    burialTradition: "No Intentional Burials Known; Campsite Flake Accumulations and Cutmarked Bones",
    summary: "Nicknamed 'Handy Man' for its direct association with the world's earliest systematic Oldowan stone tool industries at Olduvai Gorge. Homo habilis crossed the cognitive Rubicon with an expanded encephalized brain, reduced molars, and a hand capable of a refined precision grip to butcher animal carcasses and extract energy-dense bone marrow.",
    metadata: {
      threatLevel: "COOPERATIVE FORAGER / SCAVENGER",
      threatScore: 3,
      diet: "Omnivorous Scavenger (Bone marrow, brain tissues, tubers, fruit, seeds)",
      packBehavior: "Cooperative Foraging Groups centered around Stone Tool Knapping Caches",
      integument: "Partial Hair Loss, High Sweat Gland Density",
      flight: "Obligate Terrestrial Biped",
      osteologicalCompleteness: 82
    },
    sites: [
      {
        name: "Olduvai Gorge, Great Rift Valley, Tanzania",
        coordinates: { lat: -2.9917, lng: 35.3528 },
        geologicalContext: { era: "Cenozoic", period: "Early Pleistocene", climate: "Lacustrine Savanna Fluvial Basin", age: "1.84 Million Years Ago" },
        inventory: [
          { name: "OH 7 'Johnny's Child' Holotype", description: "Parietal bones, jaw, and hand bones discovered in 1960 by Jonathan Leakey, defining the species Homo habilis.", category: "skull" },
          { name: "OH 8 Articulated Bipedal Foot", description: "Foot skeleton demonstrating a fully rigid longitudinal arch and adducted big toe.", category: "skeleton" },
          { name: "FLK Zinj Oldowan Floor", description: "Thousands of basalt Oldowan flakes and broken bovid long bones showing impact notches for marrow extraction.", category: "environment" }
        ],
        stats: [
          { label: "TOOLMAKER HOLOTYPE", value: "OH 7 Specimen", subtext: "Established Homo habilis 1964", iconType: "discovery" },
          { label: "BRAIN VOLUME", value: "680 cc", subtext: "35% larger than Australopiths", iconType: "status" },
          { label: "OLDOWAN FLOOR", value: "Bed I Stratigraphy", subtext: "Earliest systematic tool floor", iconType: "geology" }
        ]
      },
      {
        name: "Koobi Fora, Lake Turkana, Kenya",
        coordinates: { lat: 3.9500, lng: 36.1833 },
        geologicalContext: { era: "Cenozoic", period: "Early Pleistocene", climate: "River Delta Margins of Paleo-Lake Turkana", age: "1.9 Million Years Ago" },
        inventory: [
          { name: "KNM-ER 1813 Cranium", description: "Exquisitely preserved small adult skull (510 cc) with delicate modern facial architecture and rounded vault.", category: "skull" },
          { name: "KNM-ER 1470 (Homo rudolfensis)", description: "Large flat-faced cranium with 775 cc volume, illustrating early Homo diversity in the East African rift.", category: "skull" }
        ],
        stats: [
          { label: "CRANIAL PRESERVATION", value: "Pristine", subtext: "KNM-ER 1813 cranium", iconType: "status" },
          { label: "DATING", value: "1.9 Ma", subtext: "KBS Tuff potassium-argon dating", iconType: "era" },
          { label: "LAKE SHORE ECOLOGY", value: "Catfish & Hippo Remains", subtext: "High protein aquatic foraging", iconType: "geology" }
        ]
      }
    ]
  },
  {
    name: "Denisovans (Homo denisova)",
    commonName: "Denisova Hominin",
    temporalRange: "280,000 – 30,000 Years Ago",
    epoch: "Middle to Late Pleistocene",
    cranialCapacity: "1,400 – 1,600 cc (Massive molars, robust mandible, high adaptation to hypoxia)",
    locomotion: "Obligate Bipedalism (Stout cold and high-altitude adapted stature)",
    materialCulture: "Chlorite Bracelets, Polished Bone Needles, Mammoth Ivory Pendants, EPAS1 Tibetan Altitude Gene",
    burialTradition: "Cave Stratum Caching; Fragmentary Remains Associated with Exquisite Ornaments",
    summary: "An enigmatic sister lineage to the Neanderthals identified first from ancient DNA extracted from a tiny finger bone. Denisovans inhabited the vast territories of Siberia, Central Asia, and the high-altitude Tibetan Plateau. They contributed the EPAS1 altitude adaptation gene to modern Tibetans and Sherpas, and crafted the world's most sophisticated polished stone jewelry.",
    metadata: {
      threatLevel: "HIGH-ALTITUDE APEX HUNTER",
      threatScore: 4,
      diet: "Carnivorous (Woolly Mammoth, Siberian Ibex, Yak, Horse, Gazelle)",
      packBehavior: "Cold-Adapted Foraging Bands",
      integument: "Tailored Hide Clothing, Specialized High-Altitude Physiology",
      flight: "Obligate Terrestrial Striding Biped",
      osteologicalCompleteness: 75
    },
    sites: [
      {
        name: "Denisova Cave, Altai Mountains, Siberia, Russia",
        coordinates: { lat: 51.3975, lng: 84.6761 },
        geologicalContext: { era: "Cenozoic", period: "Late Pleistocene", climate: "Altai Sub-Alpine Montane Valley", age: "280,000 – 45,000 BP" },
        inventory: [
          { name: "Denisova 3 Distal Finger Phalanx (The X-Woman)", description: "Pinky bone of a young girl from which the complete Denisovan nuclear genome was first sequenced in 2010.", category: "skeleton" },
          { name: "Denisova 11 'Denny' (First-Gen Hybrid)", description: "Bone fragment of a teenage girl whose DNA proved she had a Neanderthal mother and a Denisovan father.", category: "skeleton" },
          { name: "The Denisova Chlorite Bracelet", description: "Drilled and polished chloritolite stone bracelet reflecting optical green luster, created with a high-speed rotational drill 40,000 years ago.", category: "environment" },
          { name: "Denisova 4 & 8 Giant Molars", description: "Enormous wisdom teeth lacking the taurodontism of Neanderthals, confirming a distinctive cranial morphology.", category: "skull" }
        ],
        stats: [
          { label: "GENETIC FIRST", value: "Discovered by DNA", subtext: "First species discovered via paleogenomics", iconType: "discovery" },
          { label: "CHLORITE BRACELET", value: "Polished 40,000 BP", subtext: "Earliest drilled gem jewelry", iconType: "status" },
          { label: "DENNY HYBRID", value: "50% Neanderthal / 50% Denisovan", subtext: "Direct proof of interbreeding", iconType: "geology" }
        ]
      },
      {
        name: "Baishiya Karst Cave, Xiahe, Tibetan Plateau, China",
        coordinates: { lat: 35.1978, lng: 102.8164 },
        geologicalContext: { era: "Cenozoic", period: "Middle Pleistocene", climate: "High-Altitude Alpine Plateau (3,280 m elevation)", age: "160,000 BP (Uranium-Thorium)" },
        inventory: [
          { name: "Xiahe Mandible", description: "Robust right hemi-mandible preserving two giant molars, identified as Denisovan through ancient proteomic collagen analysis.", category: "skull" },
          { name: "High-Altitude EPAS1 Horizon", description: "Stratigraphic sedimentary DNA documenting continuous Denisovan occupation of the freezing Tibetan Plateau.", category: "environment" }
        ],
        stats: [
          { label: "PLATEAU ELEVATION", value: "3,280 Meters (10,700 ft)", subtext: "Living in low-oxygen hypoxia", iconType: "status" },
          { label: "PROTEOMIC DATING", value: "160,000 BP", subtext: "Ancient peptide sequencing", iconType: "discovery" },
          { label: "TIBETAN EPAS1 GENE", value: "Inherited Trait", subtext: "Gifted to modern highlanders", iconType: "geology" }
        ]
      }
    ]
  },
  {
    name: "Homo floresiensis",
    commonName: "The Hobbit",
    temporalRange: "100,000 – 50,000 Years Ago",
    epoch: "Late Pleistocene",
    cranialCapacity: "380 – 426 cc (Chimpanzee-sized brain with highly folded derived frontal lobes)",
    locomotion: "Obligate Bipedalism (Endemic Insular Dwarfism, flat feet with long toes, short legs)",
    materialCulture: "Advanced Flake Tools, Stegodon Dwarf Elephant Butchery, Controlled Fire In Caves",
    burialTradition: "No Formal Burials; Cave Sedimentary Infilling in Liang Bua",
    summary: "Nicknamed 'The Hobbit' for its diminutive 1.06-meter (3 ft 6 in) adult stature and large feet. Homo floresiensis survived on the isolated Indonesian island of Flores until 50,000 years ago. Evolving under the pressures of insular island dwarfism, this tiny species hunted dwarf Stegodon elephants, braved Komodo dragons, and crafted sophisticated stone tools despite possessing a brain no larger than a grapefruit.",
    metadata: {
      threatLevel: "INSULAR PACK HUNTER",
      threatScore: 3,
      diet: "Carnivorous / Island Forager (Dwarf Stegodon, giant rats, Komodo dragons, birds)",
      packBehavior: "Close-Knit Island Cave Communities",
      integument: "Tropical Island Adaptation",
      flight: "Obligate Terrestrial Striding Biped",
      osteologicalCompleteness: 88
    },
    sites: [
      {
        name: "Liang Bua Cave, Flores Island, Indonesia",
        coordinates: { lat: -8.5303, lng: 120.4439 },
        geologicalContext: { era: "Cenozoic", period: "Late Pleistocene", climate: "Tropical Island Karst Cave", age: "100,000 – 60,000 BP" },
        inventory: [
          { name: "LB1 'Flo' Holotype Skeleton", description: "Nearly complete 30-year-old female skeleton standing 1.06 m (3 ft 6 in) tall with miniature cranium and pelvic grid.", category: "skeleton" },
          { name: "LB1 Cranium (380 cc)", description: "Smallest adult human cranium known, displaying derived Homo-like frontal lobe geometry.", category: "skull" },
          { name: "Butchered Juvenile Stegodon Bones", description: "Charred and cutmarked bones of dwarf Stegodon florensis insularis butchered with chert flakes.", category: "environment" }
        ],
        stats: [
          { label: "ADULT STATURE", value: "1.06 m (3 ft 6 in)", subtext: "Insular dwarfism evolution", iconType: "status" },
          { label: "CRANIAL VOLUME", value: "380 – 426 cc", subtext: "Grapefruit-sized brain", iconType: "discovery" },
          { label: "EXTINCTION COINCIDENCE", value: "50,000 BP", subtext: "Coincides with modern human arrival", iconType: "era" }
        ]
      }
    ]
  },
  {
    name: "Sahelanthropus tchadensis",
    commonName: "Toumaï ('Hope of Life')",
    temporalRange: "7.2 – 6.8 Million Years Ago",
    epoch: "Late Miocene (Messinian)",
    cranialCapacity: "360 – 380 cc (Small ape-sized cranial capacity with flat face)",
    locomotion: "Early Habitual / Facultative Bipedalism (Anteriorly positioned foramen magnum)",
    materialCulture: "No Stone Tools Known; Organic Foraging and Natural Plant Manipulation",
    burialTradition: "No Burials; Fossilized in Ancient Megachad Shoreline Sandstones",
    summary: "The earliest known candidate for the first hominin walking after the chimpanzee-human evolutionary divergence. Discovered in the Djurab Desert of Chad, 'Toumaï' possessed an anteriorly shifted foramen magnum indicating an upright posture, combined with small, human-like canines and a flat face remarkable for a 7-million-year-old ancestor.",
    metadata: {
      threatLevel: "EARLY HOMININ FORAGER",
      threatScore: 1,
      diet: "Herbivorous / Frugivore (Fruits, leaves, roots, nuts along ancient lakeshore)",
      packBehavior: "Small Primate Kin Bands",
      integument: "Full Body Fur Coat",
      flight: "Early Facultative Biped with Arboreal Agility",
      osteologicalCompleteness: 70
    },
    sites: [
      {
        name: "Toros-Menalla (Djurab Desert), Chad",
        coordinates: { lat: 16.3333, lng: 17.5000 },
        geologicalContext: { era: "Cenozoic", period: "Late Miocene", climate: "Ancient Lake Mega-Chad Shoreline & Gallery Forest", age: "7.0 Million Years Ago (10Be/9Be dating)" },
        inventory: [
          { name: "TM 266-01-080-1 'Toumaï' Cranium", description: "Nearly complete adult cranium with remarkably flat orthognathic face and thick brow ridge.", category: "skull" },
          { name: "TM 266 Mandibular Fragments", description: "Mandibles showing reduced, non-honing canines without a modern ape canine-premolar shearing complex.", category: "skull" },
          { name: "TM 266 Femoral Shaft", description: "Partial left femur showing structural cross-sections and femoral neck angle consistent with habitual upright walking.", category: "skeleton" }
        ],
        stats: [
          { label: "DEEPEST ANCESTOR", value: "7.0 Million Years", subtext: "Earliest known hominin candidate", iconType: "discovery" },
          { label: "BIPED EVIDENCE", value: "Foramen Magnum", subtext: "Shifted forward under skull base", iconType: "status" },
          { label: "CANINE HONING", value: "Absent", subtext: "Human-like dental evolution", iconType: "geology" }
        ]
      }
    ]
  }
];
