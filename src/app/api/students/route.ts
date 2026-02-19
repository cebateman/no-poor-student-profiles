import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enrichStudent } from "@/lib/computed";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const year = searchParams.get("year");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isPublic: true };

  if (status) {
    where.status = status;
  } else {
    // Default: show active students
    where.status = "active";
  }

  if (year) {
    where.enrollmentYear = parseInt(year);
  }

  const students = await prisma.student.findMany({
    where,
    include: {
      snapshots: {
        orderBy: { year: "desc" },
        take: 1,
      },
    },
    orderBy: { preferredName: "asc" },
  });

  const enriched = students.map(enrichStudent);

  return NextResponse.json(enriched);
}
