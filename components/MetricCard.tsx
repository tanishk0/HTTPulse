interface MetricCardProps {
  label: string;
  value: string | number;
  color?: "emerald" | "amber" | "rose" | "sky" | "neutral";
  subtitle?: string;
}

export function MetricCard({
  label,
  value,
  color = "neutral",
  subtitle,
}: MetricCardProps) {
  const valueColorMap = {
    emerald: "text-[#00D4AA]",
    amber: "text-amber-400",
    rose: "text-rose-400",
    sky: "text-sky-400",
    neutral: "text-[#F3F4F6]",
  };

  const statusBorderMap = {
    emerald: "border-l-2 border-l-[#00D4AA]",
    amber: "border-l-2 border-l-amber-500",
    rose: "border-l-2 border-l-rose-500",
    sky: "border-l-2 border-l-sky-400",
    neutral: "border-l-2 border-l-[#2A2F3A]",
  };

  const dotMap = {
    emerald: "bg-[#00D4AA]",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
    sky: "bg-sky-400",
    neutral: "bg-[#6B7280]",
  };

  return (
    <div
      className={`bg-[#161B22] border border-[#2A2F3A] ${statusBorderMap[color]} rounded-lg p-5 flex flex-col justify-between hover:border-[#3B4252] transition-all duration-200 shadow-sm`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-[#9CA3AF] font-mono font-semibold">
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
          <span className="text-xs text-[#9CA3AF] font-mono">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
