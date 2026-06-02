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
    desc: "MCP server that fans code review out to multiple LLMs in parallel, diffs their findings, and runs debate rounds.", chips: ["MCP"] },
  { file: "talent", ic: ICON.users, title: "GitHub as a Talent Database", accent: "#484f58",
    desc: "MCP server that searches, scores, and ranks GitHub developers for technical recruiting.", chips: ["MCP"] },
  { file: "localai", ic: ICON.smartphone, title: "Local AI on iPhone", accent: "#484f58",
    desc: "Run Qwen3.5 on your iPhone. No cloud, no API keys, no subscriptions. 100% on-device.", chips: ["iOS", "MLX"] },
  { file: "magnus", ic: ICON.shield, title: "Security scanner", accent: "#484f58",
    desc: "For solo devs. Autonomous vulnerability discovery with fix guides. Self-hosted, model-agnostic.", chips: ["Security"] },
  { file: "qwen", ic: ICON.gitBranch, title: "Fine-tuned Qwen2.5-3B-Instruct", accent: "#484f58",
    desc: "LoRA + MLX on a base M4 Mac Mini (16GB). No cloud, no rented GPUs.", chips: ["MLX", "LoRA"] },
  { file: "equity", ic: ICON.barChart, title: "claude-equity-research", accent: "#484f58",
    desc: "Claude Code plugin for institutional-grade equity research. 400+ stars.", chips: ["Plugin"] }
];

for (const p of projects) writeFileSync(new URL(`${p.file}.svg`, OUT), card(p));

// ---- Professional Journey: career trajectory chart (up & to the right) ----
const mono = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace";
const ACCENT = "#3fb950";
const PTS = [
  { org: "Finance", yr: "earlier", role: "Wellington · Banc of America · Putnam Lovell", lvl: 1.0 },
  { org: "Barclays GI", yr: "'06", role: "Institutional BD: Equity, Fixed Income, Hedge Funds", lvl: 2.1 },
  { org: "Exec Search", yr: "'08", role: "Headhunter during the '08 crisis", lvl: 2.7 },
  { org: "Google", yr: "'09", role: "~12 yrs · most-read Think with Google article", lvl: 4.3 },
  { org: "Mozilla", yr: "'21", role: "Open web advocacy", lvl: 5.3 },
  { org: "Microsoft", yr: "'22", role: "AI/Web3 partnerships", lvl: 6.4 },
  { org: "GitHub", yr: "now", role: "Director, Global AI/Copilot GTM Lead", lvl: 7.7 }
];

// Legend (most-recent first) — full journey text, same as the original timeline
const LEGEND = [
  { org: "GitHub", role: "Director, Global AI/Copilot GTM Lead" },
  { org: "Microsoft", role: "AI/Web3 partnerships — TechCrunch + Blockworks coverage" },
  { org: "Mozilla", role: "Open web advocacy before it was cool. Kind of." },
  { org: "Google", role: "~12 years · most-read Think with Google article; mobile web performance research" },
  { org: "Executive Search", role: "Headhunter during the '08 financial crisis. Now building AI to automate it." },
  { org: "Barclays Global Investors", role: "Institutional BD: Active Equity, Fixed Income, Hedge Funds" },
  { org: "Wellington · Banc of America · Putnam Lovell", role: "Business Analyst · FX Sales & Trading · FIG M&A (London)" }
];

function journeyGraphic() {
  const TW = 860, padL = 60, padR = 52, chartTop = 52, chartBot = 236;
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
      return `
  <circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${last ? 6 : 4}" fill="${last ? ACCENT : C.bg}" stroke="${ACCENT}" stroke-width="2"/>
  <text x="${c.x.toFixed(1)}" y="${(c.y - 13).toFixed(1)}" font-size="12.5" font-weight="700" fill="${C.title}" font-family="${C.sans}" text-anchor="middle">${esc(c.org)}</text>
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

console.log("generated", projects.length, "cards + journey chart");
