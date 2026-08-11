import { escapeHtml, displayText } from "../utils.js";

export function renderCommittees(data) {
  const committees = data.committees.committees || [];
  const cards = committees
    .map((c) => {
      const members = (c.members || []).filter((m) => !!m);
      return `
      <div class="card">
        <h3>${escapeHtml(c.name)}</h3>
        <div class="meta">
          <span>Chair: ${escapeHtml(displayText(c.chair, "TBC"))}</span>
        </div>
        <div class="desc">${escapeHtml(displayText(c.mission, "Mission statement coming soon."))}</div>
        <div class="desc" style="margin-top:8px;"><strong>Current focus:</strong> ${escapeHtml(displayText(c.currentFocus, "TBC"))}</div>
        ${
          members.length
            ? `<div class="committee-members"><strong>Members</strong><ul>${members
                .map((m) => `<li>${escapeHtml(displayText(m, "Member TBC"))}</li>`)
                .join("")}</ul></div>`
            : ""
        }
      </div>`;
    })
    .join("");

  return `
    <div class="section-heading">
      <h1>Committees</h1>
      <p>EAASI working groups</p>
    </div>
    ${cards}
  `;
}
