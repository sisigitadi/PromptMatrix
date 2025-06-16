
# PromptMatrix - Feature & Update Log

This document provides a history of major features and updates to the PromptMatrix application, helping users understand its evolution and current capabilities.

---

## V6.0.0 (Latest Major Update)
*   **🔬 AI-Powered Detailed Prompt Analysis (API Key Req.):**
    *   Introduced a new "Detailed Analysis" feature for generated prompts.
    *   AI (Gemini) provides a structured breakdown including:
        *   Clarity Score (1-10).
        *   Specificity Score (1-10).
        *   Identification of Potential Ambiguities.
        *   Actionable Suggestions for improvement.
        *   Overall Assessment of the prompt.
    *   Accessible via a new "Detailed Analysis 📊" button in the Prompt Preview panel.
*   **General:** Continued minor UI/UX refinements and code maintenance.

---

## V5.5.0
*   **Documentation:**
    *   Created `updates.md` file (this file) for a comprehensive feature and update log.
    *   Updated footer version to V5.5.0.
    *   Created `release-notes.md` for detailed technical release information.
    *   Adopted Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`).
*   **Minor UI:** Adjustments to align with SemVer and documentation updates.

---

## V5.1 - V5.4 (Incremental Enhancements)

This period focused on data management enhancements, usability improvements, and refining existing features.

*   **Data Management:**
    *   **Export/Import for Prompt Stash:**
        *   Added functionality to export all saved prompts from the "Prompt Stash" into a single JSON file (`promptmatrix_stash_backup.json`).
        *   Allowed users to import prompts from a previously exported JSON file back into their stash.
        *   Toast notifications confirm successful export/import or indicate errors.
*   **User Experience (UX):**
    *   **Favorite Frameworks:**
        *   Users can mark/unmark frameworks as "favorites" using a star icon.
        *   Favorited frameworks are visually distinct and sorted to appear at the top of their respective category list.
        *   Favorite status is persisted in `localStorage`.
    *   **Accessibility:** Continued focus on ARIA attributes for better screen reader support.
*   **Code & Logic:**
    *   Refinements to the interactive prompt assembly logic for cleaner and more accurate prompt generation.
    *   Updated `README.md` and `LICENSE.md` for clarity and completeness.
    *   General code cleanup and minor bug fixes.

---

## V5.0 - Data Management & Major UX Polish

This version marked a significant step in making PromptMatrix a more robust and user-friendly tool for managing and creating prompts.

*   **Core Feature - Prompt Stash (My Prompt Stash):**
    *   Implemented local prompt storage using **IndexedDB**.
    *   Users can **Save** their crafted prompts.
    *   A dedicated "Prompt Stash" panel allows users to:
        *   View a list of saved prompts with details (name, framework, date, preview).
        *   **Load** saved prompts back into the editor.
        *   **Rename** saved prompts.
        *   **Delete** saved prompts (with confirmation).
    *   This feature is available regardless of API key status.
*   **Framework Navigation:**
    *   Added a **Search/Filter bar** above the framework list to quickly find frameworks by name or description.
*   **User Feedback:**
    *   Implemented **Toast Notifications** for actions like saving, loading, deleting prompts, and for errors.
*   **UI & Styling:**
    *   Introduced more sophisticated animations and visual feedback for button clicks and UI interactions.
    *   Improved layout for new panels (Prompt Stash).
    *   Enhanced non-copyable placeholder text styling for better clarity.
    *   Consistent prompt preview logic, showing instructional text until significant user input.

---

## V4.0 - Interactive Prompt Studio & Advanced AI

This was a transformative update, revolutionizing how users interact with Media and Music frameworks and expanding AI capabilities.

*   **Revolutionized Prompt Creation - Interactive Prompt Studio:**
    *   All **Image, Video, and Music frameworks** converted to use a new **Interactive Prompt Builder**.
    *   Guides users step-by-step with diverse input types:
        *   **Manual Input:** For free-form descriptions.
        *   **Single-Choice (Dropdowns):** For parameters with common options, including an "Other..." option that reveals a manual text input.
        *   **Multiple-Choice (Collapsible Checkboxes):** For elements with multiple selectable options, presented in a space-saving collapsible format.
*   **Enhanced AI Integration (Requires API Key):**
    *   **AI Framework Suggester:** Users can describe their goal, and AI suggests relevant frameworks, visually highlighted in the UI.
    *   **AI Suggestions for "Other..." Inputs:** Contextual AI help when "Other..." is selected in interactive dropdowns.
    *   Existing AI features (per-field suggestions, overall prompt feedback) were refined.
*   **UI/UX Overhaul:**
    *   **Dynamic API Key Status Indicator:** Header now clearly shows "AI Inside" (or similar) if an API key is active, or "Disconnected" if not, with distinct styling and animation.
    *   Refined collapsible panel behavior for main input/output areas.
    *   Improved visual consistency and aesthetics across the application.
    *   More intelligent prompt assembly logic for interactive frameworks, producing cleaner outputs in the "Prompt Preview."

---

## V3.0 - AI Integration (Early Features)

Introduced the first set of AI-powered assistance features, dependent on a user-provided Google Gemini API Key.

*   **AI-Powered Prompt Enhancement (API Key Dependent):**
    *   **Overall Prompt Feedback:** Button ("Get AI Suggestions" or similar) to submit the generated prompt to Gemini for analysis and feedback on strengths, weaknesses, and suggestions.
    *   **Per-Field Suggestions (Text Frameworks):** AI-powered autocomplete/suggestions for individual input fields in text-based frameworks.
*   **User Guidance & Transparency:**
    *   Clear visual and functional disabling of AI features if no API key is detected.
    *   **Disclaimer Modal:** Introduced to inform users about the tool's purpose, AI feature dependency, and privacy.
    *   **How-To-Use Modal:** Added a guided tour of the application's features and workflow, including a visual diagram.

---

## V2.0 - Media & Music Frameworks Introduced

Expanded the scope of PromptMatrix beyond text-based prompts.

*   **New Framework Categories:** Added "Media" (for Image & Video AI) and "Music" (for Music & Audio AI) categories.
*   **Initial Framework Structures:** Provided foundational, non-interactive (component-based) frameworks for popular media and music AI tools like Midjourney, DALL-E, Suno AI, etc.
*   **Tool Links:** Integrated direct links to the official websites/platforms for many of the supported AI tools.

---

## V1.0 - Core Conception & Text Frameworks

The initial release of PromptMatrix, establishing its core purpose as an educational tool for prompt engineering.

*   **Educational Goal:** Designed to help users learn and understand the principles of effective prompt construction.
*   **Text Prompt Frameworks:** Focused on well-known text-based prompting methodologies (e.g., RTF, TRACE, CARE, TAG).
*   **Component-Based Input:** Users fill in distinct components of a chosen framework.
*   **Real-Time Prompt Preview:** Dynamically generated prompt output based on user inputs.
*   **Core Functionality:**
    *   Copy to Clipboard for easy transfer of prompts.
    *   Bilingual Interface (English & Indonesian).
    *   Responsive Design with a Dark Theme.
*   **Static Content:** Frameworks and examples were primarily hardcoded.
*   **No AI Integration:** Functioned purely as a local, client-side tool for prompt construction and learning.

---
*This log is intended to be a high-level overview. Specific sub-versions might have included minor bug fixes and UI tweaks not detailed exhaustively here.*
