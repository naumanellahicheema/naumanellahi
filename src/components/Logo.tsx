import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  siteName?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  to?: string | null;
}

const sizeMap = {
  sm: { box: "w-8 h-8", text: "text-sm", label: "text-base" },
  md: { box: "w-10 h-10", text: "text-lg", label: "text-xl" },
  lg: { box: "w-12 h-12", text: "text-xl", label: "text-2xl" },
};

export function Logo({
  siteName = "Nauman Ellahi",
  className,
  size = "md",
  showText = true,
  to = "/",
}: LogoProps) {
  const s = sizeMap[size];
  const initial = siteName.charAt(0).toUpperCase();

  const inner = (
    <span className={cn("inline-flex items-center gap-3 group", className)}>
      <span
        className={cn(
          "relative rounded-xl bg-foreground text-background flex items-center justify-center font-display font-bold shrink-0",
          s.box,
          s.text
        )}
      >
        {initial}
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-orange-400 border-2 border-background" />
      </span>
      {showText && (
        <span className={cn("font-display font-bold tracking-tight text-foreground", s.label)}>
          {siteName}
        </span>
      )}
    </span>
  );

  if (to === null) return inner;
  return <Link to={to} className="inline-flex items-center tap-target">{inner}</Link>;
}
