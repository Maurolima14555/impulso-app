import { Program } from '../types';

/**
 * IMPULSO Programs (Guided Journeys)
 * Inspired by Pura Mente's Wellness Program
 * Each program is a daily sequence of activities for X days
 */

export const PROGRAMS: Program[] = [
  {
    id: 'anxiety-reset',
    title: 'Reset Ansiedade',
    subtitle: '7 dias para respirar',
    description:
      'Um programa guiado de 7 dias com tecnicas cientificas para reduzir ansiedade. Cada dia constroi sobre o anterior.',
    icon: '🌊',
    gradient: ['#581c87', '#a855f7'] as const,
    totalDays: 7,
    intention: 'sos',
    category: 'meditation',
    activityIds: [
      'meditate-breath',      // Dia 1 — Respiracao 4-7-8
      'meditate-bodyscan',    // Dia 2 — Body scan
      'journal-braindump',    // Dia 3 — Brain dump
      'meditate-observe',     // Dia 4 — Observar pensamentos
      'exercise-walk',        // Dia 5 — Caminhada
      'meditate-gratitude',   // Dia 6 — Gratidao
      'journal-night',        // Dia 7 — Reflexao
    ],
    isPro: false,
  },
  {
    id: 'morning-ritual',
    title: 'Manha Imparavel',
    subtitle: '14 dias de rotina matinal',
    description:
      '14 dias para criar a melhor versao da tua manha. Pessoas de elite sabem que o dia ganha-se antes das 9h.',
    icon: '🌅',
    gradient: ['#9a3412', '#f97316'] as const,
    totalDays: 14,
    intention: 'morning',
    category: 'journaling',
    activityIds: [
      'journal-morning',
      'meditate-gratitude',
      'exercise-stretch',
      'read-quote',
      'meditate-visual',
      'exercise-walk',
      'journal-goals',
      'meditate-breath',
      'read-article',
      'exercise-hiit',
      'journal-morning',
      'meditate-gratitude',
      'exercise-yoga',
      'journal-goals',
    ],
    isPro: true,
  },
  {
    id: 'deep-focus',
    title: 'Foco Profundo',
    subtitle: '21 dias para dominar a atencao',
    description:
      '21 dias para treinar o teu cerebro a focar sem distracao. Construido sobre Deep Work e neurociencia.',
    icon: '🎯',
    gradient: ['#1e3a8a', '#3b82f6'] as const,
    totalDays: 21,
    intention: 'focus',
    category: 'reading',
    activityIds: [
      'read-chapter',
      'meditate-breath',
      'journal-goals',
      'read-deep',
      'learn-skill',
      'exercise-walk',
      'meditate-observe',
      'read-chapter',
      'journal-braindump',
      'learn-ted',
      'read-deep',
      'meditate-visual',
      'journal-goals',
      'learn-podcast',
      'read-chapter',
      'meditate-breath',
      'learn-skill',
      'read-deep',
      'journal-night',
      'meditate-gratitude',
      'read-chapter',
    ],
    isPro: true,
  },
  {
    id: 'gratitude-journey',
    title: 'Jornada Gratidao',
    subtitle: '7 dias para ver o que ja tens',
    description:
      'Harvard diz: 3 semanas de gratidao = 6 meses de maior felicidade. Comeca com 7 dias.',
    icon: '💝',
    gradient: ['#065f46', '#10b981'] as const,
    totalDays: 7,
    intention: 'clarity',
    category: 'journaling',
    activityIds: [
      'meditate-gratitude',
      'journal-gratitude',
      'meditate-gratitude',
      'journal-night',
      'meditate-gratitude',
      'journal-gratitude',
      'journal-night',
    ],
    isPro: false,
  },
];

export function getProgramById(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}
