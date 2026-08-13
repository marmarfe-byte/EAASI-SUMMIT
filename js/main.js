import { loadAllContent } from "./data.js";
import { ICONS, SCAN_GLYPH_MARK, CLOSE_X } from "./icons.js";
import { renderHome, startCountdown } from "./components/home.js";
import { renderVenue } from "./components/venue.js";
import { renderAgenda, renderSessionDetail } from "./components/agenda.js";
import { renderSpeakers, renderSpeakerDetail } from "./components/speakers.js";
import { renderSocial } from "./components/social.js";
import { renderAdditional } from "./components/additional.js";
import { renderSponsors } from "./components/sponsors.js";
import { renderCommittees } from "./components/committees.js";
import { renderPractical } from "./components/practical.js";
import { renderTickets } from "./components/tickets.js";

const TABS = [
  { id: "home", label: "Home" },
  { id: "tickets", label: "Tickets" },
  { id: "venue", label: "Venue" },
  { id: "agenda", label: "Agenda" },
  { id: "speakers", label: "Speakers" },
  { id: "social", label: "Social" },
  { id: "additional", label: "Activities" },
  { id: "sponsors", label: "Sponsors" },
  { id: "committees", label: "Committees" },
  { id: "practical", label: "Info" },
];

const state = {
  tab: "home",
  agendaDay: null,
  agendaCategory: "all",
  sponsorFilter: "all",
  overlay: null, // { type: 'session' | 'speaker', id }
  openFaqIndex: null,
  openCommittees: new Set(),
  menuOpen: false,
};

let content = null;
let countdownInterval = null;

function getTabFromHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const id = raw.split("/")[0];
  return TABS.some((t) => t.id === id) ? id : "home";
}

function renderMainContent() {
  switch (state.tab) {
    case "home":
      return renderHome(content);
    case "tickets":
      return renderTickets(content);
    case "venue":
      return renderVenue(content);
    case "agenda":
      return renderAgenda(content, state.agendaDay, state.agendaCategory);
    case "speakers":
      return renderSpeakers(content);
    case "social":
      return renderSocial(content);
    case "additional":
      return renderAdditional(content);
    case "sponsors":
      return renderSponsors(content, state.sponsorFilter);
    case "committees":
      return renderCommittees(content, state.openCommittees);
    case "practical":
      return renderPractical(content, state.openFaqIndex);
    default:
      return "";
  }
}

function renderOverlay() {
  if (!state.overlay) return "";
  let inner = "";
  if (state.overlay.type === "session") inner = renderSessionDetail(content, state.overlay.id);
  if (state.overlay.type === "speaker") inner = renderSpeakerDetail(content, state.overlay.id);
  return `
    <div class="overlay">
      <div class="backdrop" data-close></div>
      <div class="sheet">
        <button class="sheet-close" data-close aria-label="Close">${CLOSE_X}</button>
        ${inner}
      </div>
    </div>`;
}

function renderNav() {
  return `
    <nav class="bottom-nav">
      ${TABS.map(
        (t) => `
        <a class="nav-item ${t.id === state.tab ? "is-active" : ""}" href="#/${t.id}">
          ${ICONS[t.id]}
          <span>${t.label}</span>
        </a>`
      ).join("")}
    </nav>`;
}

function renderMobileMenu() {
  if (!state.menuOpen) return "";
  return `
    <div class="mobile-menu">
      <div class="mobile-menu-header">
        <div class="brand">${SCAN_GLYPH_MARK}EAASI Summit</div>
        <button class="sheet-close" data-menu-close aria-label="Close menu">${CLOSE_X}</button>
      </div>
      <div class="mobile-menu-list">
        ${TABS.map(
          (t) => `
          <a class="mobile-menu-item ${t.id === state.tab ? "is-active" : ""}" href="#/${t.id}">
            ${ICONS[t.id]}
            <span>${t.label}</span>
          </a>`
        ).join("")}
      </div>
    </div>`;
}

function render() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  const headerTitle = TABS.find((t) => t.id === state.tab)?.label || "";
  const shell = document.getElementById("app-shell");
  shell.innerHTML = `
    <header class="app-header">
      <a class="brand" href="#/home">${SCAN_GLYPH_MARK}EAASI Summit</a>
      <div class="section-title">${headerTitle}</div>
      <button class="hamburger-btn" data-menu-toggle aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </header>
    <main>${renderMainContent()}</main>
    ${renderNav()}
    ${renderOverlay()}
    ${renderMobileMenu()}
  `;
  if (state.tab === "home") countdownInterval = startCountdown();
}

function attachDelegation() {
  document.getElementById("app-shell").addEventListener("click", (e) => {
    const dayBtn = e.target.closest("[data-day]");
    if (dayBtn) {
      state.agendaDay = dayBtn.getAttribute("data-day");
      render();
      return;
    }

    const sessionCard = e.target.closest("[data-session]");
    if (sessionCard) {
      state.overlay = { type: "session", id: sessionCard.getAttribute("data-session") };
      render();
      return;
    }

    const speakerEl = e.target.closest("[data-speaker]");
    if (speakerEl) {
      state.overlay = { type: "speaker", id: speakerEl.getAttribute("data-speaker") };
      render();
      return;
    }

    const tierChip = e.target.closest("[data-tier]");
    if (tierChip) {
      state.sponsorFilter = tierChip.getAttribute("data-tier");
      render();
      return;
    }

    const categoryChip = e.target.closest("[data-category]");
    if (categoryChip) {
      state.agendaCategory = categoryChip.getAttribute("data-category");
      render();
      return;
    }

    const faqBtn = e.target.closest("[data-faq]");
    if (faqBtn) {
      const idx = Number(faqBtn.getAttribute("data-faq"));
      state.openFaqIndex = state.openFaqIndex === idx ? null : idx;
      render();
      return;
    }

    const committeeToggle = e.target.closest("[data-committee-toggle]");
    if (committeeToggle) {
      const id = committeeToggle.getAttribute("data-committee-toggle");
      if (state.openCommittees.has(id)) state.openCommittees.delete(id);
      else state.openCommittees.add(id);
      render();
      return;
    }

    const closeBtn = e.target.closest("[data-close]");
    if (closeBtn) {
      state.overlay = null;
      render();
      return;
    }

    const menuToggle = e.target.closest("[data-menu-toggle]");
    if (menuToggle) {
      state.menuOpen = !state.menuOpen;
      render();
      return;
    }

    const menuClose = e.target.closest("[data-menu-close]");
    if (menuClose) {
      state.menuOpen = false;
      render();
      return;
    }
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/service-worker.js").catch((err) => {
    console.error("Service worker registration failed:", err);
  });
}

async function init() {
  const shell = document.getElementById("app-shell");
  shell.innerHTML = `<div class="state-msg">Loading EAASI Summit…</div>`;
  try {
    content = await loadAllContent();
  } catch (err) {
    shell.innerHTML = `<div class="state-msg">Couldn't load event content. Check your connection and reload.</div>`;
    console.error(err);
    return;
  }

  state.tab = getTabFromHash();
  render();
  attachDelegation();

  window.addEventListener("hashchange", () => {
    state.tab = getTabFromHash();
    state.overlay = null;
    state.menuOpen = false;
    render();
  });

  registerServiceWorker();
}

init();
