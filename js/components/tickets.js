import { escapeHtml, displayText, isPlaceholder, externalLinkAttrs } from "../utils.js";
import { EXTERNAL_LINK } from "../icons.js";

export function renderTickets(data) {
  const t = data.tickets;

  const feeRows = (t.fees || [])
    .map(
      (f) => `
      <div class="fee-row">
        <span class="fee-label">${escapeHtml(f.audience)} <span class="fee-tier">(${escapeHtml(f.tier)})</span></span>
        <span class="fee-price">${escapeHtml(f.price)}</span>
      </div>`
    )
    .join("");

  const notes = (t.notes || []).map((n) => `<p class="desc" style="margin-bottom:10px;">${escapeHtml(n)}</p>`).join("");

  return `
    <div class="section-heading">
      <h1>Tickets</h1>
      <p>Registration &amp; pricing</p>
    </div>

    <div class="card">
      <div class="desc">${escapeHtml(displayText(t.intro, "Registration details coming soon."))}</div>
    </div>

    <div class="card card--flush">
      <div class="fee-table-heading">Summit Fees</div>
      ${feeRows}
    </div>

    ${
      !isPlaceholder(t.feesDeadlineNote)
        ? `<div class="divider-band"><h3>Early Bird Deadline</h3><p>${escapeHtml(t.feesDeadlineNote)}</p></div>`
        : ""
    }

    ${
      !isPlaceholder(t.purchaseUrl)
        ? `<a class="btn" style="width:100%; margin: 4px 0 18px;" href="${escapeHtml(t.purchaseUrl)}" ${externalLinkAttrs()}>Buy Tickets ${EXTERNAL_LINK}</a>`
        : ""
    }

    <div class="card">
      ${notes}
    </div>
  `;
}
