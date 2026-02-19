import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enrichStudent } from "@/lib/computed";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const student = await prisma.student.findFirst({
    where: { id: params.id, isPublic: true },
    include: {
      snapshots: {
        orderBy: { year: "asc" },
      },
      gallery: {
        orderBy: { year: "desc" },
      },
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json(enrichStudent(student));
}
