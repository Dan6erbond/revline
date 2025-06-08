import { Chip, Input, InputProps } from "@heroui/react";
import React, { KeyboardEvent, useState } from "react";

import clsx from "clsx";

interface TagsInputProps extends Omit<InputProps, "value"> {
  onTagsChange?: (tags: string[]) => void;
  value: string[];
}

const TagsInput: React.FC<TagsInputProps> = ({
  value,
  onTagsChange,
  ...rest
}) => {
  const [tags, setTags] = React.useState<string[]>(value || []);
  const [inputValue, setInputValue] = useState<string>("");

  const [isInvalid, setIsInvalid] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab" || e.key === ",") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();

      if (trimmedValue && !tags.includes(trimmedValue)) {
        const newTags = [...tags, trimmedValue];
        setTags(newTags);
        onTagsChange?.(newTags);
        setInputValue("");
      }

      if (tags.includes(trimmedValue)) {
        setIsInvalid(true);
      } else {
        setIsInvalid(false);
      }
    }

    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      const updatedTags = Array.from(
        new Set(tags.map((t) => t.trim().toLowerCase()))
      );
      setTags(updatedTags);
      if (onTagsChange) onTagsChange(updatedTags);
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
    if (onTagsChange) onTagsChange(updatedTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={clsx(rest.className, "flex flex-wrap items-center gap-2")}>
      <Input
        className={clsx("flex-grow")}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Tab, Enter or ','"
        isClearable={false}
        variant="bordered"
        isInvalid={isInvalid}
        {...rest}
      />
      {tags.map((tag, index) => (
        <Chip
          key={index}
          className="flex p-2 mb-1"
          onClose={() => handleRemoveTag(index)}
        >
          {tag}
        </Chip>
      ))}
      {isInvalid && (
        <span className="text-danger text-sm">
          Duplicate tags are not allowed. Please remove duplicates.
        </span>
      )}
    </div>
  );
};

export default TagsInput;
