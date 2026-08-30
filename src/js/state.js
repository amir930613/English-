/**
 * Модуль управления состоянием приложения
 */
import { CONFIG } from './config.js';
import { deepClone, isEmptyObject } from './utils.js';

class AppState {
  constructor() {
    this._state = {
      profiles: {},
      activeProfile: null,
      settings: { ...CONFIG.DEFAULT_SETTINGS },
      ui: {
        currentView: 'profile',
        audioMode: false,
        revealed: false,
        animating: false,
        dragState: null,
        wasDrag: false
      },
      cards: {
        deck: [],
        currentIndex: 0,
        stats: { known: 0, notKnown: 0 }
      },
      quiz: {
        questions: [],
        currentIndex: 0,
        score: 0,
        answers: []
      },
      exam: {
        level: 'A1',
        questions: [],
        currentIndex: 0,
        answers: {},
        timer: null,
        timeLeft: 0
      },
      practice: {
        sentences: [],
        currentIndex: 0,
        mistakes: []
      }
    };
    
    this._listeners = new Map();
  }

  /**
   * Получить всё состояние
   * @returns {Object} - Копия состояния
   */
  getState() {
    return deepClone(this._state);
  }

  /**
   * Получить часть состояния по пути
   * @param {string} path - Путь вида 'ui.currentView'
   * @returns {*} - Значение
   */
  getPath(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this._state);
  }

  /**
   * Установить часть состояния
   * @param {string} path - Путь вида 'ui.currentView'
   * @param {*} value - Новое значение
   * @param {boolean} notify - Уведомлять слушателей
   */
  setPath(path, value, notify = true) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key], this._state);
    
    const oldValue = target[lastKey];
    target[lastKey] = value;
    
    if (notify && oldValue !== value) {
      this._notify(path, value, oldValue);
    }
  }

  /**
   * Подписаться на изменения
   * @param {string} path - Путь для подписки
   * @param {Function} callback - Callback при изменении
   * @returns {Function} - Функция отписки
   */
  subscribe(path, callback) {
    if (!this._listeners.has(path)) {
      this._listeners.set(path, new Set());
    }
    this._listeners.get(path).add(callback);
    
    return () => {
      const listeners = this._listeners.get(path);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Уведомить слушателей об изменении
   * @private
   */
  _notify(path, newValue, oldValue) {
    // Уведомить точных подписчиков
    const exactListeners = this._listeners.get(path);
    if (exactListeners) {
      exactListeners.forEach(cb => cb(newValue, oldValue));
    }
    
    // Уведомить подписчиков на родительские пути
    const parts = path.split('.');
    for (let i = parts.length - 1; i > 0; i--) {
      const parentPath = parts.slice(0, i).join('.');
      const parentListeners = this._listeners.get(parentPath);
      if (parentListeners) {
        parentListeners.forEach(cb => cb(this.getPath(parentPath)));
      }
    }
  }

  /**
   * Сбросить состояние к начальным значениям
   */
  reset() {
    this._state = {
      profiles: {},
      activeProfile: null,
      settings: { ...CONFIG.DEFAULT_SETTINGS },
      ui: {
        currentView: 'profile',
        audioMode: false,
        revealed: false,
        animating: false,
        dragState: null,
        wasDrag: false
      },
      cards: {
        deck: [],
        currentIndex: 0,
        stats: { known: 0, notKnown: 0 }
      },
      quiz: {
        questions: [],
        currentIndex: 0,
        score: 0,
        answers: []
      },
      exam: {
        level: 'A1',
        questions: [],
        currentIndex: 0,
        answers: {},
        timer: null,
        timeLeft: 0
      },
      practice: {
        sentences: [],
        currentIndex: 0,
        mistakes: []
      }
    };
    
    this._notify('reset', this._state, null);
  }

  /**
   * Очистить таймеры и ресурсы
   */
  cleanup() {
    if (this._state.exam.timer) {
      clearInterval(this._state.exam.timer);
      this._state.exam.timer = null;
    }
    
    this._listeners.clear();
  }
}

// Singleton instance
const state = new AppState();

export { state, AppState };
export default state;
