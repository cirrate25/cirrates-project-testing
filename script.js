/* =====================================================================
   CONFIG — everything you may want to change lives here.
   ===================================================================== */

/* GLOBAL SHARING (pick ONE, easiest first):

   OPTION A — JSONBin-style shared file (no account needed):
   1. Open https://jsonblob.com in your browser
   2. Paste this into the box:  {"links":[],"reports":[]}
   3. Click Create, copy the API URL it gives you
      (looks like https://jsonblob.com/api/jsonBlob/1234567890)
   4. Paste that URL below. Every visitor now shares one board.

   OPTION B — Supabase (free real database):
   1. Create a free project at https://supabase.com
   2. SQL editor -> run:
        create table links (
          id uuid primary key default gen_random_uuid(),
          name text not null,
          url text not null,
          cat text not null,
          created_at timestamptz default now()
        );
        create table reports (
          id uuid primary key default gen_random_uuid(),
          link_name text not null,
          link_url text not null,
          reason text not null,
          created_at timestamptz default now()
        );
        alter table links enable row level security;
        alter table reports enable row level security;
        create policy "public read links" on links for select using (true);
        create policy "public insert links" on links for insert with check (true);
        create policy "public insert reports" on reports for insert with check (true);
   3. Project Settings -> API -> paste Project URL and anon public key below.
   Leave both options blank to stay local-only (works fine solo). */
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";
const SHARED_JSON_URL = "";

const DISCORD_INVITE_URL = "https://discord.gg/official-music-promotions-endeavor-records-864591219837501461";
const DISCORD_SERVER_ID = "";

/* =====================================================================
   SEED CATEGORIES
   ===================================================================== */
const sections = [
  { title: "Paid Plugin & Instrument Stores", icon: "🎛", eyebrow: "VST / AU / AAX · COMMERCIAL", links: [
    ["Plugin Boutique", "pluginboutique.com"], ["Native Instruments", "native-instruments.com"], ["Sounds Online (EastWest)", "soundsonline.com"], ["Vienna Symphonic Library", "vsl.co.at"], ["Musio", "musio.com"], ["Initial Audio", "initialaudio.com"], ["Spitfire Audio", "spitfireaudio.com"], ["Steinberg", "steinberg.net"], ["Vital Audio", "vital.audio"], ["Cherry Audio", "cherryaudio.com"], ["United Plugins", "unitedplugins.com"], ["Angelic Vibes", "angelicvibes.com"], ["Producer Planet", "producerplanet.com"], ["Purafied", "purafied.com"], ["Auditory Lab", "auditory-lab.com"], ["Klevgrand", "klevgrand.com"], ["Cableguys ShaperBox", "cableguys.com"], ["Vocaloid", "vocaloid.com"], ["Solemn Tones", "solemntones.com"], ["IK Multimedia", "ikmultimedia.com"], ["Korg", "korg.com"], ["Spectrasonics", "spectrasonics.net"], ["MeldaProduction", "meldaproduction.com"], ["KVR Audio", "kvraudio.com"], ["Bedroom Producers Blog", "bedroomproducersblog.com"], ["Sweetwater · Guitar Rig 7 Pro", "sweetwater.com"], ["B&H · Guitar Rig 7 Pro", "bhphotovideo.com"]
  ]},
  { title: "Free Plugins", icon: "✦", eyebrow: "NOTHING TO PAY · START HERE", links: [
    ["Valhalla DSP · reverb & delay", "valhalladsp.com"], ["Surge Synth Team", "surge-synthesizer.github.io"], ["Vital · wavetable synth", "vital.audio"], ["Dexed · FM synth", "asb2m10.github.io/dexed"], ["Decent Sampler", "decentsamples.com"], ["Plugin Boutique · free section", "pluginboutique.com"]
  ]},
  { title: "Free & Paid Mixed Catalogues", icon: "◒", eyebrow: "FREEBIES PLUS PREMIUM LINES", links: [
    ["Tokyo Dawn Labs", "tokyodawn.net"], ["Dreamtonics", "dreamtonics.com"], ["Roland", "roland.com"], ["Audio Plugin Deals", "audioplugin.deals"], ["Sonuscore", "sonuscore.com"], ["lkjb Plugins · QRange", "lkjb.net"], ["Auburn Sounds", "auburnsounds.com"], ["Voxengo", "voxengo.com"]
  ]},
  { title: "DAWs", icon: "▣", eyebrow: "WHERE THE WORK ACTUALLY HAPPENS", links: [
    ["Logic Pro", "apple.com/logic-pro"], ["Ableton Live", "ableton.com"], ["FL Studio", "image-line.com"], ["REAPER", "reaper.fm"], ["Bitwig Studio", "bitwig.com"], ["Steinberg · Cubase, Nuendo, Dorico & more", "steinberg.net"], ["BandLab · make music online", "bandlab.com"], ["Sesh", "sesh.fm"], ["Music Maker", "magix.com"], ["LA Studio · browser editor", "la-studio.cc"]
  ]},
  { title: "Marketplaces, Samples & Services", icon: "◎", eyebrow: "SELL BEATS, HIRE PEOPLE, GET SOUNDS", links: [
    ["BeatStars · beat marketplace", "beatstars.com"], ["SoundBetter · mixing & mastering", "soundbetter.com"], ["AirGigs · remote producers", "airgigs.com"], ["Splice · samples", "splice.com"], ["ProducerHive · mixing tips", "producerhive.com"], ["NCH · DJ mixing program", "nch.com.au"]
  ]},
  { title: "Browser Tools & Practice", icon: "⌁", eyebrow: "NO INSTALL NEEDED", links: [
    ["RecordingLab · practice mixing", "recordinglab.app"], ["AudioWrench · browser DAW", "audiowrench.com"], ["12NOTEZ · metronome, tuner, tanpura", "12notez.com"], ["123apps · audio, video, PDF convert", "123apps.com"]
  ]},
  { title: "Recording & Voice Capture", icon: "●", eyebrow: "PC AND ONLINE RECORDERS", links: [
    ["RecordPad · HQ audio recorder", "nch.com.au"], ["Rev · online voice recorder", "rev.com"], ["Vocaroo", "vocaroo.com"], ["SpeakPipe · free recorder", "speakpipe.com"], ["NCH Capture · screen recorder", "nchsoftware.com"]
  ]},
  { title: "Paint.net", icon: "◉", eyebrow: "COVER ART", links: [
    ["Paint.net", "getpaint.net"], ["Photopea", "photopea.com"], ["GIMP", "gimp.org"], ["Krita", "krita.org"], ["Canva", "canva.com"], ["Pixlr", "pixlr.com"], ["PhotoDirector 365", "cyberlink.com"]
  ]},
  { title: "Video Editing", icon: "▷", eyebrow: "VISUALS & MUSIC VIDEOS", links: [
    ["PowerDirector", "cyberlink.com"], ["NCH Capture", "nchsoftware.com"], ["123apps Video Editor", "123apps.com"]
  ]},
  { title: "Files, Stems & Sample Packs", icon: "📦", eyebrow: "DROP ANY FILE LINK — MP3 WAV ZIP MID", links: [] },
  { title: "Wallpapers & Backgrounds", icon: "🖼️", eyebrow: "VISUAL LINKS FOR EVERYONE", links: [] }
];

