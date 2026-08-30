/**
 * Модуль экзаменов (Exam)
 */
import { CONFIG } from '../config.js';
import { state } from '../state.js';

class ExamManager {
  constructor() {
    this._cleanupFns = [];
  }

  /**
   * Инициализировать экзамен
   * @param {string} level - Уровень CEFR
   * @param {Array} questions - Вопросы
   * @param {number} timeLimit - Лимит времени в секундах
   * @returns {Object} - Состояние экзамена
   */
  initExam(level = 'A1', questions = [], timeLimit = 300) {
    const examState = {
      level,
      questions,
      currentIndex: 0,
      answers: {},
      timer: null,
      timeLeft: timeLimit,
      isCompleted: false
    };

    state.setPath('exam', examState);

    // Запустить таймер
    this._startTimer(timeLimit);

    return examState;
  }

  /**
   * Запустить таймер
   * @private
   */
  _startTimer(seconds) {
    // Очистить предыдущий таймер
    this._stopTimer();

    const interval = setInterval(() => {
      const exam = state.getState().exam;
      
      if (exam.timeLeft > 0) {
        state.setPath('exam.timeLeft', exam.timeLeft - 1, false);
      } else {
        // Время вышло
        this._stopTimer();
        this.completeExam();
      }
    }, 1000);

    state.setPath('exam.timer', interval, false);
  }

  /**
   * Остановить таймер
   * @private
   */
  _stopTimer() {
    const exam = state.getState().exam;
    if (exam.timer) {
      clearInterval(exam.timer);
      state.setPath('exam.timer', null, false);
    }
  }

  /**
   * Ответить на вопрос экзамена
   * @param {string} questionId - ID вопроса
   * @param {*} answer - Ответ
   * @returns {boolean} - Успешность
   */
  answerQuestion(questionId, answer) {
    const exam = state.getState().exam;
    
    if (exam.isCompleted) {
      return false;
    }

    exam.answers[questionId] = {
      answer,
      timestamp: Date.now()
    };

    // Перейти к следующему вопросу
    if (exam.currentIndex < exam.questions.length - 1) {
      exam.currentIndex++;
    }

    state.setPath('exam', exam);
    return true;
  }

  /**
   * Пропустить вопрос
   * @returns {Object|null} - Следующий вопрос
   */
  skipQuestion() {
    const exam = state.getState().exam;

    if (exam.currentIndex < exam.questions.length - 1) {
      exam.currentIndex++;
      state.setPath('exam', exam);
      return this.getCurrentQuestion();
    }

    return null;
  }

  /**
   * Вернуться к предыдущему вопросу
   * @returns {Object|null} - Предыдущий вопрос
   */
  prevQuestion() {
    const exam = state.getState().exam;

    if (exam.currentIndex > 0) {
      exam.currentIndex--;
      state.setPath('exam', exam);
      return this.getCurrentQuestion();
    }

    return null;
  }

  /**
   * Получить текущий вопрос
   * @returns {Object|null} - Вопрос или null
   */
  getCurrentQuestion() {
    const questions = state.getPath('exam.questions');
    const index = state.getPath('exam.currentIndex');

    if (!questions || index >= questions.length) {
      return null;
    }

    return questions[index];
  }

  /**
   * Завершить экзамен досрочно
   * @returns {Object} - Результаты
   */
  completeExam() {
    const exam = state.getState().exam;
    
    this._stopTimer();
    exam.isCompleted = true;
    state.setPath('exam', exam);

    return this.getResults();
  }

  /**
   * Получить результаты экзамена
   * @returns {Object} - Результаты
   */
  getResults() {
    const exam = state.getState().exam;
    const total = exam.questions.length;
    
    // Подсчёт правильных ответов (нужно передать правильные ответы)
    let correct = 0;
    exam.questions.forEach(q => {
      const userAnswer = exam.answers[q.id];
      if (userAnswer && userAnswer.answer === q.correctAnswer) {
        correct++;
      }
    });

    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = percentage >= 70; // 70% для прохождения

    return {
      level: exam.level,
      total,
      correct,
      incorrect: total - correct,
      percentage,
      passed,
      timeSpent: exam.timeLeft,
      answers: exam.answers,
      timestamp: Date.now()
    };
  }

  /**
   * Сбросить экзамен
   */
  resetExam() {
    this._stopTimer();
    state.setPath('exam', {
      level: 'A1',
      questions: [],
      currentIndex: 0,
      answers: {},
      timer: null,
      timeLeft: 0,
      isCompleted: false
    });
  }

  /**
   * Сгенерировать вопросы для экзамена
   * @param {string} level - Уровень
   * @param {Array} words - Слова
   * @param {number} count - Количество
   * @returns {Array} - Вопросы
   */
  generateQuestions(level, words, count = 20) {
    if (!words || words.length === 0) {
      return [];
    }

    const questions = [];
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    selected.forEach((word, idx) => {
      // Генерация вариантов ответов
      const wrongAnswers = words
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.ru);

      const options = [word.ru, ...wrongAnswers].sort(() => Math.random() - 0.5);

      questions.push({
        id: `exam_${level}_${idx}_${Date.now()}`,
        wordId: word.id,
        question: word.en,
        correctAnswer: word.ru,
        options,
        level,
        category: word.category,
        example: word.ex
      });
    });

    return questions;
  }

  /**
   * Очистить ресурсы
   */
  cleanup() {
    this._stopTimer();
    this._cleanupFns.forEach(fn => fn());
    this._cleanupFns = [];
  }

  /**
   * Подписаться на изменения состояния экзамена
   * @param {Function} callback - Callback
   * @returns {Function} - Функция отписки
   */
  subscribe(callback) {
    const unsubscribe = state.subscribe('exam', callback);
    this._cleanupFns.push(unsubscribe);
    return unsubscribe;
  }
}

const examManager = new ExamManager();
export default examManager;
