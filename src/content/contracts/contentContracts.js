export function isLocalizedText(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      (typeof value.en === "string" || typeof value.tr === "string")
  );
}

export function isContentRecord(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof value.id === "string" &&
      value.id.length > 0
  );
}

export function asCollection(value) {
  return Array.isArray(value) ? value.filter(isContentRecord) : [];
}

export function findById(records, id) {
  if (typeof id !== "string" || !id) return null;

  return asCollection(records).find((record) => record.id === id) || null;
}