/* =====================================================================
   SMALL UTILITIES
   ===================================================================== */
const $ = (selector) => document.querySelector(selector);

const safeUrl = (value) => {
  const text = String(value || "").trim();
  if (!text) return null;
  const withProtocol = /^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(withProtocol);
    return ["http:", "https:"].includes(url.protocol) ? url : null;
  } catch { return null; }
};

function escapeHtml(value) {
  if (value == null) return "";
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function makeId() {
  return (crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const FILE_EXTENSIONS = ["mp3", "wav", "flac", "ogg", "aiff", "mid", "midi", "zip", "rar", "7z", "flp", "als", "logicx", "pdf", "png", "jpg", "jpeg", "gif", "webp", "mp4", "mov", "stem"];
function fileExtensionOf(url) {
  try {
    const path = new URL(url).pathname.toLowerCase();
    const match = /\.([a-z0-9]{2,6})$/.exec(path);
    return match && FILE_EXTENSIONS.includes(match[1]) ? match[1] : null;
  } catch { return null; }
}

function slugifyCategory(name) {
  const clean = String(name || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 40);
  return clean || null;
}

/* =====================================================================
   BACKEND — supabase | json | local, auto-selected from config
   ===================================================================== */
const storageKey = "music-production-resource-links-v2";
const reportsStorageKey = "music-production-resource-reports";

const supabaseReady = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase);
const sb = supabaseReady ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const backendMode = supabaseReady ? "supabase" : (SHARED_JSON_URL ? "json" : "local");

let store = { links: [], reports: [] };
let pendingLocalLinks = [];

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
}

function normalizeLink(raw, index) {
  const cat = raw.cat ?? (Number.isInteger(raw.category) ? String(raw.category) : String(raw.category ?? "0"));
  const stamp = raw.ts || raw.created_at;
  return {
    id: String(raw.id || `legacy-${index}`),
    name: String(raw.name || "Untitled").slice(0, 120),
    url: String(raw.url || ""),
    cat,
    ts: stamp ? (new Date(stamp).getTime() || 0) : 0,
    origin: raw.origin || "local"
  };
}

function loadLocalStore() {
  const links = readJson(storageKey, []).map(normalizeLink);
  const reports = readJson(reportsStorageKey, []).map((r, i) => ({
    id: r.id || `local-report-${i}`,
    link_name: r.name || r.link_name || "Unnamed link",
    link_url: r.url || r.link_url || "",
    reason: r.reason || "Other",
    created_at: r.at || r.created_at || new Date().toISOString(),
    local: true
  }));
  return { links, reports };
}

async function fetchJsonDoc() {
  const response = await fetch(SHARED_JSON_URL, { headers: { "Accept": "application/json" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return {
    links: Array.isArray(data?.links) ? data.links.map(normalizeLink) : [],
    reports: Array.isArray(data?.reports) ? data.reports : []
  };
}

async function putJsonDoc(doc) {
  const response = await fetch(SHARED_JSON_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ links: doc.links.slice(-500), reports: doc.reports.slice(-200) })
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

function mergeById(current, incoming) {
  const map = new Map();
  for (const item of [...current, ...incoming]) {
    const key = item.id || `${item.url}|${item.name}`;
    const existing = map.get(key);
    if (!existing || (item.ts || 0) >= (existing.ts || 0)) map.set(key, item);
  }
  return [...map.values()];
}

async function pullRemote() {
  if (backendMode === "supabase") {
    const [linksRes, reportsRes] = await Promise.all([
      sb.from("links").select("*").order("created_at", { ascending: false }),
      sb.from("reports").select("*").order("created_at", { ascending: false })
    ]);
    return {
      links: (linksRes.data || []).map((row) => ({ id: row.id, name: row.name, url: row.url, cat: row.cat, ts: new Date(row.created_at).getTime(), origin: "remote" })),
      reports: (reportsRes.data || []).map((row) => ({ ...row, local: false }))
    };
  }
  if (backendMode === "json") return fetchJsonDoc();
  return null;
}

async function pushRemote() {
  if (backendMode === "supabase") {
    const unsynced = pendingLocalLinks;
    pendingLocalLinks = [];
    for (const link of unsynced) {
      const { error } = await sb.from("links").insert([{ name: link.name, url: link.url, cat: link.cat }]);
      if (error) { pendingLocalLinks.push(link); throw error; }
    }
    return true;
  }
  if (backendMode === "json") {
    const remote = await fetchJsonDoc();
    await putJsonDoc({
      links: mergeById(remote.links, store.links),
      reports: mergeById(remote.reports, store.reports)
    });
    return true;
  }
  return false;
}

async function deleteReport(report) {
  store.reports = store.reports.filter((item) => item.id !== report.id);
  if (backendMode === "supabase" && !report.local) {
    const { error } = await sb.from("reports").delete().eq("id", report.id);
    return !error;
  }
  if (backendMode === "local") writeJson(reportsStorageKey, store.reports);
  if (backendMode === "json") {
    try { await putJsonDoc(store); return true; } catch { return false; }
  }
  return true;
}

function setSyncState(text) {
  const el = $("#sync-state");
  if (el) el.textContent = text;
}

async function initialSync() {
  if (backendMode === "local") {
    store = loadLocalStore();
    setSyncState("LOCAL ONLY");
    $("#sync-note").textContent = "Saved on this device. Add a shared URL in script.js to open the board to the world.";
    return;
  }
  setSyncState("SYNCING…");
  $("#sync-note").textContent = "Loading the shared board…";
  try {
    const remote = await pullRemote();
    const local = loadLocalStore();
    store.links = mergeById(local.links, remote.links);
    store.reports = mergeById(local.reports, remote.reports);
    writeJson(storageKey, store.links);
    setSyncState(backendMode === "supabase" ? "GLOBAL · SUPABASE LIVE" : "GLOBAL BOARD · LIVE");
    $("#sync-note").textContent = "This board is shared — everyone sees everyone's links.";
    if (pendingLocalLinks.length) await pushRemote().catch(() => {});
  } catch {
    store = loadLocalStore();
    writeJson(storageKey, store.links);
    setSyncState("OFFLINE MODE");
    $("#sync-note").textContent = "Couldn't reach the shared board right now — additions are kept and will sync later.";
  }
}

async function periodicPull() {
  if (backendMode === "local") return;
  try {
    const remote = await pullRemote();
    if (!remote) return;
    const before = store.links.length;
    store.links = mergeById(store.links, remote.links);
    store.reports = mergeById(store.reports, remote.reports);
    if (store.links.length !== before) { renderResources(); updateCounts(); }
  } catch { /* silent — next cycle retries */ }
}

/* =====================================================================
   RENDERING
   ===================================================================== */
const resourceGrid = $("#resource-grid");
const searchInput = $("#resource-search");
const searchResult = $("#search-result");
const totalLinksEl = $("#total-links");

function allCategories() {
  const seeds = sections.map((section, index) => ({
    id: String(index),
    title: section.title,
    icon: section.icon,
    eyebrow: section.eyebrow,
    community: false
  }));
  const known = new Set(seeds.map((seed) => seed.id));
  const extras = [];
  for (const link of store.links) {
    const catId = String(link.cat ?? "0");
    if (known.has(catId) || extras.some((extra) => extra.id === catId)) continue;
    known.add(catId);
    extras.push({
      id: catId,
      title: catId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      icon: "◆",
      eyebrow: "COMMUNITY CATEGORY",
      community: true
    });
  }
  return [...seeds, ...extras];
}

function linkMarkup(link, isStatic = false) {
  const url = safeUrl(link.url);
  if (!url) return "";
  const ext = fileExtensionOf(url.href);
  const badge = ext ? `<span class="file-badge">FILE · ${escapeHtml(ext.toUpperCase())}</span>` : "";
  const reasons = ["Broken link", "Wrong / outdated info", "Not free as listed", "Spam or inappropriate", "NSFW content", "Other"];
  const removeBtn = !isStatic && link.id ? `<button type="button" class="link-remove" data-remove-id="${escapeHtml(link.id)}" title="Remove this link">✕</button>` : "";
  return `<li class="link-item">
    <div class="link-row">
      <a class="resource-link" href="${url.href}" target="_blank" rel="noreferrer noopener"><span class="link-title">${escapeHtml(link.name)}</span>${badge}</a>
      <a class="link-url" href="${url.href}" target="_blank" rel="noreferrer noopener">${escapeHtml(url.hostname.replace(/^www\./, ""))}</a>
    </div>
    <div class="link-actions">
      <button type="button" class="report-btn">⚑ Report</button>
      ${removeBtn}
      <span class="report-status" hidden></span>
    </div>
    <div class="report-form" hidden>
      <select class="report-reason">${reasons.map((reason) => `<option value="${escapeHtml(reason)}">${escapeHtml(reason)}</option>`).join("")}</select>
      <button type="button" class="report-submit">Send</button>
      <button type="button" class="report-cancel">Cancel</button>
    </div>
  </li>`;
}

function panelMarkup(category, links) {
  return `<section class="panel" aria-labelledby="section-${escapeHtml(category.id)}">
    <div class="panel-heading"><div><p class="eyebrow">${escapeHtml(category.eyebrow)}</p><h2 id="section-${escapeHtml(category.id)}" class="category-title"><span class="category-symbol" aria-hidden="true">${category.community ? "◆" : escapeHtml(category.icon)}</span><span>${escapeHtml(category.title)}</span></h2></div></div>
    <ul class="link-list">${links.join("")}</ul>
  </section>`;
}

function renderResources(query = searchInput.value) {
  const keyword = query.trim().toLowerCase();
  const categories = allCategories();
  const panels = categories.map((category) => {
    let items = [];
    if (!category.community) {
      const index = Number(category.id);
      items = sections[index].links.map(([name, address]) => ({ name, address, isStatic: true }));
    }
    const shared = store.links.filter((link) => String(link.cat) === category.id);
    const sharedItems = shared
      .map((link) => ({ name: link.name, address: link.url, isStatic: false, id: link.id }))
      .filter((item) => safeUrl(item.address));
    items = [...items, ...sharedItems];
    const matchesCategory = `${category.title} ${category.eyebrow}`.toLowerCase().includes(keyword);
    const matchingItems = keyword
      ? items.filter((item) => matchesCategory || `${item.name} ${item.address}`.toLowerCase().includes(keyword))
      : items;
    return { category, links: matchingItems.map((item) => linkMarkup({ name: item.name, url: item.address, id: item.id }, item.isStatic)) };
  }).filter((panel) => panel.links.length);

  if (!panels.length) {
    resourceGrid.innerHTML = '<section class="panel"><p class="empty-state">No matches yet. Try a different website, tool, or category.</p></section>';
    searchResult.textContent = keyword ? "0 matching resources" : "";
    return;
  }
  const [first, ...rest] = panels;
  const columns = [[], []];
  rest.forEach((panel, index) => columns[index % 2].push(panelMarkup(panel.category, panel.links)));
  resourceGrid.innerHTML = `${panelMarkup(first.category, first.links)}<div class="resource-columns">${columns.map((cards) => `<div class="resource-column">${cards.join("")}</div>`).join("")}</div>`;
  searchResult.textContent = keyword ? `${panels.reduce((total, panel) => total + panel.links.length, 0)} matching resources` : "";
}

function removeLink(id) {
  if (!id) return;
  if (!confirm("Remove this link?")) return;
  store.links = store.links.filter((link) => link.id !== id);
  writeJson(storageKey, store.links);
  renderResources();
  updateCounts();
}

function updateCounts() {
  if (totalLinksEl) {
    const staticTotal = sections.reduce((total, section) => total + section.links.length, 0);
    totalLinksEl.textContent = String(staticTotal + store.links.length);
  }
}

/* =====================================================================
   EXPORT / IMPORT — keeps your links when you update the code
   ===================================================================== */
function exportLinks() {
  const data = {
    version: 1,
    exported: new Date().toISOString(),
    links: store.links,
    wallpapers: getWallpapers(),
    activeWallpaper: getActiveWallpaperId(),
    theme: currentTheme(),
    searches: getSearches()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `music-board-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importLinks(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.links || !Array.isArray(data.links)) {
        alert("Invalid backup file — no links found.");
        return;
      }
      const imported = data.links.map((l, i) => normalizeLink(l, i));
      store.links = mergeById(store.links, imported);
      writeJson(storageKey, store.links);
      if (data.wallpapers && Array.isArray(data.wallpapers)) {
        const safeWallpapers = data.wallpapers.map(w => ({
          ...w,
          html: w.html ? w.html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/\bon\w+\s*=/gi, "data-blocked=") : w.html
        }));
        saveWallpapers(safeWallpapers);
      }
      if (data.activeWallpaper) setActiveWallpaperId(data.activeWallpaper);
      if (data.theme !== undefined) applyTheme(data.theme);
      if (data.searches && Array.isArray(data.searches)) writeJson(searchStorageKey, data.searches);
      renderCategoryOptions();
      renderResources();
      updateCounts();
      renderSuggestions();
      renderWallpaperList();
      applyWallpaper(getActiveWallpaperId(), { persist: false });
      applyYoutubeSettings();
      alert(`Imported ${imported.length} links successfully.`);
    } catch (e) {
      alert("Could not read backup file: " + e.message);
    }
  };
  reader.readAsText(file);
}

/* =====================================================================
   ADD LINK FORM
   ===================================================================== */
const form = $("#link-form");
const categorySelect = $("#link-category");
const newCategoryWrap = $("#new-category-wrap");
const newCategoryInput = $("#link-new-category");
const message = $("#form-message");

function renderCategoryOptions() {
  const categories = allCategories();
  categorySelect.innerHTML = categories.map((category) =>
    `<option value="${escapeHtml(category.id)}">${escapeHtml(category.community ? "◆" : category.icon)} ${escapeHtml(category.title)}</option>`
  ).join("") + '<option value="__new">＋ New category…</option>';
}

categorySelect.addEventListener("change", () => {
  newCategoryWrap.hidden = categorySelect.value !== "__new";
  if (!newCategoryWrap.hidden) newCategoryInput.focus();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = safeUrl(form.url.value);
  if (!url) { message.textContent = "Please enter a valid website or file address."; return; }

  let categoryId = categorySelect.value;
  let categoryName;
  if (categoryId === "__new") {
    const slug = slugifyCategory(newCategoryInput.value);
    if (!slug) { message.textContent = "Give the new category a name first."; newCategoryInput.focus(); return; }
    const existing = allCategories().find((category) => slugifyCategory(category.title) === slug);
    categoryId = existing ? existing.id : slug;
    categoryName = existing ? existing.title : newCategoryInput.value.trim();
  } else {
    categoryName = allCategories().find((category) => category.id === categoryId)?.title || "the board";
  }

  const name = (form.name.value || "").trim() || url.hostname.replace(/^www\./, "");
  message.textContent = "Saving…";
  const link = { id: makeId(), name: name.slice(0, 120), url: url.href, cat: categoryId, ts: Date.now(), origin: "local" };

  store.links = mergeById(store.links, [link]);
  writeJson(storageKey, store.links);
  pendingLocalLinks.push(link);
  renderCategoryOptions();
  renderResources();
  updateCounts();

  if (backendMode === "local") {
    message.textContent = `Confirmed - link saved in ${categoryName} on this device.`;
  } else {
    message.textContent = `Confirmed - sharing "${categoryName}" with the world…`;
    try {
      await pushRemote();
      message.textContent = `Shared globally in ${categoryName}. Everyone can see it now.`;
      setSyncState(backendMode === "supabase" ? "GLOBAL · SUPABASE LIVE" : "GLOBAL BOARD · LIVE");
    } catch {
      message.textContent = `Saved in ${categoryName}, but couldn't reach the board — it will retry automatically.`;
      setSyncState("RETRYING…");
    }
  }
  form.reset();
  newCategoryWrap.hidden = true;
});

/* =====================================================================
   SEARCH (suggestions remember only what YOU typed)
   ===================================================================== */
const searchForm = $("#search-form");
const searchSuggestions = $("#search-suggestions");
const searchStorageKey = "music-production-resource-searches";

function getSearches() {
  const searches = readJson(searchStorageKey, []);
  return Array.isArray(searches) ? searches : [];
}
function renderSuggestions() {
  searchSuggestions.innerHTML = getSearches().slice(0, 10)
    .map((item) => `<option value="${escapeHtml(item)}"></option>`).join("");
}
let searchDebounce;
searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => renderResources(), 200);
});
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const search = searchInput.value.trim();
  if (search) {
    const searches = [search, ...getSearches().filter((item) => item.toLowerCase() !== search.toLowerCase())].slice(0, 6);
    writeJson(searchStorageKey, searches);
    renderSuggestions();
  }
  renderResources();
});

