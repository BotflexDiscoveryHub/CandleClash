export interface Level {
  levenNumber: number;
  points: number;
  nextLevelPoints: number;
}

export const levels: Level[] = [
  { levenNumber: 1, points: 0, nextLevelPoints: 100 },
  { levenNumber: 2, points: 100, nextLevelPoints: 230 },
  { levenNumber: 3, points: 230, nextLevelPoints: 400 },
  { levenNumber: 4, points: 400, nextLevelPoints: 600 },
  { levenNumber: 5, points: 600, nextLevelPoints: 830 },
  { levenNumber: 6, points: 830, nextLevelPoints: 1100 },
  { levenNumber: 7, points: 1100, nextLevelPoints: 1400 },
  { levenNumber: 8, points: 1400, nextLevelPoints: 1800 },
  { levenNumber: 9, points: 1800, nextLevelPoints: 2300 },
  { levenNumber: 10, points: 2300, nextLevelPoints: 3000 },
];

export function getLevel(points: number): Level | undefined {
  return levels.find(
    (level) => points >= level.points && points < level.nextLevelPoints
  );
}

export function calculateLevel(xp: number): {
  level: number;
  remainingXP: number;
  nextLevelXP: number;
  progressPercent: number;
} {
  let level = 1;
  let xpForNext = 100; // XP для перехода на уровень 2

  // Пока хватает XP для текущего уровня и уровень меньше 20
  while (xp >= xpForNext && level < 20) {
    xp -= xpForNext;
    level++;
    xpForNext = Math.floor(100 * Math.pow(level, 1.5)); // Расчёт XP для следующего уровня
  }

  // Расчет процента прохождения текущего уровня
  const totalXPForLevel = xpForNext; // Всего XP для текущего уровня
  const progressPercent = ((totalXPForLevel - xpForNext + xp) / totalXPForLevel) * 100;

  return {
    level: level,
    remainingXP: xp,
    nextLevelXP: xpForNext,
    progressPercent: Math.floor(progressPercent), // Округляем процент до целого числа
  };
}
