interface UrlInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function UrlInput({ value, onChange, disabled }: UrlInputProps) {
  return (
    <input
      type="text"
      placeholder="https://example.com"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full bg-[#1B2028] border border-[#2A2F3A] focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] focus:outline-none text-[#F3F4F6] placeholder-[#9CA3AF]/60 rounded-lg px-4 py-2.5 text-sm font-mono transition-all duration-200 disabled:opacity-50"
    />
  );
}
