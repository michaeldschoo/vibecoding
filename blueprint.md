# AI Application Hub Blueprint

## Overview
A modern, interactive web application hub featuring utility tools like a Lotto Number Recommender and advanced AI features like an AI Object Recognizer. The project focuses on premium UI/UX, responsiveness, and performance using modern web standards.

## Project Outline
- **Entry Point:** `index.html` (Lotto Recommender)
- **AI Vision Page:** `ai_vision.html` (Teachable Machine based Object Recognizer)
- **Styling:** `style.css` (Base styles, shared variables, premium effects)
- **Logic:** 
    - `main.js` (Lotto logic, Web Components)
    - `vision.js` (AI model loading, webcam management, classification)
- **Features:**
    - **Lotto Recommender:** Generates 5 unique sets of 6 numbers with smooth animations.
    - **AI Object Recognizer:** 
        - Real-time webcam classification using Google Teachable Machine.
        - Premium Dashboard UI for AI results.
        - Visual feedback with confidence levels.
    - **Web Components:** Reusable `lotto-ball` and potential `ai-indicator` components.
    - **Premium UI:** OKLCH color palette, noise texture, deep shadows, and glassmorphism.

## Implementation History
1.  **Lotto Recommender:** Initial implementation with 5-set generation and premium design.
2.  **AI Vision Expansion:**
    - Created `ai_vision.html` with a dedicated layout for webcam and AI results.
    - Integrated Teachable Machine Image model via `vision.js`.
    - **Improved Camera Handling:** Implemented "Manual Connect" flow to prevent initialization errors and improve privacy.
    - Implemented "Vision Dashboard" with real-time classification bars and scanning effects.
    - Established navigation between Lotto and AI Vision pages.

## Design Details
- **Colors:** OKLCH palette (`primary: 260`, `secondary: 320`, `accent: 150`).
- **Typography:** 'Outfit' for headings, 'Inter' for body.
- **AI Vision UI:**
    - **Setup State:** Dedicated setup screen with a "Connect Camera" button for a controlled user experience.
    - Centered camera preview with a futuristic "scanning" overlay.
    - Floating result cards with progress bars representing model confidence.
    - Smooth transitions between recognition states.

## Current Plan: AI Object Recognizer Implementation
1.  **Preparation:** Define the Teachable Machine model URL: `https://teachablemachine.withgoogle.com/models/fmEk41nx-/`.
2.  **HTML Setup (`ai_vision.html`):**
    - Link to TensorFlow.js and Teachable Machine libraries via CDN.
    - Structure for Camera Preview and Results Display.
3.  **Styling (`style.css` updates):**
    - Add styles for the webcam container, scanning animation, and result bars.
4.  **Logic (`vision.js`):**
    - Load the model from the URL.
    - Request webcam access and start the prediction loop.
    - Update the UI with class names and confidence levels.
5.  **Navigation:** Add a simple, premium navigation toggle or link to switch between apps.
