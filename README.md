# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

Update notes for recent changes - recent at the top

# **Scoring System Refactor - Contributing Cards Only**

Refactored the scoring system to only apply bonuses to cards that actually contribute to the poker hand, not all played cards.

## **Key Changes:**
- **Hand Evaluator**: Now returns `contributingCards` array identifying which cards form the actual poker hand
- **Score Calculator**: Only applies card bonuses (value, ace, face card, suit) to contributing cards
- **Joker System**: Joker bonuses now only count towards cards that contribute to the hand
- **Gameplay Impact**: Players can play extra cards that won't affect scoring - only the cards forming the poker combination count

## **Examples:**
- **Pair Hand**: If 5 cards are played but only 2 form a pair, only those 2 cards get bonuses
- **Three of a Kind**: Only the 3 matching cards receive bonuses, not the other played cards
- **High Card**: Only the highest value card gets bonuses
- **Joker Effects**: Suit-based jokers only trigger on contributing cards, not all played cards

---

# **Powerup System - Complete Implementation**

Added comprehensive powerup selection system where players earn jokers at the beginning of each level by choosing from 3 randomly selected options.

## **Powerup Earning System**

### **How Players Earn Jokers:**
- **Game Start**: After clicking "New Game" and cards are dealt, the powerup screen appears for level 1
- **Level Progression**: When advancing to higher levels, the powerup screen appears automatically
- **Random Selection**: 3 jokers are randomly chosen from available options (excludes already equipped jokers)
- **Player Choice**: Players can select 1 joker or skip the selection entirely  
- **Immediate Application**: Selected jokers are immediately equipped and affect scoring

### **Powerup Screen Features:**
- **Full-Screen Overlay**: Modal popup with clean, focused interface
- **3 Selection Cards**: Each shows joker name, bonus type/value, and trigger condition
- **Hover Effects**: Interactive feedback with golden highlighting
- **Skip Option**: Players can choose to skip and receive no powerup
- **Auto-Close**: Screen closes automatically after selection or skip

### **Technical Implementation:**
- **Random Selection Service**: `getRandomJokers()` function filters and shuffles available jokers
- **Powerup State Management**: Dedicated Redux slice for powerup screen state
- **Extensible Design**: System built to handle future powerup types beyond jokers
- **Level Integration**: Triggers automatically on level start and level progression

---

# **Joker System - Phase 1 Implementation**

Added comprehensive joker system with passive power-ups that modify scoring based on hand types and card suits.

## **New Features Added**

### **1. Joker Types System (jokerTypes.ts)**
- **Joker Interface**: Complete type definitions matching jokers.json structure
- **Trigger Types**: `'always'`, `'onScoreSuit'`, `'onHandType'` activation conditions
- **Reward Types**: `'mult'` and `'chips'` bonus categories
- **Hand Context**: Evaluation context passed to joker scoring functions

### **2. Joker Evaluation Service (jokerService.ts)**
- **Left-to-Right Processing**: Jokers execute in order as specified in requirements
- **Trigger Logic**: Handles all three trigger types with proper card/hand matching
- **Bonus Calculation**: Separate chip and multiplier bonus accumulation
- **Catalog Loading**: Async function to load joker definitions from JSON

### **3. Score Calculator Integration (scoreCalculator.ts)**
- **Joker Integration Point**: Added Step 4 joker processing after existing bonuses
- **Preserved Scoring Flow**: Maintains existing chip/multiplier calculation pipeline
- **Bonus Descriptions**: Joker effects included in score breakdown display
- **Optional Parameter**: Backwards compatible with existing scoring calls

### **4. Joker Display UI (JokerDisplay.tsx + CSS)**
- **5-Slot Layout**: Fixed 5 joker slots showing equipped status and empty slots
- **Top-Center Positioning**: Follows LevelDisplay design patterns for consistency
- **Joker Information**: Shows name, bonus type, value, and trigger condition
- **Visual Hierarchy**: Clear display of joker stats and activation conditions

### **5. Enhanced Score Display (ScoreDisplay.tsx)**
- **Bonus Breakdown**: Line-by-line display of all bonuses including jokers
- **Improved Readability**: Separated bonus descriptions with proper line breaks
- **Real-Time Updates**: Shows joker contributions to current hand scoring

