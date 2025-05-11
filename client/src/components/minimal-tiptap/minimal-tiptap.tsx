import "./styles/index.css";

import * as React from "react";

import type { Content, Editor } from "@tiptap/react";
import { Divider, cn } from "@heroui/react";

import { EditorContent } from "@tiptap/react";
import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu";
import { MeasuredContainer } from "./components/measured-container";
import { SectionFive } from "./components/section/five";
import { SectionFour } from "./components/section/four";
import { SectionOne } from "./components/section/one";
import { SectionThree } from "./components/section/three";
import { SectionTwo } from "./components/section/two";
import type { UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap";
import { useMinimalTiptapEditor } from "./hooks/use-minimal-tiptap";

export interface MinimalTiptapProps
  extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
  toolbarOptions?: Omit<React.ComponentProps<typeof Toolbar>, "editor">;
}

const Toolbar = ({
  editor,
  startContent,
  endContent,
}: {
  editor: Editor;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}) => (
  <div className="shrink-0 overflow-x-auto border-b border-content4 p-2">
    <div className="flex items-center gap-px">
      {startContent}

      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Divider orientation="vertical" className="mx-2 h-7" />

      <SectionTwo
        editor={editor}
        activeActions={[
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "code",
          "clearFormatting",
        ]}
        mainActionCount={3}
      />

      <Divider orientation="vertical" className="mx-2 h-7" />

      <SectionThree editor={editor} />

      <Divider orientation="vertical" className="mx-2 h-7" />

      <SectionFour
        editor={editor}
        activeActions={["orderedList", "bulletList"]}
        mainActionCount={0}
      />

      <Divider orientation="vertical" className="mx-2 h-7" />

      <SectionFive
        editor={editor}
        activeActions={["codeBlock", "blockquote", "horizontalRule"]}
        mainActionCount={0}
      />

      {endContent}
    </div>
  </div>
);

export const MinimalTiptapEditor = React.forwardRef<
  HTMLDivElement,
  MinimalTiptapProps
>(
  (
    {
      value,
      onChange,
      className,
      editorContentClassName,
      toolbarOptions,
      ...props
    },
    ref
  ) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      ...props,
    });

    if (!editor) {
      return null;
    }

    return (
      <MeasuredContainer
        as="div"
        name="editor"
        ref={ref}
        className={cn(
          "flex h-auto w-full flex-col rounded-md border border-content4 shadow-sm focus-within:border-primary/40",
          className
        )}
      >
        <Toolbar editor={editor} {...toolbarOptions} />
        <EditorContent
          editor={editor}
          className={cn(
            "minimal-tiptap-editor p-4 md:p-6 min-h-64 flex items-stretch",
            editorContentClassName
          )}
        />
        <LinkBubbleMenu editor={editor} />
      </MeasuredContainer>
    );
  }
);

MinimalTiptapEditor.displayName = "MinimalTiptapEditor";

export default MinimalTiptapEditor;
