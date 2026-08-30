/**
 * Утилиты для LinguaLand
 */

/**
 * Экранирование HTML для защиты от XSS
 * @param {string} str - Строка для экранирования
 * @returns {string} - Экранированная строка
 */
export function esc(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Безопасная вставка текста в элемент
 * @param {string} elementId - ID элемента
 * @param {string} text - Текст для вставки
 */
export function safeSetText(elementId, text) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = text;
  }
}

/**
 * Безопасная вставка HTML с экранированием
 * @param {string} elementId - ID элемента
 * @param {string} html - HTML контент
 */
export function safeSetHTML(elementId, html) {
  const el = document.getElementById(elementId);
  if (el) {
    // Сначала экранируем, потом вставляем
    const div = document.createElement('div');
    div.innerHTML = html;
    // Рекурсивно экранируем весь текст
    el.innerHTML = escapeHTMLRecursive(div);
  }
}

/**
 * Рекурсивное экранирование HTML
 * @param {HTMLElement} node - DOM узел
 * @returns {string} - Экранированный HTML
 */
function escapeHTMLRecursive(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return esc(node.textContent);
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    let attrs = '';
    for (let attr of node.attributes) {
      attrs += ` ${attr.name}="${esc(attr.value)}"`;
    }
    const children = Array.from(node.childNodes).map(escapeHTMLRecursive).join('');
    return `<${node.tagName.toLowerCase()}${attrs}>${children}</${node.tagName.toLowerCase()}>`;
  }
  return '';
}

/**
 * Debounce функция
 * @param {Function} func - Функция для debounce
 * @param {number} wait - Время ожидания в мс
 * @returns {Function} - Debounced функция
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Проверка поддержки SpeechSynthesis API
 * @returns {boolean} - Поддерживается ли API
 */
export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Форматирование даты
 * @param {Date|string|number} date - Дата для форматирования
 * @returns {string} - Отформатированная дата
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Форматирование числа с разделителями
 * @param {number} num - Число
 * @returns {string} - Отформатированное число
 */
export function formatNumber(num) {
  return num.toLocaleString('ru-RU');
}

/**
 * Генерация уникального ID
 * @returns {string} - Уникальный ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Глубокое клонирование объекта
 * @param {Object} obj - Объект для клонирования
 * @returns {Object} - Клонированный объект
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Проверка на пустой объект
 * @param {Object} obj - Объект для проверки
 * @returns {boolean} - Пустой ли объект
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Безопасное получение из localStorage
 * @param {string} key - Ключ
 * @param {*} defaultValue - Значение по умолчанию
 * @returns {*} - Полученное значение или default
 */
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading from localStorage (${key}):`, e);
    return defaultValue;
  }
}

/**
 * Безопасная запись в localStorage
 * @param {string} key - Ключ
 * @param {*} value - Значение
 * @returns {boolean} - Успешность записи
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Error writing to localStorage (${key}):`, e);
    if (e.name === 'QuotaExceededError') {
      showToast('⚠️', 'Память заполнена', 'Удалите старые профили');
    }
    return false;
  }
}

/**
 * Показ уведомления (заглушка, будет переопределена в UI модуле)
 */
let toastCallback = null;

export function setToastCallback(callback) {
  toastCallback = callback;
}

export function showToast(icon, title, message) {
  if (toastCallback) {
    toastCallback(icon, title, message);
  } else {
    console.log(`[Toast] ${icon} ${title}: ${message}`);
  }
}

export default {
  esc,
  safeSetText,
  safeSetHTML,
  debounce,
  isSpeechSupported,
  formatDate,
  formatNumber,
  generateId,
  deepClone,
  isEmptyObject,
  getFromStorage,
  saveToStorage,
  setToastCallback,
  showToast
};
