import * as React from "react";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type NoticeVariant = "info" | "success" | "warning" | "error";

export interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: NoticeVariant;
  title?: string;
  action?: React.ReactNode;
  onClose?: () => void;
}

const variantStyles: Record<NoticeVariant, { container: string; icon: string }> = {
  info: {
    container: "bg-paper-white border-ash/80 text-carbon-black",
    icon: "text-carbon-black",
  },
  success: {
    container: "bg-mint-chip/30 border-mint-chip text-carbon-black",
    icon: "text-emerald-700",
  },
  warning: {
    container: "bg-voltage-yellow/20 border-voltage-yellow text-carbon-black",
    icon: "text-amber-800",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-900",
    icon: "text-red-600",
  },
};

const defaultIcons: Record<NoticeVariant, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

export const Notice = React.forwardRef<HTMLDivElement, NoticeProps>(
  (
    {
      className,
      variant = "info",
      title,
      action,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const IconComponent = defaultIcons[variant];
    const { container, icon: iconStyle } = variantStyles[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative flex w-full items-start gap-3 rounded-2xl border p-4 transition-all duration-150",
          container,
          className
        )}
        {...props}
      >
        <span className={cn("mt-0.5 shrink-0", iconStyle)} data-testid="notice-icon">
          <IconComponent className="h-5 w-5" />
        </span>

        <div className="flex-1 space-y-1 text-sm">
          {title && (
            <h5 className="font-bold leading-tight text-carbon-black">
              {title}
            </h5>
          )}
          {children && (
            <div className="text-slate text-xs sm:text-sm leading-relaxed">
              {children}
            </div>
          )}
          {action && <div className="mt-2.5 pt-1">{action}</div>}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notice"
            className="shrink-0 rounded-md p-1 text-smoke hover:bg-mist-gray hover:text-carbon-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-carbon-black"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Notice.displayName = "Notice";
