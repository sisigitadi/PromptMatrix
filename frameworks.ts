// e:\Projects\Ai\PromptMatrix_Local\frameworks.ts

import { Framework } from './types';

export const frameworks: Framework[] = [
  {
    id: 'RTF',
    name: 'RTF',
    category: 'text',
    description: 'Role, Task, Format. A basic framework for text prompts.',
    shortDescription: 'Basic text prompt structure.',
    components: [
      { id: 'role', name: 'Role', placeholder: 'e.g., A senior marketing manager' },
      { id: 'task', name: 'Task', placeholder: 'e.g., Write a compelling ad copy' },
      { id: 'format', name: 'Format', placeholder: 'e.g., In a friendly tone, 100 words' },
    ],
    translations: {
      id: {
        name: 'RTF',
        description: 'Peran, Tugas, Format. Kerangka kerja dasar untuk prompt teks.',
        components: [
          { id: 'role', name: 'Peran', placeholder: 'contoh: Seorang manajer pemasaran senior' },
          { id: 'task', name: 'Tugas', placeholder: 'contoh: Tulis salinan iklan yang menarik' },
          { id: 'format', name: 'Format', placeholder: 'contoh: Dengan nada ramah, 100 kata' },
        ],
      },
    },
  },
  // Tambahkan framework Anda yang lain di sini
  // Pastikan formatnya sesuai dengan tipe Framework di types.ts
];