/* =====================================================================
   REPORTS + ADMIN
   ===================================================================== */
resourceGrid.addEventListener("click", async (event) => {
  const removeBtn = event.target.closest("[data-remove-id]");
  if (removeBtn) {
    removeLink(removeBtn.dataset.removeId);
    return;
  }
  const item = event.target.closest(".link-item");
  if (!item) return;
  const reportForm = item.querySelector(".report-form");
  const reportBtn = item.querySelector(".report-btn");
  const status = item.querySelector(".report-status");
  const linkName = item.querySelector(".link-title")?.textContent || "Unnamed link";
  const linkUrl = item.querySelector(".resource-link")?.getAttribute("href") || "";

  if (event.target.matches(".report-btn")) {
    reportForm.hidden = false;
    reportBtn.hidden = true;
  } else if (event.target.matches(".report-cancel")) {
    reportForm.hidden = true;
    reportBtn.hidden = false;
  } else if (event.target.matches(".report-submit")) {
    const reason = item.querySelector(".report-reason").value;
    event.target.disabled = true;
    const report = { id: makeId(), link_name: linkName, link_url: linkUrl, reason, created_at: new Date().toISOString(), local: true };
    store.reports = mergeById(store.reports, [report]);
    if (backendMode === "local") writeJson(reportsStorageKey, store.reports);
    let ok = true;
    if (backendMode === "supabase") {
      const { error } = await sb.from("reports").insert([{ link_name: report.link_name, link_url: report.link_url, reason }]);
      ok = !error;
    } else if (backendMode === "json") {
      try { await putJsonDoc(store); } catch { ok = false; }
    }
    reportForm.hidden = true;
    status.hidden = false;
    status.textContent = ok ? "Reported — thanks." : "Reported locally (couldn't reach the board).";
  }
});

