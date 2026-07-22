// Generates bespoke SVG cards + a journey timeline for the profile README.
// No HTML tables — full design control, renders cleanly on GitHub.
// Run: node scripts/gen-cards.mjs
import { writeFileSync, mkdirSync } from "fs";

const OUT = new URL("../assets/cards/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const C = {
  bg: "#0d1117",
  border: "#21262d",
  title: "#e6edf3",
  desc: "#8b949e",
  icon: "#8b949e",
  chipText: "#adbac7",
  chipBorder: "#30363d",
  sans: "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,Arial,sans-serif"
};

// Grey monochrome line icons (Lucide, MIT) for Open Source cards.
const ICON = {
  shuffle: '<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  gitBranch: '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  barChart: '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="13" y="7" width="3" height="10"/>',
  video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
  bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
  network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
  trendingUp: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'
};

const W = 480, PAD = 24, STRIPE = 4;
const INNER = W - PAD * 2 - 14; // text width after stripe + paddings
const CHAR = 7.1;               // ~px per char at 13.5px sans

function wrap(text, max = Math.floor(INNER / CHAR)) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) { lines.push(line.trim()); line = w; }
    else line += " " + w;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function card({ ic, title, desc, chips, accent, link }) {
  const lines = wrap(desc).slice(0, 2);
  const titleY = 46;
  const descTop = 76;
  const lineH = 21;
  const chipY = 122;   // fixed so chips align across all cards in the grid
  const H = 160;       // uniform height → clean 2-up grid, no stagger
  const x0 = PAD + 14;

  const descSvg = lines
    .map((l, i) => `<text x="${x0}" y="${descTop + i * lineH}" font-size="13.5" fill="${C.desc}" font-family="${C.sans}">${esc(l)}</text>`)
    .join("\n  ");

  let cx = x0;
  const chipSvg = chips
    .map((t) => {
      const w = t.length * 7 + 20;
      const r = `<g>
    <rect x="${cx}" y="${chipY}" width="${w}" height="24" rx="12" fill="none" stroke="${C.chipBorder}" stroke-width="1"/>
    <text x="${cx + w / 2}" y="${chipY + 16}" font-size="11.5" fill="${C.chipText}" font-family="${C.sans}" text-anchor="middle">${esc(t)}</text>
  </g>`;
      cx += w + 8;
      return r;
    })
    .join("\n  ");

  const iconSvg = ic
    ? `<g transform="translate(${x0},${titleY - 17}) scale(0.8)" fill="none" stroke="${C.icon}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ic}</g>`
    : "";
  const titleX = ic ? x0 + 28 : x0;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(title)}">
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <rect x="0" y="14" width="${STRIPE}" height="${H - 28}" rx="2" fill="${accent}"/>
  ${iconSvg}
  <text x="${titleX}" y="${titleY}" font-size="17" font-weight="700" fill="${C.title}" font-family="${C.sans}">${esc(title)}</text>
  ${descSvg}
  ${chipSvg}
