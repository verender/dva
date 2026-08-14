export type Lang = "en" | "uk";

export type LocalizedText = {
  en: string;
  uk: string;
};

export function t(field: LocalizedText, lang: Lang): string {
  return field[lang] || field.en;
}

export function loc(en: string): LocalizedText {
  return { en, uk: "" };
}
