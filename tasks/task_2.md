# Task 2: Core Data Models, State Store & Subject Manager with 15-Color Palette

## Overview
Implement the subject management system allowing students to create, edit, and delete semester subjects. Integrate a custom 15-distinct-color palette with automatic collision avoidance (in-use colors disabled/greyed out, auto-assignment of unused colors), and prepare data schemas for future mood tagging (fun, ok ok, hate).

## Key Deliverables
1. **TypeScript Domain Models (src/types/index.ts)**:
   - Subject: id, name, code, color, icon, moodTag (fun | ok_ok | hate), targetPercentage, notes.
   - TimeTableSlot: id, dayOfWeek (0-6), subjectId, startTime, durationHours (1-6), room.
   - AttendanceRecord: id, date (YYYY-MM-DD), slotId, subjectId, status (attended | absent | proxy | exam | exempted), durationHours, timestamp, note.
   - SettingsConfig: targetAttendance, calculationMode, notificationSettings, semesterStart, semesterEnd.

2. **15 Distinct High-Contrast Color Palette**:
   - Define 15 mathematically separated, aesthetically cohesive, high-contrast colors (Electric Coral, Acid Lime, Cyber Cyan, Royal Violet, Vivid Amber, Neon Pink, Emerald Green, Deep Tangerine, Cobalt Blue, Bright Fuchsia, Mint Turquoise, Sunburst Yellow, Indigo Ink, Crimson Red, Steel Teal).
   - Ensure none are mere tints/shades of one another.

3. **Color Picker Grid & Collision Engine**:
   - Interactive 15-swatch color picker component.
   - Grey-out and disable colors currently occupied by other subjects with tooltip indicator.
   - Auto-assign algorithm that selects the first available unused distinct color when the user doesn't pick one manually.

4. **Subject Management UI**:
   - Brutalist subject creation modal and list view.
   - Edit, rename, delete (with cascade confirmation for associated slots and records).
   - Instant live search & subject filtering.

## Acceptance Criteria
- [ ] 15 distinct colors rendered in a responsive swatch grid.
- [ ] Active subject colors are visually greyed out and unselectable by other subjects.
- [ ] Auto-assign color fallback works reliably when user adds a subject without selecting a color.
- [ ] Add, edit, delete subjects persist instantly to local storage.
