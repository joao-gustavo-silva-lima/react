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

  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-card-gap w-full">
      {isQuerying ? (
        <>
          <SkeletonMetricCard />
          <SkeletonMetricCard />
        </>
      ) : (
        <>
          <MetricCard
            Icon={LinkIcon}
            title="Total de Links"
            metric={numOfLinks}
          />
          <MetricCard
            Icon={MousePointerClick}
            title="Total de Clicks"
            metric={numOfClicks}
          />
          {popularCategory && (
            <MetricCard
              Icon={Star}
              title="Categoria Popular"
              metric={`${popularCategory!.name} (${popularCategory!.numOfLinks} Link${popularCategory!.numOfLinks !== 1 ? "s" : ""})`}
            />
          )}
        </>
      )}
    </ul>
  );
}

function SkeletonMetricCard() {
  return (
    <li className="flex flex-nowrap flex-1 p-card-gap gap-card-gap items-center bg-surface rounded-input">
      <div className="animate-pulse w-[45px] aspect-square bg-border-main rounded-input"></div>
      <div className="flex flex-col flex-nowrap w-full gap-[7.5px]">
        <div className="animate-pulse w-full h-[24px] bg-border-main rounded-input"></div>
        <div className="animate-pulse w-[50%] h-[24px] bg-border-main rounded-input"></div>
      </div>
    </li>
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
        <Icon width={20} color="#1f6feb" />
      </div>
      <div className="flex flex-col">
        <span className="text-metric font-[600]">{title}:</span>
        <span className="capitalize font-[500]">{metric}</span>
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
