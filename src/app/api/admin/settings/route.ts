import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getSupabase, STORAGE_BUCKET } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  return NextResponse.json(settings || { id: "singleton", heroBackgroundUrl: null });
}

export async function PUT(request: NextRequest) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("heroBackground") as File | null;
  const removeBackground = formData.get("removeBackground") === "true";

  let heroBackgroundUrl: string | null | undefined;

  if (removeBackground) {
    heroBackgroundUrl = null;
  } else if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const processedBuffer = await sharp(buffer)
      .resize(1920, 1080, { fit: "cover", position: "centre" })
      .jpeg({ quality: 85 })
      .toBuffer();

    const id = uuid().slice(0, 8);
    const path = `site/hero_${id}.jpg`;

    const supabase = getSupabase();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, processedBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      return NextResponse.json(
        { error: `Failed to upload image: ${error.message}` },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    heroBackgroundUrl = data.publicUrl;
  }

  if (heroBackgroundUrl === undefined) {
    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { heroBackgroundUrl },
    create: { id: "singleton", heroBackgroundUrl },
  });

  return NextResponse.json(settings);
}
