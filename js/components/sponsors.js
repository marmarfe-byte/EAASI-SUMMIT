import { escapeHtml, displayText, isPlaceholder, initials, externalLinkAttrs } from "../utils.js";
import { EXTERNAL_LINK } from "../icons.js";

export const TIER_ORDER = ["gold", "silver", "bronze"];
export const TIER_LABELS = { gold: "Gold", silver: "Silver", bronze: "Bronze" };

export function renderSponsors(data, filterTier) {
  const sponsors = data.sponsors.sponsors || [];
  const active = filterTier || "all";

  const chips = ["all", ...TIER_ORDER]
    .map((t) => {
      const label = t === "all" ? "All" : TIER_LABELS[t];
      return `<button class="chip ${t === active ? "is-active" : ""}" data-tier="${t}">${label}</button>`;
    })
    .join("");

  const filtered = sponsors
    .filter((s) => active === "all" || s.tier === active)
    .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));

  const cards = filtered
    .map((s) => {
      const logo = !isPlaceholder(s.logo)
        ? `<img class="sponsor-logo sponsor-logo--${escapeHtml(s.tier)}" src="${escapeHtml(s.logo)}" alt="${escapeHtml(s.name)}"/>`
        : `<div class="sponsor-logo sponsor-logo--${escapeHtml(s.tier)} img-placeholder">${escapeHtml(initials(s.name))}</div>`;
      return `
      <div class="card">
        <div class="sponsor-row">
          ${logo}
          <div style="flex:1;">
            <span class="tier-badge tier-${escapeHtml(s.tier)}">${escapeHtml(TIER_LABELS[s.tier] || s.tier)}</span>
            <h3 style="margin-top:6px;">${escapeHtml(displayText(s.name, "Sponsor TBC"))}</h3>
          </div>
        </div>
        <div class="desc" style="margin-top:10px;">${escapeHtml(displayText(s.description, "Description coming soon."))}</div>
        ${
          !isPlaceholder(s.websiteUrl)
            ? `<div style="margin-top:12px;"><a class="btn btn--ghost" href="${escapeHtml(s.websiteUrl)}" ${externalLinkAttrs()}>Visit website ${EXTERNAL_LINK}</a></div>`
            : ""
        }
      </div>`;
    })
    .join("");

  return `
    <div class="section-heading">
      <h1>Sponsors</h1>
      <p>Thank you to our partners</p>
    </div>
    <div class="chip-row">${chips}</div>
    ${cards || `<div class="state-msg">No sponsors in this tier yet.</div>`}
  `;
}
