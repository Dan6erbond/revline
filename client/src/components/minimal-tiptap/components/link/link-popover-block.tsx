import * as React from "react";

import { Copy, ExternalLink, Unlink } from "lucide-react";

import { Divider } from "@heroui/react";
import { ToolbarButton } from "../toolbar-button";

interface LinkPopoverBlockProps {
  url: string;
  onClear: () => void;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const LinkPopoverBlock: React.FC<LinkPopoverBlockProps> = ({
  url,
  onClear,
  onEdit,
}) => {
  const [copyTitle, setCopyTitle] = React.useState<string>("Copy");

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopyTitle("Copied!");
          setTimeout(() => setCopyTitle("Copy"), 1000);
        })
        .catch(console.error);
    },
    [url]
  );

  const handleOpenLink = React.useCallback(() => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  return (
    <div className="flex h-10 overflow-hidden rounded bg-background p-2 shadow-lg">
      <div className="inline-flex items-center gap-1">
        <ToolbarButton
          tooltip="Edit link"
          onClick={onEdit}
          className="w-auto px-2"
        >
          Edit link
        </ToolbarButton>
        <Divider orientation="vertical" />
        <ToolbarButton
          tooltip="Open link in a new tab"
          onClick={handleOpenLink}
        >
          <ExternalLink className="size-4" />
        </ToolbarButton>
        <Divider orientation="vertical" />
        <ToolbarButton tooltip="Clear link" onClick={onClear}>
          <Unlink className="size-4" />
        </ToolbarButton>
        <Divider orientation="vertical" />
        <ToolbarButton tooltip={copyTitle} onClick={handleCopy}>
          <Copy className="size-4" />
        </ToolbarButton>
      </div>
    </div>
  );
};
