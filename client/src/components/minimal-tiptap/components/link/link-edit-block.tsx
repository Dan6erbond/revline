import * as React from "react";

import { Button, Input, Switch, cn } from "@heroui/react";

export interface LinkEditorProps extends React.HTMLAttributes<HTMLFormElement> {
  defaultUrl?: string;
  defaultText?: string;
  defaultIsNewTab?: boolean;
  onSave: (url: string, text?: string, isNewTab?: boolean) => void;
}

export const LinkEditBlock = React.forwardRef<HTMLFormElement, LinkEditorProps>(
  ({ onSave, defaultIsNewTab, defaultUrl, defaultText, className }, ref) => {
    const formRef = React.useRef<HTMLFormElement>(null);
    const [url, setUrl] = React.useState(defaultUrl || "");
    const [text, setText] = React.useState(defaultText || "");
    const [isNewTab, setIsNewTab] = React.useState(defaultIsNewTab || false);

    const handleSave = React.useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        if (formRef.current) {
          const isValid = Array.from(
            formRef.current.querySelectorAll("input")
          ).every((input) => input.checkValidity());

          if (isValid) {
            onSave(url, text, isNewTab);
          } else {
            formRef.current.querySelectorAll("input").forEach((input) => {
              if (!input.checkValidity()) {
                input.reportValidity();
              }
            });
          }
        }
      },
      [onSave, url, text, isNewTab]
    );

    React.useImperativeHandle(ref, () => formRef.current as HTMLFormElement);

    return (
      <form ref={formRef} onSubmit={handleSave}>
        <div className={cn("flex flex-col gap-4", className)}>
          <Input
            type="url"
            required
            label="URL"
            labelPlacement="outside"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Input
            type="text"
            label="Display Text (optional)"
            labelPlacement="outside"
            placeholder="Enter display text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <Switch checked={isNewTab} onValueChange={setIsNewTab} size="sm">
            Open in New Tab
          </Switch>

          <div className="flex justify-end space-x-2">
            <Button type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    );
  }
);

LinkEditBlock.displayName = "LinkEditBlock";

export default LinkEditBlock;
