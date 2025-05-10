import * as React from "react";

import { Tooltip, TooltipProps, cn } from "@heroui/react";

import { Toggle } from "@/components/ui/toggle";

interface ToolbarButtonProps
  extends React.ComponentPropsWithoutRef<typeof Toggle> {
  isActive?: boolean;
  tooltip?: string;
  tooltipOptions?: TooltipProps;
  children?: React.ReactNode;
  className?: string;
}

export const ToolbarButton = React.forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps
>(
  (
    { isActive, children, tooltip, className, tooltipOptions, ...props },
    ref
  ) => {
    const toggleButton = (
      <Toggle
        size="sm"
        ref={ref}
        className={cn("size-8 p-0", { "bg-secondary": isActive }, className)}
        {...props}
      >
        {children}
      </Toggle>
    );

    if (!tooltip) {
      return toggleButton;
    }

    return (
      <Tooltip
        content={
          <div className="flex flex-col items-center text-center">
            {tooltip}
          </div>
        }
        {...tooltipOptions}
      >
        {toggleButton}
      </Tooltip>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";

export default ToolbarButton;
