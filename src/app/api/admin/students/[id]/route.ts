import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { enrichStudent } from "@/lib/computed";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      snapshots: { orderBy: { year: "asc" } },
      gallery: { orderBy: { year: "desc" } },
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json(enrichStudent(student));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const updateData: Record<string, unknown> = {};
  const allowedFields = [
    "fullName", "preferredName", "homeCommunity",
    "status", "isPublic", "graduationYear", "profilePhotoUrl",
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  if (body.dateOfBirth) {
    updateData.dateOfBirth = new Date(body.dateOfBirth);
  }
  if (body.enrollmentYear) {
    updateData.enrollmentYear = parseInt(body.enrollmentYear);
  }
  if (body.enrollmentGrade) {
    updateData.enrollmentGrade = parseInt(body.enrollmentGrade);
  }

  const student = await prisma.student.update({
    where: { id: params.id },
    data: updateData,
    include: {
      snapshots: { orderBy: { year: "asc" } },
      gallery: { orderBy: { year: "desc" } },
    },
  });

  return NextResponse.json(enrichStudent(student));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Soft delete: set status to withdrawn
  await prisma.student.update({
    where: { id: params.id },
    data: { status: "withdrawn", isPublic: false },
  });

  return NextResponse.json({ message: "Student withdrawn successfully" });
}
