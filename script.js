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
/* Tag vocabulary used by the filter chips:
     price     free | paid
     platform  browser | win | mac | linux | mobile
     level     beginner
   Section tags apply to every link in the section. A third entry on a link
   overrides its section tags *within the same group*:
     ["Vital", "vital.audio", "free win mac linux"]
   `aliases` feed the fuzzy search, so "daw" finds "Digital Audio Workstations"
   and "abelton" still finds Ableton. `verified` is the last hand-check date;
   tools/check-links.mjs can overwrite it via link-status.json. */
const DEFAULT_VERIFIED = "2026-08-20";

const sections = [
  { title: "Paid Plugin & Instrument Stores", icon: "🎛", eyebrow: "VST / AU / AAX · COMMERCIAL",
    tags: "paid win mac", verified: "2026-08-20",
    aliases: ["vst", "vst3", "au", "aax", "plugin", "plugins", "instrument", "instruments", "store", "shop", "buy", "synth", "synths", "sample library"],
    links: [
    ["Plugin Boutique", "pluginboutique.com", "paid free"], ["Native Instruments", "native-instruments.com", "paid free"], ["Sounds Online (EastWest)", "soundsonline.com"], ["Vienna Symphonic Library", "vsl.co.at"], ["Musio", "musio.com"], ["Initial Audio", "initialaudio.com"], ["Spitfire Audio", "spitfireaudio.com", "paid free"], ["Steinberg", "steinberg.net"], ["Vital Audio", "vital.audio", "free win mac linux beginner"], ["Cherry Audio", "cherryaudio.com"], ["United Plugins", "unitedplugins.com"], ["Angelic Vibes", "angelicvibes.com"], ["Producer Planet", "producerplanet.com"], ["Purafied", "purafied.com"], ["Auditory Lab", "auditory-lab.com"], ["Klevgrand", "klevgrand.com"], ["Cableguys ShaperBox", "cableguys.com"], ["Vocaloid", "vocaloid.com"], ["Solemn Tones", "solemntones.com"], ["IK Multimedia", "ikmultimedia.com", "paid free"], ["Korg", "korg.com"], ["Spectrasonics", "spectrasonics.net"], ["MeldaProduction", "meldaproduction.com", "paid free"], ["KVR Audio", "kvraudio.com", "free browser"], ["Bedroom Producers Blog", "bedroomproducersblog.com", "free browser beginner"], ["Sweetwater · Guitar Rig 7 Pro", "sweetwater.com", "paid browser"], ["B&H · Guitar Rig 7 Pro", "bhphotovideo.com", "paid browser"]
  ]},
  { title: "Free Plugins", icon: "✦", eyebrow: "NOTHING TO PAY · START HERE",
    tags: "free win mac", verified: "2026-08-20",
    aliases: ["free", "freeware", "no cost", "plugin", "plugins", "vst", "reverb", "delay", "synth", "eq", "compressor", "beginner"],
    links: [
    ["Valhalla DSP · reverb & delay", "valhalladsp.com", "free win mac beginner"], ["Surge Synth Team", "surge-synthesizer.github.io", "free win mac linux"], ["Vital · wavetable synth", "vital.audio", "free win mac linux beginner"], ["Dexed · FM synth", "asb2m10.github.io/dexed", "free win mac linux"], ["Decent Sampler", "decentsamples.com", "free win mac beginner"], ["Plugin Boutique · free section", "pluginboutique.com", "free browser"]
  ]},
  { title: "Free & Paid Mixed Catalogues", icon: "◒", eyebrow: "FREEBIES PLUS PREMIUM LINES",
    tags: "free paid win mac", verified: "2026-08-20",
    aliases: ["mixed", "catalogue", "catalog", "plugin", "plugins", "mastering", "eq", "compressor", "vocal", "voice"],
    links: [
    ["Tokyo Dawn Labs", "tokyodawn.net", "free paid win mac"], ["Dreamtonics", "dreamtonics.com", "paid win mac"], ["Roland", "roland.com"], ["Audio Plugin Deals", "audioplugin.deals", "paid browser"], ["Sonuscore", "sonuscore.com", "paid"], ["lkjb Plugins · QRange", "lkjb.net", "free win mac"], ["Auburn Sounds", "auburnsounds.com", "free paid win mac linux"], ["Voxengo", "voxengo.com", "free paid win mac"]
  ]},
  { title: "DAWs", icon: "▣", eyebrow: "WHERE THE WORK ACTUALLY HAPPENS",
    tags: "paid win mac", verified: "2026-08-20",
    aliases: ["daw", "digital audio workstation", "sequencer", "recording software", "production software", "studio", "beat making"],
    links: [
    ["Logic Pro", "apple.com/logic-pro", "paid mac"], ["Ableton Live", "ableton.com", "paid win mac"], ["FL Studio", "image-line.com", "paid win mac beginner"], ["REAPER", "reaper.fm", "paid win mac linux"], ["Bitwig Studio", "bitwig.com", "paid win mac linux"], ["Steinberg · Cubase, Nuendo, Dorico & more", "steinberg.net", "paid win mac"], ["BandLab · make music online", "bandlab.com", "free browser mobile beginner"], ["Sesh", "sesh.fm", "free browser beginner"], ["Music Maker", "magix.com", "paid win beginner"], ["LA Studio · browser editor", "la-studio.cc", "free browser"]
  ]},
  { title: "Marketplaces, Samples & Services", icon: "◎", eyebrow: "SELL BEATS, HIRE PEOPLE, GET SOUNDS",
    tags: "paid browser", verified: "2026-08-20",
    aliases: ["sample", "samples", "sample pack", "loops", "stems", "beat", "beats", "marketplace", "mixing service", "mastering service", "hire", "session"],
    links: [
    ["BeatStars · beat marketplace", "beatstars.com", "free browser beginner"], ["SoundBetter · mixing & mastering", "soundbetter.com", "paid browser"], ["AirGigs · remote producers", "airgigs.com", "paid browser"], ["Splice · samples", "splice.com", "paid browser win mac"], ["ProducerHive · mixing tips", "producerhive.com", "free browser beginner"], ["NCH · DJ mixing program", "nch.com.au", "paid win"]
  ]},
  { title: "Browser Tools & Practice", icon: "⌁", eyebrow: "NO INSTALL NEEDED",
    tags: "free browser beginner", verified: "2026-08-20",
    aliases: ["browser", "online", "web", "no install", "practice", "ear training", "metronome", "tuner", "converter"],
    links: [
    ["RecordingLab · practice mixing", "recordinglab.app"], ["AudioWrench · browser DAW", "audiowrench.com"], ["12NOTEZ · metronome, tuner, tanpura", "12notez.com"], ["123apps · audio, video, PDF convert", "123apps.com"]
  ]},
  { title: "Recording & Voice Capture", icon: "●", eyebrow: "PC AND ONLINE RECORDERS",
    tags: "win browser", verified: "2026-08-20",
    aliases: ["record", "recording", "recorder", "vocals", "voice", "mic", "microphone", "screen capture"],
    links: [
    ["RecordPad · HQ audio recorder", "nch.com.au", "paid win"], ["Rev · online voice recorder", "rev.com", "free browser"], ["Vocaroo", "vocaroo.com", "free browser beginner"], ["SpeakPipe · free recorder", "speakpipe.com", "free browser beginner"], ["NCH Capture · screen recorder", "nchsoftware.com", "paid win"]
  ]},
  { title: "Paint.net", icon: "◉", eyebrow: "COVER ART",
    tags: "free win", verified: "2026-08-20",
    aliases: ["art", "cover art", "artwork", "image", "images", "graphics", "photo", "design", "thumbnail", "logo", "paint"],
    links: [
    ["Paint.net", "getpaint.net", "free win beginner"], ["Photopea", "photopea.com", "free browser beginner"], ["GIMP", "gimp.org", "free win mac linux"], ["Krita", "krita.org", "free win mac linux"], ["Canva", "canva.com", "free browser beginner"], ["Pixlr", "pixlr.com", "free browser beginner"], ["PhotoDirector 365", "cyberlink.com", "paid win mac"]
  ]},
  { title: "Video Editing", icon: "▷", eyebrow: "VISUALS & MUSIC VIDEOS",
    tags: "paid win", verified: "2026-08-20",
    aliases: ["video", "video editing", "visuals", "music video", "clip", "editor", "youtube"],
    links: [
    ["PowerDirector", "cyberlink.com", "paid win mac"], ["NCH Capture", "nchsoftware.com", "paid win"], ["123apps Video Editor", "123apps.com", "free browser beginner"]
  ]},
  { title: "Files, Stems & Sample Packs", icon: "📦", eyebrow: "DROP ANY FILE LINK — MP3 WAV ZIP MID",
    tags: "free", verified: "2026-08-20",
    aliases: ["file", "files", "stems", "sample pack", "packs", "download", "mp3", "wav", "zip", "midi", "flp"],
    links: [] },
  { title: "Wallpapers & Backgrounds", icon: "🖼️", eyebrow: "VISUAL LINKS FOR EVERYONE",
    tags: "free browser", verified: "2026-08-20",
    aliases: ["wallpaper", "wallpapers", "background", "backgrounds", "theme", "image"],
    links: [] }
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
    if (linksRes.error) throw linksRes.error;
    if (reportsRes.error) throw reportsRes.error;
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
    const unsynced = [...pendingLocalLinks];
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

/* =====================================================================
   TAGS & FILTERS
   ===================================================================== */
const PRICE_TAGS = ["free", "paid"];
const PLATFORM_TAGS = ["browser", "win", "mac", "linux", "mobile"];
const LEVEL_TAGS = ["beginner"];
const TAG_GROUPS = [PRICE_TAGS, PLATFORM_TAGS, LEVEL_TAGS];
const TAG_LABELS = { free: "Free", paid: "Paid", browser: "Browser", win: "Windows", mac: "Mac", linux: "Linux", mobile: "Mobile", beginner: "Beginner" };

const activeFilters = new Set();
let sortMode = "default";

function parseTags(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : String(value).split(/[\s,]+/);
  return list.map((tag) => tag.trim().toLowerCase()).filter(Boolean);
}
/* A link's own tags win inside their group; everything else is inherited
   from the section, so "free win mac" on a link doesn't lose "beginner". */
function mergeTags(own, base) {
  const out = new Set(own);
  for (const tag of base) {
    const group = TAG_GROUPS.find((g) => g.includes(tag));
    if (group && own.some((o) => group.includes(o))) continue;
    out.add(tag);
  }
  return [...out];
}
function matchesFilters(tags) {
  if (!activeFilters.size) return true;
  const set = new Set(tags);
  for (const group of TAG_GROUPS) {
    const picked = group.filter((tag) => activeFilters.has(tag));
    if (picked.length && !picked.some((tag) => set.has(tag))) return false;
  }
  return true;
}
function tagMarkup(tags) {
  const shown = ["free", "paid", "browser", "beginner"].filter((tag) => tags.includes(tag)).slice(0, 3);
  if (!shown.length) return "";
  return `<span class="link-tags">${shown.map((tag) => `<span class="link-tag tag-${tag}">${TAG_LABELS[tag]}</span>`).join("")}</span>`;
}

/* =====================================================================
   FUZZY SEARCH — typo tolerant, with per-category synonyms
   ===================================================================== */
const SYNONYMS = {
  daw: ["digital audio workstation", "sequencer", "recording software", "ableton", "fl studio", "logic", "reaper", "cubase", "bitwig"],
  plugin: ["vst", "vst3", "au", "aax", "effect", "effects"],
  vst: ["plugin", "plugins", "vst3"],
  eq: ["equalizer", "equalisation", "equalization", "filter"],
  compressor: ["compression", "dynamics", "limiter"],
  reverb: ["space", "room", "hall", "plate"],
  synth: ["synthesizer", "synthesiser", "wavetable", "fm"],
  sample: ["samples", "sample pack", "loops", "stems", "one shots"],
  art: ["artwork", "cover art", "image", "graphics", "design", "paint"],
  video: ["video editing", "visuals", "music video"],
  mic: ["microphone", "recording", "vocals", "voice"],
  free: ["freeware", "no cost", "gratis"],
  cheap: ["free", "budget", "affordable"],
  mixing: ["mix", "mastering", "master"],
  wallpaper: ["wallpapers", "background", "backgrounds"],
  browser: ["online", "web", "no install", "in browser"],
  beginner: ["starter", "easy", "beginner friendly", "new"],
  distribution: ["distributor", "distro", "spotify", "release"]
};

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9\s.]+/g, " ").replace(/\s+/g, " ").trim();
}
function editDistance(a, b) {
  // Damerau-Levenshtein: a swapped pair ("abelton", "revreb") costs 1, not 2.
  const rows = a.length + 1, cols = b.length + 1;
  const grid = Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      grid[i][j] = Math.min(grid[i - 1][j] + 1, grid[i][j - 1] + 1, grid[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        grid[i][j] = Math.min(grid[i][j], grid[i - 2][j - 2] + 1);
      }
    }
  }
  return grid[rows - 1][cols - 1];
}
function expandToken(token) {
  const out = new Set([token]);
  for (const [key, words] of Object.entries(SYNONYMS)) {
    if (key === token || words.includes(token)) {
      out.add(key);
      for (const word of words) out.add(word);
    }
  }
  return [...out];
}
/* 1 = literal hit, .85 = synonym, .8 = prefix, .65 = typo within edit distance */
function tokenScore(token, haystack) {
  let best = 0;
  for (const variant of expandToken(token)) {
    if (!variant) continue;
    if (haystack.includes(variant)) { best = Math.max(best, variant === token ? 1 : 0.85); continue; }
    if (variant.includes(" ") || variant.length < 3) continue;
    for (const word of haystack.split(/[^a-z0-9]+/)) {
      if (!word) continue;
      if (word.startsWith(variant)) { best = Math.max(best, 0.8); continue; }
      if (variant.length >= 4 && Math.abs(word.length - variant.length) <= 2) {
        const limit = variant.length >= 6 ? 2 : 1;
        if (editDistance(variant, word) <= limit) best = Math.max(best, 0.65);
      }
    }
  }
  return best;
}
function fuzzyScore(query, haystack) {
  const tokens = normalizeText(query).split(" ").filter(Boolean);
  if (!tokens.length) return 1;
  let total = 0, exact = 0;
  for (const token of tokens) {
    const score = tokenScore(token, haystack);
    if (!score) return 0;
    total += score;
    if (score === 1) exact += 1;
  }
  return total / tokens.length + exact * 0.001;
}

