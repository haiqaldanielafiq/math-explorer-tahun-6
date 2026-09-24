import { LocalizedString } from '@/types';

export function getLocalizedText(field?: string | LocalizedString, lang: 'ms' | 'en' = 'ms'): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.ms || '';
}
