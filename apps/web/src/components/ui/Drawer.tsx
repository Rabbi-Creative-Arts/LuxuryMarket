"use client";

import { ReactNode, useEffect } from "react";

interface DrawerProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  position?: "left" | "right";
  className?: string;
}

export default function Drawer({
  open,
  title,
  children,
  onClose,
  position = "right",
  className = "",
}: DrawerProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () =>
      document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed
          top-0
          ${position === "right" ? "right-0" : "left-0"}
          h-full
          w-full
          max-w-md
          bg-white
          shadow-xl
          flex
          flex-col
          ${className}
        `}
      >
        {title && (
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-xl font-semibold">
              {title}
            </h2>

            <button
              onClick={onClose}
              className="rounded p-2 hover:bg-gray-100"
              aria-label="Close drawer"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}