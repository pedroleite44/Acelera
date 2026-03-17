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
          d.id,
          d."studentId",
          s.name as "studentName",
          d."createdAt"
        FROM "DailyLog" d
        LEFT JOIN "Student" s ON s.id = d."studentId"
        WHERE d."studentId" = ${studentId}
        ORDER BY d."createdAt" DESC
        LIMIT 50
      `;
    } else {
      result = await sql`
        SELECT 
          d.id,
          d."studentId",
          s.name as "studentName",
          d."createdAt"
        FROM "DailyLog" d
        LEFT JOIN "Student" s ON s.id = d."studentId"
        ORDER BY d."createdAt" DESC
        LIMIT 50
      `;
    }

    return NextResponse.json(result || []);

  } catch (error) {
    console.error("ERRO AO BUSCAR LOGS:", error);
    return NextResponse.json([]);
  }
}