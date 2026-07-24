"use client";

import { useState, useMemo } from "react";

interface JsonViewerProps {
  data: unknown;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const formattedJson = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const highlightedNodes = useMemo(() => {
    if (!formattedJson) return null;

    const regex =
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    formattedJson.replace(
      regex,
      (match, _p1, _p2, _p3, _p4, offset: number) => {
        if (offset > lastIndex) {
          parts.push(
            <span key={`text-${lastIndex}`} className="text-[#9CA3AF]">
              {formattedJson.substring(lastIndex, offset)}
            </span>
          );
        }
        lastIndex = offset + match.length;

        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            // JSON Key
            const keyText = match.slice(0, -1);
            parts.push(
              <span key={`key-${offset}`} className="text-sky-400 font-medium">
                {keyText}
              </span>
            );
            parts.push(
              <span key={`colon-${offset}`} className="text-[#9CA3AF]">
                :
              </span>
            );
          } else {
            // String value
            parts.push(
              <span key={`str-${offset}`} className="text-[#00D4AA]">
                {match}
              </span>
            );
          }
        } else if (/true|false/.test(match)) {
          // Boolean
          parts.push(
            <span key={`bool-${offset}`} className="text-amber-400 font-semibold">
              {match}
            </span>
          );
        } else if (/null/.test(match)) {
          // Null
          parts.push(
            <span key={`null-${offset}`} className="text-rose-400 font-semibold">
              {match}
            </span>
          );
        } else {
          // Number
          parts.push(
            <span key={`num-${offset}`} className="text-purple-400 font-semibold">
              {match}
            </span>
          );
        }

        return match;
      }
    );

    if (lastIndex < formattedJson.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="text-[#9CA3AF]">
          {formattedJson.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  }, [formattedJson]);

  return (
    <div className="bg-[#161B22] border border-[#2A2F3A] rounded-lg overflow-hidden flex flex-col w-full shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B22] border-b border-[#2A2F3A]">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-[#00D4AA] shadow-[0_0_6px_rgba(0,212,170,0.6)]" />
          <span className="text-[#9CA3AF]">application/json</span>
        </div>
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

      {/* Syntax Highlighted Code Area */}
      <div className="p-4 overflow-x-auto max-h-[500px] bg-[#0F1115]/80">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre">
          <code>{highlightedNodes}</code>
        </pre>
      </div>
    </div>
  );
}
