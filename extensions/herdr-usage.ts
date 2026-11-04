// @ts-nocheck
// Publishes session token + cost totals as hc terminal labels (usage.tokens, usage.cost);
// the agent-columns board mod reads them.
import { spawn } from "node:child_process";

const id = process.env.HC_TERMINAL_ID;
const fmt = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "k" : String(n));

export default function (pi) {
  if (!id) return;
  const report = (ctx) => {
    let tokens = 0, cost = 0;
    for (const e of ctx.sessionManager.getEntries()) {
      const u = e.type === "message" && e.message?.role === "assistant" ? e.message.usage : undefined;
      if (u) { tokens += u.totalTokens ?? 0; cost += u.cost?.total ?? 0; }
    }
    spawn("hc", ["label", id, `usage.tokens=${fmt(tokens)}`, `usage.cost=$${cost.toFixed(2)}`, `usage.model=${ctx.model?.id ?? ""}`], { stdio: "ignore" })
      .on("error", () => {}).unref();
  };
  pi.on("turn_end", (_e, ctx) => report(ctx));
  pi.on("session_start", (_e, ctx) => { if (ctx?.mode === "tui") report(ctx); });
}
