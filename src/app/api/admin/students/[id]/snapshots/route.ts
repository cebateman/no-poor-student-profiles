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
  const year = parseInt(formData.get("year") as string);
  const gradeAtTime = parseInt(formData.get("gradeAtTime") as string);
  const storyText = formData.get("storyText") as string | null;
  const storyLanguage = (formData.get("storyLanguage") as string) || "Portuguese";
  const storyTranslation = formData.get("storyTranslation") as string | null;
  const dreamCareer = formData.get("dreamCareer") as string | null;
  const favoriteSubject = formData.get("favoriteSubject") as string | null;
  const academicNotes = formData.get("academicNotes") as string | null;
  const extraDataStr = formData.get("extraData") as string | null;
  const videoUrl = formData.get("videoUrl") as string | null;
  const photo = formData.get("photo") as File | null;

  if (!year || !gradeAtTime) {
    return NextResponse.json(
      { error: "Year and gradeAtTime are required" },
      { status: 400 }
    );
  }

  let photoUrl: string | null = null;
  if (photo) {
    const buffer = Buffer.from(await photo.arrayBuffer());
    const result = await processAndSaveImage(buffer, params.id, year);
    photoUrl = result.full;
  }

  const snapshot = await prisma.annualSnapshot.create({
    data: {
      studentId: params.id,
      year,
      gradeAtTime,
      photoUrl,
      videoUrl: videoUrl || null,
      storyText: storyText || null,
      storyLanguage,
      storyTranslation: storyTranslation || null,
      dreamCareer: dreamCareer || null,
      favoriteSubject: favoriteSubject || null,
      academicNotes: academicNotes || null,
      extraData: extraDataStr || null,
    },
  });

  return NextResponse.json(snapshot, { status: 201 });
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

  const snapshots = await prisma.annualSnapshot.findMany({
    where: { studentId: params.id },
    orderBy: { year: "asc" },
  });

  return NextResponse.json(
    snapshots.map((s) => ({
      ...s,
      extraData: s.extraData ? JSON.parse(s.extraData) : null,
    }))
  );
}