### **6. Game State Management (gameSlice.ts)**
- **Joker State**: Added jokers array to game state (max 5 equipped)
- **Joker Actions**: EQUIP_JOKER, UNEQUIP_JOKER, CLEAR_EQUIPPED_JOKERS
- **Validation**: Maximum 5 jokers enforced at state level

## **Joker Data Configuration**

### **15 Basic Jokers Implemented (jokers.json)**
- **Always Active**: Base joker (+4 mult always)
- **Suit-Based**: Greedy/Lusty/Wrathful/Gluttonous jokers (+3 mult per matching suit card)
- **Hand Type-Based**: Jolly/Zany/Mad/Crazy/Droll jokers (mult bonuses for specific hands)
- **Chip-Based**: Sly/Wily/Clever/Devious/Crafty jokers (chip bonuses for specific hands)

### **Trigger System**
- **Always**: Activates once per hand regardless of cards
- **onScoreSuit**: Activates once per matching suit card in hand  
- **onHandType**: Activates once per hand if hand type matches

## **Technical Implementation**

### **Integration Flow**
1. **Hand Evaluation**: Standard poker hand evaluation
2. **Base Scoring**: Chips and multiplier from game config
3. **Card Bonuses**: Individual card value bonuses
4. **Other Bonuses**: Existing game bonuses (ace, face cards, etc.)
5. **🆕 Joker Bonuses**: New step - left-to-right joker evaluation
6. **Final Calculation**: `chips × multiplier = final score`

### **Data-Driven Design**
- **No Hard-Coded Logic**: All joker behavior defined in JSON configuration
- **Single Evaluation Function**: Universal joker processor handles all types
- **Extensible**: New jokers can be added by adding JSON entries only

## **Development Tools**

### **Debug Utilities (debugJokers.ts)**
- **Test Jokers**: Pre-defined jokers for testing different trigger types
- **Browser Console**: `addTestJokers()` function available globally
- **Quick Testing**: Instantly equip test jokers to see system in action

## **UI/UX Features**
- **Visual Feedback**: Empty slots communicate 5-joker limit to players
- **Joker Information**: Clear display of what each joker does and when it triggers
- **Score Transparency**: Detailed breakdown showing exactly how jokers affected the score
- **Consistent Styling**: Follows existing game UI patterns and color schemes

---

# **Upgrade Economy System - Foundation Implementation**

Added comprehensive upgrade economy foundation with coin system, domain types, and architectural documentation.

## **New Features Added**

### **1. Economy Domain Types (economyTypes.ts)**
- **JokerConfig**: Defines purchasable joker cards with chip/multiplier bonuses and rarity tiers
- **HandUpgradeConfig**: Configures hand-specific upgrades with scaling costs and level caps
- **ShopItem**: Structure for shop inventory with jokers and hand upgrades
- **PlayerEconomyState**: Player's coins, owned jokers, and hand upgrade levels
- **Constants**: Rarity multipliers, shop configuration, and coin reward values

### **2. Economy State Management (economySlice.ts)**
- **Coin Transactions**: GRANT_COINS and SPEND_COINS actions with validation
- **Joker Management**: ADD_JOKER and REMOVE_JOKER actions with duplicate prevention
- **Hand Upgrades**: UPGRADE_HAND action to improve specific hand types
- **Economy Reset**: Full state reset functionality for testing and new games
- **Comprehensive Logging**: All transactions logged for debugging and transparency

### **3. Coin Service (coinService.ts)**
- **Centralized Coin Granting**: `grantCoins()` function for all coin rewards
- **Level Completion Rewards**: Automatic coin calculation based on efficiency (+5 base + 1 per unused hand)
- **Purchase Validation**: `spendCoins()` with insufficient funds protection
- **Future-Ready**: Placeholder for UI toasts, sound effects, and animations

### **4. UI Components (ScoreDisplay.tsx)**
- **Integrated Coin Display**: Coins now shown within the score display UI for cleaner interface
- **Real-Time Balance**: Live display of player's current coin balance
- **Unified Interface**: Score, coins, and game progress all in one consolidated display

### **5. Store Integration (store.tsx)**
- **Economy Slice**: Added economy state to main application store
- **Action Routing**: Integrated economy actions into root reducer
- **Type Safety**: Full TypeScript support for all economy-related state

## **Architecture Enhancements**

