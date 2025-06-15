
import { Framework, InteractiveQuestionDefinition, InteractiveSectionDefinition } from './types';

// Standard tool links for TEXT framework, ordered by estimated popularity
const standardTextToolLinks = [
  { name: 'ChatGPT (OpenAI)', url: 'https://chat.openai.com/' },
  { name: 'Gemini (Google)', url: 'https://gemini.google.com/app' },
  { name: 'Copilot (Microsoft)', url: 'https://copilot.microsoft.com/' },
  { name: 'Claude (Anthropic)', url: 'https://claude.ai/chats/' },
  { name: 'Perplexity AI', url: 'https://www.perplexity.ai/' },
  { name: 'Meta AI', url: 'https://www.meta.ai/' },
  { name: 'Jasper', url: 'https://app.jasper.ai/' },
  { name: 'Copy.ai', url: 'https://app.copy.ai/' },
  { name: 'DeepSeek', url: 'https://chat.deepseek.com/' },
  { name: 'Blackbox AI', url: 'https://www.blackbox.ai/' },
];

// Helper function to merge tool links for TEXT framework
const mergeAndSortTextToolLinks = (existingLinks: { name: string; url: string }[] = []) => {
  const finalLinks = [...standardTextToolLinks];
  const standardUrls = new Set(standardTextToolLinks.map(link => link.url));
  const uniqueExistingLinks = existingLinks
    .filter(link => !standardUrls.has(link.url))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...finalLinks, ...uniqueExistingLinks];
};

// Standard alternative tools for IMAGE & VIDEO framework
const standardImageVideoAlternatives = [
  { name: 'Leonardo.Ai', url: 'https://app.leonardo.ai/' },
  { name: 'Playground AI', url: 'https://playgroundai.com/create' },
  { name: 'RunwayML (Gen-2, etc.)', url: 'https://app.runwayml.com/video-tools' },
  { name: 'Pika Labs', url: 'https://pika.art/' },
  { name: 'Adobe Firefly', url: 'https://firefly.adobe.com/generate/images' },
  { name: 'Canva Magic Media', url: 'https://www.canva.com/magic-media/' },
  { name: 'Clipdrop (Stability AI Tools)', url: 'https://clipdrop.co/tools' },
  { name: 'Ideogram', url: 'https://ideogram.ai/create' },
  { name: 'Kaiber.ai', url: 'https://kaiber.ai/' },
  { name: 'NightCafe Creator', url: 'https://creator.nightcafe.studio/' }
].sort((a, b) => a.name.localeCompare(b.name));

// Standard alternative tools for MUSIC framework
const standardMusicAlternatives = [
  { name: 'Udio AI', url: 'https://www.udio.com/' },
  { name: 'Stable Audio (Stability AI)', url: 'https://stableaudio.com/generate/' },
  { name: 'Mubert', url: 'https://mubert.com/render' },
  { name: 'Google MusicFX (AI Test Kitchen)', url: 'https://aitestkitchen.withgoogle.com/tools/music-fx' }
].sort((a, b) => a.name.localeCompare(b.name));

// Helper function to create generic tool links for MEDIA and MUSIC framework
const createMediaMusicToolLinks = (
  officialFrameworkName: string,
  officialFrameworkUrl: string | undefined,
  alternativeTools: { name: string; url: string }[]
) => {
  const links: { name: string; url: string }[] = [];
  const urlsPresent = new Set<string>();

  if (officialFrameworkUrl) {
    links.push({ name: `${officialFrameworkName} (Official)`, url: officialFrameworkUrl });
    urlsPresent.add(officialFrameworkUrl);
  }

  alternativeTools.forEach(altTool => {
    if (!urlsPresent.has(altTool.url)) {
      links.push(altTool);
      urlsPresent.add(altTool.url);
    }
  });
  return links.sort((a, b) => a.name.localeCompare(b.name));
};

// --- Common Interactive Options ---
const commonArtStyles = ['Fotorealistis', 'Lukisan Digital', 'Seni Fantasi Epik', 'Kartun', 'Anime (Umum)', 'Anime - Gaya Ghibli', 'Anime - Gaya Shonen', 'Surealis', 'Abstrak', 'Gaya Watercolor', 'Seni Pixel', 'Seni Konseptual', 'Steampunk', 'Cyberpunk', 'Gothic', 'Vintage', 'Seni Ilmiah-Fiksi', 'Seni Abstrak Geometris', 'Pop Art', 'Seni Jalanan (Graffiti)'];
const commonArtStylesEn = ['Photorealistic', 'Digital Painting', 'Epic Fantasy Art', 'Cartoon', 'Anime (General)', 'Anime - Ghibli Style', 'Anime - Shonen Style', 'Surreal', 'Abstract', 'Watercolor Style', 'Pixel Art', 'Concept Art', 'Steampunk', 'Cyberpunk', 'Gothic', 'Vintage', 'Sci-Fi Art', 'Geometric Abstract', 'Pop Art', 'Street Art (Graffiti)'];

const commonImageComposition = ['Close-up', 'Medium Shot', 'Full Shot (Seluruh Badan)', 'Wide Shot (Bidang Lebar)', 'Extreme Wide Shot', 'Eye-Level (Sejajar Mata)', 'High Angle (Sudut Tinggi)', 'Low Angle (Sudut Rendah)', 'Dutch Angle (Miring)', 'Portrait (Potret)', 'Landscape (Pemandangan)', 'Macro', 'Over-the-Shoulder Shot', 'Point of View (POV)'];
const commonImageCompositionEn = ['Close-up', 'Medium Shot', 'Full Body Shot', 'Wide Shot', 'Extreme Wide Shot', 'Eye-Level', 'High Angle', 'Low Angle', 'Dutch Angle', 'Portrait', 'Landscape', 'Macro', 'Over-the-Shoulder Shot', 'Point of View (POV)'];

const commonLightingStyles = ['Sinematik', 'Studio', 'Alami (Siang Hari)', 'Lembut (Soft)', 'Dramatis (Kontras Tinggi)', 'Cahaya Tepi (Rim Light)', 'Cahaya Latar (Backlight)', 'Golden Hour (Matahari Terbit/Terbenam)', 'Blue Hour (Setelah Matahari Terbenam/Sebelum Terbit)', 'Neon', 'Volumetrik', 'Ambient Occlusion', 'Cahaya Remang (Dim Light)', 'Pencahayaan Split'];
const commonLightingStylesEn = ['Cinematic', 'Studio', 'Natural Daylight', 'Soft', 'Dramatic (High Contrast)', 'Rim Light', 'Backlight', 'Golden Hour (Sunrise/Sunset)', 'Blue Hour (Post-Sunset/Pre-Sunrise)', 'Neon', 'Volumetric', 'Ambient Occlusion', 'Dim Light', 'Split Lighting'];

const commonQualityDescriptors = ['Sangat detail', 'Kualitas 8K', 'Kualitas 4K', 'Ultra realistis', 'Fokus tajam', 'Halus', 'Mahakarya', 'Kualitas terbaik', 'Grain film', 'Blur sinematik', 'Bokeh', 'Tekstur Jelas', 'Resolusi Tinggi'];
const commonQualityDescriptorsEn = ['Highly detailed', '8K quality', '4K quality', 'Ultra realistic', 'Sharp focus', 'Smooth', 'Masterpiece', 'Best quality', 'Film grain', 'Cinematic blur', 'Bokeh', 'Clear Textures', 'High Resolution'];

const commonNegativeImageElements = ['Buram', 'Kualitas rendah', 'Deformasi', 'Jelek', 'Anatomi buruk', 'Tangan buruk', 'Wajah buruk', 'Anggota tubuh ekstra', 'Anggota tubuh hilang', 'Teks', 'Watermark', 'Tanda tangan', 'Nama pengguna', 'Nama artis', 'Terpotong', 'Bingkai', 'Meng کاشی (Tiling)', 'Di luar bingkai', 'Cacat', 'Mutasi', 'Menjijikkan', 'NSFW', 'Kasar'];
const commonNegativeImageElementsEn = ['Blurry', 'Low quality', 'Deformed', 'Ugly', 'Bad anatomy', 'Poorly drawn hands', 'Poorly drawn face', 'Extra limbs', 'Missing limbs', 'Text', 'Watermark', 'Signature', 'Username', 'Artist name', 'Cropped', 'Frame', 'Tiling', 'Out of frame', 'Disfigured', 'Mutation', 'Morbid', 'Mutilated', 'NSFW', 'Gross'];

const commonAspectRatioOptions = ['1:1 (Persegi)', '16:9 (Layar Lebar)', '9:16 (Vertikal)', '3:2 (Lanskap)', '2:3 (Potret)', '4:3 (TV Standar)', '3:4 (Potret)', '4:5 (Potret)', '5:4 (Lanskap)', '2.39:1 (Sinematik Anamorphic)'];
const commonAspectRatioOptionsEn = ['1:1 (Square)', '16:9 (Widescreen)', '9:16 (Vertical)', '3:2 (Landscape)', '2:3 (Portrait)', '4:3 (Standard TV)', '3:4 (Portrait)', '4:5 (Portrait)', '5:4 (Landscape)', '2.39:1 (Anamorphic Cinematic)'];

const commonMusicGenres = ['Pop', 'Rock (Alternatif, Hard Rock)', 'Elektronik (Techno, House, Trance, Synthwave, EDM, Downtempo)', 'Hip Hop (Trap, Boom Bap, Lo-fi Hip Hop)', 'Jazz (Smooth Jazz, Big Band, Bebop)', 'Klasik (Orkestra, Piano Solo, Kamar)', 'Folk', 'Ambient', 'Soundtrack (Sinematik, Video Game)', 'Blues', 'Country', 'Metal (Heavy Metal, Death Metal)', 'Reggae', 'R&B', 'Funk', 'Soul', 'Musik Dunia (Etnik)', 'Eksperimental'];
const commonMusicGenresEn = ['Pop', 'Rock (Alt-Rock, Hard Rock)', 'Electronic (Techno, House, Trance, Synthwave, EDM, Downtempo)', 'Hip Hop (Trap, Boom Bap, Lo-fi Hip Hop)', 'Jazz (Smooth Jazz, Big Band, Bebop)', 'Classical (Orchestral, Piano Solo, Chamber)', 'Folk', 'Ambient', 'Soundtrack (Cinematic, Video Game)', 'Blues', 'Country', 'Metal (Heavy Metal, Death Metal)', 'Reggae', 'R&B', 'Funk', 'Soul', 'World Music (Ethnic)', 'Experimental'];

const commonMusicMoods = ['Senang', 'Sedih', 'Energetik', 'Santai', 'Tenang', 'Epik', 'Misterius', 'Gelap', 'Romantis', 'Penuh Harapan', 'Nostalgia', 'Membangkitkan Semangat', 'Agresif', 'Damai', 'Melamun', 'Groovy', 'Intens', 'Ceria', 'Menegangkan'];
const commonMusicMoodsEn = ['Happy', 'Sad', 'Energetic', 'Relaxing', 'Calm', 'Epic', 'Mysterious', 'Dark', 'Romantic', 'Hopeful', 'Nostalgic', 'Uplifting', 'Aggressive', 'Peaceful', 'Dreamy', 'Groovy', 'Intense', 'Cheerful', 'Suspenseful'];

const commonVocalStyles = ['Vokal Utama Pria', 'Vokal Utama Wanita', 'Duet (Pria/Wanita)', 'Instrumental (Tanpa Vokal)', 'Paduan Suara', 'Paduan Suara Anak-anak', 'Rap (Pria)', 'Rap (Wanita)', 'Opera (Pria)', 'Opera (Wanita)', 'Kata-kata yang Diucapkan (Spoken Word)', 'Bisikan', 'Potongan Vokal (Vocal Chops)', 'Vokal Latar'];
const commonVocalStylesEn = ['Male Lead Vocals', 'Female Lead Vocals', 'Duet (Male/Female)', 'Instrumental (No Vocals)', 'Choir', 'Children\'s Choir', 'Rap (Male)', 'Rap (Female)', 'Operatic (Male)', 'Operatic (Female)', 'Spoken Word', 'Whispering', 'Vocal Chops', 'Backing Vocals'];

const commonTempoOptions = ['Sangat Lambat (<60 BPM)', 'Lambat (60-80 BPM)', 'Sedang (80-120 BPM)', 'Agak Cepat (120-140 BPM)', 'Cepat (140-180 BPM)', 'Sangat Cepat (>180 BPM)'];
const commonTempoOptionsEn = ['Very Slow (<60 BPM)', 'Slow (60-80 BPM)', 'Medium (80-120 BPM)', 'Moderately Fast (120-140 BPM)', 'Fast (140-180 BPM)', 'Very Fast (>180 BPM)'];

export const midjourneyAspectRatioOptions = [
  "1:1 (Persegi Default)", "16:9 (Layar Lebar)", "9:16 (Vertikal)", "3:2 (Lanskap Foto)", "2:3 (Potret Foto)",
  "4:3 (TV Lama)", "3:4 (Potret Sedang)", "4:5 (Potret Sosial)", "5:4 (Lanskap Sedang)", "2:1 (Panorama)", "1:2 (Tinggi)"
];
export const midjourneyAspectRatioOptionsEn = [
  "1:1 (Default Square)", "16:9 (Widescreen)", "9:16 (Vertical)", "3:2 (Photo Landscape)", "2:3 (Photo Portrait)",
  "4:3 (Old TV)", "3:4 (Medium Portrait)", "4:5 (Social Portrait)", "5:4 (Medium Landscape)", "2:1 (Panoramic)", "1:2 (Tall)"
];
export const midjourneyVersionOptions = ["6.0", "5.2", "5.1", "5.0", "4.0", "niji 6", "niji 5", "niji 4"];
export const midjourneyVersionOptionsEn = ["6.0", "5.2", "5.1", "5.0", "4.0", "niji 6", "niji 5", "niji 4"];

// --- Helper Functions for Interactive Definitions ---

