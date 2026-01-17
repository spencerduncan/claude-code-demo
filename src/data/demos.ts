export interface Demo {
  id: string;
  title: string;
  subtitle?: string;
  prompt: string;
  youDid: string;
  claudeDid: string[];
  ctoValue: string;
  keyLearning?: string;
  isFlagship?: boolean;
}

export const pivotInstructions: Demo[] = [
  {
    id: "architecture-pivot",
    title: "Architecture Pivot",
    prompt: `okay, well switching works at least. lets worry about this more later.
look at the overall oottracker repo we have. Look at the open issues.
Look at what we want in the end. Revise the plan to work with Project64
instead of bizhawk. What do we need to do? Is there work open?`,
    youDid: "Decide to pivot platforms. Ask for impact analysis.",
    claudeDid: [
      "Analyzes entire codebase",
      "Maps ripple effects",
      "Identifies obsolete issues",
      "Proposes new epic"
    ],
    ctoValue: "One prompt triggers full impact analysis of architecture change"
  },
  {
    id: "strategic-question",
    title: "Strategic Question",
    prompt: `great ship it. after that what do we need for randomizer to be
playable with automated tracking on pj64?`,
    youDid: "Approve merge + ask 'what's next to reach goal?'",
    claudeDid: [
      "Synthesizes remaining work",
      "Creates prioritized backlog"
    ],
    ctoValue: "Strategic direction in natural language"
  },
  {
    id: "parallelization",
    title: "Parallelization Optimization",
    prompt: `Examine the large and xl issues in wave one. Can they be split
into smaller parts? Can these parts be parallelized? Optimize as
much as you can and create task level subissues.`,
    youDid: "Request decomposition of bottleneck tasks.",
    claudeDid: [
      "Analyzes complexity",
      "Creates atomic sub-issues",
      "Maps dependencies"
    ],
    ctoValue: "Bottleneck identification and resolution"
  },
  {
    id: "workflow-orchestration",
    title: "Workflow Orchestration",
    prompt: `Merge everything that passes CI. Begin new threads for anything
that is unblocked by merged worked. Look at W2 W3 W4 W5 and W6,
can any of those started?`,
    youDid: "Single instruction chains merge → spawn → plan.",
    claudeDid: [
      "Merges passing PRs",
      "Spawns new workers",
      "Analyzes wave dependencies"
    ],
    ctoValue: "Multi-step workflow in one sentence"
  },
  {
    id: "status-synthesis",
    title: "Status Synthesis",
    prompt: `status update on active issues. did we have workers on them?`,
    youDid: "Request aggregated view of parallel workstreams.",
    claudeDid: [
      "Reports across all active workers",
      "Identifies blockers"
    ],
    ctoValue: "Instant visibility into parallel work"
  },
  {
    id: "risk-detection",
    title: "Risk Detection",
    prompt: `wait, what's our divergence? is there work we might be losing?`,
    youDid: "Spot-check for drift.",
    claudeDid: [
      "Audits branches",
      "Identifies uncommitted work at risk"
    ],
    ctoValue: "Proactive risk identification"
  }
];

