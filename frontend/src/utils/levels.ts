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
