
# PromptMatrix V5.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An intuitive web application designed to help users **understand prompt engineering principles** and **construct effective, well-structured prompts** for various AI models. PromptMatrix V5.0 is your enhanced guide and toolkit for mastering AI communication, offering structured and interactive framework for text, image, video, and music generation. This tool is **not an AI itself**, but a powerful assistant for building and learning about prompts.

**[➡️ Live Demo (GitHub Pages) Link: https://sisigitadi.github.io/promptmatrix/](#)**

## ✨ What's New in V5.0 (Big Update!)

PromptMatrix V5.0 introduces a suite of major enhancements focusing on a more interactive user experience, deeper AI integration, and refined UI/UX:

*   **🚀 Revolusi Pembuatan Prompt Interaktif:**
    *   Semua framework untuk **Image, Video, dan Music** kini menggunakan **Prompt Studio Interaktif** yang baru. Ini memandu pengguna langkah demi langkah dengan jenis input yang beragam:
        *   **Isian Manual**: Untuk deskripsi bebas dan detail.
        *   **Pilihan Tunggal (Dropdown)**: Untuk parameter dengan opsi umum, kini disajikan sebagai dropdown yang ramping, lengkap dengan opsi "Lainnya..." yang memunculkan input teks manual jika dipilih.
        *   **Pilihan Ganda (Checkbox Kolapsibel)**: Untuk elemen dengan beberapa pilihan, kini disajikan sebagai daftar checkbox yang dapat diciutkan/diperluas, menghemat ruang dan menjaga antarmuka tetap bersih.
    *   Pengalaman ini dirancang untuk menjadi lebih intuitif, membantu pengguna memahami setiap komponen prompt, dan menghasilkan output yang lebih terstruktur dan relevan dengan alat AI spesifik.

*   **🧠 Maksimalkan Kecerdasan AI (Membutuhkan API Key Google Gemini):**
    *   **BARU: Saran Kerangka Kerja Berbasis AI**: Pengguna kini dapat mendeskripsikan tujuan atau jenis konten yang ingin mereka buat. AI akan menganalisis deskripsi ini dan merekomendasikan kerangka kerja yang paling relevan dari daftar yang tersedia, yang akan ditandai secara visual (<img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/20/solid/star.svg" width="14" height="14" style="filter: invert(93%) sepia(38%) saturate(2235%) hue-rotate(336deg) brightness(103%) contrast(101%);"> icon) di antarmuka.
    *   **BARU: Saran AI untuk Isian "Lainnya..."**: Bantuan AI kontekstual saat pengguna memilih opsi "Lainnya..." pada pilihan tunggal (dropdown) di mode interaktif. Sebuah tombol <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/outline/sparkles.svg" width="14" height="14"> akan muncul untuk meminta saran.
    *   **Fitur AI yang Ada Ditingkatkan**: Saran per-isian standar (<img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/outline/sparkles.svg" width="14" height="14">) dan peningkatan prompt keseluruhan ("Get AI Suggestions" <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/outline/sparkles.svg" width="14" height="14">) tetap tersedia dan telah dioptimalkan.
    *   Semua fitur AI secara visual dan fungsional dinonaktifkan jika API Key tidak terdeteksi, dengan informasi yang jelas kepada pengguna.

*   **🎨 Peningkatan UI/UX & Informasi:**
    *   **Indikator Status API Key Dinamis**: Header aplikasi kini menampilkan teks "AI Inside" (dengan animasi halus berwarna teal) jika API Key Google Gemini terdeteksi dan tersedia. Jika tidak, akan tampil teks "Disconnected" (berwarna merah, dengan animasi serupa) untuk memberi tahu pengguna bahwa fitur AI tidak aktif.
    *   **Floating Action Buttons (FABs)**: Tombol "Ganti Bahasa" dan "Cara Pakai" kini menjadi tombol aksi mengambang di pojok kanan bawah untuk aksesibilitas yang lebih baik dan antarmuka yang lebih bersih.
    *   **Bingkai Header Berpendar**: Logo dan judul aplikasi ("PromptMatrix") kini dibingkai dengan efek pendaran yang halus dan elegan, memberikan tampilan yang lebih premium.
    *   **Pratinjau Prompt Konsisten**: "Prompt Preview" kini selalu menampilkan teks instruksional awal hingga ada input pengguna yang signifikan, berlaku untuk framework standar (teks) maupun framework interaktif (media & musik). Ini menciptakan pengalaman yang lebih prediktif.
    *   **"Info Teks" pada Placeholder**: Semua teks panduan di kolom input kini berfungsi sebagai placeholder murni (tampil miring, tidak dapat diedit, dan hilang saat pengguna mulai mengetik), memastikan pengguna tidak perlu menghapus teks contoh secara manual.
    *   **Perakitan Prompt Lebih Cerdas**: Logika perakitan prompt untuk mode interaktif telah disempurnakan secara signifikan untuk menghasilkan output yang lebih bersih dan rapi di "Prompt Preview", terutama saat ada field opsional atau pilihan ganda yang tidak diisi. Sisa-sisa label atau tanda baca yang tidak perlu kini diminimalkan.

*   **⚙️ Perbaikan Logika & Stabilitas:**
    *   Optimalisasi logika `formIsDirty` untuk penanganan state yang lebih akurat dalam menentukan kapan pengguna telah berinteraksi dengan formulir.
    *   Penyederhanaan `interactivePromptTemplate` di `frameworks.ts` dan pemindahan semua logika kondisional perakitan prompt ke `App.tsx` untuk pemrosesan yang lebih robust dan pemeliharaan kode yang lebih mudah.

## ✨ Features (Core & Enhanced in V5.0)

*   **Educational Focus:** Learn the "why" and "how" behind effective prompts.
*   **Multi-Framework Support:** Explore diverse prompting framework, plus **interactive framework** for image, video, and music.
*   **Interactive Prompt Studio (for Media/Music):** Step-by-step guidance with dropdowns, collapsible checkboxes, and "Other..." options.
*   **Structured Input Guidance (Text Frameworks):** Dynamically updating input fields with examples.
*   **AI-Powered Framework Suggestions (NEW - API Key Req.):** Get AI recommendations for the best framework based on your goal.
*   **AI-Powered "Other..." Suggestions (NEW - API Key Req.):** Contextual AI help for custom inputs in interactive mode.
*   **AI-Powered Overall Prompt Feedback & Per-Field Suggestions (API Key Req.):** Existing AI features, now clearly disabled if no API key.
*   **Dynamic API Key Status Indicator (NEW):** "AI Inside" or "Disconnected" text in the header.
*   **Bilingual Interface:** Supports English (EN) and Indonesian (ID).
*   **Real-Time Prompt Construction & Consistent Preview.**
*   **Easy Copy-to-Clipboard & Launch AI Tool.**
*   **Responsive Design & Modern Dark Theme.**
*   **Free Core Features, 'as is', respects privacy. No personal data collected. Ad-free.**

## 🖼️ Screenshots

<!-- TODO: Update screenshots for V5.0, showcasing the new interactive studio, AI features, and UI enhancements. -->
**Example Screenshot Placeholder (Replace this):**
![PromptMatrix V5.0 Screenshot](https://via.placeholder.com/800x450.png?text=PromptMatrix+V5.0+App+Screenshot+Here)

## 🛠️ Framework Supported

PromptMatrix V5.0 provides structured inputs and guidance for understanding and using the following framework:

### 📜 Text Prompt Framework (Represented by <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/outline/pencil.svg" width="16" height="16"> icon):

(Uses standard component-based input. Used for crafting prompts for AI like ChatGPT, Gemini, Claude, etc.)
*   RTF, AIDA, CARE, CO-STAR, BAB, TAG, PAS, FAB, PREPARE, Google Guide, CIDI, LIMA "S", RISE, RACE, TRACE, CRISPE, APE, STAR, CTF, TREF, GRADE, ROSES, RDIREC, RSCET, IDEATE, PACT, Chain-of-Thought (CoT), Zero-shot CoT, Self-Consistency, Generated Knowledge, Least-to-Most Prompting, Self-Refine, Tree of Thoughts (ToT), Prompt Ensembling, Factive Prompting, EmotionPrompt, Prompt Chaining, Instruction Tuning Basics, Role Prompting, Few-Shot Prompting. *(Now 27 Text Frameworks)*

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
*   **AI Integration:** `@google/genai` for Google Gemini API (optional AI features, requires user-provided API key).
*   **State Management:** React Context API (language), React `useState` & `useCallback`.
*   **Deployment:** GitHub Pages.

## 🧑‍💻 How to Use PromptMatrix V5.0

PromptMatrix V5.0 is designed to help you *learn* and *build* with enhanced guidance and AI assistance.

1.  **Check Your Plan:** The header displays your current plan ("Free Plan" or "Premium Plan" for dev/demo).
2.  **Select a Language:** Use the language toggle (EN/ID) in the header.
3.  **Explore Framework Category:** Click a category (Text, Media, Music).
4.  **Optional: Get AI Framework Suggestions (API Key Req.):** In the "AI Framework Suggester" section within "Prompt Studio," describe your goal and click "Get Framework Suggestions." Recommended framework in the current category will be highlighted with a <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/20/solid/star.svg" width="14" height="14" style="filter: invert(93%) sepia(38%) saturate(2235%) hue-rotate(336deg) brightness(103%) contrast(101%);">.
5.  **Choose a Specific Framework:** Click a framework from the grid. Read its description.
6.  **Construct Your Prompt in "Prompt Studio":**
    *   **Text Framework:** Fill in component fields. Use <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/outline/sparkles.svg" width="14" height="14"> for per-field AI suggestions (API Key Req.).
    *   **Media & Music Framework (Interactive):** Follow the step-by-step "wizard-like" sections. Use dropdowns for single choices (select "Lainnya..." for custom input, with optional <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/outline/sparkles.svg" width="14" height="14"> AI suggestions for it - API Key Req.). Use collapsible checkbox groups for multiple choices.
    *   Use "Additional Notes & Instructions" for standard framework if needed.
7.  **Review "Prompt Preview":** Your prompt updates live. It will show instructions until you make significant input.
8.  **Optional: Get Overall AI Feedback (API Key Req.):** Click "Get AI Suggestions" <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/outline/sparkles.svg" width="14" height="14"> for your entire prompt.
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
