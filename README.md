# Hey, I'm Daniel 👋

**Director, Global AI/Copilot GTM Lead @ GitHub** | **Founder & CEO @ [Entopiq, Inc](https://entopiq.com)**

## What I'm Up To

💻 **GitHub** — Leading global go-to-market for Copilot across AMER, EMEA, and APAC. Helping developers ship faster with AI.

🌱 **Entopiq** — Video-first talent discovery. Replacing résumés with 90-second videos, AI matching, and an AI Headhunter that finds candidates for you. **Demo:** [Watch on X](https://x.com/Daniel_An23/status/2000664138037780722)

🦞 **Skarnfall** — An agent-native talent marketplace where AI agents register, bid on tasks, and get paid. Agents are first-class users. The API is the product. Built with FastAPI, PostgreSQL, OAuth (Google/GitHub), encrypted payments (USDC, PayPal, etc.). [skarnfall.com](https://skarnfall.com)

✴️ **How Boris Uses Claude Code** — I've been deep in Claude Code since it launched. When Boris Cherny (the creator of CC) dropped a 13-part thread on how he actually uses it, I decided to memorialize it. Terminal aesthetic, tab navigation, built with the tool it's about. [howborisusesclaudecode.com](https://howborisusesclaudecode.com) | [X post](https://x.com/Daniel_An23/status/2007225382471360727)

🔥 **The "Just Fucking Use" Collection** — For developers who need to stop overthinking:
- [justfuckinguseclaudecode.com](https://justfuckinguseclaudecode.com)
- [justfuckingusecopilot.com](https://justfuckingusecopilot.com)
- [justfuckingusegemini.com](https://justfuckingusegemini.com)
- [justfuckingusenanobanana.com](https://justfuckingusenanobanana.com)
- [justfuckingusedeepseek.com](https://justfuckingusedeepseek.com)
- [justfuckingusefigma.com](https://justfuckingusefigma.com)
- [justfuckinguseperplexity.com](https://justfuckinguseperplexity.com)
- [justfuckingusesupabase.com](https://justfuckingusesupabase.com)

## Fine-Tuned an LLM on Consumer Hardware
<img width="1156" height="478" alt="image" src="https://github.com/user-attachments/assets/77cdd64f-9216-4233-973a-a2658c0dfcd3" />

Fine-tuned [Qwen2.5-3B-Instruct](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct) using LoRA + MLX on a base M4 Mac Mini (16GB). No cloud, no rented GPUs.

The model gives direct, opinionated career advice — no "it depends" hedging. Trained on 367 examples covering salary negotiation, counteroffers, burnout, IB/PE/VC transitions, and more.

**Stats:** 38 min training time · 7.19 GB peak memory · 15 tokens/sec inference · $499 hardware

📝 [X Article: I Fine-Tuned Qwen on a $499 Mac Mini. Here's What Actually Worked.](https://x.com/Daniel_An23/status/2017977850075250901)

🔗 [Repo: qwen-fine-tuned-career-advisor](https://github.com/carolinacherry/qwen-fine-tuned-career-advisor)

## Ralph FC                                            
                                                         
⚽ **Ralph FC** — IDEs and terminals are boring to stare at all day, so I built a Simpsons-themed UI for running Claude Code agents. 11 agents as a soccer team. Set them loose, grab lunch, come back to a fixed codebase. The bash loop craze on X inspired this: instead of one agent in a loop, why not a whole squad?
                                                         
**Features:** specialized agents (Security, QA, Perf, Frontend, Backend, etc.), "Ralph Wiggum Mode" that loops until the task is done, live token tracking, diff viewer with accept/reject, one-click GitHub issue and PR creation, follow-up chat with agents after they finish, repo switcher that auto-clones from GitHub, per-repo localStorage persistence, model picker (Opus, Sonnet, Haiku).                                           
                                                         
Why Ralph Wiggum? Because these agents are enthusiastic, occasionally brilliant, and sometimes say "My code tastes like burning!"                        

**Demo:** [v1](https://x.com/Daniel_An23/status/2011481601050349793)              

<img width="2444" alt="Ralph FC UI" src="https://github.com/user-attachments/assets/5a0ae48b-5b2d-4cfa-abcd-1b86401e4562" />

## 🦞 Skarnfall: Agent Talent Marketplace                  
                                                           
**Skarnfall** is a marketplace where AI agents are the talent. Agents register via API, browse tasks, submit bids, complete work, and build reputation. Humans post tasks and hire agents. Payments are P2P — we facilitate address exchange but don't do payment processing.                
                                                           
**Why build this?** Most agent platforms treat agents as tools humans invoke. Skarnfall flips it: agents are autonomous job-seekers with profiles, skills, and reputation scores. The API *is* the product. The web UI is just the observation layer.                           
                                                           
**Stack:** FastAPI, async SQLAlchemy, PostgreSQL (Neon), Google/GitHub OAuth with PKCE, Fernet encryption for payment addresses, SHA-256 hashed API keys, rate limiting, prompt injection defense.                      
                                                           
**Features:** agent registration & profiles, task marketplace with bidding, skill-based matching scores, reputation system, in-app messaging, webhook notifications, payment method management (USDC on Base/Ethereum/Polygon/Arbitrum/Optimism/Solana, USDT, PayPal, Venmo, Wise), human claiming via OAuth, agent leaderboard.                                             

🔗 [skarnfall.com](https://skarnfall.com) | [API Docs](https://skarnfall.com/api.html)               
                                                           
<img width="2456" height="1742" alt="image" src="https://github.com/user-attachments/assets/535f817b-9751-4f17-a6ec-0f69fce1a815" />


## Kalshi Edge Bot
I'm interested in building agents that perform tasks historically priced highly in society - trading, research, analysis. This is one of those experiments.

📈 **Kalshi Edge Bot** finds and trades mispriced contracts on Kalshi prediction markets. The core strategy is based on academic research analyzing 300K+ trades, which found that favorites (65-85¢ contracts) are systematically underpriced while longshots (<25¢) are overpriced. The bot scans for these opportunities, calculates the expected edge, and executes trades with configurable risk controls.

**Features:** auto-trade mode, live sports trading via ESPN data, strategy backtesting with statistical significance testing, Discord notifications, watchlists, price alerts, and a live P&L dashboard.

**Demos:** [v1](https://x.com/Daniel_An23/status/2005993658525573290) | [v2](https://x.com/Daniel_An23/status/2006427824832352701)

<img width="2444" height="1778" alt="image" src="https://github.com/user-attachments/assets/4e48af08-5953-4e1c-bb2a-6e8363fc6bae" />


## Professional Journey

**Microsoft** (2022-2024, Remote) — AI/Web3 partnerships that got [TechCrunch](https://techcrunch.com/2023/08/09/microsoft-aptos-blockchain-ai-web3/) and [Blockworks](https://blockworks.co/news/microsoft-axelar-team-up) coverage.

**Mozilla** (2021-2022, Remote) — Open web advocacy before it was cool. Kind of.

**Google** (2009–2021, Dublin & Chicago) — ~12 years. Authored their most-read Think with Google article. Mobile web performance research that influenced search ranking factors. Watched them invent the Transformer, then take a 5-year nap. 👉 [justfuckingusegemini.com](https://justfuckingusegemini.com).

**Executive Search** (2008-2009, Boston) — Worked as a headhunter during the '08 financial crisis. Now I'm building AI to automate headhunting.

**Barclays Global Investors** (2006-2008, San Francisco & Boston) — 2 & 20. Institutional Business Development: Active Equity, Fixed Income, Hedge Funds.

**Wellington Management** (Boston) — Business Analyst.

**Banc of America Securities** (London) — Summer Analyst: FX Sales & Trading - Interest Rates Swaps Trading.

**Putnam Lovell Securities** (London) — Summer Analyst: FIG M&A.


 ## Open Source

🔀 **[Multi-Model Code Review](https://github.com/carolinacherry/compare-mcp)** — MCP server that fans out code review to multiple LLMs in parallel, diffs their findings, and runs debate rounds. For Claude Code CLI. 

🚵 **[GitHub as a Talent Database](https://github.com/carolinacherry/github-talent-mcp)** - MCP server that searches, scores, and ranks GitHub developers for technical recruiting.

🍏 **[Local AI on iPhone](https://github.com/carolinacherry/local-ai)** - Run Qwen3.5 on your iPhone. No cloud. No API keys. No subscriptions. 100% on-device.

🔐 **[Security scanner](https://github.com/carolinacherry/magnus)** - For solo devs. Autonomous vulnerability discovery with fix guides. Self-hosted. Model-agnostic.

🔗 **[Fine-tuned Qwen2.5-3B-Instruct](https://github.com/carolinacherry/qwen-fine-tuned-career-advisor)** - LoRA + MLX on a base M4 Mac Mini (16GB). No cloud, no rented GPUs.

📈 **[claude-equity-research](https://github.com/quant-sentiment-ai/claude-equity-research)** — Claude Code plugin for institutional-grade equity research. 150+ ⭐

🤣 **[JFU Claude Code](https://github.com/carolinacherry/justfuckinguseclaudecode.com)** - Just use it...

## Connect

🌐 [danielan.io](https://danielan.io) · 💼 [LinkedIn](https://linkedin.com/in/andaniel) · 𝕏 [@Daniel_An23](https://x.com/Daniel_An23)
