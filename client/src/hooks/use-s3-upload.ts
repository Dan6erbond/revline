import { useCallback, useState } from "react";

export function useS3Upload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(async (file: File, presignedUrl: string) => {
    setUploading(true);
    setError(null);

    try {
      const res = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      // Extract public URL from presigned URL (optional, depends on your S3 setup)
      const publicUrl = presignedUrl.split("?")[0];

      return { success: true, url: publicUrl };
    } catch (err) {
      setError(err as Error);
      return { success: false, error: err };
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error };
}