const settingsPanel = $("#settings-panel");
const settingsClose = $("#settings-close");
const adminLogin = $("#admin-login");
const adminContent = $("#admin-content");
const adminReports = $("#admin-reports");
const adminStatus = $("#admin-status");
const reportCount = $("#report-count");

function renderAdminReports(reports) {
  reportCount.textContent = `${reports.length} report${reports.length === 1 ? "" : "s"}`;
  if (!reports.length) {
    adminReports.innerHTML = '<p class="admin-empty">No reports in the queue — all clear!</p>';
    return;
  }
  adminReports.innerHTML = reports.map((report) => {
    const date = report.created_at ? new Date(report.created_at).toLocaleString() : "Unknown time";
    const href = safeUrl(report.link_url)?.href || "#";
    return `<article class="report-card" data-report-id="${escapeHtml(report.id)}">
      <div class="report-card-head">
        <div>
          <h4>${escapeHtml(report.link_name || "Unnamed link")}</h4>
          <div class="report-card-url">${escapeHtml(report.link_url || "")}</div>
        </div>
        <span class="report-card-time">${escapeHtml(date)}</span>
      </div>
      <p class="report-card-reason"><strong>Reason:</strong> ${escapeHtml(report.reason || "Other")}</p>
      <div class="report-card-actions">
        <a href="${href}" target="_blank" rel="noreferrer noopener">Open link ↗</a>
        <button type="button" class="dismiss-report">Dismiss</button>
        <button type="button" class="remove-link-report" data-report-url="${escapeHtml(report.link_url || "")}">Remove Link</button>
      </div>
    </article>`;
  }).join("");
}