</svg>\n`;
}

const projects = [
  { file: "entopiq", ic: ICON.video, title: "Entopiq", accent: "#484f58",
    desc: "Video-first talent discovery — résumés become 90-second videos with AI matching and an AI Headhunter.", chips: ["Video", "AI matching"] },
  { file: "boris-proj", ic: ICON.terminal, title: "How Boris Uses Claude Code", accent: "#484f58",
    desc: "Memorialized Boris Cherny's 13-part thread on how he actually uses CC. Terminal aesthetic, built with the tool.", chips: ["Skill", "shadcn registry"] },
  { file: "ralph", ic: ICON.bot, title: "Ralph FC", accent: "#484f58",
    desc: "A Simpsons-themed UI running Claude Code agents as an 11-agent soccer team. Ralph Wiggum Mode loops until done.", chips: ["Agents", "Claude Code"] },
  { file: "skarnfall", ic: ICON.network, title: "Skarnfall", accent: "#484f58",
    desc: "An agent-native talent marketplace — AI agents register, bid, and get paid. The API is the product.", chips: ["FastAPI", "PostgreSQL", "OAuth"] },
  { file: "kalshi", ic: ICON.trendingUp, title: "Kalshi Edge Bot", accent: "#484f58",
    desc: "Trades mispriced contracts on Kalshi prediction markets, off research over 300K+ trades. Auto-trade, live P&L.", chips: ["Trading", "Backtesting"] },
  { file: "jfu", ic: ICON.flame, title: "Just Fucking Use", accent: "#484f58",
    desc: "A collection of no-nonsense landing pages for developers who need to stop overthinking their tools.", chips: ["8 sites"] },
  // open source
  { file: "compare", ic: ICON.shuffle, title: "Multi-Model Code Review", accent: "#484f58",
    desc: "MCP server that fans code review out to multiple LLMs in parallel, diffs their findings, and runs debate rounds.", chips: ["MCP", "Code Review"] },
  { file: "talent", ic: ICON.users, title: "GitHub as a Talent Database", accent: "#484f58",
    desc: "MCP server that searches, scores, and ranks GitHub developers for technical recruiting.", chips: ["MCP", "Technical Sourcing"] },
  { file: "localai", ic: ICON.smartphone, title: "Local AI on iPhone", accent: "#484f58",
    desc: "Run Qwen3.5 on your iPhone. No cloud, no API keys, no subscriptions. 100% on-device.", chips: ["iOS", "MLX"] },
  { file: "magnus", ic: ICON.shield, title: "Security scanner", accent: "#484f58",
    desc: "For solo devs. Autonomous vulnerability discovery with fix guides. Self-hosted, model-agnostic.", chips: ["Security", "Self-hosted"] },
  { file: "qwen", ic: ICON.gitBranch, title: "Fine-tuned Qwen2.5-3B-Instruct", accent: "#484f58",
    desc: "LoRA + MLX on a base M4 Mac Mini (16GB). No cloud, no rented GPUs.", chips: ["MLX", "LoRA"] },
  { file: "equity", ic: ICON.barChart, title: "claude-equity-research", accent: "#484f58",
    desc: "Claude Code plugin for institutional-grade equity research. 500+ stars.", chips: ["Plugin", "Equity Research"] }
];

for (const p of projects) writeFileSync(new URL(`${p.file}.svg`, OUT), card(p));

// ---- Professional Journey: career trajectory chart (up & to the right) ----
const mono = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace";
const ACCENT = "#3fb950";
const PTS = [
  { org: "Internships", yr: "earlier", logo: "finance", lvl: 1.0 },
  { org: "Barclays", yr: "'06", logo: "barclays", lvl: 2.1 },
  { org: "Exec Search", yr: "'08", logo: "exec", lvl: 2.7 },
  { org: "Google", yr: "'09", logo: "google", lvl: 4.3 },
  { org: "Mozilla", yr: "'21", logo: "mozilla", lvl: 5.3 },
  { org: "Microsoft", yr: "'22", logo: "microsoft", lvl: 6.4 },
  { org: "GitHub", yr: "now", logo: "github", lvl: 7.7 }
];

// Monochrome marks rendered above each point. Brand glyphs (CC0 artwork from
// simple-icons) identify past employers; line icons stand in for grouped roles.
const LOGO = {
  finance: { stroke: true, m: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>' },
  exec: { stroke: true, m: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>' },
  microsoft: { stroke: false, m: '<rect x="1" y="1" width="10" height="10"/><rect x="13" y="1" width="10" height="10"/><rect x="1" y="13" width="10" height="10"/><rect x="13" y="13" width="10" height="10"/>' },
  google: { stroke: false, m: '<path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>' },
  mozilla: { text: "moz://a" },
  github: { stroke: false, m: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>' },
  barclays: { stroke: false, m: '<path d="M21.043 3.629a3.235 3.235 0 0 0-1.048-.54 3.076 3.076 0 0 0-.937-.144h-.046c-.413.006-1.184.105-1.701.71a1.138 1.138 0 0 0-.226 1.023.9.9 0 0 0 .555.63s.088.032.228.058c-.04.078-.136.214-.136.214-.179.265-.576.612-1.668.612h-.063c-.578-.038-1.056-.189-1.616-.915-.347-.45-.523-1.207-.549-2.452-.022-.624-.107-1.165-.256-1.6-.1-.29-.333-.596-.557-.742a2.55 2.55 0 0 0-.694-.336c-.373-.12-.848-.14-1.204-.146-.462-.01-.717.096-.878.292-.027.033-.032.05-.068.046-.084-.006-.272-.006-.328-.006-.264 0-.498.043-.721.09-.47.1-.761.295-1.019.503-.12.095-.347.365-.399.653a.76.76 0 0 0 .097.578c.14-.148.374-.264.816-.266.493-.002 1.169.224 1.406.608.336.547.27.99.199 1.517-.183 1.347-.68 2.048-1.783 2.203-.191.026-.38.04-.56.04-.776 0-1.34-.248-1.63-.716a.71.71 0 0 1-.088-.168s.087-.021.163-.056c.294-.14.514-.344.594-.661.09-.353.004-.728-.23-1.007-.415-.47-.991-.708-1.713-.708-.4 0-.755.076-.982.14-.908.256-1.633.947-2.214 2.112-.412.824-.7 1.912-.81 3.067-.11 1.13-.056 2.085.019 2.949.124 1.437.363 2.298.708 3.22a15.68 15.68 0 0 0 1.609 3.19c.09-.094.15-.161.308-.318.188-.19.724-.893.876-1.11.19-.27.51-.779.664-1.147l.15.119c.16.127.252.348.249.592-.003.215-.053.464-.184.922a8.703 8.703 0 0 1-.784 1.818c-.189.341-.27.508-.199.584.015.015.038.03.06.026.116 0 .34-.117.585-.304.222-.17.813-.672 1.527-1.675a15.449 15.449 0 0 0 1.452-2.521c.12.046.255.101.317.226a.92.92 0 0 1 .08.563c-.065.539-.379 1.353-.63 1.94-.425.998-1.208 2.115-1.788 2.877-.022.03-.163.197-.186.227.9.792 1.944 1.555 3.007 2.136.725.408 2.203 1.162 3.183 1.424.98-.262 2.458-1.016 3.184-1.424a17.063 17.063 0 0 0 3.003-2.134c-.05-.076-.13-.158-.183-.23-.582-.763-1.365-1.881-1.79-2.875-.25-.59-.563-1.405-.628-1.94-.028-.221-.002-.417.08-.565.033-.098.274-.218.317-.226.405.884.887 1.73 1.452 2.522.715 1.003 1.306 1.506 1.527 1.674.248.191.467.304.586.304a.07.07 0 0 0 .044-.012c.094-.069.017-.234-.183-.594a9.003 9.003 0 0 1-.786-1.822c-.13-.456-.18-.706-.182-.92-.004-.246.088-.466.248-.594l.15-.118c.155.373.5.919.665 1.147.15.216.685.919.876 1.11.156.158.22.222.308.32a15.672 15.672 0 0 0 1.609-3.19c.343-.923.583-1.784.707-3.222.075-.86.128-1.81.02-2.948-.101-1.116-.404-2.264-.81-3.068-.249-.49-.605-1.112-1.171-1.566z"/>' }
};

// Legend (most-recent first) — full journey text, same as the original timeline
const LEGEND = [
  { org: "GitHub", role: "Director, Global AI/Copilot GTM Lead" },
  { org: "Microsoft", role: "AI/Web3 partnerships — TechCrunch + Blockworks coverage" },
  { org: "Mozilla", role: "Open web advocacy before it was cool. Kind of." },
  { org: "Google", role: "~12 years · most-read Think with Google article; mobile web performance research" },
  { org: "Executive Search", role: "Headhunter during the '08 financial crisis. Now building AI to automate it." },
  { org: "Barclays Global Investors", role: "Institutional BD: Active Equity, Fixed Income, Hedge Funds" },
  { org: "Wellington Management", role: "Business Analyst" },
  { org: "Banc of America Securities", role: "Summer Analyst · FX Sales & Trading" },
  { org: "Putnam Lovell Securities", role: "Summer Analyst · FIG M&A" }
];

function journeyGraphic() {
  const TW = 860, padL = 60, padR = 52, chartTop = 88, chartBot = 248;
  const n = PTS.length, plotW = TW - padL - padR;
  const min = 1, max = 7.7;
  const X = (i) => padL + i * (plotW / (n - 1));
  const Y = (l) => chartBot - ((l - min) / (max - min)) * (chartBot - chartTop);
  const co = PTS.map((p, i) => ({ ...p, x: X(i), y: Y(p.lvl) }));

  const line = co.map((c, i) => `${i ? "L" : "M"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const area = `M${co[0].x.toFixed(1)},${chartBot} ` + co.map((c) => `L${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ") + ` L${co[n - 1].x.toFixed(1)},${chartBot} Z`;
  const marks = co
    .map((c, i) => {
      const last = i === n - 1;
      const lg = LOGO[c.logo];
      const ly = c.y - 40;
      const logoSvg = !lg
        ? ""
        : lg.text
        ? `\n  <text x="${c.x.toFixed(1)}" y="${(ly + 5).toFixed(1)}" font-size="15" font-weight="700" fill="#c9d1d9" font-family="${C.sans}" text-anchor="middle">${esc(lg.text)}</text>`
        : `\n  <g transform="translate(${(c.x - 9).toFixed(1)},${(ly - 9).toFixed(1)}) scale(0.75)" ${lg.stroke ? 'fill="none" stroke="#c9d1d9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' : 'fill="#c9d1d9"'}>${lg.m}</g>`;
      return `${logoSvg}
  <circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${last ? 6 : 4}" fill="${last ? ACCENT : C.bg}" stroke="${ACCENT}" stroke-width="2"/>
  <text x="${c.x.toFixed(1)}" y="${(c.y - 16).toFixed(1)}" font-size="12.5" font-weight="700" fill="${C.title}" font-family="${C.sans}" text-anchor="middle">${esc(c.org)}</text>
  <text x="${c.x.toFixed(1)}" y="${chartBot + 21}" font-size="11" fill="${C.desc}" font-family="${mono}" text-anchor="middle">${esc(c.yr)}</text>`;
    })
    .join("");

  const dividerY = chartBot + 44;
  const legendTop = dividerY + 28;
  const rowH = 28;
  const legend = LEGEND
    .map((e, i) => {
      const ly = legendTop + i * rowH;
      return `
  <circle cx="${padL + 3}" cy="${ly - 4}" r="3" fill="${ACCENT}"/>
  <text x="${padL + 16}" y="${ly}" font-size="12.5" font-family="${C.sans}"><tspan font-weight="700" fill="${C.title}">${esc(e.org)}</tspan><tspan fill="${C.desc}">&#160;&#160;—&#160;&#160;${esc(e.role)}</tspan></text>`;
    })
    .join("");
  const H = legendTop + (LEGEND.length - 1) * rowH + 24;

  return `<svg width="${TW}" height="${H}" viewBox="0 0 ${TW} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Career trajectory — up and to the right">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.32"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="${TW - 2}" height="${H - 2}" rx="14" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <line x1="${padL - 10}" y1="${chartBot}" x2="${TW - padR + 10}" y2="${chartBot}" stroke="${C.chipBorder}" stroke-width="1"/>
  <path d="${area}" fill="url(#grad)"/>
  <path d="${line}" fill="none" stroke="${ACCENT}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${marks}
  <line x1="${padL}" y1="${dividerY}" x2="${TW - padR}" y2="${dividerY}" stroke="${C.border}" stroke-width="1"/>${legend}
</svg>\n`;
}
writeFileSync(new URL("journey.svg", OUT), journeyGraphic());

