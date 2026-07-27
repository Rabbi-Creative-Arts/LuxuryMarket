"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function ProductGallery({
  images,
  alt,
  className = "",
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="overflow-hidden rounded-xl border">
        <Image
          src={selectedImage}
          alt={alt}
          width={700}
          height={700}
          className="h-[500px] w-full object-cover"
          priority
        />
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {images.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={`overflow-hidden rounded-lg border transition ${
              selectedImage === image
                ? "border-blue-600 ring-2 ring-blue-300"
                : "border-gray-200"
            }`}
          >
            <Image
              src={image}
              alt={alt}
              width={100}
              height={100}
              className="h-20 w-20 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}