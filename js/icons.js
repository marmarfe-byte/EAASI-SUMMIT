function svg(inner, extra = "") {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${inner}</svg>`;
}

export const ICONS = {
  home: svg(`<polyline points="3,11 12,4 21,11"/><path d="M5 10v10h14V10"/><rect x="9.5" y="13.5" width="5" height="6.5"/>`),
  venue: svg(`<path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/>`),
  agenda: svg(`<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>`),
  speakers: svg(`<circle cx="9" cy="9" r="3.2"/><circle cx="16.5" cy="10.5" r="2.3"/><path d="M3.3 20c.4-3.6 3-6 6.2-6 2.1 0 3.9 1.1 5 2.9"/><path d="M14.5 15.3c2 .3 3.9 2 4.2 4.7"/>`),
  social: svg(`<path d="M7 3h10l-1 8a4 4 0 0 1-8 0L7 3z"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/>`),
  additional: svg(`<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="7" y2="7"/><line x1="17" y1="17" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="7" y2="17"/><line x1="17" y1="7" x2="19.1" y2="4.9"/>`),
  sponsors: svg(`<circle cx="12" cy="8" r="5"/><path d="M8.5 12.5L7 21l5-3 5 3-1.5-8.5"/>`),
  committees: svg(`<circle cx="7" cy="8" r="2.5"/><circle cx="17" cy="8" r="2.5"/><circle cx="12" cy="9.5" r="2.5"/><path d="M2.5 20c.4-3 2.4-5 4.9-5"/><path d="M21.5 20c-.4-3-2.4-5-4.9-5"/><path d="M8.5 20c.4-2.6 2-4.4 3.5-4.4s3.1 1.8 3.5 4.4"/>`),
  practical: svg(`<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none"/>`),
  tickets: svg(`<rect x="3" y="6" width="18" height="12" rx="2.2"/><line x1="13" y1="6.5" x2="13" y2="17.5" stroke-dasharray="1.6,2.6"/>`),
};

export const CHEVRON_DOWN = svg(`<polyline points="6,9 12,15 18,9"/>`, `class="chevron"`);
export const CLOSE_X = svg(`<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>`);
export const EXTERNAL_LINK = svg(`<path d="M14 4h6v6"/><line x1="20" y1="4" x2="10" y2="14"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>`, `class="external-icon"`);
export const PIN_SMALL = svg(`<path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/>`, `class="external-icon"`);

// EAASI "Scan Glyph" brand motif — stylised aircraft diving toward three
// expanding data-capture waves. Replaces the retired hexagon motif (brand
// guideline: hexagon conflicts with member company Hexagon).
function scanGlyphShape(fill) {
  return `<polygon points="150,58 18,20 72,20 150,34" fill="${fill}"/><polygon points="150,58 282,20 228,20 150,34" fill="${fill}"/><rect x="128" y="72" width="44" height="10" fill="${fill}"/><rect x="112" y="90" width="76" height="10" fill="${fill}"/><rect x="96" y="108" width="108" height="10" fill="${fill}"/>`;
}

export const SCAN_GLYPH_MARK = `<svg viewBox="0 0 300 150" class="scan-glyph-mark" xmlns="http://www.w3.org/2000/svg">${scanGlyphShape("var(--teal)")}</svg>`;

export const SCAN_GLYPH_MOTIF = `<svg class="scan-glyph-motif" viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">${scanGlyphShape("#3DBFBF")}</svg>`;
