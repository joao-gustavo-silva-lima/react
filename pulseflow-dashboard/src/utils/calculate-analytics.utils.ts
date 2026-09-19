import type { Routine } from "../types/routines.types";

const heatLevelColors = new Map<number, string>([
  [1, "#14532d"],
  [2, "#15803d"],
  [3, "#22c55e"],
  [4, "#4ade80"],
  [5, "#86efac"],
]);

export default function calculateAnalytics(routines: Routine[]) {
  const contributions: Record<string, number> = {};
  let highestDailyContribution = 0;

  routines.forEach(({ habits }) => {
    habits.forEach(({ completionDates }) => {
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

  return { heatMap, heatLevelColors };
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
    const isoDate = currentDate.toISOString().split("T")[0];

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
  const level = Math.ceil(percentage / 20);

  return level;
}
