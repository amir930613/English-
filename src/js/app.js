/**
 * Главный модуль приложения LinguaLand
 * Инициализирует все модули и управляет жизненным циклом приложения
 */
import { CONFIG } from './config.js';
import { state } from './state.js';
import { setToastCallback } from './utils.js';
import profileManager from './modules/profiles.js';
import cardManager from './modules/cards.js';
import uiManager from './modules/ui.js';

class App {
  constructor() {
    this._initialized = false;
    this._cleanupFns = [];
  }

  /**
   * Инициализировать приложение
   */
  async init() {
    if (this._initialized) {
      console.warn('App already initialized');
      return;
    }

    try {
      // 1. Загрузить сохранённую тему
      uiManager.loadSavedTheme();

      // 2. Инициализировать UI
      uiManager.init();

      // 3. Настроить callback для toast уведомлений из utils
      setToastCallback((icon, title, message) => {
        uiManager.showToast(icon, title, message);
      });

      // 4. Загрузить профили
      const profiles = profileManager.loadProfiles();
      state.setPath('profiles', profiles);

      // 5. Показать экран профилей
      uiManager.showScreen('profile-screen');

      // 6. Зарегистрировать Service Worker для PWA
      await this._registerServiceWorker();

      // 7. Настроить обработчик видимости страницы (очистка при сворачивании)
      this._setupVisibilityHandler();

      // 8. Настроить горячие клавиши
      this._setupKeyboardShortcuts();

      this._initialized = true;
      console.log('✅ LinguaLand initialized');

    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      uiManager.showToast('❌', 'Ошибка', 'Не удалось запустить приложение');
    }
  }

  /**
   * Зарегистрировать Service Worker
   * @private
   */
  async _registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js', {
          scope: './'
        });
        
        if (registration.active) {
          console.log('✅ Service Worker active');
        }
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Доступна новая версия
              uiManager.showToast(
                '🔄',
                'Обновление доступно',
                'Перезагрузите страницу для применения'
              );
            }
          });
        });
        
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  /**
   * Обработчик видимости страницы
   * @private
   */
  _setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Страница скрыта - можно приостановить аудио и т.д.
        console.log('Page hidden, cleaning up...');
        cardManager.cleanup();
      } else {
        // Страница видима - восстановить состояние
        console.log('Page visible');
      }
    });
  }

  /**
   * Горячие клавиши
   * @private
   */
  _setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Пробел - перевернуть карточку (если в режиме карточек)
      if (e.code === 'Space' && state.getPath('ui.currentView') === 'cards') {
        e.preventDefault();
        const revealed = state.getPath('ui.revealed');
        if (!revealed) {
          cardManager.revealCard();
        }
      }

      // Стрелки - навигация по карточкам
      if (state.getPath('ui.currentView') === 'cards') {
        if (e.code === 'ArrowRight') {
          e.preventDefault();
          cardManager.nextCard();
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault();
          cardManager.prevCard();
        }
      }

      // Escape - закрыть toast
      if (e.code === 'Escape') {
        uiManager.hideToast();
      }
    });
  }

  /**
   * Активировать профиль
   * @param {string} profileName - Имя профиля
   * @returns {boolean} - Успешность
   */
  activateProfile(profileName) {
    const success = profileManager.setActiveProfile(profileName);
    
    if (success) {
      const profile = profileManager.getActiveProfile();
      uiManager.showToast('👤', 'Профиль активирован', profile.name);
      
      // Перейти к главному экрану
      uiManager.showScreen('main-screen');
      
      // Инициализировать колоду для уровня профиля
      cardManager.initDeck(profile.level);
    } else {
      uiManager.showToast('⚠️', 'Ошибка', 'Не удалось активировать профиль');
    }
    
    return success;
  }

  /**
   * Создать новый профиль
   * @param {string} name - Имя
   * @param {string} level - Уровень
   * @returns {Object|null} - Профиль или null
   */
  createProfile(name, level = 'A1') {
    const profile = profileManager.createProfile(name, level);
    
    if (profile) {
      uiManager.showToast('🎉', 'Профиль создан', `Добро пожаловать, ${name}!`);
      // Обновить список профилей в UI
      this._refreshProfileList();
    } else {
      uiManager.showToast('⚠️', 'Ошибка', 'Не удалось создать профиль');
    }
    
    return profile;
  }

  /**
   * Обновить список профилей в UI
   * @private
   */
  _refreshProfileList() {
    // Эта функция будет вызывать рендеринг списка профилей
    // Реализация зависит от конкретного UI
    console.log('Refreshing profile list...');
  }

  /**
   * Переключить тему
   */
  toggleTheme() {
    uiManager.toggleTheme();
  }

  /**
   * Очистить ресурсы приложения
   */
  cleanup() {
    console.log('Cleaning up app resources...');
    
    cardManager.cleanup();
    uiManager.cleanup();
    state.cleanup();
    
    this._cleanupFns.forEach(fn => fn());
    this._cleanupFns = [];
    
    this._initialized = false;
  }

  /**
   * Экспорт данных профиля
   * @param {string} profileName - Имя профиля
   * @param {string} format - Формат ('json' или 'csv')
   * @returns {string|null} - Данные для экспорта
   */
  exportData(profileName, format = 'json') {
    if (format === 'json') {
      return profileManager.exportProfile(profileName);
    } else if (format === 'csv') {
      return profileManager.exportAllToCSV();
    }
    return null;
  }

  /**
   * Импорт данных профиля
   * @param {string} jsonString - JSON строка
   * @returns {Object|null} - Импортированный профиль
   */
  importData(jsonString) {
    const profile = profileManager.importProfile(jsonString);
    
    if (profile) {
      uiManager.showToast('📥', 'Импорт успешен', `Профиль ${profile.name} добавлен`);
      this._refreshProfileList();
    } else {
      uiManager.showToast('⚠️', 'Ошибка импорта', 'Неверный формат данных');
    }
    
    return profile;
  }

  /**
   * Получить версию приложения
   * @returns {number} - Версия схемы
   */
  getVersion() {
    return CONFIG.SCHEMA_VERSION;
  }
}

// Singleton instance
const app = new App();

// Авто-инициализация при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

export { app, App };
export default app;