const createDetailedImageVideoSections = (frameworkName: string, lang: 'id' | 'en'): InteractiveSectionDefinition[] => {
  const isId = lang === 'id';
  return [
    {
      title: isId ? `Deskripsi Utama untuk ${frameworkName}` : `Main Description for ${frameworkName}`,
      questions: [
        { id: 'subject', promptText: isId ? 'Subjek Utama' : 'Main Subject', type: 'manual', defaultValue: isId ? 'Seekor naga fantasi dengan sisik berkilauan' : 'A fantasy dragon with iridescent scales' },
        { id: 'action_details', promptText: isId ? 'Aksi/Detail Tambahan' : 'Action/Additional Details', type: 'manual', defaultValue: isId ? 'terbang di atas pegunungan berkabut saat matahari terbenam' : 'flying over misty mountains at sunset' },
      ],
    },
    {
      title: isId ? 'Gaya Artistik & Visual' : 'Artistic & Visual Style',
      questions: [
        { id: 'art_style', promptText: isId ? 'Gaya Seni' : 'Art Style', type: 'single-choice', options: isId ? commonArtStyles : commonArtStylesEn, defaultValue: isId ? 'Seni Fantasi Epik' : 'Epic Fantasy Art', includeOtherOption: true },
        { id: 'art_medium', promptText: isId ? 'Medium Seni (Opsional)' : 'Art Medium (Optional)', type: 'manual', defaultValue: isId ? 'lukisan digital, konsep seni' : 'digital painting, concept art' },
        { id: 'artist_influence', promptText: isId ? 'Pengaruh Seniman (Opsional)' : 'Artist Influence (Optional)', type: 'manual', defaultValue: isId ? 'Greg Rutkowski, Alphonse Mucha' : 'Greg Rutkowski, Alphonse Mucha' },
      ],
    },
    {
      title: isId ? 'Komposisi & Pencahayaan' : 'Composition & Lighting',
      questions: [
        { id: 'composition', promptText: isId ? 'Komposisi/Sudut Pandang' : 'Composition/Angle', type: 'single-choice', options: isId ? commonImageComposition : commonImageCompositionEn, defaultValue: isId ? 'Wide Shot (Bidang Lebar)' : 'Wide Shot', includeOtherOption: true },
        { id: 'lighting', promptText: isId ? 'Gaya Pencahayaan' : 'Lighting Style', type: 'single-choice', options: isId ? commonLightingStyles : commonLightingStylesEn, defaultValue: isId ? 'Golden Hour (Matahari Terbit/Terbenam)' : 'Golden Hour (Sunrise/Sunset)', includeOtherOption: true },
      ],
    },
    {
      title: isId ? 'Warna & Detail' : 'Color & Detail',
      questions: [
        { id: 'color_palette', promptText: isId ? 'Palet Warna Dominan' : 'Dominant Color Palette', type: 'manual', defaultValue: isId ? 'warna hangat, oranye, emas, dengan kontras biru tua' : 'warm colors, oranges, golds, with deep blue contrasts' },
        { id: 'detail_level', promptText: isId ? 'Tingkat Detail/Kualitas' : 'Detail Level/Quality', type: 'multiple-choice', options: isId ? commonQualityDescriptors : commonQualityDescriptorsEn, defaultValue: [isId ? 'Sangat detail' : 'Highly detailed', isId ? 'Kualitas 4K' : '4K quality'] },
      ],
    },
    {
      title: isId ? 'Parameter & Elemen Negatif' : 'Parameters & Negative Elements',
      questions: [
        { id: 'aspect_ratio', promptText: isId ? 'Rasio Aspek (Jika Didukung)' : 'Aspect Ratio (If Supported)', type: 'single-choice', options: commonAspectRatioOptions, defaultValue: '16:9 (Layar Lebar)', includeOtherOption: true },
        { id: 'negative_prompt_elements', promptText: isId ? 'Elemen Negatif Umum (Hindari Ini)' : 'Common Negative Elements (Avoid These)', type: 'multiple-choice', options: isId ? commonNegativeImageElements : commonNegativeImageElementsEn, defaultValue: [isId ? 'Kualitas rendah' : 'Low quality', isId ? 'Buram' : 'Blurry'] },
        { id: 'custom_negative', promptText: isId ? 'Prompt Negatif Kustom (Opsional)' : 'Custom Negative Prompt (Optional)', type: 'manual', defaultValue: '' },
        { id: 'other_tool_params', promptText: isId ? 'Parameter Spesifik Alat Lain (Opsional)' : 'Other Tool-Specific Parameters (Optional)', type: 'manual', defaultValue: isId ? '--chaos 10 (jika relevan)' : '--chaos 10 (if relevant)' },
      ],
    },
  ];
};

const createDetailedMusicSections = (frameworkName: string, lang: 'id' | 'en'): InteractiveSectionDefinition[] => {
  const isId = lang === 'id';
  return [
    {
      title: isId ? `Genre & Gaya untuk ${frameworkName}` : `Genre & Style for ${frameworkName}`,
      questions: [
        { id: 'main_genre', promptText: isId ? 'Genre Utama' : 'Main Genre', type: 'single-choice', options: isId ? commonMusicGenres : commonMusicGenresEn, defaultValue: isId ? 'Elektronik (Techno, House, Trance, Synthwave, EDM, Downtempo)' : 'Electronic (Techno, House, Trance, Synthwave, EDM, Downtempo)', includeOtherOption: true },
        { id: 'subgenre_style', promptText: isId ? 'Subgenre/Gaya Spesifik' : 'Specific Subgenre/Style', type: 'manual', defaultValue: isId ? 'Synthwave dengan nuansa retro 80an' : 'Synthwave with an 80s retro vibe' },
      ],
    },
    {
      title: isId ? 'Mood & Tempo' : 'Mood & Tempo',
      questions: [
        { id: 'mood', promptText: isId ? 'Mood/Suasana Hati' : 'Mood/Atmosphere', type: 'single-choice', options: isId ? commonMusicMoods : commonMusicMoodsEn, defaultValue: isId ? 'Nostalgia' : 'Nostalgic', includeOtherOption: true },
        { id: 'tempo', promptText: isId ? 'Tempo' : 'Tempo', type: 'single-choice', options: isId ? commonTempoOptions : commonTempoOptionsEn, defaultValue: isId ? 'Sedang (80-120 BPM)' : 'Medium (80-120 BPM)', includeOtherOption: true },
      ],
    },
    {
      title: isId ? 'Instrumen & Vokal' : 'Instruments & Vocals',
      questions: [
        { id: 'main_instruments', promptText: isId ? 'Instrumen Utama' : 'Main Instruments', type: 'manual', defaultValue: isId ? 'Synthesizer (Jupiter-8, Juno-60), Drum machine (LinnDrum), Bassline' : 'Synthesizers (Jupiter-8, Juno-60), Drum machine (LinnDrum), Bassline' },
        { id: 'vocal_style', promptText: isId ? 'Gaya Vokal (Jika Ada)' : 'Vocal Style (If Any)', type: 'single-choice', options: isId ? commonVocalStyles : commonVocalStylesEn, defaultValue: isId ? 'Instrumental (Tanpa Vokal)' : 'Instrumental (No Vocals)', includeOtherOption: true },
      ],
    },
    {
      title: isId ? 'Struktur & Durasi' : 'Structure & Duration',
      questions: [
        { id: 'song_structure_desc', promptText: isId ? 'Deskripsi Struktur Lagu (Opsional)' : 'Song Structure Description (Optional)', type: 'manual', defaultValue: isId ? 'Intro, Verse, Chorus, Verse, Chorus, Bridge, Outro' : 'Intro, Verse, Chorus, Verse, Chorus, Bridge, Outro' },
        { id: 'duration_or_specifics', promptText: isId ? 'Durasi atau Spesifikasi Lain' : 'Duration or Other Specifics', type: 'manual', defaultValue: isId ? 'sekitar 3-4 menit, loopable' : 'around 3-4 minutes, loopable' },
      ],
    },
    {
      title: isId ? 'Lirik (Jika Ada)' : 'Lyrics (If Applicable)',
      questions: [
        { id: 'lyrical_theme_or_custom', promptText: isId ? 'Tema Liris atau Lirik Kustom Penuh' : 'Lyrical Theme or Full Custom Lyrics', type: 'manual', defaultValue: isId ? 'perjalanan malam di kota neon.' : 'a nighttime drive through a neon city.' },
      ],
    },
  ];
};


// --- Definisi Interaktif untuk Veo (digunakan oleh Google Veo) ---
const veoInteractiveDefinitionId: InteractiveSectionDefinition[] = [
  {
    title: "Konsep Video Utama",
    questions: [
      { id: 'subjek', promptText: 'Subjek Utama Video', type: 'manual', defaultValue: 'Kucing oranye sedang bermain' },
      { id: 'aksi', promptText: 'Aksi yang Dilakukan Subjek', type: 'manual', defaultValue: 'mengejar kupu-kupu di taman bunga' },
      { id: 'lokasi', promptText: 'Lokasi/Setting Video', type: 'manual', defaultValue: 'taman bunga yang cerah di pagi hari' },
    ],
  },
  {
    title: "Gaya Visual & Suasana",
    questions: [
      { id: 'gaya', promptText: 'Gaya Visual Video', type: 'single-choice', options: ['Realistis', 'Sinematik', 'Animasi Kartun', 'Stop Motion', 'Dokumenter Alam', ...commonArtStyles], defaultValue: 'Realistis', includeOtherOption: true },
      { id: 'mood', promptText: 'Suasana Hati (Mood)', type: 'single-choice', options: commonMusicMoods, defaultValue: 'Ceria', includeOtherOption: true },
      { id: 'warna', promptText: 'Palet Warna Dominan', type: 'manual', defaultValue: 'warna-warna cerah, pastel, hijau dan biru dominan' },
    ],
  },
  {
    title: "Detail Sinematografi",
    questions: [
      { id: 'shot', promptText: 'Jenis Shot/Pengambilan Gambar', type: 'single-choice', options: ['Close-up pada subjek', 'Medium shot', 'Wide shot menunjukkan lingkungan', 'Tracking shot mengikuti subjek', ...commonImageComposition], defaultValue: 'Medium shot', includeOtherOption: true },
      { id: 'angle', promptText: 'Sudut Kamera', type: 'single-choice', options: ['Eye-level', 'Low angle', 'High angle', 'Bird\'s eye view'], defaultValue: 'Eye-level', includeOtherOption: true },
      { id: 'movement', promptText: 'Pergerakan Kamera', type: 'single-choice', options: ['Statis', 'Panning lambat', 'Tilt ke atas', 'Zoom in perlahan', 'Handheld shaky'], defaultValue: 'Panning lambat', includeOtherOption: true },
      { id: 'cahaya', promptText: 'Pencahayaan', type: 'single-choice', options: commonLightingStyles, defaultValue: 'Alami (Siang Hari)', includeOtherOption: true },
    ],
  },
  {
    title: "Kualitas & Detail Tambahan",
    questions: [
      { id: 'kualitas', promptText: 'Kualitas Video yang Diinginkan', type: 'single-choice', options: ['Kualitas tinggi', 'HD', '4K', 'Sinematik', 'Jernih'], defaultValue: 'Kualitas tinggi', includeOtherOption: true },
      { id: 'elemen_spesifik', promptText: 'Elemen Spesifik yang Harus Ada', type: 'manual', defaultValue: 'kupu-kupu berwarna biru, bunga matahari' },
      { id: 'negative', promptText: 'Prompt Negatif (Hal yang Dihindari)', type: 'manual', defaultValue: 'manusia, buram, kualitas rendah' },
    ],
  },
];
const veoInteractiveDefinitionEn: InteractiveSectionDefinition[] = [
  {
    title: "Core Video Concept",
    questions: [
      { id: 'subjek', promptText: 'Main Subject of the Video', type: 'manual', defaultValue: 'An orange cat playing' },
      { id: 'aksi', promptText: 'Action Performed by Subject', type: 'manual', defaultValue: 'chasing a butterfly in a flower garden' },
      { id: 'lokasi', promptText: 'Location/Setting of the Video', type: 'manual', defaultValue: 'a bright flower garden in the morning' },
    ],
  },
  {
    title: "Visual Style & Atmosphere",
    questions: [
      { id: 'gaya', promptText: 'Visual Style of the Video', type: 'single-choice', options: ['Realistic', 'Cinematic', 'Cartoon Animation', 'Stop Motion', 'Nature Documentary', ...commonArtStylesEn], defaultValue: 'Realistic', includeOtherOption: true },
      { id: 'mood', promptText: 'Mood', type: 'single-choice', options: commonMusicMoodsEn, defaultValue: 'Cheerful', includeOtherOption: true },
      { id: 'warna', promptText: 'Dominant Color Palette', type: 'manual', defaultValue: 'bright colors, pastels, dominant greens and blues' },
    ],
  },
  {
    title: "Cinematography Details",
    questions: [
      { id: 'shot', promptText: 'Shot Type', type: 'single-choice', options: ['Close-up on subject', 'Medium shot', 'Wide shot showing environment', 'Tracking shot following subject', ...commonImageCompositionEn], defaultValue: 'Medium shot', includeOtherOption: true },
      { id: 'angle', promptText: 'Camera Angle', type: 'single-choice', options: ['Eye-level', 'Low angle', 'High angle', 'Bird\'s eye view'], defaultValue: 'Eye-level', includeOtherOption: true },
      { id: 'movement', promptText: 'Camera Movement', type: 'single-choice', options: ['Static', 'Slow panning', 'Tilt up', 'Slow zoom in', 'Handheld shaky'], defaultValue: 'Slow panning', includeOtherOption: true },
      { id: 'cahaya', promptText: 'Lighting', type: 'single-choice', options: commonLightingStylesEn, defaultValue: 'Natural Daylight', includeOtherOption: true },
    ],
  },
  {
    title: "Quality & Additional Details",
    questions: [
      { id: 'kualitas', promptText: 'Desired Video Quality', type: 'single-choice', options: ['High quality', 'HD', '4K', 'Cinematic', 'Clear'], defaultValue: 'High quality', includeOtherOption: true },
      { id: 'elemen_spesifik', promptText: 'Specific Elements to Include', type: 'manual', defaultValue: 'blue butterfly, sunflowers' },
      { id: 'negative', promptText: 'Negative Prompt (Things to Avoid)', type: 'manual', defaultValue: 'humans, blurry, low quality' },
    ],
  },
];
// CLEANED TEMPLATE: Only placeholders and universal separators (if any). App.tsx will handle labels.
export const veoInteractivePromptTemplate = `{{gaya}}, {{shot}}, {{subjek}}, {{aksi}}, {{lokasi}}, {{cahaya}}, {{mood}}, {{warna}}, {{movement}}, {{angle}}, {{kualitas}}, {{elemen_spesifik}}{{veo_negative_parameter_string}}`;


