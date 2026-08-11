import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class UploadService {
  static async uploadProductImage(
    file: File
  ): Promise<UploadResult> {
    if (!file) {
      return {
        success: false,
        error: "No file uploaded.",
      };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error:
          "Unsupported image type. Only JPG, JPEG, PNG, and WebP are allowed.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Maximum file size is 5MB.",
      };
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const extension =
      path.extname(file.name).toLowerCase() || ".jpg";

    const filename = `${randomUUID()}${extension}`;

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products"
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const filepath = path.join(
      uploadDirectory,
      filename
    );

    await writeFile(filepath, buffer);

    return {
      success: true,
      url: `/uploads/products/${filename}`,
    };
  }
}