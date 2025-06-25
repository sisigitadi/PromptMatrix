// e:\Projects\Ai\PromptMatrix_Local\frameworks.ts

import { Framework } from './types';

export const frameworks: Framework[] = [
  // --- Text Frameworks (Alphabetical Order) ---
  {
    id: 'aida',
    name: 'AIDA',
    category: 'Text',
    isInteractive: false,
    isNew: false,
    description: 'A classic marketing framework for creating persuasive copy that grabs Attention, holds Interest, creates Desire, and prompts Action.',
    components: [
      { id: 'attention', name: 'Attention', placeholder: 'Start with a bold statement, question, or fact to grab the reader\'s attention.' },
      { id: 'interest', name: 'Interest', placeholder: 'Provide interesting and fresh information that keeps the reader engaged.' },
      { id: 'desire', name: 'Desire', placeholder: 'Explain how your product/service/idea solves their problem or fulfills their need, creating desire.' },
      { id: 'action', name: 'Action', placeholder: 'Clearly tell the reader what specific action you want them to take next.' },
    ],
    translations: {
      id: {
        name: 'AIDA',
        description: 'Kerangka kerja pemasaran klasik untuk membuat salinan persuasif yang menarik Perhatian, mempertahankan Minat, menciptakan Keinginan, dan mendorong Tindakan.',
        components: [
          { id: 'attention', name: 'Perhatian', placeholder: 'Mulai dengan pernyataan, pertanyaan, atau fakta yang berani untuk menarik perhatian pembaca.' },
          { id: 'interest', name: 'Minat', placeholder: 'Berikan informasi menarik dan segar yang membuat pembaca tetap terlibat.' },
          { id: 'desire', name: 'Keinginan', placeholder: 'Jelaskan bagaimana produk/layanan/ide Anda memecahkan masalah mereka atau memenuhi kebutuhan mereka, menciptakan keinginan.' },
          { id: 'action', name: 'Tindakan', placeholder: 'Beritahu pembaca dengan jelas tindakan spesifik apa yang Anda ingin mereka lakukan selanjutnya.' },
        ],
      },
    },
  },
  {
    id: 'ride',
    name: 'RIDE',
    category: 'Text',
    isInteractive: false,
    isNew: false,
    description: 'A framework for structuring feedback or reports: Report, Interpret, Describe, Evaluate.',
    components: [
      { id: 'report', name: 'Report', placeholder: 'State the objective facts of what happened.' },
      { id: 'interpret', name: 'Interpret', placeholder: 'Explain your interpretation of the facts.' },
      { id: 'describe', name: 'Describe', placeholder: 'Describe the impact or consequences.' },
      { id: 'evaluate', name: 'Evaluate', placeholder: 'Provide an overall evaluation or next steps.' },
    ],
    translations: {
      id: {
        name: 'RIDE',
        description: 'Kerangka kerja untuk menyusun umpan balik atau laporan: Laporkan, Tafsirkan, Jelaskan, Evaluasi.',
        components: [
          { id: 'report', name: 'Laporkan', placeholder: 'Sebutkan fakta objektif tentang apa yang terjadi.' },
          { id: 'interpret', name: 'Tafsirkan', placeholder: 'Jelaskan interpretasi Anda terhadap fakta tersebut.' },
          { id: 'describe', name: 'Jelaskan', placeholder: 'Jelaskan dampak atau konsekuensinya.' },
          { id: 'evaluate', name: 'Evaluasi', placeholder: 'Berikan evaluasi keseluruhan atau langkah selanjutnya.' },
        ],
      },
    },
  },
  {
    id: 'soar',
    name: 'SOAR',
    category: 'Text',
    isInteractive: false,
    isNew: false,
    description: 'A framework for strategic planning and positive inquiry, focusing on what\'s working well, what\'s possible, what\'s desired, and how to measure success.',
    components: [
      { id: 'strengths', name: 'Strengths', placeholder: 'What are we doing well? What are our core competencies and positive attributes?' },
      { id: 'opportunities', name: 'Opportunities', placeholder: 'What external possibilities can we leverage? What trends or external factors can we capitalize on?' },
      { id: 'aspirations', name: 'Aspirations', placeholder: 'What is our desired future? What do we want to achieve or become?' },
      { id: 'results', name: 'Results', placeholder: 'How will we measure success? What are the tangible outcomes or indicators of achievement?' },
    ],
    translations: {
      id: {
        name: 'SOAR',
        description: 'Kerangka kerja untuk perencanaan strategis dan penyelidikan positif, berfokus pada apa yang berfungsi dengan baik, apa yang mungkin, apa yang diinginkan, dan bagaimana mengukur keberhasilan.',
        components: [
          { id: 'strengths', name: 'Kekuatan', placeholder: 'Apa yang kita lakukan dengan baik? Apa kompetensi inti dan atribut positif kita?' },
          { id: 'opportunities', name: 'Peluang', placeholder: 'Peluang eksternal apa yang bisa kita manfaatkan? Tren atau faktor eksternal apa yang bisa kita kapitalisasi?' },
          { id: 'aspirations', name: 'Aspirasi', placeholder: 'Apa masa depan yang kita inginkan? Apa yang ingin kita capai atau menjadi?' },
          { id: 'results', name: 'Hasil', placeholder: 'Bagaimana kita akan mengukur keberhasilan? Apa hasil atau indikator pencapaian yang nyata?' },
        ],
      },
    },
  },
  {
    id: 'spice',
    name: 'SPICE',
    category: 'Text',
    isInteractive: false,
    isNew: false,
    description: 'A persuasive framework for structuring arguments by outlining the Situation, identifying the Problem, detailing the Implications, explaining the Consequences of inaction, and providing a clear Example.',
    components: [
      { id: 'situation', name: 'Situation', placeholder: 'Describe the specific context or background. Where and when does this happen?' },
      { id: 'problem', name: 'Problem', placeholder: 'What is the primary issue, pain point, or challenge in this situation?' },
      { id: 'implication', name: 'Implication', placeholder: 'What are the current negative effects or results of this problem?' },
      { id: 'consequence', name: 'Consequence', placeholder: 'What are the future negative outcomes if the problem is not solved?' },
      { id: 'example', name: 'Example', placeholder: 'Provide a concrete, specific example that illustrates the problem and its effects.' },
    ],
    translations: {
      id: {
        name: 'SPICE',
        description: 'Kerangka kerja persuasif untuk menyusun argumen dengan menguraikan Situasi, mengidentifikasi Masalah, merinci Implikasi, menjelaskan Konsekuensi jika tidak ada tindakan, dan memberikan Contoh yang jelas.',
        components: [
          { id: 'situation', name: 'Situasi', placeholder: 'Jelaskan konteks atau latar belakang spesifik. Di mana dan kapan ini terjadi?' },
          { id: 'problem', name: 'Masalah', placeholder: 'Apa isu utama, kesulitan, atau tantangan dalam situasi ini?' },
          { id: 'implication', name: 'Implikasi', placeholder: 'Apa dampak atau hasil negatif saat ini dari masalah ini?' },
          { id: 'consequence', name: 'Konsekuensi', placeholder: 'Apa hasil negatif di masa depan jika masalah ini tidak diselesaikan?' },
          { id: 'example', name: 'Contoh', placeholder: 'Berikan contoh nyata dan spesifik yang menggambarkan masalah dan dampaknya.' },
        ],
      },
    },
  },
  {
    id: 'star',
    name: 'STAR',
    category: 'Text',
    isInteractive: false,
    isNew: true,
    description: 'A structured method for answering behavioral interview questions or describing experiences by detailing the Situation, the Task, the Action taken, and the Result achieved.',
    components: [
      { id: 'situation', name: 'Situation', placeholder: 'Describe the context or background of the event or challenge.' },
      { id: 'task', name: 'Task', placeholder: 'Explain the specific task or challenge you faced.' },
      { id: 'action', name: 'Action', placeholder: 'Detail the specific actions you took to address the task/challenge.' },
      { id: 'result', name: 'Result', placeholder: 'Describe the outcome or result of your actions.' },
    ],
    translations: {
      id: {
        name: 'STAR',
        description: 'Metode terstruktur untuk menjawab pertanyaan wawancara perilaku atau menjelaskan pengalaman dengan merinci Situasi, Tugas, Tindakan yang diambil, dan Hasil yang dicapai.',
        components: [
          { id: 'situation', name: 'Situasi', placeholder: 'Jelaskan konteks atau latar belakang kejadian atau tantangan.' },
          { id: 'task', name: 'Tugas', placeholder: 'Jelaskan tugas atau tantangan spesifik yang Anda hadapi.' },
          { id: 'action', name: 'Tindakan', placeholder: 'Rincikan tindakan spesifik yang Anda ambil untuk mengatasi tugas/tantangan.' },
          { id: 'result', name: 'Hasil', placeholder: 'Jelaskan hasil atau dampak dari tindakan Anda.' },
        ],
      },
    },
  },
  // ... (Tambahkan framework lain yang sudah ada di sini jika perlu)
];

