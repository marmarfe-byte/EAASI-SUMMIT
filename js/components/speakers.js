import { escapeHtml, displayText, avatarHtml, isPlaceholder, externalLinkAttrs, formatDayShort } from "../utils.js";
import { EXTERNAL_LINK } from "../icons.js";

// Surname used for alphabetical order (ignores a leading "Dr."/"Prof." and accents)
function surnameKey(name) {
  const parts = (name || "").split(/\s+/).filter((w) => w && !/^(dr|prof)\.?$/i.test(w));
  return (parts[parts.length - 1] || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Agenda sessions a speaker takes part in, in chronological order
function speakerSessions(data, speakerId) {
  const out = [];
  for (const day of data.agenda?.days || []) {
    for (const s of day.sessions || []) {
      if ((s.speakerIds || []).includes(speakerId)) out.push({ day, session: s });
    }
  }
  return out;
}

function slotLabel({ day, session }) {
  const { d1, d2 } = formatDayShort(day.date);
  const time = `${session.startTime}${session.endTime ? `–${session.endTime}` : ""}`;
  return `${d1}, ${d2} · ${time}`;
}

export function renderSpeakers(data) {
  const speakers = [...(data.speakers.speakers || [])].sort((a, b) =>
    surnameKey(a.name).localeCompare(surnameKey(b.name))
  );
  const cards = speakers
    .map((sp) => {
      const slots = speakerSessions(data, sp.id);
      return `
      <div class="speaker-card" data-speaker="${escapeHtml(sp.id)}">
        ${avatarHtml(sp.name, sp.photo, "")}
        <h4>${escapeHtml(displayText(sp.name, "Speaker TBC"))}</h4>
        <div class="role">${escapeHtml(displayText(sp.role, ""))}</div>
        <div class="company">${escapeHtml(displayText(sp.company, ""))}</div>
        ${slots.map((x) => `<span class="speaker-slot">${escapeHtml(slotLabel(x))}</span>`).join("")}
      </div>`;
    })
    .join("");

  return `
    <div class="section-heading">
      <h1>Speakers</h1>
      <p>Attendee directory</p>
    </div>
    <div class="speaker-grid">${cards}</div>
  `;
}

export function renderSpeakerDetail(data, speakerId) {
  const sp = (data.speakers.speakers || []).find((s) => s.id === speakerId);
  if (!sp) return `<div class="state-msg">Speaker not found.</div>`;

  const linkedIn = !isPlaceholder(sp.linkedInUrl)
    ? `<a class="btn btn--ghost" href="${escapeHtml(sp.linkedInUrl)}" ${externalLinkAttrs()}>View LinkedIn ${EXTERNAL_LINK}</a>`
    : "";

  const slots = speakerSessions(data, sp.id)
    .map(
      (x) => `
      <div class="speaker-slot-row">
        <span class="speaker-slot">${escapeHtml(slotLabel(x))}</span>
        <span>${escapeHtml(displayText(x.session.title, ""))}</span>
      </div>`
    )
    .join("");

  return `
    <div style="text-align:center;">
      ${avatarHtml(sp.name, sp.photo, "lg")}
      <h2 style="margin-top:14px; font-size:20px;">${escapeHtml(displayText(sp.name, "Speaker TBC"))}</h2>
      <div class="meta" style="justify-content:center; margin-top:4px;">
        <span>${escapeHtml(displayText(sp.role, ""))}</span>
        ${!isPlaceholder(sp.company) ? `<span>· ${escapeHtml(sp.company)}</span>` : ""}
      </div>
    </div>
    ${slots ? `<div class="speaker-slots">${slots}</div>` : ""}
    <p class="desc" style="margin-top:16px;">${escapeHtml(displayText(sp.bio, "Bio coming soon."))}</p>
    ${linkedIn ? `<div style="margin-top:16px; text-align:center;">${linkedIn}</div>` : ""}
  `;
}
