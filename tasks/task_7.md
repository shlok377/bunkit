# Task 7: Today's Landing Dashboard & Navigation Bar

## Overview
Develop the high-impact Today landing view featuring a minimal staggered list of today's lectures, date header, live day progress, quick attendance actions, and a sleek animated bottom navigation bar.

## Key Deliverables
1. **Landing Page Header**:
   - Day of week (e.g. 'FRIDAY'), full date ('28 AUGUST'), and academic week indicator.
   - Daily attendance health badge (e.g. '3 of 5 marked', '100% today').
   - Quick toggle for Day View vs Week View.

2. **Staggered Animated Lecture Cards**:
   - Staggered entrance animation for today's lectures using Framer Motion (staggerChildren: 0.08).
   - Minimalist brutalist card layout with subject color accent strip, room name, time slot, and duration badge.
   - Direct inline interaction drawer with the 5 visual status states.
   - Empty state illustration if today has no scheduled lectures ('Free Day / Weekend').

3. **Floating Bottom Navigation Bar**:
   - Brutalist floating navigation dock with 4 primary destinations:
     - [Today] (Home / Daily Lecture Queue)
     - [Analytics] (Stats, Gauges & Bunk Intelligence)
     - [Time Table] (Widget Maker & Week Grid)
     - [Settings] (Customizable Variables & Data Tools)
   - Micro-animated icon state changes and active pill indicator.

## Acceptance Criteria
- [ ] Today view presents staggered animation on mount.
- [ ] Quick marking directly from the Today view updates states seamlessly.
- [ ] Bottom navigation provides fast switching with smooth active state indicators.
- [ ] Responsive layout adapts cleanly from mobile viewport to desktop.