// ---- Around the world: real coastline basemap + chronological route ----
// Natural Earth 110m land (public domain) fetched at build, projected
// equirectangular into a North-Atlantic window so pins land on true coasts.
// One pin per unique place; ROUTE is the chronological path and may revisit a
// city (e.g. out to SF and back to Boston). Label offsets (lab) hand-tuned so
// the tight UK/Ireland cluster doesn't collide.
let LAND = null;
try {
  const r = await fetch("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson");
  if (r.ok) LAND = await r.json();
} catch { /* offline → basemap omitted, pins + route still render */ }

const GEO = {
  oslo:    { city: "Oslo", region: "Norway", lat: 59.91, lon: 10.75, kind: "born", note: "born & raised", lab: { dx: 13, dy: 4, anchor: "start" } },
  glasgow: { city: "Glasgow", region: "Scotland", lat: 55.86, lon: -4.25, kind: "lived", note: "lived & studied · 2000–2004", lab: { dx: -11, dy: -9, anchor: "end" } },
  london:  { city: "London", region: "UK", lat: 51.51, lon: -0.13, kind: "worked", note: "summer analyst · 2003 & 2004", lab: { dx: 12, dy: 11, anchor: "start" } },
  boston:  { city: "Boston", region: "MA", lat: 42.36, lon: -71.06, kind: "lived", note: "studied, Barclays Global Investors & exec search · 2005–2009", lab: { dx: 9, dy: -12, anchor: "start" } },
  sf:      { city: "San Francisco", region: "CA", lat: 37.77, lon: -122.42, kind: "worked", note: "Barclays Global Investors · 2006", lab: { dx: 12, dy: 4, anchor: "start" } },
  dublin:  { city: "Dublin", region: "Ireland", lat: 53.35, lon: -6.26, kind: "worked", note: "Google · 2009–2010", lab: { dx: -11, dy: 5, anchor: "end" } },
  chicago: { city: "Chicago", region: "IL", lat: 41.88, lon: -87.63, kind: "lived", note: "Google, then Mozilla · 2010–2021", lab: { dx: 0, dy: -15, anchor: "middle" } },
  raleigh: { city: "Raleigh", region: "NC", lat: 35.78, lon: -78.64, kind: "lived", note: "Mozilla → Microsoft → GitHub · 2021–present", lab: { dx: 0, dy: 22, anchor: "middle" } }
};
const ORDER = ["oslo", "glasgow", "london", "boston", "sf", "dublin", "chicago", "raleigh"]; // legend, top→bottom
const ROUTE = ["oslo", "glasgow", "london", "boston", "sf", "boston", "dublin", "chicago", "raleigh"]; // map path, chronological

