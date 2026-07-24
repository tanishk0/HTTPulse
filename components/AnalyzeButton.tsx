interface AnalyzeButtonProps {
  isLoading: boolean;
  disabled?: boolean;
}

export function AnalyzeButton({ isLoading, disabled }: AnalyzeButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className="bg-[#00D4AA] hover:bg-[#00c29a] text-[#0F1115] font-semibold text-sm rounded-lg px-5 py-2.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-[#0F1115]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Analyzing...</span>
        </>
      ) : (
        <span>Analyze</span>
      )}
    </button>
  );
}