async function loadAdminReports() {
  adminStatus.textContent = "Loading reports…";
  try {
    renderAdminReports([...store.reports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    adminStatus.textContent = backendMode === "local"
      ? "Showing reports saved in this browser."
      : "Showing shared reports from the board.";
  } catch {
    renderAdminReports([]);
    adminStatus.textContent = "Could not load reports.";
  }
}

settingsClose.addEventListener("click", () => {
  const panel = $("#settings-panel");
  if (panel) panel.hidden = true;
});

// Reopen settings from the footer link
const settingsReopen = $("#settings-reopen");
if (settingsReopen) {
  settingsReopen.addEventListener("click", () => {
    const panel = $("#settings-panel");
    if (panel) {
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

$("#refresh-reports").addEventListener("click", async () => {
  await periodicPull();
  loadAdminReports();
});
adminReports.addEventListener("click", async (event) => {
  const dismissBtn = event.target.closest(".dismiss-report");
  const removeBtn = event.target.closest(".remove-link-report");

  if (dismissBtn) {
    const card = dismissBtn.closest(".report-card");
    const report = store.reports.find((entry) => entry.id === card.dataset.reportId);
    if (!report) return;
    dismissBtn.disabled = true;
    const ok = await deleteReport(report);
    if (ok) loadAdminReports();
    else {
      dismissBtn.disabled = false;
      adminStatus.textContent = "Could not dismiss this report.";
    }
    return;
  }

  if (removeBtn) {
    const url = removeBtn.dataset.reportUrl;
    const name = removeBtn.closest(".report-card")?.querySelector("h4")?.textContent?.trim();
    if (!url) return;
    if (!confirm("Remove this link and dismiss the report?")) return;
    removeBtn.disabled = true;
    // Remove only the specific link (matching URL + name) instead of all duplicates
    store.links = store.links.filter((link) => !(link.url === url && link.name === name));
    writeJson(storageKey, store.links);
    // Find and delete all reports for this URL
    const reportsToRemove = store.reports.filter((r) => r.link_url === url);
    for (const r of reportsToRemove) await deleteReport(r);
    renderResources();
    updateCounts();
    loadAdminReports();
    adminStatus.textContent = "Link removed and reports dismissed.";
    return;
  }
});

/* =====================================================================
   TABS
   ===================================================================== */
const tabs = [
  { btn: $("#tab-resources"), panel: $("#panel-resources") },
  { btn: $("#tab-rules"), panel: $("#panel-rules") },
  { btn: $("#tab-discord"), panel: $("#panel-discord") },
  { btn: $("#tab-themes"), panel: $("#panel-themes") },
  { btn: $("#tab-tools"), panel: $("#panel-tools") }
];
function activateTab(activeBtn) {
  const wasTools = tabs.find(t => t.btn.id === "tab-tools" && !t.panel.hidden);
  tabs.forEach(({ btn, panel }) => {
    const isActive = btn === activeBtn;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
    panel.hidden = !isActive;
  });
  if (wasTools && activeBtn.id !== "tab-tools") {
    document.body.style.overflow = "";
    const el = document.querySelector(".tools-panel-content");
    if (el && el._x_dataStack) {
      const d = el._x_dataStack[0];
      ["dawModal","audioModal","mixingModal","distroModal","eqModal","compressorModal","reverbModal","delayModal","satModal","synthModal","samplerModal","meterModal","utilityModal","modModal"].forEach(k => { d[k] = false; });
    }
  }
}
tabs.forEach(({ btn }) => btn.addEventListener("click", () => activateTab(btn)));

/* Arrow-key navigation for tabs */
const tabBtns = tabs.map(t => t.btn);
document.querySelector(".view-tabs")?.addEventListener("keydown", (e) => {
  const idx = tabBtns.indexOf(document.activeElement);
  if (idx === -1) return;
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    const next = e.key === "ArrowRight" ? (idx + 1) % tabBtns.length : (idx - 1 + tabBtns.length) % tabBtns.length;
    tabBtns[next].focus();
    activateTab(tabBtns[next]);
  }
});

/* =====================================================================
   DISCORD
   ===================================================================== */
const discordJoin = $("#discord-join");
const discordSetupNote = $("#discord-setup-note");
if (DISCORD_INVITE_URL && discordJoin) {
  discordJoin.href = DISCORD_INVITE_URL;
  discordJoin.hidden = false;
} else if (discordSetupNote) {
  discordSetupNote.hidden = false;
}
if (DISCORD_SERVER_ID) {
  const widgetWrap = $("#discord-widget-wrap");
  const widgetFrame = $("#discord-widget");
  if (widgetFrame) widgetFrame.src = `https://discord.com/widget?id=${DISCORD_SERVER_ID}&theme=dark`;
  if (widgetWrap) widgetWrap.hidden = false;
}

/* =====================================================================
   COLOR THEMES
   ===================================================================== */
const themeStorageKey = "music-production-resource-theme";
const themeGrid = $("#theme-grid");
const THEMES = [
  { id: "", name: "Miami Sunset", stops: ["#4a1268", "#a4187e", "#ff2f7e", "#ff6a3d", "#ffb24d", "#06b6a6"] },
  { id: "midnight", name: "Neon Noir", stops: ["#050510", "#0c0c2e", "#1a1050", "#2d1870", "#4c1d95", "#38bdf8"] },
  { id: "ocean", name: "Tropical Sunset", stops: ["#7c2d12", "#c2410c", "#ea580c", "#f97316", "#fb923c", "#0d9488"] },
  { id: "candy", name: "Synthwave", stops: ["#0a0518", "#1e0a3c", "#4a1268", "#831843", "#be185d", "#06d6d6"] },
  { id: "emerald", name: "Emerald Night", stops: ["#02120c", "#07301f", "#0e4d31", "#17553a", "#2c6b3f", "#a8e063"] },
  { id: "paper", name: "Studio Mono", stops: ["#d1d5db", "#c4c8cf", "#b8bcc5", "#adb2bc", "#a3a8b4", "#6b7280"] },
  { id: "arctic", name: "Arctic Frost", stops: ["#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7"] },
  { id: "volcanic", name: "Volcanic", stops: ["#1a0505", "#450a0a", "#7f1d1d", "#b91c1c", "#dc2626", "#f97316"] },
  { id: "blossom", name: "Cherry Blossom", stops: ["#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777"] },
  { id: "lavender", name: "Lavender Haze", stops: ["#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed"] },
  { id: "crimson", name: "Blood Moon", stops: ["#0f0505", "#2a0a0a", "#500a0a", "#7f1d1d", "#991b1b", "#ef4444"] },
  { id: "matrix", name: "Matrix", stops: ["#022c22", "#064e3b", "#065f46", "#047857", "#059669", "#34d399"] },
  { id: "golden", name: "Golden Hour", stops: ["#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706"] },
  { id: "deepsea", name: "Ocean Deep", stops: ["#031726", "#0c2d4a", "#0c4a6e", "#075985", "#0369a1", "#0ea5e9"] },
  { id: "pastel", name: "Pastel Dream", stops: ["#fef9c3", "#fde68a", "#fbcfe8", "#c4b5fd", "#a5f3fc", "#67e8f9"] },
  { id: "rust", name: "Rust", stops: ["#271409", "#431407", "#7c2d12", "#9a3412", "#c2410c", "#ea580c"] },
  { id: "frostbite", name: "Frostbite", stops: ["#ecfeff", "#cffafe", "#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4"] },
  { id: "midnightpurple", name: "Midnight Purple", stops: ["#0c0420", "#1a0a40", "#2e1065", "#581c87", "#7e22ce", "#c084fc"] },
  { id: "solar", name: "Solar Flare", stops: ["#fef3c7", "#fde68a", "#fcd34d", "#f59e0b", "#d97706", "#b45309"] },
  { id: "phantom", name: "Phantom", stops: ["#0f172a", "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8"] },
  { id: "ember", name: "Ember", stops: ["#1a0808", "#3b0c0c", "#7f1d1d", "#b91c1c", "#dc2626", "#f59e0b"] }
];

function currentTheme() {
  return localStorage.getItem(themeStorageKey) || "";
}
function applyTheme(themeId, { persist = true } = {}) {
  if (themeId) document.documentElement.dataset.theme = themeId;
  else delete document.documentElement.dataset.theme;
  if (persist) localStorage.setItem(themeStorageKey, themeId);
  renderThemeGrid();
}
function renderThemeGrid() {
  if (!themeGrid) return;
  const active = currentTheme();
  themeGrid.innerHTML = THEMES.map((theme) => `
    <button type="button" class="theme-swatch${active === theme.id ? " is-active" : ""}" data-theme-id="${theme.id}">
      <span class="theme-swatch-preview" style="background:linear-gradient(180deg, ${theme.stops.join(", ")})"></span>
      <span class="theme-swatch-name">${escapeHtml(theme.name)}<span class="theme-swatch-check">✓</span></span>
    </button>`).join("");
}
themeGrid.addEventListener("click", (event) => {
  const swatch = event.target.closest(".theme-swatch");
  if (swatch) applyTheme(swatch.dataset.themeId);
});

/* =====================================================================
   WALLPAPERS (image links + advanced snippets) — saved per browser
   ===================================================================== */
const wallpaperStorageKey = "music-production-resource-wallpapers";
const activeWallpaperStorageKey = "music-production-resource-active-wallpaper";

const defaultScene = $("#default-scene");
const customScene = $("#custom-scene");
const wallpaperLayer = $("#wallpaper-layer");
const wallpaperList = $("#wallpaper-list");
const wallpaperMessage = $("#wallpaper-message");

function getWallpapers() {
  const list = readJson(wallpaperStorageKey, []);
  return Array.isArray(list) ? list : [];
}
function saveWallpapers(list) { writeJson(wallpaperStorageKey, list); }
function getActiveWallpaperId() { return localStorage.getItem(activeWallpaperStorageKey) || ""; }
function setActiveWallpaperId(id) {
  if (id) localStorage.setItem(activeWallpaperStorageKey, id);
  else localStorage.removeItem(activeWallpaperStorageKey);
}

function renderWallpaperHtml(container, html) {
  const safe = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\bon\w+\s*=/gi, "data-blocked=");
  container.innerHTML = safe;
}

function applyWallpaper(id, { persist = true } = {}) {
  const entry = id ? getWallpapers().find((wallpaper) => wallpaper.id === id) : null;
  wallpaperLayer.style.backgroundImage = "";
  customScene.innerHTML = "";
  if (entry?.type === "url" && safeUrl(entry.url)) {
    wallpaperLayer.style.backgroundImage = `url("${safeUrl(entry.url).href.replace(/"/g, '%22')}")`;
    defaultScene.style.visibility = "hidden";
    if (persist) setActiveWallpaperId(entry.id);
  } else if (entry?.type === "html") {
    defaultScene.style.visibility = "";
    renderWallpaperHtml(customScene, entry.html);
    if (persist) setActiveWallpaperId(entry.id);
  } else {
    defaultScene.style.visibility = "";
    if (persist) setActiveWallpaperId("");
  }
  renderWallpaperList();
}

/* =====================================================================
   YOUTUBE CHANNEL SETTINGS
   ===================================================================== */
const youtubeStorageKey = "music-production-youtube";
const YOUTUBE_URL = "https://www.youtube.com/@NEVRAMV";
const youtubeNameInput = $("#youtube-name-input");
const youtubeDescInput = $("#youtube-desc-input");
const youtubeSaveBtn = $("#youtube-save-btn");
const youtubeThumb = $("#youtube-thumb");
const youtubeThumbPlaceholder = $("#youtube-thumb-placeholder");
const youtubeTitleEl = $("#youtube-title");
const youtubeDescEl = $("#youtube-desc");
const youtubeLinkEl = $("#youtube-link");

function getYoutubeSettings() {
  return readJson(youtubeStorageKey, { url: YOUTUBE_URL, name: "NEVRAMV", desc: "Beats & tutorials" });
}

function extractChannelId(url) {
  const channelMatch = url.match(/(?:youtube\.com\/channel\/(UC[\w-]{22}))/);
  if (channelMatch) return channelMatch[1];
  return null;
}

async function fetchRandomVideoThumb(channelUrl) {
  const thumbEl = youtubeThumb;
  const placeholderEl = youtubeThumbPlaceholder;
  if (!thumbEl || !placeholderEl) return;

  let channelId = extractChannelId(channelUrl);

  if (channelId) {
    try {
      const feedResp = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
      const feedText = await feedResp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(feedText, "text/xml");
      const entries = doc.querySelectorAll("entry");
      if (entries.length) {
        const randomEntry = entries[Math.floor(Math.random() * entries.length)];
        const videoId = randomEntry.querySelector("id")?.textContent?.split(":").pop();
        if (videoId) {
          thumbEl.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          thumbEl.alt = randomEntry.querySelector("title")?.textContent || "Latest video";
          thumbEl.hidden = false;
          placeholderEl.style.display = "none";
          return;
        }
      }
    } catch {}
  }

  thumbEl.hidden = true;
  placeholderEl.style.display = "";
}

function applyYoutubeSettings() {
  const yt = getYoutubeSettings();
  if (youtubeTitleEl) youtubeTitleEl.textContent = yt.name || "NEVRAMV";
  if (youtubeDescEl) youtubeDescEl.textContent = yt.desc || "";
  if (youtubeNameInput) youtubeNameInput.value = yt.name || "";
  if (youtubeDescInput) youtubeDescInput.value = yt.desc || "";

  if (youtubeLinkEl) {
    youtubeLinkEl.href = YOUTUBE_URL;
    youtubeLinkEl.hidden = false;
  }
  fetchRandomVideoThumb(YOUTUBE_URL);
}

if (youtubeSaveBtn) {
  youtubeSaveBtn.addEventListener("click", () => {
    const settings = {
      url: YOUTUBE_URL,
      name: youtubeNameInput.value.trim() || "NEVRAMV",
      desc: youtubeDescInput.value.trim() || ""
    };
    writeJson(youtubeStorageKey, settings);
    applyYoutubeSettings();
    updateAccountStatuses();
    const msg = $("#admin-status");
    if (msg) msg.textContent = "YouTube info saved.";
  });
}

/* =====================================================================
   INSTAGRAM PROFILE SETTINGS
   ===================================================================== */
const instagramStorageKey = "music-production-instagram";
const INSTAGRAM_URL = "https://www.instagram.com/endeverrecords/";
const instagramNameInput = $("#instagram-name-input");
const instagramDescInput = $("#instagram-desc-input");
const instagramSaveBtn = $("#instagram-save-btn");
const instagramTitleEl = $("#instagram-title");
const instagramDescEl = $("#instagram-desc");
const instagramLinkEl = $("#instagram-link");

function getInstagramSettings() {
  return readJson(instagramStorageKey, { url: INSTAGRAM_URL, name: "endeverrecords", desc: "Follow us on Instagram" });
}

function applyInstagramSettings() {
  const ig = getInstagramSettings();
  if (instagramTitleEl) instagramTitleEl.textContent = ig.name || "endeverrecords";
  if (instagramDescEl) instagramDescEl.textContent = ig.desc || "";
  if (instagramNameInput) instagramNameInput.value = ig.name || "";
  if (instagramDescInput) instagramDescInput.value = ig.desc || "";

  if (instagramLinkEl) {
    instagramLinkEl.href = INSTAGRAM_URL;
    instagramLinkEl.hidden = false;
  }
}

if (instagramSaveBtn) {
  instagramSaveBtn.addEventListener("click", () => {
    const settings = {
      url: INSTAGRAM_URL,
      name: instagramNameInput.value.trim() || "endeverrecords",
      desc: instagramDescInput.value.trim() || ""
    };
    writeJson(instagramStorageKey, settings);
    applyInstagramSettings();
    updateAccountStatuses();
    const msg = $("#admin-status");
    if (msg) msg.textContent = "Instagram info saved.";
  });
}

function renderWallpaperList() {
  if (!wallpaperList) return;
  const activeId = getActiveWallpaperId();
  const cards = [`<div class="wallpaper-card${activeId === "" ? " is-active" : ""}">
    <div class="wallpaper-card-name"><span class="wname">Built-in animated scene</span>${activeId === "" ? '<span class="wallpaper-active-badge">ACTIVE</span>' : ""}</div>
    <div class="wallpaper-card-actions">${activeId === "" ? "" : '<button type="button" class="secondary-btn wallpaper-apply" data-wp-id="">Apply</button>'}</div>
  </div>`];
  for (const wallpaper of getWallpapers()) {
    const isActive = wallpaper.id === activeId;
    const thumb = wallpaper.type === "url" && safeUrl(wallpaper.url)
      ? `<img class="wallpaper-thumb" src="${safeUrl(wallpaper.url).href}" alt="" referrerpolicy="no-referrer" loading="lazy" onerror="this.style.display='none'">`
      : "";
    cards.push(`<div class="wallpaper-card${isActive ? " is-active" : ""}">
      ${thumb}
      <div class="wallpaper-card-name"><span class="wname">${escapeHtml(wallpaper.name)}</span>${isActive ? '<span class="wallpaper-active-badge">ACTIVE</span>' : ""}</div>
      <div class="wallpaper-card-actions">
        ${isActive ? "" : `<button type="button" class="secondary-btn wallpaper-apply" data-wp-id="${escapeHtml(wallpaper.id)}">Apply</button>`}
        <button type="button" class="wallpaper-delete" data-wp-id="${escapeHtml(wallpaper.id)}">Delete</button>
      </div>
    </div>`);
  }
  wallpaperList.innerHTML = cards.join("");
}

$("#wallpaper-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#wallpaper-name").value.trim();
  const url = safeUrl($("#wallpaper-url").value);
  if (!name || !url) { wallpaperMessage.textContent = "Add a name and a valid image URL (https://…)."; return; }
  const wallpaper = { id: makeId(), type: "url", name: name.slice(0, 80), url: url.href };
  const list = getWallpapers();
  list.push(wallpaper);
  saveWallpapers(list);
  applyWallpaper(wallpaper.id);
  event.target.reset();
  wallpaperMessage.textContent = `Applied "${name}". It stays on this device.`;
});

$("#wallpaper-html-save").addEventListener("click", () => {
  const name = $("#wallpaper-html-name").value.trim() || "Custom snippet";
  const html = $("#wallpaper-html").value.trim();
  if (!html) { wallpaperMessage.textContent = "Paste an HTML snippet first."; return; }
  const wallpaper = { id: makeId(), type: "html", name: name.slice(0, 80), html };
  const list = getWallpapers();
  list.push(wallpaper);
  saveWallpapers(list);
  applyWallpaper(wallpaper.id);
  $("#wallpaper-html-name").value = "";
  $("#wallpaper-html").value = "";
  wallpaperMessage.textContent = `Snippet "${name}" applied.`;
});

wallpaperList.addEventListener("click", (event) => {
  const applyButton = event.target.closest(".wallpaper-apply");
  const deleteButton = event.target.closest(".wallpaper-delete");
  if (applyButton) {
    applyWallpaper(applyButton.dataset.wpId);
    wallpaperMessage.textContent = "";
  } else if (deleteButton) {
    const id = deleteButton.dataset.wpId;
    saveWallpapers(getWallpapers().filter((wallpaper) => wallpaper.id !== id));
    if (getActiveWallpaperId() === id) applyWallpaper("");
    else renderWallpaperList();
    wallpaperMessage.textContent = "Wallpaper deleted.";
  }
});

/* =====================================================================
   BOOT
   ===================================================================== */
applyTheme(currentTheme(), { persist: false });
renderCategoryOptions();
renderSuggestions();
renderThemeGrid();
renderWallpaperList();
applyWallpaper(getActiveWallpaperId(), { persist: false });
applyYoutubeSettings();
applyInstagramSettings();
initialSync().then(() => {
  renderResources();
  updateCounts();
});
window._pullInterval = setInterval(periodicPull, 60000);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(window._pullInterval);
    window._pullInterval = null;
  } else if (!window._pullInterval) {
    window._pullInterval = setInterval(periodicPull, 60000);
  }
});

