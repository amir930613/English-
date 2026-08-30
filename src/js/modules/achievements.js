/**
 * Модуль достижений (Achievements)
 */
import { state } from '../state.js';

class AchievementManager {
  constructor() {
    // Список всех возможных достижений
    this._achievements = [
      {
        id: 'first_word',
        name: 'Первое слово',
        description: 'Выучите своё первое слово',
        icon: '🌟',
        condition: (profile) => profile.totalWords >= 1
      },
      {
        id: 'word_10',
        name: 'Десять слов',
        description: 'Выучите 10 слов',
        icon: '🎯',
        condition: (profile) => profile.totalWords >= 10
      },
      {
        id: 'word_50',
        name: 'Пятьдесят слов',
        description: 'Выучите 50 слов',
        icon: '🏆',
        condition: (profile) => profile.totalWords >= 50
      },
      {
        id: 'word_100',
        name: 'Сто слов',
        description: 'Выучите 100 слов',
        icon: '👑',
        condition: (profile) => profile.totalWords >= 100
      },
      {
        id: 'streak_3',
        name: 'Три дня подряд',
        description: 'Занимайтесь 3 дня подряд',
        icon: '🔥',
        condition: (profile) => profile.streak >= 3
      },
      {
        id: 'streak_7',
        name: 'Неделя подряд',
        description: 'Занимайтесь 7 дней подряд',
        icon: '💪',
        condition: (profile) => profile.streak >= 7
      },
      {
        id: 'streak_30',
        name: 'Месяц подряд',
        description: 'Занимайтесь 30 дней подряд',
        icon: '⚡',
        condition: (profile) => profile.streak >= 30
      },
      {
        id: 'quiz_master',
        name: 'Мастер викторин',
        description: 'Пройдите 10 викторин с результатом 90%+',
        icon: '🧠',
        condition: (profile) => {
          const quizStats = profile.quizStats?.byLevel || {};
          return Object.values(quizStats).some(s => s.perfect >= 10);
        }
      },
      {
        id: 'exam_a1',
        name: 'Экзамен A1',
        description: 'Сдайте экзамен уровня A1',
        icon: '📜',
        condition: (profile) => {
          const exams = profile.examStats?.passed || [];
          return exams.includes('A1');
        }
      },
      {
        id: 'exam_b2',
        name: 'Экзамен B2',
        description: 'Сдайте экзамен уровня B2',
        icon: '🎓',
        condition: (profile) => {
          const exams = profile.examStats?.passed || [];
          return exams.includes('B2');
        }
      },
      {
        id: 'exam_c2',
        name: 'Экзамен C2',
        description: 'Сдайте экзамен уровня C2',
        icon: '🏅',
        condition: (profile) => {
          const exams = profile.examStats?.passed || [];
          return exams.includes('C2');
        }
      },
      {
        id: 'polyglot',
        name: 'Полиглот',
        description: 'Изучите слова всех уровней',
        icon: '🌍',
        condition: (profile) => {
          const levels = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
          return levels.every(l => profile.wordsByLevel?.[l] > 0);
        }
      },
      {
        id: 'night_owl',
        name: 'Сова',
        description: 'Занимайтесь после полуночи',
        icon: '🦉',
        condition: (profile) => {
          const lastActive = new Date(profile.lastActive);
          const hour = lastActive.getHours();
          return hour >= 0 && hour < 5;
        }
      },
      {
        id: 'early_bird',
        name: 'Жаворонок',
        description: 'Занимайтесь до 6 утра',
        icon: '🐦',
        condition: (profile) => {
          const lastActive = new Date(profile.lastActive);
          const hour = lastActive.getHours();
          return hour >= 5 && hour < 6;
        }
      }
    ];
  }

  /**
   * Проверить и выдать достижения для профиля
   * @param {Object} profile - Профиль пользователя
   * @returns {Array} - Новые полученные достижения
   */
  checkAchievements(profile) {
    if (!profile) return [];

    const earnedIds = new Set(profile.achievements?.map(a => a.id) || []);
    const newAchievements = [];

    this._achievements.forEach(achievement => {
      if (!earnedIds.has(achievement.id)) {
        try {
          if (achievement.condition(profile)) {
            newAchievements.push({
              ...achievement,
              earnedAt: Date.now()
            });
          }
        } catch (e) {
          console.error(`Error checking achievement ${achievement.id}:`, e);
        }
      }
    });

    return newAchievements;
  }

  /**
   * Добавить достижения в профиль
   * @param {string} profileName - Имя профиля
   * @param {Array} newAchievements - Новые достижения
   * @returns {boolean} - Успешность
   */
  addAchievements(profileName, newAchievements) {
    if (!profileName || !newAchievements || newAchievements.length === 0) {
      return false;
    }

    // Логика обновления профиля будет вызвана извне
    // через profileManager.updateProfile
    console.log(`Adding ${newAchievements.length} achievements to ${profileName}`);
    return true;
  }

  /**
   * Получить все доступные достижения
   * @returns {Array} - Все достижения
   */
  getAllAchievements() {
    return this._achievements;
  }

  /**
   * Получить достижение по ID
   * @param {string} id - ID достижения
   * @returns {Object|undefined} - Достижение или undefined
   */
  getAchievementById(id) {
    return this._achievements.find(a => a.id === id);
  }

  /**
   * Получить прогресс достижений профиля
   * @param {Object} profile - Профиль
   * @returns {Object} - Прогресс
   */
  getProgress(profile) {
    const earnedIds = new Set(profile.achievements?.map(a => a.id) || []);
    const total = this._achievements.length;
    const earned = earnedIds.size;
    const percentage = Math.round((earned / total) * 100);

    return {
      total,
      earned,
      remaining: total - earned,
      percentage,
      earnedIds: Array.from(earnedIds),
      remainingIds: this._achievements
        .filter(a => !earnedIds.has(a.id))
        .map(a => a.id)
    };
  }

  /**
   * Сбросить достижения профиля (для тестирования)
   * @param {string} profileName - Имя профиля
   * @returns {boolean} - Успешность
   */
  resetAchievements(profileName) {
    // Логика сброса будет вызвана извне
    console.log(`Resetting achievements for ${profileName}`);
    return true;
  }
}

const achievementManager = new AchievementManager();
export default achievementManager;
