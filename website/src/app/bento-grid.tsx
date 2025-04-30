import { Card, CardBody, CardHeader, cn } from "@heroui/react";

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(180px,1fr)] gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  icon,
  background,
}: {
  className?: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  background?: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "relative rounded-2xl border bg-primary-50/5 p-4 sm:p-6 lg:p-8 transition-colors hover:bg-secondary-300/10",
        className
      )}
      isBlurred
    >
      {background && (
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 z-0 opacity-20 h-3/4 overflow-hidden p-4"
          aria-hidden="true"
        >
          {background}
        </div>
      )}
      <CardHeader className="flex items-center gap-4">
        {icon && <div className="text-primary shrink-0">{icon}</div>}
        <h3 className="text-lg font-semibold text-foreground leading-snug">
          {title}
        </h3>
      </CardHeader>
      <CardBody>
        <p className="mt-2 text-sm text-content4-foreground leading-relaxed">
          {description}
        </p>
      </CardBody>
    </Card>
  );
}
