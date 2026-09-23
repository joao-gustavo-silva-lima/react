import type { Routine } from "../types/routines.types";
import { getLocalDateISO } from "./date-conversion.utils";

const heatLevelColors = new Map<number, string>([
  [0, "#ffffff15"],
  [1, "#033a16"],
  [2, "#196c2e"],
  [3, "#2ea043"],
  [4, "#56d364"],
]);

export default function calculateAnalytics(routines: Routine[]) {
  let totalHabits = 0;

  const contributions: Record<string, number> = {};
  let highestDailyContribution = 0;

  const categoriesDistribution: Record<string, number> = {};

  routines.forEach(({ habits }) => {
    habits.forEach(({ completionDates, category }) => {
      totalHabits++;
      categoriesDistribution[category] =
        (categoriesDistribution[category] ?? 0) + 1;
      completionDates.forEach((date) => {
        contributions[date] = (contributions[date] ?? 0) + 1;

        if (contributions[date] > highestDailyContribution) {
          highestDailyContribution = contributions[date];
        }
      });
    });
  });

  const heatMap = constructHeatMap(contributions, (contribution: number) =>
    calculateHeatLevel(contribution, highestDailyContribution),
  );

  for (const [category, quantity] of Object.entries(categoriesDistribution)) {
    categoriesDistribution[category] = (quantity * 100) / totalHabits;
  }

  return { heatMap, heatLevelColors, categoriesDistribution };
}

function constructHeatMap(
  contributions: Record<string, number>,
  heatLevelCalculationFn: (contribution: number) => number,
) {
  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 365);

  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  const heatmapArray: {
    date: string;
    contribution: number;
    heatLevel: number;
  }[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= today) {
    const isoDate = getLocalDateISO(currentDate);

    const count = contributions[isoDate] ?? 0;
    heatmapArray.push({
      date: isoDate,
      contribution: count,
      heatLevel: heatLevelCalculationFn(count),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return heatmapArray;
}

function calculateHeatLevel(
  dailyContributtion: number,
  highestDailyContribution: number,
) {
  if (highestDailyContribution === 0) {
    return 0;
  }

  const percentage = (dailyContributtion / highestDailyContribution) * 100;
  const level = Math.ceil(percentage / 25);

  return level;
}
