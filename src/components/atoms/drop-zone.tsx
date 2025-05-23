import { type ReactNode, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import axios from "axios";
import apiClient from "@/api-client";

export default function DropZone({
  children,
  className,
  setOpenFile,
}: {
  children: ReactNode;
  className?: string;
  setOpenFile?: (state: () => void) => void;
}) {
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Send file to backend
        const response = await apiClient.post<{ message: string }>(
          "http://localhost:3100/api/shipments/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setUploadStatus(`Upload successful: ${response.data.message}`);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Error uploading file:", error.message);
          setUploadStatus(`Upload failed: ${error.message}`);
        } else {
          console.error("Unexpected error:", error);
          setUploadStatus("Upload failed. Please try again.");
        }
      }
    }
  }, []);

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    noKeyboard: true,
    noClick: true,
  });

  useEffect(() => {
    if (open) {
      setOpenFile?.(open);
    }
  }, [open, setOpenFile]);

  return (
    <Card {...getRootProps()} className={cn("h-full w-full", className)}>
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the files here ...</p> : children}
    </Card>
  );
}
