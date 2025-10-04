"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/api";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError(null);
    setSuccess(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      await uploadImage(file);
      setSuccess(true);
      setFile(null);
    } catch (err) {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        className="self-start hover:text-indigo-500 hover:cursor-pointer text-indigo-900 font-semibold py-2 px-4"
        onClick={() => router.back()}
      >
        &larr; Back
      </button>
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow border-2 border-dashed border-indigo-400 flex flex-col items-center justify-center mb-8 transition-colors duration-200 hover:border-indigo-600"
        style={{ minHeight: 220 }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload-input"
        />
        <label
          htmlFor="file-upload-input"
          className="w-full flex flex-col items-center cursor-pointer"
        >
          <span className="text-indigo-900 font-semibold text-lg mb-2">
            Drag & drop an image here
          </span>
          <span className="text-indigo-500 mb-4">
            or click to select a file
          </span>
          {file && (
            <span className="text-indigo-700 font-medium">
              Selected: {file.name}
            </span>
          )}
        </label>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Upload successful!</div>}
      <button
        className="w-full max-w-md bg-indigo-800 hover:bg-indigo-900 text-white font-semibold py-2 px-4 rounded shadow"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadPage;
