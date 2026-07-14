export function getLocalizedText(value, lang, fallback = "") {
  if (typeof value === "string") return value;
  if (Array.isArray(value))
    return value.map((item) => getLocalizedText(item, lang)).join(" ");
  if (value && typeof value === "object") {
    const text = value[lang] ?? value.en ?? value.tr ?? Object.values(value)[0];
    return getLocalizedText(text, lang, fallback);
  }
  return fallback;
}