### **1. Comprehensive Documentation (architecture.md)**
- **Current Scoring Pipeline**: Detailed walkthrough with data flow diagram
- **Technical Specification**: Complete upgrade economy design document
- **Implementation Phases**: Clear roadmap for remaining development work
- **Domain Types**: TypeScript interfaces for entire upgrade system

### **2. Action System Updates (actions.ts)**
- **Economy Actions**: Added all economy-related action types
- **Type Safety**: Proper TypeScript interfaces for all payloads
- **Consistent Patterns**: Follows existing action architecture conventions

## **Coin System Rules**
- **Level Completion**: +5 coins base reward
- **Efficiency Bonus**: +1 coin per unused hand/turn
- **Starting Balance**: 10 coins for initial purchases
- **Validation**: All transactions validate sufficient funds before processing

## **Development Impact**
- **Scalable Foundation**: Ready for joker system, shop implementation, and hand upgrades
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Separation of Concerns**: Economy logic isolated from game mechanics
- **Future-Ready**: Architecture supports consumables, shop system, and complex upgrade paths

## **Working Features**
- **Coin Earning**: Players earn coins when completing levels (5 base + 1 per unused hand)
- **Coin Display**: Live coin balance integrated into score display for streamlined UI
- **Level Completion Popup**: Shows win/loss status with detailed coin earnings breakdown
- **Continue Flow**: Smooth transition between levels with proper coin rewards

---

# **React Strict Mode Double-Firing Fix**

Fixed double-firing of events and debug logs that were making debugging confusing.

## **Root Cause: React Strict Mode**
- **Issue**: React Strict Mode intentionally double-invokes functions in development
- **Affected**: useEffect hooks, component renders, event handlers  
- **Result**: All debug logs and actions appeared twice in console

## **Fixes Applied**

### **1. Temporarily Disabled Strict Mode (main.tsx)**
- **Purpose**: Clean debugging experience during development
- **Note**: Should be re-enabled before production deployment
- **Result**: Single firing of all events and logs

### **2. Fixed Double Click Handler (GameBoard.tsx)**
- **Problem**: Both `onMouseDown` and `onMouseUp` called `onClick`
- **Fix**: Moved `onClick` to only fire on `mouseDown`
- **Benefit**: More responsive card selection, no duplicate actions

### **3. Enhanced Debug Logging**
- **Added**: Explanatory note about Strict Mode behavior
- **Improved**: Clearer console output for troubleshooting
- **Result**: Better developer experience when debugging

## **Testing Results Expected**
- ✅ Single initialization log instead of double
- ✅ Single card selection events instead of double  
- ✅ Clean console output for easier debugging
- ✅ Faster, more responsive card interactions

---

# **Game Button Functionality Debug & Fix**

Fixed critical issues preventing game buttons from working after state management refactor.

## **Issues Fixed**

### **1. Button Rendering Logic (GameControls.tsx)**
- **Problem**: Incorrect condition for showing "New Game" vs "Play Hand" buttons
- **Fix**: Now shows "New Game" when `handCards.length === 0` (no cards dealt yet)
- **Impact**: Players can now start the game properly by dealing initial hand

### **2. Debug Logging System** 
- **Added**: Comprehensive debug logging throughout game state flow
- **Components**: GameControls, Store initialization, GameSlice actions
- **Benefit**: Real-time visibility into state changes and button interactions
- **Console Output**: Emojis and clear labeling for easy debugging

### **3. Type Safety Fixes**
- **Fixed**: TypeScript errors in gameSlice for `boardPositions` type
- **Improved**: Explicit type casting for card positions
- **Result**: No more TypeScript compilation errors

## **Debugging Features Added**
- 🚀 Game initialization tracking
- 🎮 Button click logging  
- 🎯 Action dispatch confirmation
- 🃏 Card dealing verification
- 📊 Real-time game state monitoring

## **Expected Game Flow**
1. **Initial Load**: Cards appear in deck (visible)
2. **"New Game" Button**: Deals 8 cards to player's hand
3. **Card Selection**: Click cards to select/deselect them
4. **"Play Hand"/"Discard"**: Process selected cards and draw new ones

---

# **Score System Implementation**

Added initial scoring system with proper separation of concerns. This lays the groundwork for implementing game rules and scoring logic.

## **New Files Added**

### **src/services/scoreService.ts**

