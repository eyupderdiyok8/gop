const TECHNICAL_TERMS: Array<[RegExp, string]> = [
  [/\breverse osmosis\b/gi, "Ters Ozmoz (RO)"],
  [/\bpost[ -]?carbon\b/gi, "Post Karbon"],
  [/\bgac\b/gi, "GAC"],
  [/\bcto\b/gi, "CTO"],
  [/\bgpd\b/gi, "GPD"],
  [/\bmicron\b/gi, "mikron"],
  [/\bsediment filter\b/gi, "Sediment Filtre"],
  [/\baritma\b/gi, "Arıtma"],
  [/\bcihazi\b/gi, "Cihazı"],
  [/\bcesitleri\b/gi, "Çeşitleri"],
  [/\bmax\b/gi, "Maksimum"],
];

export function formatTechnicalText(value: string) {
  return TECHNICAL_TERMS.reduce(
    (formatted, [pattern, replacement]) => formatted.replace(pattern, replacement),
    value,
  );
}
