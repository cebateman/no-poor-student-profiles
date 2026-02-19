import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { processAndSaveImage } from "@/lib/images";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("photo") as File;
  const year = parseInt(formData.get("year") as string) || new Date().getFullYear();
  const caption = formData.get("caption") as string | null;
  const isFeatured = formData.get("isFeatured") === "true";

  if (!file) {
    return NextResponse.json({ error: "No photo provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { full } = await processAndSaveImage(buffer, params.id, year);

  const entry = await prisma.mediaGallery.create({
    data: {
      studentId: params.id,
      year,
      photoUrl: full,
      caption: caption || null,
      isFeatured,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gallery = await prisma.mediaGallery.findMany({
    where: { studentId: params.id },
    orderBy: { year: "desc" },
  });

  return NextResponse.json(gallery);
}