- Pure TypeScript service for score calculations
- Handles hand evaluation and point calculations
- Isolated from React components for better testing
- Currently contains placeholder logic for hand evaluation

### **src/components/ScoreDisplay.tsx**

- New React component for score visualization
- Shows current score, high score, and last play details
- Highlights recent scoring events
- Styled to match existing game UI

### **Updates to src/App.tsx**

- Added separate score reducer alongside game reducer
- Integrated ScoreDisplay component
- Modified GameControls props to handle score dispatch
- Maintains separation between game state and score state

## **Architecture Decisions**

- Kept scoring logic separate from game mechanics
- Used TypeScript interfaces for type safety
- Followed existing reducer pattern from the codebase
- Maintained single responsibility principle

---

# **Level Progression System Fix**

Fixed critical level progression issues where turns, discards, and level completion were not being tracked properly.

## **Issues Fixed**

### **1. Turn Tracking (GameControls.tsx)**
- **Problem**: `USE_TURN` action was never dispatched when playing cards
- **Fix**: Added dispatch of `USE_TURN` action in `handlePlayCards()` function
- **Result**: Turns now properly decrement each time a hand is played

### **2. Discard Tracking (GameControls.tsx)**
- **Problem**: `USE_DISCARD` action was never dispatched when discarding cards
- **Fix**: Added dispatch of `USE_DISCARD` action in `handleDiscardCards()` function with validation
- **Result**: Discards now properly decrement and are limited when none remain

### **3. Level Completion Logic (GameControls.tsx)**
- **Problem**: No logic to check if required score was reached and advance to next level
- **Fix**: Added level completion check using `checkLevelComplete()` from levelService
- **Result**: Game now automatically advances to next level when score target is met

### **4. Enhanced Level State Management (levelSlice.ts)**
- **Added**: Comprehensive logging for all level actions (USE_TURN, USE_DISCARD, NEXT_LEVEL)
- **Improved**: Error handling for level progression with graceful game completion
- **Result**: Better debugging visibility and robust level advancement system

### **5. Level Completion Reset System (GameControls.tsx)**
- **Problem**: When advancing to next level, old score and cards remained from previous level
- **Fix**: Added complete reset sequence when level is completed: score reset, board clear, deck shuffle, and new hand deal
- **Actions Dispatched**: `RESET_SCORE`, `RESET`, `SHUFFLE_DECK`, `DRAW_CARDS` (8 cards)
- **Result**: Each new level starts fresh with score at 0 and a new shuffled hand of 8 cards

### **6. High Card Hand Validation Fix (GameControls.tsx)**
- **Problem**: Multiple cards with no combinations were incorrectly blocked as "invalid hands"
- **Fix**: Removed validation that prevented playing multiple unrelated cards as high card hands
- **Result**: Players can now play any selection of cards, with multiple unrelated cards scoring as high card based on highest value

---
## **How to Test the Powerup System**

### **Normal Gameplay:**
1. Start the game with `npm run dev`
2. Click "New Game" to deal cards to your hand
3. Powerup screen appears with 3 random jokers to choose from
4. Select a joker or click "Skip" to continue
5. Play through level 1 and advance to level 2
6. Powerup screen appears again with new joker options
7. Equipped jokers show in the top-center display and affect scoring

### **Debug Console Commands:**
```javascript
// Add test jokers directly (bypasses powerup screen)
window.debugGame.addTestJokers()

// Access current game state (includes powerup state)
window.debugGame.state

// Manual powerup screen trigger (advanced)
window.debugGame.dispatch({type: 'SHOW_POWERUPS', payload: {powerups: [...]}})

// Manual joker equip (advanced)
window.debugGame.dispatch({type: 'EQUIP_JOKER', payload: {joker: someJoker}})
```

### **Available Test Jokers:**
- **Basic Joker**: +4 multiplier (always active)
- **Greedy Joker**: +3 multiplier per diamond card
- **Jolly Joker**: +8 multiplier for pair hands

### **Testing Features:**
- **Powerup Generation**: 3 random jokers appear at level start
- **Duplicate Prevention**: Already equipped jokers won't appear as options
- **Unlock System**: Jokers respect `unlockAtRun` requirements
- **UI Interaction**: Click jokers to select, or "Skip" to pass
- **Score Integration**: Selected jokers immediately affect hand scoring