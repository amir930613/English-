// LinguaLand Configuration
export const CONFIG = {
  // Версия схемы данных
  SCHEMA_VERSION: 2,
  
  // Ключи localStorage
  STORAGE_KEYS: {
    PROFILES: 'eng_profiles_v2',
    SETTINGS: 'eng_settings',
    THEME: 'eng_theme'
  },
  
  // Тайминги (мс)
  TIMINGS: {
    CARD_FLIP_DELAY: 1400,
    QUIZ_FEEDBACK_DELAY: 1200,
    EXAM_STEP_DELAY: 1100,
    TOAST_AUTO_CLOSE: 4000,
    SAVE_ERROR_TIMEOUT: 15000,
    DEBOUNCE_DELAY: 300
  },
  
  // Пороги для свайпов
  SWIPE_THRESHOLD: 60,
  
  // SRS интервалы (в днях)
  SRS_INTERVALS: [1, 3, 7, 14, 30, 60, 90],
  
  // Уровни CEFR
  CEFR_LEVELS: ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  
  // Настройки по умолчанию
  DEFAULT_SETTINGS: {
    audioMode: false,
    darkTheme: true,
    notifications: true
  }
};

export default CONFIG;
