import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import { storage } from "./storage";
import { generateEraImage, generateAllEraImages, generateMarcusAureliusVideo, generateTourVideo } from "./gemini";
// Local tour generation without external AI dependencies

// Historical tour templates based on different eras and locations
const tourTemplates = {
  "Ancient Egypt": {
    locations: ["egypt", "cairo", "luxor", "giza"],
    tours: [
      {
        id: 1001,
        title: "Cairo Essentials",
        duration: "3 days",
        description: "Quick exploration of Cairo's most iconic sites including the pyramids and Egyptian Museum.",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Cairo - Ancient Wonders",
            sites: [
              { name: "Egyptian Museum", description: "World's largest collection of ancient Egyptian artifacts including Tutankhamun's treasures" },
              { name: "Khan el-Khalili Bazaar", description: "Historic marketplace dating back to the 14th century" }
            ],
            hotel: { name: "Steigenberger Hotel El Tahrir", location: "Downtown Cairo", description: "Historic hotel overlooking the Nile River" }
          },
          {
            day: 2,
            title: "Giza Plateau - Pyramid Complex",
            sites: [
              { name: "Great Pyramid of Giza", description: "The only surviving Wonder of the Ancient World" },
              { name: "Great Sphinx", description: "Mysterious limestone statue with the body of a lion" },
              { name: "Solar Boat Museum", description: "Ancient cedar boat buried beside the Great Pyramid" }
            ],
            hotel: { name: "Mena House Hotel", location: "Giza", description: "Luxury hotel with pyramid views since 1869" }
          },
          {
            day: 3,
            title: "Islamic Cairo & Departure",
            sites: [
              { name: "Citadel of Saladin", description: "Medieval Islamic fortification with panoramic city views" },
              { name: "Mosque of Muhammad Ali", description: "Ottoman-style mosque within the Citadel" }
            ],
            hotel: { name: "Four Seasons Hotel Cairo at Nile Plaza", location: "Garden City", description: "Luxury hotel on the Nile with modern amenities" }
          }
        ]
      },
      {
        id: 1002,
        title: "Valley of the Kings Expedition",
        duration: "5 days",
        description: "Discover the royal tombs and temples of ancient Thebes, including the tomb of Tutankhamun and the magnificent Temple of Karnak.",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Luxor - East Bank",
            sites: [
              { name: "Karnak Temple", description: "Vast temple complex dedicated to Amun-Ra, built over 2000 years" },
              { name: "Luxor Temple", description: "Ancient temple in the heart of modern Luxor, connected to Karnak by sphinx avenue" }
            ],
            hotel: { name: "Winter Palace Hotel", location: "Luxor", description: "Historic Victorian hotel on the Nile, hosted royalty since 1886" }
          },
          {
            day: 2,
            title: "Valley of the Kings - Royal Tombs",
            sites: [
              { name: "Tomb of Tutankhamun", description: "Most famous pharaoh's tomb with original burial chamber" },
              { name: "Tomb of Ramesses VI", description: "Elaborate tomb with well-preserved astronomical ceiling" },
              { name: "Valley of the Queens", description: "Burial site of royal wives including Nefertari's tomb" }
            ],
            hotel: { name: "Sofitel Winter Palace Luxor", location: "East Bank", description: "Renovated wing of the historic Winter Palace" }
          },
          {
            day: 3,
            title: "West Bank Temples",
            sites: [
              { name: "Temple of Hatshepsut", description: "Mortuary temple of Egypt's most successful female pharaoh" },
              { name: "Colossi of Memnon", description: "Twin statues of Amenhotep III, once guarded his temple" }
            ],
            hotel: { name: "Al Moudira Hotel", location: "West Bank", description: "Boutique hotel built in traditional Nubian style" }
          },
          {
            day: 4,
            title: "Edfu and Kom Ombo Temples",
            sites: [
              { name: "Temple of Horus at Edfu", description: "Best-preserved temple in Egypt dedicated to falcon god" },
              { name: "Kom Ombo Temple", description: "Unique double temple dedicated to Sobek and Horus" }
            ],
            hotel: { name: "Movenpick Resort Aswan", location: "Elephantine Island", description: "Resort on Nile island with Nubian cultural center" }
          },
          {
            day: 5,
            title: "Aswan - Philae Temple",
            sites: [
              { name: "Philae Temple", description: "Temple of Isis relocated to Agilkia Island to save from flooding" },
              { name: "Aswan High Dam", description: "Modern engineering marvel that created Lake Nasser" }
            ],
            hotel: { name: "Old Cataract Hotel", location: "Aswan", description: "Legendary hotel where Agatha Christie wrote Death on the Nile" }
          }
        ]
      },
      {
        id: 1003,
        title: "Pharaohs and Pyramids Discovery",
        duration: "7 days",
        description: "Comprehensive journey through Egypt's greatest monuments from Cairo to Aswan, including pyramids, temples, and royal tombs.",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Cairo - Ancient Wonders",
            sites: [
              { name: "Egyptian Museum", description: "World's largest collection of ancient Egyptian artifacts" },
              { name: "Khan el-Khalili Bazaar", description: "Historic marketplace dating back to the 14th century" }
            ],
            hotel: { name: "Steigenberger Hotel El Tahrir", location: "Downtown Cairo", description: "Historic hotel overlooking the Nile River" }
          },
          {
            day: 2,
            title: "Giza Plateau - Pyramid Complex",
            sites: [
              { name: "Great Pyramid of Giza", description: "The only surviving Wonder of the Ancient World" },
              { name: "Great Sphinx", description: "Mysterious limestone statue with the body of a lion" },
              { name: "Pyramid of Khafre", description: "Second-largest pyramid at Giza with intact capstone" }
            ],
            hotel: { name: "Mena House Hotel", location: "Giza", description: "Luxury hotel with pyramid views since 1869" }
          },
          {
            day: 3,
            title: "Memphis and Saqqara",
            sites: [
              { name: "Step Pyramid of Djoser", description: "World's oldest stone building and first pyramid" },
              { name: "Tomb of Ti", description: "Mastaba tomb with detailed reliefs of daily life" },
              { name: "Memphis Museum", description: "Open-air museum at ancient Egypt's first capital" }
            ],
            hotel: { name: "Four Seasons Hotel Cairo at Nile Plaza", location: "Garden City", description: "Luxury hotel on the Nile with modern amenities" }
          },
          {
            day: 4,
            title: "Flight to Luxor - East Bank",
            sites: [
              { name: "Karnak Temple", description: "Vast temple complex dedicated to Amun-Ra" },
              { name: "Luxor Temple", description: "Ancient temple in the heart of modern Luxor" }
            ],
            hotel: { name: "Winter Palace Hotel", location: "Luxor", description: "Historic Victorian hotel on the Nile" }
          },
          {
            day: 5,
            title: "Valley of the Kings",
            sites: [
              { name: "Tomb of Tutankhamun", description: "Most famous pharaoh's tomb with original burial chamber" },
              { name: "Tomb of Ramesses VI", description: "Elaborate tomb with astronomical ceiling" },
              { name: "Temple of Hatshepsut", description: "Mortuary temple of Egypt's female pharaoh" }
            ],
            hotel: { name: "Sofitel Winter Palace Luxor", location: "East Bank", description: "Renovated historic palace hotel" }
          },
          {
            day: 6,
            title: "Edfu Temple",
            sites: [
              { name: "Temple of Horus at Edfu", description: "Best-preserved temple in Egypt" },
              { name: "Traditional Felucca Ride", description: "Sail the Nile in traditional wooden boat" }
            ],
            hotel: { name: "Movenpick Resort Aswan", location: "Elephantine Island", description: "Island resort with Nubian village" }
          },
          {
            day: 7,
            title: "Aswan - Philae Temple",
            sites: [
              { name: "Philae Temple", description: "Temple of Isis on Agilkia Island" },
              { name: "Unfinished Obelisk", description: "Ancient granite quarry with incomplete obelisk" }
            ],
            hotel: { name: "Old Cataract Hotel", location: "Aswan", description: "Historic luxury hotel on the Nile" }
          }
        ]
      },
      {
        id: 1004,
        title: "Complete Egypt Explorer",
        duration: "10 days",
        description: "Ultimate Egyptian adventure covering all major sites from Alexandria to Abu Simbel, including Nile cruise and desert oases.",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Cairo",
            sites: [
              { name: "Egyptian Museum", description: "Comprehensive introduction to Egyptian civilization" },
              { name: "Khan el-Khalili Bazaar", description: "Traditional shopping and cultural immersion" }
            ],
            hotel: { name: "Four Seasons Hotel Cairo at Nile Plaza", location: "Garden City", description: "Luxury base for Cairo exploration" }
          },
          {
            day: 2,
            title: "Giza and Memphis",
            sites: [
              { name: "Great Pyramid Complex", description: "All three pyramids and the Sphinx" },
              { name: "Solar Boat Museum", description: "Pharaoh's celestial boat" },
              { name: "Memphis and Saqqara", description: "Ancient capital and step pyramid complex" }
            ],
            hotel: { name: "Mena House Hotel", location: "Giza", description: "Historic hotel with pyramid views" }
          },
          {
            day: 3,
            title: "Alexandria Day Trip",
            sites: [
              { name: "Bibliotheca Alexandrina", description: "Modern tribute to ancient Library of Alexandria" },
              { name: "Catacombs of Kom el Shoqafa", description: "Greco-Roman burial chambers" },
              { name: "Qaitbay Citadel", description: "15th-century fortress on site of ancient lighthouse" }
            ],
            hotel: { name: "Four Seasons Hotel Alexandria", location: "Mediterranean Coast", description: "Beachfront luxury hotel" }
          },
          {
            day: 4,
            title: "Flight to Luxor - Karnak",
            sites: [
              { name: "Karnak Temple Complex", description: "Largest religious complex ever built" },
              { name: "Luxor Temple", description: "Temple connected to Karnak by sphinx avenue" }
            ],
            hotel: { name: "Winter Palace Hotel", location: "Luxor", description: "Victorian elegance on the Nile" }
          },
          {
            day: 5,
            title: "Valley of the Kings & Queens",
            sites: [
              { name: "Tomb of Tutankhamun", description: "Boy king's intact burial chamber" },
              { name: "Tomb of Nefertari", description: "Most beautiful tomb in Egypt" },
              { name: "Temple of Hatshepsut", description: "Female pharaoh's architectural masterpiece" }
            ],
            hotel: { name: "Al Moudira Hotel", location: "West Bank", description: "Boutique hotel in traditional Nubian style" }
          },
          {
            day: 6,
            title: "Begin Nile Cruise to Edfu",
            sites: [
              { name: "Temple of Horus at Edfu", description: "Best-preserved Ptolemaic temple" },
              { name: "Traditional Felucca Sailing", description: "Sunset sail on the Nile" }
            ],
            hotel: { name: "Sonesta St. George Nile Cruise", location: "Nile River", description: "Luxury cruise ship with panoramic views" }
          },
          {
            day: 7,
            title: "Kom Ombo and Aswan",
            sites: [
              { name: "Kom Ombo Temple", description: "Unique double temple for crocodile and falcon gods" },
              { name: "Nubian Village", description: "Cultural visit to traditional Nubian community" }
            ],
            hotel: { name: "Movenpick Resort Aswan", location: "Elephantine Island", description: "Island resort with cultural programs" }
          },
          {
            day: 8,
            title: "Abu Simbel Excursion",
            sites: [
              { name: "Abu Simbel Temples", description: "Ramesses II's colossal temples relocated from flooding" },
              { name: "Sound and Light Show", description: "Evening illumination of the temples" }
            ],
            hotel: { name: "Seti Abu Simbel Lake Resort", location: "Lake Nasser", description: "Desert resort near the temples" }
          },
          {
            day: 9,
            title: "Aswan - Philae Temple",
            sites: [
              { name: "Philae Temple", description: "Temple of Isis on picturesque island" },
              { name: "Aswan High Dam", description: "Engineering marvel creating Lake Nasser" },
              { name: "Unfinished Obelisk", description: "Ancient granite quarrying techniques" }
            ],
            hotel: { name: "Old Cataract Hotel", location: "Aswan", description: "Historic hotel where Death on the Nile was written" }
          },
          {
            day: 10,
            title: "Return to Cairo",
            sites: [
              { name: "Coptic Cairo", description: "Christian heritage including Hanging Church" },
              { name: "Islamic Cairo", description: "Medieval Islamic architecture and madrasas" }
            ],
            hotel: { name: "Four Seasons Hotel Cairo at Nile Plaza", location: "Garden City", description: "Final night in luxury" }
          }
        ]
      }
    ]
  },
  "Ancient Rome": {
    locations: ["rome", "italy", "pompeii"],
    tours: [
      {
        title: "Imperial Rome and Gladiators",
        duration: "7 days",
        description: "Walk in the footsteps of emperors through the Colosseum, Roman Forum, and Palatine Hill, then explore the preserved city of Pompeii.",
        itinerary: [
          {
            day: 1,
            title: "Ancient Rome - Imperial Center",
            sites: [
              { name: "Colosseum", description: "Iconic amphitheater where gladiators fought" },
              { name: "Roman Forum", description: "Heart of ancient Roman political and commercial life" }
            ],
            hotel: { name: "Hotel Artemide", location: "Via Nazionale", description: "Elegant hotel near Termini Station" }
          },
          {
            day: 2,
            title: "Vatican and Classical Rome",
            sites: [
              { name: "Vatican Museums", description: "Papal collection including the Sistine Chapel" },
              { name: "Pantheon", description: "Best-preserved Roman building from antiquity" }
            ],
            hotel: { name: "Hotel de Russie", location: "Piazza del Popolo", description: "Luxury hotel with beautiful gardens" }
          },
          {
            day: 3,
            title: "Palatine Hill and Capitoline Museums",
            sites: [
              { name: "Palatine Hill", description: "Legendary birthplace of Rome and imperial palace ruins" },
              { name: "Capitoline Museums", description: "World's oldest public museums with Roman statues" }
            ],
            hotel: { name: "Hotel Artemide", location: "Via Nazionale", description: "Elegant hotel near Termini Station" }
          },
          {
            day: 4,
            title: "Baths of Caracalla and Via Appia",
            sites: [
              { name: "Baths of Caracalla", description: "Best-preserved Roman public baths" },
              { name: "Via Appia Antica", description: "Ancient Roman road with tombs and catacombs" }
            ],
            hotel: { name: "Hotel de Russie", location: "Piazza del Popolo", description: "Luxury hotel with beautiful gardens" }
          },
          {
            day: 5,
            title: "Day Trip to Pompeii",
            sites: [
              { name: "Pompeii Archaeological Site", description: "Roman city preserved by volcanic ash" },
              { name: "Villa of Mysteries", description: "Villa with famous frescoes depicting mystery cults" }
            ],
            hotel: { name: "Hotel Excelsior", location: "Naples", description: "Historic hotel overlooking the Bay of Naples" }
          },
          {
            day: 6,
            title: "Herculaneum and Mount Vesuvius",
            sites: [
              { name: "Herculaneum", description: "Better preserved than Pompeii with wooden artifacts" },
              { name: "Mount Vesuvius", description: "The volcano that buried Pompeii and Herculaneum" }
            ],
            hotel: { name: "Hotel Excelsior", location: "Naples", description: "Historic hotel overlooking the Bay of Naples" }
          },
          {
            day: 7,
            title: "Return to Rome - Ostia Antica",
            sites: [
              { name: "Ostia Antica", description: "Ancient port of Rome with mosaics and theater" },
              { name: "Borghese Gallery", description: "Villa with Bernini sculptures and paintings" }
            ],
            hotel: { name: "Hotel de Russie", location: "Piazza del Popolo", description: "Luxury hotel with beautiful gardens" }
          },
          {
            day: 8,
            title: "Tivoli - Hadrian's Villa",
            sites: [
              { name: "Hadrian's Villa", description: "Emperor Hadrian's sprawling villa complex" },
              { name: "Villa d'Este", description: "Renaissance villa with elaborate fountains" }
            ],
            hotel: { name: "Hotel de Russie", location: "Piazza del Popolo", description: "Luxury hotel with beautiful gardens" }
          },
          {
            day: 9,
            title: "Underground Rome",
            sites: [
              { name: "San Clemente Basilica", description: "Three-layered church showing Roman history" },
              { name: "Catacombs of San Callisto", description: "Early Christian burial chambers" }
            ],
            hotel: { name: "Hotel Artemide", location: "Via Nazionale", description: "Elegant hotel near Termini Station" }
          },
          {
            day: 10,
            title: "Roman Markets and Departure",
            sites: [
              { name: "Trajan's Markets", description: "Ancient Roman shopping complex" },
              { name: "Diocletian's Baths", description: "Largest thermal baths complex in Rome" }
            ],
            hotel: { name: "Hotel Artemide", location: "Via Nazionale", description: "Elegant hotel near Termini Station" }
          }
        ]
      },
      {
        title: "Roman Engineering Marvels",
        duration: "6 days",
        description: "Explore the incredible engineering achievements of ancient Rome through aqueducts, roads, and architectural wonders.",
        itinerary: [
          {
            day: 1,
            title: "Arrival - Pantheon and Roman Architecture",
            sites: [
              { name: "Pantheon", description: "Architectural marvel with the world's largest unreinforced concrete dome" },
              { name: "Theatre of Marcellus", description: "Ancient Roman theater still in use today" }
            ],
            hotel: { name: "The First Roma", location: "Via del Vantaggio", description: "Boutique hotel near the Spanish Steps" }
          },
          {
            day: 2,
            title: "Aqueducts and Water Engineering",
            sites: [
              { name: "Aqua Claudia Aqueduct", description: "Remains of ancient Roman water system" },
              { name: "Baths of Diocletian", description: "Largest Roman bath complex" }
            ],
            hotel: { name: "The First Roma", location: "Via del Vantaggio", description: "Boutique hotel near the Spanish Steps" }
          },
          {
            day: 3,
            title: "Colosseum Engineering",
            sites: [
              { name: "Colosseum Underground", description: "Hypogeum with lift systems and animal cages" },
              { name: "Ludus Magnus", description: "Gladiator training school connected to Colosseum" }
            ],
            hotel: { name: "The First Roma", location: "Via del Vantaggio", description: "Boutique hotel near the Spanish Steps" }
          },
          {
            day: 4,
            title: "Roman Roads and Transportation",
            sites: [
              { name: "Via Appia Antica", description: "Queen of Roads - first great Roman highway" },
              { name: "Circus Maximus", description: "Largest sports stadium ever built" }
            ],
            hotel: { name: "The First Roma", location: "Via del Vantaggio", description: "Boutique hotel near the Spanish Steps" }
          },
          {
            day: 5,
            title: "Port Engineering - Ostia",
            sites: [
              { name: "Ostia Antica Port", description: "Ancient harbor engineering with hexagonal basin" },
              { name: "Roman Ship Museum", description: "Ancient vessels and navigation techniques" }
            ],
            hotel: { name: "The First Roma", location: "Via del Vantaggio", description: "Boutique hotel near the Spanish Steps" }
          },
          {
            day: 6,
            title: "Military Engineering",
            sites: [
              { name: "Castel Sant'Angelo", description: "Hadrian's Mausoleum converted to fortress" },
              { name: "Aurelian Walls", description: "Defensive walls that protected imperial Rome" }
            ],
            hotel: { name: "The First Roma", location: "Via del Vantaggio", description: "Boutique hotel near the Spanish Steps" }
          },
          {
            day: 7,
            title: "Villa Adriana - Imperial Innovation",
            sites: [
              { name: "Maritime Theater", description: "Hadrian's innovative circular villa design" },
              { name: "Canopus Pool", description: "Engineering marvel recreating Egyptian canal" }
            ],
            hotel: { name: "The First Roma", location: "Via del Vantaggio", description: "Boutique hotel near the Spanish Steps" }
          },
          {
            day: 8,
            title: "Roman Concrete and Construction",
            sites: [
              { name: "Markets of Trajan", description: "World's first shopping mall with concrete vaults" },
              { name: "Basilica of Maxentius", description: "Massive concrete structure showcasing Roman engineering" }
            ],
            hotel: { name: "The First Roma", location: "Via del Vantaggio", description: "Boutique hotel near the Spanish Steps" }
          },
          {
            day: 9,
            title: "Suburban Engineering",
            sites: [
              { name: "Villa of Quintili", description: "Suburban villa with engineering innovations" },
              { name: "Ponte Sant'Angelo", description: "Hadrian's Bridge showcasing Roman bridge building" }
            ],
            hotel: { name: "The First Roma", location: "Via del Vantaggio", description: "Boutique hotel near the Spanish Steps" }
          },
          {
            day: 10,
            title: "Modern Rome and Roman Legacy",
            sites: [
              { name: "EUR District", description: "Mussolini's attempt to recreate Roman grandeur" },
              { name: "Museum of Roman Civilization", description: "Models and reconstructions of Roman engineering" }
            ],
            hotel: { name: "The First Roma", location: "Via del Vantaggio", description: "Boutique hotel near the Spanish Steps" }
          }
        ]
      },
      {
        title: "Life in Ancient Rome",
        duration: "5 days",
        description: "Experience daily life in ancient Rome through markets, homes, entertainment, and religious practices of ordinary Romans.",
        itinerary: [
          {
            day: 1,
            title: "Roman Housing and Daily Life",
            sites: [
              { name: "Domus Aurea", description: "Nero's Golden House showing imperial lifestyle" },
              { name: "Case Romane del Celio", description: "Ancient Roman houses beneath a church" }
            ],
            hotel: { name: "Artemide Hotel", location: "Via Nazionale", description: "Modern hotel near ancient Roman sites" }
          },
          {
            day: 2,
            title: "Roman Markets and Commerce",
            sites: [
              { name: "Trajan's Markets", description: "Ancient Roman shopping complex" },
              { name: "Portus", description: "Rome's commercial harbor and warehouses" }
            ],
            hotel: { name: "Artemide Hotel", location: "Via Nazionale", description: "Modern hotel near ancient Roman sites" }
          },
          {
            day: 3,
            title: "Entertainment and Spectacles",
            sites: [
              { name: "Colosseum Arena Floor", description: "Where gladiators fought for entertainment" },
              { name: "Theatre of Balbus", description: "Ancient Roman theater for comedies and dramas" }
            ],
            hotel: { name: "Artemide Hotel", location: "Via Nazionale", description: "Modern hotel near ancient Roman sites" }
          },
          {
            day: 4,
            title: "Roman Religion and Burial",
            sites: [
              { name: "Temple of Vesta", description: "Sacred flame tended by Vestal Virgins" },
              { name: "Pyramid of Cestius", description: "Egyptian-style tomb of Roman magistrate" }
            ],
            hotel: { name: "Artemide Hotel", location: "Via Nazionale", description: "Modern hotel near ancient Roman sites" }
          },
          {
            day: 5,
            title: "Roman Baths and Social Life",
            sites: [
              { name: "Baths of Caracalla", description: "Social center where Romans exercised and bathed" },
              { name: "Terme di Diocleziano", description: "Largest bath complex in ancient Rome" }
            ],
            hotel: { name: "Artemide Hotel", location: "Via Nazionale", description: "Modern hotel near ancient Roman sites" }
          },
          {
            day: 6,
            title: "Pompeii - Frozen in Time",
            sites: [
              { name: "House of the Faun", description: "Wealthy Roman family home with mosaics" },
              { name: "Lupanar", description: "Ancient Roman brothel showing social reality" }
            ],
            hotel: { name: "Grand Hotel Excelsior Vittoria", location: "Sorrento", description: "Historic hotel with Bay of Naples views" }
          },
          {
            day: 7,
            title: "Roman Gardens and Leisure",
            sites: [
              { name: "Gardens of Sallust", description: "Ancient Roman pleasure gardens" },
              { name: "Horti Lamiani", description: "Imperial gardens with exotic plants" }
            ],
            hotel: { name: "Artemide Hotel", location: "Via Nazionale", description: "Modern hotel near ancient Roman sites" }
          },
          {
            day: 8,
            title: "Roman Food and Dining",
            sites: [
              { name: "Thermopolium", description: "Ancient Roman fast food restaurant in Pompeii" },
              { name: "Monte Testaccio", description: "Hill made of ancient Roman pottery shards" }
            ],
            hotel: { name: "Artemide Hotel", location: "Via Nazionale", description: "Modern hotel near ancient Roman sites" }
          },
          {
            day: 9,
            title: "Roman Education and Culture",
            sites: [
              { name: "Athenaeum", description: "Roman center of learning and lectures" },
              { name: "Library of Trajan", description: "Ancient Roman public library ruins" }
            ],
            hotel: { name: "Artemide Hotel", location: "Via Nazionale", description: "Modern hotel near ancient Roman sites" }
          },
          {
            day: 10,
            title: "Roman Military Life",
            sites: [
              { name: "Castra Praetoria", description: "Barracks of the Praetorian Guard" },
              { name: "Mithraeum", description: "Underground temple where soldiers worshipped Mithras" }
            ],
            hotel: { name: "Artemide Hotel", location: "Via Nazionale", description: "Modern hotel near ancient Roman sites" }
          }
        ]
      }
    ]
  },
  "Ancient Greece": {
    locations: ["greece", "athens", "delphi"],
    tours: [
      {
        title: "Classical Athens and Oracle of Delphi",
        duration: "6 days",
        description: "Experience the birthplace of democracy, philosophy, and theater through the Acropolis, Ancient Agora, and the mystical Oracle at Delphi.",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Athens - Ancient Agora",
            sites: [
              { name: "Ancient Agora", description: "Center of political and commercial life in ancient Athens" },
              { name: "Stoa of Attalos", description: "Reconstructed ancient Greek covered walkway" }
            ],
            hotel: { name: "Hotel Grande Bretagne", location: "Syntagma Square", description: "Historic luxury hotel since 1874" }
          },
          {
            day: 2,
            title: "Acropolis and Parthenon",
            sites: [
              { name: "Parthenon", description: "Temple dedicated to Athena on the Acropolis" },
              { name: "Erechtheion", description: "Ancient Greek temple with the Caryatids" },
              { name: "Acropolis Museum", description: "Modern museum housing Parthenon sculptures" }
            ],
            hotel: { name: "Hotel Grande Bretagne", location: "Syntagma Square", description: "Historic luxury hotel since 1874" }
          },
          {
            day: 3,
            title: "National Archaeological Museum",
            sites: [
              { name: "National Archaeological Museum", description: "World's finest collection of ancient Greek artifacts" },
              { name: "Ancient Cemetery of Kerameikos", description: "Ancient burial ground with sculpted tombstones" }
            ],
            hotel: { name: "Hotel Grande Bretagne", location: "Syntagma Square", description: "Historic luxury hotel since 1874" }
          },
          {
            day: 4,
            title: "Day Trip to Delphi",
            sites: [
              { name: "Oracle of Delphi", description: "Sacred site where Pythia delivered prophecies" },
              { name: "Temple of Apollo", description: "Ruins of the temple where the Oracle resided" },
              { name: "Delphi Archaeological Museum", description: "Treasures from the sanctuary including the Charioteer" }
            ],
            hotel: { name: "Amalia Hotel Delphi", location: "Delphi", description: "Mountain hotel with panoramic views" }
          },
          {
            day: 5,
            title: "Delphi to Athens - Ancient Theater",
            sites: [
              { name: "Ancient Theater of Delphi", description: "Well-preserved theater with mountain views" },
              { name: "Tholos of Athena Pronaia", description: "Circular temple in the sanctuary of Athena" }
            ],
            hotel: { name: "Hotel Grande Bretagne", location: "Syntagma Square", description: "Historic luxury hotel since 1874" }
          },
          {
            day: 6,
            title: "Temple of Poseidon at Sounion",
            sites: [
              { name: "Temple of Poseidon", description: "Clifftop temple overlooking the Aegean Sea" },
              { name: "Cape Sounion", description: "Dramatic headland where Byron carved his name" }
            ],
            hotel: { name: "Hotel Grande Bretagne", location: "Syntagma Square", description: "Historic luxury hotel since 1874" }
          },
          {
            day: 7,
            title: "Ancient Olympia Day Trip",
            sites: [
              { name: "Ancient Olympia", description: "Birthplace of the Olympic Games" },
              { name: "Temple of Zeus", description: "Ruins of the temple that housed the statue of Zeus" },
              { name: "Archaeological Museum of Olympia", description: "Sculptures from the Temple of Zeus" }
            ],
            hotel: { name: "Amalia Hotel Olympia", location: "Olympia", description: "Peaceful hotel near the ancient site" }
          },
          {
            day: 8,
            title: "Mycenae and Epidaurus",
            sites: [
              { name: "Mycenae", description: "Bronze Age citadel of Agamemnon" },
              { name: "Lion Gate", description: "Massive entrance to the Mycenaean palace" },
              { name: "Theater of Epidaurus", description: "Best-preserved ancient Greek theater" }
            ],
            hotel: { name: "Hotel Grande Bretagne", location: "Syntagma Square", description: "Historic luxury hotel since 1874" }
          },
          {
            day: 9,
            title: "Aegina Island - Temple of Aphaia",
            sites: [
              { name: "Temple of Aphaia", description: "Well-preserved Doric temple on Aegina Island" },
              { name: "Aegina Town", description: "Charming port town with neoclassical buildings" }
            ],
            hotel: { name: "Hotel Grande Bretagne", location: "Syntagma Square", description: "Historic luxury hotel since 1874" }
          },
          {
            day: 10,
            title: "Marathon and Departure",
            sites: [
              { name: "Marathon Battlefield", description: "Site of the famous battle against the Persians" },
              { name: "Tumulus of Marathon", description: "Burial mound of Athenian warriors" }
            ],
            hotel: { name: "Hotel Grande Bretagne", location: "Syntagma Square", description: "Historic luxury hotel since 1874" }
          }
        ]
      }
    ]
  },
  "Mesopotamia": {
    locations: ["iraq", "babylon", "mesopotamia"],
    tours: [
      {
        title: "Cradle of Civilization Tour",
        duration: "5 days",
        description: "Explore the birthplace of writing, law, and urban civilization through the ruins of Babylon, Ur, and other Mesopotamian sites.",
        itinerary: [
          {
            day: 1,
            title: "Baghdad and Ancient Babylon",
            sites: [
              { name: "National Museum of Iraq", description: "Mesopotamian artifacts and cuneiform tablets" },
              { name: "Babylon Archaeological Site", description: "Ruins of the ancient city and Hanging Gardens" }
            ],
            hotel: { name: "Baghdad Hotel", location: "Central Baghdad", description: "Historic hotel in the heart of the city" }
          }
        ]
      }
    ]
  },
  "Ancient China": {
    locations: ["china", "beijing", "xian"],
    tours: [
      {
        title: "Imperial China and Terracotta Warriors",
        duration: "8 days",
        description: "Journey through China's imperial past from the Forbidden City to the Terracotta Army, exploring temples, palaces, and ancient traditions.",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Beijing - Forbidden City",
            sites: [
              { name: "Forbidden City", description: "Imperial palace complex of the Ming and Qing dynasties" },
              { name: "Tiananmen Square", description: "Historic square at the heart of Beijing" }
            ],
            hotel: { name: "Hotel Éclat Beijing", location: "Chaoyang District", description: "Luxury hotel blending traditional and contemporary design" }
          },
          {
            day: 2,
            title: "Temple of Heaven and Summer Palace",
            sites: [
              { name: "Temple of Heaven", description: "Sacred complex where emperors prayed for good harvests" },
              { name: "Summer Palace", description: "Imperial garden and palace with Kunming Lake" }
            ],
            hotel: { name: "Hotel Éclat Beijing", location: "Chaoyang District", description: "Luxury hotel blending traditional and contemporary design" }
          },
          {
            day: 3,
            title: "Great Wall of China",
            sites: [
              { name: "Mutianyu Section", description: "Best-preserved section of the Great Wall" },
              { name: "Ming Tombs", description: "Burial site of 13 Ming Dynasty emperors" }
            ],
            hotel: { name: "Commune by the Great Wall", location: "Badaling", description: "Architectural resort near the Great Wall" }
          },
          {
            day: 4,
            title: "Travel to Xi'an - Ancient City Wall",
            sites: [
              { name: "Xi'an City Wall", description: "Best-preserved ancient city wall in China" },
              { name: "Muslim Quarter", description: "Historic Islamic district with traditional architecture" }
            ],
            hotel: { name: "Shangri-La Hotel Xi'an", location: "Xi'an", description: "Luxury hotel near the city center" }
          },
          {
            day: 5,
            title: "Terracotta Warriors",
            sites: [
              { name: "Terracotta Army", description: "Thousands of life-sized clay soldiers guarding Emperor Qin's tomb" },
              { name: "Emperor Qin Shi Huang's Mausoleum", description: "Tomb of China's first emperor" }
            ],
            hotel: { name: "Shangri-La Hotel Xi'an", location: "Xi'an", description: "Luxury hotel near the city center" }
          },
          {
            day: 6,
            title: "Big Wild Goose Pagoda and Shaanxi Museum",
            sites: [
              { name: "Big Wild Goose Pagoda", description: "Ancient Buddhist pagoda from the Tang Dynasty" },
              { name: "Shaanxi History Museum", description: "Premier museum of Chinese ancient history" }
            ],
            hotel: { name: "Shangri-La Hotel Xi'an", location: "Xi'an", description: "Luxury hotel near the city center" }
          },
          {
            day: 7,
            title: "Return to Beijing - Hutongs",
            sites: [
              { name: "Hutong Neighborhoods", description: "Traditional narrow alleys with courtyard houses" },
              { name: "Lama Temple", description: "Largest Tibetan Buddhist temple in Beijing" }
            ],
            hotel: { name: "Hotel Éclat Beijing", location: "Chaoyang District", description: "Luxury hotel blending traditional and contemporary design" }
          },
          {
            day: 8,
            title: "Beijing National Museum and Departure",
            sites: [
              { name: "National Museum of China", description: "Comprehensive collection of Chinese artifacts" },
              { name: "Wangfujing Street", description: "Historic shopping street with traditional snacks" }
            ],
            hotel: { name: "Hotel Éclat Beijing", location: "Chaoyang District", description: "Luxury hotel blending traditional and contemporary design" }
          },
          {
            day: 9,
            title: "Temple of Confucius and Ancient Observatory",
            sites: [
              { name: "Temple of Confucius", description: "Sacred temple dedicated to the great philosopher" },
              { name: "Ancient Observatory", description: "Ming Dynasty astronomical instruments" }
            ],
            hotel: { name: "Hotel Éclat Beijing", location: "Chaoyang District", description: "Luxury hotel blending traditional and contemporary design" }
          },
          {
            day: 10,
            title: "Jingshan Park and Final Exploration",
            sites: [
              { name: "Jingshan Park", description: "Hill park with panoramic views of the Forbidden City" },
              { name: "Beihai Park", description: "Imperial garden with White Pagoda" }
            ],
            hotel: { name: "Hotel Éclat Beijing", location: "Chaoyang District", description: "Luxury hotel blending traditional and contemporary design" }
          }
        ]
      }
    ]
  },
  "Ancient India": {
    locations: ["india", "delhi", "agra", "rajasthan"],
    tours: [
      {
        title: "Mughal Empire and Rajput Kingdoms",
        duration: "7 days",
        description: "Discover India's rich heritage through magnificent palaces, temples, and the iconic Taj Mahal, exploring the legacy of the Mughal Empire.",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Delhi - Red Fort",
            sites: [
              { name: "Red Fort", description: "Mughal fortress and palace complex" },
              { name: "Jama Masjid", description: "Largest mosque in India built by Shah Jahan" }
            ],
            hotel: { name: "The Imperial New Delhi", location: "Connaught Place", description: "Colonial-era luxury hotel from 1936" }
          },
          {
            day: 2,
            title: "Old Delhi and Mughal Heritage",
            sites: [
              { name: "Humayun's Tomb", description: "Precursor to the Taj Mahal architecture" },
              { name: "Qutub Minar", description: "Medieval minaret and UNESCO World Heritage site" }
            ],
            hotel: { name: "The Imperial New Delhi", location: "Connaught Place", description: "Colonial-era luxury hotel from 1936" }
          },
          {
            day: 3,
            title: "Travel to Agra - Taj Mahal",
            sites: [
              { name: "Taj Mahal", description: "Iconic marble mausoleum and UNESCO World Heritage site" },
              { name: "Mehtab Bagh", description: "Garden complex with views of the Taj Mahal" }
            ],
            hotel: { name: "The Oberoi Amarvilas", location: "Agra", description: "Luxury hotel with Taj Mahal views" }
          },
          {
            day: 4,
            title: "Agra Fort and Local Crafts",
            sites: [
              { name: "Agra Fort", description: "Red sandstone Mughal fortress" },
              { name: "Tomb of Itimad-ud-Daulah", description: "Baby Taj built before the Taj Mahal" }
            ],
            hotel: { name: "The Oberoi Amarvilas", location: "Agra", description: "Luxury hotel with Taj Mahal views" }
          },
          {
            day: 5,
            title: "Fatehpur Sikri - Ghost City",
            sites: [
              { name: "Fatehpur Sikri", description: "Abandoned Mughal city built by Akbar" },
              { name: "Buland Darwaza", description: "Magnificent gateway to the imperial city" }
            ],
            hotel: { name: "The Oberoi Amarvilas", location: "Agra", description: "Luxury hotel with Taj Mahal views" }
          },
          {
            day: 6,
            title: "Travel to Jaipur - Pink City",
            sites: [
              { name: "City Palace", description: "Royal residence of the Maharaja of Jaipur" },
              { name: "Jantar Mantar", description: "18th-century astronomical observatory" }
            ],
            hotel: { name: "Taj Rambagh Palace", location: "Jaipur", description: "Former royal palace converted to luxury hotel" }
          },
          {
            day: 7,
            title: "Amber Fort and Hawa Mahal",
            sites: [
              { name: "Amber Fort", description: "Hilltop fortress with mirror palace" },
              { name: "Hawa Mahal", description: "Palace of Winds with intricate latticework" }
            ],
            hotel: { name: "Taj Rambagh Palace", location: "Jaipur", description: "Former royal palace converted to luxury hotel" }
          },
          {
            day: 8,
            title: "Pushkar and Ajmer",
            sites: [
              { name: "Pushkar Lake", description: "Sacred lake with 52 ghats" },
              { name: "Brahma Temple", description: "One of the few temples dedicated to Lord Brahma" }
            ],
            hotel: { name: "Taj Rambagh Palace", location: "Jaipur", description: "Former royal palace converted to luxury hotel" }
          },
          {
            day: 9,
            title: "Udaipur - Venice of the East",
            sites: [
              { name: "City Palace Udaipur", description: "Largest palace complex in Rajasthan" },
              { name: "Lake Pichola", description: "Artificial freshwater lake with palace views" }
            ],
            hotel: { name: "Taj Lake Palace", location: "Lake Pichola", description: "Palace hotel floating on the lake" }
          },
          {
            day: 10,
            title: "Temples and Gardens",
            sites: [
              { name: "Jagdish Temple", description: "Large Hindu temple dedicated to Vishnu" },
              { name: "Saheliyon Ki Bari", description: "Garden of the Maidens with fountains" }
            ],
            hotel: { name: "Taj Lake Palace", location: "Lake Pichola", description: "Palace hotel floating on the lake" }
          }
        ]
      }
    ]
  },
  "Maya Civilization": {
    locations: ["mexico", "guatemala", "yucatan"],
    tours: [
      {
        title: "Maya Temples and Codices",
        duration: "6 days",
        description: "Explore the sophisticated Maya civilization through jungle temples, astronomical observatories, and hieroglyphic inscriptions.",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Cancun - Chichen Itza",
            sites: [
              { name: "El Castillo Pyramid", description: "Iconic stepped pyramid dedicated to Kukulkan" },
              { name: "Great Ball Court", description: "Largest ball court in ancient Mesoamerica" }
            ],
            hotel: { name: "Mayaland Hotel & Bungalows", location: "Chichen Itza", description: "Historic hotel within the archaeological zone" }
          },
          {
            day: 2,
            title: "Chichen Itza - Observatory and Cenote",
            sites: [
              { name: "El Caracol Observatory", description: "Ancient Maya astronomical observatory" },
              { name: "Sacred Cenote", description: "Natural well where Maya conducted ceremonies" }
            ],
            hotel: { name: "Mayaland Hotel & Bungalows", location: "Chichen Itza", description: "Historic hotel within the archaeological zone" }
          },
          {
            day: 3,
            title: "Travel to Palenque - Jungle Temples",
            sites: [
              { name: "Temple of Inscriptions", description: "Tomb of Pakal the Great with hieroglyphic texts" },
              { name: "Palace Complex", description: "Administrative center with unique tower" }
            ],
            hotel: { name: "Chan-Kah Resort Village", location: "Palenque", description: "Eco-resort in the Chiapas jungle" }
          },
          {
            day: 4,
            title: "Palenque - Temple of the Cross",
            sites: [
              { name: "Temple of the Cross", description: "Sacred temple with creation mythology reliefs" },
              { name: "Temple of the Sun", description: "Smaller temple with jaguar throne" }
            ],
            hotel: { name: "Chan-Kah Resort Village", location: "Palenque", description: "Eco-resort in the Chiapas jungle" }
          },
          {
            day: 5,
            title: "Uxmal - Pyramid of the Magician",
            sites: [
              { name: "Pyramid of the Magician", description: "Oval-based pyramid unique in Maya architecture" },
              { name: "Nunnery Quadrangle", description: "Complex with intricate stone mosaics" }
            ],
            hotel: { name: "Hacienda Uxmal Plantation & Museum", location: "Uxmal", description: "Colonial hacienda near the ruins" }
          },
          {
            day: 6,
            title: "Coba - Jungle Pyramids",
            sites: [
              { name: "Nohoch Mul Pyramid", description: "Tallest Maya pyramid that can still be climbed" },
              { name: "Ball Court of Coba", description: "Ancient ball court surrounded by jungle" }
            ],
            hotel: { name: "Coco Tulum", location: "Tulum", description: "Beachfront eco-resort" }
          },
          {
            day: 7,
            title: "Tulum - Cliff Castle",
            sites: [
              { name: "El Castillo Tulum", description: "Maya fortress overlooking the Caribbean Sea" },
              { name: "Temple of the Frescoes", description: "Temple with original Maya murals" }
            ],
            hotel: { name: "Coco Tulum", location: "Tulum", description: "Beachfront eco-resort" }
          },
          {
            day: 8,
            title: "Tikal, Guatemala - Lost City",
            sites: [
              { name: "Temple of the Grand Jaguar", description: "Towering temple in Guatemala jungle" },
              { name: "Temple of the Mask", description: "Another major pyramid at Tikal" }
            ],
            hotel: { name: "Jungle Lodge Tikal", location: "Tikal National Park", description: "Lodge within the biosphere reserve" }
          },
          {
            day: 9,
            title: "Yaxha - Sunrise Temple",
            sites: [
              { name: "Yaxha Ruins", description: "Maya city with lake views" },
              { name: "Structure 216", description: "Temple offering panoramic jungle views" }
            ],
            hotel: { name: "Jungle Lodge Tikal", location: "Tikal National Park", description: "Lodge within the biosphere reserve" }
          },
          {
            day: 10,
            title: "Maya Museum and Departure",
            sites: [
              { name: "Museo Nacional de Arqueología", description: "Guatemala's premier Maya artifact collection" },
              { name: "Jade Museum", description: "Ancient Maya jade craftsmanship" }
            ],
            hotel: { name: "Hotel Casa Santo Domingo", location: "Antigua Guatemala", description: "Colonial hotel in historic city" }
          }
        ]
      }
    ]
  },
  "Inca Empire": {
    locations: ["peru", "cusco", "machu-picchu"],
    tours: [
      {
        title: "Inca Trail to Machu Picchu",
        duration: "5 days",
        description: "Follow ancient Inca paths to the lost city of Machu Picchu, exploring terraced temples and sophisticated stonework.",
        itinerary: [
          {
            day: 1,
            title: "Cusco - Imperial Capital",
            sites: [
              { name: "Qorikancha Temple", description: "Temple of the Sun with Spanish colonial overlay" },
              { name: "Sacsayhuamán", description: "Massive stone fortress overlooking Cusco" }
            ],
            hotel: { name: "Belmond Hotel Monasterio", location: "Cusco", description: "16th-century monastery converted to luxury hotel" }
          },
          {
            day: 2,
            title: "Sacred Valley",
            sites: [
              { name: "Ollantaytambo", description: "Living Inca town with original urban planning" },
              { name: "Pisac Market", description: "Traditional Andean market and ruins" }
            ],
            hotel: { name: "Belmond Hotel Rio Sagrado", location: "Sacred Valley", description: "Riverside hotel in the heart of the Sacred Valley" }
          }
        ]
      }
    ]
  },
  "Ancient Japan": {
    locations: ["japan", "kyoto", "nara"],
    tours: [
      {
        title: "Imperial Japan and Samurai Heritage",
        duration: "6 days",
        description: "Experience Japan's ancient culture through imperial palaces, Buddhist temples, and traditional gardens from the Heian period.",
        itinerary: [
          {
            day: 1,
            title: "Kyoto - Golden Pavilion",
            sites: [
              { name: "Kinkaku-ji (Golden Pavilion)", description: "Iconic gold-covered Zen temple" },
              { name: "Fushimi Inari Shrine", description: "Thousands of vermillion torii gates" }
            ],
            hotel: { name: "The Ritz-Carlton Kyoto", location: "Kamogawa River", description: "Luxury hotel blending traditional and modern Japanese design" }
          },
          {
            day: 2,
            title: "Nara - Ancient Capital",
            sites: [
              { name: "Todai-ji Temple", description: "Massive wooden temple housing giant bronze Buddha" },
              { name: "Kasuga Taisha", description: "Shinto shrine famous for stone lanterns" }
            ],
            hotel: { name: "Nara Hotel", location: "Nara Park", description: "Historic hotel from 1909 near deer park" }
          }
        ]
      }
    ]
  },
  "Viking Age": {
    locations: ["norway", "sweden", "iceland"],
    tours: [
      {
        title: "Viking Explorers and Norse Mythology",
        duration: "7 days",
        description: "Trace the footsteps of Viking explorers through fjords, ancient settlements, and archaeological sites across Scandinavia.",
        itinerary: [
          {
            day: 1,
            title: "Oslo - Viking Ship Museum",
            sites: [
              { name: "Viking Ship Museum", description: "World's best-preserved Viking ships" },
              { name: "Norwegian Folk Museum", description: "Stave churches and traditional buildings" }
            ],
            hotel: { name: "Hotel Continental Oslo", location: "Central Oslo", description: "Historic luxury hotel from 1900" }
          },
          {
            day: 2,
            title: "Bergen - Medieval Hanseatic League",
            sites: [
              { name: "Bryggen", description: "UNESCO World Heritage Hanseatic wharf" },
              { name: "Bergenhus Fortress", description: "Medieval fortress and royal residence" }
            ],
            hotel: { name: "Hotel Norge by Scandic", location: "Bergen Center", description: "Historic hotel in the heart of Bergen" }
          }
        ]
      }
    ]
  },
  "Celtic Civilization": {
    locations: ["ireland", "scotland", "wales"],
    tours: [
      {
        title: "Celtic Druids and Ancient Ireland",
        duration: "6 days",
        description: "Explore Celtic heritage through ancient stone circles, medieval monasteries, and mythical landscapes of Ireland and Scotland.",
        itinerary: [
          {
            day: 1,
            title: "Dublin - Celtic Heritage",
            sites: [
              { name: "Trinity College Library", description: "Book of Kells and ancient Irish manuscripts" },
              { name: "National Museum of Ireland", description: "Celtic gold artifacts and bog bodies" }
            ],
            hotel: { name: "The Shelbourne", location: "St. Stephen's Green", description: "Historic hotel from 1824" }
          },
          {
            day: 2,
            title: "Newgrange - Neolithic Monument",
            sites: [
              { name: "Newgrange", description: "5,000-year-old passage tomb older than Stonehenge" },
              { name: "Hill of Tara", description: "Ancient seat of the High Kings of Ireland" }
            ],
            hotel: { name: "Bellinter House", location: "County Meath", description: "Georgian manor house hotel" }
          }
        ]
      }
    ]
  }
};

