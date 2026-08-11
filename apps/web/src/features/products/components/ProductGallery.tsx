"use client";

import { useState } from "react";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
}

interface ProductGalleryProps {
  productName: string;
  images: ProductImage[];
}

export default function ProductGallery({
  productName,
  images,
}: ProductGalleryProps) {
  const [selectedId, setSelectedId] =
    useState(
      images[0]?.id ?? ""
    );

  const selectedImage =
    images.find(
      (image) =>
        image.id === selectedId
    ) ?? images[0];

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-400">
            Product Image
          </p>

          <p className="mt-2 text-sm text-gray-400">
            No product images available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Main Image */}

      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border bg-gray-50">
        <img
          src={selectedImage.url}
          alt={
            selectedImage.alt ||
            productName
          }
          className="h-full w-full object-contain"
        />
      </div>

      {/* Thumbnails */}

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image) => {
            const selected =
              image.id ===
              selectedId;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() =>
                  setSelectedId(
                    image.id
                  )
                }
                className={`aspect-square overflow-hidden rounded-lg border-2 bg-gray-50 transition ${
                  selected
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-500"
                }`}
              >
                <img
                  src={image.url}
                  alt={
                    image.alt ||
                    productName
                  }
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}