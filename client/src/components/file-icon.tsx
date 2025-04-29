import {
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  FileIcon as LucideFileIcon,
  VideoIcon,
} from "lucide-react";

function FileIcon(
  props:
    | { file: File; type?: never; name?: never }
    | { file?: never; contentType?: string; name?: string }
) {
  const fileType = props.file ? props.file.type : props.contentType;
  const fileName = props.file ? props.file.name : props.name;

  if (
    fileType?.includes("pdf") ||
    fileName?.endsWith(".pdf") ||
    fileType?.includes("word") ||
    fileName?.endsWith(".doc") ||
    fileName?.endsWith(".docx")
  ) {
    return <FileTextIcon className="size-4 opacity-60" />;
  } else if (
    fileType?.includes("zip") ||
    fileType?.includes("archive") ||
    fileName?.endsWith(".zip") ||
    fileName?.endsWith(".rar")
  ) {
    return <FileArchiveIcon className="size-4 opacity-60" />;
  } else if (
    fileType?.includes("excel") ||
    fileName?.endsWith(".xls") ||
    fileName?.endsWith(".xlsx")
  ) {
    return <FileSpreadsheetIcon className="size-4 opacity-60" />;
  } else if (fileType?.includes("video/")) {
    return <VideoIcon className="size-4 opacity-60" />;
  } else if (fileType?.includes("audio/")) {
    return <HeadphonesIcon className="size-4 opacity-60" />;
  } else if (fileType?.startsWith("image/")) {
    return <ImageIcon className="size-4 opacity-60" />;
  }

  return <LucideFileIcon className="size-4 opacity-60" />;
}

export default FileIcon;
