import { useFetchRoutines } from "../hooks/useRoutines";
import { CATEGORIES_TO_PT_BR } from "../types/routines.types";
import calculateAnalytics from "../utils/calculate-analytics.utils";
import Fallback from "./Fallback";

export default function Analytics() {
  const { data: routines, isPending, isError } = useFetchRoutines();
  const { heatMap, categoriesDistribution, heatLevelColors } =
    calculateAnalytics(routines ?? []);

  if (isError || routines === undefined) {
    return <Fallback message="Não foi possível carregar os relatórios." />;
  }

  if (routines.length === 0) {
    return <Fallback message="Você ainda não possui hábitos registrados." />;
  }

  return (
    <main className="contained flex flex-col gap-gap-lg">
      <h2 className="text-lg font-bold">RELATÓRIOS</h2>
      {isPending ? (
        <>
          <SectionSkeleton />
          <SectionSkeleton />
        </>
      ) : (
        <>
          <section className="flex flex-col gap-gap-sm surface main-border w-full">
            <h3 className="font-medium">Frequência de Hábitos</h3>
            <div className="grid grid-rows-[repeat(7,1fr)] gap-[5px] max-w-full overflow-x-auto overflow-y-visible grid-flow-col h-fit">
              {["S", "T", "Q", "Q", "S", "S", "D"].map((weekDay, index) => (
                <div
                  className="text-xs text-center mr-[5px]"
                  key={`week-day-cell-${index}`}
                >
                  {weekDay}
                </div>
              ))}
              {heatMap.map((cell, index) => (
                <div
                  key={`cell-${index}`}
                  className="w-[15px] h-[15px] aspect-square"
                  style={{
                    backgroundColor: heatLevelColors.get(cell.heatLevel),
                  }}
                  title={`Contribuições de ${cell.date}: ${cell.contribution}`}
                ></div>
              ))}
            </div>
            <div className="flex flex-nowrap justify-between items-center">
              <span className="text-sm">Contribuições</span>
              <div className="flex flex-nowrap gap-[5px] items-center">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={`cell-${index}`}
                    className="w-[15px] h-[15px]"
                    style={{
                      backgroundColor: heatLevelColors.get(index),
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-gap-sm surface main-border w-full">
            <h3 className="font-medium">Distribuição por Categoria</h3>
            <ul>
              {Object.entries(categoriesDistribution).map(
                ([category, percentage]) => (
                  <li key={`${category}-distribution`}>
                    <span className="text-sm">
                      {CATEGORIES_TO_PT_BR.get(category)}{" "}
                      {percentage.toFixed(0)}%
                    </span>
                  </li>
                ),
              )}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}

function SectionSkeleton() {
  return (
    <section className="w-full h-[175px] surface  animate-pulse"></section>
  );
}
