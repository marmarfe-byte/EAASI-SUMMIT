import { escapeHtml } from "../utils.js";

export function getMenu(data, menuId) {
  if (!menuId) return null;
  return (data.menus?.menus || []).find((m) => m.id === menuId) || null;
}

// Menu body (sections + items) — used inline in the session detail and in the menu overlay
export function renderMenuSections(menu) {
  if (!menu) return "";
  return `
    ${menu.provisional ? `<div class="notice-warn">${escapeHtml(menu.provisional)}</div>` : ""}
    <div class="food-menu">
      ${(menu.sections || [])
        .map(
          (s) => `
        <div class="food-menu-section">
          <div class="food-menu-heading">${escapeHtml(s.heading)}</div>
          <ul>${(s.items || []).map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
        </div>`
        )
        .join("")}
    </div>`;
}

// Stand-alone overlay (opened from a Social Activities card)
export function renderMenuDetail(data, menuId) {
  const menu = getMenu(data, menuId);
  if (!menu) return `<div class="state-msg">Menu not available yet.</div>`;
  return `
    <span class="tag">Menu</span>
    <h2 style="margin-top:10px; font-size:20px; padding-right:36px;">${escapeHtml(menu.title)}</h2>
    ${renderMenuSections(menu)}
  `;
}
