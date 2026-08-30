/**
 * Модуль управления профилями пользователей
 */
import { CONFIG } from './config.js';
import { getFromStorage, saveToStorage, generateId, deepClone, formatDate } from './utils.js';
import { state } from './state.js';

class ProfileManager {
  constructor() {
    this._migrationInProgress = false;
  }

  /**
   * Загрузить все профили из localStorage
   * @returns {Object} - Объект с профилями
   */
  loadProfiles() {
    const profiles = getFromStorage(CONFIG.STORAGE_KEYS.PROFILES, {});
    
    // Проверка и миграция данных
    Object.keys(profiles).forEach(name => {
      const profile = profiles[name];
      if (!profile.version || profile.version < CONFIG.SCHEMA_VERSION) {
        profiles[name] = this._migrateProfile(profile, profile.version || 1);
      }
    });
    
    return profiles;
  }

  /**
   * Сохранить все профили в localStorage
   * @param {Object} profiles - Профили для сохранения
   * @returns {boolean} - Успешность сохранения
   */
  saveProfiles(profiles) {
    return saveToStorage(CONFIG.STORAGE_KEYS.PROFILES, profiles);
  }

  /**
   * Миграция профиля к текущей версии схемы
   * @private
   */
  _migrateProfile(profile, fromVersion) {
    const migrated = deepClone(profile);
    
    if (fromVersion < 2) {
      // Миграция v1 -> v2: добавление полей
      migrated.achievements = migrated.achievements || [];
      migrated.totalWords = migrated.totalWords || 0;
      migrated.streak = migrated.streak || 0;
      migrated.lastActive = migrated.lastActive || Date.now();
    }
    
    migrated.version = CONFIG.SCHEMA_VERSION;
    return migrated;
  }

  /**
   * Создать новый профиль
   * @param {string} name - Имя профиля
   * @param {string} level - Начальный уровень (CEFR)
   * @returns {Object|null} - Созданный профиль или null при ошибке
   */
  createProfile(name, level = 'A1') {
    if (!name || typeof name !== 'string') {
      console.error('Invalid profile name');
      return null;
    }

    const profiles = this.loadProfiles();
    
    if (profiles[name]) {
      console.error(`Profile "${name}" already exists`);
      return null;
    }

    const newProfile = {
      id: generateId(),
      name,
      level,
      version: CONFIG.SCHEMA_VERSION,
      createdAt: Date.now(),
      lastActive: Date.now(),
      words: {},           // { wordId: { known: boolean, interval: number, nextReview: timestamp } }
      quizStats: {
        total: 0,
        correct: 0,
        byLevel: {}
      },
      examStats: {
        passed: [],
        bestScores: {}
      },
      achievements: [],
      totalWords: 0,
      streak: 0,
      settings: { ...CONFIG.DEFAULT_SETTINGS }
    };

    profiles[name] = newProfile;
    
    if (this.saveProfiles(profiles)) {
      return newProfile;
    }
    
    return null;
  }

  /**
   * Получить профиль по имени
   * @param {string} name - Имя профиля
   * @returns {Object|null} - Профиль или null
   */
  getProfile(name) {
    const profiles = this.loadProfiles();
    return profiles[name] || null;
  }

  /**
   * Установить активный профиль
   * @param {string} name - Имя профиля
   * @returns {boolean} - Успешность
   */
  setActiveProfile(name) {
    const profile = this.getProfile(name);
    if (!profile) {
      return false;
    }

    // Обновить lastActive
    profile.lastActive = Date.now();
    const profiles = this.loadProfiles();
    profiles[name] = profile;
    this.saveProfiles(profiles);

    // Обновить состояние
    state.setPath('activeProfile', name);
    state.setPath('profiles', profiles);
    
    return true;
  }

  /**
   * Получить активный профиль
   * @returns {Object|null} - Активный профиль
   */
  getActiveProfile() {
    const activeName = state.getPath('activeProfile');
    if (!activeName) return null;
    return this.getProfile(activeName);
  }

  /**
   * Обновить профиль
   * @param {string} name - Имя профиля
   * @param {Object} updates - Поля для обновления
   * @returns {boolean} - Успешность
   */
  updateProfile(name, updates) {
    const profiles = this.loadProfiles();
    if (!profiles[name]) {
      return false;
    }

    profiles[name] = { ...profiles[name], ...updates, lastActive: Date.now() };
    
    if (this.saveProfiles(profiles)) {
      state.setPath('profiles', profiles);
      
      // Если обновляется активный профиль, обновить и его копию в state
      if (name === state.getPath('activeProfile')) {
        // Можно добавить дополнительную логику
      }
      
      return true;
    }
    
    return false;
  }

  /**
   * Удалить профиль
   * @param {string} name - Имя профиля
   * @returns {boolean} - Успешность
   */
  deleteProfile(name) {
    const profiles = this.loadProfiles();
    if (!profiles[name]) {
      return false;
    }

    delete profiles[name];
    
    // Если удаляем активный профиль, сбросить активный
    if (name === state.getPath('activeProfile')) {
      state.setPath('activeProfile', null);
    }
    
    return this.saveProfiles(profiles);
  }

  /**
   * Экспорт профиля в JSON
   * @param {string} name - Имя профиля
   * @returns {string|null} - JSON строка или null
   */
  exportProfile(name) {
    const profile = this.getProfile(name);
    if (!profile) return null;
    
    return JSON.stringify(profile, null, 2);
  }

  /**
   * Импорт профиля из JSON
   * @param {string} jsonString - JSON строка
   * @returns {Object|null} - Импортированный профиль или null
   */
  importProfile(jsonString) {
    try {
      const profile = JSON.parse(jsonString);
      
      if (!profile.name || !profile.id) {
        throw new Error('Invalid profile format');
      }

      const profiles = this.loadProfiles();
      
      // Проверка на конфликт имён
      let finalName = profile.name;
      let counter = 1;
      while (profiles[finalName]) {
        finalName = `${profile.name}_${counter}`;
        counter++;
      }
      
      profile.name = finalName;
      profile.version = CONFIG.SCHEMA_VERSION;
      profiles[finalName] = profile;
      
      if (this.saveProfiles(profiles)) {
        return profile;
      }
      
      return null;
    } catch (e) {
      console.error('Import error:', e);
      return null;
    }
  }

  /**
   * Экспорт всех профилей в CSV
   * @returns {string} - CSV строка
   */
  exportAllToCSV() {
    const profiles = this.loadProfiles();
    const headers = ['Name', 'Level', 'Created', 'Last Active', 'Total Words', 'Streak'];
    const rows = Object.values(profiles).map(p => [
      p.name,
      p.level,
      formatDate(p.createdAt),
      formatDate(p.lastActive),
      p.totalWords || 0,
      p.streak || 0
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  /**
   * Получить список всех профилей
   * @returns {Array} - Массив профилей
   */
  getAllProfiles() {
    const profiles = this.loadProfiles();
    return Object.values(profiles).sort((a, b) => b.lastActive - a.lastActive);
  }
}

const profileManager = new ProfileManager();
export default profileManager;
