# EatWell: AI Health & Nutrition Platform 🥗🤖

EatWell is a modern, responsive React web application designed to help users identify and track their meals seamlessly, understand their daily caloric needs, and get early insights into potential nutritional deficiencies. Leveraging advanced AI tools (like Google Gemini and TensorFlow), EatWell makes nutritional awareness and health management effortless.

---

## 🌟 Core Features

### 1. **Spectral Vision AI Food Scanner**
*   **Photo to Macros:** Upload or capture an image of your food, and EatWell's AI (powered by Gemini and TensorFlow's MobileNet) will analyze it to provide a detailed caloric and macronutrient breakdown (Protein, Carbs, Fats) with confidence scores.
*   **Premium Mobile Experience:** On mobile devices, the app provides a sleek, native-feeling bottom-sheet modal allowing users to intuitively choose between "Take Photo" (via the direct device camera) or "Choose from Gallery".

### 2. **Automated Calorie Need Calculation**
*   **Smart Baselines:** Automatically calculates your Basal Metabolic Rate (BMR) and daily caloric needs based on user profiles and activity levels.
*   **Goal Tracking:** Adjusts recommended intake for weight loss, maintenance, or weight gain goals.

### 3. **AI Clinical Symptom Checker (Upcoming)**
*   **Deficiency Analysis:** Analyzes user-reported clinical symptoms to suggest possible vitamin or mineral deficiencies.
*   **Adaptive Follow-ups:** Asks intelligent follow-up questions to refine its suggestions and provide triage guidance (always accompanied by medical disclaimers).

### 4. **Dynamic Nutrition Dashboard**
*   Clear and actionable metrics for daily Calories, Protein, Carbs, and Fats.
*   Allows manual correction of AI-detected foods to ensure perfect accuracy.

---

## 💡 Benefits

*   **Frictionless Tracking:** Removes the tedious process of searching databases for food items. Just snap a picture and get your macros instantly.
*   **Holistic Health View:** Goes beyond simple calorie counting by integrating symptom analysis, providing early warning signs for nutritional gaps.
*   **Premium User Experience:** Features a fully responsive, glassmorphic UI with smooth Framer Motion animations that feels like a native app on both desktop and mobile.
*   **Privacy-First:** Designed with user consent and data security in mind, especially concerning health data and images.

---

## 🛠️ Problems It Solves

1.  **The Hassle of Food Logging:** Traditional calorie counting apps require manual text entry and weighing, which leads to high drop-off rates. EatWell solves this through AI visual estimation.
2.  **Ignorance of Nutritional Deficiencies:** Many people track macros but ignore micronutrients. The integrated symptom checker helps bridge the gap between "what I eat" and "how I feel".
3.  **Clunky Mobile Web Apps:** By utilizing custom bottom sheets and native camera APIs, EatWell overcomes the typically clunky mobile web experience.

---

## 🚀 Impact

EatWell empowers users to take control of their health without the administrative burden of traditional tracking. By lowering the barrier to entry for food logging and providing actionable insights into potential deficiencies, it promotes long-term adherence to healthy eating habits. The platform acts as a daily companion for nutritional awareness rather than just a passive database.

---

## 💻 Tech Stack

- **Frontend Framework:** [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) with custom glassmorphism effects
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Integration:** `@google/generative-ai` (Gemini) & `@tensorflow/tfjs`
- **Deployment & Backend:** Firebase (Hosting, Auth, Firestore)
- **Forms & Validation:** React Hook Form

## ⚙️ Run Locally

1. Clone the repository.
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Configure your environment variables in \`.env\`.
4. Run the development server with local network access (to test mobile functionality):
   \`\`\`bash
   npm run dev -- --host
   \`\`\`
5. Access the app on your desktop at \`http://localhost:5173\` or on your mobile device via the network IP provided by Vite.

---
*Note: The symptom checker and medical suggestions are for informational purposes only and do not replace professional medical advice.*
