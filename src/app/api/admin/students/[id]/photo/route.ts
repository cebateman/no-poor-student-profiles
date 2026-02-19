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

  if (!file) {
    return NextResponse.json({ error: "No photo provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { thumbnail } = await processAndSaveImage(buffer, params.id);

  const student = await prisma.student.update({
    where: { id: params.id },
    data: { profilePhotoUrl: thumbnail },
  });

  return NextResponse.json({
    profilePhotoUrl: student.profilePhotoUrl,
    message: "Photo uploaded successfully",
  });
}
