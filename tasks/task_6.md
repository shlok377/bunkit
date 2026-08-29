# Task 6: Multi-Scenario Attendance Calculation Engine & Bunk Intelligence

## Overview
Build a comprehensive attendance calculation engine that accurately handles all college computation models (prioritizing hourly-based calculation), multi-subject statistics, proxy separation, exam tracking, and a smart bunk/catch-up calculator.

## Key Deliverables
1. **Scenario Calculation Models**:
   - **Scenario A (Priority - Hourly Based)**:
     Total Attended Hours / (Total Scheduled Hours - Exempted Hours) * 100.
   - **Scenario B (Class/Lecture Count Based)**:
     Total Classes Attended / (Total Scheduled Classes - Exempted Classes) * 100.
   - **Scenario C (Subject-Wise Individual Tracking)**:
     Calculate each subject's standalone attendance percentage, attended vs total hours, and compliance with the target (e.g. 75%).
   - **Exempted Hours Handling**:
     Accurately deduct cancelled or exempted lectures from the denominator so students are not penalized.

2. **Smart Bunk & Catch-Up Intelligence Engine**:
   - **Safe-to-Bunk Calculator**: Given target T (e.g. 75%), calculate maximum hours/classes the student can bunk while staying above T.
   - **Catch-Up Calculator**: If attendance falls below T, calculate exact consecutive hours/classes student must attend to recover.

3. **Proxy & Genuine Attendance Dissection**:
   - Track genuine attended hours vs proxy-assisted hours.
   - Provide an honest breakdown (e.g., '78% Official Attendance with 12% Proxy Reliance').

## Acceptance Criteria
- [ ] Engine accurately calculates Hourly (Scenario A), Class Count (Scenario B), and Subject-wise (Scenario C).
- [ ] Exempted lectures are strictly excluded from the total denominator.
- [ ] Safe-to-bunk and catch-up formulas give 100% mathematically correct integer results across edge cases.
- [ ] Pure unit-testable calculation utilities with zero side effects.