/* Export / Import buttons */
const exportBtn = $("#export-links-btn");
const importInput = $("#import-links-input");
if (exportBtn) exportBtn.addEventListener("click", exportLinks);
if (importInput) importInput.addEventListener("change", (event) => {
  if (event.target.files[0]) importLinks(event.target.files[0]);
  event.target.value = "";
});

/* ---- Account connect buttons ---- */
const accountCards = document.querySelectorAll(".account-connect-btn");
accountCards.forEach((btn) => {
  btn.addEventListener("click", () => {
    const account = btn.dataset.account;
    if (account === "youtube") {
      window.open(YOUTUBE_URL, "_blank");
    } else if (account === "instagram") {
      window.open(INSTAGRAM_URL, "_blank");
    } else if (account === "discord") {
      const input = prompt("Paste your Discord invite URL:");
      if (input) {
        const safeDiscord = /^https?:\/\/(www\.)?(discord\.gg|discord\.com\/invite)\/[\w-]+(\/?\?[\w=&%-]*)?$/i.test(input.trim());
        if (!safeDiscord) { alert("Invalid Discord invite URL. Must be a discord.gg or discord.com/invite link."); return; }
        const joinBtn = $("#discord-join");
        if (joinBtn) { joinBtn.href = input.trim(); joinBtn.hidden = false; }
        const setupNote = $("#discord-setup-note");
        if (setupNote) setupNote.hidden = true;
        localStorage.setItem("music-production-discord-invite", input.trim());
        updateAccountStatuses();
      }
    }
  });
});

