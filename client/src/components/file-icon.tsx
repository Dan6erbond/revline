import {
  File,
  FileArchive,
  FileSpreadsheet,
  FileText,
  Headphones,
  Image,
  LucideProps,
  Video,
} from "lucide-react";

function FileIcon(
  props: LucideProps &
    (
      | { file: File; type?: never; name?: never }
      | { file?: never; contentType?: string; name?: string }
    )
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
    return <FileText {...props} />;
  } else if (
    fileType?.includes("zip") ||
    fileType?.includes("archive") ||
    fileName?.endsWith(".zip") ||
    fileName?.endsWith(".rar")
  ) {
    return <FileArchive {...props} />;
  } else if (
    fileType?.includes("excel") ||
    fileName?.endsWith(".xls") ||
    fileName?.endsWith(".xlsx")
  ) {
    return <FileSpreadsheet {...props} />;
  } else if (fileType?.includes("video/")) {
    return <Video {...props} />;
  } else if (fileType?.includes("audio/")) {
    return <Headphones {...props} />;
  } else if (fileType?.startsWith("image/")) {
    return <Image {...props} />;
  }

  return <File {...props} />;
}

export default FileIcon;
