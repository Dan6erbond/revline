import { Card, CardProps, cn } from "@heroui/react";

import { LinkProps } from "next/link";
import { forwardRef } from "react";

export const KanbanCard = forwardRef<
  HTMLDivElement,
  CardProps & Omit<Partial<LinkProps>, keyof CardProps>
>(({ className, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        "shadow-xl hover:shadow-2xl transition-shadow w-80 bg-content1 rounded-lg overflow-visible",
        className
      )}
      {...props}
    />
  );
});

KanbanCard.displayName = "KanbanCard";
