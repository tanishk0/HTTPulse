interface MetricCardProps {
  label: string;
  value: string | number;
  color?: "emerald" | "amber" | "rose" | "sky" | "purple" | "neutral";
  subtitle?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  color = "neutral",
  subtitle,
  className = "",
}: MetricCardProps) {
  const valueColorMap = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
    sky: "text-sky-400",
    purple: "text-purple-400",
    neutral: "text-[#F3F4F6]",
  };

  const dotMap = {
    emerald: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]",
    amber: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]",
    rose: "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.6)]",
    sky: "bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.6)]",
    purple: "bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.6)]",
    neutral: "bg-neutral-500",
  };

  return (
    <div
      className={`bg-[#161B22] border border-[#2A2F3A] rounded-lg p-4 flex flex-col justify-between hover:border-[#3B4252] transition-colors duration-150 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-[#9CA3AF] font-mono font-medium">
          {label}
        </span>
        <span className={`w-2 h-2 rounded-full ${dotMap[color]}`} />
      </div>
      <div className="flex flex-col gap-1">
        <span
          className={`text-base sm:text-lg font-mono font-bold break-words whitespace-pre-wrap ${valueColorMap[color]}`}
        >
          {value !== undefined && value !== null && value !== "" ? value : "-"}
        </span>
        {subtitle && (
          <span className="text-xs text-[#9CA3AF] font-mono mt-0.5">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
