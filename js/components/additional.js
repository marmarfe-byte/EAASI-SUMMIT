import { escapeHtml, displayText } from "../utils.js";

export function renderAdditional(data) {
  const activities = data.additional.activities || [];
  const cards = activities
    .map(
      (a) => `
      <div class="card">
        <div class="meta">
          <span class="tag">${escapeHtml(a.schedule || "")}</span>
          <span>${escapeHtml(a.time || "")}</span>
        </div>
        <h3>${escapeHtml(displayText(a.name, "Activity TBC"))}</h3>
        <div class="meta">
          <span>Meet: ${escapeHtml(displayText(a.meetingPoint, "TBC"))}</span>
          ${a.coordinator ? `<span>· Coordinator: ${escapeHtml(displayText(a.coordinator, "TBC"))}</span>` : ""}
        </div>
        <div class="desc">${escapeHtml(displayText(a.description, "Details coming soon."))}</div>
        <div class="desc" style="margin-top:8px;"><strong>What to bring:</strong> ${escapeHtml(displayText(a.whatToBring, "TBC"))}</div>
      </div>`
    )
    .join("");

  return `
    <div class="section-heading">
      <h1>Additional Activities</h1>
      <p>Yoga, running &amp; golf</p>
    </div>
    ${cards}
  `;
}
