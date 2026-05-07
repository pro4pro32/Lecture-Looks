import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("card-shell", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.ComponentProps<"header">) {
  return <header className={cn("space-y-2 p-4 sm:p-5", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-4 pt-0 sm:p-5 sm:pt-0", className)} {...props} />;
}
