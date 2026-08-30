/**
 * LinguaLand — главный входной файл
 * Экспортирует все модули для использования в приложении
 */

// Конфигурация и утилиты
export { CONFIG } from './config.js';
export * from './utils.js';

// Состояние приложения
export { state, AppState } from './state.js';

// Модули
export { default as profileManager } from './modules/profiles.js';
export { default as cardManager } from './modules/cards.js';
export { default as quizManager } from './modules/quiz.js';
export { default as examManager } from './modules/exam.js';
export { default as practiceManager } from './modules/practice.js';
export { default as achievementManager } from './modules/achievements.js';
export { default as uiManager } from './modules/ui.js';

// Главное приложение
export { app, App } from './app.js';

// Данные
export { words, getWordsByLevel, getAllWords, getWordsByCategory, findWordById } from '../data/words.js';
