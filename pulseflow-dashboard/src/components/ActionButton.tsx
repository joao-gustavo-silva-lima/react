import { Link } from "react-router";

export default function ActionButton({
  to,
  children,
  additionalClassName = "",
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  to?: string;
  children: React.ReactNode;
  additionalClassName?: string;
}) {
  const className =
    "transition-all duration-[.125s] main-border border-primary font-medium text-primary px-[15px] py-[5px] rounded-md text-nowrap text-center bg-transparent  not:disabled:hover:bg-primary-foreground not:disabled:hover:border-primary-foreground not:disabled:active:bg-primary not:disabled:active:text-primary-foreground hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed " +
    additionalClassName;

  return to ? (
    <Link to={to} className={className}>
      {children}
    </Link>
  ) : (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