// --- Midjourney Interactive (Enhanced) ---
const midjourneySectionsId: InteractiveSectionDefinition[] = [
    {
        title: "Deskripsi Visual Utama",
        questions: [
            { id: 'subject', promptText: 'Subjek Utama', type: 'manual', defaultValue: 'Prajurit cyberpunk dengan armor neon' },
            { id: 'action_details', promptText: 'Aksi & Detail Tambahan Subjek', type: 'manual', defaultValue: 'berdiri di jalanan kota yang basah oleh hujan, memegang pedang energi' },
            { id: 'environment', promptText: 'Lingkungan/Latar Belakang', type: 'manual', defaultValue: 'kota futuristik di malam hari, gedung pencakar langit dengan iklan hologram' },
        ],
    },
    {
        title: "Gaya Artistik & Visual",
        questions: [
            { id: 'art_style', promptText: 'Gaya Seni', type: 'single-choice', options: commonArtStyles, defaultValue: 'Cyberpunk', includeOtherOption: true },
            { id: 'art_medium', promptText: 'Medium Seni (Opsional)', type: 'manual', defaultValue: 'lukisan digital, seni konsep sinematik' },
            { id: 'artist_influence', promptText: 'Pengaruh Seniman (Opsional)', type: 'manual', defaultValue: 'Syd Mead, Josan Gonzalez' },
            { id: 'atmosphere', promptText: 'Atmosfer/Mood', type: 'manual', defaultValue: 'gelap, misterius, distopia, sedikit berbahaya' },
            { id: 'color_palette', promptText: 'Palet Warna Dominan', type: 'manual', defaultValue: 'biru elektrik, magenta, ungu, dengan kontras kuning neon' },
            { id: 'detail_level', promptText: 'Tingkat Detail', type: 'single-choice', options: commonQualityDescriptors, defaultValue: 'Sangat detail', includeOtherOption: true },
        ],
    },
    {
        title: "Komposisi & Parameter Teknis",
        questions: [
            { id: 'composition', promptText: 'Komposisi/Sudut Pandang', type: 'single-choice', options: commonImageComposition, defaultValue: 'Medium Shot', includeOtherOption: true },
            { id: 'lighting', promptText: 'Pencahayaan', type: 'single-choice', options: commonLightingStyles, defaultValue: 'Neon', includeOtherOption: true },
            { id: 'aspect_ratio', promptText: 'Rasio Aspek', type: 'single-choice', options: midjourneyAspectRatioOptions, defaultValue: '16:9 (Layar Lebar)' },
            { id: 'version', promptText: 'Versi Midjourney', type: 'single-choice', options: midjourneyVersionOptions, defaultValue: '6.0' },
        ],
    },
    {
        title: "Parameter Midjourney (Opsional)",
        questions: [
            { id: 'stylize', promptText: 'Stylize (0-1000)', type: 'manual', defaultValue: '250' },
            { id: 'chaos', promptText: 'Chaos (0-100)', type: 'manual', defaultValue: '10' },
            { id: 'weird', promptText: 'Weird (0-3000)', type: 'manual', defaultValue: '' },
            { id: 'tile', promptText: 'Tile (Pola Berulang)', type: 'single-choice', options: ['Tidak', 'Ya'], defaultValue: 'Tidak' },
            { id: 'image_weight', promptText: 'Image Weight (--iw, jika menggunakan gambar referensi, 0-2)', type: 'manual', defaultValue: '' },
            { id: 'style_raw', promptText: 'Style Raw (v5+)', type: 'single-choice', options: ['Tidak', 'Ya (untuk v5+)'], defaultValue: 'Tidak' },
            { id: 'other_params', promptText: 'Parameter Lainnya (mis. --no, --seed)', type: 'manual', defaultValue: '--no blur' },
        ],
    },
];
const midjourneySectionsEn: InteractiveSectionDefinition[] = [
    {
        title: "Main Visual Description",
        questions: [
            { id: 'subject', promptText: 'Main Subject', type: 'manual', defaultValue: 'Cyberpunk warrior with neon armor' },
            { id: 'action_details', promptText: 'Subject Action & Additional Details', type: 'manual', defaultValue: 'standing on a rain-slicked city street, holding an energy sword' },
            { id: 'environment', promptText: 'Environment/Background', type: 'manual', defaultValue: 'futuristic city at night, skyscrapers with holographic ads' },
        ],
    },
    {
        title: "Artistic & Visual Style",
        questions: [
            { id: 'art_style', promptText: 'Art Style', type: 'single-choice', options: commonArtStylesEn, defaultValue: 'Cyberpunk', includeOtherOption: true },
            { id: 'art_medium', promptText: 'Art Medium (Optional)', type: 'manual', defaultValue: 'digital painting, cinematic concept art' },
            { id: 'artist_influence', promptText: 'Artist Influence (Optional)', type: 'manual', defaultValue: 'Syd Mead, Josan Gonzalez' },
            { id: 'atmosphere', promptText: 'Atmosphere/Mood', type: 'manual', defaultValue: 'dark, mysterious, dystopian, slightly dangerous' },
            { id: 'color_palette', promptText: 'Dominant Color Palette', type: 'manual', defaultValue: 'electric blues, magentas, purples, with neon yellow contrasts' },
            { id: 'detail_level', promptText: 'Detail Level', type: 'single-choice', options: commonQualityDescriptorsEn, defaultValue: 'Highly detailed', includeOtherOption: true },
        ],
    },
    {
        title: "Composition & Technical Parameters",
        questions: [
            { id: 'composition', promptText: 'Composition/Angle', type: 'single-choice', options: commonImageCompositionEn, defaultValue: 'Medium Shot', includeOtherOption: true },
            { id: 'lighting', promptText: 'Lighting', type: 'single-choice', options: commonLightingStylesEn, defaultValue: 'Neon', includeOtherOption: true },
            { id: 'aspect_ratio', promptText: 'Aspect Ratio', type: 'single-choice', options: midjourneyAspectRatioOptionsEn, defaultValue: '16:9 (Widescreen)' },
            { id: 'version', promptText: 'Midjourney Version', type: 'single-choice', options: midjourneyVersionOptionsEn, defaultValue: '6.0' },
        ],
    },
    {
        title: "Midjourney Parameters (Optional)",
        questions: [
            { id: 'stylize', promptText: 'Stylize (0-1000)', type: 'manual', defaultValue: '250' },
            { id: 'chaos', promptText: 'Chaos (0-100)', type: 'manual', defaultValue: '10' },
            { id: 'weird', promptText: 'Weird (0-3000)', type: 'manual', defaultValue: '' },
            { id: 'tile', promptText: 'Tile (Repeating Pattern)', type: 'single-choice', options: ['No', 'Yes'], defaultValue: 'No' },
            { id: 'image_weight', promptText: 'Image Weight (--iw, if using reference image, 0-2)', type: 'manual', defaultValue: '' },
            { id: 'style_raw', promptText: 'Style Raw (v5+)', type: 'single-choice', options: ['No', 'Yes (for v5+)'], defaultValue: 'No' },
            { id: 'other_params', promptText: 'Other Parameters (e.g. --no, --seed)', type: 'manual', defaultValue: '--no blur' },
        ],
    },
];
// CLEANED TEMPLATE: Only placeholders and universal separators (if any). App.tsx will handle labels.
// This template might primarily be for parameter placeholders if the descriptive part is fully built in App.tsx.
export const midjourneyTemplate = `{{subject}}, {{action_details}}, {{environment}}, {{art_style}}, {{art_medium}}, {{artist_influence}}, {{composition}}, {{lighting}}, {{atmosphere}}, {{color_palette}}, {{detail_level}}{{midjourney_aspect_ratio_param_string}}{{midjourney_version_param_string}}{{midjourney_stylize_param_string}}{{midjourney_chaos_param_string}}{{midjourney_weird_param_string}}{{midjourney_tile_param_string}}{{midjourney_iw_param_string}}{{midjourney_style_raw_param_string}} {{other_params}}`;


// --- DALL-E 3 Interactive (Enhanced) ---
const dalle3SectionsId: InteractiveSectionDefinition[] = [
    {
        title: "Deskripsi Adegan Utama",
        questions: [
            { id: 'scene_description', promptText: 'Deskripsi Adegan Komprehensif', type: 'manual', defaultValue: 'Seekor rubah merah yang cerdik dengan kacamata baca sedang duduk di perpustakaan kuno yang nyaman, dikelilingi oleh tumpukan buku dan cahaya lilin yang hangat.' },
        ],
    },
    {
        title: "Gaya Artistik & Detail",
        questions: [
            { id: 'art_style', promptText: 'Gaya Artistik', type: 'single-choice', options: commonArtStyles, defaultValue: 'Lukisan Digital', includeOtherOption: true }, // Changed from 'artistic_style' to 'art_style' for consistency
            { id: 'artist_influence', promptText: 'Pengaruh Seniman (Opsional)', type: 'manual', defaultValue: 'Beatrix Potter' },
            { id: 'specific_details', promptText: 'Detail Spesifik untuk Dimasukkan', type: 'manual', defaultValue: 'detail bulu rubah, tekstur halaman buku, asap dari lilin' },
        ],
    },
    {
        title: "Warna, Pencahayaan & Komposisi",
        questions: [
            { id: 'color_focus', promptText: 'Fokus Warna / Palet', type: 'manual', defaultValue: 'warna-warna hangat, cokelat, oranye, krem, dengan aksen emas' },
            { id: 'lighting_mood', promptText: 'Pencahayaan & Suasana Hati (Mood)', type: 'manual', defaultValue: 'pencahayaan lembut dan hangat dari lilin, menciptakan suasana nyaman dan magis' },
            { id: 'composition_angle', promptText: 'Komposisi & Sudut Pandang', type: 'single-choice', options: commonImageComposition, defaultValue: 'Medium Shot', includeOtherOption: true },
            { id: 'aspect_ratio_dalle', promptText: 'Rasio Aspek', type: 'single-choice', options: ["1:1 (Persegi)", "16:9 (Lanskap)", "9:16 (Potret)"], defaultValue: '16:9 (Lanskap)' },
        ],
    },
];
const dalle3SectionsEn: InteractiveSectionDefinition[] = [
    {
        title: "Main Scene Description",
        questions: [
            { id: 'scene_description', promptText: 'Comprehensive Scene Description', type: 'manual', defaultValue: 'A clever red fox wearing reading glasses is sitting in a cozy, ancient library, surrounded by stacks of books and warm candlelight.' },
        ],
    },
    {
        title: "Artistic Style & Details",
        questions: [
            { id: 'art_style', promptText: 'Artistic Style', type: 'single-choice', options: commonArtStylesEn, defaultValue: 'Digital Painting', includeOtherOption: true }, // Changed from 'artistic_style' to 'art_style'
            { id: 'artist_influence', promptText: 'Artist Influence (Optional)', type: 'manual', defaultValue: 'Beatrix Potter' },
            { id: 'specific_details', promptText: 'Specific Details to Include', type: 'manual', defaultValue: 'detailed fur on the fox, texture of book pages, wisps of smoke from candles' },
        ],
    },
    {
        title: "Color, Lighting & Composition",
        questions: [
            { id: 'color_focus', promptText: 'Color Focus / Palette', type: 'manual', defaultValue: 'warm tones, browns, oranges, creams, with golden accents' },
            { id: 'lighting_mood', promptText: 'Lighting & Mood', type: 'manual', defaultValue: 'soft and warm lighting from candles, creating a cozy and magical atmosphere' },
            { id: 'composition_angle', promptText: 'Composition & Angle', type: 'single-choice', options: commonImageCompositionEn, defaultValue: 'Medium Shot', includeOtherOption: true },
            { id: 'aspect_ratio_dalle', promptText: 'Aspect Ratio', type: 'single-choice', options: ["1:1 (Square)", "16:9 (Landscape)", "9:16 (Portrait)"], defaultValue: '16:9 (Landscape)' },
        ],
    },
];
// CLEANED TEMPLATE
export const dalle3Template = `{{scene_description}}, {{art_style}}, {{artist_influence}}, {{specific_details}}, {{color_focus}}, {{lighting_mood}}, {{composition_angle}}. {{dalle_aspect_ratio_value}}.`;


// --- Stable Diffusion Interactive (Enhanced) ---
const stableDiffusionSectionsId: InteractiveSectionDefinition[] = [
    {
        title: "Deskripsi Subjek & Kualitas",
        questions: [
            { id: 'main_subject', promptText: 'Subjek Utama & Aksi', type: 'manual', defaultValue: 'Astronot melayang di ruang angkasa' },
            { id: 'key_details', promptText: 'Detail Kunci Subjek & Latar', type: 'manual', defaultValue: 'helm dengan pantulan nebula, Bumi terlihat di kejauhan, partikel debu kosmik' },
            { id: 'quality_descriptors', promptText: 'Deskriptor Kualitas', type: 'multiple-choice', options: commonQualityDescriptors, defaultValue: ['Sangat detail', 'Kualitas 8K', 'Ultra realistis'] },
        ],
    },
    {
        title: "Gaya Artistik & Pengaruh",
        questions: [
            { id: 'art_style_medium', promptText: 'Gaya Seni & Medium', type: 'manual', defaultValue: 'seni konsep fiksi ilmiah, fotorealistis, sedikit surealis' },
            { id: 'artist_influences', promptText: 'Pengaruh Seniman (Opsional)', type: 'manual', defaultValue: 'Sparth, Moebius' }, // Corrected ID
        ],
    },
    {
        title: "Aspek Teknis & Komposisi",
        questions: [
            { id: 'technical_aspects', promptText: 'Aspek Teknis (Resolusi, dll.)', type: 'manual', defaultValue: 'resolusi tinggi, tekstur tajam, DOF sinematik' },
            { id: 'camera_shot', promptText: 'Jenis Shot Kamera', type: 'single-choice', options: commonImageComposition, defaultValue: 'Full Shot (Seluruh Badan)', includeOtherOption: true },
            { id: 'lighting_style', promptText: 'Gaya Pencahayaan', type: 'single-choice', options: commonLightingStyles, defaultValue: 'Cahaya Latar (Backlight)', includeOtherOption: true },
        ],
    },
    {
        title: "Prompt Negatif & Parameter",
        questions: [
            { id: 'negative_elements', promptText: 'Elemen Negatif Umum', type: 'multiple-choice', options: commonNegativeImageElements, defaultValue: ['Kualitas rendah', 'Buram', 'Tangan buruk'] },
            { id: 'custom_negative_prompt', promptText: 'Prompt Negatif Kustom (Opsional)', type: 'manual', defaultValue: 'kartun, lukisan anak-anak, logo' },
            { id: 'param_info', promptText: 'Parameter Tambahan (Sampler, Steps, CFG - Catatan)', type: 'manual', defaultValue: 'Sampler: DPM++ 2M Karras, Steps: 30, CFG: 7' },
        ],
    },
];
const stableDiffusionSectionsEn: InteractiveSectionDefinition[] = [
    {
        title: "Subject Description & Quality",
        questions: [
            { id: 'main_subject', promptText: 'Main Subject & Action', type: 'manual', defaultValue: 'Astronaut floating in space' },
            { id: 'key_details', promptText: 'Key Subject & Background Details', type: 'manual', defaultValue: 'helmet with nebula reflection, Earth visible in the distance, cosmic dust particles' },
            { id: 'quality_descriptors', promptText: 'Quality Descriptors', type: 'multiple-choice', options: commonQualityDescriptorsEn, defaultValue: ['Highly detailed', '8K quality', 'Ultra realistic'] },
        ],
    },
    {
        title: "Artistic Style & Influences",
        questions: [
            { id: 'art_style_medium', promptText: 'Art Style & Medium', type: 'manual', defaultValue: 'sci-fi concept art, photorealistic, slightly surreal' },
            { id: 'artist_influences', promptText: 'Artist Influences (Optional)', type: 'manual', defaultValue: 'Sparth, Moebius' }, // Corrected ID
        ],
    },
    {
        title: "Technical Aspects & Composition",
        questions: [
            { id: 'technical_aspects', promptText: 'Technical Aspects (Resolution, etc.)', type: 'manual', defaultValue: 'high resolution, sharp textures, cinematic DOF' },
            { id: 'camera_shot', promptText: 'Camera Shot Type', type: 'single-choice', options: commonImageCompositionEn, defaultValue: 'Full Body Shot', includeOtherOption: true },
            { id: 'lighting_style', promptText: 'Lighting Style', type: 'single-choice', options: commonLightingStylesEn, defaultValue: 'Backlight', includeOtherOption: true },
        ],
    },
    {
        title: "Negative Prompt & Parameters",
        questions: [
            { id: 'negative_elements', promptText: 'Common Negative Elements', type: 'multiple-choice', options: commonNegativeImageElementsEn, defaultValue: ['Low quality', 'Blurry', 'Poorly drawn hands'] },
            { id: 'custom_negative_prompt', promptText: 'Custom Negative Prompt (Optional)', type: 'manual', defaultValue: 'cartoon, childish painting, logo' },
            { id: 'param_info', promptText: 'Additional Parameters (Sampler, Steps, CFG - Note)', type: 'manual', defaultValue: 'Sampler: DPM++ 2M Karras, Steps: 30, CFG: 7' },
        ],
    },
];
// CLEANED TEMPLATE
export const stableDiffusionTemplate = `{{main_subject}}, {{key_details}}, {{quality_descriptors}}, {{art_style_medium}}, {{artist_influences}}, {{technical_aspects}}, {{camera_shot}}, {{lighting_style}}{{sd_negative_param_string}}{{sd_params_note_string}}`;


