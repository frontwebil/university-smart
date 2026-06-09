import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const groups = await prisma.group.findMany({
    select: { id: true, name: true, department: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(groups);
}