function generateTours(selectedPeriods: string[], selectedEras: string[], selectedLocations: string[]): any {
  console.log("Generating tours for:", { selectedPeriods, selectedEras, selectedLocations });
  
  let availableTours: any[] = [];
  
  // Match tours based on selected eras
  for (const era of selectedEras) {
    if (tourTemplates[era as keyof typeof tourTemplates]) {
      const template = tourTemplates[era as keyof typeof tourTemplates];
      
      // Filter tours by location if specified
      if (selectedLocations.length > 0) {
        const matchingTours = template.tours.filter(tour => 
          selectedLocations.some(loc => 
            template.locations.some(tLoc => 
              tLoc.toLowerCase().includes(loc.toLowerCase()) || 
              loc.toLowerCase().includes(tLoc.toLowerCase())
            )
          )
        );
        availableTours.push(...matchingTours);
      } else {
        availableTours.push(...template.tours);
      }
    }
  }
  
  // If no era-specific tours found, generate based on periods and locations
  if (availableTours.length === 0) {
    for (const period of selectedPeriods) {
      if (period === "ancient") {
        // Add tours from ancient civilizations based on location
        if (selectedLocations.includes("egypt")) {
          availableTours.push(...tourTemplates["Ancient Egypt"].tours);
        }
        if (selectedLocations.includes("rome") || selectedLocations.includes("italy")) {
          availableTours.push(...tourTemplates["Ancient Rome"].tours);
        }
        if (selectedLocations.includes("greece")) {
          availableTours.push(...tourTemplates["Ancient Greece"].tours);
        }
        if (selectedLocations.includes("china") || selectedLocations.includes("beijing")) {
          availableTours.push(...tourTemplates["Ancient China"].tours);
        }
        if (selectedLocations.includes("india") || selectedLocations.includes("delhi")) {
          availableTours.push(...tourTemplates["Ancient India"].tours);
        }
        if (selectedLocations.includes("japan") || selectedLocations.includes("kyoto")) {
          availableTours.push(...tourTemplates["Ancient Japan"].tours);
        }
        if (selectedLocations.includes("peru") || selectedLocations.includes("cusco")) {
          availableTours.push(...tourTemplates["Inca Empire"].tours);
        }
        if (selectedLocations.includes("mexico") || selectedLocations.includes("yucatan")) {
          availableTours.push(...tourTemplates["Maya Civilization"].tours);
        }
        if (selectedLocations.includes("norway") || selectedLocations.includes("sweden")) {
          availableTours.push(...tourTemplates["Viking Age"].tours);
        }
        if (selectedLocations.includes("ireland") || selectedLocations.includes("scotland")) {
          availableTours.push(...tourTemplates["Celtic Civilization"].tours);
        }
      }
      if (period === "medieval") {
        // Add medieval tours
        if (selectedLocations.includes("norway") || selectedLocations.includes("sweden")) {
          availableTours.push(...tourTemplates["Viking Age"].tours);
        }
        if (selectedLocations.includes("ireland") || selectedLocations.includes("scotland")) {
          availableTours.push(...tourTemplates["Celtic Civilization"].tours);
        }
      }
      if (period === "classical") {
        // Add classical period tours
        if (selectedLocations.includes("rome") || selectedLocations.includes("italy")) {
          availableTours.push(...tourTemplates["Ancient Rome"].tours);
        }
        if (selectedLocations.includes("greece")) {
          availableTours.push(...tourTemplates["Ancient Greece"].tours);
        }
      }
    }
  }
  
  // Ensure we have at least some tours
  if (availableTours.length === 0) {
    availableTours = [
      {
        title: "Ancient Civilizations Explorer",
        duration: "5 days",
        description: "A comprehensive journey through the most significant archaeological sites and museums of the ancient world.",
        itinerary: [
          {
            day: 1,
            title: "Archaeological Wonders",
            sites: [
              { name: "Ancient Ruins", description: "Explore well-preserved archaeological remains" },
              { name: "Heritage Museum", description: "Comprehensive collection of historical artifacts" }
            ],
            hotel: { name: "Heritage Grand Hotel", location: "Historic District", description: "Luxury accommodation in culturally rich area" }
          }
        ]
      }
    ];
  }
  
  // Create unique tours with duration options
  const uniqueTours = new Map();
  
  availableTours.forEach((template, templateIndex) => {
    const tourKey = template.title;
    
    if (!uniqueTours.has(tourKey)) {
      const baseId = (templateIndex * 10) + 1001;
      
      // Create duration variations for this tour
      const durationOptions = [
        { duration: "3 days", days: 3 },
        { duration: "5 days", days: 5 },
        { duration: "7 days", days: 7 },
        { duration: "10 days", days: 10 }
      ];

      const durationVariations = durationOptions.map(({ duration, days }) => {
        let itinerary = template.itinerary.slice(0, days);
        
        // For 10-day tours, extend itinerary if needed
        if (days === 10 && itinerary.length < 10) {
          const additionalDays = [];
          for (let i = itinerary.length; i < 10; i++) {
            const dayTemplate = template.itinerary[i % template.itinerary.length];
            additionalDays.push({
              ...dayTemplate,
              day: i + 1,
              title: `${dayTemplate.title} (Extended)`
            });
          }
          itinerary = [...itinerary, ...additionalDays];
        }

        return {
          duration,
          days,
          itinerary: itinerary.map((day: any, index: number) => ({
            ...day,
            day: index + 1
          }))
        };
      });

      uniqueTours.set(tourKey, {
        id: baseId,
        title: template.title,
        description: template.description,
        durationOptions: durationVariations,
        defaultDuration: "7 days" // Default to 7 days
      });
    }
  });
  
  // Return unique tours with duration options
  return { tours: Array.from(uniqueTours.values()) };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Local Tour Generation endpoint
  app.post("/api/generate-tours", async (req, res) => {
    try {
      console.log("Generating tours locally...");
      console.log("Request body:", req.body);
      
      const { selectedPeriods, selectedEras, selectedLocations } = req.body;
      
      if (!selectedPeriods?.length && !selectedEras?.length) {
        return res.status(400).json({ message: "Please select at least one historical period or era" });
      }

      const tours = generateTours(selectedPeriods || [], selectedEras || [], selectedLocations || []);
      
      console.log("Generated tours:", tours);
      res.json(tours);
      
    } catch (error: any) {
      console.error("Tour generation error:", error);
      console.error("Error details:", error?.message, error?.stack);
      res.status(500).json({ 
        message: "Failed to generate tours. Please try again.",
        error: error?.message || "Unknown error"
      });
    }
  });

  // Get detailed tour by ID with duration
  app.get("/api/tours/:id/details", async (req, res) => {
    try {
      const tourId = parseInt(req.params.id);
      const duration = req.query.duration as string || "7 days";
      console.log("Getting tour details for ID:", tourId, "with duration:", duration);
      
      // Find the tour template by searching through all available templates
      let foundTemplate = null;
      let templateFound = false;
      
      // Search through all tour templates to find the one with matching ID
      for (const [eraName, eraData] of Object.entries(tourTemplates)) {
        const template = eraData.tours.find((tour: any, index: number) => {
          const baseId = (index * 10) + 1001;
          return baseId === tourId;
        });
        
        if (template) {
          foundTemplate = template;
          templateFound = true;
          break;
        }
      }
      
      if (!foundTemplate) {
        return res.status(404).json({ message: "Tour not found" });
      }
      
      // Create the tour with the requested duration
      const durationNumber = parseInt(duration.split(' ')[0]);
      let itinerary = foundTemplate.itinerary.slice(0, durationNumber);
      
      // For 10-day tours, extend itinerary if needed
      if (durationNumber === 10 && itinerary.length < 10) {
        const additionalDays = [];
        for (let i = itinerary.length; i < 10; i++) {
          const dayTemplate = foundTemplate.itinerary[i % foundTemplate.itinerary.length];
          additionalDays.push({
            ...dayTemplate,
            day: i + 1,
            title: `${dayTemplate.title} (Extended)`
          });
        }
        itinerary = [...itinerary, ...additionalDays];
      }

      const tourDetails = {
        id: tourId,
        title: foundTemplate.title,
        duration: duration,
        description: foundTemplate.description,
        itinerary: itinerary.map((day: any, index: number) => ({
          ...day,
          day: index + 1
        }))
      };
      
      res.json(tourDetails);
    } catch (error: any) {
      console.error("Tour details error:", error);
      res.status(500).json({ 
        message: "Failed to get tour details",
        error: error?.message || "Unknown error"
      });
    }
  });

  // Emperor routes
  app.get("/api/emperors", async (req, res) => {
    try {
      const emperors = await storage.getAllEmperors();
      res.json(emperors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emperors" });
    }
  });

  app.get("/api/emperors/:id", async (req, res) => {
    try {
      const emperor = await storage.getEmperor(parseInt(req.params.id));
      if (!emperor) {
        return res.status(404).json({ message: "Emperor not found" });
      }
      res.json(emperor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emperor" });
    }
  });

  // Tour routes
  app.get("/api/tours", async (req, res) => {
    try {
      const tours = await storage.getAllTours();
      res.json(tours);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tours" });
    }
  });

  app.get("/api/tours/:id", async (req, res) => {
    try {
      const tour = await storage.getTour(parseInt(req.params.id));
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      res.json(tour);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour" });
    }
  });

  // Tour details endpoint for generated tours
  app.get("/api/tours/:id/details", async (req, res) => {
    try {
      const tourId = parseInt(req.params.id);
      
      // Check if it's a generated tour from local templates
      if (tourId >= 1000) {
        // Generate all possible tours and find the matching one
        const allGeneratedTours: any[] = [];
        
        // Generate tours for all combinations to find the exact match
        Object.entries(tourTemplates).forEach(([civilization, data]) => {
          const baseId = civilization === "Ancient Egypt" ? 1001 : 
                       civilization === "Ancient Rome" ? 1005 :
                       civilization === "Ancient Greece" ? 1009 :
                       civilization === "Ancient China" ? 1013 :
                       civilization === "Ancient India" ? 1017 :
                       civilization === "Maya Civilization" ? 1021 :
                       civilization === "Inca Empire" ? 1025 :
                       civilization === "Viking Age" ? 1029 :
                       civilization === "Celtic Civilization" ? 1033 : 1001;

          data.tours.forEach((template) => {
            const durations = [
              { duration: "3 days", days: 3, offset: 0 },
              { duration: "5 days", days: 5, offset: 1 },
              { duration: "7 days", days: 7, offset: 2 },
              { duration: "10 days", days: 10, offset: 3 }
            ];

            durations.forEach(({ duration, days, offset }) => {
              const generatedTourId = baseId + offset;
              let itinerary = template.itinerary.slice(0, days);
              
              // For 10-day tours, extend itinerary if needed
              if (days === 10 && itinerary.length < 10) {
                const additionalDays = [];
                for (let i = itinerary.length; i < 10; i++) {
                  const dayTemplate = template.itinerary[i % template.itinerary.length];
                  additionalDays.push({
                    ...dayTemplate,
                    day: i + 1,
                    title: `${dayTemplate.title} (Extended)`
                  });
                }
                itinerary = [...itinerary, ...additionalDays];
              }

              allGeneratedTours.push({
                id: generatedTourId,
                title: template.title,
                duration,
                description: template.description,
                itinerary: itinerary.map((day, index) => ({
                  ...day,
                  day: index + 1
                }))
              });
            });
          });
        });
        
        const foundTour = allGeneratedTours.find(tour => tour.id === tourId);
        
        if (!foundTour) {
          return res.status(404).json({ message: "Tour not found" });
        }
        
        res.json(foundTour);
        return;
      }
      
      // Otherwise try to get from database
      const tour = await storage.getTour(tourId);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      
      // Get itineraries for database tours
      const itineraries = await storage.getItinerariesForTour(tourId);
      const tourWithItinerary = {
        ...tour,
        itinerary: itineraries
      };
      
      res.json(tourWithItinerary);
    } catch (error) {
      console.error("Error fetching tour details:", error);
      res.status(500).json({ message: "Failed to fetch tour details" });
    }
  });

  // Tour itineraries route
  app.get("/api/tours/:id/itineraries", async (req, res) => {
    try {
      const tourId = parseInt(req.params.id);
      if (isNaN(tourId)) {
        return res.status(400).json({ message: "Invalid tour ID" });
      }
      const itineraries = await storage.getItinerariesForTour(tourId);
      res.json(itineraries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour itineraries" });
    }
  });

  // Tour hotels route
  app.get("/api/tours/:id/hotels", async (req, res) => {
    try {
      const hotels = await storage.getHotelsForTour(parseInt(req.params.id));
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour hotels" });
    }
  });

  // Add new era route
  app.get("/api/eras", async (req, res) => {
    try {
      const eras = await storage.getAllEras();
      res.json(eras);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch eras" });
    }
  });

  // Generate single era image
  app.post("/api/generate-era-image", async (req, res) => {
    try {
      const { eraName, eraDescription } = req.body;
      
      if (!eraName || !eraDescription) {
        return res.status(400).json({ message: "Era name and description are required" });
      }

      // Check if image already exists in database
      const existingImage = await storage.getEraImage(eraName);
      if (existingImage) {
        return res.json({ imageUrl: existingImage.imageUrl, eraName });
      }

      const imagePath = `client/public/era-images/${eraName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      
      // Create directory if it doesn't exist
      const dir = 'client/public/era-images';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const { imageUrl, description } = await generateEraImage(eraName, eraDescription, imagePath);
      
      // Save to database
      await storage.createEraImage({
        eraName,
        imageUrl,
        imageDescription: description || eraDescription
      });
      
      res.json({ imageUrl, eraName });
    } catch (error: any) {
      console.error("Era image generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate era image",
        error: error?.message || "Unknown error"
      });
    }
  });

  // Get all era images from database
  app.get("/api/era-images", async (req, res) => {
    try {
      const images = await storage.getAllEraImages();
      const imageUrls: Record<string, string> = {};
      images.forEach(img => {
        imageUrls[img.eraName] = img.imageUrl;
      });
      res.json({ imageUrls });
    } catch (error: any) {
      console.error("Error fetching era images:", error);
      res.status(500).json({ 
        message: "Failed to fetch era images",
        error: error?.message || "Unknown error"
      });
    }
  });

  // Generate all era images
  app.post("/api/generate-all-era-images", async (req, res) => {
    try {
      const eras = [
        { name: "Egypt", description: "Ancient Egypt with pyramids, pharaohs, and Nile River civilization", year: "3100 - 30 BCE" },
        { name: "Mesopotamia", description: "Cradle of civilization with ziggurats, cuneiform writing, and ancient cities like Babylon", year: "3500 - 539 BCE" },
        { name: "Greece", description: "Ancient Greece with Parthenon, democracy, philosophy, and Olympic Games", year: "800 - 146 BCE" },
        { name: "Rome", description: "Roman Empire with Colosseum, gladiators, aqueducts, and imperial conquest", year: "753 BCE - 476 CE" },
        { name: "Roman Empire", description: "Peak of Roman power with grand architecture, legions, and vast territorial control", year: "27 BCE - 476 CE" },
        { name: "Byzantine Empire", description: "Eastern Roman Empire with Orthodox Christianity, Constantinople, and Byzantine art", year: "330 - 1453 CE" },
        { name: "Ancient China", description: "Imperial China with Great Wall, Silk Road, terracotta warriors, and ancient dynasties", year: "221 BCE - 220 CE" },
        { name: "Ancient India", description: "Golden Age of India with Buddhism, Hinduism, elaborate temples, and Gupta Empire", year: "600 BCE - 600 CE" },
        { name: "Early Middle Ages", description: "Medieval Europe with castles, knights, monasteries, and feudal kingdoms", year: "476 - 1000 CE" },
        { name: "High Middle Ages", description: "Age of Faith with Gothic cathedrals, Crusades, and chivalric culture", year: "1000 - 1300 CE" },
        { name: "Late Middle Ages", description: "Medieval period with late Gothic architecture, universities, and cultural transformation", year: "1300 - 1500 CE" },
        { name: "Italian Renaissance", description: "Renaissance Italy with artistic masterpieces, Florence, Venice, and cultural rebirth", year: "1400 - 1600 CE" },
        { name: "Northern Renaissance", description: "Northern European Renaissance with printing press, detailed paintings, and cultural flowering", year: "1450 - 1600 CE" },
        { name: "Age of Exploration", description: "Age of Discovery with sailing ships, new world exploration, and maritime adventures", year: "1400 - 1600 CE" },
        { name: "Industrial Revolution", description: "Industrial age with steam engines, factories, railways, and technological advancement", year: "1760 - 1840 CE" },
        { name: "World Wars", description: "20th century global conflicts with historical significance and remembrance sites", year: "1914 - 1945 CE" },
        { name: "Space Age", description: "Modern space exploration with rockets, satellites, and technological achievement", year: "1957 - Present" }
      ];

      const imageUrls: Record<string, string> = {};
      
      for (const era of eras) {
        try {
          // Check if image already exists in database
          const existingImage = await storage.getEraImage(era.name);
          if (existingImage) {
            imageUrls[era.name] = existingImage.imageUrl;
            continue;
          }

          const imagePath = `client/public/era-images/${era.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
          
          // Create directory if it doesn't exist
          const dir = 'client/public/era-images';
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          const { imageUrl, description } = await generateEraImage(era.name, era.description, imagePath);
          
          // Save to database
          await storage.createEraImage({
            eraName: era.name,
            imageUrl,
            imageDescription: description || era.description
          });
          
          imageUrls[era.name] = imageUrl;
          
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to generate image for ${era.name}:`, error);
          // Continue with other eras even if one fails
        }
      }
      
      res.json({ imageUrls });
    } catch (error: any) {
      console.error("Era images generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate era images",
        error: error?.message || "Unknown error"
      });
    }
  });

  // Generate tour video using Gemini
  app.post("/api/generate-tour-video", async (req, res) => {
    try {
      const { tourTitle, tourDescription, era, tourId } = req.body;
      
      if (!tourTitle || !tourDescription || !era) {
        return res.status(400).json({ 
          success: false, 
          error: "tourTitle, tourDescription, and era are required" 
        });
      }
      
      // Check if video already exists in database
      if (tourId) {
        const existingVideo = await storage.getTourVideo(tourId, tourTitle);
        if (existingVideo) {
          return res.json({ 
            success: true, 
            videoUrl: existingVideo.videoUrl,
            description: existingVideo.videoDescription,
            fromDatabase: true 
          });
        }
      }
      
      const videoPath = `client/public/videos/${tourTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${tourId || 'video'}.jpg`;
      
      // Create directory if it doesn't exist
      const dir = 'client/public/videos';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const result = await generateTourVideo(tourTitle, tourDescription, era, videoPath);
      
      // Save to database
      if (tourId) {
        const prompt = `Create a cinematic and historically accurate image representing ${tourTitle} in the ${era} era. ${tourDescription}`;
        await storage.createTourVideo({
          tourId,
          tourTitle,
          videoUrl: result.videoUrl,
          videoDescription: result.description,
          prompt
        });
      }
      
      res.json({ 
        success: true, 
        videoUrl: result.videoUrl,
        description: result.description,
        fromDatabase: false 
      });
    } catch (error) {
      console.error("Error generating tour video:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate tour video",
        error: error?.message || "Unknown error"
      });
    }
  });

  // Generate Marcus Aurelius video/image
  app.post("/api/generate-marcus-aurelius-video", async (req, res) => {
    try {
      const videoPath = `client/public/videos/marcus-aurelius-era.jpg`;
      
      // Create directory if it doesn't exist
      const dir = 'client/public/videos';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const { videoUrl, description } = await generateMarcusAureliusVideo(videoPath);
      
      res.json({ 
        videoUrl, 
        description,
        message: "Marcus Aurelius era video/image generated successfully" 
      });
      
    } catch (error: any) {
      console.error("Marcus Aurelius video generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate Marcus Aurelius video",
        error: error?.message || "Unknown error"
      });
    }
  });

  // Generate tour images using Gemini
  app.post("/api/generate-tour-images", async (req, res) => {
    try {
      console.log("Starting tour images generation...");
      const { tours } = req.body;
      
      if (!tours || !Array.isArray(tours)) {
        return res.status(400).json({ 
          success: false, 
          error: "Tours array is required" 
        });
      }

      const imageResults = [];
      
      for (const tour of tours) {
        try {
          // Check if image already exists in database
          const existingImage = await storage.getTourImage(tour.id, tour.title);
          
          if (existingImage) {
            console.log(`Using existing image for tour: ${tour.title}`);
            imageResults.push({
              tourId: tour.id,
              title: tour.title,
              imagePath: existingImage.imageUrl,
              prompt: existingImage.prompt,
              fromDatabase: true
            });
            continue;
          }

          const prompt = `Create a cinematic, historically accurate image of ${tour.title}. ${tour.description}. Show authentic historical architecture, landscapes, and atmosphere from this period. Use dramatic lighting and composition suitable for a premium travel brochure.`;
          
          const imagePath = `client/public/tour-images/${tour.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
          const publicImagePath = `/tour-images/${tour.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;

          
          // Create directory if it doesn't exist
          const dir = 'client/public/tour-images';
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          // Generate image using Gemini  
          const result = await generateEraImage(tour.title, tour.description, imagePath);
          
          // Save to database
          const savedImage = await storage.createTourImage({
            tourId: tour.id,
            tourTitle: tour.title,
            imageUrl: publicImagePath,
            imageDescription: tour.description,
            prompt: prompt
          });
          
          imageResults.push({
            tourId: tour.id,
            title: tour.title,
            imagePath: publicImagePath,
            prompt: prompt,
            fromDatabase: false
          });
          
          console.log(`Generated and saved image for tour: ${tour.title}`);
          
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (tourError) {
          console.error(`Error generating image for tour ${tour.title}:`, tourError);
          imageResults.push({
            tourId: tour.id,
            title: tour.title,
            error: tourError instanceof Error ? tourError.message : "Unknown error"
          });
        }
      }
      
      res.json({ 
        success: true, 
        images: imageResults,
        message: `Generated images for ${imageResults.filter(r => !r.error).length}/${tours.length} tours` 
      });
    } catch (error) {
      console.error("Error generating tour images:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to generate tour images",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get tour images from database
  app.get("/api/tour-images", async (req, res) => {
    try {
      const images = await storage.getAllTourImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching tour images:", error);
      res.status(500).json({ message: "Failed to fetch tour images" });
    }
  });

  // Get tour images by tour ID
  app.get("/api/tour-images/:tourId", async (req, res) => {
    try {
      const tourId = parseInt(req.params.tourId);
      const images = await storage.getTourImagesByTourId(tourId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching tour images:", error);
      res.status(500).json({ message: "Failed to fetch tour images" });
    }
  });

  // Get tour videos from database
  app.get("/api/tour-videos", async (req, res) => {
    try {
      const videos = await storage.getAllTourVideos();
      res.json(videos);
    } catch (error) {
      console.error("Error fetching tour videos:", error);
      res.status(500).json({ message: "Failed to fetch tour videos" });
    }
  });

  // Get tour videos by tour ID
  app.get("/api/tour-videos/:tourId", async (req, res) => {
    try {
      const tourId = parseInt(req.params.tourId);
      const videos = await storage.getTourVideosByTourId(tourId);
      res.json(videos);
    } catch (error) {
      console.error("Error fetching tour videos:", error);
      res.status(500).json({ message: "Failed to fetch tour videos" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}