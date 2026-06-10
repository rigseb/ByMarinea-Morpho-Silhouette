const BODY_LABELS = {
  A: "Pyramide",
  V: "Pyramide inversée",
  X: "Sablier",
  H: "Rectangle",
  O: "Ronde",
};

const BODY_EXPLANATIONS = {
  A: "La silhouette attire davantage le regard sur le bas du corps que sur le haut.",
  V: "La silhouette attire davantage le regard sur le haut du corps que sur le bas.",
  X: "Les épaules et les hanches sont globalement équilibrées, avec une taille bien visible.",
  H: "La silhouette paraît plutôt droite, avec peu de différence marquée entre épaules, taille et hanches.",
  O: "La silhouette présente une ligne plus douce et plus centrale, avec une taille moins nettement dessinée.",
};

const BODY_CLIENT_SUMMARY = {
  A: "Votre silhouette présente une dominance sur le bas du corps. Les hanches attirent naturellement davantage le regard que les épaules.",
  V: "Votre silhouette présente une dominance sur le haut du corps. Les épaules attirent naturellement davantage le regard que le bas du corps.",
  X: "Votre silhouette est globalement équilibrée entre le haut et le bas du corps, avec une taille bien marquée.",
  H: "Votre silhouette se lit de façon assez droite et équilibrée, avec une taille peu marquée.",
  O: "Votre silhouette se lit dans une logique plus douce et plus enveloppante, avec une taille moins marquée.",
};

const BODY_CLIENT_OBJECTIVE = {
  A: "L’objectif des conseils sera de rééquilibrer visuellement le haut et le bas du corps.",
  V: "L’objectif des conseils sera de rééquilibrer visuellement la carrure avec davantage de présence sur le bas.",
  X: "L’objectif des conseils sera surtout de respecter l’équilibre naturel de la silhouette et de préserver la taille.",
  H: "L’objectif des conseils sera de créer plus de relief et de structure visuelle si c’est l’effet recherché.",
  O: "L’objectif des conseils sera d’allonger et de structurer la ligne sans rigidifier la silhouette.",
};

const BODY_ADVICE = {
  A: [
    "Attirer davantage le regard vers le haut du corps.",
    "Structurer légèrement les épaules.",
    "Mettre en valeur la taille sans surcharger la zone des hanches.",
  ],
  V: [
    "Adoucir la carrure.",
    "Apporter plus de présence visuelle au bas du corps.",
    "Créer un équilibre plus harmonieux entre haut et bas.",
  ],
  X: [
    "Souligner la taille avec naturel.",
    "Respecter l’équilibre entre épaules et hanches.",
    "Éviter les coupes qui effacent complètement la structure.",
  ],
  H: [
    "Créer davantage de relief visuel.",
    "Introduire une impression de taille si c’est souhaité.",
    "Jouer avec les lignes, les découpes et les volumes.",
  ],
  O: [
    "Allonger visuellement la silhouette.",
    "Structurer avec des lignes fluides mais nettes.",
    "Éviter de casser la ligne avec trop de ruptures visuelles.",
  ],
};

