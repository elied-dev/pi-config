// @ts-nocheck
// Task-driven agents: when HC_TASKS=1 (set by hc-agent), the agent declares a task list, ticks tasks off,
// and ends when all are done. Progress is published as hc terminal labels (task.progress 0-100,
// task.stage "2/5 Write tests") which the agent-columns board mod draws as a bar under the card.
import { spawn } from "node:child_process";
import { Type } from "@earendil-works/pi-ai";
import { defineTool } from "@earendil-works/pi-coding-agent";

const id = process.env.HC_TERMINAL_ID;

export default function (pi) {
  if (process.env.HC_TASKS !== "1" || !id) return;
  let tasks = [];
  let done = 0;

  const publish = () => {
    const total = tasks.length;
    const stage = !total ? "" : done >= total ? `${total}/${total} All tasks complete` : `${done + 1}/${total} ${tasks[done]}`;
    const progress = total ? String(Math.round((done / total) * 100)) : "";
    spawn("hc", ["label", id, `task.progress=${progress}`, `task.stage=${stage}`, `task.list=${total ? JSON.stringify({ tasks, done }) : ""}`], { stdio: "ignore" })
      .on("error", () => {}).unref();
  };
  const state = () => ({ tasks, done });
  const text = (t) => ({ content: [{ type: "text", text: t }], details: state() });

  pi.registerTool(defineTool({
    name: "set_tasks",
    label: "Set tasks",
    description: "Declare the ordered task list for this job. Call once, first, before any other work.",
    promptSnippet: "set_tasks / complete_task: declare the job's ordered tasks, then tick them off",
    promptGuidelines: [
      "You run under a supervisor. Your first action is set_tasks: 2-8 short, ordered, verifiable tasks (under 50 characters each) that together cover the whole job.",
      "Work on one task at a time. After finishing a task, call complete_task before starting the next.",
      "When complete_task reports all tasks complete, send your final report (hc send $HC_TERMINAL_ID when asked, else a short summary) and stop. Do no extra work.",
      "If the job changes, call set_tasks again with the revised list; finished work stays finished only if you re-list it first.",
    ],
    parameters: Type.Object({ tasks: Type.Array(Type.String(), { minItems: 1, maxItems: 12 }) }),
    async execute(_id, p) {
      tasks = p.tasks; done = 0; publish();
      return text(`Tasks set (${tasks.length}). Current: 1/${tasks.length} ${tasks[0]}`);
    },
  }));

  pi.registerTool(defineTool({
    name: "complete_task",
    label: "Complete task",
    description: "Mark the current task as done and move to the next one.",
    parameters: Type.Object({}),
    async execute() {
      if (!tasks.length) throw new Error("No tasks declared: call set_tasks first.");
      if (done >= tasks.length) return text("All tasks were already complete. Stop now.");
      done++; publish();
      return text(done >= tasks.length
        ? "All tasks complete. Send your final report and stop now."
        : `Done. Current: ${done + 1}/${tasks.length} ${tasks[done]}`);
    },
  }));

  // Resume: rebuild from the last tool result's details.
  pi.on("session_start", (_e, ctx) => {
    for (const e of ctx.sessionManager.getEntries()) {
      const m = e.type === "message" ? e.message : undefined;
      if (m?.role === "toolResult" && (m.toolName === "set_tasks" || m.toolName === "complete_task") && m.details?.tasks) {
        tasks = m.details.tasks; done = m.details.done;
      }
    }
    if (tasks.length) publish();
  });
}
