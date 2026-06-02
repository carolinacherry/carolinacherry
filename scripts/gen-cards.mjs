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
  barChart: '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="13" y="7" width="3" height="10"/>'
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
  { file: "entopiq", icon: "🌱", title: "Entopiq", accent: "#3fb950",
    desc: "Video-first talent discovery — résumés become 90-second videos with AI matching and an AI Headhunter.", chips: ["Video", "AI matching"] },
  { file: "boris-proj", icon: "✴️", title: "How Boris Uses Claude Code", accent: "#d2a8ff",
    desc: "Memorialized Boris Cherny's 13-part thread on how he actually uses CC. Terminal aesthetic, built with the tool.", chips: ["Skill", "shadcn registry"] },
  { file: "ralph", icon: "⚽", title: "Ralph FC", accent: "#58a6ff",
    desc: "A Simpsons-themed UI running Claude Code agents as an 11-agent soccer team. Ralph Wiggum Mode loops until done.", chips: ["Agents", "Claude Code"] },
  { file: "skarnfall", icon: "🦞", title: "Skarnfall", accent: "#f78166",
    desc: "An agent-native talent marketplace — AI agents register, bid, and get paid. The API is the product.", chips: ["FastAPI", "PostgreSQL", "OAuth"] },
  { file: "kalshi", icon: "📈", title: "Kalshi Edge Bot", accent: "#2dd4bf",
    desc: "Trades mispriced contracts on Kalshi prediction markets, off research over 300K+ trades. Auto-trade, live P&L.", chips: ["Trading", "Backtesting"] },
  { file: "jfu", icon: "🔥", title: "Just Fucking Use", accent: "#f85149",
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

console.log("generated", projects.length, "cards");