// --- Runway Gen-2 Interactive (Enhanced) ---
const runwayGen2SectionsId: InteractiveSectionDefinition[] = [
    {
        title: "Deskripsi Adegan & Subjek",
        questions: [
            { id: 'scene_subject', promptText: 'Subjek & Latar Utama Adegan', type: 'manual', defaultValue: 'Mobil sport merah melaju kencang di jalanan kota malam hari' },
            { id: 'subject_action', promptText: 'Aksi Spesifik Subjek', type: 'manual', defaultValue: 'melakukan drift di tikungan, meninggalkan jejak cahaya' },
        ],
    },
    {
        title: "Kamera & Gerakan",
        questions: [
            { id: 'camera_movement', promptText: 'Pergerakan Kamera / Jenis Shot', type: 'manual', defaultValue: 'low angle tracking shot, mengikuti mobil dari samping' },
        ],
    },
    {
        title: "Gaya Visual & Atmosfer",
        questions: [
            { id: 'visual_style', promptText: 'Gaya Visual', type: 'single-choice', options: ['Sinematik', 'Realistis', 'Anime', 'Retro VHS', ...commonArtStyles], defaultValue: 'Sinematik', includeOtherOption: true },
            { id: 'lighting_atmosphere', promptText: 'Pencahayaan & Atmosfer', type: 'manual', defaultValue: 'pencahayaan neon dari gedung-gedung, jalanan basah memantulkan cahaya, suasana penuh energi' },
            { id: 'color_palette', promptText: 'Palet Warna Dominan', type: 'manual', defaultValue: 'merah menyala, biru tua, ungu, dengan kilatan putih dan kuning' }, // ID changed for consistency
        ],
    },
    {
        title: "Detail Tambahan",
        questions: [
            { id: 'environment_action', promptText: 'Aksi Lingkungan (Opsional)', type: 'manual', defaultValue: 'hujan rintik-rintik, asap dari ban mobil' },
            { id: 'sound_design_note', promptText: 'Catatan Desain Suara (Opsional)', type: 'manual', defaultValue: 'suara deru mesin mobil sport, musik synthwave energik' },
            { id: 'duration_note', promptText: 'Catatan Durasi Video (Opsional)', type: 'manual', defaultValue: 'sekitar 5-10 detik' },
        ],
    },
];
const runwayGen2SectionsEn: InteractiveSectionDefinition[] = [
    {
        title: "Scene & Subject Description",
        questions: [
            { id: 'scene_subject', promptText: 'Main Subject & Scene Setting', type: 'manual', defaultValue: 'Red sports car speeding through a city street at night' },
            { id: 'subject_action', promptText: 'Specific Subject Action', type: 'manual', defaultValue: 'drifting around a corner, leaving light trails' },
        ],
    },
    {
        title: "Camera & Movement",
        questions: [
            { id: 'camera_movement', promptText: 'Camera Movement / Shot Type', type: 'manual', defaultValue: 'low angle tracking shot, following the car from the side' },
        ],
    },
    {
        title: "Visual Style & Atmosphere",
        questions: [
            { id: 'visual_style', promptText: 'Visual Style', type: 'single-choice', options: ['Cinematic', 'Realistic', 'Anime', 'Retro VHS', ...commonArtStylesEn], defaultValue: 'Cinematic', includeOtherOption: true },
            { id: 'lighting_atmosphere', promptText: 'Lighting & Atmosphere', type: 'manual', defaultValue: 'neon lighting from buildings, wet streets reflecting light, energetic atmosphere' },
            { id: 'color_palette', promptText: 'Dominant Color Palette', type: 'manual', defaultValue: 'vibrant reds, deep blues, purples, with flashes of white and yellow' }, // ID changed for consistency
        ],
    },
    {
        title: "Additional Details",
        questions: [
            { id: 'environment_action', promptText: 'Environmental Actions (Optional)', type: 'manual', defaultValue: 'light rain, smoke from car tires' },
            { id: 'sound_design_note', promptText: 'Sound Design Notes (Optional)', type: 'manual', defaultValue: 'roaring sports car engine, energetic synthwave music' },
            { id: 'duration_note', promptText: 'Video Duration Notes (Optional)', type: 'manual', defaultValue: 'around 5-10 seconds' },
        ],
    },
];
// CLEANED TEMPLATE
export const runwayGen2Template = `{{scene_subject}}, {{camera_movement}}, {{subject_action}}, {{environment_action}}, {{visual_style}}, {{lighting_atmosphere}}, {{color_palette}}, {{sound_design_note}}, {{duration_note}}.`;

// --- Suno AI Interactive (Enhanced) ---
const sunoAISectionsId: InteractiveSectionDefinition[] = [
    {
        title: "Genre & Gaya Musik",
        questions: [
            { id: 'genre', promptText: 'Genre Utama', type: 'single-choice', options: commonMusicGenres, defaultValue: 'Elektronik (Techno, House, Trance, Synthwave, EDM, Downtempo)', includeOtherOption: true },
            { id: 'subgenre_modifiers', promptText: 'Subgenre / Kata Kunci Gaya Tambahan', type: 'manual', defaultValue: 'Synthwave 80an, dreamy, atmospheric' },
        ],
    },
    {
        title: "Mood, Instrumen & Vokal",
        questions: [
            { id: 'mood', promptText: 'Mood / Suasana Hati', type: 'single-choice', options: commonMusicMoods, defaultValue: 'Nostalgia', includeOtherOption: true },
            { id: 'main_instruments', promptText: 'Instrumen Utama', type: 'manual', defaultValue: 'Synthesizer (mis. Juno-106, DX7), LinnDrum, Electric Guitar dengan chorus' },
            { id: 'vocal_style', promptText: 'Gaya Vokal (Jika Ada)', type: 'single-choice', options: commonVocalStyles, defaultValue: 'Instrumental (Tanpa Vokal)', includeOtherOption: true },
        ],
    },
    {
        title: "Tempo & Ritme",
        questions: [
            { id: 'tempo', promptText: 'Tempo', type: 'single-choice', options: commonTempoOptions, defaultValue: 'Sedang (80-120 BPM)', includeOtherOption: true },
            { id: 'rhythm_description', promptText: 'Deskripsi Ritme / Groove', type: 'manual', defaultValue: 'beat drum machine yang khas, bassline yang menggerakkan' },
        ],
    },
    {
        title: "Struktur & Lirik Lagu",
        questions: [
            { id: 'song_structure', promptText: 'Struktur Lagu (Opsional)', type: 'manual', defaultValue: '[Intro] [Verse] [Chorus] [Verse] [Chorus] [Bridge] [Outro]' },
            { id: 'lyrics_theme', promptText: 'Tema Lirik (Jika Vokal & Tidak Ada Lirik Kustom)', type: 'manual', defaultValue: 'Perjalanan malam di kota metropolitan neon' },
            { id: 'custom_lyrics_section', promptText: 'Lirik Kustom Penuh (Gunakan tag [Verse], [Chorus], dll.)', type: 'manual', defaultValue: '' },
        ],
    },
];
const sunoAISectionsEn: InteractiveSectionDefinition[] = [
    {
        title: "Music Genre & Style",
        questions: [
            { id: 'genre', promptText: 'Main Genre', type: 'single-choice', options: commonMusicGenresEn, defaultValue: 'Electronic (Techno, House, Trance, Synthwave, EDM, Downtempo)', includeOtherOption: true },
            { id: 'subgenre_modifiers', promptText: 'Subgenre / Additional Style Keywords', type: 'manual', defaultValue: '80s Synthwave, dreamy, atmospheric' },
        ],
    },
    {
        title: "Mood, Instruments & Vocals",
        questions: [
            { id: 'mood', promptText: 'Mood / Atmosphere', type: 'single-choice', options: commonMusicMoodsEn, defaultValue: 'Nostalgic', includeOtherOption: true },
            { id: 'main_instruments', promptText: 'Main Instruments', type: 'manual', defaultValue: 'Synthesizers (e.g., Juno-106, DX7), LinnDrum, Electric Guitar with chorus' },
            { id: 'vocal_style', promptText: 'Vocal Style (If Any)', type: 'single-choice', options: commonVocalStylesEn, defaultValue: 'Instrumental (No Vocals)', includeOtherOption: true },
        ],
    },
    {
        title: "Tempo & Rhythm",
        questions: [
            { id: 'tempo', promptText: 'Tempo', type: 'single-choice', options: commonTempoOptionsEn, defaultValue: 'Medium (80-120 BPM)', includeOtherOption: true },
            { id: 'rhythm_description', promptText: 'Rhythm / Groove Description', type: 'manual', defaultValue: 'classic drum machine beat, driving bassline' },
        ],
    },
    {
        title: "Song Structure & Lyrics",
        questions: [
            { id: 'song_structure', promptText: 'Song Structure (Optional)', type: 'manual', defaultValue: '[Intro] [Verse] [Chorus] [Verse] [Chorus] [Bridge] [Outro]' },
            { id: 'lyrics_theme', promptText: 'Lyrical Theme (If Vocals & No Custom Lyrics)', type: 'manual', defaultValue: 'A night drive through a neon metropolis' },
            { id: 'custom_lyrics_section', promptText: 'Full Custom Lyrics (Use [Verse], [Chorus], etc. tags)', type: 'manual', defaultValue: '' },
        ],
    },
];
// CLEANED TEMPLATE
export const sunoAITemplate = `{{genre}}, {{subgenre_modifiers}}, {{mood}}, {{main_instruments}}, {{vocal_style}}, {{tempo}}, {{rhythm_description}}. {{song_structure}}{{suno_lyrics_block}}`;


// --- Detailed Interactive Definitions for other Media/Music Framework (Enhanced) ---
// CLEANED TEMPLATE
export const detailedImageVideoTemplate = `{{subject}}, {{action_details}}, {{art_style}}, {{art_medium}}, {{artist_influence}}, {{composition}}, {{lighting}}, {{color_palette}}, {{detail_level}}.{{other_tool_params}}{{detailed_image_negative_param_string}}{{detailed_image_aspect_ratio_param_string}}`;
// CLEANED TEMPLATE
export const detailedMusicTemplate = `{{main_genre}}, {{subgenre_style}}, {{mood}}, {{tempo}}, {{main_instruments}}, {{vocal_style}}, {{song_structure_desc}}, {{duration_or_specifics}}.{{detailed_music_lyrics_block}}`;

// ... (Sisa definisi framework teks standar tetap sama seperti sebelumnya) ...
// Pastikan semua framework teks (RTF, TRACE, CTI, TAG, RISE, RODE, APE, COPE, CARE, SPARE, CoT, Zero-shot CoT, Self-Consistency, GenKnowledge, Least-to-Most, Self-Refine, ToT, Prompt Ensembling, Factive, EmotionPrompt, Prompt Chaining, Instruction Basics, RolePlay, Few-Shot, PACT)
// memiliki `genericToolLinks: mergeAndSortTextToolLinks([])` atau toolLink spesifik jika ada.

