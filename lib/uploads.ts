import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import crypto from "node:crypto"

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
}

function normalizeFolder(folder: string): string {
  return folder
    .split("/")
    .map((part) => part.replace(/[^a-zA-Z0-9_-]/g, ""))
    .filter(Boolean)
    .join("/")
}

function extensionFromFile(file: File): string {
  if (IMAGE_EXTENSIONS[file.type]) {
    return IMAGE_EXTENSIONS[file.type]
  }

  const fileName = typeof file.name === "string" ? file.name : ""
  const match = fileName.match(/\.[a-zA-Z0-9]+$/)
  return match ? match[0].toLowerCase() : ".jpg"
}

export async function saveImageToPublic(
  file: File,
  folder: string,
  maxSizeBytes = 8 * 1024 * 1024
) {
  if (!(file instanceof File) || file.size <= 0) {
    throw new Error("No image file was provided.")
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.")
  }
  if (file.size > maxSizeBytes) {
    throw new Error("Image is too large. Maximum size is 8MB.")
  }

  const safeFolder = normalizeFolder(folder)
  if (!safeFolder) {
    throw new Error("Invalid upload folder.")
  }

  const extension = extensionFromFile(file)
  const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`
  const relativePath = path.posix.join("uploads", safeFolder, filename)
  const absoluteDir = path.join(process.cwd(), "public", "uploads", safeFolder)
  const absolutePath = path.join(absoluteDir, filename)

  await mkdir(absoluteDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(absolutePath, buffer)

  return {
    url: `/${relativePath}`,
    fileName: file.name || filename,
    mimeType: file.type,
    size: file.size,
  }
}