function geoGraphic() {
  const TW = 860, mapX0 = 18, mapX1 = TW - 18, mapTop = 52;
  const mapW = mapX1 - mapX0;
  // North-Atlantic window (degrees): North America → Scandinavia.
  const W0 = -133, W1 = 26, N0 = 20, N1 = 71;
  const ppd = mapW / (W1 - W0);            // plate carrée: equal px/degree both axes
  const mapH = Math.round((N1 - N0) * ppd);
  const mapBot = mapTop + mapH;
  const X = (lon) => mapX0 + ((lon - W0) / (W1 - W0)) * mapW;
  const Y = (lat) => mapTop + ((N1 - lat) / (N1 - N0)) * mapH;
  const P = {};
  for (const k of ORDER) P[k] = { ...GEO[k], x: X(GEO[k].lon), y: Y(GEO[k].lat) };

  // Coastline basemap — project every land ring that touches the window.
  let landPath = "";
  if (LAND) {
    const inWin = (poly) => poly.some((ring) => ring.some(([lo, la]) => lo >= W0 - 5 && lo <= W1 + 5 && la >= N0 - 5 && la <= N1 + 5));
    const ring = (r) => r.map(([lo, la], i) => `${i ? "L" : "M"}${X(lo).toFixed(1)},${Y(la).toFixed(1)}`).join("") + "Z";
    for (const f of LAND.features) {
      const g = f.geometry; if (!g) continue;
      const polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
      for (const poly of polys) if (inWin(poly)) for (const r of poly) landPath += ring(r);
    }
  }

  // Migration route: gentle arcs between consecutive stops (flight-path feel).
  let route = "";
  for (let i = 1; i < ROUTE.length; i++) {
    const a = P[ROUTE[i - 1]], b = P[ROUTE[i]];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    const lift = Math.min(len * 0.09, 20);
    const cxp = mx + (dy / len) * lift, cyp = my - (dx / len) * lift;
    route += `<path d="M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${cxp.toFixed(1)},${cyp.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}" fill="none" stroke="${ACCENT}" stroke-width="1.7" stroke-linecap="round" stroke-opacity="0.85"/>`;
  }

  // Numbered waypoints (1–8 = chronological order) so the trajectory reads
  // regardless of geography. born (Oslo, #1) keeps a faint origin ring.
  // City labels get a bg halo (paint-order) to stay legible over land.
  const R = 8.5;
  const pins = ORDER
    .map((k, i) => {
      const c = P[k], lab = c.lab;
      const outer = c.kind === "born"
        ? `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${R + 3}" fill="none" stroke="${ACCENT}" stroke-width="1.5" stroke-opacity="0.6"/>`
        : "";
      return `${outer}<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${R}" fill="${ACCENT}" stroke="${C.bg}" stroke-width="1.5"/>
  <text x="${c.x.toFixed(1)}" y="${(c.y + 3.5).toFixed(1)}" font-size="11" font-weight="700" fill="#0b160f" font-family="${C.sans}" text-anchor="middle">${i + 1}</text>
  <text x="${(c.x + lab.dx).toFixed(1)}" y="${(c.y + lab.dy).toFixed(1)}" font-size="12.5" font-weight="700" fill="${C.title}" font-family="${C.sans}" text-anchor="${lab.anchor}" stroke="${C.bg}" stroke-width="3" paint-order="stroke">${esc(c.city)}</text>`;
    })
    .join("\n  ");

  // Legend strip: numbered badge + City, Region — note.
  const dividerY = mapBot + 28;
  const legendTop = dividerY + 26;
  const rowH = 28;
  const legend = ORDER
    .map((k, i) => {
      const e = GEO[k];
      const ly = legendTop + i * rowH;
      return `
  <circle cx="${mapX0 + 10}" cy="${ly - 4}" r="8" fill="${ACCENT}"/>
  <text x="${mapX0 + 10}" y="${ly - 0.5}" font-size="10.5" font-weight="700" fill="#0b160f" font-family="${C.sans}" text-anchor="middle">${i + 1}</text>
  <text x="${mapX0 + 26}" y="${ly}" font-size="12.5" font-family="${C.sans}"><tspan font-weight="700" fill="${C.title}">${esc(e.city)}, ${esc(e.region)}</tspan><tspan fill="${C.desc}">&#160;&#160;—&#160;&#160;${esc(e.note)}</tspan></text>`;
    })
    .join("");

  const H = legendTop + (ORDER.length - 1) * rowH + 24;

  return `<svg width="${TW}" height="${H}" viewBox="0 0 ${TW} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Places I've lived and worked, across two continents — born in Oslo, now in the US">
  <defs><clipPath id="geomap"><rect x="${mapX0}" y="${mapTop}" width="${mapW}" height="${mapH}" rx="8"/></clipPath></defs>
  <rect x="1" y="1" width="${TW - 2}" height="${H - 2}" rx="14" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="${mapX1}" y="40" font-size="12.5" fill="${C.desc}" font-family="${C.sans}" text-anchor="end">US&#8211;Norwegian dual citizen</text>
  <g clip-path="url(#geomap)">
    <rect x="${mapX0}" y="${mapTop}" width="${mapW}" height="${mapH}" rx="8" fill="#0b1f17" fill-opacity="0.22"/>
    <path d="${landPath}" fill="#1b2230" stroke="#2f3a2f" stroke-width="0.6"/>
  </g>
  ${route}
  ${pins}
  <line x1="${mapX0}" y1="${dividerY}" x2="${mapX1}" y2="${dividerY}" stroke="${C.border}" stroke-width="1"/>${legend}
</svg>\n`;
}
writeFileSync(new URL("geo.svg", OUT), geoGraphic());