/* =====================================================================
   CLICK TRACKING — local by default; add the Supabase function below
   and every open is counted board-wide too.

     create table link_clicks (
       url text primary key,
       clicks bigint not null default 0,
       updated_at timestamptz default now()
     );
     alter table link_clicks enable row level security;
     create policy "public read clicks" on link_clicks for select using (true);
     create or replace function bump_link_click(p_url text)
       returns void language sql security definer as $$
         insert into link_clicks (url, clicks) values (p_url, 1)
         on conflict (url) do update set clicks = link_clicks.clicks + 1, updated_at = now();
       $$;
   ===================================================================== */
const clicksStorageKey = "music-production-resource-clicks";

function monthStamp() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
function getClicks() {
  const data = readJson(clicksStorageKey, {});
  return data && typeof data === "object" && !Array.isArray(data) ? data : {};
}
function clickStats(url) {
  const parsed = safeUrl(url);
  const entry = parsed ? getClicks()[parsed.href] : null;
  if (!entry) return { total: 0, month: 0 };
  return { total: entry.t || 0, month: entry.m === monthStamp() ? entry.c || 0 : 0 };
}
function bumpClick(url, name) {
  const parsed = safeUrl(url);
  if (!parsed) return;
  const clicks = getClicks();
  const key = parsed.href;
  const month = monthStamp();
  const entry = clicks[key] || { t: 0, c: 0, m: month };
  entry.t = (entry.t || 0) + 1;
  entry.c = entry.m === month ? (entry.c || 0) + 1 : 1;
  entry.m = month;
  if (name) entry.n = String(name).slice(0, 120);
  clicks[key] = entry;
  writeJson(clicksStorageKey, clicks);
  if (backendMode === "supabase") {
    try { sb.rpc("bump_link_click", { p_url: key }).then(() => {}, () => {}); } catch { /* function not installed */ }
  }
}
function popularEntries(limit = 6) {
  const clicks = getClicks();
  const month = monthStamp();
  return Object.entries(clicks)
    .map(([url, entry]) => ({
      url,
      name: entry.n || (safeUrl(url)?.hostname || url).replace(/^www\./, ""),
      total: entry.t || 0,
      month: entry.m === month ? entry.c || 0 : 0
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.month - a.month || b.total - a.total)
    .slice(0, limit);
}
function renderPopular() {
  const wrap = $("#popular-panel");
  if (!wrap) return;
  const entries = popularEntries();
  if (entries.length < 3) { wrap.hidden = true; wrap.innerHTML = ""; return; }
  wrap.hidden = false;
  wrap.innerHTML = `<section class="panel">
    <div class="panel-heading">
      <div><p class="eyebrow">POPULAR THIS MONTH</p><h2>Most opened</h2></div>
      <p class="section-note">Counted from opens on this device${backendMode === "supabase" ? " and the shared board" : ""}.</p>
    </div>
    <ol class="popular-list">${entries.map((item) => `<li>
      <a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener">${escapeHtml(item.name)}</a>
      <span class="popular-count">${item.month || item.total} open${(item.month || item.total) === 1 ? "" : "s"}</span>
    </li>`).join("")}</ol>
  </section>`;
}

/* =====================================================================
   LAST VERIFIED — hand-set dates, optionally overwritten by
   tools/check-links.mjs writing link-status.json next to this file
   ===================================================================== */
let linkStatus = null;
const deadUrls = new Set();

function formatVerifiedDate(value) {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  const date = parts ? new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])) : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "");
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
function verifiedFor(category) {
  const entry = linkStatus && linkStatus.categories ? linkStatus.categories[category.title] : null;
  return {
    checked: (entry && entry.checked) || (linkStatus && linkStatus.checked) || category.verified || DEFAULT_VERIFIED,
    dead: (entry && entry.dead) || 0
  };
}
function isDeadLink(url) {
  const parsed = safeUrl(url);
  return Boolean(parsed && deadUrls.has(parsed.href));
}
function updateVerifiedFooter() {
  const el = $("#footer-verified");
  if (!el) return;
  const checked = (linkStatus && linkStatus.checked) || DEFAULT_VERIFIED;
  el.textContent = `LINKS LAST CHECKED ${formatVerifiedDate(checked).toUpperCase()}`;
}
async function loadLinkStatus() {
  try {
    const response = await fetch("link-status.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (!data || typeof data !== "object") return;
    linkStatus = data;
    deadUrls.clear();
    for (const url of Array.isArray(data.dead) ? data.dead : []) {
      const parsed = safeUrl(url);
      if (parsed) deadUrls.add(parsed.href);
    }
    renderResources();
    updateVerifiedFooter();
  } catch { /* no status file published yet — hand-set dates stand */ }
}

/* =====================================================================
   ONBOARDING — first-time visitors get five safe bets
   ===================================================================== */
const onboardingStorageKey = "music-production-resource-onboarding-v1";
const STARTER_PICKS = [
  { name: "Vital", url: "https://vital.audio", why: "Free wavetable synth that holds up against the paid ones. Best first instrument." },
  { name: "REAPER", url: "https://www.reaper.fm", why: "Full DAW with an unlimited free evaluation. Runs on almost any machine." },
  { name: "Valhalla Supermassive", url: "https://valhalladsp.com/shop/reverb/valhalla-supermassive/", why: "Free reverb and delay in one. The plugin everybody ends up installing." },
  { name: "Spitfire LABS", url: "https://labs.spitfireaudio.com/", why: "Properly recorded free instruments — strings, pianos, choirs. Commercially usable." },
  { name: "YouLean Loudness Meter", url: "https://youlean.co/youlean-loudness-meter/", why: "Free LUFS meter so your master lands at the level streaming platforms want." }
];
function renderOnboarding({ force = false } = {}) {
  const panel = $("#onboarding");
  const list = $("#onboarding-list");
  if (!panel || !list) return;
  const dismissed = localStorage.getItem(onboardingStorageKey) === "1";
  if (dismissed && !force) { panel.hidden = true; return; }
  list.innerHTML = STARTER_PICKS.map((pick) => `<li>
    <div>
      <a href="${escapeHtml(pick.url)}" target="_blank" rel="noreferrer noopener">${escapeHtml(pick.name)}</a>
      <p>${escapeHtml(pick.why)}</p>
    </div>
  </li>`).join("");
  panel.hidden = false;
}

/* =====================================================================
   RENDERING
   ===================================================================== */
function allCategories() {
  const seeds = sections.map((section, index) => ({
    id: String(index),
    index,
    title: section.title,
    icon: section.icon,
    eyebrow: section.eyebrow,
    tags: parseTags(section.tags),
    aliases: section.aliases || [],
    verified: section.verified || DEFAULT_VERIFIED,
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
      index: null,
      title: catId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      icon: "◆",
      eyebrow: "COMMUNITY CATEGORY",
      tags: [],
      aliases: ["community", "added by you"],
      verified: null,
      community: true
    });
  }
  return [...seeds, ...extras];
}

function linkMarkup(item) {
  const url = safeUrl(item.address ?? item.url);
  if (!url) return "";
  const ext = fileExtensionOf(url.href);
  const badge = ext ? `<span class="file-badge">FILE · ${escapeHtml(ext.toUpperCase())}</span>` : "";
  const reasons = ["Broken link", "Wrong / outdated info", "Not free as listed", "Spam or inappropriate", "NSFW content", "Other"];
  const removeBtn = !item.isStatic && item.id ? `<button type="button" class="link-remove" data-remove-id="${escapeHtml(item.id)}" title="Remove this link">✕</button>` : "";
  const stats = clickStats(url.href);
  const opens = stats.total ? `<span class="link-clicks">${stats.total} open${stats.total === 1 ? "" : "s"}</span>` : "";
  const dead = isDeadLink(url.href);
  const deadFlag = dead ? `<span class="link-dead-flag">unreachable at last check</span>` : "";
  return `<li class="link-item${dead ? " link-dead" : ""}">
    <div class="link-row">
      <a class="resource-link" href="${url.href}" target="_blank" rel="noreferrer noopener"><span class="link-title">${escapeHtml(item.name)}</span>${badge}${tagMarkup(item.tags || [])}</a>
      <a class="link-url" href="${url.href}" target="_blank" rel="noreferrer noopener">${escapeHtml(url.hostname.replace(/^www\./, ""))}</a>
    </div>
    <div class="link-actions">
      <button type="button" class="report-btn">⚑ Report</button>
      ${removeBtn}
      ${opens}
      ${deadFlag}
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
  const verified = category.community ? null : verifiedFor(category);
  const stamp = verified
    ? `<p class="verified-stamp">CHECKED ${escapeHtml(formatVerifiedDate(verified.checked).toUpperCase())}${verified.dead ? ` · <span class="verified-dead">${verified.dead} DEAD</span>` : ""}</p>`
    : "";
  return `<section class="panel" aria-labelledby="section-${escapeHtml(category.id)}">
    <div class="panel-heading">
      <div><p class="eyebrow">${escapeHtml(category.eyebrow)}</p><h2 id="section-${escapeHtml(category.id)}" class="category-title"><span class="category-symbol" aria-hidden="true">${category.community ? "◆" : escapeHtml(category.icon)}</span><span>${escapeHtml(category.title)}</span></h2></div>
      ${stamp}
    </div>
    <ul class="link-list">${links.join("")}</ul>
  </section>`;
}

function sortItems(items, keyword) {
  const copy = [...items];
  if (sortMode === "az") copy.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortMode === "popular") copy.sort((a, b) => {
    const left = clickStats(a.address), right = clickStats(b.address);
    return right.month - left.month || right.total - left.total || a.name.localeCompare(b.name);
  });
  else if (keyword) copy.sort((a, b) => (b.score || 0) - (a.score || 0));
  return copy;
}

function renderResources(query = searchInput.value) {
  const keyword = String(query || "").trim();
  const categories = allCategories();
  let exactHit = false;
  let totalShown = 0;

  let panels = categories.map((category) => {
    const section = category.index != null ? sections[category.index] : null;
    let items = [];
    if (section) {
      items = section.links.map(([name, address, linkTags]) => ({
        name, address, isStatic: true,
        tags: mergeTags(parseTags(linkTags), category.tags)
      }));
    }
    const shared = store.links
      .filter((link) => String(link.cat) === category.id && safeUrl(link.url))
      .map((link) => ({
        name: link.name, address: link.url, isStatic: false, id: link.id,
        tags: mergeTags(parseTags(link.tags), category.tags)
      }));
    items = [...items, ...shared].filter((item) => matchesFilters(item.tags));

    let categoryScore = 0;
    if (keyword) {
      const categoryHay = normalizeText([category.title, category.eyebrow, category.aliases.join(" "), category.tags.join(" ")].join(" "));
      categoryScore = fuzzyScore(keyword, categoryHay);
      items = items.map((item) => {
        const hay = normalizeText(`${item.name} ${item.address} ${(item.tags || []).join(" ")}`);
        const score = Math.max(fuzzyScore(keyword, hay), categoryScore ? categoryScore * 0.9 : 0);
        return { ...item, score };
      }).filter((item) => item.score > 0);
      if (items.some((item) => item.score >= 1)) exactHit = true;
    }

    items = sortItems(items, keyword);
    totalShown += items.length;
    const best = items.reduce((max, item) => Math.max(max, item.score || 0), 0);
    // A category whose *name* matches ("wallpaper") is worth showing even
    // before anyone has added links to it — that's where you'd add one.
    const nameMatch = Boolean(keyword) && !items.length && categoryScore > 0;
    // Searching "daw" should put the DAWs category above a link that merely
    // contains the letters (tokyodawn.net), so a category-name hit outranks
    // any single link match.
    const rank = categoryScore >= 1 ? 1.1 : Math.max(best, categoryScore * 0.9);
    return { category, items, best, rank, nameMatch };
  }).filter((panel) => panel.items.length || panel.nameMatch);

  // Best match first while searching, category order otherwise.
  if (keyword) panels.sort((a, b) => (b.rank || 0) - (a.rank || 0));

  const summary = $("#filter-summary");
  const clearBtn = $("#clear-filters");
  if (clearBtn) clearBtn.hidden = activeFilters.size === 0;
  if (summary) {
    const bits = [];
    if (activeFilters.size) bits.push([...activeFilters].map((tag) => TAG_LABELS[tag]).join(" + "));
    if (sortMode === "popular") bits.push("most opened first");
    if (sortMode === "az") bits.push("A–Z");
    summary.textContent = bits.length ? `${totalShown} link${totalShown === 1 ? "" : "s"} · ${bits.join(" · ")}` : "";
  }

  if (!panels.length) {
    const hint = activeFilters.size ? "Try clearing a filter" : "Try a different website, tool, or category";
    resourceGrid.innerHTML = `<section class="panel"><p class="empty-state">No matches yet. ${hint}.</p></section>`;
    searchResult.textContent = keyword ? "0 matching resources" : "";
    return;
  }

  const bodyFor = (panel) => panel.items.length
    ? panel.items.map(linkMarkup)
    : [`<li class="link-item"><p class="empty-state">Nothing here yet — add the first link with the form below.</p></li>`];
  const [first, ...rest] = panels;
  const columns = [[], []];
  rest.forEach((panel, index) => columns[index % 2].push(panelMarkup(panel.category, bodyFor(panel))));
  resourceGrid.innerHTML = `${panelMarkup(first.category, bodyFor(first))}<div class="resource-columns">${columns.map((cards) => `<div class="resource-column">${cards.join("")}</div>`).join("")}</div>`;

  if (!keyword) searchResult.textContent = "";
  else if (!totalShown) searchResult.textContent = `Matched the "${panels[0].category.title}" category — no links in it yet`;
  else if (exactHit) searchResult.textContent = `${totalShown} matching resource${totalShown === 1 ? "" : "s"}`;
  else searchResult.textContent = `${totalShown} close match${totalShown === 1 ? "" : "es"} for "${keyword}" — nothing matched exactly`;
}

function removeLink(id) {
  if (!id) return;
  if (!confirm("Remove this link?")) return;
  store.links = store.links.filter((link) => link.id !== id);
  writeJson(storageKey, store.links);
  if (backendMode === "supabase") sb.from("links").delete().eq("id", id).then(() => {});
  else if (backendMode === "json") putJsonDoc(store).catch(() => {});
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
    const report = { id: makeId(), link_name: linkName, link_url: linkUrl, reason, created_at: new Date().toISOString(), local: backendMode === "local" };
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
    // Batch remove all reports for this URL in one write
    const reportsToRemove = store.reports.filter((r) => r.link_url === url);
    store.reports = store.reports.filter((r) => r.link_url !== url);
    if (backendMode === "local") writeJson(reportsStorageKey, store.reports);
    else if (backendMode === "supabase") { for (const r of reportsToRemove) sb.from("reports").delete().eq("id", r.id).then(() => {}); }
    else if (backendMode === "json") putJsonDoc(store).catch(() => {});
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
  if (!html) { container.innerHTML = ""; return; }
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
  renderCategoryOptions();
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

/* =====================================================================
   FILTER CHIPS + SORT
   ===================================================================== */
const filterChips = [...document.querySelectorAll(".filter-chips .chip[data-filter]")];
filterChips.forEach((chip) => {
  chip.setAttribute("aria-pressed", "false");
  chip.addEventListener("click", () => {
    const tag = chip.dataset.filter;
    if (activeFilters.has(tag)) activeFilters.delete(tag);
    else activeFilters.add(tag);
    chip.setAttribute("aria-pressed", String(activeFilters.has(tag)));
    renderResources();
  });
});
const clearFiltersBtn = $("#clear-filters");
if (clearFiltersBtn) clearFiltersBtn.addEventListener("click", () => {
  activeFilters.clear();
  filterChips.forEach((chip) => chip.setAttribute("aria-pressed", "false"));
  renderResources();
});
const sortSelect = $("#sort-mode");
if (sortSelect) sortSelect.addEventListener("change", () => {
  sortMode = sortSelect.value;
  renderResources();
});

/* =====================================================================
   CLICK TRACKING — every open of an outbound link is counted
   ===================================================================== */
let popularTimer;
function trackOutbound(event) {
  const link = event.target.closest("a.resource-link, a.link-url, .popular-list a, .onboarding-list a");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href || href === "#") return;
  const item = link.closest(".link-item");
  const name = item?.querySelector(".link-title")?.textContent?.trim() || link.textContent.trim();
  bumpClick(href, name);
  clearTimeout(popularTimer);
  popularTimer = setTimeout(() => { renderPopular(); renderResources(); }, 400);
}
["click", "auxclick"].forEach((type) => {
  resourceGrid.addEventListener(type, trackOutbound);
  $("#popular-panel")?.addEventListener(type, trackOutbound);
  $("#onboarding")?.addEventListener(type, trackOutbound);
});

/* =====================================================================
   ONBOARDING
   ===================================================================== */
const onboardingDismiss = $("#onboarding-dismiss");
if (onboardingDismiss) onboardingDismiss.addEventListener("click", () => {
  localStorage.setItem(onboardingStorageKey, "1");
  const panel = $("#onboarding");
  if (panel) panel.hidden = true;
});
const showStartersBtn = $("#show-starters");
if (showStartersBtn) showStartersBtn.addEventListener("click", () => {
  localStorage.removeItem(onboardingStorageKey);
  renderOnboarding({ force: true });
  const panel = $("#onboarding");
  if (panel) window.scrollTo({ top: panel.getBoundingClientRect().top + window.scrollY - 20, behavior: "smooth" });
});

/* =====================================================================
   MODAL ACCESSIBILITY — the tools modals are Alpine-driven, so we watch
   for the display flip: focus moves in, Tab is trapped, and focus goes
   back to the card that opened it on close.
   ===================================================================== */
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function initModalAccessibility() {
  document.querySelectorAll(".tools-modal-overlay").forEach((overlay) => {
    if (overlay.dataset.a11yReady === "1") return;
    overlay.dataset.a11yReady = "1";
    const box = overlay.querySelector(".tools-modal-box");
    if (box && !box.hasAttribute("tabindex")) box.setAttribute("tabindex", "-1");

    let lastFocused = null;
    let isOpen = false;

    const focusables = () => [...overlay.querySelectorAll(FOCUSABLE_SELECTOR)].filter((el) => el.offsetParent !== null);
    const onKeydown = (event) => {
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) { event.preventDefault(); box?.focus(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === box)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };

    const sync = () => {
      const visible = overlay.style.display !== "none" && getComputedStyle(overlay).display !== "none";
      if (visible === isOpen) return;
      isOpen = visible;
      if (visible) {
        lastFocused = document.activeElement;
        overlay.addEventListener("keydown", onKeydown);
        const target = overlay.querySelector(".tools-modal-close") || box;
        requestAnimationFrame(() => target?.focus());
      } else {
        overlay.removeEventListener("keydown", onKeydown);
        if (lastFocused && document.contains(lastFocused) && typeof lastFocused.focus === "function") lastFocused.focus();
        lastFocused = null;
      }
    };

    new MutationObserver(sync).observe(overlay, { attributes: true, attributeFilter: ["style", "class", "hidden"] });
    sync();
  });
}
document.addEventListener("alpine:initialized", initModalAccessibility);
setTimeout(initModalAccessibility, 1200);
$("#tab-tools")?.addEventListener("click", () => setTimeout(initModalAccessibility, 100));

/* =====================================================================
   BOOT (additions)
   ===================================================================== */
renderOnboarding();
renderPopular();
updateVerifiedFooter();
loadLinkStatus();
