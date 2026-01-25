# 🥋 Apex BJJ: The 4-Step Mastery System

**Apex BJJ** is a React Native mobile application designed to accelerate Brazilian Jiu-Jitsu progression. By moving away from mindless rolling and toward a structured, 4-step learning loop, it helps practitioners turn mat time into measurable growth.

## 🚀 Key Features

* **🎯 4-Week Targeted Missions**: Break through plateaus with hyper-focused training on specific positions.
* **🎙️ Voice-First Logging**: Record 60-second post-training reflections with automated transcription (Mock AI).
* **📊 Performance Analytics**: Visualize your journey through escape-rate charts, heatmaps, and session history.
* **🤖 Weekly AI Coaching**: Receive synthetic intelligence feedback that identifies recurring bottlenecks and suggests technical fixes.
* **🏆 Milestone Celebrations**: Track mission completion and maintain your "flow state" by cycling into new objectives.

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | React Native (Expo SDK 54) |
| **Language** | TypeScript |
| **Navigation** | Expo Router (File-based) |
| **UI Library** | React Native Paper |
| **Storage** | AsyncStorage (Local Persistence) |
| **Media/Charts** | expo-av, react-native-chart-kit |

---

## 🏃 Getting Started

### Prerequisites

* Node.js 18+
* npm or yarn
* **Expo Go** app (optional for physical device testing)

### Installation & Launch

1. **Clone & Install:**
```bash
npm install

```


2. **Start Bundler:**
```bash
npm start

```


3. **Select Platform:**
* `i` for iOS Simulator | `a` for Android Emulator | **Scan QR** for Physical Device



---

## 📱 The "Apex" Flow

1. **Onboarding:** Define your rank, frequency, and "bottleneck" positions.
2. **Mission Launch:** The app generates a 4-week roadmap with incremental goals.
3. **Mat Sessions:** Log data via voice or quick-tap entry immediately after class.
4. **Data Analysis:** Review trends in your escape rates and training consistency.
5. **The Review:** Every week, get a mock-AI breakdown of what's holding you back.
6. **Evolve:** Complete the mission, earn the "badge," and pick your next target.

---

## 📂 Project Architecture

```bash
app/                # File-based routing (Auth, Tabs, Training, Review)
components/         # Atomic UI and specialized Card components
context/            # Global state management (Auth, Training Data)
utils/              # Mock AI logic and helper functions
types/              # Strict TypeScript definitions
constants/          # BJJ-inspired Dark Theme & config

```

---

## 🏗️ Future Roadmap (Backend Integration)

Currently, Apex BJJ is a **high-fidelity frontend prototype**. The next phase of development includes:

* **Authentication:** Supabase Auth integration.
* **Production AI:** Replacing mock data with OpenAI Whisper (Voice) and GPT-4 (Analysis).
* **Persistence:** Migrating AsyncStorage to Supabase/Postgres.
* **Monetization:** Integrating RevenueCat for premium mission tracking.

---

## 🧪 Testing Notes

* **Simulated AI:** Voice logs return random mock transcripts after 2 seconds to simulate processing.
* **Deep Linking:** Test the weekly review logic directly via `/review/weekly?weekNumber=2`.
* **UX Features:** Includes haptic feedback and a BJJ-inspired "Midnight Blue" dark theme.

---
