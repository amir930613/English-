/**
 * Модуль викторины (Quiz)
 */
import { CONFIG } from '../config.js';
import { state } from '../state.js';

class QuizManager {
  constructor() {
    this._cleanupFns = [];
  }

  /**
   * Инициализировать викторину
   * @param {Array} questions - Вопросы
   * @returns {Object} - Состояние викторины
   */
  initQuiz(questions = []) {
    const quizState = {
      questions,
      currentIndex: 0,
      score: 0,
      answers: []
    };

    state.setPath('quiz', quizState);
    return quizState;
  }

  /**
   * Получить текущий вопрос
   * @returns {Object|null} - Вопрос или null
   */
  getCurrentQuestion() {
    const questions = state.getPath('quiz.questions');
    const index = state.getPath('quiz.currentIndex');

    if (!questions || index >= questions.length) {
      return null;
    }

    return questions[index];
  }

  /**
   * Ответить на вопрос
   * @param {*} answer - Ответ пользователя
   * @param {boolean} isCorrect - Правильность ответа
   * @returns {Object} - Результат ответа
   */
  answerQuestion(answer, isCorrect) {
    const quiz = state.getState().quiz;
    const currentQuestion = this.getCurrentQuestion();

    // Записать ответ
    quiz.answers.push({
      questionId: currentQuestion?.id,
      answer,
      isCorrect,
      timestamp: Date.now()
    });

    // Обновить счёт
    if (isCorrect) {
      quiz.score++;
    }

    // Перейти к следующему вопросу
    if (quiz.currentIndex < quiz.questions.length - 1) {
      quiz.currentIndex++;
    }

    state.setPath('quiz', quiz);

    return {
      isCorrect,
      score: quiz.score,
      total: quiz.questions.length,
      isLast: quiz.currentIndex === quiz.questions.length - 1
    };
  }

  /**
   * Пропустить вопрос
   * @returns {Object|null} - Следующий вопрос
   */
  skipQuestion() {
    const quiz = state.getState().quiz;

    if (quiz.currentIndex < quiz.questions.length - 1) {
      quiz.currentIndex++;
      state.setPath('quiz', quiz);
      return this.getCurrentQuestion();
    }

    return null;
  }

  /**
   * Получить результаты викторины
   * @returns {Object} - Результаты
   */
  getResults() {
    const quiz = state.getState().quiz;
    const total = quiz.questions.length;
    const correct = quiz.score;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      total,
      correct,
      incorrect: total - correct,
      percentage,
      answers: quiz.answers
    };
  }

  /**
   * Сбросить викторину
   */
  resetQuiz() {
    state.setPath('quiz', {
      questions: [],
      currentIndex: 0,
      score: 0,
      answers: []
    });
  }

  /**
   * Сгенерировать вопросы для уровня
   * @param {string} level - Уровень CEFR
   * @param {Array} words - Слова для генерации
   * @param {number} count - Количество вопросов
   * @returns {Array} - Вопросы
   */
  generateQuestions(level, words, count = 10) {
    if (!words || words.length === 0) {
      return [];
    }

    const questions = [];
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    selected.forEach(word => {
      // Генерация вариантов ответов
      const wrongAnswers = words
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.ru);

      const options = [word.ru, ...wrongAnswers].sort(() => Math.random() - 0.5);

      questions.push({
        id: `q_${word.id}_${Date.now()}`,
        wordId: word.id,
        question: word.en,
        correctAnswer: word.ru,
        options,
        level,
        category: word.category
      });
    });

    return questions;
  }

  /**
   * Очистить ресурсы
   */
  cleanup() {
    this._cleanupFns.forEach(fn => fn());
    this._cleanupFns = [];
  }

  /**
   * Подписаться на изменения состояния викторины
   * @param {Function} callback - Callback
   * @returns {Function} - Функция отписки
   */
  subscribe(callback) {
    const unsubscribe = state.subscribe('quiz', callback);
    this._cleanupFns.push(unsubscribe);
    return unsubscribe;
  }
}

const quizManager = new QuizManager();
export default quizManager;
