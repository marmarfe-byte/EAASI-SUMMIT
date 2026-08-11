import { escapeHtml, displayText, avatarHtml, isPlaceholder, externalLinkAttrs } from "../utils.js";
import { EXTERNAL_LINK } from "../icons.js";

export function renderSpeakers(data) {
  const speakers = data.speakers.speakers || [];
  const cards = speakers
    .map(
      (sp) => `
      <div class="speaker-card" data-speaker="${escapeHtml(sp.id)}">
        ${avatarHtml(sp.name, sp.photo, "")}
        <h4>${escapeHtml(displayText(sp.name, "Speaker TBC"))}</h4>
        <div class="role">${escapeHtml(displayText(sp.role, ""))}</div>
        <div class="company">${escapeHtml(displayText(sp.company, ""))}</div>
      </div>`
    )
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

  return `
    <div style="text-align:center;">
      ${avatarHtml(sp.name, sp.photo, "lg")}
      <h2 style="margin-top:14px; font-size:20px;">${escapeHtml(displayText(sp.name, "Speaker TBC"))}</h2>
      <div class="meta" style="justify-content:center; margin-top:4px;">
        <span>${escapeHtml(displayText(sp.role, ""))}</span>
        ${!isPlaceholder(sp.company) ? `<span>· ${escapeHtml(sp.company)}</span>` : ""}
      </div>
    </div>
    <p class="desc" style="margin-top:16px;">${escapeHtml(displayText(sp.bio, "Bio coming soon."))}</p>
    ${linkedIn ? `<div style="margin-top:16px; text-align:center;">${linkedIn}</div>` : ""}
  `;
}
