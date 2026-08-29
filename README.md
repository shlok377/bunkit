# bunkIt // attendance tracker

A minimal, neo-brutalist, offline-first attendance tracking web application built with React, TypeScript, Tailwind CSS, and Framer Motion. Designed for university students with Apple Widget-inspired spatial grid snapping, multi-scenario calculation models, and gamified bunk intelligence.

---

## ⚡ Key Features

- **Apple Widget-Style Timetable**: Spatial duration mapping ($1:1 \to 1\text{h}$, $1:2 \to 2\text{h}$, up to $6\text{h}$) with tactile grid snapping.
- **5 Tactile Attendance States**:
  - `Attended`: Emerald Green border with darkened green interior.
  - `Absent`: Crimson Red border with darkened red interior.
  - `Proxy`: Cyber Blue border with darkened blue interior.
  - `Exam`: Sunburst Yellow border with darkened yellow interior.
  - `Not Counted / Exempted`: Slate Grey border with darkened grey interior (excluded from total denominator).
- **Multi-Scenario Calculation Engine**:
  - **Scenario A (Priority)**: Monthly hourly-based attendance ($\sum\text{Attended Hours} / \sum\text{Scheduled Hours}$).
  - **Scenario B**: Lecture-count based attendance ($\text{Classes Attended} / \text{Total Classes}$).
  - **Scenario C**: Subject-wise individual compliance.
- **15-Distinct High-Contrast Color Palette**: Mathematically separated palette with active collision avoidance (in-use colors disabled, auto-assignment fallback).
- **Gamified Analytics**: Safe-to-bunk meters, catch-up recovery calculators, subject health rings, and day-of-week heatmaps.
- **100% Offline-First**: Local storage persistence, zero server latency, zero data tracking.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Neo-Brutalist design tokens, opacity depth layering)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Persistence**: LocalStorage / IndexedDB

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
