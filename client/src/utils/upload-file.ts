export const uploadFile = (
  file: File,
  url: string,
  method: string,
  onProgress?: (progress: number) => void
) =>
  new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => onProgress?.((e.loaded / e.total) * 100);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        const status = xhr.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.responseText);
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error"));
    };

    xhr.open(method, url, true);
    xhr.send(file);
  });
