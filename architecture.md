# Phasefinity – Architecture Overview

*Last updated: 2025‑06‑18*

## 1. Tech Stack

| Layer     | Library / Tool                              | Notes                                    |
| --------- | ------------------------------------------- | ---------------------------------------- |
| Build     | **Vite** + React 18                         | Fast dev server & HMR                    |
| Framework | **React** with **TypeScript**               | Strict typing across reducers & services |
| State     | **React Context + useReducer** (single store) | 4 slices: `game`, `score`, `level`, `handLevels` |
| Styling   | CSS modules                                 | Lightweight, no runtime dependency       |
| Audio     | `Howler.js` via helper (`playDealSound.ts`) | SFX only                                 |
| Data      | Single static JSON in `/config/gameConfig.json` | All scoring, leveling, and hand data     |

## 2. High‑Level Flow

```
App.tsx
 └── store/store.tsx (AppProvider)
      ├── rootReducer(game, score, level, handLevels)
      ├── <GameBoard/> (consumes context)
      ├── <GameControls/> (consumes context)
      └── <ScoreDisplay/>, <LevelDisplay/>
```

1.  **Start →** `AppProvider` initializes the store; `INITIALIZE_GAME` creates a shuffled deck.
2.  **Deal →** `GameControls` dispatches actions to move cards from `deck` ➜ `hand`.
3.  **Play →** Player drags cards; positions live in `Card.position`.
4.  **Evaluate →** On “Play Hand” in `GameControls`, the pipeline runs:
    `handEvaluator.ts` » `scoreManager.ts`.
5.  The single `rootReducer` updates the appropriate state slice, UI re‑renders.

## 3. Key Modules

### 3.1 State Slices (`/store/*`)

| File                  | Responsibility                                                 |
| --------------------- | -------------------------------------------------------------- |
| `gameSlice.ts`        | Canonical deck/board state, turn flags                         |
| `scoreSlice.ts`       | Total chips, current multiplier, history of scores             |
| `levelSlice.ts`       | Player level, turns/discards remaining                         |
| `handLevelsSlice.ts`  | XP & level per hand type (`HandType`)                          |

All slices are combined in `store.tsx`'s `rootReducer`.

### 3.2 Services (`/services`)

| Service             | Purpose                                                              |
| ------------------- | -------------------------------------------------------------------- |
| `handEvaluator.ts`  | Pure function: determines hand type (straight, flush, etc.).         |
| `scoreManager.ts`   | Pure function: calculates final score from hand type, cards, & state.|
| `handLevelManager.ts`| Pure functions: computes derived multipliers from hand level state. |
| `levelService.ts`   | Pure functions: provides access to player level configuration.      |
| `bonuses/*`         | Pluggable bonus rules (e.g. `cardFaceChipBonus.ts`)                  |

### 3.3 Hooks

* **`useAppContext`** – (in `store.tsx`) Provides global `state` and `dispatch`.
* **`useAnimation.ts`** – RAF‑based animation loop that lowers re‑renders.
* **`useMousePosition.ts` / `useWindowSize.ts`** – Generic helpers.

### 3.4 Config

```
/config/gameConfig.json   // Single source of truth for all game values
```

## 4. Data Models

```ts
type HandType = "pair" | "twoPair" | "threeOfAKind" | ...;
interface Card {
  id: number; label: string; value: number; suit: "♠︎"|"♥︎"|...;
  position: "deck"|"hand"|"board"|"discard";
  selected: boolean;
}
interface ScoreCalculation {
  chips: number;
  multiplier: number;
  bonuses: string[];
}
```

> 💡 **Note:** The same `HandType` enum is referenced in configs *and* code; single‑source‑of‑truth is `/types/scoreTypes.ts`.

## 5. Rendering Layer

* Canvas‑less DOM approach; each card is an absolutely‑positioned `<div>` styled via CSS ‑ avoids WebGL dependency.
* Drag logic relies on mouse events captured in `CardComponent.tsx`.
* Animations handled by CSS transitions + `useAnimation` hook for smoothness.

## 6. Build / Tooling

* `npm run dev` → vite server
* `npm run build` → static bundle under `/dist`.
* `tsconfig.app.json` + `tsconfig.node.json` keep server scripts isolated.

---

## 7. Identified Pain Points & **Specific Refactors**

| #  | Issue                                                                      | Recommendation / Status                                                                                                                     |
| -- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1  | **Reducers sprawl** – three separate reducers glued together in `App.tsx`. | **DONE.** Switched to a single `rootReducer` with a global `AppContext` provider. All state is managed in one place. |
| 2  | **Mutable `Map` inside `HandLevelService`** leaks via methods.             | **DONE.** Replaced with a `handLevels` state slice and pure functions in `handLevelManager.ts` for calculations. |
| 3  | **Config duplication** (`scoreConfig.json` vs in‑code defaults).           | **DONE.** Merged all numeric tables into a single `gameConfig.json`. All services and reducers now read from this file. |
