import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "Ver todos",
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground outfit outfit-700">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-sm outfit outfit-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="text-nerdcave-purple hover:text-nerdcave-lime font-medium text-sm outfit outfit-500 flex items-center gap-1 transition-colors group"
        >
          {linkText}
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
