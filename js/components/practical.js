import { escapeHtml, displayText, isPlaceholder, externalLinkAttrs } from "../utils.js";
import { CHEVRON_DOWN, EXTERNAL_LINK } from "../icons.js";

function renderTaxis(t) {
  const apps = (t.apps || [])
    .map(
      (a) => `
      <div class="taxi-app">
        <div>
          <strong>${escapeHtml(displayText(a.name, "App"))}</strong>
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

export function renderPractical(data, openFaqIndex) {
  const p = data.practical;

  const faqItems = (p.faq || [])
    .map((f, i) => {
      const open = i === openFaqIndex ? "is-open" : "";
      return `
      <div class="faq-item ${open}">
        <button class="faq-question" data-faq="${i}">
          <span>${escapeHtml(displayText(f.question, "Question TBC"))}</span>
          ${CHEVRON_DOWN}
        </button>
        <div class="faq-answer">${escapeHtml(displayText(f.answer, "Answer coming soon."))}</div>
      </div>`;
    })
    .join("");

  const contacts = (p.emergencyContacts || [])
    .map(
      (c) => `
      <div class="card" style="margin-bottom:10px;">
        <div class="meta" style="margin-bottom:0;">
          <strong style="color:var(--navy);">${escapeHtml(displayText(c.label, "Contact"))}</strong>
        </div>
        <a class="btn btn--ghost" style="margin-top:8px;" href="tel:${escapeHtml((c.phone || "").replace(/\s+/g, ""))}">${escapeHtml(displayText(c.phone, "TBC"))}</a>
      </div>`
    )
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
    </div>

    <div class="card">
      <h3>Transport</h3>
      <div class="desc">${escapeHtml(displayText(p.nearestAirport?.transportOptions, "TBC"))}</div>
      <div class="desc" style="margin-top:8px;">${escapeHtml(displayText(p.localTransport, "Local transport info coming soon."))}</div>
    </div>

    ${p.taxis ? renderTaxis(p.taxis) : ""}

    <div class="card">
      <h3>Weather &amp; What to Pack</h3>
      <div class="desc">${escapeHtml(displayText(p.weather?.note, "TBC"))}</div>
    </div>

    <div class="card">
      <h3>Dress Code</h3>
      <div class="meta" style="margin-bottom:0;">
        <span><strong>Sessions:</strong> ${escapeHtml(displayText(p.dressCode?.sessions, "TBC"))}</span>
      </div>
      <div class="meta" style="margin-bottom:0;">
        <span><strong>Dinners:</strong> ${escapeHtml(displayText(p.dressCode?.dinners, "TBC"))}</span>
      </div>
      <div class="meta">
        <span><strong>Activities:</strong> ${escapeHtml(displayText(p.dressCode?.activities, "TBC"))}</span>
      </div>
    </div>

    <div class="card">
      <h3>FAQ</h3>
      ${faqItems}
    </div>

    <h3 style="margin: 18px 0 10px;">Emergency Contacts</h3>
    ${contacts}
  `;
}
