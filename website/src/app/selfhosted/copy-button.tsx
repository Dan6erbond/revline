"use client";

import { Button, ButtonProps } from "@heroui/react";

import { ClipboardCopy } from "lucide-react";

export function CopyButton({ code, ...props }: { code: string } & ButtonProps) {
  return (
    <Button
      isIconOnly
      aria-label="Copy"
      variant="ghost"
      size="sm"
      onPress={() => navigator.clipboard.writeText(code)}
      {...props}
    >
      <ClipboardCopy className="w-4 h-4" />
    </Button>
  );
}
