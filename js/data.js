const CONTENT_FILES = {
  home: "/content/home.json",
  tickets: "/content/tickets.json",
  venue: "/content/venue.json",
  agenda: "/content/agenda.json",
  speakers: "/content/speakers.json",
  social: "/content/social_activities.json",
  additional: "/content/additional_activities.json",
  sponsors: "/content/sponsors.json",
  committees: "/content/committees.json",
  practical: "/content/practical_info.json",
};

export async function loadAllContent() {
  const entries = Object.entries(CONTENT_FILES);
  const results = await Promise.all(
    entries.map(async ([key, url]) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      return [key, await res.json()];
    })
  );
  return Object.fromEntries(results);
}

export function getSpeakerById(speakersData, id) {
  return (speakersData?.speakers || []).find((s) => s.id === id) || null;
}
