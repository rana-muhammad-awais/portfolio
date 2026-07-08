"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value: string | null;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "portfolio",
  label = "Upload Image",
  className = "",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Max size is 5MB.");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-medium text-content-dim">{label}</label>}
      
      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="relative">
        {value ? (
          <div className="relative rounded-xl overflow-hidden border border-subtle bg-[var(--input-bg)] group">
            {/* Show an image if it's an image URL, otherwise just show a link (e.g., for PDF CV) */}
            {value.match(/\.(jpeg|jpg|gif|png|webp|svg|heic)$/i) || value.includes("res.cloudinary.com") ? (
              <div className="relative h-48 w-full">
                <Image
                  src={value}
                  alt="Uploaded preview"
                  fill
                  className="object-cover"
                  unoptimized // Since it's from Cloudinary
                />
              </div>
            ) : (
              <div className="h-24 flex flex-col items-center justify-center p-4">
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-violet hover:underline truncate w-full text-center">
                  {value}
                </a>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                title="Change"
              >
                <Upload size={18} />
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                title="Remove"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-subtle rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-violet/50 hover:bg-violet/5 transition-colors ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {isUploading ? (
              <Loader2 size={32} className="text-violet animate-spin mb-3" />
            ) : (
              <ImageIcon size={32} className="text-content-dim mb-3" />
            )}
            <p className="text-sm font-medium text-content">
              {isUploading ? "Uploading..." : "Click to upload"}
            </p>
            <p className="text-xs text-content-dim mt-1">
              Supports Images & PDFs up to 5MB
            </p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf"
        />
      </div>
    </div>
  );
}