// ---- Footer connect chips (grey, not GitHub link-blue) ----
const LINKEDIN_PATH = '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>';
const X_PATH = '<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>';

function chip(text, markPath, color = "#c9d1d9") {
  const fs = 13.5, H = 22, padX = 4, markW = markPath ? 15 : 0, gap = markPath ? 7 : 0;
  const tw = text.length * 7.1;
  const W = Math.round(padX + markW + gap + tw + padX);
  const tx = padX + markW + gap;
  const markSvg = markPath ? `<g transform="translate(${padX},4) scale(${(15 / 24).toFixed(4)})" fill="${color}">${markPath}</g>` : "";
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(text)}">${markSvg}<text x="${tx}" y="16" font-size="${fs}" fill="${color}" font-family="${C.sans}">${esc(text)}</text></svg>\n`;
}
writeFileSync(new URL("link-web.svg", OUT), chip("danielan.io", null));
writeFileSync(new URL("link-linkedin.svg", OUT), chip("LinkedIn", LINKEDIN_PATH));
writeFileSync(new URL("link-x.svg", OUT), chip("@Daniel_An23", X_PATH));
writeFileSync(new URL("link-techcrunch.svg", OUT), chip("TechCrunch", null));
writeFileSync(new URL("link-blockworks.svg", OUT), chip("Blockworks", null));

