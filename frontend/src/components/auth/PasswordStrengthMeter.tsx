"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { validators } from "@/lib/auth/validation";
import type { PasswordStrength } from "@/types/auth";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength: PasswordStrength = useMemo(
    () => validators.getPasswordStrength(password),
    [password]
  );

  // Don't show meter if password is empty
  if (!password) {
    return null;
  }

  // Determine strength label and color
  const getStrengthInfo = (score: number) => {
    switch (score) {
      case 0:
        return { label: "Yếu", color: "text-red-500", bgColor: "bg-red-500" };
      case 1:
        return { label: "Trung bình", color: "text-yellow-500", bgColor: "bg-yellow-500" };
      case 2:
        return { label: "Tốt", color: "text-blue-500", bgColor: "bg-blue-500" };
      case 3:
        return { label: "Mạnh", color: "text-green-500", bgColor: "bg-green-500" };
      default:
        return { label: "Yếu", color: "text-red-500", bgColor: "bg-red-500" };
    }
  };

  const strengthInfo = getStrengthInfo(strength.score);
  const progressWidth = `${(strength.score / 3) * 100}%`;

  return (
    <div className="space-y-3" role="region" aria-label="Password strength indicator">
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Độ mạnh mật khẩu</span>
          <span className={`font-semibold ${strengthInfo.color}`} aria-live="polite">
            {strengthInfo.label}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full transition-all duration-300 ${strengthInfo.bgColor}`}
            style={{ width: progressWidth }}
            role="progressbar"
            aria-valuenow={strength.score}
            aria-valuemin={0}
            aria-valuemax={3}
            aria-label={`Password strength: ${strengthInfo.label}`}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1.5" role="list" aria-label="Password requirements">
        <RequirementItem
          met={strength.meetsLength}
          label="Ít nhất 8 ký tự"
        />
        <RequirementItem
          met={strength.hasUppercase}
          label="Chữ hoa (A-Z)"
        />
        <RequirementItem
          met={strength.hasLowercase}
          label="Chữ thường (a-z)"
        />
        <RequirementItem
          met={strength.hasNumber}
          label="Số (0-9)"
        />
        <RequirementItem
          met={strength.hasSpecial}
          label="Ký tự đặc biệt (!@#$...)"
        />
      </div>
    </div>
  );
}

interface RequirementItemProps {
  met: boolean;
  label: string;
}

function RequirementItem({ met, label }: RequirementItemProps) {
  return (
    <div className="flex items-center gap-2 text-xs" role="listitem">
      {met ? (
        <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
      ) : (
        <X className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      )}
      <span className={met ? "text-green-500" : "text-muted-foreground"}>
        <span className="sr-only">{met ? "Met: " : "Not met: "}</span>
        {label}
      </span>
    </div>
  );
}
