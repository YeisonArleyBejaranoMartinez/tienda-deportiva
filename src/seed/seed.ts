import bcryptjs from 'bcryptjs';

interface SeedVariant {
  size: string;
  stock: number;
}
interface SeedProduct {
  description: string;
  images: string[];
  price: number; // COP
  variants: SeedVariant[];
  slug: string;
  tags: string[];
  title: string;
  type: ValidTypes;
  gender: "men" | "women" | "kid" | "unisex";
}
interface SeedUser{
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
}

type ValidTypes = "patines" | "patinetas" | "protecciones" | "repuestos";

interface SeedData {
  categories: ValidTypes[];
  products: SeedProduct[];
  users: SeedUser[]
}

// Genera tallas numéricas con el mismo stock (ej. 35 a 42)
const tallas = (desde: number, hasta: number, stock: number): SeedVariant[] =>
  Array.from({ length: hasta - desde + 1 }, (_, i) => ({ size: String(desde + i), stock }));

// Datos de prueba. Reemplazar por el inventario real del aliado.
export const initialData: SeedData = {
  categories: ["patines", "patinetas", "protecciones", "repuestos"],
  products: [
    // ---------- Patines ----------
    {
      title: "Patines en línea Freeskate Pro",
      slug: "patines_en_linea_freeskate_pro",
      description: "Patín en línea para freeskate urbano con bota semirrígida, chasis de aluminio de 243 mm, ruedas de 80 mm 85A y rodamientos ABEC-9.",
      images: [],
      price: 689000,
      variants: [...tallas(36, 44, 3)],
      type: "patines",
      tags: ["patines", "en linea", "freeskate"],
      gender: "unisex",
    },
    {
      title: "Patines de velocidad Speed 4x100",
      slug: "patines_velocidad_speed_4x100",
      description: "Bota de fibra de carbono termomoldeable, chasis de 4 ruedas de 100 mm. Ideal para patinaje de carreras y entrenamiento.",
      images: [],
      price: 1250000,
      variants: [...tallas(35, 43, 2)],
      type: "patines",
      tags: ["patines", "velocidad", "carreras"],
      gender: "unisex",
    },
    {
      title: "Patines en línea ajustables niños",
      slug: "patines_en_linea_ajustables_ninos",
      description: "Patín ajustable en 4 tallas para niños que están empezando. Freno trasero y cierre con hebilla y velcro.",
      images: [],
      price: 259000,
      variants: [
        { size: "29-32", stock: 6 },
        { size: "33-36", stock: 5 },
        { size: "37-40", stock: 2 },
      ],
      type: "patines",
      tags: ["patines", "niños", "ajustable"],
      gender: "kid",
    },
    {
      title: "Patines quad Retro",
      slug: "patines_quad_retro",
      description: "Patín de 4 ruedas tipo bota con freno delantero, ruedas de 58 mm y diseño retro.",
      images: [],
      price: 349000,
      variants: [...tallas(35, 41, 2)],
      type: "patines",
      tags: ["patines", "quad", "retro"],
      gender: "women",
    },
    // ---------- Patinetas ----------
    {
      title: "Patineta completa Street 8.0\"",
      slug: "patineta_completa_street_8",
      description: "Tabla de arce canadiense de 7 capas de 8.0\", trucks de aluminio, ruedas de 52 mm 99A y rodamientos ABEC-7.",
      images: [],
      price: 329000,
      variants: [{ size: "8.0", stock: 5 }, { size: "8.25", stock: 3 }],
      type: "patinetas",
      tags: ["patineta", "skateboard", "street"],
      gender: "unisex",
    },
    {
      title: "Longboard Cruiser 38\"",
      slug: "longboard_cruiser_38",
      description: "Longboard para paseo de 38\" con ruedas blandas de 70 mm. Estable y cómodo para la ciudad.",
      images: [],
      price: 459000,
      variants: [{ size: "Única", stock: 4 }],
      type: "patinetas",
      tags: ["longboard", "cruiser"],
      gender: "unisex",
    },
    {
      title: "Tabla de patineta 8.25\"",
      slug: "tabla_patineta_8_25",
      description: "Solo la tabla (deck) de arce canadiense, concave medio, con lija incluida.",
      images: [],
      price: 189000,
      variants: [{ size: "8.0", stock: 4 }, { size: "8.25", stock: 6 }, { size: "8.5", stock: 2 }],
      type: "patinetas",
      tags: ["patineta", "deck", "tabla"],
      gender: "unisex",
    },
    // ---------- Protecciones ----------
    {
      title: "Casco certificado Urban",
      slug: "casco_certificado_urban",
      description: "Casco de ABS con interior de EPS, ventilación y ajuste por rueda trasera. Para patín, patineta y bicicleta.",
      images: [],
      price: 149000,
      variants: [{ size: "S", stock: 4 }, { size: "M", stock: 6 }, { size: "L", stock: 3 }],
      type: "protecciones",
      tags: ["casco", "proteccion"],
      gender: "unisex",
    },
    {
      title: "Kit de protecciones 3 en 1",
      slug: "kit_protecciones_3_en_1",
      description: "Rodilleras, coderas y muñequeras con carcasa rígida y velcro de ajuste.",
      images: [],
      price: 119000,
      variants: [{ size: "XS", stock: 5 }, { size: "S", stock: 5 }, { size: "M", stock: 4 }, { size: "L", stock: 2 }],
      type: "protecciones",
      tags: ["rodilleras", "coderas", "muñequeras", "proteccion"],
      gender: "unisex",
    },
    {
      title: "Kit de protecciones niños",
      slug: "kit_protecciones_ninos",
      description: "Rodilleras, coderas y muñequeras para niños con diseños de colores.",
      images: [],
      price: 79000,
      variants: [{ size: "XS", stock: 6 }, { size: "S", stock: 4 }],
      type: "protecciones",
      tags: ["proteccion", "niños"],
      gender: "kid",
    },
    // ---------- Repuestos ----------
    {
      title: "Ruedas para patín en línea (x4)",
      slug: "ruedas_patin_en_linea_x4",
      description: "Juego de 4 ruedas de poliuretano 85A para patín en línea.",
      images: [],
      price: 99000,
      variants: [{ size: "72mm", stock: 8 }, { size: "76mm", stock: 6 }, { size: "80mm", stock: 10 }, { size: "90mm", stock: 4 }],
      type: "repuestos",
      tags: ["ruedas", "repuesto", "patines"],
      gender: "unisex",
    },
    {
      title: "Rodamientos ABEC-9 (x16)",
      slug: "rodamientos_abec_9_x16",
      description: "Juego de 16 rodamientos 608 ABEC-9 para patines en línea.",
      images: [],
      price: 69000,
      variants: [{ size: "Única", stock: 15 }],
      type: "repuestos",
      tags: ["rodamientos", "repuesto"],
      gender: "unisex",
    },
    {
      title: "Lija para patineta",
      slug: "lija_para_patineta",
      description: "Lija (grip tape) de 9\" x 33\" con perforaciones anti-burbujas.",
      images: [],
      price: 35000,
      variants: [{ size: "Única", stock: 20 }],
      type: "repuestos",
      tags: ["lija", "grip", "patineta", "repuesto"],
      gender: "unisex",
    },
  ],
  users: [
    {
      role: "admin",
      name: "Admin",
      email: "M8v2o@example.com",
      password: bcryptjs.hashSync("1234", 10),
    },
    {
      role: "user",
      name: "User",
      email: "gM2sM@example.com",
      password: bcryptjs.hashSync("1234", 10),
    },
  ],
};
