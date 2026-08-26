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

export default function Metrics({ links }: { links: Link[] }) {
  const { numOfLinks, numOfClicks, popularCategory } = calculateMetrics(links);

  return (
    <ul>
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
    <li className="flex flex-row gap-[5px] items center">
      <Icon />
      <div className="flex flex-col">
        <span>{title}:</span>
        <span>{metric}</span>
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
