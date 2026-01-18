# RedShipBlueShip: Unified OoT+MM PC Port

## Vision

A single executable containing both Ocarina of Time and Majora's Mask with seamless transitions between worlds. Walk through a door in Hyrule, appear in Termina. No loading screens, no lag—both games always in memory.

The target audience has beaten both games multiple times and keeps it fresh through randomization. This isn't a novelty project; it's the way they prefer to play.

## Context: Learning from the DLL Approach

The original plan (#1-#24) used separate DLLs with shared graphics context. That approach revealed fundamental constraints:

1. **Symbol collision** - Both games define 1,158+ identically-named functions. Loading both DLLs causes Windows to resolve symbols from wrong DLL → crashes
2. **Pre-init failed** - Issues #22/#23 (pre-initialize both games) crashes during MM init
3. **Load/unload lag** - Fallback of unloading one DLL to load another adds 2-3 sec transition lag - unacceptable vs. romhack's instant switch

The work wasn't wasted—it clarified what would and wouldn't work:

| Issues | Status | Outcome |
|--------|--------|---------|
| #1-13 | ✅ Done | **Foundation carries forward**: build system, asset pipeline, entrance infrastructure |
| #14-17 | 🟡 Open | **Concepts valid**: frozen state, entrance hooks—adapt for unified build |
| #18 | 🟡 Open | **Deferred**: asset extraction integration (nice to have) |
| #19-23 | ✅ Done | **Approach failed**: pre-init crashes due to symbol collision |
| #24 | 🟡 Open | **Redesign needed**: test harness for unified build |

The OoTMM Combomizer romhack solved the same problem by compiling both games into a single ROM with isolated code segments. We'll apply the same principle to the PC port.

---

## UX Design Principle

The test for success: can a player forget this was two separate games?

### What Makes OoTMM Feel Seamless

The romhack established the standard:
- **Instant transitions** (~0.5 sec fade, not loading screens)
- **Audio continuity** (music crossfades, no jarring cuts)
- **Visual consistency** (same resolution/aspect ratio throughout)
- **State preservation** (return to the exact spot when switching back)
- **Single application** (no "which game do I open?" decision)

### Requirements

| Requirement | Acceptance |
|-------------|------------|
| Transition timing | < 500ms total (fade out → switch → fade in) |
| Audio | Crossfade or quick fade, no abrupt cuts |
| Menu state | Close open menus before transition |
| Camera | Positioned appropriately for target area |
| Spawn point | Correct location and facing direction |
| Settings | Changes apply to both games immediately |
| Save file | Single file tracks progress in both worlds |

---

## Additional Benefits of Unified Build

### Toolchain Consolidation

The DLL approach required maintaining two of everything:

| Before (DLL) | After (Unified) |
|--------------|-----------------|
| Two ZAPDTR forks with version drift | Single asset extraction tool |
| Two OTRExporter tools | `otr export --game oot\|mm` |
| Two build pipelines | Single CI/CD, single artifact |
| Two OTR archives | Unified archive with namespaced assets |

### Performance

- No DLL load/unload overhead at runtime
- Link-time optimization can work across game boundaries
- Shared resource caching (textures, models deduplicated)
- ~200MB total vs ~100MB × 2 with context switching

### Development Velocity

- libultraship fixes apply to both games immediately
- Single PR for cross-cutting changes
- Unified test infrastructure
- One codebase to document

### Feature Requirements

These are table stakes for the randomizer community, not nice-to-haves:

| Feature | Why It Matters |
|---------|---------------|
| Unified item tracker | Essential for triforce hunt mode |
| Shared cosmetics | Visual continuity (same Link color in both worlds) |
| Combined save file | No juggling separate saves |
| Beat both games mode | Standard combo experience |
| Triforce hunt mode | The signature combo randomizer feature |

### Stretch Goal

- **Cross-game mods** - unified mod format (nice but not required for launch)

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| **Regex-based symbol detection misses edge cases** | Verify with `nm`/`objdump` on compiled objects. If `comm -12 oot_symbols.txt mm_symbols.txt` returns anything, we missed something. |
| **OoT SaveContext (5KB) vs MM SaveContext (18KB)** | Three-tier design: small `ComboContext` for cross-game state, separate `gSaveContext` per game, unified save *file* containing all three. |
| **OoT (OTRGlobals) and MM (BenPort) have different adapters** | Abstract via `IGameAdapter` interface—each game implements `Init()`, `Run()`, `Freeze()`, `Resume()`. |

```cpp
// Adapter pattern for libultraship integration
class IGameAdapter {
    virtual void Init() = 0;
    virtual void Run() = 0;
    virtual void Freeze(ComboContext* ctx) = 0;
    virtual void Resume(ComboContext* ctx) = 0;
};
```

---

## Architecture

### Directory Structure

```
redshipblueship/
├── libultraship/           # Shared engine (unchanged)
├── ZAPDTR/                 # Shared tools (unchanged)
├── src/
│   ├── common/             # Cross-game code (OoTMM-inspired)
│   │   ├── context.cpp     # gComboCtx - shared state between games
│   │   ├── entrance.cpp    # Cross-game entrance mapping
│   │   ├── save.cpp        # Unified save management
│   │   └── switch.cpp      # Game switch orchestration
│   ├── oot/                # OoT decomp (NAMESPACED)
│   │   └── src/            # All symbols prefixed: OoT_*
│   └── mm/                 # MM decomp (NAMESPACED)
│       └── src/            # All symbols prefixed: MM_*
├── pc/
│   ├── common/             # Shared PC features
│   ├── oot/                # soh/ code
│   └── mm/                 # 2s2h/ code
└── CMakeLists.txt          # Single build → redship.exe
```

### Game Switching (OoTMM-style)
```cpp
struct ComboContext {
    char magic[8];          // "OoT+MM<3"
    uint32_t entrance;      // Target entrance
    Game sourceGame;        // Where we came from
    // Shared persistent state...
};

// Both games always in memory - switching is just a function call
void ComboGameSwitch(Game target, uint16_t entrance) {
    FreezeCurrentGame(&gComboCtx);
    gComboCtx.entrance = entrance;
    ResumeGame(target, &gComboCtx);  // INSTANT - no loading!
}
```

---

## Phase 1: Automated Symbol Namespacing

### Step 1A: Symbol Detection Script

Create `tools/detect_collisions.py`:
```python
#!/usr/bin/env python3
"""
Detect symbol collisions between OoT and MM codebases.
Outputs list of functions/globals that need namespacing.
"""

import re
from pathlib import Path

def extract_symbols(src_dir):
    """Extract function and global variable names from C source files."""
    symbols = set()

    for path in Path(src_dir).rglob("*.c"):
        content = path.read_text(errors='ignore')

        # Match function definitions: type name(...)
        funcs = re.findall(r'\b(\w+)\s*\([^)]*\)\s*\{', content)
        symbols.update(funcs)

        # Match global variables: extern type name; or type name = ...;
        globals_ = re.findall(r'\b(\w+)\s*(?:=|;)', content)
        symbols.update(globals_)

    return symbols

oot_symbols = extract_symbols("games/oot/src")
mm_symbols = extract_symbols("games/mm/src")
collisions = oot_symbols & mm_symbols

print(f"OoT symbols: {len(oot_symbols)}")
print(f"MM symbols: {len(mm_symbols)}")
print(f"Collisions: {len(collisions)}")

with open("symbol_collisions.txt", "w") as f:
    for sym in sorted(collisions):
        f.write(f"{sym}\n")
```

### Step 1B: Automated Renaming Script

Create `tools/namespace_symbols.py`:
```python
#!/usr/bin/env python3
"""
Automatically rename symbols in source files to add game prefix.
Usage: python namespace_symbols.py --game oot --symbols symbol_collisions.txt
"""

import argparse
import re
from pathlib import Path

def namespace_file(path, symbols, prefix):
    """Add prefix to all occurrences of symbols in file."""
    content = path.read_text()

    for sym in symbols:
        # Match whole word only
        pattern = r'\b' + re.escape(sym) + r'\b'
        replacement = f"{prefix}_{sym}"
        content = re.sub(pattern, replacement, content)

    path.write_text(content)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--game", choices=["oot", "mm"], required=True)
    parser.add_argument("--symbols", required=True)
    args = parser.parse_args()

    prefix = "OoT" if args.game == "oot" else "MM"
    src_dir = f"games/{args.game}/src"

    with open(args.symbols) as f:
        symbols = [line.strip() for line in f if line.strip()]

    for path in Path(src_dir).rglob("*.c"):
        namespace_file(path, symbols, prefix)
    for path in Path(src_dir).rglob("*.h"):
        namespace_file(path, symbols, prefix)

    print(f"Renamed {len(symbols)} symbols with prefix {prefix}_")
```

### Step 1C: Generate Namespace Headers

Create wrapper headers for clean API:
```cpp
// redship/include/game_api.h
#pragma once

namespace OoT {
    void Main_Init(void);
    void Main_Run(void);
    void FreezeState(ComboContext* ctx);
    void ResumeFromContext(ComboContext* ctx);
    extern SaveContext gSaveContext;  // 5KB version
}

namespace MM {
    void Main_Init(void);
    void Main_Run(void);
    void FreezeState(ComboContext* ctx);
    void ResumeFromContext(ComboContext* ctx);
    extern SaveContext gSaveContext;  // 18KB version
}
```

---

## Phase 2: Unified Build System

### Step 2A: Create RedShip CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.26)
project(redship)

# Shared dependencies
add_subdirectory(libultraship)
add_subdirectory(ZAPDTR/ZAPD)

# OoT decomp as object library (all symbols internal)
file(GLOB_RECURSE OOT_SOURCES "src/oot/src/*.c")
add_library(oot_decomp OBJECT ${OOT_SOURCES})
target_compile_definitions(oot_decomp PRIVATE GAME_OOT)
set_target_properties(oot_decomp PROPERTIES
    C_VISIBILITY_PRESET hidden)

# MM decomp as object library
file(GLOB_RECURSE MM_SOURCES "src/mm/src/*.c")
add_library(mm_decomp OBJECT ${MM_SOURCES})
target_compile_definitions(mm_decomp PRIVATE GAME_MM)
set_target_properties(mm_decomp PROPERTIES
    C_VISIBILITY_PRESET hidden)

# Common cross-game code
file(GLOB COMMON_SOURCES "src/common/*.cpp")

# Unified executable
add_executable(redship
    ${COMMON_SOURCES}
    $<TARGET_OBJECTS:oot_decomp>
    $<TARGET_OBJECTS:mm_decomp>
    pc/common/main.cpp
    pc/oot/OTRGlobals.cpp
    pc/mm/BenPort.cpp
    # ... other PC sources
)

target_link_libraries(redship PRIVATE libultraship ZAPDLib)
```

### Step 2B: Unified Main Entry Point

```cpp
// pc/common/main.cpp
#include "game_api.h"
#include "common/context.h"

ComboContext gComboCtx;
Game gCurrentGame = Game::None;

int main(int argc, char** argv) {
    // Initialize shared systems
    Ship::Context::CreateInstance("redship", "redship", "", argc, argv, {}, {});

    // Initialize both games' static data
    OoT::Main_Init();
    MM::Main_Init();

    // Start with OoT (or from command line)
    gCurrentGame = Game::OoT;

    while (running) {
        if (gCurrentGame == Game::OoT) {
            OoT::Main_Run();  // Runs until switch requested
        } else {
            MM::Main_Run();   // Runs until switch requested
        }

        // Check for game switch
        if (gComboCtx.switchRequested) {
            gCurrentGame = gComboCtx.targetGame;
            gComboCtx.switchRequested = false;
        }
    }

    return 0;
}
```

---

## Phase 3: Cross-Game Context Exchange

### Step 3A: Context Structure (from OoTMM)

```cpp
// src/common/context.h
struct ComboContext {
    // Magic validation
    char magic[8] = "OoT+MM<3";
    uint32_t version = 1;

    // Switch control
    bool switchRequested = false;
    Game targetGame = Game::None;
    uint16_t targetEntrance = 0;

    // Shared persistent state
    uint32_t sharedFlags[64];       // Cross-game event flags
    uint16_t sharedItems[32];       // Shared inventory items

    // Save slot tracking
    int32_t saveSlot = 0;
};

extern ComboContext gComboCtx;
```

### Step 3B: Entrance Mapping

```cpp
// src/common/entrance.cpp
struct EntranceLink {
    Game sourceGame;
    uint16_t sourceEntrance;
    Game targetGame;
    uint16_t targetEntrance;
};

const EntranceLink kEntranceLinks[] = {
    // Happy Mask Shop (OoT) ↔ Clock Tower Interior (MM)
    {Game::OoT, 0x0030, Game::MM, 0xC010},
    {Game::MM, 0xC010, Game::OoT, 0x0030},

    // Lost Woods (OoT) ↔ Southern Swamp (MM)
    {Game::OoT, 0x01A0, Game::MM, 0x8C00},
    {Game::MM, 0x8C00, Game::OoT, 0x01A0},

    // ... more links
};

void CheckEntranceForSwitch(Game currentGame, uint16_t entrance) {
    for (const auto& link : kEntranceLinks) {
        if (link.sourceGame == currentGame && link.sourceEntrance == entrance) {
            gComboCtx.switchRequested = true;
            gComboCtx.targetGame = link.targetGame;
            gComboCtx.targetEntrance = link.targetEntrance;
            return;
        }
    }
}
```

---

## Phase 4: Unified Menu & Settings Architecture

### Design Decisions
- **Settings**: Shared core (graphics/audio/controls), separate game-specific enhancements
- **Menu UI**: Unified menu with OoT/MM tabs
- **Controls**: Shared button mappings across both games

### Step 4A: CVar Namespace Design

```
redship.json
├── gCore.*                    # SHARED - applies to both games
│   ├── gCore.Graphics.*       # Resolution, MSAA, FPS, VSync
│   ├── gCore.Audio.*          # Master volume, music, SFX
│   ├── gCore.Controls.*       # Shared controller mappings
│   └── gCore.Window.*         # Window size, fullscreen
│
├── gOoT.*                     # OoT-SPECIFIC
│   ├── gOoT.Enhancements.*    # OoT gameplay enhancements
│   ├── gOoT.Cheats.*          # OoT cheats
│   ├── gOoT.Cosmetics.*       # OoT cosmetic changes
│   └── gOoT.Rando.*           # OoT randomizer settings
│
└── gMM.*                      # MM-SPECIFIC
    ├── gMM.Enhancements.*     # MM gameplay enhancements
    ├── gMM.Cheats.*           # MM cheats
    ├── gMM.Cosmetics.*        # MM cosmetic changes
    └── gMM.Rando.*            # MM randomizer settings
```

### Step 4B: Unified Menu Structure

```cpp
// pc/common/ComboMenuBar.cpp
class ComboMenuBar : public Ship::GuiMenuBar {
    void DrawMenu() override {
        // Core settings (always visible)
        if (ImGui::BeginMenu("Settings")) {
            DrawCoreSettings();  // Graphics, Audio, Controls - shared
            ImGui::EndMenu();
        }

        // Game-specific tabs
        if (ImGui::BeginTabBar("GameTabs")) {
            if (ImGui::BeginTabItem("Ocarina of Time")) {
                DrawOoTEnhancements();
                DrawOoTCheats();
                ImGui::EndTabItem();
            }
            if (ImGui::BeginTabItem("Majora's Mask")) {
                DrawMMEnhancements();
                DrawMMCheats();
                ImGui::EndTabItem();
            }
            ImGui::EndTabBar();
        }

        // Cross-game settings
        if (ImGui::BeginMenu("Combo")) {
            DrawEntranceMapping();  // Configure cross-game transitions
            DrawSharedInventory();  // Items that carry between games
            ImGui::EndMenu();
        }
    }
};
```

### Step 4C: Shared Controller Mapping

```cpp
// Single InputEditorWindow for both games
// Both games use same N64-style controller layout
// Mappings stored under gCore.Controls.*

// Button mapping - same physical buttons, game interprets them
struct ComboControlMapping {
    // N64 buttons (shared)
    uint16_t a, b, z, start;
    uint16_t cUp, cDown, cLeft, cRight;
    uint16_t dUp, dDown, dLeft, dRight;
    uint16_t l, r;
    int16_t stickX, stickY;

    // Both games interpret these the same way
    // (A = interact, B = attack/cancel, etc.)
};
```

### Step 4D: Settings Migration

When first launching RedShip with existing Ship/2Ship configs:
```cpp
void MigrateSettings() {
    // Check for existing configs
    if (std::filesystem::exists("shipofharkinian.json")) {
        auto ootConfig = LoadJson("shipofharkinian.json");
        // Move core settings to gCore.*
        // Move enhancements to gOoT.*
    }
    if (std::filesystem::exists("2ship2harkinian.json")) {
        auto mmConfig = LoadJson("2ship2harkinian.json");
        // Keep MM enhancements in gMM.*
    }
    // Save unified redship.json
}
```

---

## Testing Strategy

Automated workers need objective pass/fail criteria—no subjective "looks good" evaluations.

### Design: Built-in Test Mode

Rather than external test harnesses that parse logs or scrape output, the game binary includes test capabilities via `--test`. This provides direct state inspection and runs actual game code, not mocks.

```bash
redship --test boot-oot        # Boot OoT, exit on main menu
redship --test boot-mm         # Boot MM, exit on main menu
redship --test switch-oot-mm   # Warp through test entrance, verify MM starts
redship --test roundtrip       # Full round-trip with state verification
redship --test all             # Run all tests (exit code = failure count)
```

### Implementation: TestRunner Class

```cpp
// combo/src/test/TestRunner.h
class TestRunner {
public:
    int RunAllTests();

private:
    // Individual tests
    bool TestBootGame(Game game);
    bool TestGameSwitch(Game from, Game to, uint16_t testEntrance);
    bool TestRoundTrip();
    bool TestSymbolCollision();  // Compile-time, actually

    // Test helpers - drive the game loop
    void InitGame(Game game, bool headless = true);
    void RunFrames(int count);
    void RunUntil(std::function<bool()> condition, int timeoutFrames);

    // Input injection (no human needed)
    void InjectInput(uint16_t buttons);
    void TriggerEntrance(uint16_t entrance);

    // State observation
    TestableState CaptureState();
    bool IsAtMainMenu();
    bool IsGameplayActive();
    Game GetCurrentGame();

    // Logging
    void Log(const char* fmt, ...);
    void Pass(const char* testName);
    void Fail(const char* testName, const char* reason);
};

// Minimal state for test verification
struct TestableState {
    Vec3f playerPos;
    int16_t playerYaw;
    uint16_t sceneId;
    uint16_t entranceIndex;
    Game currentGame;
};
```

### Implementation: Boot Test (Detailed)

```cpp
bool TestRunner::TestBootGame(Game game) {
    Log("TEST: Boot %s to main menu", GameName(game));

    InitGame(game, /*headless=*/true);

    const int TIMEOUT = 60 * 30;  // 30 sec at 60fps

    bool reached = RunUntil([this]() { return IsAtMainMenu(); }, TIMEOUT);

    if (reached) {
        Pass("Boot" + GameName(game));
        return true;
    } else {
        Fail("Boot" + GameName(game), "Timeout waiting for main menu");
        return false;
    }
}
```

### Implementation: Switch Test (Detailed)

```cpp
bool TestRunner::TestGameSwitch(Game from, Game to, uint16_t testEntrance) {
    Log("TEST: Switch %s -> %s via entrance 0x%04X",
        GameName(from), GameName(to), testEntrance);

    InitGame(from, /*headless=*/true);

    // Load pre-positioned test save (Link near test entrance)
    LoadTestSave(from);
    RunUntil([this]() { return IsGameplayActive(); }, 60 * 10);

    auto before = CaptureState();
    Log("  Before: %s at (%.1f, %.1f, %.1f)",
        GameName(before.currentGame),
        before.playerPos.x, before.playerPos.y, before.playerPos.z);

    // Trigger the entrance (direct state manipulation, fast & reliable)
    TriggerEntrance(testEntrance);

    // Wait for switch
    bool switched = RunUntil([this, to]() {
        return GetCurrentGame() == to && IsGameplayActive();
    }, 60 * 5);

    if (!switched) {
        Fail("Switch", "Game switch didn't complete");
        return false;
    }

    auto after = CaptureState();
    Log("  After: %s at entrance 0x%04X",
        GameName(after.currentGame), after.entranceIndex);

    // Verify correct destination
    uint16_t expected = GetLinkedEntrance(from, testEntrance);
    if (after.entranceIndex != expected) {
        Fail("Switch", "Wrong entrance: expected 0x%04X, got 0x%04X",
             expected, after.entranceIndex);
        return false;
    }

    Pass("Switch");
    return true;
}

void TestRunner::TriggerEntrance(uint16_t entrance) {
    // Direct state manipulation - no need to physically walk there
    if (gCurrentGame == Game::OoT) {
        OoT::gPlayState->nextEntranceIndex = entrance;
        OoT::gPlayState->transitionTrigger = TRANS_TRIGGER_START;
    } else {
        MM::gPlayState->nextEntranceIndex = entrance;
        MM::gPlayState->transitionTrigger = TRANS_TRIGGER_START;
    }
}
```

### Implementation: Headless Mode

```cpp
void TestRunner::InitGame(Game game, bool headless) {
    if (headless) {
        // SDL2 supports dummy video driver
        SDL_setenv("SDL_VIDEODRIVER", "dummy", 1);
        SDL_setenv("SDL_AUDIODRIVER", "dummy", 1);
    }

    // Normal game init, but in test mode
    gTestMode = true;  // Skip splash screens, intros, etc.

    if (game == Game::OoT) {
        OoT::Main_Init();
    } else {
        MM::Main_Init();
    }

    gCurrentGame = game;
}

void TestRunner::RunFrames(int count) {
    for (int i = 0; i < count; i++) {
        // Run one frame of game logic (no rendering in headless)
        if (gCurrentGame == Game::OoT) {
            OoT::GameFrame();
        } else {
            MM::GameFrame();
        }
    }
}
```

### Test Assets (Checked into Repo)

```
tests/assets/
├── oot_test_save.sav     # Link in Kokiri Forest near exit
├── mm_test_save.sav      # Link in Clock Town near Stock Pot Inn
└── README.md             # How to regenerate if needed
```

These saves position Link near test entrances so tests don't need to navigate.

### CTest Integration

```cmake
# combo/CMakeLists.txt
enable_testing()

# Each test is just the game binary with different --test flag
add_test(NAME BootOoT COMMAND redship --test boot-oot)
add_test(NAME BootMM COMMAND redship --test boot-mm)
add_test(NAME SwitchOoTMM COMMAND redship --test switch-oot-mm)
add_test(NAME SwitchMMOoT COMMAND redship --test switch-mm-oot)
add_test(NAME RoundTrip COMMAND redship --test roundtrip)

# Symbol collision is a build-time check, not runtime
add_test(NAME NoSymbolCollision
    COMMAND bash -c "nm $<TARGET_FILE:redship> | grep -E '^[0-9a-f]+ T ' | cut -d' ' -f3 | sort | uniq -d | grep -q . && exit 1 || exit 0")
```

### Worker Workflow

```
make change → cmake --build build → ctest --output-on-failure → fix until green → push
```

Example failure output:
```
3/5 Test #3: SwitchOoTMM ................***Failed    1.22 sec
  TEST: Switch OoT -> MM via entrance 0x0030
    Before: OoT at (0.0, 0.0, 0.0)
    FAIL: Game switch didn't complete
```

The failure message tells the worker exactly what to investigate.

### Development Sequence

Test infrastructure comes first, then features add their own tests:

| Phase | Work | Test Gate |
|-------|------|-----------|
| 0 | TestRunner skeleton + headless mode | (infrastructure) |
| 1 | Symbol namespacing | NoSymbolCollision passes |
| 2 | Unified build | BootOoT + BootMM pass |
| 3 | Switch infrastructure | SwitchOoTMM + SwitchMMOoT pass |
| 4 | State preservation | RoundTrip passes |

No feature merges without its test passing.

### CI Integration

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Install deps
        run: sudo apt-get install -y libsdl2-dev libpng-dev

      - name: Configure
        run: cmake -B build -DCMAKE_BUILD_TYPE=Release

      - name: Build
        run: cmake --build build -j$(nproc)

      - name: Test
        run: ctest --test-dir build --output-on-failure
```

Every PR gets automatic verification. Merge requires green tests.

### Estimated Implementation Effort

| Component | Lines | Time |
|-----------|-------|------|
| TestRunner class | ~300 | 2 hrs |
| main() --test handling | ~30 | 15 min |
| Headless mode support | ~50 | 30 min |
| CTest CMake config | ~20 | 15 min |
| CI workflow | ~30 | 15 min |
| Test save creation | - | 30 min |
| **Total** | ~430 | ~4 hrs |

This is front-loaded work that pays off in every subsequent feature.

---

## Milestones

Each milestone produces working, demonstrable software.

| Milestone | Gate | Verification |
|-----------|------|--------------|
| **1. Both games boot** | No regressions from standalone | `redship --test boot-oot && redship --test boot-mm` |
| **2. Basic switch** | Enter test entrance → appear in other game | `redship --test switch-oot-mm` |
| **3. Seamless transitions** | Fade, audio crossfade, < 500ms | Manual UX review |
| **4. Unified settings** | Single config, shared controls | Settings migration test |
| **5. Production ready** | Single toolchain, CI artifact | Full regression suite |

Performance targets:
- Transition < 500ms including fade effects
- No frame drops during switch
- ~200MB memory footprint stable

---

## Work Distribution

Five parallel workstreams, gated by the test sequence:

| Worker | Scope | Dependencies |
|--------|-------|--------------|
| **1** | Symbol namespacing (detection → automated renaming → verify build) | None |
| **2** | Build system (unified CMakeLists, include paths, cross-platform) | Worker 1 |
| **3** | Context exchange + entrance mapping (OoTMM pattern port) | Worker 2 |
| **4** | Menu system (game tabs, shared settings, migration) | Worker 2 |
| **5** | PC integration (SaveManager, CVar namespace, unified config) | Workers 3-4 |

Timeline estimate with parallelization: **~15-20 hours**

---

## Key Files

**Create:**
- `tools/detect_collisions.py` — symbol conflict detection
- `tools/namespace_symbols.py` — automated renaming
- `src/common/context.cpp` — ComboContext and state exchange
- `src/common/entrance.cpp` — cross-game entrance mapping
- `src/test/TestRunner.cpp` — built-in test harness
- `pc/common/main.cpp` — unified entry point
- `pc/common/RedShipMenuBar.cpp` — tabbed menu system

**Modify:**
- `games/oot/src/**/*.c` — add `OoT_` prefix to colliding symbols
- `games/mm/src/**/*.c` — add `MM_` prefix to colliding symbols
- `CMakeLists.txt` — unified build configuration

---

## Fallback

If the unified build hits insurmountable blockers, the DLL approach remains viable with degraded UX:

1. Load only one game DLL at a time (no pre-init)
2. Shutdown → Unload → Load → Init on switch (~2-3 sec lag)
3. Entrance/context exchange code still applies

Working software with lag beats perfect architecture that doesn't ship.
