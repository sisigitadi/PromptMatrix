
# PromptMatrix V6.0.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An intuitive web application designed to help users **understand prompt engineering principles** and **construct effective, well-structured prompts** for various AI models. PromptMatrix V6.0.0 is your enhanced guide and toolkit for mastering AI communication, offering structured and interactive framework for text, image, video, and music generation. This tool is **not an AI itself**, but a powerful assistant for building and learning about prompts.

**Note on Versioning:** Starting with V5.5.0, PromptMatrix adopts Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`).

**[➡️ Live Demo (GitHub Pages) Link: https://sisigitadi.github.io/promptmatrix/](#)**

## ✨ What's New in V6.0.0 (Major Update!)

PromptMatrix V6.0.0 introduces a refined Freemium model and prepares for future subscription-based AI features:

*   **Freemium Model with Premium AI Teasers:**
    *   Core prompt building and management features remain **free**.
    *   All **AI-powered features** (Framework Suggester, Per-Field Suggestions, Overall Feedback, Detailed Analysis) are now presented as **premium features** that will require a **PromptMatrix subscription in the future**.
    *   Currently, for development and demonstration, these AI features are active if a development API key is configured. Users will see a **"Premium Plan" badge** in this case. Otherwise, a **"Free Plan" badge** is shown, and AI features are visibly disabled with tooltips indicating they are upcoming premium offerings.
    *   A new **Subscription Info Modal** explains the free vs. premium features and the upcoming subscription model.
    *   A brief **Teaser Popup** appears once after initial modals to highlight upcoming premium AI capabilities.
*   **🔬 AI-Powered Detailed Prompt Analysis (Premium Feature - Subscription Coming Soon):**
    *   Users can request a **Detailed Analysis** of their generated prompt.
    *   AI (Gemini) provides a structured breakdown including: Clarity Score, Specificity Score, Potential Ambiguities, Actionable Suggestions, and Overall Assessment.
    *   Accessible via a "Detailed Analysis" button in the Prompt Preview panel (disabled on Free Plan).

*   **Continued UI/UX Refinements:**
    *   Ongoing minor improvements to ensure a smooth and intuitive user experience.
    *   Maintained focus on code quality and structural integrity.

## ✨ Features (Core & Enhanced in V6.0.0)

*   **Educational Focus:** Learn the "why" and "how" behind effective prompts.
*   **Multi-Framework Support:** Explore diverse prompting framework, plus **interactive framework** for image, video, and music.
*   **Interactive Prompt Studio (for Media/Music):** Step-by-step guidance with dropdowns, collapsible checkboxes, and "Other..." options.
*   **Structured Input Guidance (Text Frameworks):** Dynamically updating input fields with examples.
*   **AI-Powered Features (Premium - Subscription Coming Soon):**
    *   **AI Framework Suggester**
    *   **AI Suggestions for "Other..." Inputs**
    *   **AI Per-Field Suggestions**
    *   **AI Overall Prompt Feedback**
    *   **NEW: AI Detailed Prompt Analysis** (Scores for clarity & specificity, ambiguities, suggestions)
*   **Dynamic Plan Badges:** "Free Plan" or "Premium Plan" (dev/demo active) displayed in the header.
*   **Subscription Info Modal & Teaser Popup.**
*   **Bilingual Interface:** Supports English (EN) and Indonesian (ID).
*   **Real-Time Prompt Construction & Consistent Preview.**
*   **Easy Copy-to-Clipboard & Launch AI Tool.**
*   **Prompt Stash:** Save, load, rename, delete, export, and import your prompts locally using IndexedDB.
*   **Favorite Frameworks:** Mark your most-used frameworks for quick access.
*   **Framework Search/Filter:** Easily find the framework you need.
*   **Responsive Design & Modern Dark Theme.**
*   **Free Core Features, 'as is', respects privacy. No personal data collected. Ad-free.**

## 🖼️ Screenshots

<!-- TODO: Update screenshots for V6.0.0, showcasing the new Freemium model, badges, and disabled AI features. -->
**Example Screenshot Placeholder (Replace this):**
![PromptMatrix V6.0.0 Screenshot](https://via.placeholder.com/800x450.png?text=PromptMatrix+V6.0.0+Freemium+UI)

## 🛠️ Framework Supported

PromptMatrix V6.0.0 provides structured inputs and guidance for understanding and using the following framework:

### 📜 Text Prompt Framework (Represented by <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/outline/pencil.svg" width="16" height="16"> icon):

(Uses standard component-based input. Used for crafting prompts for AI like ChatGPT, Gemini, Claude, etc.)
*   RTF, CARE, CO-STAR, BAB, TAG, AIDA, PAS, FAB, PREPARE, Google Guide, CIDI, LIMA "S", RISE, RACE, TRACE, CRISPE, APE, STAR, CTF, TREF, GRADE, ROSES, RDIREC, RSCET, IDEATE, PACT. *(26 Framework)*

### 🖼️ Image & Video Prompt Framework (Represented by <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/outline/camera.svg" width="16" height="16"> icon):

**(INTERACTIVE)** (Used for crafting prompts for AI like Midjourney, DALL-E, Stable Diffusion, Runway, Pika, etc.)
*   Midjourney (Interactive)
*   DALL-E 3 (Interactive)
*   Stable Diffusion (Interactive)
*   Leonardo.Ai (Detailed Interactive)
*   Adobe Firefly (Detailed Interactive)
*   Ideogram (Detailed Interactive)
*   Runway Gen-2 (Video - Interactive)
*   Pika Labs (Video - Detailed Interactive)
*   OpenAI Sora (Video - Detailed Interactive)
*   Google Veo (Video - Interactive)
*   Playground AI (Detailed Interactive)
*   Canva Magic Media (Detailed Interactive)
*   Kaiber.ai (Video - Detailed Interactive)
*   NightCafe Creator (Detailed Interactive)
*   Clipdrop (Stability AI - Detailed Interactive)

### 🎵 Music Prompt Framework (Represented by <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/outline/musical-note.svg" width="16" height="16"> icon):
**(INTERACTIVE)** (Used for crafting prompts for AI like Suno, Udio, Google MusicFX, etc.)
*   Suno AI Music (Interactive)
*   Udio AI Music (Detailed Interactive)
*   Google MusicFX (Detailed Interactive)
*   Stable Audio (Stability AI - Detailed Interactive)
*   Mubert (Detailed Interactive)

## 🚀 Technologies Used

*   **Frontend:** React, TypeScript
*   **Styling:** Tailwind CSS (via CDN and custom CSS for theme variables & animations)
*   **Build Tool:** Vite
*   **AI Integration (for Premium Features):** `@google/genai` for Google Gemini API. (Note: Future subscription will abstract this from the user).
*   **Local Storage:** IndexedDB (for Prompt Stash), `localStorage` (for user preferences).
*   **State Management:** React Context API (language), React `useState` & `useCallback`.
*   **Deployment:** GitHub Pages.

## 🧑‍💻 How to Use PromptMatrix V6.0.0

PromptMatrix V6.0.0 offers core features for free, with advanced AI assistance planned as premium subscription features.

1.  **Check Your Plan:** The header displays your current plan ("Free Plan" or "Premium Plan" for dev/demo).
2.  **Select a Language:** Use the language toggle (EN/ID) in the header.
3.  **Explore Framework Category:** Click a category (Text, Media, Music).
4.  **Optional: AI Framework Suggestions (Premium Feature - Subscription Coming Soon):** The "AI Framework Finder" section allows you to describe your goal. If on a premium plan (future), AI will suggest frameworks.
5.  **Choose a Specific Framework:** Click a framework from the grid. Read its description.
6.  **Construct Your Prompt in "Prompt Studio":**
    *   **Text Framework:** Fill in component fields.
    *   **Media & Music Framework (Interactive):** Follow the step-by-step sections.
    *   (Premium AI suggestions per field will be available with a subscription).
7.  **Review "Prompt Preview":** Your prompt updates live.
8.  **Optional: AI Feedback & Analysis (Premium Features - Subscription Coming Soon):**
    *   "Get AI Suggestions" 💡 for overall prompt feedback.
    *   "Detailed Analysis" 📊 for a structured review (scores, ambiguities, etc.).
    *   These buttons will be active if you have a premium subscription (future).
9.  **Copy & Launch:** Click "Copy Prompt," then "Launch AI Tool" to go to the platform or your custom URL.
10. **Save Your Work:** Use "Save Prompt" to store your creations in the "Saved Prompts" panel.
11. **Learn About Premium:** Click "Learn about Premium" in the header to see details about free and upcoming premium features.
12. **Learn & Iterate:** Experiment! Use the "How To Use" button in the header for a detailed guide.

## 💡 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/sisigitadi/promptmatrix/issues).

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📧 Contact

Developed by **Sigit Adi**
*   Email: `si.sigitadi@gmail.com`
*   GitHub: [https://github.com/sisigitadi](https://github.com/sisigitadi)
*   Project Repository: [https://github.com/sisigitadi/promptmatrix](https://github.com/sisigitadi/promptmatrix)
