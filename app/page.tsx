"use client";

import { useState } from "react";
import { UrlInput } from "@/components/UrlInput";
import { AnalyzeButton } from "@/components/AnalyzeButton";
import { Report } from "@/components/Report";
import { JsonViewer } from "@/components/JsonViewer";
import { SkeletonReport } from "@/components/SkeletonReport";
import { AnalyzeApiResponse } from "@/types/report";

export default function Home() {
  const [url, setUrl] = useState("");
  const [analyzedUrl, setAnalyzedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<AnalyzeApiResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"report" | "json">("report");
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError({
        code: "EMPTY_URL",
        message: "URL cannot be empty.",
      });
      return;
    }

    const currentTarget = url.trim();
    setIsLoading(true);
    setAnalyzedUrl(currentTarget);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: currentTarget }),
      });

      const data: AnalyzeApiResponse = await res.json();
      setApiResponse(data);

      if (!data.success) {
        setError(data.error);
      }
    } catch {
      setApiResponse(null);
      setError({
        code: "NETWORK_FAILURE",
        message: "Unable to connect to the target website.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F1115] text-[#F3F4F6] flex flex-col items-center justify-start p-6 md:p-12 font-sans selection:bg-[#00D4AA]/30">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-1.5 border-b border-[#2A2F3A] pb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#00D4AA] shadow-[0_0_10px_rgba(0,212,170,0.6)]" />
            <h1 className="text-2xl font-bold tracking-tight text-[#F3F4F6] font-mono">
              HTTPulse
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#9CA3AF] font-mono">
            Instant website inspection & metric extraction tool.
          </p>
        </header>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex-1">
            <UrlInput value={url} onChange={setUrl} disabled={isLoading} />
          </div>
          <AnalyzeButton isLoading={isLoading} disabled={!url.trim()} />
        </form>

        {/* Error Display Card */}
        {error && (
          <div className="bg-[#161B22] border border-[#2A2F3A] border-l-4 border-l-rose-500 rounded-lg p-4 text-[#F3F4F6] text-sm font-mono flex flex-col gap-1.5 shadow-sm transition-all duration-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
              <span className="font-bold text-rose-400 uppercase tracking-wide text-xs">
                {error.code}
              </span>
            </div>
            <p className="text-sm text-[#F3F4F6]/90 pl-4">{error.message}</p>
          </div>
        )}

        {/* Loading Skeleton State */}
        {isLoading && <SkeletonReport />}

        {/* Results Section */}
        {!isLoading && apiResponse && (
          <div className="flex flex-col gap-5 transition-all duration-200">
            {/* Dev Tool Target Header Bar */}
            <div className="bg-[#161B22] border border-[#2A2F3A] rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs shadow-sm">
              <div className="flex items-center gap-2.5 overflow-hidden max-w-full">
                <span className="px-2 py-0.5 bg-[#1B2028] text-[#00D4AA] rounded font-bold border border-[#2A2F3A]">
                  POST
                </span>
                <span className="text-[#F3F4F6] font-semibold truncate">
                  {analyzedUrl}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {apiResponse.success ? (
                  <>
                    <span className="px-2 py-0.5 bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30 rounded font-semibold">
                      {apiResponse.data.status} OK
                    </span>
                    <span className="text-[#9CA3AF]">
                      {apiResponse.data.responseTime} ms
                    </span>
                  </>
                ) : (
                  <span className="px-2 py-0.5 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded font-semibold">
                    FAILED
                  </span>
                )}
              </div>
            </div>

            {/* Tabs Bar */}
            <div className="flex border-b border-[#2A2F3A] gap-4 font-mono text-sm">
              <button
                type="button"
                onClick={() => setActiveTab("report")}
                className={`pb-2.5 pt-1 px-1 border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === "report"
                    ? "border-[#00D4AA] text-[#F3F4F6] font-semibold"
                    : "border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]"
                }`}
              >
                Report
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("json")}
                className={`pb-2.5 pt-1 px-1 border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === "json"
                    ? "border-[#00D4AA] text-[#F3F4F6] font-semibold"
                    : "border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]"
                }`}
              >
                JSON
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "report" ? (
              apiResponse.success ? (
                <Report data={apiResponse.data} />
              ) : (
                <div className="bg-[#161B22] border border-[#2A2F3A] rounded-lg p-6 text-center text-sm text-[#9CA3AF] font-mono">
                  Inspection encountered an error. Switch to the JSON tab to view the raw API response.
                </div>
              )
            ) : (
              <JsonViewer data={apiResponse} />
            )}
          </div>
        )}

        {!apiResponse && !isLoading && !error && (
          <div className="border border-dashed border-[#2A2F3A] bg-[#161B22]/30 rounded-lg p-10 text-center text-sm text-[#9CA3AF] font-mono">
            Report appears here after scanning.
          </div>
        )}
      </div>
    </main>
  );
}
