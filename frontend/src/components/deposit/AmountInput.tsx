"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  presets?: number[];
}

export function AmountInput({
  value,
  onChange,
  min = 10000,
  max = 50000000,
  presets = [50000, 100000, 200000, 500000],
}: AmountInputProps) {
  const [touched, setTouched] = useState(false);
  const numValue = parseInt(value) || 0;
  const isInvalid = touched && value && (numValue < min || numValue > max);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    onChange(rawValue);
  };

  const handleBlur = () => {
    setTouched(true);
    if (numValue && numValue < min) {
      onChange(min.toString());
    } else if (numValue && numValue > max) {
      onChange(max.toString());
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Nhập số tiền"
          value={value ? formatNumber(numValue) : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`h-[72px] w-full rounded-xl border-2 glass pl-4 pr-16 text-2xl font-bold placeholder:text-muted-foreground focus:outline-none transition-all duration-300 ${
            isInvalid
              ? "border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_6px_rgba(239,68,68,0.1)]"
              : "border-primary/20 focus:border-primary focus:shadow-[0_0_0_6px_rgba(124,58,237,0.1)] focus:scale-[1.01]"
          }`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
          VNĐ
        </span>
      </div>

      {isInvalid && (
        <div className="flex items-center space-x-2 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>
            {numValue < min
              ? `Số tiền tối thiểu là ${formatNumber(min)}đ`
              : `Số tiền tối đa là ${formatNumber(max)}đ`}
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => {
              onChange(preset.toString());
              setTouched(true);
            }}
            className={`rounded-lg glass border py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              value === preset.toString()
                ? "border-primary bg-primary/10 text-primary scale-105 shadow-md"
                : "border-border text-foreground hover:border-primary/30 hover:bg-primary/5 hover:scale-105"
            }`}
          >
            {formatNumber(preset / 1000)}K
          </button>
        ))}
      </div>
    </div>
  );
}
