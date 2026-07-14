export function getLocalizedText(value, lang, fallback = "") {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    if (typeof value[lang] === "string") return value[lang];
    if (typeof value.en === "string") return value.en;
    if (typeof value.tr === "string") return value.tr;
  }
  return fallback;
}