// ---- Hero subtitle: two single-line SVGs so each can link separately ----
function subtitleLine(role, company) {
  const fs = 15, x = 3, H = 26;
  const W = Math.round(x + (role + "    " + company).length * 8 + 8);
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(role)} · ${esc(company)}"><text x="${x}" y="18" font-size="${fs}" font-family="${C.sans}"><tspan fill="#8b949e">${esc(role)}</tspan><tspan fill="#6e7681">&#160;&#160;·&#160;&#160;</tspan><tspan fill="#e6edf3" font-weight="600">${esc(company)}</tspan></text></svg>\n`;
}
writeFileSync(new URL("subtitle-role.svg", OUT), subtitleLine("Director, Global AI/Copilot GTM Lead", "GitHub"));
writeFileSync(new URL("subtitle-founder.svg", OUT), subtitleLine("Founder & CEO", "Entopiq"));

// ---- Tech stack (monochrome logo pills, grouped) ----
const STACK = [
  { label: "AGENTS & CLI", items: [["Claude Code", "anthropic"], ["Copilot CLI", "githubcopilot"], ["Gemini CLI", "googlegemini"], ["Cursor", "cursor"], ["MCP", null]] },
  { label: "MODELS & APIs", items: [["Anthropic", "anthropic"], ["OpenAI", "openai"], ["Gemini", "googlegemini"], ["MLX", null], ["Ollama", "ollama"]] },
  { label: "LANGUAGES & BACKEND", items: [["Python", "python"], ["TypeScript", "typescript"], ["Swift", "swift"], ["FastAPI", "fastapi"]] },
  { label: "DATA & DEPLOY", items: [["PostgreSQL", "postgresql"], ["Supabase", "supabase"], ["Netlify", "netlify"], ["Vercel", "vercel"]] },
  { label: "DEV & OPS", items: [["VS Code", null], ["Docker", "docker"], ["Playwright", null], ["Sentry", "sentry"], ["GitHub", "github"]] }
];

