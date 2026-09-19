import { useFetchRoutines } from "../hooks/useRoutines";
import { CATEGORIES_TO_PT_BR } from "../types/routines.types";
import calculateAnalytics from "../utils/calculate-analytics.utils";

export default function Analytics() {
  const { data: routines, isPending, isError } = useFetchRoutines();
  const { heatMap, categoriesDistribution, heatLevelColors } =
    calculateAnalytics(routines ?? []);

  if (isPending) {
    return <p>Carregando relatórios...</p>;
  }

  if (isError || routines === undefined) {
    return <p>Não foi possível carregar os relatórios.</p>;
  }

  if (routines.length === 0) {
    return <p>Você ainda não possui hábitos registrados.</p>;
  }

  return (
    <main>
      <h2>RELATÓRIOS</h2>
      <section>
        <h3>Frequência de Hábitos</h3>
        <div
          style={{
            display: "grid",
            maxWidth: "100%",
            overflowX: "auto",
            overflowY: "visible",
            height: "fit-content",
            gridAutoFlow: "column",
            gridTemplateRows: "repeat(7, 1fr)",
          }}
        >
          {["S", "T", "Q", "Q", "S", "S", "D"].map((weekDay, index) => (
            <div key={`week-day-cell-${index}`}>{weekDay}</div>
          ))}
          {heatMap.map((cell, index) => (
            <div
              key={`cell-${index}`}
              style={{
                width: "15px",
                aspectRatio: "1/1",
                borderRadius: "5px",
                border: "1px solid black",
                backgroundColor: heatLevelColors.get(cell.heatLevel) ?? "white",
              }}
              title={`Contribuições de ${cell.date}: ${cell.contribution}`}
            >
              {" "}
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3>Distribuição por Categoria</h3>
        <ul>
          {Object.entries(categoriesDistribution).map(
            ([category, percentage]) => (
              <li key={`${category}-distribution`}>
                {CATEGORIES_TO_PT_BR.get(category)} {percentage.toFixed(0)}%
              </li>
            ),
          )}
        </ul>
      </section>
    </main>
  );
}
