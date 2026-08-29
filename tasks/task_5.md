# Task 5: Lecture Interaction & Attendance Marking Workflow (5 Visual States)

## Overview
Implement the core lecture interaction where clicking a subject smoothly expands a bottom drawer/action badge tray with 5 distinct attendance options, transforming the widget into high-contrast colored borders with darkened interior backgrounds.

## Key Deliverables
1. **Single-Click Expansion Drawer / Action Tray**:
   - Smooth animated expansion at the bottom of the subject card upon click.
   - Present 5 explicit, tactile action buttons:
     1. [Attended]
     2. [Absent]
     3. [Proxy]
     4. [Exam]
     5. [Exempted / Not Counted] (Attendance not counted in monthly total, e.g. cancelled/official duty/sports leave).

2. **Visual State System (High-Contrast Border + Darkened Interior)**:
   - Implement the exact design requirements:
     - **Attended**: Emerald Green border with darkened green background (rgba(6, 78, 59, 0.75)).
     - **Absent**: Crimson Red border with darkened red background (rgba(136, 19, 55, 0.75)).
     - **Proxy**: Cyber Blue border with darkened blue background (rgba(12, 74, 110, 0.75)).
     - **Exam**: Sunburst Yellow border with darkened yellow background (rgba(120, 53, 15, 0.75)).
     - **Exempted / Not Counted**: Slate Grey border with darkened grey background (rgba(30, 41, 59, 0.75)).

3. **Micro-Interactions & Audio-Visual Feedback**:
   - Spring animation for drawer open/close.
   - Tactile badge highlighting marked state.
   - Quick undo / re-mark option if a user misclicks.

## Acceptance Criteria
- [ ] Single click on subject card expands action tray without layout distortion.
- [ ] All 5 states (Attended, Absent, Proxy, Exam, Exempted) apply correct border and darkened background tokens.
- [ ] Marking updates attendance logs immediately and recalculates daily stats in real time.
- [ ] Animated transition between states using Framer Motion.
