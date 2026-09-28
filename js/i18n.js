// Словарь переводов: ключ из атрибута data-i18n → текст на нужном языке
const translations = {
  en: {
    title: "Artyom Rudakov",
    name: "Artyom Rudakov",
    emailCopied: "Email copied to clipboard",
    emailCopyFailed: "Couldn't copy. Email:",
  },
  ru: {
    title: "Артём Рудаков",
    name: "Артём Рудаков",
    emailCopied: "Email скопирован в буфер обмена",
    emailCopyFailed: "Не удалось скопировать. Email:",
  },
};

const STORAGE_KEY = "lang";

// localStorage может быть недоступен (приватный режим и т.п.) — поэтому try/catch
function loadSavedLang() {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function saveLang(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* не критично */ }
}

// Порядок выбора: сохранённый выбор → язык браузера → английский
function detectLang() {
  const saved = loadSavedLang();
  if (saved in translations) return saved;
  return navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
}

function applyLang(lang) {
  const dict = translations[lang];

  document.documentElement.lang = lang;
  document.title = dict.title;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = dict[el.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    el.alt = dict[el.dataset.i18nAlt];
  });

  // Подсветка активной кнопки EN/RU
  document.querySelectorAll(".lang button").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  });
}

document.querySelectorAll(".lang button").forEach((btn) => {
  btn.addEventListener("click", () => {
    applyLang(btn.dataset.lang);
    saveLang(btn.dataset.lang);
  });
});

applyLang(detectLang());
