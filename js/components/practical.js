import { escapeHtml, displayText, isPlaceholder, externalLinkAttrs } from "../utils.js";
import { EXTERNAL_LINK } from "../icons.js";

function renderTaxis(t) {
  const apps = (t.apps || [])
    .map(
      (a) => `
      <div class="taxi-app">
        <div>
          ${
            a.logo && !isPlaceholder(a.logo)
              ? `<img class="taxi-logo" src="${escapeHtml(a.logo)}" alt="${escapeHtml(displayText(a.name, "App"))}"/>`
              : `<strong>${escapeHtml(displayText(a.name, "App"))}</strong>`
          }
          <div class="desc">${escapeHtml(displayText(a.description, ""))}</div>
        </div>
        ${!isPlaceholder(a.url) ? `<a class="btn btn--ghost" href="${escapeHtml(a.url)}" ${externalLinkAttrs()}>Get app ${EXTERNAL_LINK}</a>` : ""}
      </div>`
    )
    .join("");
  return `
    <div class="card">
      <h3>Taxis &amp; Ride-Hailing</h3>
      <div class="desc">${escapeHtml(displayText(t.intro, ""))}</div>
      <div class="highlights">
        <strong>Hotel taxis</strong>
        ${escapeHtml(
          isPlaceholder(t.hotelTaxis) || !t.hotelTaxis
            ? "Hotel Alicante Golf can also arrange taxis for you — details coming soon; meanwhile, ask at the front desk."
            : t.hotelTaxis
        )}
      </div>
      ${apps}
      ${t.note ? `<div class="desc" style="margin-top:10px; font-size:13px;">${escapeHtml(displayText(t.note, ""))}</div>` : ""}
    </div>`;
}

export function renderPractical(data) {
  const p = data.practical;

  const contacts = (p.emergencyContacts || [])
    .map((c) => {
      const tel = (c.phone || "").replace(/\s+/g, "");
      const emergency = tel === "112";
      const [title, ...rest] = displayText(c.label, "Contact").split(" — ");
      return `
      <div class="info-tile contact-tile">
        <div class="label">${escapeHtml(title)}</div>
        ${rest.length ? `<div class="value">${escapeHtml(rest.join(" — "))}</div>` : ""}
        <a class="btn ${emergency ? "btn--emergency" : "btn--ghost"}" href="tel:${escapeHtml(tel)}">${escapeHtml(displayText(c.phone, "TBC"))}</a>
      </div>`;
    })
    .join("");

  return `
    <div class="section-heading">
      <h1>Practical Info</h1>
      <p>Travel, weather &amp; support</p>
    </div>

    ${!isPlaceholder(p.heroImage) ? `<img class="venue-hero-img" src="${escapeHtml(p.heroImage)}" alt="View of Alicante"/>` : ""}

    <div class="info-grid">
      <div class="info-tile">
        <div class="label">Nearest Airport</div>
        <div class="value">${escapeHtml(displayText(p.nearestAirport?.name, "TBC"))}<br/>${escapeHtml(displayText(p.nearestAirport?.distanceFromVenue, "Distance TBC"))}</div>
      </div>
      <div class="info-tile">
        <div class="label">Weather</div>
        <div class="value">${escapeHtml(displayText(p.weather?.expectedRange, "TBC"))}</div>
      </div>
      <div class="info-tile info-tile--wide">
        <div class="label">Dress Code</div>
        <div class="value">
          <strong>Sessions:</strong> ${escapeHtml(displayText(p.dressCode?.sessions, "TBC"))}<br/>
          <strong>Dinners:</strong> ${escapeHtml(displayText(p.dressCode?.dinners, "TBC"))}<br/>
          <strong>Activities:</strong> ${escapeHtml(displayText(p.dressCode?.activities, "TBC"))}
        </div>
      </div>
    </div>

    <div class="info-grid contact-grid">${contacts}</div>

    <div class="card">
      <h3>Transport</h3>
      <div class="desc">${escapeHtml(displayText(p.nearestAirport?.transportOptions, "TBC"))}</div>
      <div class="desc" style="margin-top:8px;">${escapeHtml(displayText(p.localTransport, "Local transport info coming soon."))}</div>
    </div>

    ${p.taxis ? renderTaxis(p.taxis) : ""}
  `;
}