/* ---- Live account status ---- */
function updateAccountStatuses() {
  const yt = getYoutubeSettings();
  const ig = getInstagramSettings();
  const dcUrl = localStorage.getItem("music-production-discord-invite") || "";
  const ytUrl = YOUTUBE_URL;
  const igUrl = INSTAGRAM_URL;
  const ytStatus = $("#account-yt-status");
  const igStatus = $("#account-ig-status");
  const dcStatus = $("#account-dc-status");
  const ytName = (youtubeNameInput ? youtubeNameInput.value.trim() : "") || yt.name || "NEVRAMV";
  const igName = (instagramNameInput ? instagramNameInput.value.trim() : "") || ig.name || "endeverrecords";
  if (ytStatus) ytStatus.textContent = ytUrl ? `Connected — ${ytName}` : "Not connected";
  if (igStatus) igStatus.textContent = igUrl ? `Connected — ${igName}` : "Not connected";
  if (dcStatus) dcStatus.textContent = dcUrl ? "Connected" : "Not connected";
}
updateAccountStatuses();

/* Auto-update account status when fields change */
if (youtubeNameInput) youtubeNameInput.addEventListener("input", updateAccountStatuses);
if (instagramNameInput) instagramNameInput.addEventListener("input", updateAccountStatuses);
