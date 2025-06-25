
# Catatan Rilis PromptMatrix

Dokumen ini mencatat perubahan teknis detail untuk setiap versi PromptMatrix.

---
## [V6.0.0] - YYYY-MM-DD (Tanggal Rilis Sebenarnya)
### Added
- **Fitur Inti: Analisis & Penilaian Prompt oleh AI (Membutuhkan Kunci API):**
    - Pengguna dapat meminta analisis mendalam untuk prompt yang aktif atau yang dimuat dari Stash.
    - AI (Gemini) memberikan feedback terstruktur meliputi:
        - Skor Kejelasan (1-10) dengan justifikasi.
        - Skor Spesifisitas (1-10) dengan justifikasi.
        - Identifikasi Potensi Ambiguitas dalam prompt.
        - Saran Tindak Lanjut konkret untuk perbaikan.
        - Penilaian Keseluruhan singkat mengenai kualitas prompt.
    - Tombol baru "Analisis Detail dengan AI 📊" ditambahkan di panel Pratinjau Prompt.
    - Hasil analisis ditampilkan secara terstruktur di bawah pratinjau prompt, dalam format yang mudah dibaca.
### Changed
- Nomor versi aplikasi diperbarui menjadi V6.0.0 di footer, `package.json`, dan dokumentasi.
- State management di `App.tsx` diperluas untuk menangani data dan status fitur analisis detail (`detailedAiAnalysis`, `isFetchingDetailedAnalysis`, `detailedAnalysisError`, `detailedAiAnalysisReceived`).
- Komponen `PromptOutput.tsx` dimodifikasi secara signifikan untuk mengakomodasi tombol baru dan area tampilan hasil analisis detail, termasuk logika parsing untuk respons AI.
### Technical Notes
- Fungsi baru `fetchDetailedAiAnalysis` di `App.tsx` untuk memanggil model Gemini (`gemini-2.5-flash-preview-04-17`) dengan *system instruction* khusus yang dirancang untuk tugas analisis prompt (tersedia di `translations.ts` sebagai `geminiDetailedAnalysisInstruction`).
- *System instruction* meminta Gemini untuk mengembalikan respons teks yang terstruktur dengan header spesifik (misalnya, "Skor Kejelasan (1-10):", "Potensi Ambiguitas:") untuk memudahkan parsing.
- Fungsi `renderFormattedTextSection` di `PromptOutput.tsx` digunakan (dengan penyesuaian jika perlu) untuk mem-parsing dan menampilkan teks berformat dari AI.
- Penambahan kunci terjemahan baru di `types.ts` dan `translations.ts` untuk semua UI elemen, pesan, dan judul bagian terkait fitur analisis detail.
- Ikon baru `ChartBarIcon.tsx` ditambahkan dan digunakan untuk tombol analisis detail.

---

