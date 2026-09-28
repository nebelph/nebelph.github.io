// Клик по кнопке Email копирует адрес в буфер обмена и показывает уведомление.
// Словарь translations объявлен в i18n.js (скрипты с defer выполняются по порядку).

const TOAST_DURATION_MS = 2500;

const emailBtn = document.getElementById("email-btn");
const toast = document.getElementById("toast");
let toastTimer = null;

// Текст на текущем языке страницы (его выставляет i18n.js в <html lang>)
function t(key) {
  const dict = translations[document.documentElement.lang] || translations.en;
  return dict[key];
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);        // повторный клик продлевает показ, а не накладывает таймеры
  toastTimer = setTimeout(() => toast.classList.remove("show"), TOAST_DURATION_MS);
}

// Запасной способ для старых браузеров и страниц без HTTPS,
// где navigator.clipboard недоступен
function copyViaTextarea(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  return ok;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // например, браузер запретил доступ — пробуем запасной способ
    }
  }
  try { return copyViaTextarea(text); } catch { return false; }
}

emailBtn.addEventListener("click", async (event) => {
  event.preventDefault();          // не открывать почтовую программу
  const email = emailBtn.dataset.email;
  const ok = await copyText(email);
  showToast(ok ? t("emailCopied") : `${t("emailCopyFailed")} ${email}`);
});
