import { AlertCircle, X } from "lucide-react";
import { Button, Image } from "@heroui/react";
import {
  ChangeEvent,
  DragEvent,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";

import FileIcon from "./file-icon";

export default function Dropzone({
  previewUrl,
  errors,
  accept = "",
  icon,
  label,
  ...props
}: {
  previewUrl?: string | null;
  errors?: string[];
  accept?: string;
  icon: ReactNode;
  label: ReactNode;
} & (
  | { multiple?: never; onChange: (file: File | null) => void }
  | { multiple: true; value: File[]; onChange: (files: File[]) => void }
)) {
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      // Don't process files if the input is disabled
      if (inputRef.current?.disabled) {
        return;
      }

      const acceptedFiles = [...e.dataTransfer.files].filter((file) => {
        const mimeTypeMatch = accept
          .split(",")
          .map((type) => type.trim())
          .some((type) => {
            if (type.startsWith(".")) {
              return file.name.toLowerCase().endsWith(type.toLowerCase());
            } else if (type.endsWith("/*")) {
              return file.type.startsWith(type.slice(0, -1));
            } else {
              return file.type === type;
            }
          });

        return mimeTypeMatch;
      });

      if (acceptedFiles.length === 0) return;

      if (props.multiple) {
        props.onChange([...acceptedFiles]);
      } else {
        props.onChange(acceptedFiles[0]);
      }
    },
    [props, accept]
  );

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        if (props.multiple) {
          props.onChange([...props.value, ...e.target.files]);
        } else {
          props.onChange(e.target.files[0]);
        }
      }
    },
    [props]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div
          role="button"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="cursor-pointer border-input hover:bg-secondary/20 data-[dragging=true]:bg-secondary/20 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            multiple={props.multiple}
            className="sr-only"
            aria-label="Upload file"
            ref={inputRef}
          />
          {previewUrl ? (
            <div className="absolute inset-0">
              <Image
                src={previewUrl}
                alt={"Uploaded image"}
                className="size-full object-cover object-center"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                {icon}
              </div>
              <p className="mb-1.5 text-sm font-medium">{label}</p>
            </div>
          )}
        </div>
        {previewUrl && (
          <div className="absolute top-4 right-4 z-20">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => {
                if (!props.multiple) props.onChange(null);
              }}
              aria-label="Remove image"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {props.multiple &&
        props.value.map((v, idx) => (
          <div
            key={`${v.name}-${idx}`}
            className="flex items-center gap-2 p-2 border border-content4 rounded-lg text-sm"
          >
            <FileIcon
              name={v.name}
              type={v.type}
              className="size-4 opacity-70 shrink-0"
            />
            <p className="shrink break-all">{v.name}</p>
            <Button
              isIconOnly
              startContent={<X className="size-6" />}
              color="danger"
              variant="light"
              className="ml-auto"
              size="sm"
            />
          </div>
        ))}

      {errors && errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircle className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
