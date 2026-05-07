# Lotto Number Recommender Blueprint

## Overview
A modern, interactive web application that recommends 6 lotto numbers (1-45) with a visually appealing and animated user interface. It provides 5 sets of lucky numbers at once to enhance the user experience.

## Project Outline
- **Entry Point:** `index.html`
- **Styling:** `style.css` (using modern CSS: OKLCH colors, CSS Variables, Animations)
- **Logic:** `main.js` (using Web Components, ES Modules)
- **Features:**
    - **One-Click 5-Set Generation:** Generates 5 unique sets of 6 numbers (1-45) simultaneously.
    - **Web Components:** Encapsulated `lotto-ball` component for consistent styling.
    - **Premium UI:** Tactile background texture, vibrant OKLCH color palette, and deep shadows.
    - **Smooth Animations:** Staggered pop-in animations for each ball and slide-up effects for each set.
    - **Responsive Design:** Optimized for both mobile and desktop viewports.

## Implementation History
1.  **Initial Version:** Single-set lotto generator in a single HTML file.
2.  **5-Set Update:** Expanded logic to generate and display 5 sets of numbers at once.
3.  **Premium Refactoring:**
    - Separated code into `index.html`, `style.css`, and `main.js`.
    - Implemented `LottoBall` Custom Element.
    - Switched to `oklch` color spaces for better visual vibrancy.
    - Added background noise texture and advanced CSS effects.
4.  **GitHub Synchronization:** Connected to `vibecoding` repository and resolved initial merge conflicts.

## Design Details
- **Colors:** Using `oklch` for perceptually uniform and vibrant hues.
- **Typography:** 'Outfit' for headings and 'Inter' for body text.
- **Visual Effects:** Multi-layered drop shadows and glow effects on interactive elements.
- **Animation:** Cubic-bezier curves for a natural, bouncy feel during number generation.
