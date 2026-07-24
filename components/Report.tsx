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
    if (count === 1) return { color: "emerald" as const, subtitle: "Optimal (exactly 1 H1)" };
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
      {/* 1. Network Group */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-[#2A2F3A] pb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9CA3AF]">
            Network
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* 2. SEO Group */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-[#2A2F3A] pb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9CA3AF]">
            SEO
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="Title"
            value={data.title}
            color="sky"
          />
          <MetricCard
            label="Meta Description"
            value={data.metaDescription}
            color="neutral"
          />
          <MetricCard
            label="H1 Count"
            value={data.h1Count}
            color={h1Info.color}
            subtitle={h1Info.subtitle}
          />
        </div>
      </section>

      {/* 3. Accessibility Group */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-[#2A2F3A] pb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9CA3AF]">
            Accessibility
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <MetricCard
            label="Missing Alt Images"
            value={data.missingAltImages}
            color={altInfo.color}
            subtitle={altInfo.subtitle}
          />
        </div>
      </section>

      {/* 4. Content Group */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-[#2A2F3A] pb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9CA3AF]">
            Content
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <MetricCard
            label="Word Count"
            value={data.wordCount}
            color="sky"
            subtitle="Approximate visible page words"
          />
        </div>
      </section>
    </div>
  );
}
