/**
 * Extracto literal de fichas del archivo oficial para Forma B:
 * "DSY1104 - Forma B - Catalogo Sonido Vivo.xlsx", hoja "Catálogo de Productos".
 * 51 registros concretos (filas 4–54). La hoja declara 340 referencias
 * para el negocio en general; NO se inventan las otras 289 fichas.
 * Precio y stock son valores provistos por el Excel académico, NO datos en vivo.
 */
export const initialProducts = [
  {
    "id": "GA001",
    "categorySlug": "guitarras-acusticas",
    "name": "Guitarra Acústica Folk",
    "brand": "Yamaha",
    "model": "F310",
    "stock": 8,
    "price": 129990,
    "description": "Tapa de abeto, aros y fondo de meranti. Ideal para iniciantes."
  },
  {
    "id": "GA002",
    "categorySlug": "guitarras-acusticas",
    "name": "Guitarra Acústica Dreadnought",
    "brand": "Fender",
    "model": "CD-60S",
    "stock": 5,
    "price": 189990,
    "description": "Tapa de abeto macizo, brazo de caoba. Sonido cálido y proyectado."
  },
  {
    "id": "GA003",
    "categorySlug": "guitarras-acusticas",
    "name": "Guitarra Acústica Clásica 4/4",
    "brand": "Yamaha",
    "model": "C40",
    "stock": 10,
    "price": 89990,
    "description": "Nailon, tapa de abeto. Ideal para estudio y flamenco."
  },
  {
    "id": "GA004",
    "categorySlug": "guitarras-acusticas",
    "name": "Guitarra Electroacústica",
    "brand": "Takamine",
    "model": "GN20CE",
    "stock": 3,
    "price": 349990,
    "description": "Pickup integrado, afinador incorporado."
  },
  {
    "id": "GA005",
    "categorySlug": "guitarras-acusticas",
    "name": "Guitarra 3/4 Niños",
    "brand": "Yamaha",
    "model": "JR1",
    "stock": 6,
    "price": 79990,
    "description": "Tamaño reducido para niños de 6 a 10 años."
  },
  {
    "id": "GE001",
    "categorySlug": "guitarras-electricas",
    "name": "Guitarra Eléctrica Stratocaster",
    "brand": "Squier",
    "model": "Affinity Strat",
    "stock": 5,
    "price": 249990,
    "description": "Cuerpo de álamo, mástil de arce, pastillas SSS."
  },
  {
    "id": "GE002",
    "categorySlug": "guitarras-electricas",
    "name": "Guitarra Eléctrica Les Paul",
    "brand": "Epiphone",
    "model": "Les Paul Std",
    "stock": 4,
    "price": 329990,
    "description": "Cuerpo caoba, tapa arce, pastillas humbucker."
  },
  {
    "id": "GE003",
    "categorySlug": "guitarras-electricas",
    "name": "Guitarra Eléctrica SG",
    "brand": "Epiphone",
    "model": "SG Standard",
    "stock": 3,
    "price": 319990,
    "description": "Cuerpo caoba, mástil caoba, 2 humbuckers."
  },
  {
    "id": "GE004",
    "categorySlug": "guitarras-electricas",
    "name": "Guitarra Eléctrica Telecaster",
    "brand": "Squier",
    "model": "Affinity Tele",
    "stock": 4,
    "price": 239990,
    "description": "Cuerpo álamo, clavijero vintage, 2 pastillas single."
  },
  {
    "id": "GE005",
    "categorySlug": "guitarras-electricas",
    "name": "Guitarra Eléctrica Semi-hollow",
    "brand": "Epiphone",
    "model": "ES-335",
    "stock": 2,
    "price": 549990,
    "description": "Semi-hueca, 2 humbuckers, ideal para jazz y blues."
  },
  {
    "id": "BA001",
    "categorySlug": "bajos-electricos",
    "name": "Bajo Eléctrico 4 Cuerdas",
    "brand": "Squier",
    "model": "Affinity PJ",
    "stock": 5,
    "price": 299990,
    "description": "Pickup PJ, cuerpo álamo, mástil arce."
  },
  {
    "id": "BA002",
    "categorySlug": "bajos-electricos",
    "name": "Bajo Eléctrico Jazz Bass",
    "brand": "Fender",
    "model": "Player Jazz",
    "stock": 2,
    "price": 699990,
    "description": "Alder body, 2 Alnico V Jazz single-coil."
  },
  {
    "id": "BA003",
    "categorySlug": "bajos-electricos",
    "name": "Bajo Acústico 4 Cuerdas",
    "brand": "Yamaha",
    "model": "APX700II",
    "stock": 2,
    "price": 429990,
    "description": "Electroacústico, afinador incorporado."
  },
  {
    "id": "BT001",
    "categorySlug": "baterias",
    "name": "Batería Acústica 5 piezas",
    "brand": "Pearl",
    "model": "Roadshow",
    "stock": 2,
    "price": 599990,
    "description": "Incluye stands, platillos y pedal de bombo."
  },
  {
    "id": "BT002",
    "categorySlug": "baterias",
    "name": "Batería Electrónica 8 pads",
    "brand": "Roland",
    "model": "TD-02KV",
    "stock": 2,
    "price": 799990,
    "description": "Módulo TD-02, 8 pads de goma, pedal hi-hat."
  },
  {
    "id": "BT003",
    "categorySlug": "baterias",
    "name": "Caja Snare 14\"",
    "brand": "Pearl",
    "model": "STE1450",
    "stock": 4,
    "price": 89990,
    "description": "Acero, 14x5\", 10 tensores."
  },
  {
    "id": "BT004",
    "categorySlug": "baterias",
    "name": "Platillo Hi-Hat 14\"",
    "brand": "Zildjian",
    "model": "A Series",
    "stock": 3,
    "price": 149990,
    "description": "Latón B20, sonido brillante y claro."
  },
  {
    "id": "BT005",
    "categorySlug": "baterias",
    "name": "Platillo Crash 16\"",
    "brand": "Zildjian",
    "model": "A Series",
    "stock": 3,
    "price": 129990,
    "description": "Latón B20, ataque rápido."
  },
  {
    "id": "TC001",
    "categorySlug": "teclados-y-pianos",
    "name": "Teclado Digital 61 teclas",
    "brand": "Yamaha",
    "model": "PSR-E373",
    "stock": 4,
    "price": 249990,
    "description": "61 teclas sensibles al tacto, 622 voces."
  },
  {
    "id": "TC002",
    "categorySlug": "teclados-y-pianos",
    "name": "Piano Digital 88 teclas",
    "brand": "Yamaha",
    "model": "P-45",
    "stock": 2,
    "price": 499990,
    "description": "88 teclas pesadas, 10 voces, pedal sustain incluido."
  },
  {
    "id": "TC003",
    "categorySlug": "teclados-y-pianos",
    "name": "Sintetizador 49 teclas",
    "brand": "Arturia",
    "model": "MiniLab MKII",
    "stock": 5,
    "price": 129990,
    "description": "MIDI controller, 49 mini teclas."
  },
  {
    "id": "TC004",
    "categorySlug": "teclados-y-pianos",
    "name": "Teclado MIDI 88 teclas",
    "brand": "M-Audio",
    "model": "Hammer 88",
    "stock": 2,
    "price": 399990,
    "description": "88 teclas martillo, sin sonidos propios."
  },
  {
    "id": "AM001",
    "categorySlug": "amplificadores",
    "name": "Amplificador Guitarra 15W",
    "brand": "Fender",
    "model": "Frontman 15G",
    "stock": 5,
    "price": 99990,
    "description": "15W, distorsión incorporada, entrada auxiliar."
  },
  {
    "id": "AM002",
    "categorySlug": "amplificadores",
    "name": "Amplificador Guitarra 40W",
    "brand": "Marshall",
    "model": "MG40GFX",
    "stock": 3,
    "price": 299990,
    "description": "40W, 4 canales, efectos digitales integrados."
  },
  {
    "id": "AM003",
    "categorySlug": "amplificadores",
    "name": "Amplificador Bajo 100W",
    "brand": "Hartke",
    "model": "HD100",
    "stock": 2,
    "price": 449990,
    "description": "100W, tweeter integrado, ecualizador de 4 bandas."
  },
  {
    "id": "AM004",
    "categorySlug": "amplificadores",
    "name": "Amplificador Acústico 40W",
    "brand": "Fishman",
    "model": "Loudbox Mini",
    "stock": 2,
    "price": 499990,
    "description": "60W, 2 canales, reverb y chorus incorporados."
  },
  {
    "id": "MI001",
    "categorySlug": "microfonos",
    "name": "Micrófono Dinámico Cardioide",
    "brand": "Shure",
    "model": "SM58",
    "stock": 8,
    "price": 149990,
    "description": "Estándar industria para voz en vivo."
  },
  {
    "id": "MI002",
    "categorySlug": "microfonos",
    "name": "Micrófono Dinámico Instrumento",
    "brand": "Shure",
    "model": "SM57",
    "stock": 6,
    "price": 139990,
    "description": "Ideal para captura de instrumentos y amplificadores."
  },
  {
    "id": "MI003",
    "categorySlug": "microfonos",
    "name": "Micrófono Condensador",
    "brand": "Audio-Tech.",
    "model": "AT2020",
    "stock": 4,
    "price": 199990,
    "description": "Cardioide, XLR, ideal para grabación en estudio."
  },
  {
    "id": "MI004",
    "categorySlug": "microfonos",
    "name": "Micrófono USB de Condensador",
    "brand": "Blue",
    "model": "Yeti",
    "stock": 5,
    "price": 299990,
    "description": "USB, 4 patrones polares, ideal para streaming y podcast."
  },
  {
    "id": "PE001",
    "categorySlug": "pedales-de-efectos",
    "name": "Pedal Distorsión",
    "brand": "Boss",
    "model": "DS-1",
    "stock": 7,
    "price": 79990,
    "description": "Clásico pedal de distorsión, 3 controles."
  },
  {
    "id": "PE002",
    "categorySlug": "pedales-de-efectos",
    "name": "Pedal Reverb",
    "brand": "Boss",
    "model": "RV-6",
    "stock": 4,
    "price": 179990,
    "description": "8 modos de reverb, control de shimmer."
  },
  {
    "id": "PE003",
    "categorySlug": "pedales-de-efectos",
    "name": "Pedal Multi-efectos",
    "brand": "Boss",
    "model": "ME-80",
    "stock": 2,
    "price": 349990,
    "description": "Diseño tipo pedalboard, 8 efectos simultáneos."
  },
  {
    "id": "PE004",
    "categorySlug": "pedales-de-efectos",
    "name": "Pedal Tuner Cromático",
    "brand": "Boss",
    "model": "TU-3",
    "stock": 8,
    "price": 89990,
    "description": "Afinador cromático, indicador de tono."
  },
  {
    "id": "PE005",
    "categorySlug": "pedales-de-efectos",
    "name": "Pedal Delay",
    "brand": "MXR",
    "model": "Carbon Copy",
    "stock": 4,
    "price": 179990,
    "description": "Delay analógico cálido, tiempo 600ms."
  },
  {
    "id": "PE006",
    "categorySlug": "pedales-de-efectos",
    "name": "Pedal Overdrive",
    "brand": "Ibanez",
    "model": "TS9",
    "stock": 6,
    "price": 99990,
    "description": "Tube Screamer clásico, sonido suave y orgánico."
  },
  {
    "id": "AC001",
    "categorySlug": "accesorios",
    "name": "Cuerdas Guitarra Eléctrica 09-42",
    "brand": "Ernie Ball",
    "model": "Super Slinky",
    "stock": 25,
    "price": 8990,
    "description": "Juego 6 cuerdas, calibre ligero."
  },
  {
    "id": "AC002",
    "categorySlug": "accesorios",
    "name": "Cuerdas Guitarra Acústica 12-53",
    "brand": "Ernie Ball",
    "model": "Earthwood",
    "stock": 20,
    "price": 10990,
    "description": "Bronce fósforo, sonido cálido."
  },
  {
    "id": "AC003",
    "categorySlug": "accesorios",
    "name": "Cuerdas Bajo 45-105",
    "brand": "Ernie Ball",
    "model": "Regular Slinky",
    "stock": 12,
    "price": 14990,
    "description": "Cuerdas de níquel enrollado, set 4 cuerdas."
  },
  {
    "id": "AC004",
    "categorySlug": "accesorios",
    "name": "Púas de Guitarra x10 (0.73mm)",
    "brand": "Fender",
    "model": "351",
    "stock": 50,
    "price": 3990,
    "description": "Celulosa, grosor medio."
  },
  {
    "id": "AC005",
    "categorySlug": "accesorios",
    "name": "Capotraste Guitarra",
    "brand": "Dunlop",
    "model": "Trigger",
    "stock": 15,
    "price": 12990,
    "description": "Capotraste de resorte, compatible 6 cuerdas."
  },
  {
    "id": "AC006",
    "categorySlug": "accesorios",
    "name": "Afinador de Clip",
    "brand": "Snark",
    "model": "SN-5",
    "stock": 20,
    "price": 8990,
    "description": "Afinador cromático de clip, pantalla giratoria."
  },
  {
    "id": "AC007",
    "categorySlug": "accesorios",
    "name": "Cable Instrumento 3m",
    "brand": "Monster",
    "model": "S100-I-3",
    "stock": 15,
    "price": 12990,
    "description": "Cable trenzado, conectores dorados, 3 metros."
  },
  {
    "id": "AC008",
    "categorySlug": "accesorios",
    "name": "Cable Instrumento 6m",
    "brand": "Monster",
    "model": "S100-I-6",
    "stock": 10,
    "price": 17990,
    "description": "Cable trenzado, conectores dorados, 6 metros."
  },
  {
    "id": "AC009",
    "categorySlug": "accesorios",
    "name": "Soporte Guitarra de Piso",
    "brand": "Hercules",
    "model": "GS302B",
    "stock": 12,
    "price": 22990,
    "description": "Soporte plegable con enganche automático."
  },
  {
    "id": "AC010",
    "categorySlug": "accesorios",
    "name": "Soporte Guitarra de Pared",
    "brand": "Hercules",
    "model": "WAH-202",
    "stock": 10,
    "price": 18990,
    "description": "Montaje a pared, enganche automático."
  },
  {
    "id": "ES001",
    "categorySlug": "estudio-y-grabacion",
    "name": "Interfaz de Audio 2x2 USB",
    "brand": "Focusrite",
    "model": "Scarlett Solo",
    "stock": 4,
    "price": 149990,
    "description": "1 entrada XLR+instrumento, 2 salidas, 24bit/192kHz."
  },
  {
    "id": "ES002",
    "categorySlug": "estudio-y-grabacion",
    "name": "Auriculares de Estudio",
    "brand": "Audio-Tech.",
    "model": "ATH-M20x",
    "stock": 6,
    "price": 79990,
    "description": "Circumaurales, respuesta 15Hz-20kHz."
  },
  {
    "id": "ES003",
    "categorySlug": "estudio-y-grabacion",
    "name": "Auriculares de Estudio Pro",
    "brand": "Audio-Tech.",
    "model": "ATH-M50x",
    "stock": 4,
    "price": 219990,
    "description": "Referencia de industria, sonido neutro y detallado."
  },
  {
    "id": "ES004",
    "categorySlug": "estudio-y-grabacion",
    "name": "Monitor de Estudio 5\"",
    "brand": "Yamaha",
    "model": "HS5",
    "stock": 2,
    "price": 349990,
    "description": "Altavoz activo, respuesta plana, ideal mezcla."
  },
  {
    "id": "ES005",
    "categorySlug": "estudio-y-grabacion",
    "name": "Pop Filter para Micrófono",
    "brand": "Sennheiser",
    "model": "MZP 40",
    "stock": 8,
    "price": 14990,
    "description": "Doble malla, brazo flexible con clip."
  }
];
