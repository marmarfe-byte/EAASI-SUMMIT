import { escapeHtml, displayText, isPlaceholder, mapsUrlFromLatLng, externalLinkAttrs } from "../utils.js";
import { EXTERNAL_LINK } from "../icons.js";

export function renderVenue(data) {
  const v = data.venue;
  const mapsUrl = !isPlaceholder(v.mapEmbedUrl)
    ? v.mapEmbedUrl
    : v.mapLatLng
    ? mapsUrlFromLatLng(v.mapLatLng.lat, v.mapLatLng.lng)
    : null;

  const a = v.accommodation;
  const accommodation = a
    ? `
    <div class="card">
      <h3>Room Rates &amp; Reservation</h3>
      <div class="desc">${escapeHtml(displayText(a.intro, ""))}</div>
      <div class="info-grid" style="margin-top:12px;">
        ${(a.roomTypes || [])
          .map(
            (r) => `
          <div class="info-tile">
            <div class="label">${escapeHtml(r.name)}</div>
            <div class="value"><strong>${escapeHtml(r.pricePerNight)}</strong> / night</div>
          </div>`
          )
          .join("")}
      </div>
      <div class="desc" style="margin-top:6px;">${escapeHtml(displayText(a.ratesNote, ""))}</div>
      <div class="desc" style="margin-top:12px;">${escapeHtml(displayText(a.availabilityNote, ""))}</div>
      <div class="desc" style="margin-top:10px;">${escapeHtml(displayText(a.reservationInstructions, ""))}</div>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        ${
          !isPlaceholder(a.reservationEmail)
            ? `<a class="btn btn--ghost" href="mailto:${escapeHtml(a.reservationEmail)}">Email Reservations</a>`
            : ""
        }
        ${
          !isPlaceholder(a.reservationPhone)
            ? `<a class="btn btn--ghost" href="tel:${escapeHtml(a.reservationPhone.replace(/\s+/g, ""))}">${escapeHtml(a.reservationPhone)}</a>`
            : ""
        }
      </div>
      <div class="desc" style="margin-top:12px;">${escapeHtml(displayText(a.paymentNote, ""))}</div>
      <div class="desc" style="margin-top:6px;"><strong>Cancellation:</strong> ${escapeHtml(displayText(a.cancellationPolicy, "TBC"))}</div>
    </div>`
    : "";

  const floors = (v.floors || [])
    .map(
      (floor) => `
      <div class="divider-band">
        <h3>${escapeHtml(floor.floorName)}</h3>
      </div>
      ${(floor.rooms || [])
        .map(
          (room) => `
        <div class="card">
          <h3>${escapeHtml(displayText(room.roomName, "Room name TBC"))}</h3>
          <div class="meta">
            ${room.capacity != null ? `<span>Capacity: ${escapeHtml(String(room.capacity))}</span>` : ""}
          </div>
          <div class="desc">${escapeHtml(displayText(room.usedFor, "Use TBC"))}</div>
        </div>`
        )
        .join("")}`
    )
    .join("");

  return `
    <div class="section-heading">
      <h1>Venue</h1>
      <p>Hotel address, rooms &amp; floor layout</p>
    </div>

    ${!isPlaceholder(v.heroImage) ? `<img class="venue-hero-img" src="${escapeHtml(v.heroImage)}" alt="${escapeHtml(displayText(v.venueName, "Venue"))}"/>` : ""}

    <div class="card">
      <h3>${escapeHtml(displayText(v.venueName, "Venue name TBC"))}</h3>
      <div class="desc">${escapeHtml(displayText(v.address, "Address TBC"))}</div>
      ${
        mapsUrl
          ? `<div style="margin-top:12px;"><a class="btn btn--ghost" href="${mapsUrl}" ${externalLinkAttrs()}>Open in Maps ${EXTERNAL_LINK}</a></div>`
          : ""
      }
    </div>

    <div class="card">
      <h3>Check-in</h3>
      <div class="desc">${escapeHtml(displayText(v.checkInNotes, "Check-in details coming soon."))}</div>
    </div>

    ${accommodation}

    ${floors}
  `;
}
