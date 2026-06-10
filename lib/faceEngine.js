const FACE_LABELS = {
  OVALE: "Ovale",
  ROND: "Rond",
  ALLONGE: "Allongé",
  TRIANGLE: "Triangle",
  COEUR: "Cœur",
  CARRE: "Carré",
};

const FACE_EXPLANATIONS = {
  OVALE:
    "Le visage présente une dominante équilibrée, avec des proportions harmonieuses entre hauteur et largeur.",
  ROND:
    "Le visage paraît plus large et plus doux, avec une impression globale plus circulaire.",
  ALLONGE:
    "Le visage paraît plus long que large, avec une dominante verticale plus nette.",
  TRIANGLE:
    "La mâchoire semble visuellement plus présente que le front.",
  COEUR:
    "Le front semble visuellement plus présent que la mâchoire.",
  CARRE:
    "Le visage paraît structuré, avec des lignes plus présentes et un équilibre haut / bas assez net.",
};

const FACE_CLIENT_SUMMARY = {
  OVALE:
    "Votre visage paraît globalement équilibré et harmonieux. Aucune zone ne domine fortement la lecture générale.",
  ROND:
    "Votre visage se lit dans une logique plus douce et plus arrondie, avec une impression globale assez homogène.",
  ALLONGE:
    "Votre visage se lit davantage dans la hauteur que dans la largeur. La verticalité est plus présente dans l’ensemble.",
  TRIANGLE:
    "Votre visage attire davantage le regard sur la partie basse, avec une mâchoire plus présente dans la lecture globale.",
  COEUR:
    "Votre visage attire davantage le regard sur la partie haute, avec un front plus présent dans la lecture globale.",
  CARRE:
    "Votre visage présente une structure plus nette, avec des lignes plus visibles et une sensation de construction plus marquée.",
};

const FACE_CLIENT_OBJECTIVE = {
  OVALE:
    "L’objectif des conseils sera surtout de préserver cet équilibre naturel et d’adapter les formes à l’effet de style recherché.",
  ROND:
    "L’objectif des conseils sera d’apporter un peu plus de verticalité et de structure si c’est l’effet recherché.",
  ALLONGE:
    "L’objectif des conseils sera de rééquilibrer la hauteur avec plus de présence latérale.",
  TRIANGLE:
    "L’objectif des conseils sera de rééquilibrer la partie haute et la partie basse du visage.",
  COEUR:
    "L’objectif des conseils sera d’harmoniser la partie haute du visage avec la partie basse.",
  CARRE:
    "L’objectif des conseils sera d’adoucir ou d’accompagner la structure selon l’effet recherché.",
};

const FACE_ADVICE = {
  OVALE: [
    "Préserver l’équilibre naturel du visage.",
    "Choisir les formes surtout en fonction du style recherché.",
    "Éviter seulement les excès qui déséquilibreraient les proportions.",
  ],
  ROND: [
    "Créer davantage de verticalité visuelle.",
    "Éviter d’ajouter trop de largeur sur les côtés du visage.",
    "Privilégier des lignes plus dégagées et plus structurées.",
  ],
  ALLONGE: [
    "Apporter davantage de largeur visuelle.",
    "Éviter d’accentuer encore la verticalité.",
    "Privilégier des formes qui rééquilibrent hauteur et largeur.",
  ],
  TRIANGLE: [
    "Rééquilibrer visuellement le haut et le bas du visage.",
    "Adoucir la lecture de la mâchoire.",
    "Privilégier des formes qui recentrent le regard.",
  ],
  COEUR: [
    "Rééquilibrer visuellement la partie basse du visage.",
    "Adoucir la présence du front.",
    "Créer une impression d’harmonie entre haut et bas.",
  ],
  CARRE: [
    "Adoucir légèrement la structure si l’objectif est plus de douceur.",
    "Éviter d’ajouter trop d’angles supplémentaires près du visage.",
    "Privilégier des formes qui équilibrent présence et souplesse.",
  ],
};

