/**
 * Модуль UI: уведомления, навигация, управление видом
 */
import { state } from './state.js';
import { CONFIG } from './config.js';

class UIManager {
  constructor() {
    this._toastTimer = null;
    this._toastElement = null;
  }

  /**
   * Инициализировать UI
   */
  init() {
    this._createToastElement();
    this._setupThemeToggle();
  }

  /**
   * Создать элемент для toast уведомлений
   * @private
   */
  _createToastElement() {
    // Проверка на существование элемента
    let toast = document.getElementById('toast');
    
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'hidden';
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'polite');
      
      toast.innerHTML = `
        <div class="toast-content">
          <span class="toast-icon"></span>
          <div class="toast-body">
            <div class="toast-title"></div>
            <div class="toast-message"></div>
          </div>
        </div>
      `;
      
      document.body.appendChild(toast);
    }
    
    this._toastElement = toast;
  }

  /**
   * Показать toast уведомление
   * @param {string} icon - Иконка (эмодзи)
   * @param {string} title - Заголовок
   * @param {string} message - Сообщение
   * @param {number} duration - Длительность в мс
   */
  showToast(icon, title, message, duration = CONFIG.TIMINGS.TOAST_AUTO_CLOSE) {
    if (!this._toastElement) return;

    // Очистить предыдущий таймер
    if (this._toastTimer) {
      clearTimeout(this._toastTimer);
    }

    // Обновить содержимое
    const iconEl = this._toastElement.querySelector('.toast-icon');
    const titleEl = this._toastElement.querySelector('.toast-title');
    const messageEl = this._toastElement.querySelector('.toast-message');

    if (iconEl) iconEl.textContent = icon;
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;

    // Показать toast
    this._toastElement.classList.remove('hidden');
    this._toastElement.setAttribute('aria-hidden', 'false');

    // Автозакрытие
    this._toastTimer = setTimeout(() => {
      this.hideToast();
    }, duration);
  }

  /**
   * Скрыть toast уведомление
   */
  hideToast() {
    if (!this._toastElement) return;

    if (this._toastTimer) {
      clearTimeout(this._toastTimer);
      this._toastTimer = null;
    }

    this._toastElement.classList.add('hidden');
    this._toastElement.setAttribute('aria-hidden', 'true');
  }

  /**
   * Переключить тему (светлая/тёмная)
   * @returns {boolean} - Новая тема (true = светлая)
   */
  toggleTheme() {
    const body = document.body;
    const isLight = body.classList.toggle('light');
    
    // Сохранить в localStorage
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, JSON.stringify(isLight));
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }

    // Обновить meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isLight ? '#eef2f7' : '#123B7A');
    }

    return isLight;
  }

  /**
   * Загрузить сохранённую тему
   */
  loadSavedTheme() {
    try {
      const isLight = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'false');
      if (isLight) {
        document.body.classList.add('light');
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
          metaTheme.setAttribute('content', '#eef2f7');
        }
      }
    } catch (e) {
      console.warn('Could not load theme preference:', e);
    }
  }

  /**
   * Настроить переключатель темы
   * @private
   */
  _setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  /**
   * Переключить видимость экрана
   * @param {string} screenId - ID экрана для показа
   */
  showScreen(screenId) {
    // Скрыть все экраны
    document.querySelectorAll('[id$="-screen"]').forEach(el => {
      el.classList.add('hidden');
    });

    // Показать нужный
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.remove('hidden');
      state.setPath('ui.currentView', screenId.replace('-screen', ''));
    }
  }

  /**
   * Получить текущий вид
   * @returns {string} - ID текущего вида
   */
  getCurrentView() {
    return state.getPath('ui.currentView') || 'profile';
  }

  /**
   * Обновить заголовок страницы
   * @param {string} title - Новый заголовок
   */
  updateTitle(title) {
    document.title = title;
  }

  /**
   * Показать индикатор загрузки
   * @param {string} containerId - ID контейнера
   */
  showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '<div class="loading">Загрузка...</div>';
    }
  }

  /**
   * Скрыть индикатор загрузки
   * @param {string} containerId - ID контейнера
   * @param {string} content - Контент для отображения
   */
  hideLoading(containerId, content = '') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = content;
    }
  }

  /**
   * Очистить ресурсы UI
   */
  cleanup() {
    if (this._toastTimer) {
      clearTimeout(this._toastTimer);
      this._toastTimer = null;
    }
  }
}

const uiManager = new UIManager();
export default uiManager;
