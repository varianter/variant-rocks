import EN from "./en";
import NO from "./no";
import SE from "./se";

export type { LocaleType } from "./en";

export const AllLangs = ["en", "no", "se"] as const;
type Lang = (typeof AllLangs)[number];

const LANG_KEY = "lang";

function getItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function getLanguage() {
  try {
    return navigator.language.toLowerCase();
  } catch {
    return "no";
  }
}

export function getLang(): Lang {
  const savedLang = getItem(LANG_KEY);

  if (AllLangs.includes((savedLang ?? "") as Lang)) {
    return savedLang as Lang;
  }

  const lang = getLanguage();

  if (lang == "en") {
    return "en";
  }
  if (lang == "se") {
    return "se";
  }
  return "no";
}

export function changeLang(lang: Lang) {
  setItem(LANG_KEY, lang);
  location.reload();
}

export default { en: EN, no: NO, se: SE }[getLang()];
