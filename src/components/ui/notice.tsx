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
    container: "bg-accent-subtle/40 border-accent-primary/30 text-text-primary",
    icon: "text-accent-primary",
  },
  success: {
    container: "bg-success-subtle/40 border-success/30 text-text-primary",
    icon: "text-success",
  },
  warning: {
    container: "bg-warning/10 border-warning/30 text-text-primary",
    icon: "text-warning",
  },
  error: {
    container: "bg-error-subtle/40 border-error/30 text-text-primary",
    icon: "text-error",
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
          "relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-subtle transition-all duration-150",
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
            <h5 className="font-semibold leading-tight text-text-primary">
              {title}
            </h5>
          )}
          {children && (
            <div className="text-text-secondary text-xs sm:text-sm leading-relaxed">
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
            className="shrink-0 rounded-md p-1 text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Notice.displayName = "Notice";
