
# PromptMatrix V6.2.3

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An intuitive web application designed to help users **understand prompt engineering principles** and **construct effective, well-structured prompts** for various AI models. PromptMatrix V6.2.3 is your enhanced guide and toolkit for mastering AI communication, offering structured and interactive framework for text, image, video, and music generation. This tool is **not an AI itself**, but a powerful assistant for building and learning about prompts.

**Note on Versioning:** Starting with V5.5.0, PromptMatrix adopts Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`).

**[➡️ Live Demo (GitHub Pages) Link: https://sisigitadi.github.io/promptmatrix/](#)**

## ✨ What's New in V6.2.3 (Content Update)

This version introduces a new text framework and refines existing ones.
*   **Content Update:** Added the "STAR" framework to the Text Prompt Frameworks.
*   **Framework Refinement:** Removed the "isNew" tag from "RIDE", "SPICE", and "SOAR" frameworks.
*   **Version Update:** Application version updated to `V6.2.3`.

## ✨ What's New in V6.2.2 (Content Update)

This version introduces a new text framework and refines existing ones.
*   **Content Update:** Added the "STAR" framework to the Text Prompt Frameworks.
*   **Framework Refinement:** Removed the "isNew" tag from "RIDE", "SPICE", and "SOAR" frameworks.
*   **Version Update:** Application version updated to `V6.2.3`.

## ✨ What's New in V6.2.2 (Content Update)

This version introduces a new text framework.
*   **Content Update:** Added the "SOAR" framework to the Text Prompt Frameworks.
*   **Version Update:** Application version updated to `V6.2.2`.

## ✨ What's New in V6.2.1 (Content Update)

This version focuses on refining the available text frameworks.
*   **Content Update:** Re-added the "RIDE" framework and introduced the new "SPICE" framework to the Text Prompt Frameworks.
*   **Version Update:** Application version updated to `V6.2.1`.

## ✨ What's New in V6.2.0 (UI/UX Fixes)

This iteration of V6.2.0 focuses on UI/UX bug fixes and polish based on user feedback.

*   **UI/UX Bug Fixes & Polish:**
    *   **Mobile Subtitle Wrapping:** Fixed an issue where the app subtitle in the header could be truncated on mobile devices by ensuring proper text wrapping logic. The subtitle now correctly wraps to multiple lines if necessary on smaller screens.
    *   **Teaser Popup Reliability:** Addressed a bug where the "Premium Teaser Popup" might not appear reliably as intended on initial load after disclaimer/how-to-use modals. The trigger logic has been refined to ensure the `localStorage` flag (marking it as "shown") is set more accurately when the popup is actually scheduled to display.
    *   **Category & Framework Toggles (Reviewed):** Existing hover effects for category and framework selection buttons were reviewed. Confirmed they already provide unique and informative feedback (icon scaling, button lift, background/text color changes on hover) as per recent requests, so no structural changes were needed for these elements.
*   **Documentation:** Updated `updates.md` and `README.md` to reflect these fixes.
*   **Version:** Maintained at `V6.2.0` as these are primarily bug fixes and minor polish to existing V6.2.0 features.

## ✨ What's New in V6.2.0 (Initial Release - Premium Preparation & UI Polish)

This version focuses on clearly articulating the freemium model, preparing the UI for future premium features, and enhancing visual consistency.

*   **Premium Feature Preparation:**
    *   **Visual Distinction:** AI-powered features (Framework Finder & Researcher, Per-Field Suggestions, Overall Feedback, Detailed Analysis, AI Web Research) now use the `AiTextIcon` which changes appearance (color, animation) based on `apiKeyAvailable` (simulating premium status). When `apiKeyAvailable` is false, icons are desaturated, and animations are disabled.
    *   **Clearer User Communication:**
        *   Tooltips for disabled AI features consistently state: "Premium Feature: Subscription Required (Coming Soon)."
        *   Content in `SubscriptionInfoModal` and `TeaserPopupModal` updated to clearly explain the freemium model and the "premium features coming soon" status.
*   **UI/UX Enhancements:**
    *   The `AiTextIcon` is now the standard indicator for AI-powered functionalities, providing consistent visual feedback.
    *   Improved handling of "Other..." option in interactive single-choice dropdowns for a smoother user flow.
    *   General styling refinements for modals and interactive elements.
*   **Content Update:**
    *   Added the "AIDA" framework to the Text Prompt Frameworks.
*   **Code Cleanup:**
    *   Removed the unused `FavTextIcon.tsx` component and its imports.
*   **Version Update:** Application version updated to `V6.2.0`.

## ✨ What's New in V6.1.7 (Maintenance & Info Update)

This version focused on refining existing informational content, ensuring version consistency, and maintaining code integrity.

*   **Version Update & Consistency:** Application version updated to `V6.1.7`.
*   **Informational Content Review:** Updated content within Disclaimer, How To Use, and Learn About Premium modals.
*   **API Key Security:** Re-confirmed adherence to best practices.
*   **Code Cleanup:** Removed unused `FavTextIcon.tsx` (initial step).

## ✨ Features (Core & Enhanced in V6.2.0)

*   **Educational Focus:** Learn the "why" and "how" behind effective prompts.
*   **Multi-Framework Support:** Explore diverse prompting frameworks, plus **interactive frameworks** for image, video, and music.
*   **Interactive Prompt Studio (for Media/Music):** Step-by-step guidance with dropdowns, collapsible checkboxes, and "Other..." options.
*   **Structured Input Guidance (Text Frameworks):** Dynamically updating input fields with examples.
*   **AI-Powered Features (Premium - Subscription Coming Soon):**
    *   **AI Framework Finder & Researcher**: Get framework suggestions from the internal list OR request AI to research new techniques from the web (summaries & source links provided). Visually indicated as premium.
    *   **AI Suggestions for "Other..." Inputs & Per-Field Suggestions**: Contextual AI help, visually indicated as premium.
    *   **AI Overall Prompt Feedback & Detailed Prompt Analysis**: Visually indicated as premium.
*   **Dynamic Plan Badges:** "Free Plan" or "Premium Plan" (dev/demo active) displayed in the header.
*   **Subscription Info Modal & Teaser Popup.**
*   **Bilingual Interface:** Supports English (EN) and Indonesian (ID).
*   **Real-Time Prompt Construction & Consistent Preview.**
*   **Easy Copy-to-Clipboard & Launch AI Tool.**
*   **Saved Prompts:** Save, load, rename, delete, export, and import your prompts locally using IndexedDB.
*   **Framework Search/Filter:** Easily find the framework you need.
*   **Responsive Design & Modern Dark Theme.**
*   **Free Core Features, 'as is', respects privacy. No personal data collected. Ad-free.**

## 🖼️ Screenshots
 
<!-- TODO: Update screenshots for V6.2.3, showcasing the AiTextIcon states, premium feature indications, and new frameworks. -->
**Example Screenshot Placeholder (Replace with actual screenshots):**
![PromptMatrix V6.2.3 Screenshot](https://via.placeholder.com/800x450.png?text=PromptMatrix+V6.2.3+Content+Update)

## 🛠️ Framework Supported

PromptMatrix V6.2.0 provides structured inputs and guidance for understanding and using the following framework:

### 📜 Text Prompt Framework (Represented by <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/outline/pencil.svg" width="16" height="16"> icon):

(Uses standard component-based input. Used for crafting prompts for AI like ChatGPT, Gemini, Claude, etc.)
*   RTF, AIDA, CARE, CO-STAR, BAB, TAG, PAS, FAB, PREPARE, Google Guide, CIDI, LIMA "S", RISE, RIDE, RACE, TRACE, CRISPE, APE, STAR, CTF, TREF, GRADE, ROSES, RDIREC, RSCET, SPARK, SOAR, SPICE, IDEATE, PACT, Chain-of-Thought (CoT), Zero-shot CoT, Self-Consistency, Generated Knowledge, Least-to-Most Prompting, Self-Refine, Tree of Thoughts (ToT), Prompt Ensembling, Factive Prompting, EmotionPrompt, Prompt Chaining, Instruction Tuning Basics, Role Prompting, Few-Shot Prompting. *(Now 45 Text Frameworks)*

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
*   **AI Integration (for Premium Features):** `@google/genai` for Google Gemini API (including Google Search grounding). (Note: Future subscription will abstract this from the user).
*   **Local Storage:** IndexedDB (for Saved prompts), `localStorage` (for user preferences).
*   **State Management:** React Context API (language), React `useState` & `useCallback`.
*   **Deployment:** GitHub Pages.

## 🧑‍💻 How to Use PromptMatrix V6.2.3

PromptMatrix V6.2.1 offers core features for free, with advanced AI assistance planned as premium subscription features.

1.  **Check Your Plan:** The header displays your current plan ("Free Plan" or "Premium Plan" for dev/demo).
2.  **Select a Language:** Use the language toggle (EN/ID) in the header.
3.  **Explore Framework Category:** Click a category (Text, Media, Music).
4.  **Optional: AI Framework Finder & Researcher (Premium Feature - Subscription Coming Soon):** 
    *   The "AI Framework Finder & Researcher" section allows you to describe your goal.
    *   Click "Get Framework Suggestions" for AI to suggest relevant frameworks from the app's internal list.
    *   Click "Research Web" for AI to search the internet for new techniques related to your goal, providing summaries and source links.
    *   These features are marked with the <AiTextIcon isAiFeatureActive={true} /> icon and will require a subscription when launched.
5.  **Choose a Specific Framework:** Click a framework from the grid. Read its description.
6.  **Construct Your Prompt in "Prompt Studio":**
    *   **Text Framework:** Fill in component fields.
    *   **Media & Music Framework (Interactive):** Follow the step-by-step sections.
    *   AI suggestions per field (<AiTextIcon isAiFeatureActive={true} /> icon) are premium and will require a subscription.
7.  **Review "Prompt Preview":** Your prompt updates live.
8.  **Optional: AI Feedback & Analysis (Premium Features - Subscription Coming Soon):**
    *   "Get AI Suggestions" (<AiTextIcon isAiFeatureActive={true} />) for overall prompt feedback.
    *   "Detailed Analysis" (<AiTextIcon isAiFeatureActive={true} />) for a structured review (scores, ambiguities, etc.).
    *   These buttons are marked as premium and will require a subscription.
9.  **Copy & Launch:** Click "Copy Prompt," then "Launch AI Tool" to go to the platform or your custom URL.
10. **Save Your Work:** Use "Save Prompt" to store your creations in the "Saved prompts" panel.
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