const FACE_PRACTICAL_ADVICE = {
  OVALE: {
    goals: [
      "Préserver l’équilibre naturel du visage.",
      "Choisir les formes selon l’intention de style plus que par contrainte morphologique.",
    ],
    hairstyles: [
      "La plupart des longueurs et volumes équilibrés peuvent convenir.",
      "Le choix peut se faire davantage selon le style, la matière des cheveux et l’effet recherché.",
    ],
    glasses: [
      "La plupart des montures équilibrées fonctionnent bien.",
      "Éviter seulement les montures extrêmes si elles déséquilibrent les proportions.",
    ],
    earrings: [
      "Grande liberté dans les formes, tant que l’ensemble reste harmonieux.",
    ],
    necklines: [
      "Les encolures peuvent être choisies surtout selon le style global recherché.",
    ],
    avoid: [
      "Les contrastes morphologiques trop extrêmes si l’objectif est de préserver l’équilibre naturel.",
    ],
  },

  ROND: {
    goals: [
      "Créer une impression de verticalité.",
      "Éviter d’ajouter trop de largeur sur les côtés du visage.",
    ],
    hairstyles: [
      "Volumes modérés sur les côtés si l’objectif est d’allonger visuellement.",
      "Lignes ou mouvements qui accompagnent davantage la verticalité.",
    ],
    glasses: [
      "Montures plus structurées ou légèrement angulaires.",
      "Formes qui évitent d’accentuer la circularité.",
    ],
    earrings: [
      "Boucles d’oreilles plus allongées si cohérent avec le style.",
      "Éviter les formes trop compactes et très rondes près du visage.",
    ],
    necklines: [
      "Encolures plus dégagées ou verticalisantes.",
      "Éviter ce qui tasse visuellement le haut.",
    ],
    avoid: [
      "Volumes trop horizontaux près des joues.",
      "Montures ou accessoires qui accentuent encore la rondeur.",
    ],
  },

  ALLONGE: {
    goals: [
      "Rééquilibrer hauteur et largeur.",
      "Apporter davantage de présence latérale.",
    ],
    hairstyles: [
      "Volumes latéraux ou mouvements sur les côtés.",
      "Éviter d’accentuer excessivement la verticalité.",
    ],
    glasses: [
      "Montures qui apportent visuellement de la largeur.",
      "Formes trop étroites à éviter si elles allongent encore davantage.",
    ],
    earrings: [
      "Boucles qui apportent plus d’horizontalité ou de présence latérale.",
    ],
    necklines: [
      "Encolures qui ouvrent horizontalement si approprié au style.",
    ],
    avoid: [
      "Lignes trop étroites et très verticales près du visage.",
      "Volumes uniquement vers le bas sans compensation latérale.",
    ],
  },

  TRIANGLE: {
    goals: [
      "Rééquilibrer la présence de la mâchoire.",
      "Redonner du relief visuel à la partie haute du visage.",
    ],
    hairstyles: [
      "Volumes ou mouvements plus présents sur la partie haute ou médiane.",
      "Éviter d’alourdir encore la zone de mâchoire.",
    ],
    glasses: [
      "Montures qui redonnent une présence harmonieuse au haut du visage.",
    ],
    earrings: [
      "Boucles qui attirent le regard vers le haut ou le centre du visage.",
    ],
    necklines: [
      "Encolures qui accompagnent l’ouverture du haut du buste et du visage.",
    ],
    avoid: [
      "Lignes qui accentuent fortement la mâchoire.",
    ],
  },

  COEUR: {
    goals: [
      "Rééquilibrer la partie haute et la partie basse du visage.",
      "Adoucir la dominance du front.",
    ],
    hairstyles: [
      "Volumes équilibrés sans concentrer tout le relief sur le haut.",
      "Accompagner davantage la partie basse si besoin.",
    ],
    glasses: [
      "Montures qui restent équilibrées sans suraccentuer la largeur du front.",
    ],
    earrings: [
      "Boucles qui apportent une belle présence vers le bas du visage.",
    ],
    necklines: [
      "Encolures équilibrées qui n’élargissent pas excessivement la partie haute.",
    ],
    avoid: [
      "Détails trop massifs concentrés uniquement sur le haut du visage.",
    ],
  },

  CARRE: {
    goals: [
      "Adoucir la structure si l’objectif est plus de douceur.",
      "Équilibrer présence et souplesse.",
    ],
    hairstyles: [
      "Lignes ou mouvements qui assouplissent les contours.",
      "Éviter d’ajouter trop d’angles si l’objectif est d’adoucir.",
    ],
    glasses: [
      "Montures équilibrées, ni trop rigides ni trop anguleuses si l’on veut adoucir.",
    ],
    earrings: [
      "Formes plus souples ou allongées si l’objectif est de détendre la structure.",
    ],
    necklines: [
      "Encolures qui accompagnent sans rigidifier davantage.",
    ],
    avoid: [
      "Trop d’angles cumulés près du visage si l’on recherche de la douceur.",
    ],
  },
};