const BODY_PRACTICAL_ADVICE = {
  A: {
    goals: [
      "Rééquilibrer visuellement le haut et le bas du corps.",
      "Mettre en valeur la taille sans accentuer inutilement les hanches.",
    ],
    tops: [
      "Hauts avec détails sur les épaules ou l’encolure.",
      "Matières ou couleurs plus présentes sur le haut du corps.",
      "Manches légèrement structurées.",
    ],
    jackets: [
      "Vestes structurées ou légèrement cintrées.",
      "Vestes qui ne s’arrêtent pas au point le plus large des hanches.",
      "Coupes qui mettent en valeur le haut du corps.",
    ],
    bottoms: [
      "Bas plus sobres visuellement.",
      "Pantalons droits ou légèrement fluides.",
      "Jupes qui accompagnent la ligne sans ajouter trop de volume.",
    ],
    necklines: [
      "Encolures bateau.",
      "Encolures carrées.",
      "Encolures qui donnent davantage de présence au haut du buste.",
    ],
    accessories: [
      "Bijoux, foulards ou détails portés près du visage.",
      "Accessoires qui attirent le regard vers le haut.",
    ],
    avoid: [
      "Détails très volumineux sur les hanches.",
      "Poches latérales très visibles.",
      "Bas trop chargés visuellement.",
    ],
  },

  V: {
    goals: [
      "Rééquilibrer visuellement la carrure.",
      "Apporter davantage de présence au bas du corps.",
    ],
    tops: [
      "Hauts plus sobres sur la ligne d’épaules.",
      "Matières plus fluides sur le haut du corps.",
      "Éviter d’ajouter du volume supplémentaire près de la carrure.",
    ],
    jackets: [
      "Vestes peu épaulées.",
      "Coupes droites ou semi-fluides.",
      "Longueurs qui accompagnent la silhouette sans rigidifier le haut.",
    ],
    bottoms: [
      "Bas plus présents visuellement.",
      "Formes droites, évasées ou plus construites selon le style.",
      "Matières, volumes ou détails qui rééquilibrent le bas.",
    ],
    necklines: [
      "Encolures plus verticales ou dégagées.",
      "Lignes qui n’élargissent pas davantage les épaules.",
    ],
    accessories: [
      "Accessoires plus sobres sur le haut si la carrure domine déjà.",
      "Accent possible sur le bas ou sur la taille selon le style.",
    ],
    avoid: [
      "Épaulements très marqués.",
      "Détails volumineux sur les épaules.",
      "Encolures qui élargissent encore le haut.",
    ],
  },

  X: {
    goals: [
      "Préserver l’équilibre naturel de la silhouette.",
      "Maintenir la lecture de la taille.",
    ],
    tops: [
      "Hauts qui suivent la ligne naturelle du corps.",
      "Coupes ajustées sans rigidifier.",
      "Pièces qui soulignent la taille avec naturel.",
    ],
    jackets: [
      "Vestes cintrées.",
      "Coupes équilibrées entre haut et bas.",
      "Longueurs qui respectent la lecture de la taille.",
    ],
    bottoms: [
      "Bas qui prolongent l’équilibre naturel.",
      "Coupes ajustées, droites ou légèrement fluides selon l’effet recherché.",
    ],
    necklines: [
      "La plupart des encolures équilibrées peuvent convenir.",
      "Le choix dépend surtout du style recherché.",
    ],
    accessories: [
      "Ceintures ou détails qui accompagnent la taille.",
      "Accessoires répartis de façon harmonieuse.",
    ],
    avoid: [
      "Coupes trop droites qui effacent complètement la taille.",
      "Volumes très déséquilibrés entre haut et bas.",
    ],
  },

  H: {
    goals: [
      "Créer davantage de relief visuel.",
      "Introduire une impression de taille et de mouvement si c’est souhaité.",
    ],
    tops: [
      "Hauts avec découpes, drapés ou détails de construction.",
      "Pièces qui créent du rythme visuel.",
      "Superpositions ou jeux de lignes si adaptés au style.",
    ],
    jackets: [
      "Vestes légèrement cintrées ou structurées.",
      "Coupes qui cassent une ligne trop uniforme.",
      "Longueurs choisies pour créer du relief.",
    ],
    bottoms: [
      "Bas qui apportent du rythme à la silhouette.",
      "Volumes modérés, plis ou matières qui enrichissent la ligne.",
    ],
    necklines: [
      "Encolures qui peuvent aider à créer davantage de relief visuel.",
      "Le choix dépend ensuite du style recherché.",
    ],
    accessories: [
      "Ceintures si l’on veut créer une taille visuelle.",
      "Accessoires utilisés pour segmenter harmonieusement la silhouette.",
    ],
    avoid: [
      "Coupes trop plates, trop uniformes et sans point d’intérêt.",
      "Silhouettes entièrement droites si l’objectif est de créer du relief.",
    ],
  },

  O: {
    goals: [
      "Allonger la ligne générale.",
      "Créer une structure fluide mais nette.",
    ],
    tops: [
      "Hauts fluides avec une bonne tenue visuelle.",
      "Lignes plus dégagées ou verticalisantes.",
      "Pièces qui accompagnent sans mouler excessivement.",
    ],
    jackets: [
      "Vestes à lignes nettes et allongeantes.",
      "Coupes droites ou semi-ajustées selon l’effet recherché.",
      "Longueurs qui créent de la continuité visuelle.",
    ],
    bottoms: [
      "Bas fluides et structurés.",
      "Coupes qui allongent la silhouette.",
      "Éviter les lignes qui interrompent brutalement le mouvement.",
    ],
    necklines: [
      "Encolures dégagées ou verticalisantes.",
      "Lignes qui ouvrent visuellement le haut du corps.",
    ],
    accessories: [
      "Accessoires qui accompagnent la ligne globale sans la couper.",
      "Détails choisis avec sobriété et structure.",
    ],
    avoid: [
      "Accumulation de volumes au même endroit.",
      "Matières sans tenue ou trop épaisses selon l’effet recherché.",
      "Découpes qui cassent brusquement la silhouette.",
    ],
  },
};

