/**
 * Модуль практики перевода (Practice)
 */
import { state } from '../state.js';

class PracticeManager {
  constructor() {
    this._cleanupFns = [];
  }

  /**
   * Инициализировать практику
   * @param {Array} sentences - Предложения для перевода
   * @returns {Object} - Состояние практики
   */
  initPractice(sentences = []) {
    const practiceState = {
      sentences,
      currentIndex: 0,
      mistakes: [],
      completed: []
    };

    state.setPath('practice', practiceState);
    return practiceState;
  }

  /**
   * Получить текущее предложение
   * @returns {Object|null} - Предложение или null
   */
  getCurrentSentence() {
    const sentences = state.getPath('practice.sentences');
    const index = state.getPath('practice.currentIndex');

    if (!sentences || index >= sentences.length) {
      return null;
    }

    return sentences[index];
  }

  /**
   * Проверить перевод пользователя
   * @param {string} userTranslation - Перевод пользователя
   * @param {string} correctTranslation - Правильный перевод
   * @returns {Object} - Результат проверки
   */
  checkTranslation(userTranslation, correctTranslation) {
    const practice = state.getState().practice;
    const current = this.getCurrentSentence();

    // Нормализация текста (удаление лишних пробелов, приведение к нижнему регистру)
    const normalize = (text) => {
      return text.toLowerCase().trim().replace(/\s+/g, ' ');
    };

    const isCorrect = normalize(userTranslation) === normalize(correctTranslation);

    if (!isCorrect) {
      // Записать ошибку
      practice.mistakes.push({
        sentenceId: current.id,
        userAnswer: userTranslation,
        correctAnswer: correctTranslation,
        timestamp: Date.now()
      });
    } else {
      // Записать успешное выполнение
      practice.completed.push({
        sentenceId: current.id,
        timestamp: Date.now()
      });
    }

    // Перейти к следующему предложению
    if (practice.currentIndex < practice.sentences.length - 1) {
      practice.currentIndex++;
    }

    state.setPath('practice', practice);

    return {
      isCorrect,
      correctAnswer: correctTranslation,
      total: practice.sentences.length,
      completed: practice.completed.length,
      mistakes: practice.mistakes.length
    };
  }

  /**
   * Пропустить предложение
   * @returns {Object|null} - Следующее предложение
   */
  skipSentence() {
    const practice = state.getState().practice;

    if (practice.currentIndex < practice.sentences.length - 1) {
      practice.currentIndex++;
      state.setPath('practice', practice);
      return this.getCurrentSentence();
    }

    return null;
  }

  /**
   * Вернуться к предыдущему предложению
   * @returns {Object|null} - Предыдущее предложение
   */
  prevSentence() {
    const practice = state.getState().practice;

    if (practice.currentIndex > 0) {
      practice.currentIndex--;
      state.setPath('practice', practice);
      return this.getCurrentSentence();
    }

    return null;
  }

  /**
   * Получить статистику практики
   * @returns {Object} - Статистика
   */
  getStats() {
    const practice = state.getState().practice;
    const total = practice.sentences.length;
    const completed = practice.completed.length;
    const mistakes = practice.mistakes.length;
    const accuracy = total > 0 
      ? Math.round(((completed - mistakes) / total) * 100) 
      : 0;

    return {
      total,
      completed,
      mistakes,
      remaining: total - practice.currentIndex - 1,
      accuracy: Math.max(0, accuracy),
      mistakeDetails: practice.mistakes
    };
  }

  /**
   * Сбросить практику
   */
  resetPractice() {
    state.setPath('practice', {
      sentences: [],
      currentIndex: 0,
      mistakes: [],
      completed: []
    });
  }

  /**
   * Повратить только ошибки
   * @returns {Array} - Предложения с ошибками
   */
  getMistakeSentences() {
    const practice = state.getState().practice;
    const mistakeIds = new Set(practice.mistakes.map(m => m.sentenceId));
    
    return practice.sentences.filter(s => mistakeIds.has(s.id));
  }

  /**
   * Очистить ресурсы
   */
  cleanup() {
    this._cleanupFns.forEach(fn => fn());
    this._cleanupFns = [];
  }

  /**
   * Подписаться на изменения состояния практики
   * @param {Function} callback - Callback
   * @returns {Function} - Функция отписки
   */
  subscribe(callback) {
    const unsubscribe = state.subscribe('practice', callback);
    this._cleanupFns.push(unsubscribe);
    return unsubscribe;
  }
}

const practiceManager = new PracticeManager();
export default practiceManager;
