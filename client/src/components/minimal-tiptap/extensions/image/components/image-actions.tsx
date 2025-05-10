import * as React from "react";

import {
  Button,
  ButtonProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
  cn,
} from "@heroui/react";
import { Copy, Download, Ellipsis, Expand, Link2 } from "lucide-react";

interface ImageActionsProps {
  shouldMerge?: boolean;
  isLink?: boolean;
  onView?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  onCopyLink?: () => void;
}

interface ActionButtonProps extends ButtonProps {
  icon: React.ReactNode;
  tooltip: string;
}

export const ActionWrapper = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn(
          "absolute right-3 top-3 flex flex-row rounded px-0.5 opacity-0 group-hover/node-image:opacity-100",
          "border-[0.5px] bg-[var(--mt-bg-secondary)] [backdrop-filter:saturate(1.8)_blur(20px)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  )
);

ActionWrapper.displayName = "ActionWrapper";

export const ActionButton = React.memo(
  React.forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ icon, tooltip, className, ...props }, ref) => (
      <Tooltip content={tooltip}>
        <Button
          ref={ref}
          variant="ghost"
          className={cn(
            "relative flex h-7 w-7 flex-row rounded-none p-0 text-muted-foreground hover:text-foreground",
            "bg-transparent hover:bg-transparent",
            className
          )}
          {...props}
        >
          {icon}
        </Button>
      </Tooltip>
    )
  )
);

ActionButton.displayName = "ActionButton";

type ActionKey = "onView" | "onDownload" | "onCopy" | "onCopyLink";

const ActionItems: Array<{
  key: ActionKey;
  icon: React.ReactNode;
  tooltip: string;
  isLink?: boolean;
}> = [
  {
    key: "onView",
    icon: <Expand className="size-4" />,
    tooltip: "View image",
  },
  {
    key: "onDownload",
    icon: <Download className="size-4" />,
    tooltip: "Download image",
  },
  {
    key: "onCopy",
    icon: <Copy className="size-4" />,
    tooltip: "Copy image to clipboard",
  },
  {
    key: "onCopyLink",
    icon: <Link2 className="size-4" />,
    tooltip: "Copy image link",
    isLink: true,
  },
];

export const ImageActions: React.FC<ImageActionsProps> = React.memo(
  ({ shouldMerge = false, isLink = false, ...actions }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleAction = React.useCallback(
      (e: React.MouseEvent, action: (() => void) | undefined) => {
        e.preventDefault();
        e.stopPropagation();
        action?.();
      },
      []
    );

    const filteredActions = React.useMemo(
      () => ActionItems.filter((item) => isLink || !item.isLink),
      [isLink]
    );

    return (
      <ActionWrapper className={cn({ "opacity-100": isOpen })}>
        {shouldMerge ? (
          <Dropdown onOpenChange={setIsOpen}>
            <DropdownTrigger>
              <ActionButton
                icon={<Ellipsis className="size-4" />}
                tooltip="Open menu"
                onClick={(e) => e.preventDefault()}
              />
            </DropdownTrigger>
            <DropdownMenu
              className="w-56"
              onAction={(key) => actions[key as keyof typeof actions]?.()}
            >
              {filteredActions.map(({ key, icon, tooltip }) => (
                <DropdownItem key={key}>
                  <div className="flex flex-row items-center gap-2">
                    {icon}
                    <span>{tooltip}</span>
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        ) : (
          filteredActions.map(({ key, icon, tooltip }) => (
            <ActionButton
              key={key}
              icon={icon}
              tooltip={tooltip}
              onClick={(e) => handleAction(e, actions[key])}
            />
          ))
        )}
      </ActionWrapper>
    );
  }
);

ImageActions.displayName = "ImageActions";
