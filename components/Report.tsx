import { AnalysisData } from "@/types/report";
import { MetricCard } from "./MetricCard";

interface ReportProps {
  data: AnalysisData;
}

export function Report({ data }: ReportProps) {
  const getStatusInfo = (code: number) => {
    if (code === 200) return { text: "200 OK", color: "emerald" as const };
    if (code === 404) return { text: "404 Not Found", color: "amber" as const };
    if (code >= 500) return { text: `${code} Server Error`, color: "rose" as const };
    return { text: `${code}`, color: "amber" as const };
  };

  const getResponseTimeColor = (ms: number) => {
    if (ms < 200) return { color: "emerald" as const, subtitle: "Fast response (< 200ms)" };
    if (ms <= 500) return { color: "amber" as const, subtitle: "Moderate response (200-500ms)" };
    return { color: "rose" as const, subtitle: "Slow response (> 500ms)" };
  };

  const getH1Info = (count: number) => {
    if (count === 1) return { color: "emerald" as const, subtitle: "Optimal (exactly 1 H1 tag)" };
    if (count === 0) return { color: "amber" as const, subtitle: "Warning: Missing H1 tag" };
    return { color: "amber" as const, subtitle: `Warning: Multiple H1 tags (${count})` };
  };

  const getAltImagesInfo = (missingCount: number) => {
    if (missingCount === 0) return { color: "emerald" as const, subtitle: "All images have alt text" };
    return { color: "rose" as const, subtitle: `${missingCount} images missing alt text` };
  };

  const statusInfo = getStatusInfo(data.status);
  const timeInfo = getResponseTimeColor(data.responseTime);
  const h1Info = getH1Info(data.h1Count);
  const altInfo = getAltImagesInfo(data.missingAltImages);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Network Row */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2 border-b border-[#2A2F3A] pb-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Network
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <MetricCard
            label="HTTP Status"
            value={statusInfo.text}
            color={statusInfo.color}
          />
          <MetricCard
            label="Response Time"
            value={`${data.responseTime} ms`}
            color={timeInfo.color}
            subtitle={timeInfo.subtitle}
          />
        </div>
      </section>

      {/* 2. SEO Row */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2 border-b border-[#2A2F3A] pb-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#9CA3AF]">
            SEO
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <MetricCard
            label="Title"
            value={data.title}
            color="sky"
            className="lg:col-span-4"
          />
          <MetricCard
            label="Meta Description"
            value={data.metaDescription}
            color="neutral"
            className="lg:col-span-5"
          />
          <MetricCard
            label="H1 Count"
            value={data.h1Count}
            color={h1Info.color}
            subtitle={h1Info.subtitle}
            className="lg:col-span-3"
          />
        </div>
      </section>

      {/* 3. Accessibility & Content Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Accessibility */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2 border-b border-[#2A2F3A] pb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Accessibility
            </h3>
          </div>
          <MetricCard
            label="Missing Alt Images"
            value={data.missingAltImages}
            color={altInfo.color}
            subtitle={altInfo.subtitle}
          />
        </section>

        {/* Content */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2 border-b border-[#2A2F3A] pb-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.6)]" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Content
            </h3>
          </div>
          <MetricCard
            label="Word Count"
            value={data.wordCount}
            color="sky"
            subtitle="Approximate visible page text"
          />
        </section>
      </div>
    </div>
  );
}
