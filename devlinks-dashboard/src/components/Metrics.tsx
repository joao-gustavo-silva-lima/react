import {
  type LucideIcon,
  LinkIcon,
  MousePointerClick,
  Star,
} from "lucide-react";
import type { Link } from "../types/links.types";

type Metrics = {
  numOfLinks: number;
  numOfClicks: number;
  popularCategory?: {
    name: string;
    numOfLinks: number;
  };
};

export default function Metrics({
  links,
  isQuerying,
}: {
  links: Link[];
  isQuerying: boolean;
}) {
  const { numOfLinks, numOfClicks, popularCategory } = calculateMetrics(links);

  if (isQuerying) {
    return <span>Carregando Métricas...</span>;
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-card-gap w-full">
      <MetricCard Icon={LinkIcon} title="Total de Links" metric={numOfLinks} />
      <MetricCard
        Icon={MousePointerClick}
        title="Total de Clicks"
        metric={numOfClicks}
      />
      {popularCategory && (
        <MetricCard
          Icon={Star}
          title="Categoria Popular"
          metric={`${popularCategory.name} (${popularCategory.numOfLinks} Link${popularCategory.numOfLinks !== 1 ? "s" : ""})`}
        />
      )}
    </ul>
  );
}

function MetricCard({
  Icon,
  title,
  metric,
}: {
  Icon: LucideIcon;
  title: string;
  metric: string | number;
}) {
  return (
    <li className="flex flex-row p-card-gap gap-card-gap items-center bg-surface rounded-input main-border">
      <div className="bg-border-main rounded-input p-[10px]">
        <Icon width={20} />
      </div>
      <div className="flex flex-col">
        <span>{title}:</span>
        <span className="capitalize text-metric font-[600]">{metric}</span>
      </div>
    </li>
  );
}

function calculateMetrics(links: Link[]): Metrics {
  const quantities = {
    numOfLinks: links.length,
    numOfClicks: 0,
  };

  if (links.length === 0) {
    return quantities;
  }

  const categoriesRank: Record<string, number> = {};

  links.forEach(({ category, clicks }) => {
    quantities.numOfClicks += clicks;

    categoriesRank[category] = (categoriesRank[category] || 0) + 1;
  });

  const popularCategory = Object.entries(categoriesRank).reduce((acc, curr) =>
    curr[1] > acc[1] ? curr : acc,
  );

  return {
    ...quantities,
    popularCategory: {
      name: popularCategory[0],
      numOfLinks: popularCategory[1],
    },
  };
}
