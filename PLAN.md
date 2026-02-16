# MATH COMBAT - Game Design Plan

> A retro vertical space shooter where a 7-year-old fights aliens by solving multiplication and division problems.

**STATUS: ✅ MVP COMPLETE** (2026-02-16) — All core features + nice-to-haves implemented!

---

## 1. Game Concept

**Elevator Pitch:** Galaga meets flash cards. Aliens descend from the top of the screen. Each alien has a math problem on it. Type the answer correctly to blast it out of the sky.

### Core Loop

```
Aliens appear with math problems (e.g., "6 x 7")
        |
        v
Player types the answer on the keyboard
        |
        v
  Correct? --> BOOM! Alien explodes, score goes up, combo builds
  Wrong?   --> Alien keeps descending, player tries again
        |
        v
Alien reaches the bottom? --> Player loses a life (3 lives total)
        |
        v
Clear all waves --> Level complete, harder problems next
```

### What Makes It Fun for a Kid

- **Immediate feedback:** Correct answer = satisfying explosion with screen shake and particles
- **No penalty for guessing:** Wrong answers don't cost lives, just time - encourages trying
- **Combo system:** 3 correct in a row = "AWESOME!", 5 = "UNSTOPPABLE!", 10 = "MATH WIZARD!"
- **Visual rewards:** Ship upgrades, new weapon colors, screen effects as combos build
- **Boss battles:** Big alien at the end of each level with a multi-step problem
- **It feels like a real game:** The kid is playing a space shooter, not doing homework

---

## 2. Math Integration

### How Problems Trigger Combat

Each alien descends slowly and displays a math problem. The player has a **targeting system**:

- **One alien is "targeted" at a time** (highlighted with a reticle)
- The math problem for the targeted alien shows large at the bottom of the screen
- Player types their answer using number keys and presses Enter (or it auto-submits on correct digit count)
- Correct answer fires a laser beam from the player's ship to the targeted alien
- Player can press Tab or arrow keys to switch targets

### Timing Mechanic

- Aliens descend at a steady pace (speed increases with difficulty)
- If an alien reaches the "danger zone" (bottom 20% of screen), it flashes red
- If it reaches the very bottom, the player loses a life
- This creates natural time pressure without a visible timer (less stressful)

### Answer Input

- Large, clear number display at bottom of screen showing what the player is typing
- Backspace to correct mistakes
- Enter to submit (or auto-submit when digit count matches expected answer length)
- For single-digit answers, auto-fire immediately on keypress for maximum satisfaction

---

## 3. Difficulty Progression

### Level Structure

| Level | Tables       | Operations      | Alien Speed | Aliens Per Wave | Notes                    |
|-------|-------------|-----------------|-------------|-----------------|--------------------------|
| 1     | x1, x2      | Multiply only   | Very slow   | 3               | Tutorial level           |
| 2     | x2, x5      | Multiply only   | Very slow   | 4               | Easy wins, build confidence |
| 3     | x2, x5, x10 | Multiply only   | Slow        | 5               | Patterns kids already know |
| 4     | x3, x4      | Multiply only   | Slow        | 5               | New challenge             |
| 5     | x1-x5       | Multiply only   | Medium      | 6               | Mix of learned tables     |
| 6     | x6, x7      | Multiply only   | Medium      | 5               | The hard ones!            |
| 7     | x8, x9      | Multiply only   | Medium      | 5               | The hardest tables        |
| 8     | x1-x10      | Multiply only   | Medium      | 7               | Full multiplication review |
| 9     | x1-x5       | Division intro  | Slow        | 5               | "__ / 2 = 3" format      |
| 10    | x1-x10      | Mixed           | Medium-Fast | 8               | BOSS LEVEL               |

### Adaptive Difficulty (Polish Feature)

- Track which problems the player gets wrong most often
- Repeat those problems more frequently
- If a player is crushing it, speed up aliens slightly
- If a player is struggling, slow aliens down (never let frustration build)

---

## 4. Art & Assets

### Visual Style

- **Pixel art, 16-bit retro aesthetic** with bright, kid-friendly colors
- Black starfield background with parallax scrolling stars
- Chunky, readable fonts for math problems

### Asset Sources (Free)

- **Legacy Pixel Collection** from itch.io for ships, aliens, explosions, projectiles
- We can use simple colored shapes as placeholders for MVP and swap in real sprites later

### Asset List

| Asset            | Description                                | MVP Approach          |
|------------------|--------------------------------------------|-----------------------|
| Player ship      | Small colorful spaceship                   | Colored triangle      |
| Aliens (3 types) | Cute/funny alien sprites                   | Colored circles/squares |
| Laser beam       | Projectile from ship to alien              | Colored line          |
| Explosions       | Particle burst when alien dies             | Expanding circles     |
| Background       | Scrolling starfield                        | Random white dots     |
| UI elements      | Health bar, score, combo counter           | HTML/Canvas text      |
| Boss alien       | Larger alien sprite                        | Bigger colored shape  |

---

## 5. Tech Stack

### Recommendation: Vanilla JS + Canvas

**Why not Phaser?**
- Phaser is great but adds complexity for a game this simple
- Extra dependency, build tooling, API to learn
- Canvas API gives us everything we need: sprites, text, animation, input

