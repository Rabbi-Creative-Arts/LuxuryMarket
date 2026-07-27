import { ReactNode } from "react";

interface FlexProps {
  children: ReactNode;
  className?: string;
  direction?: "row" | "col";
  justify?:
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly";
  align?: "start" | "center" | "end" | "stretch";
  wrap?: boolean;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
}

export default function Flex({
  children,
  className = "",
  direction = "row",
  justify = "start",
  align = "start",
  wrap = false,
  gap = 4,
}: FlexProps) {
  const directions = {
    row: "flex-row",
    col: "flex-col",
  };

  const justifies = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const aligns = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const gaps = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
    10: "gap-10",
    12: "gap-12",
  };

  return (
    <div
      className={`
        flex
        ${directions[direction]}
        ${justifies[justify]}
        ${aligns[align]}
        ${wrap ? "flex-wrap" : ""}
        ${gaps[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}