function buildConfidenceFromScores(scores) {
  const sortedScores = Object.values(scores).sort((a, b) => b - a);
  const primaryScore = sortedScores[0] ?? 0;
  const secondaryScore = sortedScores[1] ?? 0;
  const gap = primaryScore - secondaryScore;

  let confidenceLabel = "Moyen";
  let confidenceScore = 60;

  if (gap >= 3) {
    confidenceLabel = "Fort";
    confidenceScore = 85;
  } else if (gap <= 1) {
    confidenceLabel = "À confirmer";
    confidenceScore = 45;
  }

  return {
    confidenceLabel,
    confidenceScore,
    gap,
  };
}

function applyVisualScoring(scores, visual = {}) {
  const { lengthFeel, widthDominance, lines } = visual;

  if (lengthFeel === "short") {
    scores.ROND += 2;
  } else if (lengthFeel === "balanced") {
    scores.OVALE += 2;
    scores.CARRE += 1;
  } else if (lengthFeel === "long") {
    scores.ALLONGE += 2;
  }

  if (widthDominance === "forehead") {
    scores.COEUR += 2;
  } else if (widthDominance === "balanced") {
    scores.OVALE += 1;
    scores.CARRE += 1;
  } else if (widthDominance === "jaw") {
    scores.TRIANGLE += 2;
    scores.CARRE += 1;
  }

  if (lines === "soft") {
    scores.ROND += 1;
    scores.OVALE += 1;
  } else if (lines === "mixed") {
    scores.OVALE += 1;
  } else if (lines === "structured") {
    scores.CARRE += 2;
    scores.TRIANGLE += 1;
  }

  return scores;
}

export function getFaceType({
  width,
  height,
  jaw,
  forehead,
  visual = {},
}) {
  const w = Number(width);
  const h = Number(height);
  const j = Number(jaw);
  const f = Number(forehead);

  if (![w, h, j, f].every((n) => Number.isFinite(n) && n > 0)) {
    return null;
  }

  const ratio = h / w;

  const scores = {
    OVALE: 0,
    ROND: 0,
    ALLONGE: 0,
    TRIANGLE: 0,
    COEUR: 0,
    CARRE: 0,
  };

  if (ratio < 1.2) {
    scores.ROND += 3;
  } else if (ratio > 1.55) {
    scores.ALLONGE += 3;
  } else {
    scores.OVALE += 2;
    scores.CARRE += 1;
  }

  if (j > f * 1.08) {
    scores.TRIANGLE += 3;
  } else if (f > j * 1.08) {
    scores.COEUR += 3;
  } else {
    scores.OVALE += 1;
    scores.CARRE += 1;
  }

  const jawForeheadGap = Math.abs(j - f) / Math.max(j, f);
  if (jawForeheadGap < 0.08 && ratio >= 1.2 && ratio <= 1.45) {
    scores.CARRE += 2;
  }

  applyVisualScoring(scores, visual);

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const secondary = sorted[1][0];

  const confidence = buildConfidenceFromScores(scores);

  return {
    type: primary,
    secondaryType: secondary,
    label: FACE_LABELS[primary],
    secondaryLabel: FACE_LABELS[secondary],
    explanation: FACE_EXPLANATIONS[primary],
    clientSummary: FACE_CLIENT_SUMMARY[primary],
    clientObjective: FACE_CLIENT_OBJECTIVE[primary],
    advice: FACE_ADVICE[primary],
    practicalAdvice: FACE_PRACTICAL_ADVICE[primary],
    ratio,
    measures: {
      width: w,
      height: h,
      jaw: j,
      forehead: f,
    },
    visual,
    scores,
    confidenceLabel: confidence.confidenceLabel,
    confidenceScore: confidence.confidenceScore,
    confidenceGap: confidence.gap,
  };
}