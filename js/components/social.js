import { escapeHtml, displayText, isPlaceholder, formatFullDate, externalLinkAttrs } from "../utils.js";
import { PIN_SMALL, EXTERNAL_LINK } from "../icons.js";

export function renderSocial(data) {
  const activities = data.social.activities || [];
  const cards = activities
    .map(
      (a) => `
      <div class="card">
        <div class="meta">
          <span class="tag">${escapeHtml(formatFullDate(a.day))}</span>
          <span>${escapeHtml(a.time || "")}</span>
        </div>
        <h3>${escapeHtml(displayText(a.name, "Activity TBC"))}</h3>
        <div class="meta">
          <span>${escapeHtml(displayText(a.location, "Location TBC"))}</span>
        </div>
        <div class="desc">${escapeHtml(displayText(a.description, "Details coming soon."))}</div>
        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          ${
            !isPlaceholder(a.mapLink)
              ? `<a class="btn btn--ghost" href="${escapeHtml(a.mapLink)}" ${externalLinkAttrs()}>View on map ${PIN_SMALL}</a>`
              : ""
          }
          ${
            !isPlaceholder(a.websiteUrl)
              ? `<a class="btn btn--ghost" href="${escapeHtml(a.websiteUrl)}" ${externalLinkAttrs()}>Website ${EXTERNAL_LINK}</a>`
              : ""
          }
        </div>
      </div>`
    )
    .join("");

  return `
    <div class="section-heading">
      <h1>Social Activities</h1>
      <p>Dinners &amp; networking</p>
    </div>
    ${cards}
  `;
}
