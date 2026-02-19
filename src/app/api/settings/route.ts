import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  return NextResponse.json(settings || { heroBackgroundUrl: null });
}
