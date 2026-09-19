import { useFetchRoutines } from "../hooks/useRoutines";
import calculateAnalytics from "../utils/calculate-analytics.utils";

export default function Analytics() {
  const { data: routines, isPending, isError } = useFetchRoutines();
  const { heatMap, heatLevelColors } = calculateAnalytics(routines ?? []);

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
    <>
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
    </>
  );
}
