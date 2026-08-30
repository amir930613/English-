/**
 * Данные: слова английского языка по уровням CEFR
 * Формат: Array of { id, en, ru, ex, level, category }
 */

export const words = {
  A0: [
    { id: 'a0_1', en: 'hello', ru: 'привет', ex: 'Hello! How are you?', level: 'A0', category: 'greeting' },
    { id: 'a0_2', en: 'goodbye', ru: 'до свидания', ex: 'Goodbye! See you later.', level: 'A0', category: 'greeting' },
    { id: 'a0_3', en: 'yes', ru: 'да', ex: 'Yes, I agree.', level: 'A0', category: 'basic' },
    { id: 'a0_4', en: 'no', ru: 'нет', ex: 'No, thank you.', level: 'A0', category: 'basic' },
    { id: 'a0_5', en: 'please', ru: 'пожалуйста', ex: 'Please help me.', level: 'A0', category: 'polite' },
    { id: 'a0_6', en: 'thank you', ru: 'спасибо', ex: 'Thank you very much!', level: 'A0', category: 'polite' },
    { id: 'a0_7', en: 'sorry', ru: 'извините', ex: 'Sorry, I am late.', level: 'A0', category: 'polite' },
    { id: 'a0_8', en: 'name', ru: 'имя', ex: 'What is your name?', level: 'A0', category: 'personal' },
    { id: 'a0_9', en: 'friend', ru: 'друг', ex: 'She is my friend.', level: 'A0', category: 'personal' },
    { id: 'a0_10', en: 'house', ru: 'дом', ex: 'This is my house.', level: 'A0', category: 'place' }
  ],
  
  A1: [
    { id: 'a1_1', en: 'family', ru: 'семья', ex: 'I have a big family.', level: 'A1', category: 'personal' },
    { id: 'a1_2', en: 'work', ru: 'работа', ex: 'Where do you work?', level: 'A1', category: 'daily' },
    { id: 'a1_3', en: 'study', ru: 'учиться', ex: 'I study English every day.', level: 'A1', category: 'education' },
    { id: 'a1_4', en: 'like', ru: 'нравиться', ex: 'I like coffee.', level: 'A1', category: 'emotion' },
    { id: 'a1_5', en: 'want', ru: 'хотеть', ex: 'What do you want?', level: 'A1', category: 'emotion' },
    { id: 'a1_6', en: 'need', ru: 'нуждаться', ex: 'I need some water.', level: 'A1', category: 'basic' },
    { id: 'a1_7', en: 'have', ru: 'иметь', ex: 'I have a car.', level: 'A1', category: 'basic' },
    { id: 'a1_8', en: 'go', ru: 'идти', ex: 'Let us go home.', level: 'A1', category: 'movement' },
    { id: 'a1_9', en: 'come', ru: 'приходить', ex: 'Come here please.', level: 'A1', category: 'movement' },
    { id: 'a1_10', en: 'see', ru: 'видеть', ex: 'I see a bird.', level: 'A1', category: 'senses' }
  ],
  
  A2: [
    { id: 'a2_1', en: 'decide', ru: 'решать', ex: 'I decided to go.', level: 'A2', category: 'thinking' },
    { id: 'a2_2', en: 'explain', ru: 'объяснять', ex: 'Can you explain this?', level: 'A2', category: 'communication' },
    { id: 'a2_3', en: 'remember', ru: 'помнить', ex: 'I remember that day.', level: 'A2', category: 'memory' },
    { id: 'a2_4', en: 'forget', ru: 'забывать', ex: 'Do not forget your keys.', level: 'A2', category: 'memory' },
    { id: 'a2_5', en: 'understand', ru: 'понимать', ex: 'I understand now.', level: 'A2', category: 'thinking' },
    { id: 'a2_6', en: 'believe', ru: 'верить', ex: 'I believe in you.', level: 'A2', category: 'emotion' },
    { id: 'a2_7', en: 'happen', ru: 'случаться', ex: 'What happened?', level: 'A2', category: 'events' },
    { id: 'a2_8', en: 'seem', ru: 'казаться', ex: 'It seems strange.', level: 'A2', category: 'perception' },
    { id: 'a2_9', en: 'become', ru: 'становиться', ex: 'He became famous.', level: 'A2', category: 'change' },
    { id: 'a2_10', en: 'start', ru: 'начинать', ex: 'Let us start now.', level: 'A2', category: 'action' }
  ],
  
  B1: [
    { id: 'b1_1', en: 'achieve', ru: 'достигать', ex: 'She achieved her goal.', level: 'B1', category: 'success' },
    { id: 'b1_2', en: 'consider', ru: 'рассматривать', ex: 'I will consider your offer.', level: 'B1', category: 'thinking' },
    { id: 'b1_3', en: 'develop', ru: 'развивать', ex: 'We need to develop new skills.', level: 'B1', category: 'growth' },
    { id: 'b1_4', en: 'require', ru: 'требовать', ex: 'This job requires patience.', level: 'B1', category: 'necessity' },
    { id: 'b1_5', en: 'provide', ru: 'предоставлять', ex: 'The hotel provides breakfast.', level: 'B1', category: 'service' },
    { id: 'b1_6', en: 'suggest', ru: 'предлагать', ex: 'I suggest we leave early.', level: 'B1', category: 'communication' },
    { id: 'b1_7', en: 'support', ru: 'поддерживать', ex: 'They support the team.', level: 'B1', category: 'help' },
    { id: 'b1_8', en: 'expect', ru: 'ожидать', ex: 'I expect good results.', level: 'B1', category: 'expectation' },
    { id: 'b1_9', en: 'recognize', ru: 'узнавать', ex: 'I recognized her voice.', level: 'B1', category: 'perception' },
    { id: 'b1_10', en: 'improve', ru: 'улучшать', ex: 'Practice improves skills.', level: 'B1', category: 'growth' }
  ],
  
  B2: [
    { id: 'b2_1', en: 'analyze', ru: 'анализировать', ex: 'We need to analyze the data.', level: 'B2', category: 'thinking' },
    { id: 'b2_2', en: 'evaluate', ru: 'оценивать', ex: 'Evaluate the situation carefully.', level: 'B2', category: 'assessment' },
    { id: 'b2_3', en: 'demonstrate', ru: 'демонстрировать', ex: 'He demonstrated his abilities.', level: 'B2', category: 'showing' },
    { id: 'b2_4', en: 'investigate', ru: 'исследовать', ex: 'Police are investigating the case.', level: 'B2', category: 'research' },
    { id: 'b2_5', en: 'participate', ru: 'участвовать', ex: 'Everyone can participate.', level: 'B2', category: 'involvement' },
    { id: 'b2_6', en: 'contribute', ru: 'вносить вклад', ex: 'She contributed to the project.', level: 'B2', category: 'cooperation' },
    { id: 'b2_7', en: 'indicate', ru: 'указывать', ex: 'The sign indicates danger.', level: 'B2', category: 'showing' },
    { id: 'b2_8', en: 'maintain', ru: 'поддерживать', ex: 'Maintain a healthy lifestyle.', level: 'B2', category: 'preservation' },
    { id: 'b2_9', en: 'establish', ru: 'устанавливать', ex: 'They established a new company.', level: 'B2', category: 'creation' },
    { id: 'b2_10', en: 'accumulate', ru: 'накапливать', ex: 'Knowledge accumulates over time.', level: 'B2', category: 'collection' }
  ],
  
  C1: [
    { id: 'c1_1', en: 'comprehensive', ru: 'всеобъемлющий', ex: 'We need a comprehensive approach.', level: 'C1', category: 'description' },
    { id: 'c1_2', en: 'simultaneous', ru: 'одновременный', ex: 'Simultaneous translation is available.', level: 'C1', category: 'time' },
    { id: 'c1_3', en: 'inevitable', ru: 'неизбежный', ex: 'Change is inevitable.', level: 'C1', category: 'certainty' },
    { id: 'c1_4', en: 'substantial', ru: 'существенный', ex: 'There was substantial progress.', level: 'C1', category: 'quantity' },
    { id: 'c1_5', en: 'controversial', ru: 'спорный', ex: 'This is a controversial topic.', level: 'C1', category: 'opinion' },
    { id: 'c1_6', en: 'sophisticated', ru: 'сложный', ex: 'Sophisticated technology is used here.', level: 'C1', category: 'complexity' },
    { id: 'c1_7', en: 'unprecedented', ru: 'беспрецедентный', ex: 'An unprecedented event occurred.', level: 'C1', category: 'rarity' },
    { id: 'c1_8', en: 'homogeneous', ru: 'однородный', ex: 'The group is quite homogeneous.', level: 'C1', category: 'similarity' },
    { id: 'c1_9', en: 'spontaneous', ru: 'спонтанный', ex: 'A spontaneous decision.', level: 'C1', category: 'behavior' },
    { id: 'c1_10', en: 'meticulous', ru: 'педантичный', ex: 'Meticulous attention to detail.', level: 'C1', category: 'precision' }
  ],
  
  C2: [
    { id: 'c2_1', en: 'ubiquitous', ru: 'вездесущий', ex: 'Smartphones are ubiquitous nowadays.', level: 'C2', category: 'presence' },
    { id: 'c2_2', en: 'ephemeral', ru: 'эфемерный', ex: 'Ephemeral beauty of cherry blossoms.', level: 'C2', category: 'time' },
    { id: 'c2_3', en: 'perspicacious', ru: 'проницательный', ex: 'A perspicacious observer.', level: 'C2', category: 'intelligence' },
    { id: 'c2_4', en: 'serendipity', ru: 'интуитивная догадка', ex: 'It was pure serendipity.', level: 'C2', category: 'luck' },
    { id: 'c2_5', en: 'quintessential', ru: 'квинтэссенция', ex: 'The quintessential example.', level: 'C2', category: 'essence' },
    { id: 'c2_6', en: 'ameliorate', ru: 'улучшать', ex: 'Efforts to ameliorate poverty.', level: 'C2', category: 'improvement' },
    { id: 'c2_7', en: 'obfuscate', ru: 'запутывать', ex: 'Do not obfuscate the issue.', level: 'C2', category: 'confusion' },
    { id: 'c2_8', en: 'parsimonious', ru: 'бережливый', ex: 'A parsimonious approach to spending.', level: 'C2', category: 'economy' },
    { id: 'c2_9', en: 'sycophant', ru: 'подхалим', ex: 'He is just a sycophant.', level: 'C2', category: 'personality' },
    { id: 'c2_10', en: 'verisimilitude', ru: 'правдоподобие', ex: 'The story lacks verisimilitude.', level: 'C2', category: 'truth' }
  ]
};

/**
 * Получить все слова для уровня
 * @param {string} level - Уровень CEFR
 * @returns {Array} - Массив слов
 */
export function getWordsByLevel(level) {
  return words[level] || [];
}

/**
 * Получить все слова
 * @returns {Array} - Все слова
 */
export function getAllWords() {
  return Object.values(words).flat();
}

/**
 * Получить слова по категории
 * @param {string} category - Категория
 * @returns {Array} - Массив слов
 */
export function getWordsByCategory(category) {
  return getAllWords().filter(w => w.category === category);
}

/**
 * Найти слово по ID
 * @param {string} id - ID слова
 * @returns {Object|undefined} - Слово или undefined
 */
export function findWordById(id) {
  return getAllWords().find(w => w.id === id);
}

export default words;
