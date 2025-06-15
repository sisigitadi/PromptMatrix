
import { TranslationSet, TranslationKey } from './types'; // Ensure TranslationKey is imported

export const translations: TranslationSet = {
  en: {
    appTitle: "PromptMatrix",
    appSubtitle: "Your guide to understanding & crafting effective AI prompts.",
    textFrameworksTitle: "Text Prompt Framework",
    mediaFrameworksTitle: "Image & Video Prompt Framework",
    musicFrameworksTitle: "Music Prompt Framework",
    inputComponentsTitle: "Components:",
    clearInputsButton: "Clear Inputs",
    clearInputsButtonAria: "Clear all input fields for the current framework",
    generatedPromptTitle: "Prompt Preview:",
    footerOptimize: "Made by engineer, not coder.",
    footerContactMe: "",
    initialPromptAreaInstruction: "Start here: Choose a category, then a framework. Fill in components to build your prompt and learn how it works!",
    selectFrameworkPromptAreaInstruction: "Begin by selecting a framework category, then choose a specific framework to understand its structure and build your prompt.",
    nothingToCopyMessage: "Nothing to copy. Construct your prompt first!",
    noInputComponents: "This framework has no structured input components. Use its description as a general guide to understand its principles.",
    inputFieldDescription: (componentName, frameworkShortName) => `Define '${componentName.toLowerCase()}' for your ${frameworkShortName} prompt.`,
    inputFieldPlaceholder: (componentName) => `Define ${componentName}... (e.g., see framework examples)`,
    promptTemplatePlaceholder: (componentName) => `[Define the ${componentName.toLowerCase()} element here, drawing inspiration from examples]`,
    copyButtonTitle: "Copy Prompt to Clipboard",
    copiedButtonTitle: "Prompt Copied!",
    copySuccessMessage: "Prompt copied successfully!",
    copyToClipboardAria: "Copy structured prompt to clipboard",
    promptCopiedAria: "Prompt copied to clipboard",
    languageID: "ID",
    languageEN: "EN",
    userDefinedInteractionLabel: "Additional Notes & Instructions:",
    userDefinedInteractionPlaceholder: "Optional: Add further specific directives, questions to consider, or notes for your final prompt here...",
    copyButtonText: "Copy Prompt",
    copiedButtonText: "Prompt Copied!",
    noExamplesAvailable: "No specific examples are provided for this framework. Refer to its general description to understand its application.",
    launchToolButtonText: "Launch AI Tool",
    launchToolButtonAria: (toolName?: string) => toolName ? `Launch ${toolName} or select other AI platforms` : "Launch an AI platform or select from options",
    toolSelectorModalTitle: "Select Target AI Platform",
    customToolUrlInputLabel: "Or enter your AI tool URL:",
    customToolUrlInputPlaceholder: "e.g., https://your-ai-tool.com",
    customToolUrlButtonText: "Open Custom Link",
    customToolUrlButtonAria: "Open the custom URL entered in the input field",
    
    disclaimerTitle: "About PromptMatrix",
    disclaimerPoint1: "Learn to build & understand structured AI prompts with guided frameworks.",
    disclaimerPoint2: "This is an educational aid. It does not execute prompts with external AI models. Optional AI-powered suggestion features require an AI API key (user-provided, not stored by this tool) to function.",
    disclaimerPoint3: "Free, 'as is', & respects your privacy. No personal data collected. Ad-free & promotion-free.",
    disclaimerContactPrompt: "Feedback & Questions:",
    disclaimerModalAcknowledgeButton: "Acknowledge & Continue",

    disclaimerAcknowledgeButtonDisabledText: (seconds: number) => `Acknowledge & Continue (in ${seconds}s)`,
    disclaimerSwitchToEnglish: "Switch to English",
    disclaimerSwitchToIndonesian: "Switch to Indonesian",

    howToUseAppTitle: "How to Use PromptMatrix",
    howToUseAppTitleShort: "How To Use",
    howToUseStep1: "Choose a Category (Text, Media, Music) to explore prompt structures.",
    howToUseStep2: "Select a specific Framework. Optionally, use the 'AI Framework Suggester' by describing your goal.",
    howToUseStep3: "Fill in the 'Components'. Use 💡 for AI suggestions per field (API key needed).",
    howToUseStep4: "Review your complete prompt in 'Prompt Preview' as it updates live.",
    howToUseStep5: "Optionally, click 'Get AI Suggestions 💡' for overall prompt feedback from AI (API key needed).",
    howToUseStep6: "Click 'Copy Prompt', then 'Launch AI Tool' to use it on your chosen AI platform.",
    howToUseTip: "Explore different framework, switch languages (ID/EN) using the button in the header, and master prompt engineering!",
    howToUseSwitchToEnglish: "View in English",
    howToUseSwitchToIndonesian: "Lihat dalam Bahasa Indonesia",
    howToUseDiagramTitle: "Application Workflow",

    diagramStep1: "Select Category",
    diagramStep2: "Select Framework\n(AI Suggestion Opt.)",
    diagramStep3: "Fill Components",
    diagramStep4: "Review Prompt\nPreview",
    diagramStep5: "Get AI Feedback\n(Opt.)",
    diagramStep6: "Copy & Launch\nTool",
    
    textFrameworksCategoryTooltip: "Framework for understanding and crafting textual prompts (e.g., for chatbots, writing assistants).",
    mediaFrameworksCategoryTooltip: "Framework for understanding and building prompts for image and video generation AIs.",
    musicFrameworksCategoryTooltip: "Framework for understanding and constructing prompts for music and audio generation AIs.",
    selectCategoryTitle: "Category",
    selectCategoryInstruction: "Select a framework category above to explore structures and start building your understanding of effective prompts.",
    selectSpecificFrameworkInputSummary: "Choose a framework from the grid to see its components and start building your prompt. Each component will provide an example.",
    selectSpecificFrameworkOutputSummary: "Your structured prompt will appear here, ready to be copied to your AI tool. You can also get AI feedback on it!",
    clickToExpandInputPanel: (frameworkName: string) => `Show '${frameworkName}' components & examples`,
    clickToExpandOutputPanel: "Show prompt & actions",
    selectOptionTooltip: "Select option",

    enhanceButtonText: "Get AI Suggestions",
    enhanceButtonLoadingText: "Getting Suggestions...",
    enhanceButtonTitle: "Get AI-powered suggestions for your prompt (requires AI API key)",
    enhanceButtonAria: "Get AI suggestions for the prompt",
    aiFeedbackTitle: "AI Feedback & Suggestions (Overall Prompt)", 
    aiFeedbackTitleTextOnly: "AI Feedback & Suggestions (Overall Prompt)", 
    aiFeedbackLoading: "Getting feedback from AI...",
    aiEnhancementError: "Sorry, an error occurred while fetching AI feedback. Please try again.",
    apiKeyMissingError: "AI API Key not configured. This feature is unavailable.",
    emptyPromptError: "Please construct a prompt before requesting AI suggestions.",
    geminiPromptInstruction: `Act as a highly experienced and somewhat strict prompt engineering instructor. Your goal is to make the user understand how to craft excellent prompts quickly.
Analyze the user's prompt provided below (between the triple hyphens). This prompt may also contain an "Additional Notes & Instructions:" section.
Provide your feedback in plain text, without any markdown formatting (no asterisks, no backticks, no hash symbols for headings). Use simple line breaks for paragraphs or lists.
Your feedback MUST include the following sections, clearly delineated:
1.  Strengths: What the user did well. Be specific.
2.  Weaknesses: Where the prompt falls short, is unclear, or could be misinterpreted by an AI. Be direct.
3.  Reasoning: Explain *why* these are strengths and weaknesses. Focus on the impact on potential AI output and clarity of instruction.
4.  Actionable Suggestions: Provide specific, concrete advice on how to improve the prompt. Offer alternative phrasings or additions. As part of these suggestions, if the user has provided content in the "Additional Notes & Instructions:" section, offer specific improvements for it. If that section is empty but could be beneficial for this particular prompt, suggest what kind of information the user might consider adding there. Push for excellence and precision.

Remember, your tone should be that of a demanding but fair teacher who wants their student to succeed and learn rapidly. Kritis namun konstruktif.
Prompt pengguna:`, // User prompt will be appended here by the app
    aiFeedbackReceivedIndicatorTooltip: "AI feedback successfully loaded", 
    promptHasBeenCopiedIndicatorTooltip: "This prompt has been copied.", 
    
    aiFeedbackStrengthsTitle: "Strengths:",
    aiFeedbackWeaknessesTitle: "Weaknesses:",
    aiFeedbackReasoningTitle: "Reasoning:",
    aiFeedbackActionableSuggestionsTitle: "Actionable Suggestions:", 

    suggestButtonTitle: "Get AI suggestions for this field (requires API Key)",
    suggestionsLoading: "Getting suggestions...",
    suggestionsError: "Error fetching suggestions.",
    noSuggestionsFound: "No suggestions found.",
    geminiInstructionForAutocomplete: (componentName, frameworkName, currentValue) => `You are an AI assistant helping a user write a prompt. The user is currently filling in the '${componentName}' part of the '${frameworkName}' framework. Their current input for this part is: '${currentValue}'. Provide up to 3 short, relevant autocomplete suggestions or continuations for this input. Return ONLY the suggestions as a JSON array of strings. For example: ["suggestion1", "suggestion2", "suggestion3"]. If no suggestions, return an empty array [].`,

    translationInProgress: "Translating content...",
    translationGeneralError: "An error occurred during translation. Some fields may not be translated.",
    interactiveFormOptionOtherLabel: "Other...",
    interactiveFormOptionOtherPlaceholder: "Specify your own",
    interactiveFormMultipleChoiceHelpText: "(Select all that apply)",
    interactiveFormManualInputPlaceholder: "Type your details here...",

    userGoalInputLabel: "Describe your goal for the prompt:",
    userGoalInputPlaceholder: "e.g., 'Create a marketing slogan for a new coffee shop', 'Generate a script for a short animated video about space exploration', 'Compose a lo-fi hip hop track for studying'",
    getFrameworkSuggestionsButton: "Get Framework Suggestions",
    getFrameworkSuggestionsButtonAria: "Get AI-powered framework suggestions based on your goal",
    frameworkSuggestionsLoading: "Getting framework suggestions...",
    frameworkSuggestionsError: "Error fetching framework suggestions. Please try again.",
    suggestedFrameworkTooltip: "AI Suggested Framework",
    noFrameworkSuggestionsFound: "No specific framework suggestions found for your goal. Try rephrasing or explore the categories below.",
    frameworkSuggestionInstruction: "Describe what you want to achieve with your prompt. AI will suggest suitable framework.",
    frameworkSuggestionsTitle: "AI Framework Suggester",
    aiPoweredFeatureTooltip: "AI Powered Feature (Requires API Key)", 
    aiFeaturesActiveIndicator: "AI features enabled (API Key detected)", 
    geminiInstructionForFrameworkSuggestion: (frameworksInfoJson: string) => `You are an AI assistant specialized in recommending prompt engineering framework. Based on the user's goal, you must suggest the most relevant framework IDs from the provided list. The list of available framework (including their ID, name, description, and category) is: ${frameworksInfoJson}. Respond ONLY with a JSON object containing a single key "suggestedFrameworkIds", which should be an array of strings (the IDs of the suggested framework). If no framework seem relevant, return an empty array for "suggestedFrameworkIds". Do not add any explanations or introductory text outside the JSON object.`,

    // Labels for Interactive Prompt Assembly (New section for clarity)
    promptLabel_subject: "Subject",
    promptLabel_action_details: "Action/Details",
    promptLabel_art_style: "Art Style",
    promptLabel_art_medium: "Art Medium",
    promptLabel_artist_influence: "Artist Influence",
    promptLabel_artist_influences: "Artist Influences", // For Stable Diffusion
    promptLabel_composition: "Composition",
    promptLabel_lighting: "Lighting Style",
    promptLabel_color_palette: "Color Palette",
    promptLabel_detail_level: "Detail Level",
    promptLabel_aspect_ratio: "Aspect Ratio",
    promptLabel_negative_prompt_elements: "Negative Elements",
    promptLabel_custom_negative: "Custom Negative",
    promptLabel_other_tool_params: "Other Parameters",
    promptLabel_environment: "Environment",
    promptLabel_atmosphere: "Atmosphere",
    promptLabel_version: "Version",
    promptLabel_stylize: "Stylize",
    promptLabel_chaos: "Chaos",
    promptLabel_weird: "Weird",
    promptLabel_tile: "Tile",
    promptLabel_image_weight: "Image Weight",
    promptLabel_style_raw: "Style Raw",
    promptLabel_other_params: "Other Params", // Midjourney specific "other"
    promptLabel_scene_description: "Scene Description", // DALL-E 3
    promptLabel_specific_details: "Specific Details", // DALL-E 3
    promptLabel_color_focus: "Color Focus", // DALL-E 3
    promptLabel_lighting_mood: "Lighting/Mood", // DALL-E 3, Stable Diffusion
    promptLabel_composition_angle: "Composition/Angle", // DALL-E 3
    promptLabel_aspect_ratio_dalle: "Aspect Ratio", // DALL-E 3
    promptLabel_main_subject: "Main Subject", // Stable Diffusion
    promptLabel_key_details: "Key Details", // Stable Diffusion
    promptLabel_quality_descriptors: "Quality Descriptors", // Stable Diffusion
    promptLabel_art_style_medium: "Art Style/Medium", // Stable Diffusion
    promptLabel_technical_aspects: "Technical Aspects", // Stable Diffusion
    promptLabel_camera_shot: "Camera Shot", // Stable Diffusion
    promptLabel_lighting_style: "Lighting Style", // Stable Diffusion (can reuse, context should be clear)
    promptLabel_custom_negative_prompt: "Custom Negative Prompt", // Stable Diffusion
    promptLabel_param_info: "Parameters Note", // Stable Diffusion
    promptLabel_subjek: "Subject", // Veo (ID specific, ensure EN matches)
    promptLabel_aksi: "Action", // Veo
    promptLabel_lokasi: "Location", // Veo
    promptLabel_gaya: "Style", // Veo
    promptLabel_mood: "Mood", // Veo, Music
    promptLabel_warna: "Color Palette", // Veo (ID specific, ensure EN matches)
    promptLabel_shot: "Shot Type", // Veo
    promptLabel_angle: "Camera Angle", // Veo
    promptLabel_movement: "Camera Movement", // Veo
    promptLabel_cahaya: "Lighting", // Veo (ID specific, ensure EN matches)
    promptLabel_kualitas: "Quality", // Veo (ID specific, ensure EN matches)
    promptLabel_elemen_spesifik: "Specific Elements", // Veo
    promptLabel_negative: "Negative Prompt", // Veo custom negative
    promptLabel_scene_subject: "Scene/Subject", // Runway
    promptLabel_subject_action: "Subject Action", // Runway
    promptLabel_camera_movement: "Camera/Movement", // Runway
    promptLabel_visual_style: "Visual Style", // Runway
    promptLabel_lighting_atmosphere: "Lighting/Atmosphere", // Runway
    promptLabel_environment_action: "Environment Action", // Runway
    promptLabel_sound_design_note: "Sound Design Note", // Runway
    promptLabel_duration_note: "Duration Note", // Runway
    promptLabel_genre: "Genre", // Suno, Detailed Music
    promptLabel_subgenre_modifiers: "Subgenre/Modifiers", // Suno
    promptLabel_main_instruments: "Main Instruments", // Suno, Detailed Music
    promptLabel_vocal_style: "Vocal Style", // Suno, Detailed Music
    promptLabel_tempo: "Tempo", // Suno, Detailed Music
    promptLabel_rhythm_description: "Rhythm/Groove", // Suno
    promptLabel_song_structure: "Song Structure", // Suno
    promptLabel_lyrics_theme: "Lyrical Theme", // Suno
    promptLabel_custom_lyrics_section: "Custom Lyrics", // Suno
    promptLabel_main_genre: "Main Genre", // Detailed Music
    promptLabel_subgenre_style: "Subgenre/Style", // Detailed Music
    promptLabel_song_structure_desc: "Song Structure", // Detailed Music
    promptLabel_duration_or_specifics: "Duration/Specifics", // Detailed Music
    promptLabel_lyrical_theme_or_custom: "Lyrics", // Detailed Music

    categoryLabelImage: "Image",
    categoryLabelVideo: "Video",
    categoryLabelMusic: "Music",
    categoryLabelText: "Text",
    frameworkWord: "Framework",
  },
  id: {
    appTitle: "PromptMatrix",
    appSubtitle: "Panduan Anda memahami & membuat prompt AI yang efektif.",
    textFrameworksTitle: "Kerangka Kerja Prompt Teks",
    mediaFrameworksTitle: "Kerangka Kerja Prompt Gambar & Video",
    musicFrameworksTitle: "Kerangka Kerja Prompt Musik",
    inputComponentsTitle: "Komponen:",
    clearInputsButton: "Bersihkan Isian",
    clearInputsButtonAria: "Bersihkan semua kolom isian untuk kerangka kerja saat ini",
    generatedPromptTitle: "Pratinjau Prompt:",
    footerOptimize: "Dibuat oleh insinyur, bukan programmer.",
    footerContactMe: "",
    initialPromptAreaInstruction: "Mulai di sini: Pilih kategori, lalu kerangka kerja. Isi komponen untuk membuat prompt dan pelajari cara kerjanya!",
    selectFrameworkPromptAreaInstruction: "Mulailah dengan memilih kategori kerangka kerja, lalu pilih kerangka kerja spesifik untuk memahami strukturnya dan membangun prompt Anda.",
    nothingToCopyMessage: "Belum ada yang disalin. Susun prompt Anda terlebih dahulu!",
    noInputComponents: "Kerangka kerja ini tidak memiliki komponen input terstruktur. Gunakan deskripsinya sebagai panduan umum untuk memahami prinsipnya.",
    inputFieldDescription: (componentName, frameworkShortName) => `Definisikan '${componentName.toLowerCase()}' untuk prompt ${frameworkShortName} Anda.`,
    inputFieldPlaceholder: (componentName) => `Definisikan ${componentName}... (cth: lihat contoh kerangka kerja)`,
    promptTemplatePlaceholder: (componentName) => `[Definisikan elemen ${componentName.toLowerCase()} di sini, ambil inspirasi dari contoh]`,
    copyButtonTitle: "Salin Prompt ke Clipboard",
    copiedButtonTitle: "Prompt Tersalin!",
    copySuccessMessage: "Prompt berhasil disalin!",
    copyToClipboardAria: "Salin prompt terstruktur ke clipboard",
    promptCopiedAria: "Prompt disalin ke clipboard",
    languageID: "ID",
    languageEN: "EN",
    userDefinedInteractionLabel: "Catatan & Instruksi Tambahan:",
    userDefinedInteractionPlaceholder: "Opsional: Tambahkan arahan spesifik lebih lanjut, pertanyaan untuk dipertimbangkan, atau catatan untuk prompt final Anda di sini...",
    copyButtonText: "Salin Prompt",
    copiedButtonText: "Prompt Tersalin!",
    noExamplesAvailable: "Tidak ada contoh spesifik yang disediakan untuk kerangka kerja ini. Gunakan deskripsi umumnya untuk memahami penerapannya.",
    launchToolButtonText: "Luncurkan Alat AI",
    launchToolButtonAria: (toolName?: string) => toolName ? `Luncurkan ${toolName} atau pilih platform AI lainnya` : "Luncurkan platform AI atau pilih dari opsi",
    toolSelectorModalTitle: "Pilih Platform AI Tujuan",
    customToolUrlInputLabel: "Atau masukkan URL alat AI Anda:",
    customToolUrlInputPlaceholder: "cth: https://alat-ai-anda.com",
    customToolUrlButtonText: "Buka Link Kustom",
    customToolUrlButtonAria: "Buka URL kustom yang dimasukkan di kolom isian",
    
    disclaimerTitle: "Tentang PromptMatrix",
    disclaimerPoint1: "Pelajari cara membuat & memahami prompt AI terstruktur dengan kerangka kerja terpandu.",
    disclaimerPoint2: "Ini adalah alat bantu edukasi. Tidak menjalankan prompt dengan model AI eksternal. Fitur saran opsional bertenaga AI memerlukan kunci API AI (disediakan pengguna, tidak disimpan alat ini) agar berfungsi.",
    disclaimerPoint3: "Gratis, 'apa adanya', & menghargai privasi Anda. Tidak ada data pribadi yang dikumpulkan. Bebas iklan & promosi.",
    disclaimerContactPrompt: "Masukan & Pertanyaan:",
    disclaimerModalAcknowledgeButton: "Pahami & Lanjutkan",

    disclaimerAcknowledgeButtonDisabledText: (seconds: number) => `Pahami & Lanjutkan (dalam ${seconds}d)`,
    disclaimerSwitchToEnglish: "Ganti ke Bahasa Inggris",
    disclaimerSwitchToIndonesian: "Ganti ke Bahasa Indonesia",

    howToUseAppTitle: "Cara Menggunakan PromptMatrix",
    howToUseAppTitleShort: "Cara Pakai",
    howToUseStep1: "Pilih Kategori (Teks, Media, Musik) untuk menjelajahi struktur prompt.",
    howToUseStep2: "Pilih Kerangka Kerja spesifik. Opsional, gunakan 'Penyaran Kerangka Kerja AI' dengan menjelaskan tujuan Anda.",
    howToUseStep3: "Isi 'Komponen'. Gunakan 💡 untuk saran AI per isian (perlu kunci API).",
    howToUseStep4: "Tinjau 'Pratinjau Prompt' Anda yang diperbarui secara langsung saat Anda mengetik.",
    howToUseStep5: "Opsional, klik 'Minta Saran AI 💡' untuk masukan prompt keseluruhan dari AI (perlu kunci API).",
    howToUseStep6: "Klik 'Salin Prompt', lalu 'Luncurkan Alat AI' untuk digunakan di platform AI pilihan Anda.",
    howToUseTip: "Jelajahi berbagai kerangka kerja, ganti bahasa (ID/EN) menggunakan tombol di header, dan kuasai rekayasa prompt!",
    howToUseSwitchToEnglish: "Lihat dalam Bahasa Inggris",
    howToUseSwitchToIndonesian: "Ganti ke Bahasa Indonesia",
    howToUseDiagramTitle: "Alur Kerja Aplikasi",

    diagramStep1: "Pilih Kategori",
    diagramStep2: "Pilih Kerangka Kerja\n(Saran AI Ops.)",
    diagramStep3: "Isi Komponen",
    diagramStep4: "Tinjau Pratinjau\nPrompt",
    diagramStep5: "Masukan AI\n(Ops.)",
    diagramStep6: "Salin & Luncurkan\nAlat",
    
    textFrameworksCategoryTooltip: "Kerangka kerja untuk memahami dan menyusun prompt tekstual (misalnya, untuk chatbot, asisten menulis).",
    mediaFrameworksCategoryTooltip: "Kerangka kerja untuk memahami dan membangun prompt untuk AI penghasil gambar dan video.",
    musicFrameworksCategoryTooltip: "Kerangka kerja untuk memahami dan menyusun prompt untuk AI penghasil musik dan audio.",
    selectCategoryTitle: "Kategori",
    selectCategoryInstruction: "Pilih kategori kerangka kerja di atas untuk menjelajahi struktur dan mulai membangun pemahaman Anda tentang prompt yang efektif.",
    selectSpecificFrameworkInputSummary: "Pilih kerangka kerja dari petak untuk melihat komponennya dan mulai membangun prompt Anda. Setiap komponen akan memberikan contoh.",
    selectSpecificFrameworkOutputSummary: "Prompt terstruktur Anda akan muncul di sini, siap disalin ke alat AI Anda. Anda juga bisa mendapatkan masukan AI tentangnya!",
    clickToExpandInputPanel: (frameworkName: string) => `Tampilkan komponen '${frameworkName}' & contoh`,
    clickToExpandOutputPanel: "Tampilkan prompt Anda dan tindakan",
    selectOptionTooltip: "Pilih opsi",

    enhanceButtonText: "Minta Saran AI",
    enhanceButtonLoadingText: "Meminta Saran...",
    enhanceButtonTitle: "Dapatkan saran dari AI untuk prompt Anda (membutuhkan kunci API AI)",
    enhanceButtonAria: "Minta saran AI untuk prompt",
    aiFeedbackTitle: "Masukan & Saran AI (Prompt Keseluruhan)", 
    aiFeedbackTitleTextOnly: "Masukan & Saran AI (Prompt Keseluruhan)", 
    aiFeedbackLoading: "Mendapatkan masukan dari AI...",
    aiEnhancementError: "Maaf, terjadi kesalahan saat mengambil masukan AI. Silakan coba lagi.",
    apiKeyMissingError: "Kunci API AI tidak terkonfigurasi. Fitur ini tidak tersedia.",
    emptyPromptError: "Harap buat prompt terlebih dahulu sebelum meminta saran AI.",
    geminiPromptInstruction: `Bertindaklah sebagai instruktur rekayasa prompt yang sangat berpengalaman dan agak galak. Tujuan Anda adalah membuat pengguna memahami cara membuat prompt yang unggul dengan cepat.
Analisis prompt pengguna yang disediakan di bawah ini (di antara tiga tanda hubung). Prompt ini mungkin juga berisi bagian "Catatan & Instruksi Tambahan:".
Berikan masukan Anda dalam bentuk teks biasa (plain text), tanpa format markdown apa pun (tanpa tanda bintang, tanpa tanda kutip terbalik, tanpa simbol tagar untuk judul). Gunakan baris baru sederhana untuk paragraf atau daftar.
Masukan Anda HARUS mencakup bagian-bagian berikut, yang digambarkan dengan jelas:
1.  Kelebihan: Apa yang dilakukan pengguna dengan baik. Spesifik.
2.  Kekurangan: Di mana prompt tersebut kurang, tidak jelas, atau dapat disalahartikan oleh AI. Langsung ke intinya.
3.  Alasan: Jelaskan *mengapa* ini adalah kelebihan dan kekurangan. Fokus pada dampak terhadap potensi output AI dan kejelasan instruksi.
4.  Saran Tindak Lanjut: Berikan saran spesifik dan konkret tentang cara meningkatkan prompt. Tawarkan frasa alternatif atau tambahan. Sebagai bagian dari saran ini, jika pengguna telah memberikan konten di bagian "Catatan & Instruksi Tambahan:", tawarkan perbaikan spesifik untuk itu. Jika bagian tersebut kosong tetapi bisa bermanfaat untuk prompt khusus ini, sarankan jenis informasi apa yang mungkin dipertimbangkan pengguna untuk ditambahkan di sana. Dorong untuk keunggulan dan presisi.

Ingat, nada Anda harus seperti guru yang menuntut tetapi adil yang ingin muridnya berhasil dan belajar dengan cepat. Kritis namun konstruktif.
Prompt pengguna:`, // User prompt will be appended here by the app
    aiFeedbackReceivedIndicatorTooltip: "Masukan AI berhasil dimuat", 
    promptHasBeenCopiedIndicatorTooltip: "Prompt ini telah disalin.", 
    
    aiFeedbackStrengthsTitle: "Kelebihan:",
    aiFeedbackWeaknessesTitle: "Kekurangan:",
    aiFeedbackReasoningTitle: "Alasan:",
    aiFeedbackActionableSuggestionsTitle: "Saran Tindak Lanjut:", 

    suggestButtonTitle: "Dapatkan saran AI untuk isian ini (membutuhkan Kunci API)",
    suggestionsLoading: "Mendapatkan saran...",
    suggestionsError: "Gagal mengambil saran.",
    noSuggestionsFound: "Tidak ada saran ditemukan.",
    geminiInstructionForAutocomplete: (componentName, frameworkName, currentValue) => `Anda adalah asisten AI yang membantu pengguna menulis prompt. Pengguna sedang mengisi bagian '${componentName}' dari kerangka kerja '${frameworkName}'. Input mereka saat ini untuk bagian ini adalah: '${currentValue}'. Berikan hingga 3 saran pelengkapan otomatis atau kelanjutan yang singkat dan relevan untuk input ini. Kembalikan HANYA saran sebagai array JSON string. Contoh: ["saran1", "saran2", "saran3"]. Jika tidak ada saran, kembalikan array kosong [].`,

    translationInProgress: "Menerjemahkan konten...",
    translationGeneralError: "Terjadi kesalahan saat penerjemahan. Beberapa isian mungkin tidak diterjemahkan.",
    interactiveFormOptionOtherLabel: "Lainnya...",
    interactiveFormOptionOtherPlaceholder: "Sebutkan pilihan Anda",
    interactiveFormMultipleChoiceHelpText: "(Pilih semua yang sesuai)",
    interactiveFormManualInputPlaceholder: "Ketik detail Anda di sini...",

    userGoalInputLabel: "Jelaskan tujuan Anda untuk prompt:",
    userGoalInputPlaceholder: "Contoh: 'Buat slogan pemasaran untuk kedai kopi baru', 'Hasilkan skrip untuk video animasi pendek tentang eksplorasi luar angkasa', 'Buat trek hip hop lo-fi untuk belajar'",
    getFrameworkSuggestionsButton: "Dapatkan Saran Kerangka Kerja",
    getFrameworkSuggestionsButtonAria: "Dapatkan saran kerangka kerja berbasis AI sesuai tujuan Anda",
    frameworkSuggestionsLoading: "Mendapatkan saran kerangka kerja...",
    frameworkSuggestionsError: "Gagal mengambil saran kerangka kerja. Silakan coba lagi.",
    suggestedFrameworkTooltip: "Kerangka Kerja yang Disarankan AI",
    noFrameworkSuggestionsFound: "Tidak ada saran kerangka kerja spesifik yang ditemukan untuk tujuan Anda. Coba ubah frasa atau jelajahi kategori di bawah.",
    frameworkSuggestionInstruction: "Jelaskan apa yang ingin Anda capai dengan prompt Anda. AI akan menyarankan kerangka kerja yang sesuai.",
    frameworkSuggestionsTitle: "Penyaran Kerangka Kerja AI",
    aiPoweredFeatureTooltip: "Fitur Ditenagai AI (Membutuhkan Kunci API)", 
    aiFeaturesActiveIndicator: "Fitur AI aktif (Kunci API terdeteksi)", 
    geminiInstructionForFrameworkSuggestion: (frameworksInfoJson: string) => `Anda adalah asisten AI yang berspesialisasi dalam merekomendasikan kerangka kerja rekayasa prompt. Berdasarkan tujuan pengguna, Anda harus menyarankan ID kerangka kerja yang paling relevan dari daftar yang disediakan. Daftar kerangka kerja yang tersedia (termasuk ID, nama, deskripsi, dan kategori) adalah: ${frameworksInfoJson}. Balas HANYA dengan objek JSON yang berisi satu kunci "suggestedFrameworkIds", yang seharusnya berupa array string (ID dari kerangka kerja yang disarankan). Jika tidak ada kerangka kerja yang tampak relevan, kembalikan array kosong untuk "suggestedFrameworkIds". Jangan tambahkan penjelasan atau teks pengantar apa pun di luar objek JSON.`,

    // Labels for Interactive Prompt Assembly (New section for clarity)
    promptLabel_subject: "Subjek",
    promptLabel_action_details: "Aksi/Detail",
    promptLabel_art_style: "Gaya Seni",
    promptLabel_art_medium: "Medium Seni",
    promptLabel_artist_influence: "Pengaruh Seniman",
    promptLabel_artist_influences: "Pengaruh Seniman", // For Stable Diffusion
    promptLabel_composition: "Komposisi",
    promptLabel_lighting: "Gaya Pencahayaan",
    promptLabel_color_palette: "Palet Warna",
    promptLabel_detail_level: "Tingkat Detail",
    promptLabel_aspect_ratio: "Rasio Aspek",
    promptLabel_negative_prompt_elements: "Elemen Negatif",
    promptLabel_custom_negative: "Negatif Kustom",
    promptLabel_other_tool_params: "Parameter Lain",
    promptLabel_environment: "Lingkungan",
    promptLabel_atmosphere: "Atmosfer",
    promptLabel_version: "Versi",
    promptLabel_stylize: "Stylize",
    promptLabel_chaos: "Chaos",
    promptLabel_weird: "Weird",
    promptLabel_tile: "Tile",
    promptLabel_image_weight: "Bobot Gambar",
    promptLabel_style_raw: "Style Raw",
    promptLabel_other_params: "Parameter Lain", // Midjourney specific "other"
    promptLabel_scene_description: "Deskripsi Adegan", // DALL-E 3
    promptLabel_specific_details: "Detail Spesifik", // DALL-E 3
    promptLabel_color_focus: "Fokus Warna", // DALL-E 3
    promptLabel_lighting_mood: "Pencahayaan/Mood", // DALL-E 3, Stable Diffusion
    promptLabel_composition_angle: "Komposisi/Sudut", // DALL-E 3
    promptLabel_aspect_ratio_dalle: "Rasio Aspek", // DALL-E 3
    promptLabel_main_subject: "Subjek Utama", // Stable Diffusion
    promptLabel_key_details: "Detail Kunci", // Stable Diffusion
    promptLabel_quality_descriptors: "Deskriptor Kualitas", // Stable Diffusion
    promptLabel_art_style_medium: "Gaya Seni/Medium", // Stable Diffusion
    promptLabel_technical_aspects: "Aspek Teknis", // Stable Diffusion
    promptLabel_camera_shot: "Shot Kamera", // Stable Diffusion
    promptLabel_lighting_style: "Gaya Pencahayaan", // Stable Diffusion (can reuse, context should be clear)
    promptLabel_custom_negative_prompt: "Prompt Negatif Kustom", // Stable Diffusion
    promptLabel_param_info: "Catatan Parameter", // Stable Diffusion
    promptLabel_subjek: "Subjek", // Veo
    promptLabel_aksi: "Aksi", // Veo
    promptLabel_lokasi: "Lokasi", // Veo
    promptLabel_gaya: "Gaya", // Veo
    promptLabel_mood: "Mood", // Veo, Musik
    promptLabel_warna: "Palet Warna", // Veo
    promptLabel_shot: "Jenis Shot", // Veo
    promptLabel_angle: "Sudut Kamera", // Veo
    promptLabel_movement: "Gerakan Kamera", // Veo
    promptLabel_cahaya: "Pencahayaan", // Veo
    promptLabel_kualitas: "Kualitas", // Veo
    promptLabel_elemen_spesifik: "Elemen Spesifik", // Veo
    promptLabel_negative: "Prompt Negatif", // Veo custom negative
    promptLabel_scene_subject: "Adegan/Subjek", // Runway
    promptLabel_subject_action: "Aksi Subjek", // Runway
    promptLabel_camera_movement: "Kamera/Gerakan", // Runway
    promptLabel_visual_style: "Gaya Visual", // Runway
    promptLabel_lighting_atmosphere: "Pencahayaan/Atmosfer", // Runway
    promptLabel_environment_action: "Aksi Lingkungan", // Runway
    promptLabel_sound_design_note: "Catatan Suara", // Runway
    promptLabel_duration_note: "Catatan Durasi", // Runway
    promptLabel_genre: "Genre", // Suno, Detailed Music
    promptLabel_subgenre_modifiers: "Subgenre/Modifier", // Suno
    promptLabel_main_instruments: "Instrumen Utama", // Suno, Detailed Music
    promptLabel_vocal_style: "Gaya Vokal", // Suno, Detailed Music
    promptLabel_tempo: "Tempo", // Suno, Detailed Music
    promptLabel_rhythm_description: "Ritme/Groove", // Suno
    promptLabel_song_structure: "Struktur Lagu", // Suno
    promptLabel_lyrics_theme: "Tema Lirik", // Suno
    promptLabel_custom_lyrics_section: "Lirik Kustom", // Suno
    promptLabel_main_genre: "Genre Utama", // Detailed Music
    promptLabel_subgenre_style: "Subgenre/Gaya", // Detailed Music
    promptLabel_song_structure_desc: "Struktur Lagu", // Detailed Music
    promptLabel_duration_or_specifics: "Durasi/Spesifik", // Detailed Music
    promptLabel_lyrical_theme_or_custom: "Lirik", // Detailed Music

    categoryLabelImage: "Gambar",
    categoryLabelVideo: "Video",
    categoryLabelMusic: "Musik",
    categoryLabelText: "Teks",
    frameworkWord: "Kerangka Kerja",
  }
};
