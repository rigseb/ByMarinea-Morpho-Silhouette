"use client";

import { useEffect, useMemo, useState } from "react";
import { getBodyType } from "../lib/bodyEngine";
import { getFaceType } from "../lib/faceEngine";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import {
  PROFILE_TYPES,
  getStylesByProfileType,
  getStyleById,
} from "../lib/styleProfiles";



function SectionTitle({ children }) {
  return (
    <h2 className="gold-title" style={{ marginTop: 0 }}>
      {children}
    </h2>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontWeight: 600, marginBottom: 6 }}>{children}</div>;
}

function ConfidenceBadge({ label, score }) {
  if (!label || score === undefined || score === null) return null;

  let bg = "#FEF3C7";
  let color = "#92400E";

  if (label === "Fort") {
    bg = "#DCFCE7";
    color = "#166534";
  }

  if (label === "À confirmer") {
    bg = "#FEE2E2";
    color = "#991B1B";
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        background: bg,
        color,
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      Lecture {label.toLowerCase()} ({score}%)
    </div>
  );
}

function ChoiceButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        border: active ? "2px solid #D4B06A" : "1px solid #D1D5DB",
        background: active ? "#F6E7E4" : "#FFFFFF",
        color: "#111827",
        cursor: "pointer",
        fontWeight: 600,
        textAlign: "left",
      }}
    >
      {children}
    </button>
  );
}

