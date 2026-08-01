"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Dropdown({
  trigger,
  children,
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block ${className}`}
    >
      <div onClick={() => setOpen(!open)}>
        {trigger}
      </div>

      {open && (
        <div
          className="
            absolute
            right-0
            mt-2
            min-w-[220px]
            rounded-lg
            border
            bg-white
            shadow-lg
            z-50
            overflow-hidden
          "
        >
          {children}
        </div>
      )}
    </div>
  );
}
