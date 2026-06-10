export const PROFILE_TYPES = [
  { id: "femme", label: "Femme" },
  { id: "homme", label: "Homme" },
];

const COMMON_STYLES = [
  {
    id: "A",
    label: "Classique",
    fullLabel: "Classique (A)",
    description: "Style élégant, structuré et intemporel.",
    impact: "Recherche d’élégance et de cohérence.",
    atouts: "Crédibilité, raffinement.",
    vigilance: "Peut paraître rigide.",
    conseilImage: "Ajouter des touches modernes.",
    preferences: {
      vetements: "Tailleurs, vêtements structurés.",
      couleurs: "Neutres : beige, noir, bleu.",
      coiffure: "Coiffures nettes et maîtrisées.",
      accessoires: "Classiques (foulards, montres).",
      penderie: "Qualité > quantité.",
      attention: "Éviter rigidité excessive.",
      couturiersBoutiques: "Max Mara, Caroll.",
    },
  },
  {
    id: "B",
    label: "Traditionnel",
    fullLabel: "Traditionnel (B)",
    description: "Style rassurant et structuré.",
    impact: "Besoin de repères.",
    atouts: "Fiabilité, constance.",
    vigilance: "Manque d’audace.",
    conseilImage: "Moderniser légèrement.",
    preferences: {
      vetements: "Classiques intemporels.",
      couleurs: "Couleurs sobres.",
      coiffure: "Naturelle.",
      accessoires: "Discrets.",
      penderie: "Stable et cohérente.",
      attention: "Éviter effet daté.",
      couturiersBoutiques: "Burberry, Cyrillus.",
    },
  },
  {
    id: "C",
    label: "Sportswear",
    fullLabel: "Sportswear (C)",
    description: "Style confortable et dynamique.",
    impact: "Liberté de mouvement.",
    atouts: "Accessibilité, énergie.",
    vigilance: "Trop casual.",
    conseilImage: "Structurer légèrement.",
    preferences: {
      vetements: "Tenues confortables et modulables.",
      couleurs: "Couleurs dynamiques.",
      coiffure: "Naturelle.",
      accessoires: "Pratiques.",
      penderie: "Polyvalente.",
      attention: "Éviter négligé.",
      couturiersBoutiques: "IKKS, Lacoste.",
    },
  },
  {
    id: "D",
    label: "Romantique",
    fullLabel: "Romantique (D)",
    description: "Style féminin et délicat.",
    impact: "Expression de douceur.",
    atouts: "Chaleur, élégance.",
    vigilance: "Peut manquer d’impact.",
    conseilImage: "Structurer davantage.",
    preferences: {
      vetements: "Dentelle, matières fluides.",
      couleurs: "Pastels.",
      coiffure: "Ondulations.",
      accessoires: "Fins et élégants.",
      penderie: "Féminine.",
      attention: "Éviter excès de douceur.",
      couturiersBoutiques: "Valentino, Nina Ricci.",
    },
  },
  {
    id: "E",
    label: "Flamboyant",
    fullLabel: "Flamboyant (E)",
    description: "Style impactant et visible.",
    impact: "Volonté d’être remarqué.",
    atouts: "Charisme.",
    vigilance: "Excès visuel.",
    conseilImage: "Canaliser.",
    preferences: {
      vetements: "Pièces fortes.",
      couleurs: "Vives et contrastées.",
      coiffure: "Soignée.",
      accessoires: "Imposants.",
      penderie: "Expressive.",
      attention: "Éviter surcharge.",
      couturiersBoutiques: "Gucci, Versace.",
    },
  },
  {
    id: "F",
    label: "Artistique",
    fullLabel: "Artistique (F)",
    description: "Style créatif et original.",
    impact: "Expression personnelle.",
    atouts: "Créativité.",
    vigilance: "Moins lisible.",
    conseilImage: "Structurer.",
    preferences: {
      vetements: "Originales et déstructurées.",
      couleurs: "Forts contrastes.",
      coiffure: "Libre.",
      accessoires: "Créatifs.",
      penderie: "Unique.",
      attention: "Rester lisible.",
      couturiersBoutiques: "Yohji Yamamoto.",
    },
  },
];

function cloneStyles() {
  return COMMON_STYLES.map((style) => ({
    ...style,
    preferences: { ...style.preferences },
  }));
}

export const STYLE_PROFILES = {
  femme: cloneStyles(),
  homme: cloneStyles(),
};

export function getStylesByProfileType(profileType) {
  return STYLE_PROFILES[profileType] || [];
}

export function getStyleById(profileType, styleId) {
  return (
    getStylesByProfileType(profileType).find((style) => style.id === styleId) ||
    null
  );
}

export function getStyleLabel(profileType, styleId) {
  return getStyleById(profileType, styleId)?.label || "";
}