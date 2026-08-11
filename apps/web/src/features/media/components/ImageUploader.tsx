"use client";

import { useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { deleteProductImage } from "@/features/products/actions/delete-product-image";

import { reorderProductImages } from "@/features/products/actions/reorder-product-images";

import { uploadProductImage } from "@/features/products/actions/upload-product-image";

import type { UploadImage } from "../types/image";

interface ExistingImage {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
}

interface Props {
  productId: string;

  images: UploadImage[];

  setImages: React.Dispatch<
    React.SetStateAction<UploadImage[]>
  >;

  initialImages?: ExistingImage[];
}

export default function ImageUploader({
  productId,
  images,
  setImages,
  initialImages = [],
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const router = useRouter();

  const [uploading, setUploading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [reordering, setReordering] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // ============================================
  // Existing images sorted by saved order
  // ============================================

  const orderedImages = [
    ...initialImages,
  ].sort(
    (a, b) =>
      a.sortOrder - b.sortOrder
  );

  // ============================================
  // Upload
  // ============================================

  async function handleFiles(
    files: FileList | null
  ) {
    if (!files) return;

    setUploading(true);
    setMessage("");

    try {
      for (const file of Array.from(files)) {
        const preview =
          URL.createObjectURL(file);

        const newImage: UploadImage = {
          id: crypto.randomUUID(),
          file,
          preview,
          name: file.name,
          size: file.size,
          type: file.type,
        };

        setImages((prev) => [
          ...prev,
          newImage,
        ]);

        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );

        const result =
          await uploadProductImage(
            productId,
            formData
          );

        if (!result.success) {
          setMessage(
            result.message
          );

          setImages((prev) =>
            prev.filter(
              (image) =>
                image.id !==
                newImage.id
            )
          );

          URL.revokeObjectURL(
            preview
          );

          continue;
        }

        setMessage(
          `${file.name} uploaded successfully.`
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      setMessage(
        "An unexpected error occurred while uploading the image."
      );
    } finally {
      setUploading(false);
    }
  }

  // ============================================
  // Reorder
  // ============================================

  async function saveOrder(
    nextImages: ExistingImage[]
  ) {
    setReordering(true);
    setMessage("");

    try {
      const imageIds =
        nextImages.map(
          (image) => image.id
        );

      const result =
        await reorderProductImages(
          productId,
          imageIds
        );

      if (!result.success) {
        setMessage(
          result.message ??
            "Unable to update image order."
        );

        return;
      }

      setMessage(
        "Image order updated."
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Image reorder error:",
        error
      );

      setMessage(
        "Unable to update image order."
      );
    } finally {
      setReordering(false);
    }
  }

  // ============================================
  // Set Primary
  // ============================================

  async function setPrimary(
    imageId: string
  ) {
    const selected =
      orderedImages.find(
        (image) =>
          image.id === imageId
      );

    if (!selected) return;

    const remaining =
      orderedImages.filter(
        (image) =>
          image.id !== imageId
      );

    await saveOrder([
      selected,
      ...remaining,
    ]);
  }

  // ============================================
  // Move Up
  // ============================================

  async function moveUp(
    index: number
  ) {
    if (index <= 0) return;

    const next = [
      ...orderedImages,
    ];

    [
      next[index - 1],
      next[index],
    ] = [
      next[index],
      next[index - 1],
    ];

    await saveOrder(next);
  }

  // ============================================
  // Move Down
  // ============================================

  async function moveDown(
    index: number
  ) {
    if (
      index >=
      orderedImages.length - 1
    ) {
      return;
    }

    const next = [
      ...orderedImages,
    ];

    [
      next[index],
      next[index + 1],
    ] = [
      next[index + 1],
      next[index],
    ];

    await saveOrder(next);
  }

  // ============================================
  // Delete
  // ============================================

  async function handleDeleteImage(
    imageId: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this image?"
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(imageId);
    setMessage("");

    try {
      const result =
        await deleteProductImage(
          imageId
        );

      if (!result.success) {
        setMessage(
          result.message ??
            "Failed to delete image."
        );

        return;
      }

      setMessage(
        "Image deleted successfully."
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Image deletion error:",
        error
      );

      setMessage(
        "An unexpected error occurred while deleting the image."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">

      {/* Upload Area */}

      <div
        onClick={() => {
          if (
            !uploading &&
            !reordering
          ) {
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();

          if (
            !uploading &&
            !reordering
          ) {
            handleFiles(
              e.dataTransfer.files
            );
          }
        }}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition ${
          uploading ||
          reordering
            ? "cursor-wait border-gray-200 bg-gray-50"
            : "border-gray-300 hover:border-black"
        }`}
      >
        {uploading ? (
          <>
            <p className="font-medium">
              Uploading image...
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Please wait.
            </p>
          </>
        ) : (
          <>
            <p className="font-medium">
              Drag & Drop Images
            </p>

            <p className="text-sm text-gray-500">
              or click here to upload
            </p>
          </>
        )}

        <input
          ref={inputRef}
          hidden
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          type="file"
          disabled={
            uploading ||
            reordering
          }
          onChange={(e) => {
            handleFiles(
              e.target.files
            );

            e.target.value = "";
          }}
        />
      </div>

      {/* Message */}

      {message && (
        <p className="text-sm text-gray-600">
          {message}
        </p>
      )}

      {/* Existing Images */}

      {orderedImages.length > 0 && (
        <div>
          <div className="mb-4">
            <h3 className="font-medium">
              Product Images
            </h3>

            <p className="text-sm text-gray-500">
              The first image is the
              primary product image.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {orderedImages.map(
              (image, index) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-xl border bg-white"
                >
                  {/* Image */}

                  <div className="relative">
                    <img
                      src={image.url}
                      alt={
                        image.alt ?? ""
                      }
                      className="aspect-square w-full object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                        ⭐ Primary
                      </span>
                    )}
                  </div>

                  {/* Controls */}

                  <div className="space-y-2 p-3">

                    <p className="truncate text-xs font-medium">
                      Image {index + 1}
                    </p>

                    <div className="grid grid-cols-2 gap-2">

                      <button
                        type="button"
                        disabled={
                          reordering ||
                          index === 0
                        }
                        onClick={() =>
                          moveUp(index)
                        }
                        className="rounded border px-2 py-2 text-xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↑ Up
                      </button>

                      <button
                        type="button"
                        disabled={
                          reordering ||
                          index ===
                            orderedImages.length -
                              1
                        }
                        onClick={() =>
                          moveDown(index)
                        }
                        className="rounded border px-2 py-2 text-xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↓ Down
                      </button>

                    </div>

                    {index !== 0 && (
                      <button
                        type="button"
                        disabled={
                          reordering
                        }
                        onClick={() =>
                          setPrimary(
                            image.id
                          )
                        }
                        className="w-full rounded bg-black px-3 py-2 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        Set as Primary
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={
                        deletingId ===
                        image.id
                      }
                      onClick={() =>
                        handleDeleteImage(
                          image.id
                        )
                      }
                      className="w-full rounded bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingId ===
                      image.id
                        ? "Deleting..."
                        : "Delete Image"}
                    </button>

                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Newly Uploaded */}

      {images.length > 0 && (
        <div>
          <h3 className="mb-3 font-medium">
            Newly Uploaded
          </h3>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {images.map(
              (image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-lg border bg-white"
                >
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="aspect-square w-full object-cover"
                  />

                  <div className="p-2">
                    <p className="truncate text-xs font-medium">
                      {image.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {(
                        image.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

    </div>
  );
}