export const demoSections: Demo[] = [
  {
    id: "decomposition",
    title: "Epic Decomposition",
    subtitle: "Demo Section 1",
    prompt: `This is for ~/oottracker/. Please make small, single class sized issues
on gh for these problems, make as many as you need to. [Pasted text +230 lines]`,
    youDid: "Paste requirements, request atomic issues.",
    claudeDid: [
      "Creates 13 issues",
      "Maps dependencies",
      "Generates wave structure",
      "Adds size estimates"
    ],
    ctoValue: "Sprint planning in one prompt"
  },
  {
    id: "parallel-workers",
    title: "Parallel Workers",
    subtitle: "Flagship Demo",
    isFlagship: true,
    prompt: `Use the claude in chrome skill you have to address open issues
in /spencerduncan/oottracker in parallel`,
    youDid: "One-sentence instruction to parallelize.",
    claudeDid: [
      "Launches 5 simultaneous web workers",
      "Each implements separate issue (#574-578)",
      "Auto-assigned branches",
      "Independent pushes"
    ],
    ctoValue: "5x parallel velocity. One sentence → 5 implementation streams.",
    keyLearning: "Workers can't read plan files or GitHub issues. Prompts must be fully self-contained."
  },
  {
    id: "wave-planning",
    title: "Wave Planning",
    subtitle: "Demo Section 3",
    prompt: `Wave 1 (no deps): #394(S), #386(M), #397(L), #398(L), #391(XL), #392(XL)
Wave 2: #387←#386, #395←#394
Wave 3: #388←#386+#387, #390←#386+#387+#394
Wave 4: #389←#388, #393←#391+#392, #396←#394+#391`,
    youDid: "Paste requirements.",
    claudeDid: [
      "Creates 13 atomic issues",
      "Maps dependencies",
      "Identifies critical path (#391/#392)",
      "Sizes each task"
    ],
    ctoValue: "See exactly what can run in parallel and what's blocking"
  },
  {
    id: "architecture-analysis",
    title: "Architecture Pivot Analysis",
    subtitle: "Demo Section 4",
    prompt: `"Revise the plan to work with Project64 instead of bizhawk. What do we need to do?"`,
    youDid: "Request impact analysis of platform change.",
    claudeDid: [
      "Discovered PJ64-EM uses Lua (not JavaScript)",
      "Recommended closing 7 obsolete issues",
      "Created new epic #361",
      "Mapped migration path"
    ],
    ctoValue: "Technical debt discovery. One prompt → full impact analysis."
  },
  {
    id: "e2e-testing",
    title: "E2E Testing Infrastructure",
    subtitle: "Demo Section 5",
    prompt: `"what do we need for randomizer to be playable with automated tracking?"`,
    youDid: "Ask strategic question about goal requirements.",
    claudeDid: [
      "Wine launcher for PJ64-EM process management",
      "Lua harness script (port 43435)",
      "TCP protocol for save state control",
      "~1100 lines RAM validation infrastructure"
    ],
    ctoValue: "Professional test infrastructure across 9 PRs"
  },
  {
    id: "stacked-prs",
    title: "Stacked PRs for Reviewability",
    subtitle: "Demo Section 6",
    prompt: `"the tests PR is too big and should be split into one PR per test file"`,
    youDid: "Request PR decomposition for reviewability.",
    claudeDid: [
      "Split large PR #63 into 8 atomic PRs (#66-73)",
      "Each PR: one method + tests",
      "Linear stack"
    ],
    ctoValue: "AI-generated code that's actually reviewable"
  },
  {
    id: "ci-gap",
    title: "CI Gap Detection",
    subtitle: "Demo Section 7",
    prompt: `CI showed green, but 5 broken tests had merged.`,
    youDid: "Noticed something was wrong.",
    claudeDid: [
      "Investigated CI configuration",
      "Found oottracker crate wasn't being tested",
      "Fixed: added cargo test -p oottracker --lib"
    ],
    ctoValue: "Claude audits CI for blind spots you didn't know existed",
    keyLearning: "CI green ≠ all tests pass. Must verify what CI actually runs."
  },
  {
    id: "knowledge-transfer",
    title: "Cross-Project Knowledge Transfer",
    subtitle: "Demo Section 8",
    prompt: `"This will be a long term project that we need to build incrementally with many different parallel workers..."`,
    youDid: "Start new project with parallel worker strategy.",
    claudeDid: [
      "Memory system retained oottracker patterns",
      "Applied dual-OTR loading patterns",
      "Used epic decomposition strategy",
      "Phase 2 issues followed established patterns"
    ],
    ctoValue: "Lessons from Project A inform Project B automatically"
  }
];

export const directorExecutorPairs = [
  { director: "Set goals and priorities", executor: "Analyze codebase and backlog" },
  { director: "Make pivot decisions", executor: "Map impact of decisions" },
  { director: "Ask strategic questions", executor: "Execute decomposition" },
  { director: "Approve/reject approaches", executor: "Launch parallel workers" },
  { director: "Unblock stuck work", executor: "Create issues, PRs, branches" },
];

export const ctoComparison = {
  traditional: [
    { label: "Hire 5 engineers", value: 100 },
    { label: "Wait for sprint planning", value: 80 },
    { label: "2-week sprints, ~3 PRs/engineer", value: 60 },
    { label: "Review bottleneck", value: 70 },
    { label: "Context switching overhead", value: 85 },
  ],
  withClaude: [
    { label: "One senior engineer + Claude", value: 20 },
    { label: "Decompose epic → parallel workers → same day", value: 15 },
    { label: "5 PRs running simultaneously", value: 25 },
    { label: "Claude handles branch management, PRs, issues", value: 10 },
    { label: "Human reviews, decides, unblocks", value: 30 },
  ]
};

export const adjutantPatterns = [
  {
    phase: "Before Deciding",
    you: '"look at the overall repo... what we want in the end"',
    claude: "Synthesizes codebase, backlog, goals into brief"
  },
  {
    phase: "Before Changing",
    you: '"Revise the plan. What do we need to do?"',
    claude: "Maps ripple effects of decisions"
  },
  {
    phase: "While Running",
    you: '"status update on active issues"',
    claude: "Aggregates across parallel workers, identifies blockers"
  },
  {
    phase: "After Delivery",
    you: '"CI is green but something\'s wrong"',
    claude: "Audits systems for gaps you didn\'t know to check"
  }
];

export const logisticsApplications = [
  {
    pattern: "Decomposition",
    application: "Break operator workflows into atomic tasks that can be implemented in parallel"
  },
  {
    pattern: "Pivot Analysis",
    application: "When requirements change (new carrier API, changed regulations), instantly map impact across codebase"
  },
  {
    pattern: "Parallel Velocity",
    application: "Ship features faster than the contract deadline requires"
  },
  {
    pattern: "Quality Gates",
    application: "Professional CI, stacked PRs - auditable code for enterprise clients"
  },
  {
    pattern: "Knowledge Retention",
    application: "Patterns learned on one client engagement transfer to the next"
  }
];

export const keyTakeaways = [
  { title: "Velocity", description: "One engineer + Claude = 5x parallel development streams" },
  { title: "Quality", description: "Stacked PRs, CI auditing, E2E infrastructure - not cowboy coding" },
  { title: "Knowledge retention", description: "Patterns transfer across projects via memory system" },
  { title: "Low friction", description: "Terse prompts, strategic questions, iterate fast" },
  { title: "Professional output", description: "Real issues, real PRs, real CI - enterprise-ready" },
];
