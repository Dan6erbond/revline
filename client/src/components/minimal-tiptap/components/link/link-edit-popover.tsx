import * as React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  VariantProps,
} from "@heroui/react";

import type { Editor } from "@tiptap/react";
import { Link2 } from "lucide-react";
import { LinkEditBlock } from "./link-edit-block";
import { ToolbarButton } from "../toolbar-button";
import type { toggleVariants } from "@/components/ui/toggle";

interface LinkEditPopoverProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

const LinkEditPopover = ({ editor, size, variant }: LinkEditPopoverProps) => {
  const [open, setOpen] = React.useState(false);

  const { from, to } = editor.state.selection;
  const text = editor.state.doc.textBetween(from, to, " ");

  const onSetLink = React.useCallback(
    (url: string, text?: string, openInNewTab?: boolean) => {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .insertContent({
          type: "text",
          text: text || url,
          marks: [
            {
              type: "link",
              attrs: {
                href: url,
                target: openInNewTab ? "_blank" : "",
              },
            },
          ],
        })
        .setLink({ href: url })
        .run();

      editor.commands.enter();
    },
    [editor]
  );

  return (
    <Popover isOpen={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <ToolbarButton
          isActive={editor.isActive("link")}
          tooltip="Link"
          aria-label="Insert link"
          disabled={editor.isActive("codeBlock")}
          size={size}
          variant={variant}
        >
          <Link2 className="size-5" />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent className="w-full p-4">
        <LinkEditBlock onSave={onSetLink} defaultText={text} />
      </PopoverContent>
    </Popover>
  );
};

export { LinkEditPopover };
