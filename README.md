
# PromptMatrix V6.2.3 - Toolkit Cerdas untuk Prompt Engineering

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Aplikasi web intuitif yang dirancang untuk membantu pengguna **memahami prinsip-prinsip *prompt engineering*** dan **menyusun *prompt* yang efektif dan terstruktur** untuk berbagai model AI. PromptMatrix adalah asisten andal Anda untuk menguasai komunikasi AI, menawarkan kerangka kerja terstruktur dan interaktif untuk pembuatan teks, gambar, video, dan musik.

**Note on Versioning:** Starting with V5.5.0, PromptMatrix adopts Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`).

**[➡️ Live Demo (GitHub Pages) Link: https://sisigitadi.github.io/promptmatrix/](#)**

## ✨ Apa yang Baru di V6.2.3

Versi ini berfokus pada pembaruan konten dan perbaikan minor.
*   **Konten Baru:** Menambahkan framework "STAR" untuk prompt teks.
*   **Penyempurnaan:** Menghapus penanda "Baru" dari beberapa framework yang sudah ada.
*   **Perbaikan UI/UX (dari V6.2.0):** Memperbaiki *text wrapping* di perangkat seluler dan meningkatkan keandalan popup.

Untuk riwayat pembaruan yang lengkap, silakan lihat file **Feature & Update Log (`updates.md`)**.

## ✨ Fitur Utama

*   **Fokus Edukasi:** Pelajari "mengapa" dan "bagaimana" di balik prompt yang efektif.
*   **Dukungan Multi-Framework:** Jelajahi beragam kerangka kerja, termasuk **framework interaktif** untuk gambar, video, dan musik.
*   **Interactive Prompt Studio (for Media/Music):** Step-by-step guidance with dropdowns, collapsible checkboxes, and "Other..." options.
*   **Fitur Berbasis AI (Premium - Segera Hadir):**
    *   **Pencari & Peneliti Framework AI**: Dapatkan saran framework atau minta AI untuk meneliti teknik baru dari web.
    *   **Saran AI Kontekstual**: Bantuan AI untuk setiap isian dan analisis prompt mendalam.
    *   Semua fitur AI ditandai dengan jelas di UI.
*   **Dynamic Plan Badges:** "Free Plan" or "Premium Plan" (dev/demo active) displayed in the header.
*   **Subscription Info Modal & Teaser Popup.**
*   **Bilingual Interface:** Supports English (EN) and Indonesian (ID).
*   **Real-Time Prompt Construction & Consistent Preview.**
*   **Easy Copy-to-Clipboard & Launch AI Tool.**
*   **Saved Prompts:** Save, load, rename, delete, export, and import your prompts locally using IndexedDB.
*   **Framework Search/Filter:** Easily find the framework you need.

<!-- TODO: Update screenshots for V6.2.0, showcasing the AiTextIcon states and premium feature indications. -->
**Example Screenshot Placeholder (Replace this):**
![PromptMatrix V6.2.0 Screenshot](https://via.placeholder.com/800x450.png?text=PromptMatrix+V6.2.0+UI+Fixes)

## 🛠️ Framework Supported

PromptMatrix menyediakan input terstruktur dan panduan untuk memahami dan menggunakan kerangka kerja berikut:

### 📜 Framework Prompt Teks

(Uses standard component-based input. Used for crafting prompts for AI like ChatGPT, Gemini, Claude, etc.)
*   RTF, AIDA, CARE, CO-STAR, BAB, TAG, PAS, FAB, PREPARE, Google Guide, CIDI, LIMA "S", RISE, RIDE, RACE, TRACE, CRISPE, APE, STAR, CTF, TREF, GRADE, ROSES, RDIREC, RSCET, SPARK, SOAR, SPICE, IDEATE, PACT, Chain-of-Thought (CoT), Zero-shot CoT, Self-Consistency, Generated Knowledge, Least-to-Most Prompting, Self-Refine, Tree of Thoughts (ToT), Prompt Ensembling, Factive Prompting, EmotionPrompt, Prompt Chaining, Instruction Tuning Basics, Role Prompting, Few-Shot Prompting. *(Now 44 Text Frameworks)*

### 🖼️ Framework Prompt Gambar & Video

**(INTERACTIVE)** (Used for crafting prompts for AI like Midjourney, DALL-E, Stable Diffusion, Runway, Pika, etc.)
*   Midjourney (Interactive)
*   DALL-E 3 (Interactive)
*   Stable Diffusion (Interactive)
*   Leonardo.Ai (Detailed Interactive)
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
*   Adobe Firefly (Detailed Interactive)

### 🎵 Framework Prompt Musik

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

## 🧑‍💻 Cara Menggunakan

PromptMatrix menawarkan fitur inti secara gratis, dengan bantuan AI canggih yang direncanakan sebagai fitur langganan premium.

1.  **Check Your Plan:** The header displays your current plan ("Free Plan" or "Premium Plan" for dev/demo).
2.  **Select a Language:** Use the language toggle (EN/ID) in the header.
3.  **Explore Framework Category:** Click a category (Text, Media, Music).
4.  **Opsional: AI Framework Finder & Researcher (Fitur Premium - Segera Hadir):** 
    *   The "AI Framework Finder & Researcher" section allows you to describe your goal.
    *   Click "Get Framework Suggestions" for AI to suggest relevant frameworks from the app's internal list.
    *   Click "Research Web" for AI to search the internet for new techniques related to your goal, providing summaries and source links.
    *   Fitur-fitur ini ditandai dengan ikon AI ✨ dan akan memerlukan langganan saat diluncurkan.
5.  **Choose a Specific Framework:** Click a framework from the grid. Read its description.
6.  **Construct Your Prompt in "Prompt Studio":**
    *   **Text Framework:** Fill in component fields.
    *   **Media & Music Framework (Interactive):** Follow the step-by-step sections.
    *   Saran AI per-isian (ikon AI ✨) adalah fitur premium dan akan memerlukan langganan.
7.  **Review "Prompt Preview":** Your prompt updates live.
8.  **Opsional: Umpan Balik & Analisis AI (Fitur Premium - Segera Hadir):**
    *   "Get AI Suggestions" (ikon AI ✨) untuk umpan balik prompt secara keseluruhan.
    *   "Detailed Analysis" (ikon AI ✨) untuk tinjauan terstruktur (skor, ambiguitas, dll.).
    *   Tombol-tombol ini ditandai sebagai premium dan akan memerlukan langganan.
9.  **Copy & Launch:** Click "Copy Prompt," then "Launch AI Tool" to go to the platform or your custom URL.
10. **Save Your Work:** Use "Save Prompt" to store your creations in the "Saved prompts" panel.
11. **Learn About Premium:** Click "Learn about Premium" in the header to see details about free and upcoming premium features.

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
