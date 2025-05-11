import * as React from "react";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  VariantProps,
  cn,
} from "@heroui/react";

import { ChevronDown } from "lucide-react";
import type { Editor } from "@tiptap/react";
import type { FormatAction } from "../types";
import { ToolbarButton } from "./toolbar-button";
import { getShortcutKey } from "../utils";
import type { toggleVariants } from "@/components/ui/toggle";

interface ToolbarSectionProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
  actions: FormatAction[];
  activeActions?: string[];
  mainActionCount?: number;
  dropdownIcon?: React.ReactNode;
  dropdownTooltip?: string;
  dropdownClassName?: string;
}

export const ToolbarSection: React.FC<ToolbarSectionProps> = ({
  editor,
  actions,
  activeActions = actions.map((action) => action.value),
  mainActionCount = 0,
  dropdownIcon,
  dropdownTooltip = "More options",
  dropdownClassName = "w-12",
  size,
  variant,
}) => {
  const { mainActions, dropdownActions } = React.useMemo(() => {
    const sortedActions = actions
      .filter((action) => activeActions.includes(action.value))
      .sort(
        (a, b) =>
          activeActions.indexOf(a.value) - activeActions.indexOf(b.value)
      );

    return {
      mainActions: sortedActions.slice(0, mainActionCount),
      dropdownActions: sortedActions.slice(mainActionCount),
    };
  }, [actions, activeActions, mainActionCount]);

  const renderToolbarButton = React.useCallback(
    (action: FormatAction) => (
      <ToolbarButton
        key={action.label}
        onClick={() => action.action(editor)}
        disabled={!action.canExecute(editor)}
        isActive={action.isActive(editor)}
        tooltip={`${action.label} ${action.shortcuts
          .map((s) => getShortcutKey(s).symbol)
          .join(" ")}`}
        aria-label={action.label}
        size={size}
        variant={variant}
      >
        {action.icon}
      </ToolbarButton>
    ),
    [editor, size, variant]
  );

  const handleAction = (key: React.Key) => {
    const action = dropdownActions.find((action) => action.label === key);

    if (action) {
      action.action(editor);
    }
  };

  const renderDropdownMenuItem = React.useCallback(
    (action: FormatAction) => (
      <DropdownItem
        key={action.label}
        className={cn("flex flex-row items-center justify-between gap-4", {
          "bg-accent": action.isActive(editor),
        })}
        aria-label={action.label}
        shortcut={action.shortcuts
          .map((key) => getShortcutKey(key).symbol)
          .join("+")}
      >
        <span className="grow">{action.label}</span>
      </DropdownItem>
    ),
    [editor]
  );

  const isDropdownActive = React.useMemo(
    () => dropdownActions.some((action) => action.isActive(editor)),
    [dropdownActions, editor]
  );

  return (
    <>
      {mainActions.map(renderToolbarButton)}
      {dropdownActions.length > 0 && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              aria-label={dropdownTooltip}
              className={cn(dropdownClassName)}
              size="sm"
              variant={isDropdownActive ? "flat" : "light"}
            >
              {dropdownIcon || <ChevronDown className="size-5" />}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            className="w-full"
            disabledKeys={dropdownActions
              .filter((a) => !activeActions.includes(a.value))
              .map((a) => a.label)}
            onAction={handleAction}
            selectionMode="multiple"
            selectedKeys={dropdownActions
              .filter((a) => a.isActive(editor))
              .map((a) => a.label)}
          >
            {dropdownActions.map(renderDropdownMenuItem)}
          </DropdownMenu>
        </Dropdown>
      )}
    </>
  );
};

export default ToolbarSection;
