import * as React from "react";

import { cn } from "@/lib/utils";

type ChipProps = React.ComponentProps<"button"> & {
  active?: boolean;
};

export function Chip({ active = false, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border px-3 py-1 text-xs transition",
        active
          ? "border-rose-400/60 bg-rose-400/20 text-rose-100"
          : "border-zinc-600/80 text-zinc-300 hover:text-zinc-100",
        className,
      )}
      {...props}
    />
  );
}
