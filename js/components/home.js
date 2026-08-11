import { SCAN_GLYPH_MOTIF, ICONS } from "../icons.js";
import { escapeHtml, displayText, isPlaceholder, externalLinkAttrs } from "../utils.js";
import { TIER_ORDER, TIER_LABELS } from "./sponsors.js";

export function renderHome(data) {
  const home = data.home;
  const tickets = data.tickets;

  const quickLinks = (home.quickLinks || [])
    .map(
      (q) => `
      <a class="quick-link" href="#/${escapeHtml(q.target)}">
        ${ICONS[q.target] || `<span class="dot"></span>`}${escapeHtml(q.label)}
      </a>`
    )
    .join("");

  const sponsors = data.sponsors?.sponsors || [];
  const sponsorGroups = TIER_ORDER.map((tier) => ({
    tier,
    items: sponsors.filter((s) => s.tier === tier),
  })).filter((g) => g.items.length);

  const sponsorStrip = sponsorGroups.length
    ? `
    <a class="sponsor-strip" href="#/sponsors">
      <div class="sponsor-strip-heading">Our Sponsors</div>
      <p class="sponsor-strip-thanks">With thanks to our sponsors for making the Summit possible.</p>
      ${sponsorGroups
        .map(
          (g) => `
        <div class="sponsor-strip-group">
          <div class="tier-label">${escapeHtml(TIER_LABELS[g.tier] || g.tier)}</div>
          <div class="sponsor-strip-logos">
            ${g.items
              .map((s) =>
                !isPlaceholder(s.logo)
                  ? `<span class="sponsor-chip"><img src="${escapeHtml(s.logo)}" alt="${escapeHtml(s.name)}"/></span>`
                  : `<span class="sponsor-chip sponsor-chip--text">${escapeHtml(s.name)}</span>`
              )
              .join("")}
          </div>
        </div>`
        )
        .join("")}
    </a>`
    : "";

  return `
    <section class="hero">
      ${SCAN_GLYPH_MOTIF}
      <div class="logo-badge"><img src="/assets/eaasi-logo.png" alt="${escapeHtml(home.eventName)}"/></div>
      <h1 class="sr-only">${escapeHtml(home.eventName)}</h1>
      ${home.tagline ? `<p class="hero-tagline">${escapeHtml(home.tagline)}</p>` : ""}
      <div class="location-dates">${escapeHtml(home.location)} · ${escapeHtml(home.dates?.displayRange)}</div>
      <p class="welcome">${escapeHtml(displayText(home.welcomeMessage, "Welcome message coming soon."))}</p>
      <div id="countdown" class="countdown" data-target="${escapeHtml(home.countdownTargetISO)}">
        <div class="unit" data-u="d"><div class="num">–</div><div class="label">Days</div></div>
        <div class="unit" data-u="h"><div class="num">–</div><div class="label">Hours</div></div>
        <div class="unit" data-u="m"><div class="num">–</div><div class="label">Min</div></div>
        <div class="unit" data-u="s"><div class="num">–</div><div class="label">Sec</div></div>
      </div>
    </section>
    ${
      tickets && !isPlaceholder(tickets.purchaseUrl)
        ? `<a class="btn buy-tickets-btn" href="${escapeHtml(tickets.purchaseUrl)}" ${externalLinkAttrs()}>${ICONS.tickets} Buy Tickets</a>`
        : ""
    }
    <div class="quick-links">${quickLinks}</div>
    ${sponsorStrip}
  `;
}

export function startCountdown() {
  function tick() {
    const el = document.getElementById("countdown");
    if (!el) return;
    const targetISO = el.getAttribute("data-target");
    const target = new Date(targetISO).getTime();
    if (isNaN(target)) return;
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000); diff -= d * 86400000;
    const h = Math.floor(diff / 3600000); diff -= h * 3600000;
    const m = Math.floor(diff / 60000); diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    const set = (unit, val) => {
      const u = el.querySelector(`[data-u="${unit}"] .num`);
      if (u) u.textContent = val;
    };
    set("d", d);
    set("h", String(h).padStart(2, "0"));
    set("m", String(m).padStart(2, "0"));
    set("s", String(s).padStart(2, "0"));
  }
  tick();
  return setInterval(tick, 1000);
}
