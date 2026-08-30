/**
 * Модуль работы с карточками и SRS (Spaced Repetition System)
 */
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { isSpeechSupported } from '../utils.js';

class CardManager {
  constructor() {
    this._cleanupFns = [];
  }

  /**
   * Инициализировать колоду для текущего профиля
   * @param {string} level - Уровень CEFR
   * @returns {Array} - Колода карточек
   */
  initDeck(level = 'A1') {
    // Здесь будет логика загрузки слов из data
    // Для примера создаём пустую колоду
    const deck = this._generateDeckForLevel(level);
    
    state.setPath('cards.deck', deck);
    state.setPath('cards.currentIndex', 0);
    state.setPath('cards.stats', { known: 0, notKnown: 0 });
    
    return deck;
  }

  /**
   * Сгенерировать колоду для уровня (заглушка, будет заменено на реальные данные)
   * @private
   */
  _generateDeckForLevel(level) {
    // В реальной реализации загрузка из src/data/words.js
    return [];
  }

  /**
   * Получить текущую карточку
   * @returns {Object|null} - Текущая карточка
   */
  getCurrentCard() {
    const deck = state.getPath('cards.deck');
    const index = state.getPath('cards.currentIndex');
    
    if (!deck || index >= deck.length) {
      return null;
    }
    
    return deck[index];
  }

  /**
   * Перейти к следующей карточке
   * @returns {Object|null} - Новая текущая карточка
   */
  nextCard() {
    const deck = state.getPath('cards.deck');
    let index = state.getPath('cards.currentIndex');
    
    if (index < deck.length - 1) {
      index++;
      state.setPath('cards.currentIndex', index);
      return deck[index];
    }
    
    return null;
  }

  /**
   * Перейти к предыдущей карточке
   * @returns {Object|null} - Новая текущая карточка
   */
  prevCard() {
    let index = state.getPath('cards.currentIndex');
    
    if (index > 0) {
      index--;
      state.setPath('cards.currentIndex', index);
      const deck = state.getPath('cards.deck');
      return deck[index];
    }
    
    return null;
  }

  /**
   * Отметить карточку как известную
   * @param {Object} card - Карточка
   * @returns {boolean} - Успешность
   */
  markKnown(card) {
    const stats = state.getPath('cards.stats');
    stats.known++;
    state.setPath('cards.stats', stats);
    
    // Обновить SRS интервал для слова
    this._updateSRS(card.id, true);
    
    return true;
  }

  /**
   * Отметить карточку как неизвестную
   * @param {Object} card - Карточка
   * @returns {boolean} - Успешность
   */
  markNotKnown(card) {
    const stats = state.getPath('cards.stats');
    stats.notKnown++;
    state.setPath('cards.stats', stats);
    
    // Сбросить SRS интервал для слова
    this._updateSRS(card.id, false);
    
    return true;
  }

  /**
   * Обновить SRS интервал для слова
   * @private
   */
  _updateSRS(wordId, known) {
    const profile = state.getPath('activeProfile');
    if (!profile) return;
    
    // Логика SRS будет реализована при интеграции с profiles module
    const now = Date.now();
    const intervals = CONFIG.SRS_INTERVALS;
    
    // Заглушка для будущей реализации
    console.log(`SRS update for ${wordId}: known=${known}`);
  }

  /**
   * Воспроизвести аудио для текста
   * @param {string} text - Текст для произношения
   * @param {string} accent - Акцент ('en-US', 'en-GB')
   * @returns {boolean} - Успешность воспроизведения
   */
  speak(text, accent = 'en-US') {
    if (!isSpeechSupported()) {
      console.warn('Speech synthesis not supported');
      return false;
    }

    try {
      // Отменить предыдущее воспроизведение
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = accent;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.error('Speech error:', e);
      return false;
    }
  }

  /**
   * Переключить режим аудио
   * @returns {boolean} - Новое состояние
   */
  toggleAudioMode() {
    const current = state.getPath('ui.audioMode');
    state.setPath('ui.audioMode', !current);
    return !current;
  }

  /**
   * Перевернуть карточку (показать ответ)
   * @returns {boolean} - Новое состояние
   */
  revealCard() {
    state.setPath('ui.revealed', true);
    return true;
  }

  /**
   * Скрыть ответ карточки
   * @returns {boolean} - Новое состояние
   */
  hideCard() {
    state.setPath('ui.revealed', false);
    return true;
  }

  /**
   * Сбросить статистику колоды
   */
  resetStats() {
    state.setPath('cards.stats', { known: 0, notKnown: 0 });
    state.setPath('cards.currentIndex', 0);
  }

  /**
   * Очистить ресурсы
   */
  cleanup() {
    this._cleanupFns.forEach(fn => fn());
    this._cleanupFns = [];
    
    // Остановить аудио
    if (isSpeechSupported()) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Подписаться на изменения состояния карточек
   * @param {Function} callback - Callback при изменении
   * @returns {Function} - Функция отписки
   */
  subscribe(callback) {
    const unsubscribe = state.subscribe('cards', callback);
    this._cleanupFns.push(unsubscribe);
    return unsubscribe;
  }
}

const cardManager = new CardManager();
export default cardManager;