function buildConfidenceFromScores(scores) {
  const sorted = Object.values(scores).sort((a, b) => b - a);
  const primaryScore = sorted[0] ?? 0;
  const secondaryScore = sorted[1] ?? 0;
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
  const { shouldersVsHips, waistDefinition } = visual;

  if (shouldersVsHips === "narrower") {
    scores.A += 2;
  } else if (shouldersVsHips === "balanced") {
    scores.X += 1;
    scores.H += 1;
  } else if (shouldersVsHips === "wider") {
    scores.V += 2;
  }

  if (waistDefinition === "marked") {
    scores.X += 2;
  } else if (waistDefinition === "medium") {
    scores.A += 1;
    scores.V += 1;
  } else if (waistDefinition === "low") {
    scores.H += 2;
    scores.O += 2;
  }

  return scores;
}

export function getBodyType({
  shoulders,
  bust,
  waist,
  hips,
  visual = {},
}) {
  const s = Number(shoulders);
  const b = Number(bust);
  const w = Number(waist);
  const h = Number(hips);

  if (![s, b, w, h].every((n) => Number.isFinite(n) && n > 0)) {
    return null;
  }

  const ratios = {
    shouldersToHips: s / h,
    waistToHips: w / h,
    waistToBust: w / b,
  };

  const scores = {
    A: 0,
    V: 0,
    X: 0,
    H: 0,
    O: 0,
  };

  if (ratios.shouldersToHips < 0.9) scores.A += 3;
  if (ratios.shouldersToHips > 1.1) scores.V += 3;
  if (ratios.shouldersToHips >= 0.9 && ratios.shouldersToHips <= 1.1) {
    scores.X += 2;
    scores.H += 2;
  }

  if (ratios.waistToHips < 0.75) {
    scores.X += 3;
  }

  if (ratios.waistToHips >= 0.75 && ratios.waistToHips <= 0.85) {
    scores.A += 1;
    scores.V += 1;
  }

  if (ratios.waistToHips > 0.85) {
    scores.H += 2;
    scores.O += 2;
  }

  if (ratios.waistToBust > 0.85) {
    scores.O += 2;
    scores.H += 1;
  }

  applyVisualScoring(scores, visual);

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const secondary = sorted[1][0];

  const confidence = buildConfidenceFromScores(scores);

  return {
    primary,
    secondary,
    primaryLabel: BODY_LABELS[primary],
    secondaryLabel: BODY_LABELS[secondary],
    explanation: BODY_EXPLANATIONS[primary],
    clientSummary: BODY_CLIENT_SUMMARY[primary],
    clientObjective: BODY_CLIENT_OBJECTIVE[primary],
    advice: BODY_ADVICE[primary],
    practicalAdvice: BODY_PRACTICAL_ADVICE[primary],
    scores,
    ratios,
    visual,
    confidenceLabel: confidence.confidenceLabel,
    confidenceScore: confidence.confidenceScore,
    confidenceGap: confidence.gap,
  };
}
