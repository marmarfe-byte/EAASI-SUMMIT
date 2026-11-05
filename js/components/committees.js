import { escapeHtml, displayText, isPlaceholder } from "../utils.js";
import { CHEVRON_DOWN } from "../icons.js";

export function renderCommittees(data, openCommittees) {
  const open = openCommittees || new Set();
  const committees = data.committees.committees || [];
  const arcade = data.committees.arcade;
  const arcadeCard = arcade
    ? `
    <a class="arcade-promo" href="${escapeHtml(arcade.url)}">
      <div class="arcade-promo-text">
        <span class="arcade-promo-kicker">${escapeHtml(arcade.kicker)}</span>
        <span class="arcade-promo-title">${escapeHtml(arcade.title)}</span>
        <span class="arcade-promo-desc">${escapeHtml(arcade.description)}</span>
      </div>
      <span class="btn arcade-promo-btn">${escapeHtml(arcade.cta)}</span>
    </a>`
    : "";
  const cardList = committees
    .map((c) => {
      const members = (c.members || []).filter((m) => !!m);
      const isOpen = open.has(c.id);
      const heading = !isPlaceholder(c.logo)
        ? `<img class="committee-logo" src="${escapeHtml(c.logo)}" alt="${escapeHtml(c.name)}"/>`
        : `<h3>${escapeHtml(c.name)}</h3>`;
      return `
      <div class="card">
        ${heading}
        <div class="meta">
          <span><strong>Chair:</strong> ${escapeHtml(displayText(c.chair, "TBC"))}</span>
        </div>
        <div class="desc">${escapeHtml(displayText(c.mission, "Mission statement coming soon."))}</div>
        <button class="committee-toggle ${isOpen ? "is-open" : ""}" data-committee-toggle="${escapeHtml(c.id)}">
          <span>${isOpen ? "Less info" : "More info"}</span>
          ${CHEVRON_DOWN}
        </button>
        ${
          isOpen
            ? `
        <div class="committee-details">
          <div class="desc"><strong>Current focus:</strong> ${escapeHtml(displayText(c.currentFocus, "TBC"))}</div>
          ${
            members.length
              ? `<div class="committee-members"><strong>Members</strong><ul>${members
                  .map((m) => `<li>${escapeHtml(displayText(m, "Member TBC"))}</li>`)
                  .join("")}</ul></div>`
              : ""
          }
        </div>`
            : ""
        }
      </div>`;
    });
  // The game sits in the middle of the committee list, for attendees not joining one
  if (arcadeCard) cardList.splice(Math.ceil(cardList.length / 2), 0, arcadeCard);
  const cards = cardList.join("");

  return `
    <div class="section-heading">
      <h1>Committees</h1>
      <p>EAASI working groups</p>
    </div>
    ${cards}
  `;
}