## [V5.5.0] - YYYY-MM-DD 
### Added
- File `updates.md` untuk log fitur dan pembaruan tingkat tinggi.
- Adopsi Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`) mulai dari versi ini.
### Changed
- Versi pada footer aplikasi diperbarui menjadi `V5.5.0`.
- Versi di `package.json` diubah menjadi `5.5.0`.
- `README.md` diperbarui untuk mencerminkan versi `V5.5.0` dan adopsi SemVer.
### Technical Notes
- Diskusi awal mengenai standarisasi sistem versioning dan pembuatan `release-notes.md`.
- Persiapan untuk pencatatan rilis yang lebih detail.

---

## [V5.1 - V5.4] - YYYY-MM-DD (Periode Rilis Inkremental)
### Added
- **Manajemen Data:**
    - Fungsionalitas Ekspor/Impor untuk Prompt Stash (data JSON). Tombol ditempatkan pada panel Prompt Stash.
    - Notifikasi Toast untuk status keberhasilan/kegagalan operasi Ekspor/Impor.
- **Pengalaman Pengguna (UX):**
    - Fitur "Favorite Frameworks":
        - Pengguna dapat menandai/membatalkan penandaan kerangka kerja sebagai favorit menggunakan ikon bintang.
        - Kerangka kerja favorit ditampilkan secara visual berbeda dan diurutkan di bagian atas daftar kategori masing-masing.
        - Status favorit disimpan menggunakan `localStorage`.
### Changed
- Peningkatan logika penyortiran daftar kerangka kerja untuk menampilkan favorit di atas.
- Peningkatan styling untuk indikator favorit.
- Logika perakitan prompt interaktif disempurnakan untuk hasil yang lebih bersih dan akurat.
- Pembaruan pada `README.md` dan `LICENSE.md` untuk kejelasan dan kelengkapan.
### Fixed
- Berbagai perbaikan bug minor dan peningkatan stabilitas.
### Technical Notes
- Implementasi `JSON.stringify` untuk ekspor dan `JSON.parse` dengan validasi dasar untuk impor.
- Penggunaan `localStorage` untuk menyimpan array ID kerangka kerja favorit (`favoriteFrameworkIds`).
- Peningkatan fokus pada atribut ARIA untuk aksesibilitas yang lebih baik.

---

## [V5.0] - YYYY-MM-DD
### Added
- **Fitur Inti - Prompt Stash (My Prompt Stash):**
    - Penyimpanan prompt lokal menggunakan **IndexedDB**.
    - Operasi CRUD (Create, Read, Update, Delete) untuk prompt.
    - Panel "Prompt Stash" khusus di UI untuk melihat, memuat, mengganti nama, dan menghapus prompt.
- **Navigasi Kerangka Kerja:**
    - Bilah Pencarian/Filter di atas daftar kerangka kerja.
- **Umpan Balik Pengguna:**
    - Sistem Notifikasi Toast untuk berbagai aksi (simpan, muat, hapus, error).
### Changed
- **UI & Styling:**
    - Peningkatan signifikan pada animasi dan umpan balik visual untuk interaksi UI.
    - Penyesuaian layout untuk mengakomodasi panel baru.
    - Peningkatan styling placeholder input agar non-copyable dan lebih jelas.
    - Logika pratinjau prompt yang konsisten, menampilkan teks instruksional hingga ada input pengguna yang signifikan.
### Technical Notes
- Integrasi IndexedDB melalui helper `db.ts` (fungsi `openDB`, `addPromptToDB`, `getAllPromptsFromDB`, dll.).
- Penggunaan React `useState` dan `useEffect` untuk mengelola state Prompt Stash dan interaksi DB.

---

## [V4.0] - YYYY-MM-DD
### Added
- **Revolusi Pembuatan Prompt - Interactive Prompt Studio:**
    - Semua kerangka kerja **Gambar, Video, dan Musik** dikonversi untuk menggunakan **Interactive Prompt Builder** baru.
    - Tipe input beragam: Isian Manual, Pilihan Tunggal (Dropdown dengan opsi "Lainnya..." yang memunculkan input teks), Pilihan Ganda (Checkbox Kolapsibel).
- **Integrasi AI yang Ditingkatkan (Membutuhkan Kunci API):**
    - **Saran Kerangka Kerja Berbasis AI**: AI menganalisis deskripsi tujuan pengguna dan merekomendasikan kerangka kerja yang relevan (ditandai visual).
    - **Saran AI untuk Isian "Lainnya..."**: Bantuan AI kontekstual untuk input kustom di dropdown mode interaktif.
- **UI/UX Overhaul:**
    - **Indikator Status API Key Dinamis**: Header menampilkan "AI Inside" (API aktif) atau "Disconnected" (API tidak aktif) dengan styling dan animasi.
### Changed
- Perilaku panel input/output utama yang dapat diciutkan disempurnakan.
- Konsistensi visual dan estetika ditingkatkan di seluruh aplikasi.
- Logika perakitan prompt untuk kerangka kerja interaktif disempurnakan untuk output yang lebih bersih.
### Technical Notes
- Implementasi komponen `InteractivePromptBuilder.tsx`.
- Modifikasi signifikan pada `frameworks.ts` untuk mendukung definisi interaktif.
- Logika state management diperluas untuk menangani nilai formulir interaktif dan status AI.
- Penggunaan variabel CSS untuk status API dinamis.

---

## [V3.0] - YYYY-MM-DD
### Added
- **Integrasi AI Awal (Tergantung Kunci API Google Gemini):**
    - **Peningkatan Prompt Berbasis AI**:
        - Umpan balik keseluruhan prompt (tombol "Get AI Suggestions").
        - Saran per-isian untuk kerangka kerja teks.
- **Panduan Pengguna & Transparansi:**
    - Penonaktifan visual dan fungsional fitur AI jika tidak ada kunci API.
    - **Modal Disclaimer**: Menginformasikan tujuan alat, ketergantungan fitur AI, dan privasi.
    - **Modal Cara Pakai**: Panduan fitur dan alur kerja aplikasi, termasuk diagram visual.
### Technical Notes
- Integrasi awal dengan `@google/genai` SDK.
- Pembuatan komponen Modal (`DisclaimerModal.tsx`, `HowToUseModal.tsx`).
- Penambahan state untuk mengelola feedback AI dan status API key.

---

## [V2.0] - YYYY-MM-DD
### Added
- **Kategori Kerangka Kerja Baru**: "Media" (untuk Gambar & Video AI) dan "Musik" (untuk Musik & Audio AI).
- **Struktur Kerangka Kerja Awal**: Kerangka kerja dasar non-interaktif (berbasis komponen) untuk alat AI media dan musik populer (Midjourney, DALL-E, Suno AI, dll.).
- **Tautan Alat**: Integrasi tautan langsung ke situs web/platform resmi untuk banyak alat AI yang didukung.
### Technical Notes
- Perluasan struktur data `Framework` di `types.ts` dan `frameworks.ts` untuk mengakomodasi kategori dan tautan baru.
- Penyesuaian UI untuk pemilihan kategori.

---

## [V1.0] - YYYY-MM-DD
### Added
- **Tujuan Edukasi Inti**: Dirancang untuk membantu pengguna mempelajari dan memahami prinsip-prinsip konstruksi prompt yang efektif.
- **Kerangka Kerja Prompt Teks**: Fokus pada metodologi prompt berbasis teks yang sudah dikenal (misalnya, RTF, TRACE, CARE, TAG).
- **Input Berbasis Komponen**: Pengguna mengisi komponen-komponen berbeda dari kerangka kerja yang dipilih.
- **Pratinjau Prompt Real-Time**: Output prompt yang dihasilkan secara dinamis berdasarkan input pengguna.
- **Fungsionalitas Inti**:
    - Salin ke Clipboard untuk transfer prompt yang mudah.
    - Antarmuka Dwibahasa (Inggris & Indonesia).
    - Desain Responsif dengan Tema Gelap.
- **Konten Statis**: Kerangka kerja dan contoh sebagian besar di-hardcode.
- **Tanpa Integrasi AI**: Berfungsi murni sebagai alat sisi klien lokal untuk konstruksi dan pembelajaran prompt.
### Technical Notes
- Struktur proyek awal dengan React dan TypeScript.
- Implementasi `LanguageContext` untuk dukungan dwibahasa.
- Styling dasar menggunakan CSS standar dan Tailwind CSS (via CDN).

---
*Catatan: Log ini adalah ringkasan tingkat tinggi. Versi sub spesifik mungkin telah menyertakan perbaikan bug minor dan penyesuaian UI yang tidak dirinci secara lengkap di sini.*
