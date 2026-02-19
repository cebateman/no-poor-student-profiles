import sharp from "sharp";
import { v4 as uuid } from "uuid";
import { getSupabase, STORAGE_BUCKET } from "./supabase";

async function uploadToSupabase(
  buffer: Buffer,
  path: string
): Promise<string> {
  const supabase = getSupabase();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function processAndSaveImage(
  buffer: Buffer,
  studentId: string,
  year?: number
): Promise<{ thumbnail: string; full: string }> {
  const id = uuid().slice(0, 8);
  const basePath = year
    ? `${studentId}/${year}`
    : `${studentId}`;

  // Thumbnail: 400x400 square crop
  const thumbBuffer = await sharp(buffer)
    .resize(400, 400, { fit: "cover", position: "centre" })
    .jpeg({ quality: 85 })
    .toBuffer();

  // Full: max 800x1000
  const fullBuffer = await sharp(buffer)
    .resize(800, 1000, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();

  const [thumbnailUrl, fullUrl] = await Promise.all([
    uploadToSupabase(thumbBuffer, `${basePath}/thumb_${id}.jpg`),
    uploadToSupabase(fullBuffer, `${basePath}/full_${id}.jpg`),
  ]);

  return {
    thumbnail: thumbnailUrl,
    full: fullUrl,
  };
}
