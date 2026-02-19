import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "students");

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function processAndSaveImage(
  buffer: Buffer,
  studentId: string,
  year?: number
): Promise<{ thumbnail: string; full: string }> {
  const id = uuid().slice(0, 8);
  const subDir = year
    ? path.join(UPLOAD_DIR, studentId, String(year))
    : path.join(UPLOAD_DIR, studentId);
  await ensureDir(subDir);

  const thumbFilename = `thumb_${id}.jpg`;
  const fullFilename = `full_${id}.jpg`;

  // Thumbnail: 400x400 square crop
  await sharp(buffer)
    .resize(400, 400, { fit: "cover", position: "centre" })
    .jpeg({ quality: 85 })
    .toFile(path.join(subDir, thumbFilename));

  // Full: max 800x1000
  await sharp(buffer)
    .resize(800, 1000, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toFile(path.join(subDir, fullFilename));

  const urlBase = year
    ? `/uploads/students/${studentId}/${year}`
    : `/uploads/students/${studentId}`;

  return {
    thumbnail: `${urlBase}/${thumbFilename}`,
    full: `${urlBase}/${fullFilename}`,
  };
}
