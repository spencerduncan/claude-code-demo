export const caseStudy = {
  title: "RedShipBlueShip: From Failed DLLs to Unified Build",
  subtitle: "A real architecture pivot showing the reveal → plan → execute cycle",

  vision: "Walk through a door in Hyrule, appear in Termina. No loading screens, no lag—both games always in memory.",

  problemsRevealed: [
    {
      title: "Symbol collision",
      description: "Both games define 1,158+ identically-named functions. Loading both DLLs causes Windows to resolve symbols from wrong DLL → crashes"
    },
    {
      title: "Pre-init failed",
      description: "Issues #22/#23 (pre-initialize both games) crash during MM init due to symbol collision"
    },
    {
      title: "Load/unload lag",
      description: "Fallback of unloading one DLL to load another adds 2-3 sec transition lag—unacceptable vs. romhack's instant switch"
    }
  ],

  insight: "The OoTMM Combomizer romhack solved the same problem by compiling both games into a single ROM with isolated code segments. We'll apply the same principle to the PC port.",

  solutionBenefits: [
    "No DLL load/unload overhead at runtime",
    "Link-time optimization across game boundaries",
    "Single artifact, single CI/CD pipeline",
    "Unified test infrastructure",
    "~200MB total vs ~100MB × 2 with context switching"
  ],

  processSteps: [
    { emoji: "🔍", phase: "Reveal", action: "Surface why current approach is failing" },
    { emoji: "📋", phase: "Plan", action: "Design architecture with constraints" },
    { emoji: "⚡", phase: "Execute", action: "Parallel workers fill in implementation" },
    { emoji: "🔄", phase: "Iterate", action: "Identify friction, restructure" }
  ],

  issueTriage: [
    { issues: "#1-13", status: "Done", outcome: "Foundation: build system, asset pipeline, entrance infrastructure", carriesForward: true },
    { issues: "#14-17", status: "Open", outcome: "Concepts valid: frozen state, entrance hooks—adapt for unified build", carriesForward: true },
    { issues: "#18", status: "Open", outcome: "Deferred: asset extraction integration (nice to have)", carriesForward: false },
    { issues: "#19-23", status: "Done", outcome: "Approach failed: pre-init crashes due to symbol collision", carriesForward: false },
    { issues: "#24", status: "Open", outcome: "Redesign needed: test harness for unified build", carriesForward: true }
  ],

  testCommands: [
    { command: "redship --test boot-oot", description: "Boot OoT, exit on main menu" },
    { command: "redship --test boot-mm", description: "Boot MM, exit on main menu" },
    { command: "redship --test switch-oot-mm", description: "Warp through entrance, verify MM starts" },
    { command: "redship --test roundtrip", description: "Full round-trip with state verification" },
    { command: "redship --test all", description: "Run all tests (exit code = failure count)" }
  ],

  testingRationale: [
    { principle: "Built into the binary", reason: "Direct state inspection, not parsing logs or scraping output" },
    { principle: "Headless mode", reason: "SDL dummy drivers, no display required—runs in CI" },
    { principle: "Objective gates", reason: "Workers need pass/fail, not 'looks good' evaluations" },
    { principle: "State manipulation", reason: "TriggerEntrance() directly, don't navigate physically" }
  ],

  testGates: [
    { phase: "Symbol namespacing", gate: "NoSymbolCollision passes" },
    { phase: "Unified build", gate: "BootOoT + BootMM pass" },
    { phase: "Switch infrastructure", gate: "SwitchOoTMM + SwitchMMOoT pass" },
    { phase: "State preservation", gate: "RoundTrip passes" }
  ],

  planExcerpt: `# RedShipBlueShip: Unified OoT+MM PC Port

## Vision

A single executable containing both Ocarina of Time and Majora's Mask with seamless transitions between worlds. Walk through a door in Hyrule, appear in Termina. No loading screens, no lag—both games always in memory.

The target audience has beaten both games multiple times and keeps it fresh through randomization. This isn't a novelty project; it's the way they prefer to play.

## Context: Learning from the DLL Approach

The original plan (#1-#24) used separate DLLs with shared graphics context. That approach revealed fundamental constraints:

1. **Symbol collision** - Both games define 1,158+ identically-named functions
2. **Pre-init failed** - Issues #22/#23 crashes during MM init
3. **Load/unload lag** - 2-3 sec transition lag—unacceptable

The work wasn't wasted—it clarified what would and wouldn't work:

| Issues | Status | Outcome |
|--------|--------|---------|
| #1-13 | ✅ Done | Foundation carries forward |
| #14-17 | 🟡 Open | Concepts valid—adapt for unified build |
| #19-23 | ✅ Done | Approach failed: symbol collision |

## UX Design Principle

The test for success: can a player forget this was two separate games?

| Requirement | Acceptance |
|-------------|------------|
| Transition timing | < 500ms total (fade out → switch → fade in) |
| Audio | Crossfade or quick fade, no abrupt cuts |
| Spawn point | Correct location and facing direction |
| Save file | Single file tracks progress in both worlds |

## Architecture

redshipblueship/
├── libultraship/           # Shared engine
├── src/
│   ├── common/             # Cross-game code (OoTMM-inspired)
│   │   ├── context.cpp     # gComboCtx - shared state
│   │   ├── entrance.cpp    # Cross-game entrance mapping
│   │   └── switch.cpp      # Game switch orchestration
│   ├── oot/                # OoT decomp (NAMESPACED: OoT_*)
│   └── mm/                 # MM decomp (NAMESPACED: MM_*)
└── CMakeLists.txt          # Single build → redship.exe

## Testing Strategy

Automated workers need objective pass/fail criteria—no subjective evaluations.

redship --test boot-oot        # Boot OoT, exit on main menu
redship --test switch-oot-mm   # Warp through entrance, verify MM starts
redship --test roundtrip       # Full round-trip with state verification

## Work Distribution

Five parallel workstreams, gated by the test sequence:

| Worker | Scope | Dependencies |
|--------|-------|--------------|
| 1 | Symbol namespacing | None |
| 2 | Build system | Worker 1 |
| 3 | Context exchange + entrance mapping | Worker 2 |
| 4 | Menu system | Worker 2 |
| 5 | PC integration | Workers 3-4 |

Timeline estimate with parallelization: ~15-20 hours

## Fallback

If the unified build hits insurmountable blockers, the DLL approach remains viable with degraded UX:

1. Load only one game DLL at a time (no pre-init)
2. Shutdown → Unload → Load → Init on switch (~2-3 sec lag)
3. Entrance/context exchange code still applies

Working software with lag beats perfect architecture that doesn't ship.`
};
