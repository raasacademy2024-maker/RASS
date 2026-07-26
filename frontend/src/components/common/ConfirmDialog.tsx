import React from "react";
import { AlertTriangle, X } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" for destructive/irreversible actions, "primary" otherwise. */
  variant?: "danger" | "primary" | "success";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANTS = {
  danger: {
    button: "bg-red-600 hover:bg-red-700",
    iconWrap: "bg-red-100",
    icon: "text-red-600",
  },
  primary: {
    button: "bg-indigo-600 hover:bg-indigo-700",
    iconWrap: "bg-indigo-100",
    icon: "text-indigo-600",
  },
  success: {
    button: "bg-green-600 hover:bg-green-700",
    iconWrap: "bg-green-100",
    icon: "text-green-600",
  },
};

/**
 * Shared confirmation box. Used instead of window.confirm() so every admin
 * action gets the same styled prompt and can say exactly what will happen.
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  busy = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  const style = VARIANTS[variant];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 h-11 w-11 rounded-full flex items-center justify-center ${style.iconWrap}`}>
              <AlertTriangle className={`h-6 w-6 ${style.icon}`} />
            </div>
            <div className="flex-1">
              <h3 id="confirm-dialog-title" className="text-lg font-bold text-gray-900">
                {title}
              </h3>
              <div className="mt-2 text-sm text-gray-600">{message}</div>
            </div>
            <button
              onClick={onCancel}
              disabled={busy}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={onConfirm}
            disabled={busy}
            className={`px-5 py-2.5 rounded-lg text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${style.button}`}
          >
            {busy ? "Working..." : confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={busy}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-60"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