**Why vanilla JS + Canvas?**
- Zero dependencies, zero build step
- Open `index.html` in a browser and it works
- Easy to understand, modify, and debug
- Plenty fast for a 2D shooter with <50 objects on screen

### Project Structure

```
math-combat/
  index.html          -- Single HTML file, entry point
  css/
    style.css         -- Minimal styling for the page
  js/
    game.js           -- Main game loop, state management
    player.js         -- Player ship, input handling
    enemy.js          -- Enemy spawning, movement, math problems
    math.js           -- Problem generation, difficulty curves
    renderer.js       -- All Canvas drawing code
    particles.js      -- Explosion and effect particles
    ui.js             -- Score, lives, combo display, menus
    audio.js          -- Sound effect triggers
  assets/
    sprites/          -- Pixel art (when we add it)
    sounds/           -- Sound effects (when we add it)
```

### Key Technical Decisions

- **Game loop:** `requestAnimationFrame` with delta-time for smooth animation
- **Input:** `keydown`/`keyup` event listeners, number keys + Enter + Tab
- **State machine:** Title Screen -> Playing -> Game Over -> Title Screen
- **No framework, no bundler, no npm** - just files and a browser

---

## 6. MVP Scope (Target: ~1 Hour)

The goal is a **playable game** as fast as possible. We can polish forever after.

### MVP Must-Haves

- [x] Canvas renders at fixed size (800x600) centered on screen
- [x] Scrolling starfield background
- [x] Player ship at bottom of screen (colored triangle with details + engine flames)
- [x] Enemies descend from top with math problems displayed on them
- [x] One enemy targeted at a time (highlighted with reticle)
- [x] Player types answer, presses Enter to fire
- [x] Correct answer = laser animation + enemy explodes
- [x] Wrong answer = screen flash, alien keeps coming
- [x] Aliens reaching bottom = lose a life (3 lives)
- [x] Score counter
- [x] Level 1-10 difficulty (x1 through x10 multiplication + division)
- [x] Wave system: clear all enemies to advance (2 waves per level)
- [x] Game Over screen with final score
- [x] Title screen with "Press Enter to Start"

### MVP Nice-to-Haves (If Time Allows)

- [x] Combo counter with text popups ("AWESOME!", "UNSTOPPABLE!", "MATH WIZARD!")
- [x] Screen shake on explosions (scales with combo!)
- [x] Particle effects on enemy death (pink + gold explosions)
- [x] Tab to switch targeted enemy
- [x] Sound effects (laser, explosion, wrong buzz, combos, level complete, game over)

### Explicitly NOT in MVP

- Division problems (add in Level 9+)
- Boss battles
- Power-ups
- Adaptive difficulty
- High score persistence
- Mobile support
- Real sprite art (shapes are fine)

---

## 7. Polish Ideas (Post-MVP)

### Boss Battles

- Every 5th level ends with a boss alien
- Boss has a health bar and requires 3-5 correct answers to defeat
- Boss fires back with "trick questions" (reversed operands, etc.)
- Boss has a dramatic entrance animation and unique look

### Power-Ups

| Power-Up       | Effect                                | Trigger               |
|----------------|---------------------------------------|-----------------------|
| Rapid Fire     | Auto-targets next alien instantly     | 5-combo streak        |
| Shield         | Blocks one alien from reaching bottom | Random drop           |
| Time Freeze    | All aliens pause for 5 seconds       | 10-combo streak       |
| Double Points  | 2x score for 15 seconds              | Random drop           |
| Nuke           | Destroys all on-screen enemies        | Perfect wave (no mistakes) |

### Sound & Juice

- **Pew pew** laser sound on correct answer
- **Boom** explosion sound on enemy death
- Increasing pitch for combo streaks (musical scale)
- Screen shake intensity scales with combo
- Background music: chill chiptune that speeds up in later levels
- Victory fanfare on level complete

### Visual Polish

- Replace geometric shapes with pixel art sprites
- Add thruster flames to player ship
- Parallax star layers (slow, medium, fast)
- Enemy entry animations (fly in from sides, warp in)
- Damage flash on player ship when hit
- Score popup numbers that float up and fade

### Quality of Life

- Persistent high scores (localStorage)
- "Practice Mode" - pick specific times tables to drill
- Parent dashboard showing which problems the kid struggles with
- Keyboard shortcut hints on first play

---

## Build Order

This is the order we'll build things in:

1. **Boilerplate** - HTML + Canvas + game loop running at 60fps
2. **Starfield** - Scrolling background so it looks like space immediately
3. **Player ship** - Static triangle at the bottom
4. **Math engine** - Generate problems for current difficulty level
5. **Enemies** - Spawn, descend, display problems
6. **Targeting** - Highlight one enemy, show problem in input area
7. **Input system** - Type numbers, submit answers
8. **Combat** - Correct answer fires laser, destroys enemy
9. **Lives & scoring** - Track lives, score, game over condition
10. **Wave system** - Multiple waves per level, level progression
11. **Title & game over screens** - Basic state machine
12. **Juice pass** - Particles, screen shake, combos, sound

Let's build this thing.
