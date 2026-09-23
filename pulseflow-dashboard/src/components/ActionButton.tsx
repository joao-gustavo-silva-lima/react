import type { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router";

export default function ActionButton({
  to,
  onClick,
  children,
  additionalClassName,
}: {
  to?: string;
  children: ReactNode;
  additionalClassName?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const className =
    "transition-all duration-[.125s] main-border border-primary font-medium text-primary px-[15px] py-[5px] rounded-md text-nowrap text-center bg-transparent  hover:bg-primary-foreground hover:border-primary-foreground active:bg-primary active:text-primary-foreground hover:cursor-pointer " +
    additionalClassName;

  return to ? (
    <Link to={to} className={className}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
