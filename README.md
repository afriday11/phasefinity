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

Update notes for 12/12/2024
# **Score System Implementation**

Added initial scoring system with proper separation of concerns. This lays the groundwork for implementing game rules and scoring logic.

## **New Files Added**

### **src/services/scoreService.ts**

- Pure TypeScript service for score calculations
- Handles hand evaluation and point calculations
- Isolated from React components for better testing
- Currently contains placeholder logic for hand evaluation

### **src/components/ScoreDisplay.tsx**

- New React component for score visualization
- Shows current score, high score, and last play details
- Highlights recent scoring events
- Styled to match existing game UI

### **Updates to src/App.tsx**

- Added separate score reducer alongside game reducer
- Integrated ScoreDisplay component
- Modified GameControls props to handle score dispatch
- Maintains separation between game state and score state

## **Architecture Decisions**

- Kept scoring logic separate from game mechanics
- Used TypeScript interfaces for type safety
- Followed existing reducer pattern from the codebase
- Maintained single responsibility principle