const stackPaths = {};
const slugs = [...new Set(STACK.flatMap((g) => g.items.map((i) => i[1])).filter(Boolean))];
for (const s of slugs) {
  try {
    const r = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${s}.svg`);
    if (r.ok) {
      const m = (await r.text()).match(/ d="([^"]+)"/);
      if (m) stackPaths[s] = m[1];
    }
  } catch { /* fall back to text-only pill */ }
}

// simple-icons v13 predates some logos (e.g. Cursor); inline their monochrome paths as a fallback.
const EXTRA_PATHS = {
  cursor: "M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"
};
for (const [s, d] of Object.entries(EXTRA_PATHS)) if (!stackPaths[s]) stackPaths[s] = d;

function stackGraphic() {
  const W = 860, fs = 12.5, pillH = 26, gap = 8, lineGap = 10, groupGap = 24, labelGap = 26, startX = 26, maxX = W - 26;
  let y = 28, body = "";
  for (const g of STACK) {
    body += `\n  <text x="${startX}" y="${y}" font-size="10.5" font-weight="700" letter-spacing="1.2" fill="#6e7681" font-family="${C.sans}">${esc(g.label)}</text>`;
    y += labelGap;
    let x = startX;
    for (const [label, slug] of g.items) {
      const hasLogo = slug && stackPaths[slug];
      const logoW = hasLogo ? 15 : 0, innerGap = hasLogo ? 6 : 0;
      const pw = Math.round(11 + logoW + innerGap + label.length * 7 + 11);
      if (x + pw > maxX) { x = startX; y += pillH + lineGap; }
      const logoSvg = hasLogo ? `<g transform="translate(${x + 11},${y + 5}) scale(0.625)" fill="#c9d1d9"><path d="${stackPaths[slug]}"/></g>` : "";
      body += `\n  <rect x="${x}" y="${y}" width="${pw}" height="${pillH}" rx="13" fill="none" stroke="${C.chipBorder}" stroke-width="1"/>${logoSvg}<text x="${x + 11 + logoW + innerGap}" y="${y + 17}" font-size="${fs}" fill="#c9d1d9" font-family="${C.sans}">${esc(label)}</text>`;
      x += pw + gap;
    }
    y += pillH + groupGap;
  }
  const H = y - groupGap + 22;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tech stack">
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>${body}
</svg>\n`;
}
writeFileSync(new URL("stack.svg", OUT), stackGraphic());

console.log("generated", projects.length, "cards + journey + chips + subtitle + stack (" + Object.keys(stackPaths).length + " logos)");
