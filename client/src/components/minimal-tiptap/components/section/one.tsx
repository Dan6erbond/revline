import * as React from "react";

import { ArrowBigUp, ChevronDown } from "lucide-react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  VariantProps,
  cn,
} from "@heroui/react";

import type { Editor } from "@tiptap/react";
import type { FormatAction } from "../../types";
import type { Level } from "@tiptap/extension-heading";
import { ToolbarButton } from "../toolbar-button";
import { getShortcutKey } from "../../utils";
import type { toggleVariants } from "@/components/ui/toggle";

interface TextStyle
  extends Omit<
    FormatAction,
    "value" | "icon" | "action" | "isActive" | "canExecute"
  > {
  element: keyof React.JSX.IntrinsicElements;
  level?: Level;
  className: string;
}

const formatActions: TextStyle[] = [
  {
    label: "Normal Text",
    element: "span",
    className: "grow",
    shortcuts: ["mod", "alt", "0"],
  },
  {
    label: "Heading 1",
    element: "h1",
    level: 1,
    className: "m-0 grow text-3xl font-extrabold",
    shortcuts: ["mod", "alt", "1"],
  },
  {
    label: "Heading 2",
    element: "h2",
    level: 2,
    className: "m-0 grow text-xl font-bold",
    shortcuts: ["mod", "alt", "2"],
  },
  {
    label: "Heading 3",
    element: "h3",
    level: 3,
    className: "m-0 grow text-lg font-semibold",
    shortcuts: ["mod", "alt", "3"],
  },
  {
    label: "Heading 4",
    element: "h4",
    level: 4,
    className: "m-0 grow text-base font-semibold",
    shortcuts: ["mod", "alt", "4"],
  },
  {
    label: "Heading 5",
    element: "h5",
    level: 5,
    className: "m-0 grow text-sm font-normal",
    shortcuts: ["mod", "alt", "5"],
  },
  {
    label: "Heading 6",
    element: "h6",
    level: 6,
    className: "m-0 grow text-sm font-normal",
    shortcuts: ["mod", "alt", "6"],
  },
];

interface SectionOneProps {
  editor: Editor;
  activeLevels?: Level[];
}

export const SectionOne: React.FC<SectionOneProps> = React.memo(
  ({ editor, activeLevels = [1, 2, 3, 4, 5, 6] }) => {
    const filteredActions = React.useMemo(
      () =>
        formatActions.filter(
          (action) => !action.level || activeLevels.includes(action.level)
        ),
      [activeLevels]
    );

    const handleStyleChange = React.useCallback(
      (level?: Level) => {
        if (level) {
          editor.chain().focus().toggleHeading({ level }).run();
        } else {
          editor.chain().focus().setParagraph().run();
        }
      },
      [editor]
    );

    const handleAction = (key: React.Key) => {
      const action = filteredActions.find((item) => item.label === key);

      if (action) {
        handleStyleChange(action.level);
      }
    };

    const renderMenuItem = React.useCallback(
      ({ label, element: Element, level, className, shortcuts }: TextStyle) => (
        <DropdownItem
          key={label}
          className={cn("flex flex-row items-center justify-between gap-4", {
            "bg-accent": level
              ? editor.isActive("heading", { level })
              : editor.isActive("paragraph"),
          })}
          aria-label={label}
          shortcut={shortcuts
            .map((key) => getShortcutKey(key).symbol)
            .join("+")}
        >
          <Element className={className}>{label}</Element>
        </DropdownItem>
      ),
      [editor, handleStyleChange]
    );

    return (
      <Dropdown>
        <DropdownTrigger>
          <Button
            aria-label="Text styles"
            className="w-12"
            disabled={editor.isActive("codeBlock")}
            size="sm"
            variant={editor.isActive("heading") ? "flat" : "light"}
          >
            <ArrowBigUp className="size-5" />
            <ChevronDown className="size-5" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          className="w-full"
          onAction={handleAction}
          selectionMode="single"
          selectedKeys={filteredActions
            .filter(({ level }) =>
              level
                ? editor.isActive("heading", { level })
                : editor.isActive("paragraph")
            )
            .map((a) => a.label)}
        >
          {filteredActions.map(renderMenuItem)}
        </DropdownMenu>
      </Dropdown>
    );
  }
);

SectionOne.displayName = "SectionOne";

export default SectionOne;
