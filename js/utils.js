export function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function isPlaceholder(value) {
  return (
    value == null ||
    typeof value !== "string" ||
    value.trim() === "" ||
    value.toUpperCase().startsWith("PLACEHOLDER")
  );
}

function stripPlaceholderPrefix(name) {
  return String(name).replace(/^PLACEHOLDER\s*—\s*/i, "").trim();
}

export function initials(name) {
  if (name == null || typeof name !== "string" || name.trim() === "") return "?";
  const parts = stripPlaceholderPrefix(name).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function displayText(value, fallback = "Details coming soon.") {
  if (value == null || typeof value !== "string" || value.trim() === "") return fallback;
  const stripped = stripPlaceholderPrefix(value);
  return stripped || fallback;
}

export function avatarHtml(name, photoPath, size = "") {
  const cls = size ? `avatar avatar--${size}` : "avatar";
  if (!isPlaceholder(photoPath)) {
    return `<div class="${cls}"><img src="${escapeHtml(photoPath)}" alt="${escapeHtml(name)}"/></div>`;
  }
  return `<div class="${cls}">${escapeHtml(initials(name))}</div>`;
}

export function formatDayShort(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d)) return { d1: "", d2: dateStr };
  return {
    d1: d.toLocaleDateString("en-US", { weekday: "short" }),
    d2: d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
  };
}

export function formatFullDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
}

export function mapsUrlFromLatLng(lat, lng) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function externalLinkAttrs() {
  return `target="_blank" rel="noopener noreferrer"`;
}