// Example of how a text framework might look (keep your existing text framework as they are)
export const frameworks: Framework[] = [
  {
    id: 'rtf',
    idLocale: {
      name: 'RTF (Peran, Tugas, Format)',
      shortName: 'RTF',
      description: 'Kerangka kerja RTF membantu menstrukturkan prompt dengan mendefinisikan Peran AI, Tugas yang harus dilakukan, dan Format output yang diinginkan.',
      components: [
        { id: 'Peran', example: 'Seorang pakar strategi pemasaran digital dengan pengalaman 10 tahun di industri e-commerce B2C, mampu menghasilkan ide kampanye yang inovatif dan terukur.' },
        { id: 'Tugas', example: 'Buatlah rencana peluncuran produk baru untuk sepatu lari ramah lingkungan, target audiens Gen Z. Rencana harus mencakup strategi media sosial, influencer, dan konten blog selama 3 bulan pertama.' },
        { id: 'Format', example: 'Dokumen strategi komprehensif dalam format PDF, termasuk timeline, estimasi anggaran per saluran, dan metrik keberhasilan (KPI) yang jelas untuk setiap fase.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'RTF (Role, Task, Format)',
      shortName: 'RTF',
      description: 'The RTF framework helps structure prompts by defining the AI\'s Role, the Task to be performed, and the desired output Format.',
      components: [
        { id: 'Role', example: 'A seasoned digital marketing strategist with 10 years of experience in B2C e-commerce, capable of generating innovative and measurable campaign ideas.' },
        { id: 'Task', example: 'Develop a new product launch plan for eco-friendly running shoes, targeting Gen Z. The plan should cover social media strategy, influencer collaborations, and blog content for the first 3 months.' },
        { id: 'Format', example: 'A comprehensive strategy document in PDF format, including a timeline, estimated budget per channel, and clear Key Performance Indicators (KPIs) for each phase.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
    {
    id: 'trace',
    idLocale: {
      name: 'TRACE (Tugas, Permintaan, Aksi, Konteks, Contoh)',
      shortName: 'TRACE',
      description: 'TRACE menyediakan struktur komprehensif untuk prompt yang kompleks dengan merinci Tugas, Permintaan spesifik, Aksi yang diharapkan, Konteks relevan, dan Contoh output.',
      components: [
        { id: 'Tugas Utama (Task)', example: 'Menganalisis sentimen pelanggan terhadap produk X berdasarkan ulasan online dari 3 platform e-commerce utama selama 6 bulan terakhir.' },
        { id: 'Permintaan Detail (Request)', example: 'Identifikasi tema sentimen positif dan negatif utama. Kuantifikasi persentase masing-masing. Berikan kutipan representatif untuk setiap tema. Visualisasikan tren sentimen dari waktu ke waktu.' },
        { id: 'Aksi AI (Action)', example: 'Proses data ulasan, lakukan analisis sentimen, klasterisasi tema, hitung statistik, hasilkan grafik tren, dan susun laporan ringkas.' },
        { id: 'Konteks Tambahan (Context)', example: 'Produk X baru saja mengalami pembaruan fitur signifikan 3 bulan lalu. Perhatikan apakah ada perubahan sentimen yang berkorelasi dengan pembaruan tersebut. Pesaing utama, Produk Y, juga meluncurkan kampanye baru bersamaan.' },
        { id: 'Contoh Output (Example)', example: 'Format laporan: 1. Ringkasan Eksekutif. 2. Sentimen Positif Utama (dengan persentase dan kutipan). 3. Sentimen Negatif Utama (dengan persentase dan kutipan). 4. Grafik Tren Sentimen Bulanan. 5. Analisis Dampak Pembaruan Fitur.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'TRACE (Task, Request, Action, Context, Example)',
      shortName: 'TRACE',
      description: 'TRACE provides a comprehensive structure for complex prompts by detailing the Task, specific Requests, expected Actions, relevant Context, and an Example of the output.',
      components: [
        { id: 'Main Task', example: 'Analyze customer sentiment towards Product X based on online reviews from 3 major e-commerce platforms over the last 6 months.' },
        { id: 'Detailed Request', example: 'Identify key positive and negative sentiment themes. Quantify the percentage of each. Provide representative quotes for each theme. Visualize sentiment trends over time.' },
        { id: 'AI Action', example: 'Process review data, perform sentiment analysis, cluster themes, calculate statistics, generate trend graphs, and compile a concise report.' },
        { id: 'Additional Context', example: 'Product X underwent a significant feature update 3 months ago. Note if there are sentiment changes correlating with this update. Key competitor, Product Y, also launched a new campaign concurrently.' },
        { id: 'Example Output', example: 'Report format: 1. Executive Summary. 2. Key Positive Sentiments (with percentages and quotes). 3. Key Negative Sentiments (with percentages and quotes). 4. Monthly Sentiment Trend Graph. 5. Analysis of Feature Update Impact.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'cti',
    idLocale: {
      name: 'CTI (Konteks, Tugas, Instruksi)',
      shortName: 'CTI',
      description: 'Kerangka CTI menekankan pentingnya memberikan Konteks yang cukup, mendefinisikan Tugas dengan jelas, dan memberikan Instruksi yang spesifik kepada AI.',
      components: [
        { id: 'Konteks', example: 'Perusahaan kami adalah startup SaaS B2B yang menyediakan alat manajemen proyek untuk tim developer perangkat lunak. Kami ingin meningkatkan engagement di blog teknis kami.' },
        { id: 'Tugas', example: 'Buat draf artikel blog (sekitar 800-1000 kata) tentang "5 Strategi Efektif untuk Meningkatkan Kolaborasi Tim Developer Agile".' },
        { id: 'Instruksi', example: 'Gunakan gaya bahasa yang informatif namun mudah diakses. Sertakan contoh praktis atau studi kasus singkat jika memungkinkan. Fokus pada tips yang actionable. Akhiri dengan ajakan untuk berbagi pengalaman di kolom komentar.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'CTI (Context, Task, Instructions)',
      shortName: 'CTI',
      description: 'The CTI framework emphasizes providing sufficient Context, clearly defining the Task, and giving specific Instructions to the AI.',
      components: [
        { id: 'Context', example: 'Our company is a B2B SaaS startup providing project management tools for software development teams. We want to increase engagement on our technical blog.' },
        { id: 'Task', example: 'Draft a blog post (around 800-1000 words) on "5 Effective Strategies to Enhance Agile Developer Team Collaboration".' },
        { id: 'Instructions', example: 'Use an informative yet accessible tone. Include practical examples or brief case studies where possible. Focus on actionable tips. End with a call to action to share experiences in the comments.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
    {
    id: 'tag',
    idLocale: {
      name: 'TAG (Tugas, Aksi, Tujuan)',
      shortName: 'TAG',
      description: 'TAG adalah kerangka kerja sederhana yang berfokus pada Tugas yang diberikan, Aksi yang harus dilakukan AI, dan Tujuan akhir dari output.',
      components: [
        { id: 'Tugas', example: 'Menulis email tindak lanjut kepada klien potensial setelah demonstrasi produk.' },
        { id: 'Aksi', example: 'Susun email yang sopan dan profesional. Ucapkan terima kasih atas waktunya, rangkum poin-poin penting demo, jawab pertanyaan yang mungkin muncul, dan ajak untuk langkah selanjutnya (misal, diskusi teknis atau penawaran harga).' },
        { id: 'Tujuan', example: 'Mendorong klien potensial untuk melanjutkan ke tahap berikutnya dalam siklus penjualan dan menunjukkan profesionalisme perusahaan.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'TAG (Task, Action, Goal)',
      shortName: 'TAG',
      description: 'TAG is a simple framework focusing on the given Task, the Action the AI should perform, and the ultimate Goal of the output.',
      components: [
        { id: 'Task', example: 'Write a follow-up email to a potential client after a product demonstration.' },
        { id: 'Action', example: 'Draft a polite and professional email. Thank them for their time, summarize key demo points, address any questions that arose, and propose next steps (e.g., technical discussion or price quote).' },
        { id: 'Goal', example: 'Encourage the potential client to move to the next stage in the sales cycle and demonstrate company professionalism.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'rise',
    idLocale: {
      name: 'RISE (Peran, Input, Langkah, Ekspektasi)',
      shortName: 'RISE',
      description: 'RISE membantu dalam menghasilkan output yang terstruktur dengan mendefinisikan Peran AI, Input yang digunakan, Langkah-langkah pemrosesan, dan Ekspektasi hasil akhir.',
      components: [
        { id: 'Peran (Role)', example: 'Asisten peneliti AI yang bertugas merangkum artikel ilmiah kompleks menjadi poin-poin kunci yang mudah dipahami.' },
        { id: 'Input (Input)', example: 'Artikel ilmiah berjudul "The Impact of Quantum Computing on Cryptographic Systems" oleh John Doe, 2023, Journal of Cryptography. (Teks lengkap artikel akan diberikan setelah prompt ini).' },
        { id: 'Langkah (Steps)', example: '1. Baca dan pahami abstrak serta kesimpulan artikel. 2. Identifikasi argumen utama, metodologi, dan temuan kunci. 3. Susun rangkuman dalam 5-7 poin utama. 4. Hindari jargon teknis berlebihan jika memungkinkan.' },
        { id: 'Ekspektasi (Expectation)', example: 'Rangkuman poin-poin yang jelas, ringkas, dan akurat, menyoroti kontribusi utama artikel. Tidak lebih dari 250 kata.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'RISE (Role, Input, Steps, Expectation)',
      shortName: 'RISE',
      description: 'RISE helps generate structured output by defining the AI\'s Role, the Input it uses, the Steps for processing, and the Expectation for the final result.',
      components: [
        { id: 'Role', example: 'An AI research assistant tasked with summarizing complex scientific articles into easily understandable key points.' },
        { id: 'Input', example: 'Scientific article titled "The Impact of Quantum Computing on Cryptographic Systems" by John Doe, 2023, Journal of Cryptography. (Full text of the article will be provided after this prompt).' },
        { id: 'Steps', example: '1. Read and understand the abstract and conclusion of the article. 2. Identify main arguments, methodology, and key findings. 3. Structure the summary into 5-7 main bullet points. 4. Avoid excessive technical jargon where possible.' },
        { id: 'Expectation', example: 'A clear, concise, and accurate bullet-point summary highlighting the article\'s main contributions. No more than 250 words.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
    {
    id: 'rode',
    idLocale: {
      name: 'RODE (Peran, Output, Dinamika, Contoh)',
      shortName: 'RODE',
      description: 'RODE berguna untuk menghasilkan konten kreatif atau simulasi dengan menentukan Peran, Output yang diharapkan, Dinamika interaksi (jika ada), dan Contoh.',
      components: [
        { id: 'Peran (Role)', example: 'Seorang detektif swasta bergaya noir tahun 1940-an yang sinis namun brilian.' },
        { id: 'Output (Output)', example: 'Monolog internal detektif saat mengamati tempat kejadian perkara sebuah kasus pembunuhan misterius di sebuah bar kumuh.' },
        { id: 'Dinamika (Dynamics)', example: 'Gunakan bahasa kiasan khas noir, deskripsi visual yang kaya, dan sentuhan humor gelap. Detektif harus merenungkan petunjuk-petunjuk awal dan karakter-karakter yang terlibat.' },
        { id: 'Contoh (Example)', example: '"Hujan turun seperti air mata malaikat yang menangisi kota busuk ini. Bar itu sendiri adalah sebuah noda, dan korban... yah, dia adalah bagian dari noda itu sekarang. Secarik kertas di sakunya, nomor telepon tanpa nama. Klasik."' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'RODE (Role, Output, Dynamics, Example)',
      shortName: 'RODE',
      description: 'RODE is useful for generating creative content or simulations by specifying the Role, expected Output, interaction Dynamics (if any), and an Example.',
      components: [
        { id: 'Role', example: 'A cynical yet brilliant 1940s noir private detective.' },
        { id: 'Output', example: 'An internal monologue of the detective observing the crime scene of a mysterious murder in a seedy bar.' },
        { id: 'Dynamics', example: 'Use typical noir figurative language, rich visual descriptions, and a touch of dark humor. The detective should reflect on initial clues and characters involved.' },
        { id: 'Example', example: '"Rain was falling like an angel weeping for this rotten city. The bar itself was a stain, and the vic... well, he was part of that stain now. A slip of paper in his pocket, a phone number with no name. Classic."' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'ape',
    idLocale: {
      name: 'APE (Aksi, Tujuan, Ekspektasi)',
      shortName: 'APE',
      description: 'APE adalah kerangka kerja ringkas untuk Aksi yang harus dilakukan, Tujuan dari aksi tersebut, dan Ekspektasi kualitas atau format output.',
      components: [
        { id: 'Aksi (Action)', example: 'Terjemahkan teks berikut dari Bahasa Inggris ke Bahasa Indonesia.' },
        { id: 'Tujuan (Purpose)', example: 'Teks terjemahan akan digunakan untuk materi pemasaran di situs web regional Indonesia.' },
        { id: 'Ekspektasi (Expectation)', example: 'Terjemahan yang akurat, alami, dan sesuai dengan konteks budaya Indonesia. Pertahankan gaya formal namun menarik.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'APE (Action, Purpose, Expectation)',
      shortName: 'APE',
      description: 'APE is a concise framework for the Action to be performed, the Purpose of that action, and the Expectation of the output quality or format.',
      components: [
        { id: 'Action', example: 'Translate the following text from English to Indonesian.' },
        { id: 'Purpose', example: 'The translated text will be used for marketing materials on the Indonesian regional website.' },
        { id: 'Expectation', example: 'Accurate, natural-sounding translation appropriate for the Indonesian cultural context. Maintain a formal yet engaging tone.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'cope',
    idLocale: {
      name: 'COPE (Konteks, Objektif, Persona, Contoh)',
      shortName: 'COPE',
      description: 'COPE membantu menghasilkan respons yang relevan dengan memberikan Konteks, Objektif yang jelas, Persona untuk AI, dan Contoh output yang diinginkan.',
      components: [
        { id: 'Konteks (Context)', example: 'Seorang pelanggan mengirim email keluhan tentang keterlambatan pengiriman pesanannya.' },
        { id: 'Objektif (Objective)', example: 'Menanggapi email pelanggan dengan empati, meminta maaf atas ketidaknyamanan, memberikan penjelasan (jika ada), dan menawarkan solusi atau kompensasi yang sesuai.' },
        { id: 'Persona (Persona)', example: 'Agen layanan pelanggan yang ramah, profesional, dan solutif.' },
        { id: 'Contoh (Example)', example: '"Yth. Bapak/Ibu [Nama Pelanggan], Terima kasih telah menghubungi kami. Kami mohon maaf atas keterlambatan pengiriman pesanan Anda [Nomor Pesanan]. Kami memahami kekecewaan Anda..." (lanjutkan dengan detail dan solusi).' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'COPE (Context, Objective, Persona, Example)',
      shortName: 'COPE',
      description: 'COPE helps generate relevant responses by providing Context, a clear Objective, a Persona for the AI, and an Example of the desired output.',
      components: [
        { id: 'Context', example: 'A customer has sent an email complaining about a delay in their order shipment.' },
        { id: 'Objective', example: 'Respond to the customer\'s email empathetically, apologize for the inconvenience, provide an explanation (if available), and offer a suitable solution or compensation.' },
        { id: 'Persona', example: 'A friendly, professional, and solution-oriented customer service agent.' },
        { id: 'Example', example: '"Dear Mr./Ms. [Customer Name], Thank you for contacting us. We sincerely apologize for the delay in the shipment of your order [Order Number]. We understand your disappointment..." (continue with details and solution).' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'care',
    idLocale: {
      name: 'CARE (Konteks, Aksi, Hasil, Contoh)',
      shortName: 'CARE',
      description: 'CARE adalah kerangka kerja yang berfokus pada pemberian Konteks, menentukan Aksi, mendefinisikan Hasil yang diinginkan, dan menyertakan Contoh.',
      components: [
        { id: 'Konteks (Context)', example: 'Saya sedang menyusun proposal proyek untuk pengembangan aplikasi mobile baru.' },
        { id: 'Aksi (Action)', example: 'Buatkan bagian "Analisis Risiko" untuk proposal tersebut. Identifikasi setidaknya 5 potensi risiko (teknis, pasar, operasional) dan usulkan strategi mitigasinya.' },
        { id: 'Hasil (Result)', example: 'Bagian analisis risiko yang terstruktur dengan baik, jelas, dan komprehensif, cocok untuk dimasukkan ke dalam dokumen proposal formal.' },
        { id: 'Contoh (Example)', example: 'Contoh format risiko: "Risiko Teknis 1: Keterlambatan integrasi API pihak ketiga. Mitigasi: Alokasikan waktu buffer dalam jadwal proyek, identifikasi API alternatif."' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'CARE (Context, Action, Result, Example)',
      shortName: 'CARE',
      description: 'CARE is a framework focusing on providing Context, specifying the Action, defining the desired Result, and including an Example.',
      components: [
        { id: 'Context', example: 'I am drafting a project proposal for a new mobile application development.' },
        { id: 'Action', example: 'Create the "Risk Analysis" section for this proposal. Identify at least 5 potential risks (technical, market, operational) and propose mitigation strategies for each.' },
        { id: 'Result', example: 'A well-structured, clear, and comprehensive risk analysis section suitable for inclusion in a formal proposal document.' },
        { id: 'Example', example: 'Example risk format: "Technical Risk 1: Delay in third-party API integration. Mitigation: Allocate buffer time in the project schedule, identify alternative APIs."' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'spare',
    idLocale: {
      name: 'SPARE (Situasi, Persona, Aksi, Hasil, Contoh)',
      shortName: 'SPARE',
      description: 'SPARE memperluas CARE dengan menambahkan Persona, berguna untuk menghasilkan output yang lebih spesifik gayanya.',
      components: [
        { id: 'Situasi (Situation)', example: 'Seorang manajer produk sedang mempersiapkan presentasi untuk C-level mengenai roadmap produk kuartal berikutnya.' },
        { id: 'Persona (Persona)', example: 'Seorang analis bisnis yang tajam dan persuasif, mampu menyajikan data kompleks secara sederhana.' },
        { id: 'Aksi (Action)', example: 'Buatlah 3 slide kunci untuk presentasi tersebut yang menyoroti: 1. Fitur utama yang akan diluncurkan. 2. Dampak bisnis yang diharapkan (metrik). 3. Kebutuhan sumber daya.' },
        { id: 'Hasil (Result)', example: 'Konten untuk 3 slide yang ringkas, fokus pada poin penting, dan menggunakan bahasa yang sesuai untuk audiens C-level.' },
        { id: 'Contoh (Example)', example: 'Slide 1 (Fitur): "Q3 Priority: AI-Powered Recommendation Engine." Bullet points: Personalized content discovery, Increased user engagement by 15%, Reduced churn by 5%.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'SPARE (Situation, Persona, Action, Result, Example)',
      shortName: 'SPARE',
      description: 'SPARE expands on CARE by adding Persona, useful for generating more style-specific outputs.',
      components: [
        { id: 'Situation', example: 'A product manager is preparing a presentation for C-level executives regarding the product roadmap for the next quarter.' },
        { id: 'Persona', example: 'A sharp and persuasive business analyst, capable of presenting complex data simply.' },
        { id: 'Action', example: 'Create 3 key slides for the presentation highlighting: 1. Key features to be launched. 2. Expected business impact (metrics). 3. Resource requirements.' },
        { id: 'Result', example: 'Content for 3 slides that is concise, focused on key points, and uses language appropriate for a C-level audience.' },
        { id: 'Example', example: 'Slide 1 (Feature): "Q3 Priority: AI-Powered Recommendation Engine." Bullet points: Personalized content discovery, Increased user engagement by 15%, Reduced churn by 5%.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'chain_of_thought',
    idLocale: {
      name: 'Chain-of-Thought (Rantai Pikiran)',
      shortName: 'CoT',
      description: 'Mendorong AI untuk "berpikir langkah demi langkah" untuk mencapai solusi, seringkali dengan memberikan contoh proses berpikir.',
      components: [
        { id: 'Masalah Kompleks', example: 'Jika sebuah mobil melaju dengan kecepatan 60 km/jam selama 2,5 jam, dan kemudian 70 km/jam selama 1,5 jam, berapa total jarak yang ditempuh?' },
        { id: 'Instruksi Chain-of-Thought', example: 'Pecahkan masalah ini langkah demi langkah. Pertama, hitung jarak untuk bagian pertama perjalanan. Kedua, hitung jarak untuk bagian kedua. Ketiga, jumlahkan kedua jarak tersebut untuk mendapatkan total jarak.' },
        { id: 'Contoh Proses Berpikir (Opsional)', example: 'Contoh: Untuk menghitung jarak, kita gunakan rumus jarak = kecepatan × waktu. Bagian 1: 60 km/jam × 2,5 jam = 150 km. Bagian 2: ... (AI melanjutkan)' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Chain-of-Thought',
      shortName: 'CoT',
      description: 'Encourages the AI to "think step-by-step" to reach a solution, often by providing an example of the thinking process.',
      components: [
        { id: 'Complex Problem', example: 'If a car travels at 60 km/h for 2.5 hours, and then at 70 km/h for 1.5 hours, what is the total distance traveled?' },
        { id: 'Chain-of-Thought Instruction', example: 'Solve this problem step by step. First, calculate the distance for the first part of the journey. Second, calculate the distance for the second part. Third, add these two distances to get the total distance.' },
        { id: 'Example Thinking Process (Optional)', example: 'Example: To calculate distance, we use the formula distance = speed × time. Part 1: 60 km/h × 2.5 hours = 150 km. Part 2: ... (AI continues)' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'zero_shot_cot',
    idLocale: {
      name: 'Zero-shot CoT',
      shortName: 'Zero-shot CoT',
      description: 'Memicu penalaran langkah demi langkah tanpa contoh, biasanya dengan menambahkan frasa seperti "Mari kita berpikir langkah demi langkah."',
      components: [
        { id: 'Pertanyaan', example: 'Seorang petani memiliki 17 domba. Semua kecuali 9 mati. Berapa banyak domba yang tersisa?' },
        { id: 'Pemicu Zero-shot CoT', example: 'Mari kita berpikir langkah demi langkah untuk menyelesaikan ini.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Zero-shot CoT',
      shortName: 'Zero-shot CoT',
      description: 'Triggers step-by-step reasoning without examples, usually by adding a phrase like "Let\'s think step by step."',
      components: [
        { id: 'Question', example: 'A farmer had 17 sheep. All but 9 died. How many are left?' },
        { id: 'Zero-shot CoT Trigger', example: 'Let\'s think step by step to solve this.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'self_consistency',
    idLocale: {
      name: 'Self-Consistency (Konsistensi Diri)',
      shortName: 'Self-Consistency',
      description: 'Mengambil beberapa output CoT yang berbeda dan memilih jawaban yang paling konsisten atau sering muncul.',
      components: [
        { id: 'Masalah', example: 'Ada 5 buah apel di keranjang. Saya mengambil 2, lalu teman saya memberi saya 3 lagi. Berapa banyak apel yang saya miliki sekarang?' },
        { id: 'Instruksi untuk Beberapa Jalur Penalaran', example: 'Berikan 3 jalur penalaran yang berbeda untuk menyelesaikan masalah ini, lalu tentukan jawaban akhir yang paling konsisten.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Self-Consistency',
      shortName: 'Self-Consistency',
      description: 'Samples multiple different CoT outputs and selects the most consistent or frequently occurring answer.',
      components: [
        { id: 'Problem', example: 'There are 5 apples in a basket. I take 2, then my friend gives me 3 more. How many apples do I have now?' },
        { id: 'Instruction for Multiple Reasoning Paths', example: 'Provide 3 different reasoning paths to solve this problem, then determine the most consistent final answer.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'generated_knowledge',
    idLocale: {
      name: 'Generated Knowledge (Pengetahuan yang Dihasilkan)',
      shortName: 'GenKnowledge',
      description: 'Meminta AI untuk menghasilkan pengetahuan atau fakta relevan terlebih dahulu, kemudian menggunakan fakta tersebut untuk menjawab pertanyaan.',
      components: [
        { id: 'Pertanyaan', example: 'Apa dampak perubahan iklim terhadap terumbu karang?' },
        { id: 'Instruksi Pembuatan Pengetahuan', example: 'Pertama, hasilkan 3-5 fakta kunci tentang bagaimana perubahan iklim mempengaruhi terumbu karang. Kemudian, gunakan fakta-fakta tersebut untuk menjawab pertanyaan awal secara komprehensif.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Generated Knowledge',
      shortName: 'GenKnowledge',
      description: 'Asks the AI to generate relevant knowledge or facts first, then uses those facts to answer the question.',
      components: [
        { id: 'Question', example: 'What is the impact of climate change on coral reefs?' },
        { id: 'Knowledge Generation Instruction', example: 'First, generate 3-5 key facts about how climate change affects coral reefs. Then, use these facts to answer the original question comprehensively.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'least_to_most',
    idLocale: {
      name: 'Least-to-Most Prompting (Dari Sedikit ke Banyak)',
      shortName: 'Least-to-Most',
      description: 'Memecah masalah kompleks menjadi sub-masalah yang lebih mudah, lalu menyelesaikannya secara berurutan.',
      components: [
        { id: 'Masalah Utama', example: 'Rencanakan perjalanan 5 hari ke Tokyo untuk dua orang dengan anggaran $2000, fokus pada budaya dan kuliner.' },
        { id: 'Daftar Sub-Masalah (AI dapat diminta membuat ini atau diberi)', example: '1. Alokasi anggaran harian. 2. Rekomendasi akomodasi. 3. Daftar tempat wisata budaya. 4. Rekomendasi restoran/area kuliner. 5. Rencana perjalanan harian kasar.' },
        { id: 'Instruksi Penyelesaian Berurutan', example: 'Selesaikan setiap sub-masalah secara berurutan untuk membangun rencana perjalanan lengkap.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Least-to-Most Prompting',
      shortName: 'Least-to-Most',
      description: 'Breaks down a complex problem into simpler sub-problems, then solves them sequentially.',
      components: [
        { id: 'Main Problem', example: 'Plan a 5-day trip to Tokyo for two people on a $2000 budget, focusing on culture and cuisine.' },
        { id: 'List of Sub-Problems (AI can be asked to generate this or be given)', example: '1. Daily budget allocation. 2. Accommodation recommendations. 3. List of cultural attractions. 4. Restaurant/culinary area recommendations. 5. Rough daily itinerary.' },
        { id: 'Sequential Solving Instruction', example: 'Solve each sub-problem sequentially to build the complete travel plan.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'self_refine',
    idLocale: {
      name: 'Self-Refine (Perbaikan Diri)',
      shortName: 'Self-Refine',
      description: 'AI menghasilkan respons awal, kemudian diminta untuk mengkritik dan memperbaiki respons tersebut berdasarkan kriteria tertentu.',
      components: [
        { id: 'Tugas Awal', example: 'Tulis paragraf singkat yang menjelaskan konsep relativitas umum Einstein untuk audiens awam.' },
        { id: 'Respons Awal (dihasilkan AI atau contoh)', example: 'Relativitas umum adalah teori gravitasi Einstein yang mengatakan ruang dan waktu melengkung karena massa dan energi.' },
        { id: 'Instruksi Perbaikan', example: 'Sekarang, tinjau kembali penjelasan di atas. Apakah sudah cukup jelas untuk seseorang tanpa latar belakang fisika? Bisakah Anda menambahkan analogi sederhana untuk membuatnya lebih mudah dipahami? Perbaiki penjelasan tersebut.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Self-Refine',
      shortName: 'Self-Refine',
      description: 'AI generates an initial response, then is asked to critique and refine that response based on certain criteria.',
      components: [
        { id: 'Initial Task', example: 'Write a short paragraph explaining Einstein\'s concept of general relativity for a lay audience.' },
        { id: 'Initial Response (AI-generated or example)', example: 'General relativity is Einstein\'s theory of gravity which says space and time are curved by mass and energy.' },
        { id: 'Refinement Instruction', example: 'Now, review the explanation above. Is it clear enough for someone with no physics background? Can you add a simple analogy to make it more understandable? Refine the explanation.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'tree_of_thoughts',
    idLocale: {
      name: 'Tree of Thoughts (Pohon Pikiran)',
      shortName: 'ToT',
      description: 'AI mengeksplorasi berbagai jalur pemikiran ("cabang") secara bersamaan, mengevaluasi kemajuannya, dan dapat melakukan backtracking jika buntu.',
      components: [
        { id: 'Masalah Kompleks', example: 'Buatlah strategi pemasaran yang inovatif untuk produk minuman energi baru yang menargetkan gamer kompetitif.' },
        { id: 'Instruksi Eksplorasi Pikiran', example: 'Pertimbangkan beberapa pendekatan awal (misalnya, sponsorship eSports, konten influencer, tantangan media sosial). Untuk setiap pendekatan, evaluasi pro dan kontra, potensi jangkauan, dan perkiraan biaya. Pilih pendekatan yang paling menjanjikan atau gabungkan ide-ide terbaik menjadi strategi kohesif.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Tree of Thoughts',
      shortName: 'ToT',
      description: 'AI explores multiple reasoning paths ("branches") simultaneously, evaluates their progress, and can backtrack if stuck.',
      components: [
        { id: 'Complex Problem', example: 'Develop an innovative marketing strategy for a new energy drink targeting competitive gamers.' },
        { id: 'Thought Exploration Instruction', example: 'Consider several initial approaches (e.g., eSports sponsorships, influencer content, social media challenges). For each approach, evaluate pros and cons, potential reach, and estimated cost. Select the most promising approach or combine the best ideas into a cohesive strategy.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'prompt_ensembling',
    idLocale: {
      name: 'Prompt Ensembling (Ensembel Prompt)',
      shortName: 'Ensembling',
      description: 'Menggunakan beberapa prompt berbeda untuk tugas yang sama, lalu menggabungkan atau memilih output terbaik.',
      components: [
        { id: 'Tugas', example: 'Hasilkan slogan untuk merek kopi ramah lingkungan.' },
        { id: 'Prompt 1 (fokus pada rasa)', example: 'Buat slogan yang menekankan rasa kaya dan aroma kopi kami.' },
        { id: 'Prompt 2 (fokus pada keberlanjutan)', example: 'Buat slogan yang menyoroti komitmen kami terhadap praktik pertanian berkelanjutan dan perdagangan yang adil.' },
        { id: 'Prompt 3 (fokus pada energi)', example: 'Buat slogan yang menghubungkan kopi kami dengan energi alami dan awal hari yang positif.' },
        { id: 'Instruksi Penggabungan (Opsional)', example: 'Pilih slogan terbaik dari output masing-masing prompt, atau coba gabungkan elemen terbaiknya.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Prompt Ensembling',
      shortName: 'Ensembling',
      description: 'Uses multiple different prompts for the same task, then combines or selects the best output.',
      components: [
        { id: 'Task', example: 'Generate a tagline for an eco-friendly coffee brand.' },
        { id: 'Prompt 1 (focus on taste)', example: 'Create a tagline emphasizing the rich taste and aroma of our coffee.' },
        { id: 'Prompt 2 (focus on sustainability)', example: 'Create a tagline highlighting our commitment to sustainable farming practices and fair trade.' },
        { id: 'Prompt 3 (focus on energy)', example: 'Create a tagline connecting our coffee with natural energy and a positive start to the day.' },
        { id: 'Combining Instruction (Optional)', example: 'Select the best tagline from each prompt\'s output, or try to combine their best elements.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'factive_prompting',
    idLocale: {
      name: 'Factive Prompting (Prompting Faktual)',
      shortName: 'Factive',
      description: 'Menyediakan AI dengan fakta-fakta relevan sebagai bagian dari prompt untuk meningkatkan akurasi jawaban.',
      components: [
        { id: 'Konteks Fakta', example: 'Fakta: 1. Ibukota Prancis adalah Paris. 2. Menara Eiffel terletak di Paris. 3. Louvre adalah museum seni terkenal di Paris.' },
        { id: 'Pertanyaan', example: 'Sebutkan dua landmark terkenal yang bisa ditemukan di ibukota Prancis.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Factive Prompting',
      shortName: 'Factive',
      description: 'Provides the AI with relevant facts as part of the prompt to improve answer accuracy.',
      components: [
        { id: 'Factual Context', example: 'Facts: 1. The capital of France is Paris. 2. The Eiffel Tower is located in Paris. 3. The Louvre is a famous art museum in Paris.' },
        { id: 'Question', example: 'Name two famous landmarks that can be found in the capital of France.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'emotionprompt',
    idLocale: {
      name: 'EmotionPrompt',
      shortName: 'EmotionPrompt',
      description: 'Menambahkan stimulus emosional ke prompt (misalnya, "Ini sangat penting untuk karir saya") untuk berpotensi meningkatkan kinerja.',
      components: [
        { id: 'Tugas Inti', example: 'Tulis ringkasan eksekutif dari laporan penjualan kuartalan terlampir.' },
        { id: 'Stimulus Emosional', example: 'Ini sangat penting untuk presentasi saya kepada dewan direksi besok. Kualitas ringkasan ini dapat mempengaruhi kemajuan karir saya secara signifikan.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'EmotionPrompt',
      shortName: 'EmotionPrompt',
      description: 'Adds emotional stimuli to the prompt (e.g., "This is very important for my career") to potentially enhance performance.',
      components: [
        { id: 'Core Task', example: 'Write an executive summary of the attached quarterly sales report.' },
        { id: 'Emotional Stimulus', example: 'This is very important for my presentation to the board of directors tomorrow. The quality of this summary could significantly impact my career advancement.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'prompt_chaining',
    idLocale: {
      name: 'Prompt Chaining (Perantaian Prompt)',
      shortName: 'Chaining',
      description: 'Output dari satu prompt digunakan sebagai input untuk prompt berikutnya, membangun solusi secara bertahap.',
      components: [
        { id: 'Prompt 1: Identifikasi Tema', example: 'Analisis ulasan pelanggan berikut dan identifikasi 3 tema keluhan utama: [Teks ulasan pelanggan]' },
        { id: 'Prompt 2: Buat Template Respons (Menggunakan output Prompt 1)', example: 'Untuk setiap tema keluhan yang diidentifikasi ([Output Tema dari Prompt 1]), buatlah template respons email standar yang empatik dan menawarkan solusi.' },
        { id: 'Prompt 3: Personalisasi Respons (Menggunakan output Prompt 2)', example: 'Gunakan template respons untuk tema [Tema Spesifik dari Output 1] dan personalisasikan untuk pelanggan John Doe yang mengeluhkan [Detail Keluhan John Doe].' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Prompt Chaining',
      shortName: 'Chaining',
      description: 'The output of one prompt is used as input for the next, building up a solution step-by-step.',
      components: [
        { id: 'Prompt 1: Identify Themes', example: 'Analyze the following customer reviews and identify the top 3 complaint themes: [Customer review text]' },
        { id: 'Prompt 2: Create Response Templates (Uses output of Prompt 1)', example: 'For each identified complaint theme ([Theme Output from Prompt 1]), create a standard empathetic email response template that offers a solution.' },
        { id: 'Prompt 3: Personalize Response (Uses output of Prompt 2)', example: 'Use the response template for theme [Specific Theme from Output 1] and personalize it for customer John Doe who complained about [John Doe\'s specific complaint details].' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'instruction_tuning_basics',
    idLocale: {
      name: 'Dasar-dasar Instruction Tuning',
      shortName: 'Instruction Basics',
      description: 'Memberikan instruksi yang jelas, spesifik, dan tidak ambigu. Menggunakan kata kerja imperatif.',
      components: [
        { id: 'Instruksi Jelas', example: 'Buat daftar 5 ide judul artikel blog tentang manfaat meditasi untuk mengurangi stres.' },
        { id: 'Spesifisitas', example: 'Target audiens adalah profesional muda yang sibuk. Gaya penulisan harus informatif namun santai.' },
        { id: 'Format Output', example: 'Sajikan ide judul sebagai daftar bernomor.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Instruction Tuning Basics',
      shortName: 'Instruction Basics',
      description: 'Providing clear, specific, and unambiguous instructions. Using imperative verbs.',
      components: [
        { id: 'Clear Instruction', example: 'Generate a list of 5 blog post title ideas about the benefits of meditation for stress reduction.' },
        { id: 'Specificity', example: 'The target audience is busy young professionals. The writing style should be informative yet casual.' },
        { id: 'Output Format', example: 'Present the title ideas as a numbered list.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'role_prompting',
    idLocale: {
      name: 'Role Prompting (Prompting Peran)',
      shortName: 'RolePlay',
      description: 'Menetapkan peran atau persona tertentu untuk AI (misalnya, "Anda adalah seorang sejarawan ahli").',
      components: [
        { id: 'Persona AI', example: 'Seorang koki pastry pemenang penghargaan dari Prancis.' },
        { id: 'Tugas', example: 'Berikan resep detail untuk membuat croissant klasik Prancis yang sempurna, termasuk tips dan trik untuk pemula.' },
        { id: 'Gaya Respons yang Diharapkan', example: 'Gunakan bahasa yang antusias dan berpengetahuan, seolah-olah berbagi rahasia dagang. Sertakan detail tentang pentingnya kualitas bahan dan teknik.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Role Prompting',
      shortName: 'RolePlay',
      description: 'Assigning a specific role or persona to the AI (e.g., "You are an expert historian").',
      components: [
        { id: 'AI Persona', example: 'You are an award-winning pastry chef from France.' },
        { id: 'Task', example: 'Provide a detailed recipe for making perfect classic French croissants, including tips and tricks for beginners.' },
        { id: 'Expected Response Style', example: 'Use enthusiastic and knowledgeable language, as if sharing trade secrets. Include details on the importance of quality ingredients and technique.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'few_shot_prompting',
    idLocale: {
      name: 'Few-Shot Prompting',
      shortName: 'Few-Shot',
      description: 'Memberikan beberapa contoh input-output (shots) untuk membantu AI memahami pola dan format yang diinginkan.',
      components: [
        { id: 'Contoh 1 Input', example: 'Teks: "Cuaca hari ini sangat cerah dan menyenangkan." Sentimen:' },
        { id: 'Contoh 1 Output', example: 'Positif' },
        { id: 'Contoh 2 Input', example: 'Teks: "Saya kecewa dengan kualitas produk ini." Sentimen:' },
        { id: 'Contoh 2 Output', example: 'Negatif' },
        { id: 'Input Baru', example: 'Teks: "Pelayanannya biasa saja, tidak ada yang istimewa." Sentimen:' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'Few-Shot Prompting',
      shortName: 'Few-Shot',
      description: 'Providing a few input-output examples (shots) to help the AI understand the desired pattern and format.',
      components: [
        { id: 'Example 1 Input', example: 'Text: "The weather today is so bright and pleasant." Sentiment:' },
        { id: 'Example 1 Output', example: 'Positive' },
        { id: 'Example 2 Input', example: 'Text: "I am disappointed with the quality of this product." Sentiment:' },
        { id: 'Example 2 Output', example: 'Negative' },
        { id: 'New Input', example: 'Text: "The service was average, nothing special." Sentiment:' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  {
    id: 'pact',
    idLocale: {
      name: 'PACT (Masalah, Analisis, Kendala, Target Hasil)',
      shortName: 'PACT',
      description: 'PACT membantu dalam pemecahan masalah dengan mendefinisikan Masalah, melakukan Analisis, mengidentifikasi Kendala, dan menetapkan Target Hasil.',
      components: [
        { id: 'Masalah (Problem)', example: 'Tingkat retensi karyawan di departemen teknologi kami menurun 15% dalam setahun terakhir.' },
        { id: 'Analisis (Analysis)', example: 'Wawancara keluar menunjukkan ketidakpuasan dengan peluang pengembangan karir dan keseimbangan kerja-hidup. Gaji kompetitif tetapi bukan faktor utama. Budaya tim dilaporkan positif.' },
        { id: 'Kendala (Constraints)', example: 'Anggaran terbatas untuk kenaikan gaji besar-besaran. Perusahaan sedang dalam fase pertumbuhan cepat, sehingga beban kerja cenderung tinggi.' },
        { id: 'Target Hasil (Target Outcome)', example: 'Strategi retensi karyawan yang dapat diterapkan dalam 3 bulan ke depan, dengan tujuan mengurangi tingkat atrisi sebesar 5% dalam 6 bulan berikutnya. Fokus pada solusi non-moneter atau berbiaya rendah.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    },
    enLocale: {
      name: 'PACT (Problem, Analysis, Constraints, Target Outcome)',
      shortName: 'PACT',
      description: 'PACT aids in problem-solving by defining the Problem, conducting Analysis, identifying Constraints, and setting a Target Outcome.',
      components: [
        { id: 'Problem', example: 'Employee retention rate in our tech department has dropped by 15% in the last year.' },
        { id: 'Analysis', example: 'Exit interviews indicate dissatisfaction with career development opportunities and work-life balance. Salaries are competitive but not the primary factor. Team culture is reportedly positive.' },
        { id: 'Constraints', example: 'Limited budget for across-the-board salary increases. The company is in a rapid growth phase, so workload tends to be high.' },
        { id: 'Target Outcome', example: 'An employee retention strategy implementable within the next 3 months, aiming to reduce the attrition rate by 5% in the following 6 months. Focus on non-monetary or low-cost solutions.' }
      ],
      category: 'text',
      genericToolLinks: mergeAndSortTextToolLinks([])
    }
  },
  // --- Image & Video Prompt Framework (Now all interactive and detailed) ---
  {
    id: 'midjourney',
    idLocale: {
      name: 'Midjourney (Interaktif)',
      shortName: 'Midjourney',
      description: 'Buat prompt gambar detail untuk Midjourney AI secara interaktif, fokus pada deskripsi visual, gaya, dan parameter.',
      components: [],
      category: 'media',
      toolLink: 'https://www.midjourney.com/app/',
      genericToolLinks: createMediaMusicToolLinks('Midjourney', 'https://www.midjourney.com/app/', [
          { name: 'Discord (Midjourney Access)', url: 'https://discord.com/invite/midjourney' },
          ...standardImageVideoAlternatives
      ]),
      interactiveDefinition: midjourneySectionsId,
      interactivePromptTemplate: midjourneyTemplate, // This template is now primarily for param placeholders
    },
    enLocale: {
      name: 'Midjourney (Interactive)',
      shortName: 'Midjourney',
      description: 'Interactively create detailed image prompts for Midjourney AI, focusing on visual descriptions, style, and parameters.',
      components: [],
      category: 'media',
      toolLink: 'https://www.midjourney.com/app/',
      genericToolLinks: createMediaMusicToolLinks('Midjourney', 'https://www.midjourney.com/app/', [
          { name: 'Discord (Midjourney Access)', url: 'https://discord.com/invite/midjourney' },
          ...standardImageVideoAlternatives
      ]),
      interactiveDefinition: midjourneySectionsEn,
      interactivePromptTemplate: midjourneyTemplate, // This template is now primarily for param placeholders
    }
  },
  {
    id: 'dalle3',
    idLocale: {
      name: 'DALL-E 3 (Interaktif)',
      shortName: 'DALL-E 3',
      description: 'Susun prompt deskriptif untuk DALL-E 3 OpenAI, dengan fokus pada bahasa alami dan detail naratif.',
      components: [],
      category: 'media',
      toolLink: 'https://labs.openai.com/',
      genericToolLinks: createMediaMusicToolLinks('DALL-E 3 (OpenAI)', 'https://labs.openai.com/', standardImageVideoAlternatives),
      interactiveDefinition: dalle3SectionsId,
      interactivePromptTemplate: dalle3Template, // This template structure is for App.tsx to reference
    },
    enLocale: {
      name: 'DALL-E 3 (Interactive)',
      shortName: 'DALL-E 3',
      description: 'Craft descriptive prompts for OpenAI\'s DALL-E 3, focusing on natural language and narrative detail.',
      components: [],
      category: 'media',
      toolLink: 'https://labs.openai.com/',
      genericToolLinks: createMediaMusicToolLinks('DALL-E 3 (OpenAI)', 'https://labs.openai.com/', standardImageVideoAlternatives),
      interactiveDefinition: dalle3SectionsEn,
      interactivePromptTemplate: dalle3Template, // This template structure is for App.tsx to reference
    }
  },
  {
    id: 'stable_diffusion',
    idLocale: {
      name: 'Stable Diffusion (Interaktif)',
      shortName: 'Stable Diffusion',
      description: 'Bangun prompt komprehensif untuk Stable Diffusion, termasuk prompt positif & negatif, dan parameter teknis.',
      components: [],
      category: 'media',
      toolLink: 'https://stablediffusion.com/', 
      genericToolLinks: createMediaMusicToolLinks('Stable Diffusion (General)', 'https://stablediffusion.com/', [
        { name: 'DreamStudio (Stability AI)', url: 'https://dreamstudio.ai/' },
        { name: 'Automatic1111 (Self-hosted)', url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui' },
        ...standardImageVideoAlternatives
      ]),
      interactiveDefinition: stableDiffusionSectionsId,
      interactivePromptTemplate: stableDiffusionTemplate, // For param placeholders reference
    },
    enLocale: {
      name: 'Stable Diffusion (Interactive)',
      shortName: 'Stable Diffusion',
      description: 'Construct comprehensive prompts for Stable Diffusion, including positive & negative prompts, and technical parameters.',
      components: [],
      category: 'media',
      toolLink: 'https://stablediffusion.com/', 
      genericToolLinks: createMediaMusicToolLinks('Stable Diffusion (General)', 'https://stablediffusion.com/', [
        { name: 'DreamStudio (Stability AI)', url: 'https://dreamstudio.ai/' },
        { name: 'Automatic1111 (Self-hosted)', url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui' },
        ...standardImageVideoAlternatives
      ]),
      interactiveDefinition: stableDiffusionSectionsEn,
      interactivePromptTemplate: stableDiffusionTemplate, // For param placeholders reference
    }
  },
  {
    id: 'google_veo',
    idLocale: {
      name: 'Google Veo (Interaktif)',
      shortName: 'Google Veo',
      description: "Buat prompt video untuk Google Veo, dengan detail pada subjek, aksi, gaya visual, dan sinematografi. *Info lebih lanjut di situs resmi Google DeepMind.*",
      category: 'media',
      components: [],
      toolLink: "https://deepmind.google/technologies/veo/", 
      genericToolLinks: createMediaMusicToolLinks('Google Veo', "https://deepmind.google/technologies/veo/", standardImageVideoAlternatives),
      interactiveDefinition: veoInteractiveDefinitionId,
      interactivePromptTemplate: veoInteractivePromptTemplate 
    },
    enLocale: {
      name: 'Google Veo (Interactive)',
      shortName: 'Google Veo',
      description: "Create video prompts for Google Veo, detailing subject, action, visual style, and cinematography. *More info on the official Google DeepMind website.*",
      category: 'media',
      components: [],
      toolLink: "https://deepmind.google/technologies/veo/", 
      genericToolLinks: createMediaMusicToolLinks('Google Veo', "https://deepmind.google/technologies/veo/", standardImageVideoAlternatives),
      interactiveDefinition: veoInteractiveDefinitionEn,
      interactivePromptTemplate: veoInteractivePromptTemplate 
    }
  },
  {
    id: 'runway_gen2',
    idLocale: {
      name: 'Runway Gen-2 (Interaktif)',
      shortName: 'Runway Gen-2',
      description: 'Buat prompt untuk Runway Gen-2, fokus pada deskripsi adegan, gerakan kamera, dan gaya visual video.',
      category: 'media',
      components: [],
      toolLink: 'https://app.runwayml.com/video-tools/gen-2',
      genericToolLinks: createMediaMusicToolLinks('Runway Gen-2', 'https://app.runwayml.com/video-tools/gen-2', standardImageVideoAlternatives),
      interactiveDefinition: runwayGen2SectionsId,
      interactivePromptTemplate: runwayGen2Template,
    },
    enLocale: {
      name: 'Runway Gen-2 (Interactive)',
      shortName: 'Runway Gen-2',
      description: 'Create prompts for Runway Gen-2, focusing on scene description, camera movement, and video visual style.',
      category: 'media',
      components: [],
      toolLink: 'https://app.runwayml.com/video-tools/gen-2',
      genericToolLinks: createMediaMusicToolLinks('Runway Gen-2', 'https://app.runwayml.com/video-tools/gen-2', standardImageVideoAlternatives),
      interactiveDefinition: runwayGen2SectionsEn,
      interactivePromptTemplate: runwayGen2Template,
    }
  },
  {
    id: 'leonardo_ai',
    idLocale: {
      name: 'Leonardo.Ai (Interaktif Rinci)',
      shortName: 'Leonardo.Ai',
      description: 'Buat prompt gambar/video yang sangat rinci untuk Leonardo.Ai atau platform serupa, menggunakan pendekatan terstruktur.',
      category: 'media',
      components: [],
      toolLink: 'https://app.leonardo.ai/',
      genericToolLinks: createMediaMusicToolLinks('Leonardo.Ai', 'https://app.leonardo.ai/', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Leonardo.Ai', 'id'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    },
    enLocale: {
      name: 'Leonardo.Ai (Detailed Interactive)',
      shortName: 'Leonardo.Ai',
      description: 'Create highly detailed image/video prompts for Leonardo.Ai or similar platforms using a structured approach.',
      category: 'media',
      components: [],
      toolLink: 'https://app.leonardo.ai/',
      genericToolLinks: createMediaMusicToolLinks('Leonardo.Ai', 'https://app.leonardo.ai/', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Leonardo.Ai', 'en'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    }
  },
  {
    id: 'adobe_firefly',
    idLocale: {
      name: 'Adobe Firefly (Interaktif Rinci)',
      shortName: 'Adobe Firefly',
      description: 'Buat prompt gambar/video yang sangat rinci untuk Adobe Firefly, menggunakan pendekatan terstruktur untuk hasil optimal.',
      category: 'media',
      components: [],
      toolLink: 'https://firefly.adobe.com/generate/images',
      genericToolLinks: createMediaMusicToolLinks('Adobe Firefly', 'https://firefly.adobe.com/generate/images', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Adobe Firefly', 'id'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    },
    enLocale: {
      name: 'Adobe Firefly (Detailed Interactive)',
      shortName: 'Adobe Firefly',
      description: 'Create highly detailed image/video prompts for Adobe Firefly, using a structured approach for optimal results.',
      category: 'media',
      components: [],
      toolLink: 'https://firefly.adobe.com/generate/images',
      genericToolLinks: createMediaMusicToolLinks('Adobe Firefly', 'https://firefly.adobe.com/generate/images', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Adobe Firefly', 'en'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    }
  },
  {
    id: 'ideogram_ai',
    idLocale: {
      name: 'Ideogram (Interaktif Rinci)',
      shortName: 'Ideogram',
      description: 'Susun prompt gambar/video terperinci untuk Ideogram AI, dengan fokus pada elemen visual dan tekstual.',
      category: 'media',
      components: [],
      toolLink: 'https://ideogram.ai/create',
      genericToolLinks: createMediaMusicToolLinks('Ideogram', 'https://ideogram.ai/create', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Ideogram', 'id'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    },
    enLocale: {
      name: 'Ideogram (Detailed Interactive)',
      shortName: 'Ideogram',
      description: 'Craft detailed image/video prompts for Ideogram AI, focusing on visual and textual elements.',
      category: 'media',
      components: [],
      toolLink: 'https://ideogram.ai/create',
      genericToolLinks: createMediaMusicToolLinks('Ideogram', 'https://ideogram.ai/create', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Ideogram', 'en'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    }
  },
  {
    id: 'pika_labs',
    idLocale: {
      name: 'Pika Labs (Interaktif Rinci)',
      shortName: 'Pika Labs',
      description: 'Desain prompt video yang komprehensif untuk Pika Labs, mencakup aspek visual, gerakan, dan narasi.',
      category: 'media',
      components: [],
      toolLink: 'https://pika.art/',
      genericToolLinks: createMediaMusicToolLinks('Pika Labs', 'https://pika.art/', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Pika Labs (Video)', 'id'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    },
    enLocale: {
      name: 'Pika Labs (Detailed Interactive)',
      shortName: 'Pika Labs',
      description: 'Design comprehensive video prompts for Pika Labs, covering visual aspects, motion, and narrative.',
      category: 'media',
      components: [],
      toolLink: 'https://pika.art/',
      genericToolLinks: createMediaMusicToolLinks('Pika Labs', 'https://pika.art/', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Pika Labs (Video)', 'en'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    }
  },
  {
    id: 'openai_sora',
    idLocale: {
      name: 'OpenAI Sora (Interaktif Rinci)',
      shortName: 'OpenAI Sora',
      description: "Buat prompt video yang sangat deskriptif untuk OpenAI Sora, model AI teks-ke-video dari OpenAI. *Info lebih lanjut di situs resmi OpenAI.*",
      category: 'media',
      components: [],
      toolLink: "https://openai.com/sora", 
      genericToolLinks: createMediaMusicToolLinks('OpenAI Sora', "https://openai.com/sora", standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('OpenAI Sora (Video)', 'id'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    },
    enLocale: {
      name: 'OpenAI Sora (Detailed Interactive)',
      shortName: 'OpenAI Sora',
      description: "Create highly descriptive video prompts for OpenAI Sora, OpenAI's text-to-video AI model. *More info on the official OpenAI website.*",
      category: 'media',
      components: [],
      toolLink: "https://openai.com/sora", 
      genericToolLinks: createMediaMusicToolLinks('OpenAI Sora', "https://openai.com/sora", standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('OpenAI Sora (Video)', 'en'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    }
  },
  {
    id: 'playground_ai',
    idLocale: {
      name: 'Playground AI (Interaktif Rinci)',
      shortName: 'Playground AI',
      description: 'Bangun prompt gambar/video terstruktur untuk Playground AI, dengan penekanan pada gaya dan detail.',
      category: 'media',
      components: [],
      toolLink: 'https://playgroundai.com/create',
      genericToolLinks: createMediaMusicToolLinks('Playground AI', 'https://playgroundai.com/create', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Playground AI', 'id'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    },
    enLocale: {
      name: 'Playground AI (Detailed Interactive)',
      shortName: 'Playground AI',
      description: 'Build structured image/video prompts for Playground AI, with an emphasis on style and detail.',
      category: 'media',
      components: [],
      toolLink: 'https://playgroundai.com/create',
      genericToolLinks: createMediaMusicToolLinks('Playground AI', 'https://playgroundai.com/create', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Playground AI', 'en'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    }
  },
  {
    id: 'canva_magic_media',
    idLocale: {
      name: 'Canva Magic Media (Interaktif Rinci)',
      shortName: 'Canva Magic Media',
      description: 'Buat prompt gambar/video yang efektif untuk Canva Magic Media, cocok untuk kebutuhan desain grafis.',
      category: 'media',
      components: [],
      toolLink: 'https://www.canva.com/magic-media/',
      genericToolLinks: createMediaMusicToolLinks('Canva Magic Media', 'https://www.canva.com/magic-media/', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Canva Magic Media', 'id'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    },
    enLocale: {
      name: 'Canva Magic Media (Detailed Interactive)',
      shortName: 'Canva Magic Media',
      description: 'Create effective image/video prompts for Canva Magic Media, suitable for graphic design needs.',
      category: 'media',
      components: [],
      toolLink: 'https://www.canva.com/magic-media/',
      genericToolLinks: createMediaMusicToolLinks('Canva Magic Media', 'https://www.canva.com/magic-media/', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Canva Magic Media', 'en'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    }
  },
  {
    id: 'kaiber_ai',
    idLocale: {
      name: 'Kaiber.ai (Interaktif Rinci)',
      shortName: 'Kaiber.ai',
      description: 'Desain prompt video yang mendalam untuk Kaiber.ai, fokus pada transformasi visual dan gaya artistik.',
      category: 'media',
      components: [],
      toolLink: 'https://kaiber.ai/',
      genericToolLinks: createMediaMusicToolLinks('Kaiber.ai', 'https://kaiber.ai/', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Kaiber.ai (Video)', 'id'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    },
    enLocale: {
      name: 'Kaiber.ai (Detailed Interactive)',
      shortName: 'Kaiber.ai',
      description: 'Design in-depth video prompts for Kaiber.ai, focusing on visual transformations and artistic styles.',
      category: 'media',
      components: [],
      toolLink: 'https://kaiber.ai/',
      genericToolLinks: createMediaMusicToolLinks('Kaiber.ai', 'https://kaiber.ai/', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Kaiber.ai (Video)', 'en'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    }
  },
  {
    id: 'nightcafe_creator',
    idLocale: {
      name: 'NightCafe Creator (Interaktif Rinci)',
      shortName: 'NightCafe Creator',
      description: 'Buat prompt gambar/video terperinci untuk NightCafe Creator, jelajahi berbagai gaya dan preset.',
      category: 'media',
      components: [],
      toolLink: 'https://creator.nightcafe.studio/',
      genericToolLinks: createMediaMusicToolLinks('NightCafe Creator', 'https://creator.nightcafe.studio/', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('NightCafe Creator', 'id'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    },
    enLocale: {
      name: 'NightCafe Creator (Detailed Interactive)',
      shortName: 'NightCafe Creator',
      description: 'Create detailed image/video prompts for NightCafe Creator, exploring various styles and presets.',
      category: 'media',
      components: [],
      toolLink: 'https://creator.nightcafe.studio/',
      genericToolLinks: createMediaMusicToolLinks('NightCafe Creator', 'https://creator.nightcafe.studio/', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('NightCafe Creator', 'en'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    }
  },
  {
    id: 'clipdrop_stability',
    idLocale: {
      name: 'Clipdrop by Stability (Interaktif Rinci)',
      shortName: 'Clipdrop',
      description: 'Susun prompt gambar/video untuk berbagai alat Stability AI melalui Clipdrop, dengan pendekatan terstruktur.',
      category: 'media',
      components: [],
      toolLink: 'https://clipdrop.co/tools',
      genericToolLinks: createMediaMusicToolLinks('Clipdrop by Stability', 'https://clipdrop.co/tools', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Clipdrop by Stability', 'id'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    },
    enLocale: {
      name: 'Clipdrop by Stability (Detailed Interactive)',
      shortName: 'Clipdrop',
      description: 'Craft image/video prompts for various Stability AI tools via Clipdrop, using a structured approach.',
      category: 'media',
      components: [],
      toolLink: 'https://clipdrop.co/tools',
      genericToolLinks: createMediaMusicToolLinks('Clipdrop by Stability', 'https://clipdrop.co/tools', standardImageVideoAlternatives),
      interactiveDefinition: createDetailedImageVideoSections('Clipdrop by Stability', 'en'),
      interactivePromptTemplate: detailedImageVideoTemplate, 
    }
  },
  // --- Music Prompt Framework (Now all interactive) ---
  {
    id: 'suno_ai',
    idLocale: {
      name: 'Suno AI (Interaktif)',
      shortName: 'Suno AI',
      description: 'Rancang prompt musik untuk Suno AI, tentukan genre, mood, instrumen, vokal, tempo, dan lirik.',
      category: 'music',
      components: [],
      toolLink: 'https://app.suno.ai/',
      genericToolLinks: createMediaMusicToolLinks('Suno AI', 'https://app.suno.ai/', standardMusicAlternatives),
      interactiveDefinition: sunoAISectionsId,
      interactivePromptTemplate: sunoAITemplate, 
    },
    enLocale: {
      name: 'Suno AI (Interactive)',
      shortName: 'Suno AI',
      description: 'Design music prompts for Suno AI, specifying genre, mood, instruments, vocals, tempo, and lyrics.',
      category: 'music',
      components: [],
      toolLink: 'https://app.suno.ai/',
      genericToolLinks: createMediaMusicToolLinks('Suno AI', 'https://app.suno.ai/', standardMusicAlternatives),
      interactiveDefinition: sunoAISectionsEn,
      interactivePromptTemplate: sunoAITemplate, 
    }
  },
  {
    id: 'udio_ai',
    idLocale: {
      name: 'Udio AI (Interaktif Rinci)',
      shortName: 'Udio AI',
      description: 'Buat prompt musik yang sangat rinci untuk Udio AI atau platform musik generatif lainnya.',
      category: 'music',
      components: [],
      toolLink: 'https://www.udio.com/',
      genericToolLinks: createMediaMusicToolLinks('Udio AI', 'https://www.udio.com/', standardMusicAlternatives),
      interactiveDefinition: createDetailedMusicSections('Udio AI', 'id'),
      interactivePromptTemplate: detailedMusicTemplate, 
    },
    enLocale: {
      name: 'Udio AI (Detailed Interactive)',
      shortName: 'Udio AI',
      description: 'Create highly detailed music prompts for Udio AI or other generative music platforms.',
      category: 'music',
      components: [],
      toolLink: 'https://www.udio.com/',
      genericToolLinks: createMediaMusicToolLinks('Udio AI', 'https://www.udio.com/', standardMusicAlternatives),
      interactiveDefinition: createDetailedMusicSections('Udio AI', 'en'),
      interactivePromptTemplate: detailedMusicTemplate, 
    }
  },
  {
    id: 'stable_audio',
    idLocale: {
      name: 'Stable Audio (Interaktif Rinci)',
      shortName: 'Stable Audio',
      description: 'Bangun prompt audio/musik terperinci untuk Stable Audio dari Stability AI.',
      category: 'music',
      components: [],
      toolLink: 'https://stableaudio.com/generate/',
      genericToolLinks: createMediaMusicToolLinks('Stable Audio', 'https://stableaudio.com/generate/', standardMusicAlternatives),
      interactiveDefinition: createDetailedMusicSections('Stable Audio', 'id'),
      interactivePromptTemplate: detailedMusicTemplate, 
    },
    enLocale: {
      name: 'Stable Audio (Detailed Interactive)',
      shortName: 'Stable Audio',
      description: 'Build detailed audio/music prompts for Stability AI\'s Stable Audio.',
      category: 'music',
      components: [],
      toolLink: 'https://stableaudio.com/generate/',
      genericToolLinks: createMediaMusicToolLinks('Stable Audio', 'https://stableaudio.com/generate/', standardMusicAlternatives),
      interactiveDefinition: createDetailedMusicSections('Stable Audio', 'en'),
      interactivePromptTemplate: detailedMusicTemplate, 
    }
  },
  {
    id: 'google_musicfx',
    idLocale: {
      name: 'Google MusicFX (Interaktif Rinci)',
      shortName: 'Google MusicFX',
      description: 'Susun prompt musik yang mendalam untuk Google MusicFX, jelajahi berbagai aspek komposisi.',
      category: 'music',
      components: [],
      toolLink: 'https://aitestkitchen.withgoogle.com/tools/music-fx',
      genericToolLinks: createMediaMusicToolLinks('Google MusicFX', 'https://aitestkitchen.withgoogle.com/tools/music-fx', standardMusicAlternatives),
      interactiveDefinition: createDetailedMusicSections('Google MusicFX', 'id'),
      interactivePromptTemplate: detailedMusicTemplate, 
    },
    enLocale: {
      name: 'Google MusicFX (Detailed Interactive)',
      shortName: 'Google MusicFX',
      description: 'Craft in-depth music prompts for Google MusicFX, exploring various compositional aspects.',
      category: 'music',
      components: [],
      toolLink: 'https://aitestkitchen.withgoogle.com/tools/music-fx',
      genericToolLinks: createMediaMusicToolLinks('Google MusicFX', 'https://aitestkitchen.withgoogle.com/tools/music-fx', standardMusicAlternatives),
      interactiveDefinition: createDetailedMusicSections('Google MusicFX', 'en'),
      interactivePromptTemplate: detailedMusicTemplate, 
    }
  },
  {
    id: 'mubert_ai',
    idLocale: {
      name: 'Mubert (Interaktif Rinci)',
      shortName: 'Mubert',
      description: 'Desain prompt musik generatif untuk Mubert, fokus pada genre, mood, dan elemen musik spesifik.',
      category: 'music',
      components: [],
      toolLink: 'https://mubert.com/render',
      genericToolLinks: createMediaMusicToolLinks('Mubert', 'https://mubert.com/render', standardMusicAlternatives),
      interactiveDefinition: createDetailedMusicSections('Mubert', 'id'),
      interactivePromptTemplate: detailedMusicTemplate, 
    },
    enLocale: {
      name: 'Mubert (Detailed Interactive)',
      shortName: 'Mubert',
      description: 'Design generative music prompts for Mubert, focusing on genre, mood, and specific musical elements.',
      category: 'music',
      components: [],
      toolLink: 'https://mubert.com/render',
      genericToolLinks: createMediaMusicToolLinks('Mubert', 'https://mubert.com/render', standardMusicAlternatives),
      interactiveDefinition: createDetailedMusicSections('Mubert', 'en'),
      interactivePromptTemplate: detailedMusicTemplate, 
    }
  },
];
    