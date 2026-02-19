import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const student = await prisma.student.findFirst({
    where: { id: params.id, isPublic: true },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const snapshots = await prisma.annualSnapshot.findMany({
    where: { studentId: params.id },
    orderBy: { year: "asc" },
  });

  const parsed = snapshots.map((s) => ({
    ...s,
    extraData: s.extraData ? JSON.parse(s.extraData) : null,
    // Hide internal academic notes from public view
    academicNotes: undefined,
  }));

  return NextResponse.json(parsed);
}
