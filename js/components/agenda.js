import { escapeHtml, displayText, isPlaceholder, formatDayShort, formatFullDate } from "../utils.js";
import { getSpeakerById } from "../data.js";

// Agenda categories — kept to 5 for scannability. "Sessions" is the
// catch-all bucket for plenaries/keynotes/panels/working groups/etc.
// Colours are drawn from the existing EAASI brand table (no new hues
// introduced); Gold/Silver/Bronze stay reserved for sponsor tier badges.
const CATEGORIES = [
  { id: "sessions", label: "Sessions", color: "#3DBFBF", text: "#1A2340", tracks: null },
  { id: "board", label: "Board", color: "#1A2340", text: "#F5F8FF", tracks: ["Board"] },
  { id: "committee", label: "Committee", color: "#2B3A67", text: "#F5F8FF", tracks: ["Committee"] },
  { id: "sponsor", label: "Sponsor", color: "#9AABC2", text: "#1A2340", tracks: ["Sponsor"] },
  { id: "social", label: "Social", color: "#2A7A2A", text: "#F5F8FF", tracks: ["Social"] },
];

function categoryForTrack(track) {
  return CATEGORIES.find((c) => c.tracks && c.tracks.includes(track)) || CATEGORIES[0];
}

function categoryTag(track) {
  const cat = categoryForTrack(track);
  return `<span class="tag" style="background:${cat.color}; color:${cat.text};">${escapeHtml(track || cat.label)}</span>`;
}

function getSponsor(data, sponsorId) {
  if (!sponsorId) return null;
  return (data.sponsors?.sponsors || []).find((s) => s.id === sponsorId) || null;
}

function sponsorLogoChip(sponsor) {
  if (!sponsor) return "";
  return !isPlaceholder(sponsor.logo)
    ? `<img class="agenda-sponsor-logo" src="${escapeHtml(sponsor.logo)}" alt="${escapeHtml(sponsor.name)}" title="Sponsored by ${escapeHtml(sponsor.name)}"/>`
    : `<span class="agenda-sponsor-logo agenda-sponsor-logo--text">${escapeHtml(sponsor.name)}</span>`;
}

export function renderAgenda(data, agendaDay, agendaCategory) {
  const days = data.agenda.days || [];
  const activeDate = agendaDay && days.some((d) => d.date === agendaDay) ? agendaDay : days[0]?.date;
  const activeDayObj = days.find((d) => d.date === activeDate);
  const activeCategory = agendaCategory || "all";

  const dayTabs = days
    .map((d) => {
      const { d1, d2 } = formatDayShort(d.date);
      const active = d.date === activeDate ? "is-active" : "";
      return `
      <button class="day-tab ${active}" data-day="${escapeHtml(d.date)}">
        <div class="d1">${escapeHtml(d1)}</div>
        <div class="d2">${escapeHtml(d2)}</div>
      </button>`;
    })
    .join("");

  const categoryChips = ["all", ...CATEGORIES.map((c) => c.id)]
    .map((id) => {
      const label = id === "all" ? "All" : CATEGORIES.find((c) => c.id === id).label;
      return `<button class="chip ${id === activeCategory ? "is-active" : ""}" data-category="${id}">${label}</button>`;
    })
    .join("");

  const allSessions = activeDayObj?.sessions || [];
  const sessions = allSessions.filter(
    (s) => activeCategory === "all" || categoryForTrack(s.track).id === activeCategory
  );

  const sessionCards = sessions
    .map((s) => {
      const speakerNames = (s.speakerIds || [])
        .map((id) => getSpeakerById(data.speakers, id))
        .filter(Boolean)
        .map((sp) => displayText(sp.name, "Speaker TBC"))
        .join(", ");
      const sponsor = getSponsor(data, s.sponsorId);
      return `
      <div class="card card--tappable" data-session="${escapeHtml(s.id)}">
        <div class="list-row" style="align-items:flex-start;">
          <div class="session-time">
            <span>${escapeHtml(s.startTime)}</span>
            ${s.endTime ? `<span class="end">${escapeHtml(s.endTime)}</span>` : ""}
          </div>
          <div style="flex:1;">
            <div class="meta" style="margin-bottom:6px; justify-content:space-between; align-items:center;">
              ${categoryTag(s.track)}
              ${sponsorLogoChip(sponsor)}
            </div>
            <h3>${escapeHtml(displayText(s.title, "Session title TBC"))}</h3>
            <div class="meta">
              <span>${escapeHtml(displayText(s.room, "Room TBC"))}</span>
              ${speakerNames ? `<span>· ${escapeHtml(speakerNames)}</span>` : ""}
            </div>
          </div>
        </div>
      </div>`;
    })
    .join("");

  return `
    <div class="section-heading">
      <h1>Agenda</h1>
      <p>Full schedule across all 4 days</p>
    </div>
    <div class="day-tabs">${dayTabs}</div>
    <div class="chip-row">${categoryChips}</div>
    ${sessionCards || `<div class="state-msg">No sessions in this category for this day.</div>`}
  `;
}

export function renderSessionDetail(data, sessionId) {
  let found = null;
  for (const day of data.agenda.days || []) {
    const s = (day.sessions || []).find((x) => x.id === sessionId);
    if (s) { found = { session: s, day }; break; }
  }
  if (!found) return `<div class="state-msg">Session not found.</div>`;
  const { session, day } = found;

  const speakerChips = (session.speakerIds || [])
    .map((id) => getSpeakerById(data.speakers, id))
    .filter(Boolean)
    .map(
      (sp) => `
      <button class="chip" data-speaker="${escapeHtml(sp.id)}">${escapeHtml(displayText(sp.name, "Speaker TBC"))}</button>`
    )
    .join("");

  const sponsor = getSponsor(data, session.sponsorId);

  return `
    <div class="meta" style="justify-content:space-between; align-items:center;">
      ${categoryTag(session.track)}
      ${sponsor ? `<span class="meta" style="gap:6px;">Sponsored by ${sponsorLogoChip(sponsor)}</span>` : ""}
    </div>
    <h2 style="margin-top:10px; font-size:20px;">${escapeHtml(displayText(session.title, "Session title TBC"))}</h2>
    <div class="meta" style="margin-top:8px;">
      <span>${escapeHtml(formatFullDate(day.date))}</span>
      <span>· ${escapeHtml(session.startTime)}${session.endTime ? `–${escapeHtml(session.endTime)}` : ""}</span>
      <span>· ${escapeHtml(displayText(session.room, "Room TBC"))}</span>
    </div>
    <p class="desc" style="margin-top:14px;">${escapeHtml(displayText(session.description, "Session description coming soon."))}</p>
    ${speakerChips ? `<h3 style="font-size:14px; margin-top:18px; margin-bottom:8px;">Speakers</h3><div class="chip-row" style="margin-bottom:0;">${speakerChips}</div>` : ""}
  `;
}
