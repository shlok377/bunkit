# Task 1: Foundation, Brutalist Design System & Global Settings Configuration

## Overview
Set up the React + Vite + TypeScript application foundation, establish the minimal neo-brutalist design system (clean bold borders, high-contrast typography, opacity-based depth layering without blur), and configure the centralized settings/variables store for instant customizability.

## Key Deliverables
1. **Vite + React + TypeScript Project Setup**:
   - Initialize Vite project with React and TypeScript.
   - Install dependencies: tailwindcss, lucide-react, framer-motion, clsx, tailwind-merge, canvas-confetti.
   - Setup project structure with clean modular architecture (components, store, types, config, utils, views).

2. **Neo-Brutalist Theme & Design Tokens**:
   - Pure high-contrast palette with deep pitch blacks, stark whites, structured grays, and bold accent borders.
   - Opacity-based layering (bg-opacity, backdrop-opacity, layered borders) avoiding fuzzy glassmorphism.
   - Custom utility classes for snappy widget borders, brutalist drop shadows (4px 4px 0px #000), tactile press effects.

3. **Centralized Settings Configuration (src/config/settings.ts)**:
   - Define all customizable variables in an easily editable configuration file:
     - Default attendance criteria (75%).
     - Critical warning threshold (65%).
     - Default lecture duration (1 hour).
     - Max lecture duration (6 hours).
     - Color definitions and theme tokens.
     - Attendance status presets and color mappings.
     - Calculation mode priorities (Hourly vs Lecture-count vs Subject-wise).
     - Subject mood tags (fun, ok ok, hate).

4. **Persistent Local Storage / Offline Base Adapter**:
   - Safe localStorage/IndexedDB wrapper with schema versioning and initial state hydration.

## Acceptance Criteria
- [ ] React + TypeScript app initializes and runs locally with zero build errors.
- [ ] Tailwind configured with brutalist tokens, opacity levels, and typography.
- [ ] Central settings.ts provides complete default parameters ready for the Settings page.
- [ ] Local storage state loads and persists without data loss across reloads.
