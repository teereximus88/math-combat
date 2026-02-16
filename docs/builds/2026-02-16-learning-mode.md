# Math Combat - Learning Mode Redesign

## What We're Building

Remove ALL time pressure. Make it a learning tool first, game second. When Gus gets something wrong, teach him HOW to solve it.

---

## Current Problems

1. Enemies still descend (time pressure, even if slow)
2. Wrong answers just penalize - no teaching moment
3. Speed matters more than understanding

---

## New Design: Static Puzzle Mode

### Core Loop (No Time!)

```
Wave of enemies appears (static, no movement)
        ↓
Player targets an enemy, types answer
        ↓
Correct? → Enemy explodes, points, next target
        ↓
Wrong? → LEARNING MOMENT
        │
        ├── Game pauses
        ├── Show visual explanation of the problem
        ├── Teach the method (skip counting, arrays, etc.)
        ├── Show correct answer
        ├── "Press ENTER to try again"
        ↓
Player tries the SAME problem again (must get it right to continue)
        ↓
Clear all enemies → Next wave (harder problems)
```

### Key Changes

| Old | New |
|-----|-----|
| Enemies descend | Enemies are **static** |
| Wrong = enemy jumps down | Wrong = **teaching pause** |
| Lives system | **Mistakes counter** (track for parents) |
| Speed matters | **Only accuracy matters** |
| Fail by aliens reaching bottom | **Can't fail** - just learn |

### Making It "Harder" (Challenge Without Stress)

1. **More enemies per wave** (6-8 instead of 3-5)
2. **Mixed operations sooner** (multiply + divide)
3. **Streak bonuses** - Bigger explosions/combos for accuracy
4. **Challenge rounds** - "Beat your best streak!"
5. **Boss problems** - Multi-step at end of level (e.g., "6 × 7 + 3 = ?")

---

## Learning Explanations (On Wrong Answer)

### Methods to Teach (rotate based on problem type)

**1. Skip Counting**
```
6 × 7 = ?

Let's count by 7s:
7, 14, 21, 28, 35, 42 ← (6th number!)

6 × 7 = 42
```

**2. Array Visualization**
```
6 × 4 = ?

○ ○ ○ ○
○ ○ ○ ○
○ ○ ○ ○     ← 6 rows
○ ○ ○ ○
○ ○ ○ ○
○ ○ ○ ○

Count them all: 24!
```

**3. Break Apart (Distributive)**
```
7 × 8 = ?

Break 8 into 5 + 3:
7 × 5 = 35
7 × 3 = 21
35 + 21 = 56

7 × 8 = 56
```

**4. Use Tens**
```
9 × 6 = ?

Think: 10 × 6 = 60
Subtract one 6: 60 - 6 = 54

9 × 6 = 54
```

**5. Doubles Strategy**
```
6 × 6 = ?

You know 6 + 6 = 12
Double it: 12 + 12 = 24
Double again: 24 + 12 = 36

Or just: 6 × 6 = 36 (memorize squares!)
```

### Division Explanations

```
42 ÷ 7 = ?

Think: "7 times WHAT equals 42?"
7 × 1 = 7
7 × 2 = 14
7 × 3 = 21
7 × 4 = 28
7 × 5 = 35
7 × 6 = 42 ← Found it!

42 ÷ 7 = 6
```

---

## UI Changes

### Wrong Answer Screen

```
┌─────────────────────────────────────────────┐
│                                             │
│              ✗ NOT QUITE!                   │
│                                             │
│              6 × 7 = ?                      │
│              You said: 48                   │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  💡 TIP: Skip count by 7s!                  │
│                                             │
│     7, 14, 21, 28, 35, 42                   │
│     1   2   3   4   5   6  ← 6th number     │
│                                             │
│              6 × 7 = 42                     │
│                                             │
│       [ Press ENTER to try again ]          │
│                                             │
└─────────────────────────────────────────────┘
```

### After Learning → Retry

- Same problem stays targeted
- Player must answer correctly to destroy it
- Builds muscle memory: see problem → recall answer

### Stats Tracking (For Parents)

- Problems attempted
- First-try accuracy %
- Most missed problems (to practice later)
- Time spent (not timed, just logged)

---

## Implementation Plan

1. **Remove enemy movement** - `speed: 0` in levelConfig
2. **Remove lives** - Replace with mistakes counter
3. **Create LearningModal** - New UI component for explanations
4. **Build explanation generator** - Pick method based on problem
5. **Add retry logic** - Same problem stays until correct
6. **Update HUD** - Show accuracy instead of lives
7. **Add end-of-wave summary** - "5/6 first try! Great job!"

---

## Success Criteria

- Gus can play without stress
- When wrong, he learns WHY
- Parents can see what he's struggling with
- Still feels like a game (explosions, combos, fun!)

---

## Open Questions

1. Should we show multiple methods, or pick one per problem?
2. Add a "Practice Mode" for specific times tables?
3. Sound effects for the learning modal? (Encouraging, not punishing)
