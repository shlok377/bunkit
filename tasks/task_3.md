# Task 3: Time Table Data Architecture & Weekly Schedule Engine

## Overview
Develop the decoupled weekly timetable data structure that connects repeating weekly templates with date-specific attendance logs, supporting variable lecture durations (1 to 6 hours) mapped to widget aspect ratios.

## Key Deliverables
1. **TimeTable Engine & Slot Logic**:
   - Weekly template representation (Monday through Sunday or College Working Days).
   - Support for duration ratios: 1:1 (1 hour), 1:2 (2 hours), 1:3 (3 hours), up to 1:6 (6 hours).
   - Time calculations: Automatic computation of start time and end time based on slot position and duration.

2. **Decoupled Architecture (Template vs Instance)**:
   - Weekly Schedule Template: Master blueprint of recurring classes.
   - Date-Specific Attendance Instances: Daily materialized logs for any given calendar date.
   - Support for schedule exceptions: holiday overrides, extra classes, cancelled days without corrupting the recurring weekly template.

3. **Calendar Date Navigation & Month Progress Math**:
   - Helper utilities to compute:
     - Current week days and active selected day.
     - Elapsed days vs remaining days in the active month.
     - Percentage of month remaining (((daysInMonth - currentDay) / daysInMonth) * 100).
     - Next / previous day and week traversals.

## Acceptance Criteria
- [ ] Weekly timetable slots represent 1 to 6 hour durations cleanly.
- [ ] Date-specific instances inherit from weekly templates while allowing date-specific overrides.
- [ ] Month progress math accurately calculates remaining month percentage for all months (including leap years).
