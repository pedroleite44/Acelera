import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    let result;

    if (studentId) {
      result = await sql`
        SELECT 
          id,
          "studentId",
          "studentName",
          "createdAt"
        FROM "DailyLog"
        WHERE "studentId" = ${studentId}
        ORDER BY "createdAt" DESC
        LIMIT 50
      `;
    } else {
      result = await sql`
        SELECT 
          id,
          "studentId",
          "studentName",
          "createdAt"
        FROM "DailyLog"
        ORDER BY "createdAt" DESC
        LIMIT 50
      `;
    }

    return NextResponse.json(Array.isArray(result) ? result : []);

  } catch (error: any) {
    console.error("ERRO AO BUSCAR DAILY LOG:", error);
    return NextResponse.json([]);
  }
}