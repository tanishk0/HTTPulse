"use client";

import { useState, useMemo } from "react";

interface JsonViewerProps {
  data: unknown;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const formattedJson = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const lines = useMemo(() => formattedJson.split("\n"), [formattedJson]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([formattedJson], { type: "application/json" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `httpulse-analysis-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch {
      // Fallback
    }
  };

  const highlightLine = (lineStr: string, lineIndex: number) => {
    if (!lineStr) return "";

    const regex =
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    lineStr.replace(regex, (match, _p1, _p2, _p3, _p4, offset: number) => {
      if (offset > lastIndex) {
        parts.push(
          <span key={`text-${lineIndex}-${lastIndex}`} className="text-[#9CA3AF]">
            {lineStr.substring(lastIndex, offset)}
          </span>
        );
      }
      lastIndex = offset + match.length;

      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          // JSON Key
          const keyText = match.slice(0, -1);
          parts.push(
            <span key={`key-${lineIndex}-${offset}`} className="text-sky-400 font-medium">
              {keyText}
            </span>
          );
          parts.push(
            <span key={`colon-${lineIndex}-${offset}`} className="text-[#9CA3AF]">
              :
            </span>
          );
        } else {
          // String value
          parts.push(
            <span key={`str-${lineIndex}-${offset}`} className="text-emerald-400">
              {match}
            </span>
          );
        }
      } else if (/true|false/.test(match)) {
        // Boolean
        parts.push(
          <span key={`bool-${lineIndex}-${offset}`} className="text-amber-400 font-semibold">
            {match}
          </span>
        );
      } else if (/null/.test(match)) {
        // Null
        parts.push(
          <span key={`null-${lineIndex}-${offset}`} className="text-rose-400 font-semibold">
            {match}
          </span>
        );
      } else {
        // Number
        parts.push(
          <span key={`num-${lineIndex}-${offset}`} className="text-purple-400 font-semibold">
            {match}
          </span>
        );
      }

      return match;
    });

    if (lastIndex < lineStr.length) {
      parts.push(
        <span key={`text-${lineIndex}-${lastIndex}`} className="text-[#9CA3AF]">
          {lineStr.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <div className="bg-[#161B22] border border-[#2A2F3A] rounded-lg overflow-hidden flex flex-col w-full shadow-sm">
      {/* Header Bar with Actions */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161B22] border-b border-[#2A2F3A]">
        <div className="flex items-center gap-2 font-mono text-xs text-[#9CA3AF]">
          <span>application/json</span>
          <span className="text-[#9CA3AF]/40">|</span>
          <span className="text-[#9CA3AF]/80">{lines.length} lines</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Download JSON Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="text-xs font-mono px-3 py-1 bg-[#1B2028] hover:bg-[#2A2F3A] text-[#F3F4F6] border border-[#2A2F3A] rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download JSON file"
          >
            <span>↓ Download</span>
          </button>

          {/* Copy JSON Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs font-mono px-3 py-1 bg-[#1B2028] hover:bg-[#2A2F3A] text-[#F3F4F6] border border-[#2A2F3A] rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <span className="text-[#00D4AA]">✓</span>
                <span className="text-[#00D4AA] font-medium">Copied!</span>
              </>
            ) : (
              <span>Copy JSON</span>
            )}
          </button>
        </div>
      </div>

      {/* Code Viewer with Line Numbers */}
      <div className="p-4 overflow-x-auto max-h-[550px] bg-[#0F1115]/90 font-mono text-xs sm:text-sm leading-relaxed">
        <table className="border-collapse w-full">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-[#161B22]/50 transition-colors">
                <td className="pr-4 text-right text-[#6B7280] select-none text-xs font-mono border-r border-[#2A2F3A]/60 w-10 min-w-10">
                  {idx + 1}
                </td>
                <td className="pl-4 whitespace-pre font-mono">
                  {highlightLine(line, idx)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
