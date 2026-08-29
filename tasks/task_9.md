# Task 9: Centralized Settings Store, Customization Hub & Data Portability

## Overview
Implement the full settings page and configuration architecture, exposing every customizable variable from src/config/settings.ts to the UI, alongside complete JSON backup, restore, and demo data seeding.

## Key Deliverables
1. **Configurable Variables UI**:
   - Minimum attendance target slider (50% to 90%, default 75%).
   - Warning threshold slider (default 65%).
   - Default attendance calculation scenario selector (Hourly vs Lecture-Count vs Subject-Wise).
   - College working days selector (Mon-Fri or Mon-Sat).
   - Semester start date and end date picker.
   - Default slot duration (1 hour to 3 hours).

2. **Centralized Settings State (src/store/settingsStore.ts)**:
   - Reactive store backed by local storage.
   - Instant propagation of settings changes across the entire app without full page reload.

3. **Data Management & Backup/Restore**:
   - One-click 'Export Data (JSON)' to download full timetable, subjects, and attendance history.
   - 'Import Data (JSON)' with schema validation and conflict resolution.
   - 'Load Sample College Timetable' button to allow instant evaluation with pre-filled subjects and realistic logs.
   - 'Reset All Data' button with double-confirmation modal.

## Acceptance Criteria
- [ ] Changing target percentage in Settings immediately recalculates analytics and gauges across the app.
- [ ] Export JSON creates valid downloadable file; Import JSON successfully restores complete application state.
- [ ] Sample data loader populates realistic subjects, timetable, and attendance history in 1 click.
- [ ] Clean brutalist controls with clear feedback and zero reload requirements.