function AdviceGroup({ title, items }) {
  if (!items || !items.length) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <strong>{title}</strong>
      <ul style={{ marginTop: 8, marginBottom: 0, lineHeight: 1.7 }}>
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ResultTextBlock({ title, text }) {
  if (!text) return null;

  return (
    <div style={{ marginTop: 18 }}>
      <strong>{title}</strong>
      <div style={{ marginTop: 8, lineHeight: 1.8 }}>{text}</div>
    </div>
  );
}

function friendlyShouldersValue(value) {
  if (value === "narrower") return "plus étroites que les hanches";
  if (value === "balanced") return "équilibrées";
  if (value === "wider") return "plus larges que les hanches";
  return "non renseigné";
}

function friendlyWaistValue(value) {
  if (value === "marked") return "marquée";
  if (value === "medium") return "moyenne";
  if (value === "low") return "peu marquée";
  return "non renseignée";
}

function friendlyFaceLengthValue(value) {
  if (value === "short") return "plutôt court / large";
  if (value === "balanced") return "équilibré";
  if (value === "long") return "plutôt long";
  return "non renseigné";
}

function friendlyFaceWidthValue(value) {
  if (value === "forehead") return "front plus large";
  if (value === "balanced") return "équilibré";
  if (value === "jaw") return "mâchoire plus large";
  return "non renseigné";
}

function friendlyFaceLinesValue(value) {
  if (value === "soft") return "douces / arrondies";
  if (value === "mixed") return "mixtes";
  if (value === "structured") return "structurées";
  return "non renseigné";
}

function buildBodyNuance(result) {
  if (!result) return "";

  if (result.confidenceLabel === "À confirmer") {
    return `La lecture reste nuancée : la silhouette se situe entre une dominante ${result.primaryLabel.toLowerCase()} et une composante secondaire ${result.secondaryLabel.toLowerCase()}.`;
  }

  return `La lecture secondaire ${result.secondaryLabel.toLowerCase()} affine la compréhension de la silhouette, sans remettre en cause la dominante ${result.primaryLabel.toLowerCase()}.`;
}

function buildFaceNuance(result) {
  if (!result) return "";

  if (result.confidenceLabel === "À confirmer") {
    return `La lecture reste nuancée : le visage se situe entre une dominante ${result.label.toLowerCase()} et une composante secondaire ${result.secondaryLabel.toLowerCase()}.`;
  }

  return `La lecture secondaire ${result.secondaryLabel.toLowerCase()} précise la façon dont le visage se structure, sans changer la dominante ${result.label.toLowerCase()}.`;
}

function buildBodyVisualMeaning(result, bodyVisual) {
  if (!result) return "";

  const shoulders = friendlyShouldersValue(bodyVisual.shouldersVsHips);
  const waist = friendlyWaistValue(bodyVisual.waistDefinition);

  if (shoulders === "non renseigné" && waist === "non renseignée") {
    return "";
  }

  return `Dans la lecture visuelle, les épaules paraissent ${shoulders} et la taille semble ${waist}. Ces éléments viennent confirmer ou nuancer la lecture issue des tours principaux et affiner le résultat final.`;}

function buildFaceVisualMeaning(result, faceVisual) {
  if (!result) return "";

  const lengthFeel = friendlyFaceLengthValue(faceVisual.lengthFeel);
  const widthDominance = friendlyFaceWidthValue(faceVisual.widthDominance);
  const lines = friendlyFaceLinesValue(faceVisual.lines);

  if (
    lengthFeel === "non renseigné" &&
    widthDominance === "non renseigné" &&
    lines === "non renseigné"
  ) {
    return "";
  }

  return `Dans la lecture visuelle, le visage paraît ${lengthFeel}, avec une dominante ${widthDominance} et des lignes ${lines}. Ces indices aident à mieux comprendre la structure générale du visage.`;
}

function buildStyleDirection(styleProfile, primaryStyle, secondaryStyle) {
  const { goal } = styleProfile;

  if (!primaryStyle && !secondaryStyle && !goal) return "";

  let text = "";

  if (primaryStyle && secondaryStyle) {
    text += `Le langage stylistique recherché s’oriente vers un style ${primaryStyle.label.toLowerCase()} avec une nuance ${secondaryStyle.label.toLowerCase()}.`;
  } else if (primaryStyle) {
    text += `Le langage stylistique recherché s’oriente vers un style ${primaryStyle.label.toLowerCase()}.`;
  } else if (secondaryStyle) {
    text += `Une nuance stylistique ${secondaryStyle.label.toLowerCase()} est également à prendre en compte.`;
  }

  if (goal) {
    text += ` L’objectif d’image est d’aller vers quelque chose de ${goal.toLowerCase()}.`;
  }

  return text;
}

const RENDER_GOALS = [
  "Plus affirmé",
  "Plus doux",
  "Plus structuré",
  "Plus naturel",
  "Plus élégant",
  "Plus créatif",
  "Plus visible",
  "Plus sobre",
  "Plus moderne",
  "Plus cohérent",
];

function buildStyleTranslation(primaryStyle, secondaryStyle, goal) {
  if (!primaryStyle && !secondaryStyle && !goal) return "";

  const primaryLabel = primaryStyle?.label?.toLowerCase();
  const secondaryLabel = secondaryStyle?.label?.toLowerCase();
  const primaryDescription = primaryStyle?.description?.toLowerCase();
  const secondaryDescription = secondaryStyle?.description?.toLowerCase();
  const goalText = goal ? goal.toLowerCase() : "";

  let text = "";

  if (primaryStyle && secondaryStyle) {
    text += `Le style retenu associe une dominante ${primaryLabel} à une nuance ${secondaryLabel}. `;
  } else if (primaryStyle) {
    text += `Le style retenu s’inscrit principalement dans un registre ${primaryLabel}. `;
  } else if (secondaryStyle) {
    text += `Une nuance ${secondaryLabel} vient orienter la lecture stylistique. `;
  }

  if (primaryDescription) {
    text += `Cela correspond à un univers ${primaryDescription} `;
  }

  if (secondaryDescription) {
    text += `avec un écho plus ${secondaryDescription}. `;
  }

  if (goalText) {
    text += `L’objectif est d’aller vers quelque chose de ${goalText}. `;
  }

  text +=
    "Le rôle du conseil sera donc de traduire la morphologie dans ce langage stylistique, sans perdre la cohérence d’ensemble.";

  return text.trim();
}

function buildDetailedStyleAdvice(primaryStyle, secondaryStyle, goal, area) {
  const items = [];
  const primary = primaryStyle?.label || "";
  const secondary = secondaryStyle?.label || "";
  const goalText = (goal || "").toLowerCase();

  const pushUnique = (text) => {
    if (text && !items.includes(text)) {
      items.push(text);
    }
  };

  if (area === "body") {
    switch (primary) {
      case "Classique":
        pushUnique("Privilégier des lignes nettes, des coupes lisibles et une structure maîtrisée.");
        pushUnique("Éviter les mélanges trop dispersés qui nuisent à la cohérence visuelle.");
        break;
      case "Traditionnel":
        pushUnique("S’appuyer sur des repères stables, rassurants et faciles à lire.");
        pushUnique("Moderniser avec subtilité pour éviter un rendu trop attendu ou trop sage.");
        break;
      case "Sportswear":
        pushUnique("Conserver une base confortable, fluide et pratique dans la construction des silhouettes.");
        pushUnique("Introduire juste assez de structure pour éviter un rendu trop casual ou relâché.");
        break;
      case "Romantique":
        pushUnique("Favoriser des lignes douces, des matières souples et une lecture plus délicate.");
        pushUnique("Préserver la féminité du style tout en gardant assez de présence visuelle.");
        break;
      case "Flamboyant":
        pushUnique("Assumer une présence plus forte dans les volumes, les contrastes ou les pièces d’impact.");
        pushUnique("Canaliser les éléments les plus visibles pour éviter la surcharge.");
        break;
      case "Artistique":
        pushUnique("Autoriser davantage d’originalité dans les volumes, les associations et les lignes.");
        pushUnique("Garder malgré tout une ligne directrice lisible pour ne pas perdre la cohérence générale.");
        break;
      default:
        break;
    }
  }

  if (area === "face") {
    switch (primary) {
      case "Classique":
        pushUnique("Privilégier près du visage des formes sobres, nettes et bien maîtrisées.");
        pushUnique("Éviter les effets trop démonstratifs si l’objectif est de préserver une élégance intemporelle.");
        break;
      case "Traditionnel":
        pushUnique("Conserver une lecture rassurante, équilibrée et discrète autour du visage.");
        pushUnique("Apporter éventuellement une touche plus actuelle pour éviter un rendu trop convenu.");
        break;
      case "Sportswear":
        pushUnique("Garder une impression de naturel, de simplicité et de facilité dans le choix des détails près du visage.");
        pushUnique("Structurer légèrement si nécessaire pour que l’ensemble reste net.");
        break;
      case "Romantique":
        pushUnique("Favoriser autour du visage des lignes plus souples, plus délicates et plus enveloppantes.");
        pushUnique("Veiller à ne pas effacer complètement la présence du visage sous trop de douceur.");
        break;
      case "Flamboyant":
        pushUnique("Autoriser davantage d’impact dans les accessoires, les montures ou les volumes près du visage.");
        pushUnique("Veiller à garder une hiérarchie claire pour éviter l’excès visuel.");
        break;
      case "Artistique":
        pushUnique("Explorer des choix plus originaux ou contrastés près du visage, tant que la lecture reste maîtrisée.");
        pushUnique("Conserver un fil conducteur clair pour que la singularité reste lisible.");
        break;
      default:
        break;
    }
  }

  if (secondary) {
    pushUnique(
      `La nuance ${secondary.toLowerCase()} peut être utilisée pour enrichir le style sans faire perdre la dominante ${primary ? primary.toLowerCase() : "principale"}.`
    );
  }

  switch (goalText) {
    case "plus affirmé":
      pushUnique("Renforcer légèrement le contraste, la présence ou la structure pour donner plus d’impact.");
      break;
    case "plus doux":
      pushUnique("Adoucir la lecture générale par des lignes, matières ou détails moins abrupts.");
      break;
    case "plus structuré":
      pushUnique("Rendre l’ensemble plus construit et plus lisible avec des lignes mieux définies.");
      break;
    case "plus naturel":
      pushUnique("Veiller à conserver de la spontanéité et de la fluidité dans l’expression du style.");
      break;
    case "plus élégant":
      pushUnique("Raffiner la sélection des formes et des détails pour donner une lecture plus soignée.");
      break;
    case "plus créatif":
      pushUnique("Autoriser davantage d’originalité tout en gardant une cohérence visuelle globale.");
      break;
    case "plus visible":
      pushUnique("Assumer une présence plus forte, avec au moins un point focal clairement identifiable.");
      break;
    case "plus sobre":
      pushUnique("Épurer la composition visuelle pour gagner en lisibilité et en maîtrise.");
      break;
    case "plus moderne":
      pushUnique("Introduire des choix plus actuels dans la ligne, les proportions ou les associations.");
      break;
    case "plus cohérent":
      pushUnique("Veiller à ce que chaque élément aille dans la même direction stylistique.");
      break;
    default:
      break;
  }

  return items;
}

function buildHairAdviceByStyle(primaryStyle, secondaryStyle, goal) {
  const items = [];
  const primary = primaryStyle?.label || "";
  const secondary = secondaryStyle?.label || "";
  const goalText = (goal || "").toLowerCase();

  const pushUnique = (text) => {
    if (text && !items.includes(text)) items.push(text);
  };

  switch (primary) {
    case "Classique":
      pushUnique("Privilégier des coiffures nettes, soignées et lisibles.");
      pushUnique("Garder une ligne maîtrisée, sans effet trop flou ou trop désordonné.");
      break;

    case "Traditionnel":
      pushUnique("Conserver des coiffures simples, rassurantes et faciles à porter.");
      pushUnique("Actualiser légèrement l’ensemble pour éviter un rendu trop daté.");
      break;

    case "Sportswear":
      pushUnique("Favoriser des coiffures souples, naturelles et pratiques au quotidien.");
      pushUnique("Garder une impression de fraîcheur et de simplicité sans tomber dans le négligé.");
      break;

    case "Romantique":
      pushUnique("Privilégier des coiffures plus douces, plus souples et légèrement enveloppantes.");
      pushUnique("Les mouvements flous, souples ou délicatement travaillés seront souvent plus cohérents.");
      break;

    case "Flamboyant":
      pushUnique("Assumer une coiffure plus présente, plus visible ou plus travaillée si cela reste cohérent avec l’ensemble.");
      pushUnique("Veiller à garder une vraie maîtrise pour éviter l’excès visuel.");
      break;

    case "Artistique":
      pushUnique("Autoriser davantage d’originalité dans la coiffure, tant que la ligne globale reste lisible.");
      pushUnique("Jouer sur une signature plus personnelle, sans rompre complètement l’harmonie du visage.");
      break;

    default:
      break;
  }

  if (secondary) {
    pushUnique(
      `La nuance ${secondary.toLowerCase()} peut influencer la coiffure, sans faire perdre la dominante ${primary ? primary.toLowerCase() : "principale"}.`
    );
  }

  switch (goalText) {
    case "plus affirmé":
      pushUnique("Renforcer légèrement la présence de la coiffure pour donner plus de caractère.");
      break;
    case "plus doux":
      pushUnique("Adoucir la coiffure avec plus de souplesse et moins de rigidité dans les lignes.");
      break;
    case "plus structuré":
      pushUnique("Rendre la coiffure plus construite et plus nette dans sa forme générale.");
      break;
    case "plus naturel":
      pushUnique("Garder une coiffure simple, fluide et crédible dans la vie quotidienne.");
      break;
    case "plus élégant":
      pushUnique("Soigner davantage la finition et la tenue générale de la coiffure.");
      break;
    case "plus créatif":
      pushUnique("Introduire une touche d’originalité ou un détail distinctif dans la coiffure.");
      break;
    case "plus visible":
      pushUnique("Donner davantage de présence visuelle à la coiffure pour renforcer l’impact global.");
      break;
    case "plus sobre":
      pushUnique("Épurer la coiffure pour aller vers quelque chose de plus discret et plus maîtrisé.");
      break;
    case "plus moderne":
      pushUnique("Actualiser la ligne de coiffure pour qu’elle paraisse plus contemporaine.");
      break;
    case "plus cohérent":
      pushUnique("Veiller à ce que la coiffure soit pleinement alignée avec le style vestimentaire choisi.");
      break;
    default:
      break;
  }

  return items;
}

function buildGlassesAdviceByStyle(primaryStyle, secondaryStyle, goal) {
  const items = [];
  const primary = primaryStyle?.label || "";
  const secondary = secondaryStyle?.label || "";
  const goalText = (goal || "").toLowerCase();

  const pushUnique = (text) => {
    if (text && !items.includes(text)) items.push(text);
  };

  switch (primary) {
    case "Classique":
      pushUnique("Privilégier des montures sobres, équilibrées et intemporelles.");
      pushUnique("Préférer des formes nettes et maîtrisées plutôt que trop originales.");
      break;

    case "Traditionnel":
      pushUnique("Choisir des montures rassurantes, discrètes et faciles à porter.");
      pushUnique("Éviter les formes trop mode si l’objectif est de rester dans une lecture stable.");
      break;

    case "Sportswear":
      pushUnique("Favoriser des montures simples, confortables et faciles à vivre.");
      pushUnique("Garder une impression de naturel et de spontanéité dans le choix des lunettes.");
      break;

    case "Romantique":
      pushUnique("Privilégier des montures plus douces, plus légères ou plus délicates visuellement.");
      pushUnique("Éviter les formes trop dures si l’on veut préserver une lecture souple et harmonieuse.");
      break;

    case "Flamboyant":
      pushUnique("Assumer des montures plus visibles ou plus affirmées si cela soutient l’impact recherché.");
      pushUnique("Veiller à garder un point focal clair sans créer de surcharge autour du visage.");
      break;

    case "Artistique":
      pushUnique("Autoriser des montures plus créatives, plus singulières ou plus contrastées.");
      pushUnique("Garder malgré tout une ligne lisible pour que l’originalité reste cohérente.");
      break;

    default:
      break;
  }

  if (secondary) {
    pushUnique(
      `La nuance ${secondary.toLowerCase()} peut affiner le choix des montures sans effacer la dominante ${primary ? primary.toLowerCase() : "principale"}.`
    );
  }

  switch (goalText) {
    case "plus affirmé":
      pushUnique("Choisir des montures avec plus de présence pour renforcer l’impact du visage.");
      break;
    case "plus doux":
      pushUnique("Préférer des montures visuellement plus souples ou moins contrastées.");
      break;
    case "plus structuré":
      pushUnique("S’orienter vers des montures plus nettes et plus construites dans leur ligne.");
      break;
    case "plus naturel":
      pushUnique("Garder des lunettes crédibles, simples et faciles à intégrer au quotidien.");
      break;
    case "plus élégant":
      pushUnique("Privilégier des montures raffinées, soignées et visuellement équilibrées.");
      break;
    case "plus créatif":
      pushUnique("Autoriser davantage d’originalité dans la forme, la couleur ou le détail des montures.");
      break;
    case "plus visible":
      pushUnique("Assumer un choix de lunettes plus présent, capable de devenir un vrai accent de style.");
      break;
    case "plus sobre":
      pushUnique("Épurer le choix des montures pour aller vers quelque chose de plus discret et plus maîtrisé.");
      break;
    case "plus moderne":
      pushUnique("Introduire une monture plus actuelle dans la forme ou dans la finition.");
      break;
    case "plus cohérent":
      pushUnique("Veiller à ce que les lunettes prolongent clairement le langage stylistique global.");
      break;
    default:
      break;
  }

  return items;
}

function buildEarringsAdviceByStyle(primaryStyle, secondaryStyle, goal) {
  const items = [];
  const primary = primaryStyle?.label || "";
  const secondary = secondaryStyle?.label || "";
  const goalText = (goal || "").toLowerCase();

  const pushUnique = (text) => {
    if (text && !items.includes(text)) items.push(text);
  };

  switch (primary) {
    case "Classique":
      pushUnique("Privilégier des boucles d’oreilles sobres, élégantes et intemporelles.");
      pushUnique("Favoriser des formes équilibrées, discrètes et faciles à intégrer à une silhouette maîtrisée.");
      break;

    case "Traditionnel":
      pushUnique("Choisir des boucles d’oreilles rassurantes, discrètes et peu démonstratives.");
      pushUnique("Éviter les modèles trop mode si l’objectif est de rester dans une lecture stable.");
      break;

    case "Sportswear":
      pushUnique("Privilégier des boucles d’oreilles simples, légères et faciles à porter au quotidien.");
      pushUnique("Garder une impression de naturel et de praticité dans le choix des bijoux.");
      break;

    case "Romantique":
      pushUnique("Favoriser des boucles d’oreilles plus délicates, plus souples ou plus raffinées.");
      pushUnique("Les formes fines, légèrement fluides ou plus travaillées seront souvent plus cohérentes.");
      break;

    case "Flamboyant":
      pushUnique("Assumer des boucles d’oreilles plus présentes, plus visibles ou plus marquantes.");
      pushUnique("Veiller à garder un point focal clair pour éviter une impression de surcharge.");
      break;

    case "Artistique":
      pushUnique("Autoriser des boucles d’oreilles plus originales, plus singulières ou plus créatives.");
      pushUnique("Garder malgré tout une cohérence d’ensemble pour que l’originalité reste lisible.");
      break;

    default:
      break;
  }

  if (secondary) {
    pushUnique(
      `La nuance ${secondary.toLowerCase()} peut enrichir le choix des boucles d’oreilles sans effacer la dominante ${primary ? primary.toLowerCase() : "principale"}.`
    );
  }

  switch (goalText) {
    case "plus affirmé":
      pushUnique("Choisir des boucles d’oreilles plus présentes pour donner davantage d’impact au visage.");
      break;
    case "plus doux":
      pushUnique("Préférer des boucles d’oreilles plus délicates ou plus arrondies pour adoucir la lecture.");
      break;
    case "plus structuré":
      pushUnique("S’orienter vers des formes plus nettes et plus construites dans les lignes.");
      break;
    case "plus naturel":
      pushUnique("Garder des bijoux simples, spontanés et faciles à intégrer au quotidien.");
      break;
    case "plus élégant":
      pushUnique("Privilégier des boucles d’oreilles raffinées, soignées et visuellement équilibrées.");
      break;
    case "plus créatif":
      pushUnique("Autoriser davantage d’originalité dans la forme, la matière ou le détail.");
      break;
    case "plus visible":
      pushUnique("Assumer un bijou d’oreille plus présent, capable de devenir un vrai accent de style.");
      break;
    case "plus sobre":
      pushUnique("Épurer le choix des boucles d’oreilles pour aller vers quelque chose de plus discret.");
      break;
    case "plus moderne":
      pushUnique("Introduire une forme ou un détail plus actuel dans le choix des boucles d’oreilles.");
      break;
    case "plus cohérent":
      pushUnique("Veiller à ce que les boucles d’oreilles prolongent clairement le langage stylistique global.");
      break;
    default:
      break;
  }

  return items;
}

function mergeAdviceLists(...groups) {
  const seen = new Set();
  const merged = [];

  groups
    .flat()
    .filter(Boolean)
    .forEach((item) => {
      const key = item.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    });

  return merged;
}

function buildNecklineAdviceByStyle(primaryStyle, secondaryStyle, goal) {
  const items = [];
  const primary = primaryStyle?.label || "";
  const secondary = secondaryStyle?.label || "";
  const goalText = (goal || "").toLowerCase();

  const pushUnique = (text) => {
    if (text && !items.includes(text)) items.push(text);
  };

  switch (primary) {
    case "Classique":
      pushUnique("Privilégier des cols et encolures sobres, nets et équilibrés.");
      pushUnique("Favoriser des lignes lisibles et intemporelles plutôt que des formes trop démonstratives.");
      break;

    case "Traditionnel":
      pushUnique("Choisir des encolures rassurantes, simples et faciles à porter.");
      pushUnique("Éviter les formes trop mode si l’objectif est de rester dans une lecture stable.");
      break;

    case "Sportswear":
      pushUnique("Favoriser des cols pratiques, confortables et naturels dans leur lecture.");
      pushUnique("Garder une impression de simplicité fluide, sans rigidifier excessivement le haut du corps.");
      break;

    case "Romantique":
      pushUnique("Privilégier des encolures plus douces, plus souples ou plus délicates.");
      pushUnique("Les lignes légèrement ouvertes, arrondies ou plus fluides seront souvent plus cohérentes.");
      break;

    case "Flamboyant":
      pushUnique("Assumer des cols ou encolures plus présents si cela soutient l’impact recherché.");
      pushUnique("Veiller à garder un point focal clair pour éviter une surcharge visuelle autour du visage.");
      break;

    case "Artistique":
      pushUnique("Autoriser des encolures plus originales ou plus contrastées, tant que la lecture reste cohérente.");
      pushUnique("Conserver malgré tout une ligne directrice lisible dans la construction du haut du buste.");
      break;

    default:
      break;
  }

  if (secondary) {
    pushUnique(
      `La nuance ${secondary.toLowerCase()} peut affiner le choix des cols et encolures sans effacer la dominante ${primary ? primary.toLowerCase() : "principale"}.`
    );
  }

  switch (goalText) {
    case "plus affirmé":
      pushUnique("Choisir des encolures avec davantage de présence pour renforcer le caractère général.");
      break;
    case "plus doux":
      pushUnique("Préférer des lignes plus souples et moins abruptes autour du haut du buste.");
      break;
    case "plus structuré":
      pushUnique("S’orienter vers des cols ou des encolures plus nets et mieux construits.");
      break;
    case "plus naturel":
      pushUnique("Garder des encolures simples, fluides et faciles à intégrer au quotidien.");
      break;
    case "plus élégant":
      pushUnique("Privilégier des lignes raffinées et bien équilibrées dans le choix des cols.");
      break;
    case "plus créatif":
      pushUnique("Introduire une touche de singularité dans la forme ou la construction de l’encolure.");
      break;
    case "plus visible":
      pushUnique("Assumer un col ou une encolure plus marquante si cela reste cohérent avec l’ensemble.");
      break;
    case "plus sobre":
      pushUnique("Épurer les encolures pour aller vers quelque chose de plus discret et maîtrisé.");
      break;
    case "plus moderne":
      pushUnique("Actualiser le choix des encolures avec des lignes plus contemporaines.");
      break;
    case "plus cohérent":
      pushUnique("Veiller à ce que le col prolonge clairement le langage stylistique global.");
      break;
    default:
      break;
  }

  return items;
}

function buildBodyAdviceByStyle(primaryStyle, secondaryStyle, goal, area) {
  const items = [];
  const primary = primaryStyle?.label || "";
  const secondary = secondaryStyle?.label || "";
  const goalText = (goal || "").toLowerCase();

  const pushUnique = (text) => {
    if (text && !items.includes(text)) items.push(text);
  };

  if (area === "tops") {
    switch (primary) {
      case "Classique":
        pushUnique("Privilégier des hauts nets, sobres et bien construits.");
        pushUnique("Favoriser des lignes lisibles et équilibrées plutôt que des effets trop démonstratifs.");
        break;
      case "Traditionnel":
        pushUnique("Choisir des hauts rassurants, simples et faciles à porter.");
        pushUnique("Garder une lecture stable, avec une modernisation légère si nécessaire.");
        break;
      case "Sportswear":
        pushUnique("Privilégier des hauts confortables, fluides et faciles à vivre.");
        pushUnique("Conserver une impression de naturel sans tomber dans le relâché.");
        break;
      case "Romantique":
        pushUnique("Favoriser des hauts plus souples, plus délicats ou plus adoucis dans leur ligne.");
        pushUnique("Les matières et détails légèrement fluides seront souvent plus cohérents.");
        break;
      case "Flamboyant":
        pushUnique("Assumer des hauts plus visibles ou à plus forte présence visuelle.");
        pushUnique("Canaliser les volumes et les détails pour éviter l’excès.");
        break;
      case "Artistique":
        pushUnique("Autoriser davantage d’originalité dans les coupes, les associations ou les volumes.");
        pushUnique("Garder malgré tout une cohérence globale pour que le style reste lisible.");
        break;
      default:
        break;
    }
  }

  if (area === "jackets") {
    switch (primary) {
      case "Classique":
        pushUnique("Privilégier des vestes structurées, nettes et intemporelles.");
        pushUnique("Favoriser des coupes bien construites, avec une vraie lisibilité des lignes.");
        break;
      case "Traditionnel":
        pushUnique("Choisir des vestes rassurantes et faciles à intégrer dans une garde-robe stable.");
        pushUnique("Éviter les coupes trop mode si l’objectif est de garder une lecture familière.");
        break;
      case "Sportswear":
        pushUnique("Privilégier des vestes simples, pratiques et faciles à porter.");
        pushUnique("Garder une structure légère pour ne pas alourdir le style.");
        break;
      case "Romantique":
        pushUnique("Favoriser des vestes plus souples, plus fluides ou légèrement adoucies.");
        pushUnique("Éviter une rigidité excessive si l’objectif est de préserver la douceur du style.");
        break;
      case "Flamboyant":
        pushUnique("Assumer des vestes plus présentes, plus visibles ou plus expressives.");
        pushUnique("Veiller à garder un vrai équilibre entre impact et cohérence.");
        break;
      case "Artistique":
        pushUnique("Autoriser des vestes plus singulières dans la coupe ou la construction.");
        pushUnique("Conserver néanmoins une ligne directrice claire dans la silhouette.");
        break;
      default:
        break;
    }
  }

  if (area === "bottoms") {
    switch (primary) {
      case "Classique":
        pushUnique("Privilégier des bas sobres, nets et bien équilibrés.");
        pushUnique("Favoriser des lignes claires qui soutiennent la structure générale de la silhouette.");
        break;
      case "Traditionnel":
        pushUnique("Choisir des bas simples, rassurants et faciles à coordonner.");
        pushUnique("Éviter des formes trop marquées si l’objectif est de rester dans la stabilité.");
        break;
      case "Sportswear":
        pushUnique("Privilégier des bas confortables, fluides et faciles à vivre.");
        pushUnique("Garder une lecture détendue mais suffisamment propre pour rester valorisante.");
        break;
      case "Romantique":
        pushUnique("Favoriser des lignes plus souples, plus délicates et plus fluides.");
        pushUnique("Éviter des volumes trop durs si l’objectif est de conserver de la douceur.");
        break;
      case "Flamboyant":
        pushUnique("Assumer un bas plus présent ou plus expressif si cela sert vraiment le style.");
        pushUnique("Canaliser l’impact visuel pour ne pas déséquilibrer l’ensemble.");
        break;
      case "Artistique":
        pushUnique("Autoriser des formes plus originales ou moins convenues dans le bas de silhouette.");
        pushUnique("Veiller à maintenir une cohérence globale malgré la singularité.");
        break;
      default:
        break;
    }
  }

  if (area === "necklines") {
    switch (primary) {
      case "Classique":
        pushUnique("Privilégier des encolures sobres, nettes et équilibrées.");
        pushUnique("Choisir des lignes intemporelles qui soutiennent la lisibilité de la silhouette.");
        break;
      case "Traditionnel":
        pushUnique("Favoriser des encolures simples, stables et faciles à porter.");
        pushUnique("Éviter les formes trop mode si l’on souhaite rester dans un registre rassurant.");
        break;
      case "Sportswear":
        pushUnique("Garder des encolures pratiques, simples et naturelles dans leur lecture.");
        pushUnique("Éviter une sophistication excessive si elle nuit à la spontanéité du style.");
        break;
      case "Romantique":
        pushUnique("Privilégier des encolures plus douces, plus souples ou plus délicates.");
        pushUnique("Les lignes légèrement ouvertes ou plus fluides seront souvent plus cohérentes.");
        break;
      case "Flamboyant":
        pushUnique("Assumer une encolure plus visible si elle sert vraiment l’impact recherché.");
        pushUnique("Veiller à garder un point focal clair sans surcharger le haut du corps.");
        break;
      case "Artistique":
        pushUnique("Autoriser des encolures plus singulières, créatives ou contrastées.");
        pushUnique("Conserver malgré tout une cohérence avec la structure générale du style.");
        break;
      default:
        break;
    }
  }

  if (area === "accessories") {
    switch (primary) {
      case "Classique":
        pushUnique("Privilégier des accessoires sobres, élégants et intemporels.");
        pushUnique("Favoriser une lecture raffinée plutôt qu’un effet démonstratif.");
        break;
      case "Traditionnel":
        pushUnique("Choisir des accessoires rassurants, discrets et faciles à associer.");
        pushUnique("Garder une logique simple et cohérente dans les détails.");
        break;
      case "Sportswear":
        pushUnique("Favoriser des accessoires pratiques, simples et faciles à vivre.");
        pushUnique("Garder une impression de naturel et d’efficacité dans le choix des détails.");
        break;
      case "Romantique":
        pushUnique("Privilégier des accessoires plus délicats, plus doux ou plus raffinés.");
        pushUnique("Les détails fins ou subtilement travaillés seront souvent plus cohérents.");
        break;
      case "Flamboyant":
        pushUnique("Assumer des accessoires plus visibles ou plus marquants quand cela soutient le style.");
        pushUnique("Veiller à garder une hiérarchie claire pour éviter l’excès visuel.");
        break;
      case "Artistique":
        pushUnique("Autoriser des accessoires plus créatifs, plus originaux ou plus singuliers.");
        pushUnique("Garder malgré tout un fil conducteur pour conserver la lisibilité du style.");
        break;
      default:
        break;
    }
  }

  if (secondary) {
    pushUnique(
      `La nuance ${secondary.toLowerCase()} peut enrichir ce registre sans effacer la dominante ${primary ? primary.toLowerCase() : "principale"}.`
    );
  }

  switch (goalText) {
    case "plus affirmé":
      pushUnique("Renforcer légèrement la présence visuelle des pièces choisies pour donner plus d’impact.");
      break;
    case "plus doux":
      pushUnique("Adoucir la lecture générale avec des lignes, matières ou détails moins abrupts.");
      break;
    case "plus structuré":
      pushUnique("Rendre l’ensemble plus construit et mieux défini dans les lignes.");
      break;
    case "plus naturel":
      pushUnique("Garder une impression de fluidité, de simplicité et de crédibilité dans le porté.");
      break;
    case "plus élégant":
      pushUnique("Affiner les choix pour donner une lecture plus soignée et plus harmonieuse.");
      break;
    case "plus créatif":
      pushUnique("Autoriser davantage de singularité tout en gardant une vraie cohérence d’ensemble.");
      break;
    case "plus visible":
      pushUnique("Assumer une présence plus forte dans au moins un élément important de la silhouette.");
      break;
    case "plus sobre":
      pushUnique("Épurer les choix pour gagner en lisibilité et en maîtrise.");
      break;
    case "plus moderne":
      pushUnique("Introduire des lignes ou des proportions plus actuelles dans la silhouette.");
      break;
    case "plus cohérent":
      pushUnique("Veiller à ce que tous les éléments aillent clairement dans la même direction stylistique.");
      break;
    default:
      break;
  }

  return items;
}

export default function Page() {
  const [tab, setTab] = useState("diagnostic");

  const [isPrinting, setIsPrinting] = useState(false);
 
  const [styleProfile, setStyleProfile] = useState({
    profileType: "femme",
    primary: "",
    secondary: "",
    goal: "",
  });

  const [body, setBody] = useState({
    shoulders: "",
    bust: "",
    waist: "",
    hips: "",
  });

  const [bodyVisual, setBodyVisual] = useState({
    shouldersVsHips: "",
    waistDefinition: "",
  });

  const [face, setFace] = useState({
    width: "",
    height: "",
    jaw: "",
    forehead: "",
  });

  const [faceVisual, setFaceVisual] = useState({
    lengthFeel: "",
    widthDominance: "",
    lines: "",
  });

  const bodyResult = useMemo(() => {
    return getBodyType({
      ...body,
      visual: bodyVisual,
    });
  }, [body, bodyVisual]);

  const faceResult = useMemo(() => {
    return getFaceType({
      ...face,
      visual: faceVisual,
    });
  }, [face, faceVisual]);

  const availableStyles = useMemo(() => {
    return getStylesByProfileType(styleProfile.profileType);
  }, [styleProfile.profileType]);
  
  const primaryStyle = useMemo(() => {
    return getStyleById(styleProfile.profileType, styleProfile.primary);
  }, [styleProfile.profileType, styleProfile.primary]);
  
  const secondaryStyle = useMemo(() => {
    return getStyleById(styleProfile.profileType, styleProfile.secondary);
  }, [styleProfile.profileType, styleProfile.secondary]);

  const resetAll = () => {
    setBody({
      shoulders: "",
      bust: "",
      waist: "",
      hips: "",
    });

      

    setStyleProfile({
      profileType: "femme",
      primary: "",
      secondary: "",
      goal: "",
    });

    setBodyVisual({
      shouldersVsHips: "",
      waistDefinition: "",
    });

    setFace({
      width: "",
      height: "",
      jaw: "",
      forehead: "",
    });

    setFaceVisual({
      lengthFeel: "",
      widthDominance: "",
      lines: "",
    });

    setTab("diagnostic");
  };

  const handleExportPdf = () => {
    setIsPrinting(true);
  
    setTimeout(() => {
      window.print();
    }, 300);
  };
  
  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
    };
  
    window.addEventListener("afterprint", handleAfterPrint);
  
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return (
    <div className="container">
      {/* HEADER */}
      <div
        className="header"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          marginBottom: 20,
        }}
      >
        <img src="/logo.png" alt="By Marinea" className="logo" />
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 4 }}>By Marinea</h1>
          <div style={{ fontSize: 15, opacity: 0.8 }}>
            Diagnostic morphologique premium
          </div>
        </div>
      </div>

      {/* TABS */}
      <div
  className="tabs no-print"
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        <ChoiceButton
          active={tab === "diagnostic"}
          onClick={() => setTab("diagnostic")}
        >
          Diagnostic
        </ChoiceButton>

        <ChoiceButton
          active={tab === "resultat"}
          onClick={() => setTab("resultat")}
        >
          Résultat
        </ChoiceButton>

        <Button onClick={resetAll}>Réinitialiser</Button>

        <Button onClick={handleExportPdf}>Exporter en PDF</Button>
      </div>

      
      {/* DIAGNOSTIC */}
{/* DIAGNOSTIC */}
{(tab === "diagnostic" || isPrinting) && (
        <div className="section-grid">
          {/* STYLE VESTIMENTAIRE */}
          <Card>
            <SectionTitle>Style vestimentaire</SectionTitle>

            <div style={{ marginBottom: 18, opacity: 0.8 }}>
              Sélectionne ici le type de profil et les styles principaux à
              prendre en compte dans la synthèse finale.
            </div>

            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Type de profil</FieldLabel>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {PROFILE_TYPES.map((item) => (
                  <ChoiceButton
                    key={item.id}
                    active={styleProfile.profileType === item.id}
                    onClick={() =>
                      setStyleProfile({
                        ...styleProfile,
                        profileType: item.id,
                        primary: "",
                        secondary: "",
                      })
                    }
                  >
                    {item.label}
                  </ChoiceButton>
                ))}
              </div>
            </div>

            <div className="field-stack">
              <div>
                <FieldLabel>Style principal</FieldLabel>
                <select
                  value={styleProfile.primary}
                  onChange={(e) =>
                    setStyleProfile({
                      ...styleProfile,
                      primary: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    fontSize: 14,
                  }}
                >
                  <option value="">Choisir un style principal</option>
                  {availableStyles.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>Style secondaire</FieldLabel>
                <select
                  value={styleProfile.secondary}
                  onChange={(e) =>
                    setStyleProfile({
                      ...styleProfile,
                      secondary: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    fontSize: 14,
                  }}
                >
                  <option value="">Choisir un style secondaire</option>
                  {availableStyles.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>Objectif de rendu</FieldLabel>
                <select
                  value={styleProfile.goal}
                  onChange={(e) =>
                    setStyleProfile({
                      ...styleProfile,
                      goal: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    fontSize: 14,
                  }}
                >
                  <option value="">Choisir un objectif de rendu</option>
                  {RENDER_GOALS.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(primaryStyle || secondaryStyle) && (
              <div style={{ marginTop: 22, display: "grid", gap: 16 }}>
                {primaryStyle && (
                  <div
                    style={{
                      border: "1px solid #E7DFDC",
                      borderRadius: 14,
                      padding: 14,
                      background: "#FCFBFA",
                    }}
                  >
                    <strong>Référence style principal</strong>
                    <div style={{ marginTop: 8, lineHeight: 1.8 }}>
                      <div>
                        <strong>{primaryStyle.label}</strong>
                      </div>
                      <div>{primaryStyle.description}</div>
                      <div>
                        <strong>Impact :</strong> {primaryStyle.impact}
                      </div>
                      <div>
                        <strong>Atouts :</strong> {primaryStyle.atouts}
                      </div>
                      <div>
                        <strong>Conseil image :</strong>{" "}
                        {primaryStyle.conseilImage}
                      </div>
                    </div>
                  </div>
                )}

                {secondaryStyle && (
                  <div
                    style={{
                      border: "1px solid #E7DFDC",
                      borderRadius: 14,
                      padding: 14,
                      background: "#FCFBFA",
                    }}
                  >
                    <strong>Référence style secondaire</strong>
                    <div style={{ marginTop: 8, lineHeight: 1.8 }}>
                      <div>
                        <strong>{secondaryStyle.label}</strong>
                      </div>
                      <div>{secondaryStyle.description}</div>
                      <div>
                        <strong>Impact :</strong> {secondaryStyle.impact}
                      </div>
                      <div>
                        <strong>Atouts :</strong> {secondaryStyle.atouts}
                      </div>
                      <div>
                        <strong>Conseil image :</strong>{" "}
                        {secondaryStyle.conseilImage}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* SILHOUETTE */}
          <Card>
            <SectionTitle>Morphologie silhouette</SectionTitle>

            <div style={{ marginBottom: 18, opacity: 0.8 }}>
              Saisis les mesures principales du corps et complète la lecture
              visuelle.
            </div>

            <div className="field-stack">
              <div>
                <FieldLabel>Largeur épaules</FieldLabel>
                <Input
                  value={body.shoulders}
                  onChange={(e) =>
                    setBody({ ...body, shoulders: e.target.value })
                  }
                  placeholder="Ex. 38"
                />
              </div>

              <div>
                <FieldLabel>Tour poitrine</FieldLabel>
                <Input
                  value={body.bust}
                  onChange={(e) => setBody({ ...body, bust: e.target.value })}
                  placeholder="Ex. 92"
                />
              </div>

              <div>
                <FieldLabel>Tour taille</FieldLabel>
                <Input
                  value={body.waist}
                  onChange={(e) => setBody({ ...body, waist: e.target.value })}
                  placeholder="Ex. 74"
                />
              </div>

              <div>
                <FieldLabel>Tour hanches</FieldLabel>
                <Input
                  value={body.hips}
                  onChange={(e) => setBody({ ...body, hips: e.target.value })}
                  placeholder="Ex. 100"
                />
              </div>
            </div>

            <div style={{ marginTop: 25 }}>
              <FieldLabel>Visuellement, les épaules paraissent…</FieldLabel>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                <ChoiceButton
                  active={bodyVisual.shouldersVsHips === "narrower"}
                  onClick={() =>
                    setBodyVisual({
                      ...bodyVisual,
                      shouldersVsHips: "narrower",
                    })
                  }
                >
                  Plus étroites que les hanches
                </ChoiceButton>

                <ChoiceButton
                  active={bodyVisual.shouldersVsHips === "balanced"}
                  onClick={() =>
                    setBodyVisual({
                      ...bodyVisual,
                      shouldersVsHips: "balanced",
                    })
                  }
                >
                  Équilibrées
                </ChoiceButton>

                <ChoiceButton
                  active={bodyVisual.shouldersVsHips === "wider"}
                  onClick={() =>
                    setBodyVisual({
                      ...bodyVisual,
                      shouldersVsHips: "wider",
                    })
                  }
                >
                  Plus larges que les hanches
                </ChoiceButton>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <FieldLabel>Visuellement, la taille paraît…</FieldLabel>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                <ChoiceButton
                  active={bodyVisual.waistDefinition === "marked"}
                  onClick={() =>
                    setBodyVisual({
                      ...bodyVisual,
                      waistDefinition: "marked",
                    })
                  }
                >
                  Marquée
                </ChoiceButton>

                <ChoiceButton
                  active={bodyVisual.waistDefinition === "medium"}
                  onClick={() =>
                    setBodyVisual({
                      ...bodyVisual,
                      waistDefinition: "medium",
                    })
                  }
                >
                  Moyenne
                </ChoiceButton>

                <ChoiceButton
                  active={bodyVisual.waistDefinition === "low"}
                  onClick={() =>
                    setBodyVisual({
                      ...bodyVisual,
                      waistDefinition: "low",
                    })
                  }
                >
                  Peu marquée
                </ChoiceButton>
              </div>
            </div>
          </Card>

          {/* VISAGE */}
          <Card>
            <SectionTitle>Morphologie visage</SectionTitle>

            <div style={{ marginBottom: 18, opacity: 0.8 }}>
              Saisis les mesures principales du visage et complète la lecture
              visuelle.
            </div>

            <div className="field-stack">
              <div>
                <FieldLabel>Largeur visage</FieldLabel>
                <Input
                  value={face.width}
                  onChange={(e) => setFace({ ...face, width: e.target.value })}
                  placeholder="Ex. 14"
                />
              </div>

              <div>
                <FieldLabel>Hauteur visage</FieldLabel>
                <Input
                  value={face.height}
                  onChange={(e) =>
                    setFace({ ...face, height: e.target.value })
                  }
                  placeholder="Ex. 19"
                />
              </div>

              <div>
                <FieldLabel>Largeur mâchoire</FieldLabel>
                <Input
                  value={face.jaw}
                  onChange={(e) => setFace({ ...face, jaw: e.target.value })}
                  placeholder="Ex. 12"
                />
              </div>

              <div>
                <FieldLabel>Largeur front</FieldLabel>
                <Input
                  value={face.forehead}
                  onChange={(e) =>
                    setFace({ ...face, forehead: e.target.value })
                  }
                  placeholder="Ex. 13"
                />
              </div>
            </div>

            <div style={{ marginTop: 25 }}>
              <FieldLabel>Visuellement, le visage paraît…</FieldLabel>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                <ChoiceButton
                  active={faceVisual.lengthFeel === "short"}
                  onClick={() =>
                    setFaceVisual({
                      ...faceVisual,
                      lengthFeel: "short",
                    })
                  }
                >
                  Plutôt court / large
                </ChoiceButton>

                <ChoiceButton
                  active={faceVisual.lengthFeel === "balanced"}
                  onClick={() =>
                    setFaceVisual({
                      ...faceVisual,
                      lengthFeel: "balanced",
                    })
                  }
                >
                  Équilibré
                </ChoiceButton>

                <ChoiceButton
                  active={faceVisual.lengthFeel === "long"}
                  onClick={() =>
                    setFaceVisual({
                      ...faceVisual,
                      lengthFeel: "long",
                    })
                  }
                >
                  Plutôt long
                </ChoiceButton>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <FieldLabel>Visuellement, la largeur dominante semble…</FieldLabel>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                <ChoiceButton
                  active={faceVisual.widthDominance === "forehead"}
                  onClick={() =>
                    setFaceVisual({
                      ...faceVisual,
                      widthDominance: "forehead",
                    })
                  }
                >
                  Front plus large
                </ChoiceButton>

                <ChoiceButton
                  active={faceVisual.widthDominance === "balanced"}
                  onClick={() =>
                    setFaceVisual({
                      ...faceVisual,
                      widthDominance: "balanced",
                    })
                  }
                >
                  Équilibré
                </ChoiceButton>

                <ChoiceButton
                  active={faceVisual.widthDominance === "jaw"}
                  onClick={() =>
                    setFaceVisual({
                      ...faceVisual,
                      widthDominance: "jaw",
                    })
                  }
                >
                  Mâchoire plus large
                </ChoiceButton>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <FieldLabel>Les lignes du visage paraissent…</FieldLabel>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                <ChoiceButton
                  active={faceVisual.lines === "soft"}
                  onClick={() =>
                    setFaceVisual({
                      ...faceVisual,
                      lines: "soft",
                    })
                  }
                >
                  Douces / arrondies
                </ChoiceButton>

                <ChoiceButton
                  active={faceVisual.lines === "mixed"}
                  onClick={() =>
                    setFaceVisual({
                      ...faceVisual,
                      lines: "mixed",
                    })
                  }
                >
                  Mixtes
                </ChoiceButton>

                <ChoiceButton
                  active={faceVisual.lines === "structured"}
                  onClick={() =>
                    setFaceVisual({
                      ...faceVisual,
                      lines: "structured",
                    })
                  }
                >
                  Structurées
                </ChoiceButton>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* RESULTATS */}
      {(tab === "resultat" || isPrinting) && (
  <div className="section-grid print-area">
          {(bodyResult || faceResult) && (
            <Card>
              <SectionTitle>Synthèse globale</SectionTitle>

              <div style={{ lineHeight: 1.8 }}>
                {bodyResult && faceResult ? (
                  <>
                    <p style={{ marginBottom: 14 }}>
                      Votre image globale se construit autour d’une silhouette{" "}
                      <strong>{bodyResult.primaryLabel.toLowerCase()}</strong>{" "}
                      et d’un visage à dominante{" "}
                      <strong>{faceResult.label.toLowerCase()}</strong>.
                    </p>

                    <p style={{ marginBottom: 14 }}>
                      {bodyResult.clientSummary} {faceResult.clientSummary}
                    </p>

                    <p style={{ marginBottom: 14 }}>
                      L’idée n’est pas de corriger quoi que ce soit, mais
                      d’accompagner votre structure naturelle avec plus de
                      cohérence, de lisibilité et d’harmonie.
                    </p>

                    {buildStyleDirection(
                      styleProfile,
                      primaryStyle,
                      secondaryStyle
                    ) && (
                      <p style={{ marginBottom: 14 }}>
                        {buildStyleDirection(
                          styleProfile,
                          primaryStyle,
                          secondaryStyle
                        )}
                      </p>
                    )}

{buildStyleTranslation(
                      primaryStyle,
                      secondaryStyle,
                      styleProfile.goal
                    ) && (
                      <p style={{ marginBottom: 14 }}>
                        {buildStyleTranslation(
                          primaryStyle,
                          secondaryStyle,
                          styleProfile.goal
                        )}
                      </p>
                    )}

                    {buildStyleDirection(
                      styleProfile,
                      primaryStyle,
                      secondaryStyle
                    ) && (
                      <p style={{ marginBottom: 14 }}>
                        Le rôle du conseil ne sera donc pas seulement de
                        respecter la morphologie, mais de traduire cette
                        morphologie dans un langage stylistique cohérent avec
                        l’image que l’on souhaite exprimer.
                      </p>
                    )}

                    <p style={{ marginBottom: 14 }}>
                      Sur la silhouette, le fil conducteur sera le suivant :
                      {` ${bodyResult.clientObjective
                        ?.charAt(0)
                        .toLowerCase()}${bodyResult.clientObjective?.slice(1)}`}
                    </p>

                    <p style={{ marginBottom: 14 }}>
                      Sur le visage, la direction la plus juste sera :
                      {` ${faceResult.clientObjective
                        ?.charAt(0)
                        .toLowerCase()}${faceResult.clientObjective?.slice(1)}`}
                    </p>

                    <p style={{ marginBottom: 0 }}>
                      En pratique, cela signifie qu’il faudra garder une lecture
                      d’ensemble cohérente entre le corps et le visage, en
                      choisissant des formes, des volumes et des détails qui
                      soutiennent cette harmonie plutôt que de la contrarier.
                    </p>
                  </>
                ) : bodyResult ? (
                  <>
                    <p style={{ marginBottom: 14 }}>
                      La lecture dominante de votre silhouette est{" "}
                      <strong>{bodyResult.primaryLabel.toLowerCase()}</strong>.
                    </p>

                    <p style={{ marginBottom: 14 }}>
                      {bodyResult.clientSummary}
                    </p>

                    <p style={{ marginBottom: 14 }}>
                      {buildBodyNuance(bodyResult)}
                    </p>

                    <p style={{ marginBottom: 0 }}>
                      {bodyResult.clientObjective}
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ marginBottom: 14 }}>
                      La lecture dominante de votre visage est{" "}
                      <strong>{faceResult.label.toLowerCase()}</strong>.
                    </p>

                    <p style={{ marginBottom: 14 }}>
                      {faceResult.clientSummary}
                    </p>

                    <p style={{ marginBottom: 14 }}>
                      {buildFaceNuance(faceResult)}
                    </p>

                    <p style={{ marginBottom: 0 }}>
                      {faceResult.clientObjective}
                    </p>
                  </>
                )}
              </div>

              {(bodyResult || faceResult) && (
                <div style={{ marginTop: 22 }}>
                  <strong>Priorités d’accompagnement</strong>

                  <ul
                    style={{ marginTop: 10, marginBottom: 0, lineHeight: 1.8 }}
                  >
                    {bodyResult?.advice?.[0] && <li>{bodyResult.advice[0]}</li>}
                    {bodyResult?.advice?.[1] && <li>{bodyResult.advice[1]}</li>}
                    {faceResult?.advice?.[0] && <li>{faceResult.advice[0]}</li>}
                    {faceResult?.advice?.[1] && <li>{faceResult.advice[1]}</li>}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {/* RESULTAT SILHOUETTE */}
          <Card>
            <SectionTitle>Résultat silhouette</SectionTitle>

            {bodyResult ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <ConfidenceBadge
                    label={bodyResult.confidenceLabel}
                    score={bodyResult.confidenceScore}
                  />
                </div>

                <ResultTextBlock
                  title="Lecture globale"
                  text={bodyResult.clientSummary}
                />

                <ResultTextBlock
                  title="Nuance de lecture"
                  text={buildBodyNuance(bodyResult)}
                />

                <ResultTextBlock
                  title="Direction de style"
                  text={bodyResult.clientObjective}
                />

                <ResultTextBlock
                  title="Ce que l’on observe visuellement"
                  text={buildBodyVisualMeaning(bodyResult, bodyVisual)}
                />

                <AdviceGroup
                  title="Pistes prioritaires"
                  items={bodyResult.advice}
                />
<AdviceGroup
                  title="Traduction stylistique"
                  items={buildDetailedStyleAdvice(
                    primaryStyle,
                    secondaryStyle,
                    styleProfile.goal,
                    "body"
                  )}
                />


<AdviceGroup
  title="Hauts"
  items={mergeAdviceLists(
    bodyResult.practicalAdvice?.tops,
    buildBodyAdviceByStyle(
      primaryStyle,
      secondaryStyle,
      styleProfile.goal,
      "tops"
    )
  )}
/>

<AdviceGroup
  title="Vestes"
  items={mergeAdviceLists(
    bodyResult.practicalAdvice?.jackets,
    buildBodyAdviceByStyle(
      primaryStyle,
      secondaryStyle,
      styleProfile.goal,
      "jackets"
    )
  )}
/>

<AdviceGroup
  title="Bas"
  items={mergeAdviceLists(
    bodyResult.practicalAdvice?.bottoms,
    buildBodyAdviceByStyle(
      primaryStyle,
      secondaryStyle,
      styleProfile.goal,
      "bottoms"
    )
  )}
/>


<AdviceGroup
  title="Encolures"
  items={mergeAdviceLists(
    bodyResult.practicalAdvice?.necklines,
    buildBodyAdviceByStyle(
      primaryStyle,
      secondaryStyle,
      styleProfile.goal,
      "necklines"
    )
  )}
/>


<AdviceGroup
  title="Accessoires"
  items={mergeAdviceLists(
    bodyResult.practicalAdvice?.accessories,
    buildBodyAdviceByStyle(
      primaryStyle,
      secondaryStyle,
      styleProfile.goal,
      "accessories"
    )
  )}
/>

                <AdviceGroup
                  title="À éviter"
                  items={bodyResult.practicalAdvice?.avoid}
                />

<details style={{ marginTop: 20 }}>
  <summary style={{ cursor: "pointer", fontWeight: 600 }}>
    Voir les repères techniques
  </summary>

  <div style={{ marginTop: 12 }}>
    <div style={{ lineHeight: 1.7 }}>
      <strong>Lecture principale :</strong>{" "}
      {bodyResult.primaryLabel}
    </div>

    <div style={{ lineHeight: 1.7 }}>
      <strong>Lecture secondaire :</strong>{" "}
      {bodyResult.secondaryLabel}
    </div>

    <div style={{ lineHeight: 1.7 }}>
      <strong>Observation métier :</strong>{" "}
      {bodyResult.explanation}
    </div>

    <ul style={{ marginTop: 8, lineHeight: 1.7 }}>
      <li>
        Buste / Hanches :{" "}
        {bodyResult.ratios?.bustToHips?.toFixed(2)}
      </li>
      <li>
        Taille / Hanches :{" "}
        {bodyResult.ratios?.waistToHips?.toFixed(2)}
      </li>
      <li>
        Taille / Buste :{" "}
        {bodyResult.ratios?.waistToBust?.toFixed(2)}
      </li>
      <li>
        Taille / plus petite mesure haut-bas :{" "}
        {bodyResult.ratios?.waistToMinUpperLower?.toFixed(2)}
      </li>
      <li>
        Lecture méthode : {bodyResult.method}
      </li>
    </ul>
  </div>
</details>
</>
            ) : (
              <div style={{ opacity: 0.8 }}>
                Renseigne les mesures silhouette dans l’onglet Diagnostic.
              </div>
            )}
          </Card>

          {/* RESULTAT VISAGE */}
          <Card>
            <SectionTitle>Résultat visage</SectionTitle>

            {faceResult ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <ConfidenceBadge
                    label={faceResult.confidenceLabel}
                    score={faceResult.confidenceScore}
                  />
                </div>

                <ResultTextBlock
                  title="Lecture globale"
                  text={faceResult.clientSummary}
                />

                <ResultTextBlock
                  title="Nuance de lecture"
                  text={buildFaceNuance(faceResult)}
                />

                <ResultTextBlock
                  title="Direction de style"
                  text={faceResult.clientObjective}
                />

                <ResultTextBlock
                  title="Ce que l’on observe visuellement"
                  text={buildFaceVisualMeaning(faceResult, faceVisual)}
                />

                <AdviceGroup
                  title="Pistes prioritaires"
                  items={faceResult.advice}
                />

<AdviceGroup
                  title="Traduction stylistique"
                  items={buildDetailedStyleAdvice(
                    primaryStyle,
                    secondaryStyle,
                    styleProfile.goal,
                    "face"
                  )}
                />

<AdviceGroup
  title="Coiffure"
  items={mergeAdviceLists(
    faceResult.practicalAdvice?.hairstyles,
    buildHairAdviceByStyle(
      primaryStyle,
      secondaryStyle,
      styleProfile.goal
    )
  )}
/>


<AdviceGroup
  title="Lunettes"
  items={mergeAdviceLists(
    faceResult.practicalAdvice?.glasses,
    buildGlassesAdviceByStyle(
      primaryStyle,
      secondaryStyle,
      styleProfile.goal
    )
  )}
/>


<AdviceGroup
  title="Boucles d’oreilles"
  items={mergeAdviceLists(
    faceResult.practicalAdvice?.earrings,
    buildEarringsAdviceByStyle(
      primaryStyle,
      secondaryStyle,
      styleProfile.goal
    )
  )}
/>


<AdviceGroup
  title="Encolures / cols"
  items={mergeAdviceLists(
    faceResult.practicalAdvice?.necklines,
    buildNecklineAdviceByStyle(
      primaryStyle,
      secondaryStyle,
      styleProfile.goal
    )
  )}
/>


                <AdviceGroup
                  title="À éviter"
                  items={faceResult.practicalAdvice?.avoid}
                />

                <details style={{ marginTop: 20 }}>
                  <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                    Voir les repères techniques
                  </summary>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ lineHeight: 1.7 }}>
                      <strong>Lecture principale :</strong> {faceResult.label}
                    </div>

                    <div style={{ lineHeight: 1.7 }}>
                      <strong>Lecture secondaire :</strong>{" "}
                      {faceResult.secondaryLabel}
                    </div>

                    <div style={{ lineHeight: 1.7 }}>
                      <strong>Observation métier :</strong>{" "}
                      {faceResult.explanation}
                    </div>

                    <div style={{ lineHeight: 1.7 }}>
                      <strong>Ratio hauteur / largeur :</strong>{" "}
                      {faceResult.ratio?.toFixed(2)}
                    </div>

                    <ul style={{ marginTop: 8, lineHeight: 1.7 }}>
                      <li>
                        Longueur perçue :{" "}
                        {friendlyFaceLengthValue(faceVisual.lengthFeel)}
                      </li>
                      <li>
                        Largeur dominante :{" "}
                        {friendlyFaceWidthValue(faceVisual.widthDominance)}
                      </li>
                      <li>
                        Lignes : {friendlyFaceLinesValue(faceVisual.lines)}
                      </li>
                    </ul>
                  </div>
                </details>
              </>
            ) : (
              <div style={{ opacity: 0.8 }}>
                Renseigne les mesures visage dans l’onglet Diagnostic.
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}