# Task 4: Interactive Timetable Maker (Apple Widget-Style Grid Snapping & Vertical Resizing)

## Overview
Build an intuitive, tactile, Apple-widget-inspired timetable maker with smooth grid snapping, vertical duration resizing (1hr to 6hr), horizontal day switcher, and top month progress slider.

## Key Deliverables
1. **Apple Home-Screen Style Widget Grid**:
   - Responsive, brutalist card widgets for each lecture slot.
   - Default 1:1 aspect ratio representing 1 hour duration.
   - Vertical expansion / resizing handles allowing users to dynamically stretch a lecture widget to 2hr, 3hr, 4hr, 5hr, or 6hr with instant tactile feedback.
   - Snap-to-grid alignment and visual duration indicators (e.g., '1 hr', '2 hrs', '3 hrs lab').

2. **Top Month Progress Bar & Week Slider**:
   - Visual brutalist progress meter indicating exact days/percentage of the month left.
   - Interactive week/day slider displaying days horizontally (Mon, Tue, Wed, Thu, Fri, Sat, Sun).
   - Highlighting current date with a distinct pulse badge; single-tap navigation to inspect or edit any day's timetable.

3. **Edit / Maker Mode & Interactive Controls**:
   - Quick 'Add Subject' button with drag/click into available time slots.
   - Reorder and reposition slots via intuitive micro-controls.
   - Delete slot, duplicate slot, and change subject assignment.

## Acceptance Criteria
- [ ] Timetable displays day's subjects vertically below horizontal day selector.
- [ ] Resizing widget vertically smoothly toggles duration from 1h to 6h with snapping feedback.
- [ ] Month progress bar displays remaining month progress clearly at the top.
- [ ] Adding/editing slots updates timetable instantly with smooth Framer Motion layout transitions.
